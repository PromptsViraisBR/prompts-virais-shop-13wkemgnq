/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0053: Sincronização e verificação ativa do provedor Google OAuth2.
 *
 * Como os segredos GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET foram adicionados após
 * a aplicação da migration 0052 e antes de um restart do backend, esta migration
 * 0053 executa imediatamente durante o ciclo de deploy, ativando e persistindo
 * as credenciais do Google OAuth2 na coleção 'users'.
 *
 * Regras:
 * - Idempotente: se já estiver configurado com as credenciais atuais, preserva.
 * - Segurança estrita: nunca loga os valores dos segredos.
 */
migrate(
  (app) => {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

    if (!clientId || !clientSecret) {
      console.log(
        '[migration 0053] Segredos GOOGLE_CLIENT_ID/SECRET ausentes no momento da migração.',
      )
      return
    }

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol) {
      console.warn('[migration 0053] Coleção users (_pb_users_auth_) não encontrada.')
      return
    }

    if (!usersCol.oauth2) {
      usersCol.oauth2 = {
        enabled: true,
        providers: [],
      }
    }

    const currentProviders = Array.isArray(usersCol.oauth2.providers)
      ? usersCol.oauth2.providers
      : []

    const existingGoogle = currentProviders.find(
      (p) => p && p.name && p.name.toLowerCase() === 'google',
    )

    if (
      existingGoogle &&
      existingGoogle.clientId === clientId &&
      existingGoogle.clientSecret === clientSecret &&
      usersCol.oauth2.enabled === true
    ) {
      console.log('[migration 0053] Provedor Google OAuth2 já configurado e em sincronia.')
      return
    }

    const remainingProviders = currentProviders.filter(
      (p) => p && p.name && p.name.toLowerCase() !== 'google',
    )

    remainingProviders.push({
      name: 'google',
      clientId: clientId,
      clientSecret: clientSecret,
      authURL: '',
      tokenURL: '',
      userInfoURL: '',
      displayName: 'Google',
      pkce: null,
      extra: null,
    })

    usersCol.oauth2.enabled = true
    usersCol.oauth2.providers = remainingProviders

    app.save(usersCol)
    console.log(
      '[migration 0053] Provedor Google OAuth2 sincronizado e ativado com sucesso na coleção users.',
    )
  },
  (app) => {
    // Reversão no-op
  },
)
