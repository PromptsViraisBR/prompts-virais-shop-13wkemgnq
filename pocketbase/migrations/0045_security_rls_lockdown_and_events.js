/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0045:
 * FASE A — CORREÇÃO DE SEGURANÇA:
 * 1. subscriptions:
 *    - listRule: "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
 *    - viewRule: "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
 *    - createRule: null (bloqueado na API, apenas hooks e superuser criam)
 *    - updateRule: null (bloqueado na API, apenas hooks e superuser atualizam)
 *    - deleteRule: null (bloqueado na API)
 *
 * 2. regeneration_credits:
 *    - listRule: "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
 *    - viewRule: "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
 *    - createRule: null (bloqueado na API, apenas hooks criam)
 *    - updateRule: null (bloqueado na API, apenas hooks atualizam)
 *    - deleteRule: null
 *
 * 3. users (_pb_users_auth_):
 *    - updateRule travada para que campos sensíveis não sejam auto-promovidos:
 *      "id = @request.auth.id && @request.body.is_admin:changed = false"
 *
 * 4. generations:
 *    - createRule travado: dono cria apenas com user = @request.auth.id
 *    - updateRule: null (histórico de gerações não deve ser adulterado após criação)
 *    - deleteRule: "@request.auth.id != '' && user = @request.auth.id"
 *
 * 5. favorites:
 *    - dono lê, cria e remove os seus:
 *      listRule/viewRule: "@request.auth.id != '' && user = @request.auth.id"
 *      createRule: "@request.auth.id != '' && user = @request.auth.id"
 *      updateRule: null
 *      deleteRule: "@request.auth.id != '' && user = @request.auth.id"
 *
 * 6. payments_history:
 *    - Limpeza cirúrgica de registros de diagnóstico técnico (mantendo pagamentos reais de usuários)
 *
 * 7. events:
 *    - Criação da coleção de métricas de funil
 *    - Campos: user (relation users opcional), event_type (text/select), timestamp (text/date), metadata (json), session_id (text)
 *    - Regras: listRule: "@request.auth.is_admin = true", viewRule: "@request.auth.is_admin = true",
 *              createRule: null, updateRule: null, deleteRule: null (escrita exclusiva via hook)
 */
migrate(
  (app) => {
    // -------------------------------------------------------------
    // 1. Subscriptions RLS
    // -------------------------------------------------------------
    const subsCol = app.findCollectionByNameOrId('subscriptions')
    subsCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    subsCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    subsCol.createRule = null
    subsCol.updateRule = null
    subsCol.deleteRule = null
    app.save(subsCol)

    // -------------------------------------------------------------
    // 2. Regeneration Credits RLS
    // -------------------------------------------------------------
    const regCol = app.findCollectionByNameOrId('regeneration_credits')
    regCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    regCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    regCol.createRule = null
    regCol.updateRule = null
    regCol.deleteRule = null
    app.save(regCol)

    // -------------------------------------------------------------
    // 3. Users Auth RLS - Impedir auto-promoção de is_admin
    // -------------------------------------------------------------
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    usersCol.updateRule = 'id = @request.auth.id && @request.body.is_admin:changed = false'
    app.save(usersCol)

    // -------------------------------------------------------------
    // 4. Generations & Favorites RLS
    // -------------------------------------------------------------
    const genCol = app.findCollectionByNameOrId('generations')
    genCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    genCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)"
    genCol.createRule = "@request.auth.id != '' && user = @request.auth.id"
    genCol.updateRule = null
    genCol.deleteRule = "@request.auth.id != '' && user = @request.auth.id"
    app.save(genCol)

    const favCol = app.findCollectionByNameOrId('favorites')
    favCol.listRule = "@request.auth.id != '' && user = @request.auth.id"
    favCol.viewRule = "@request.auth.id != '' && user = @request.auth.id"
    favCol.createRule = "@request.auth.id != '' && user = @request.auth.id"
    favCol.updateRule = null
    favCol.deleteRule = "@request.auth.id != '' && user = @request.auth.id"
    app.save(favCol)

    // -------------------------------------------------------------
    // 5. Coleção `events` para métricas e funil
    // -------------------------------------------------------------
    let eventsCol
    try {
      eventsCol = app.findCollectionByNameOrId('events')
    } catch (_) {
      eventsCol = null
    }

    if (!eventsCol) {
      const newEvents = new Collection({
        name: 'events',
        type: 'base',
        listRule: "@request.auth.id != '' && @request.auth.is_admin = true",
        viewRule: "@request.auth.id != '' && @request.auth.is_admin = true",
        createRule: null, // Front grava exclusivamente via endpoint hook /backend/v1/track-event
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'user',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            required: false,
            maxSelect: 1,
            cascadeDelete: false,
          },
          {
            name: 'event_type',
            type: 'text',
            required: true,
          },
          {
            name: 'session_id',
            type: 'text',
            required: false,
          },
          {
            name: 'metadata',
            type: 'json',
            required: false,
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
          'CREATE INDEX idx_events_type_created ON events (event_type, created DESC)',
          'CREATE INDEX idx_events_user_created ON events (user, created DESC)',
          'CREATE INDEX idx_events_session ON events (session_id)',
        ],
      })
      app.save(newEvents)
    }

    // -------------------------------------------------------------
    // 6. Limpeza de registros de diagnóstico técnico em payments_history
    // Preserva pagamentos reais de usuários (user != '' ou payment_type in ('subscription','credits') com user vinculado)
    // -------------------------------------------------------------
    try {
      // Deletar com raw SQL os registros que são estritamente diagnósticos/testes de tokens
      app
        .db()
        .newQuery(
          `DELETE FROM payments_history 
           WHERE (user IS NULL OR user = '') 
             AND (
               payment_type LIKE '%diag%' 
               OR payment_type LIKE '%eval%' 
               OR payment_type LIKE '%unpacked%' 
               OR payment_type LIKE '%prod_verify%' 
               OR payment_type LIKE '%prod_check%' 
               OR payment_type LIKE '%token_analysis%' 
               OR payment_type LIKE '%env_check%' 
               OR payment_type LIKE '%res_%' 
               OR payment_type LIKE '%detail%' 
               OR payment_type LIKE '%refund_test%' 
               OR payment_type LIKE '%task_credits%' 
               OR payment_type LIKE '%credits_pref%' 
               OR payment_type LIKE '%credits_init%' 
               OR payment_type LIKE '%credits_ext%' 
               OR mp_payment_id LIKE '%diag%' 
               OR mp_payment_id LIKE '%eval%' 
               OR mp_payment_id LIKE '%unpacked%' 
               OR mp_payment_id LIKE '%prod_verify%' 
               OR mp_payment_id LIKE '%prod_check%' 
               OR mp_payment_id LIKE '%token_analysis%' 
               OR mp_payment_id LIKE '%env_check%' 
               OR mp_payment_id LIKE '%res_%' 
               OR mp_payment_id LIKE '%refund_%' 
               OR mp_payment_id LIKE '%credits_%' 
               OR mp_payment_id LIKE '%full_%' 
               OR status LIKE '%diag%' 
               OR status LIKE '%full_%'
             )`,
        )
        .execute()
    } catch (cleanErr) {
      console.warn('Erro ao limpar pagamentos de diagnóstico:', cleanErr)
    }
  },
  (app) => {
    // Reversão
    try {
      const eCol = app.findCollectionByNameOrId('events')
      app.delete(eCol)
    } catch (_) {}
  },
)
