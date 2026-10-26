/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Inicialização e Sincronização do OAuth2 Google (onBootstrap)
 *
 * Objetivo:
 * Como migrações rodam apenas UMA VEZ na vida da instância, quando o usuário cadastrar
 * os segredos GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no painel do Skip Cloud e o backend reiniciar,
 * este hook detecta automaticamente os segredos e atualiza o provider Google na coleção `users`.
 *
 * Regras:
 * 1. Idempotente: se já estiver configurado com os mesmos dados, não faz nada.
 * 2. Se os segredos não existirem: operação no-op silenciosa, não quebra o boot nem gera erro.
 * 3. Loga no console do backend APENAS quando os segredos forem detectados e configurados,
 *    SEM imprimir seus valores (segurança estrita).
 * 4. Preserva qualquer outro provider configurado na coleção.
 */

onBootstrap((e) => {
  e.next()

  try {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

    // Sem segredos configurados: no-op silencioso
    if (!clientId || !clientSecret) {
      return
    }

    const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol) return

    if (!usersCol.oauth2) {
      usersCol.oauth2 = {
        enabled: true,
        providers: [],
      }
    }

    const currentProviders = Array.isArray(usersCol.oauth2.providers)
      ? usersCol.oauth2.providers
      : []

    // Verifica se já está configurado com as mesmas credenciais
    const existingGoogle = currentProviders.find(
      (p) => p && p.name && p.name.toLowerCase() === 'google',
    )

    if (
      existingGoogle &&
      existingGoogle.clientId === clientId &&
      existingGoogle.clientSecret === clientSecret &&
      usersCol.oauth2.enabled === true
    ) {
      // Já está em sincronia perfeita, nenhuma gravação necessária
      return
    }

    // Filtrar outros providers existentes para preservá-los
    const otherProviders = currentProviders.filter(
      (p) => p && p.name && p.name.toLowerCase() !== 'google',
    )

    otherProviders.push({
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
    usersCol.oauth2.providers = otherProviders

    $app.save(usersCol)
    console.log(
      '[oauth-google] Segredos detectados: Provedor Google OAuth2 configurado e ativado com sucesso na coleção users.',
    )
  } catch (err) {
    console.error('[oauth-google] Erro ao sincronizar provider Google OAuth2 no boot:', err)
  }
})
