/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0052: Sincronização idempotente do provider Google OAuth2 na coleção 'users'.
 *
 * Lê as variáveis de ambiente GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET via $os.getenv.
 * - Se ambas estiverem definidas e não-vazias:
 *     1. Ativa oauth2.enabled = true na coleção 'users'.
 *     2. Adiciona ou atualiza o provider 'google' com o clientId e clientSecret informados.
 *     3. Preserva outros providers existentes.
 * - Se os segredos ainda não existirem:
 *     Operação no-op silenciosa e segura (sem quebrar o boot do backend).
 */
migrate(
  (app) => {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

    // Se os segredos ainda não foram configurados pelo usuário, sai sem erro
    if (!clientId || !clientSecret) {
      return
    }

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol) return

    // Garantir objeto oauth2
    if (!usersCol.oauth2) {
      usersCol.oauth2 = {
        enabled: true,
        providers: [],
      }
    }

    usersCol.oauth2.enabled = true

    const currentProviders = Array.isArray(usersCol.oauth2.providers)
      ? usersCol.oauth2.providers
      : []

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

    usersCol.oauth2.providers = remainingProviders

    app.save(usersCol)
    console.log('[migration 0052] Provider Google OAuth2 configurado com sucesso na coleção users.')
  },
  (app) => {
    // Reversão opcional: não deleta coleção, apenas no-op
  },
)
