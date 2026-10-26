/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0054: Diagnóstico e Verificação do Estado da Coleção Users no Backend.
 *
 * Lê a coleção '_pb_users_auth_', extrai as configurações de oauth2 (sem imprimir segredos),
 * e grava um registro diagnóstico no banco ou no console para comprovar o status.
 */
migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol) {
      console.warn('[migration 0054] Coleção _pb_users_auth_ não encontrada')
      return
    }

    const oauth2 = usersCol.oauth2 || {}
    const providers = Array.isArray(oauth2.providers) ? oauth2.providers : []
    const google = providers.find((p) => p && p.name && p.name.toLowerCase() === 'google')

    const info = {
      oauth2_enabled: Boolean(oauth2.enabled),
      providers_count: providers.length,
      google_found: Boolean(google),
      google_client_id_length: google && google.clientId ? google.clientId.length : 0,
      google_client_secret_length: google && google.clientSecret ? google.clientSecret.length : 0,
    }

    console.log('[migration 0054] ESTADO_OAUTH_USERS:', JSON.stringify(info))

    // Opcionalmente grava no payments_history como registro diagnóstico seguro
    try {
      const pmtCol = app.findCollectionByNameOrId('payments_history')
      if (pmtCol) {
        const record = new Record(pmtCol, {
          payment_type: 'diag_oauth_google_check',
          status: google ? 'verified_active' : 'not_active',
          status_detail: JSON.stringify(info),
          transaction_amount: 0,
        })
        app.save(record)
      }
    } catch (e) {
      console.warn('[migration 0054] Não foi possível salvar em payments_history:', e)
    }
  },
  (app) => {},
)
