/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Inicialização e Sincronização Resiliente do OAuth2 Google.
 *
 * Resiliência:
 * 1. onBootstrap: executa na inicialização do backend.
 * 2. routerUse: intercepta requisições de autenticação e auth-methods (/api/collections/users/auth-methods,
 *    /api/collections/users/auth-with-oauth2, etc.) e garante a sincronização lazy no primeiro uso caso
 *    o backend não tenha sido reiniciado após a inserção dos segredos GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET.
 * 3. onRecordAuthWithOAuth2Request & onRecordAuthRequest: salvaguarda adicional na autenticação de records.
 * 4. Rota pública utilitária /backend/v1/auth/google-status (GET) para verificação do status ativo do provider
 *    (sem expor segredos).
 *
 * Observação de arquitetura do PocketBase JSVM no Skip Cloud:
 * Todas as funções auxiliares residem inline dentro dos handlers dos callbacks devido ao pool
 * de VMs isoladas para evitar ReferenceError de escopo global.
 *
 * Segurança:
 * - NUNCA imprime os valores de GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET.
 * - Idempotente: só grava na coleção users se o provedor estiver ausente ou divergente.
 */

// 1. Execução no Boot
onBootstrap((e) => {
  e.next()

  try {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

    if (!clientId || !clientSecret) return

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

    const existingGoogle = currentProviders.find(
      (p) => p && p.name && p.name.toLowerCase() === 'google',
    )

    if (
      existingGoogle &&
      existingGoogle.clientId === clientId &&
      existingGoogle.clientSecret === clientSecret &&
      usersCol.oauth2.enabled === true
    ) {
      return
    }

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
    console.log('[oauth-google] Google OAuth2 sincronizado no bootstrap da coleção users.')
  } catch (err) {
    console.error('[oauth-google] Erro na sincronização Google OAuth2 no bootstrap:', err)
  }
})

// 2. Middleware routerUse: detecta requisições relevantes de auth e executa sincronização lazy
routerUse((e) => {
  try {
    const path = (e.request && e.request.url && e.request.url.path) || ''
    if (
      path.indexOf('/auth-methods') !== -1 ||
      path.indexOf('/auth-with-oauth2') !== -1 ||
      path.indexOf('/oauth2-redirect') !== -1 ||
      path.indexOf('/backend/v1/auth/') !== -1
    ) {
      const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
      const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

      if (clientId && clientSecret) {
        const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
        if (usersCol) {
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

          const isSynced =
            existingGoogle &&
            existingGoogle.clientId === clientId &&
            existingGoogle.clientSecret === clientSecret &&
            usersCol.oauth2.enabled === true

          if (!isSynced) {
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
              '[oauth-google] Google OAuth2 sincronizado via routerUse lazy na coleção users.',
            )
          }
        }
      }
    }
  } catch (err) {
    // Falha silenciosa para nunca quebrar a requisição do usuário
    console.warn('[oauth-google] Erro na verificação lazy do routerUse:', err)
  }

  return e.next()
})

// 3. Hook onRecordAuthWithOAuth2Request para autenticação OAuth2
onRecordAuthWithOAuth2Request((e) => {
  try {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

    if (clientId && clientSecret) {
      const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
      if (usersCol) {
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

        const isSynced =
          existingGoogle &&
          existingGoogle.clientId === clientId &&
          existingGoogle.clientSecret === clientSecret &&
          usersCol.oauth2.enabled === true

        if (!isSynced) {
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
            '[oauth-google] Google OAuth2 sincronizado via onRecordAuthWithOAuth2Request.',
          )
        }
      }
    }
  } catch (_) {}

  return e.next()
}, 'users')

// 4. Hook onRecordAuthRequest para qualquer requisição bem-sucedida de auth
onRecordAuthRequest((e) => {
  try {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()

    if (clientId && clientSecret) {
      const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
      if (usersCol) {
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

        const isSynced =
          existingGoogle &&
          existingGoogle.clientId === clientId &&
          existingGoogle.clientSecret === clientSecret &&
          usersCol.oauth2.enabled === true

        if (!isSynced) {
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
          console.log('[oauth-google] Google OAuth2 sincronizado via onRecordAuthRequest.')
        }
      }
    }
  } catch (_) {}

  return e.next()
}, 'users')

// 5. Endpoint utilitário seguro para status de saúde da configuração OAuth (sem vazar segredos)
routerAdd('GET', '/backend/v1/auth/google-status', (e) => {
  try {
    const clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
    const clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()
    let syncPerformed = false

    const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
    if (usersCol && clientId && clientSecret) {
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

      const isSynced =
        existingGoogle &&
        existingGoogle.clientId === clientId &&
        existingGoogle.clientSecret === clientSecret &&
        usersCol.oauth2.enabled === true

      if (!isSynced) {
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
        syncPerformed = true
      }
    }

    const reloadedCol = $app.findCollectionByNameOrId('_pb_users_auth_')
    const oauth2 = reloadedCol ? reloadedCol.oauth2 : null
    const providers = oauth2 && Array.isArray(oauth2.providers) ? oauth2.providers : []
    const google = providers.find((p) => p && p.name && p.name.toLowerCase() === 'google')

    return e.json(200, {
      success: true,
      oauth2_enabled: Boolean(oauth2 && oauth2.enabled),
      google_configured: Boolean(google),
      google_client_id_present: Boolean(google && google.clientId),
      secrets_in_env: Boolean(clientId && clientSecret),
      synced_just_now: syncPerformed,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      error: err?.message || String(err),
    })
  }
})
