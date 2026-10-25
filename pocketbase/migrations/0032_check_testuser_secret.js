/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Verificar se existe outra env var ou segredo
    const allKnown = [
      'TESTUSER389517180040971458',
      'MERCADO_PAGO_ACCESS_TOKEN',
      'MERCADO_PAGO_WEBHOOK_SECRET',
      'MP_ACCESS_TOKEN',
      'MP_TOKEN',
      'MERCADOPAGO_ACCESS_TOKEN',
    ]

    const found = {}
    for (let i = 0; i < allKnown.length; i++) {
      const k = allKnown[i]
      const val = ($os.getenv(k) || '').trim()
      found[k] = {
        exists: Boolean(val),
        length: val.length,
        prefix: val ? val.slice(0, 10) : '',
        startsWithTest: val.startsWith('TEST-'),
        startsWithAppUsr: val.startsWith('APP_USR-'),
      }
    }

    const histCol = app.findCollectionByNameOrId('payments_history')
    const r = new Record(histCol)
    r.set('mp_payment_id', `env_check_${Date.now()}`)
    r.set('payment_type', 'env_check')
    r.set('status', 'inspected')
    r.set('status_detail', JSON.stringify(found))
    app.save(r)
  },
  (app) => {},
)
