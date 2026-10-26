/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0051:
 * 1. Habilitar oauth2 na coleção users.
 *    No PocketBase, providers com clientId/clientSecret vazios são rejeitados na validação.
 *    Portanto, ativamos usersCol.oauth2.enabled = true, permitindo que os provedores reais
 *    sejam inseridos pelo administrador ou quando as credenciais forem cadastradas.
 * 2. Adicionar campos 'referral_code' (text) e 'referred_by' (relation users) na coleção 'users'.
 * 3. Criar coleção 'daily_generation_usage' (contagem DIÁRIA NO SERVIDOR de gerações: 6 virais / 6 vendas por dia no modo grátis).
 * 4. Criar coleção 'referral_credits' (créditos concedidos por indicação de 1 mês pago, 20 prompts válidos por 30 dias).
 * 5. Atualizar RLS de subscriptions para permitir criação de plano gratuito pelo próprio usuário autenticado.
 */
migrate(
  (app) => {
    // -------------------------------------------------------------
    // 1. OAuth2 no users (_pb_users_auth_) + campos de indicação (referral_code, referred_by)
    // -------------------------------------------------------------
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      if (usersCol.oauth2) {
        usersCol.oauth2.enabled = true
      }
    } catch (oauthErr) {
      console.warn('[migration 0051] Aviso ao configurar oauth2:', oauthErr)
    }

    // Adicionar campos de indicação em users
    if (!usersCol.fields.getByName('referral_code')) {
      usersCol.fields.add(
        new TextField({
          name: 'referral_code',
          required: false,
        }),
      )
    }

    if (!usersCol.fields.getByName('referred_by')) {
      usersCol.fields.add(
        new RelationField({
          name: 'referred_by',
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          required: false,
          cascadeDelete: false,
        }),
      )
    }

    // Proteger campo is_admin no updateRule, permitindo que o usuário edite seus dados normais
    usersCol.updateRule = 'id = @request.auth.id && @request.body.is_admin:changed = false'

    app.save(usersCol)

    // Preencher referral_code para usuários existentes caso não tenham
    try {
      const allUsers = app.findRecordsByFilter('_pb_users_auth_', '', '', 500, 0)
      for (let i = 0; i < allUsers.length; i++) {
        const u = allUsers[i]
        if (!u.getString('referral_code')) {
          const generatedCode = u.id.slice(0, 8).toUpperCase()
          u.set('referral_code', generatedCode)
          app.save(u)
        }
      }
    } catch (_) {}

    // -------------------------------------------------------------
    // 2. Subscriptions: permitir ao próprio usuário criar/reativar seu plano free
    // (RLS create: @request.auth.id != '' && user = @request.auth.id && @request.body.plan = 'free')
    // -------------------------------------------------------------
    const subsCol = app.findCollectionByNameOrId('subscriptions')
    subsCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    subsCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    subsCol.createRule =
      "@request.auth.id != '' && user = @request.auth.id && @request.body.plan = 'free'"
    subsCol.updateRule =
      "@request.auth.id != '' && user = @request.auth.id && @request.body.plan = 'free'"
    subsCol.deleteRule = null
    app.save(subsCol)

    // -------------------------------------------------------------
    // 3. Coleção `daily_generation_usage` (contagem DIÁRIA no servidor de prompts gerados)
    // - user: relation users
    // - tab: select ('virais' | 'vendas')
    // - date: text (YYYY-MM-DD em UTC/BRT)
    // - count: number
    // -------------------------------------------------------------
    let dailyCol
    try {
      dailyCol = app.findCollectionByNameOrId('daily_generation_usage')
    } catch (_) {
      dailyCol = null
    }

    if (!dailyCol) {
      const newDaily = new Collection({
        name: 'daily_generation_usage',
        type: 'base',
        listRule:
          "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)",
        viewRule:
          "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)",
        createRule: null, // Escrita exclusiva do servidor / hook
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'user',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            required: true,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'tab',
            type: 'select',
            required: true,
            values: ['virais', 'vendas'],
            maxSelect: 1,
          },
          {
            name: 'date',
            type: 'text',
            required: true,
          },
          {
            name: 'count',
            type: 'number',
            required: true,
          },
          {
            name: 'created',
            type: 'autodate',
            onCreate: true,
            onUpdate: false,
          },
          {
            name: 'updated',
            type: 'autodate',
            onCreate: true,
            onUpdate: true,
          },
        ],
        indexes: [
          'CREATE UNIQUE INDEX idx_daily_usage_user_tab_date ON daily_generation_usage (user, tab, date)',
          'CREATE INDEX idx_daily_usage_user_date ON daily_generation_usage (user, date)',
        ],
      })
      app.save(newDaily)
    }

    // -------------------------------------------------------------
    // 4. Coleção `referral_credits` (Programa de Indicação / Afiliados)
    // - referrer: relation users (quem indicou)
    // - referred_user: relation users (o amigo que assinou)
    // - credits_granted: number (20)
    // - credits_remaining: number (começa em 20 e expira em 30 dias)
    // - expires_at: date (start + 30 dias)
    // - status: select ('active' | 'consumed' | 'expired')
    // -------------------------------------------------------------
    let refCol
    try {
      refCol = app.findCollectionByNameOrId('referral_credits')
    } catch (_) {
      refCol = null
    }

    if (!refCol) {
      const newRef = new Collection({
        name: 'referral_credits',
        type: 'base',
        listRule:
          "@request.auth.id != '' && (referrer = @request.auth.id || @request.auth.is_admin = true)",
        viewRule:
          "@request.auth.id != '' && (referrer = @request.auth.id || @request.auth.is_admin = true)",
        createRule: null, // Escrita estrita no servidor (via webhook MP)
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'referrer',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            required: true,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'referred_user',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            required: true,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'credits_granted',
            type: 'number',
            required: true,
          },
          {
            name: 'credits_remaining',
            type: 'number',
            required: true,
          },
          {
            name: 'expires_at',
            type: 'date',
            required: true,
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['active', 'consumed', 'expired'],
            maxSelect: 1,
          },
          {
            name: 'created',
            type: 'autodate',
            onCreate: true,
            onUpdate: false,
          },
          {
            name: 'updated',
            type: 'autodate',
            onCreate: true,
            onUpdate: true,
          },
        ],
        indexes: [
          'CREATE INDEX idx_ref_credits_referrer_status ON referral_credits (referrer, status)',
          'CREATE INDEX idx_ref_credits_referrer_expires ON referral_credits (referrer, expires_at)',
          'CREATE UNIQUE INDEX idx_ref_credits_pair ON referral_credits (referrer, referred_user)',
        ],
      })
      app.save(newRef)
    }
  },
  (app) => {
    // Reversão
    try {
      const d = app.findCollectionByNameOrId('daily_generation_usage')
      app.delete(d)
    } catch (_) {}
    try {
      const r = app.findCollectionByNameOrId('referral_credits')
      app.delete(r)
    } catch (_) {}
  },
)
