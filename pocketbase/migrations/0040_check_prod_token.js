/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    const analysis = {
      checked_at: new Date().toISOString(),
      token_length: token.length,
      has_token: Boolean(token),
      has_webhook_secret: Boolean(webhookSecret),
      prefix: token.substring(0, 10),
      is_production_token: token.startsWith('APP_USR-'),
      is_test_token: token.startsWith('TEST-'),
      suffix: token.length > 5 ? token.substring(token.length - 4) : '',
    }

    const histCol = app.findCollectionByNameOrId('payments_history')
    const r = new Record(histCol)
    r.set('mp_payment_id', `prod_check_${Date.now()}`)
    r.set('payment_type', 'prod_check')
    r.set('status', 'inspected')
    r.set('status_detail', JSON.stringify(analysis))
    app.save(r)
  },
  (app) => {},
)
