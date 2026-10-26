/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0055: Registro e verificação de diagnóstico do provedor Google OAuth2.
 * Utiliza record.set('field', value) compatível com a API PocketBase Goja.
 */
migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol) return

    const oauth2 = usersCol.oauth2 || {}
    const providers = Array.isArray(oauth2.providers) ? oauth2.providers : []
    const google = providers.find((p) => p && p.name && p.name.toLowerCase() === 'google')

    const info = {
      oauth2_enabled: Boolean(oauth2.enabled),
      providers_count: providers.length,
      google_found: Boolean(google),
      google_client_id_len: google && google.clientId ? google.clientId.length : 0,
      google_client_secret_len: google && google.clientSecret ? google.clientSecret.length : 0,
    }

    try {
      const histCol = app.findCollectionByNameOrId('payments_history')
      if (histCol) {
        const finalRec = new Record(histCol)
        finalRec.set('mp_payment_id', `oauth_verify_${Date.now()}`)
        finalRec.set('payment_type', 'oauth_diag')
        finalRec.set('status', google ? 'google_active' : 'google_missing')
        finalRec.set('status_detail', JSON.stringify(info))
        finalRec.set('transaction_amount', 0)
        app.save(finalRec)
      }
    } catch (err) {
      console.warn('[migration 0055] Erro ao gravar diagnóstico:', err)
    }
  },
  (app) => {},
)
