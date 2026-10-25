/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Inspecionar detalhes do token (tamanho, formato, caracteres)
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    const tokenAnalysis = {
      length: token.length,
      prefix: token.slice(0, 15),
      suffix: token.slice(-6),
      startsWithTest: token.startsWith('TEST-'),
      startsWithAppUsr: token.startsWith('APP_USR-'),
      hasBearer: token.toLowerCase().startsWith('bearer'),
      hasSpaces: token.includes(' '),
      hasNewlines: token.includes('\n') || token.includes('\r'),
      webhookSecretLength: webhookSecret.length,
      webhookSecretPrefix: webhookSecret.slice(0, 8),
    }

    const histCol = app.findCollectionByNameOrId('payments_history')
    const r = new Record(histCol)
    r.set('mp_payment_id', `token_analysis_${Date.now()}`)
    r.set('payment_type', 'token_analysis')
    r.set('status', 'inspected')
    r.set('status_detail', JSON.stringify(tokenAnalysis))
    app.save(r)
  },
  (app) => {},
)
