/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Dispara a rota /backend/v1/mp/prod-verify internamente e registra o resultado
    try {
      const res = $http.send({
        method: 'GET',
        url: 'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev/backend/v1/mp/prod-verify',
        timeout: 30,
      })

      const body = res.json || res.body || {}
      const histCol = app.findCollectionByNameOrId('payments_history')
      const rec = new Record(histCol)
      rec.set('mp_payment_id', `prod_verify_run_${Date.now()}`)
      rec.set('payment_type', 'prod_verify_result')
      rec.set('status', res.statusCode === 200 ? 'success' : 'failed')
      rec.set('status_detail', typeof body === 'string' ? body : JSON.stringify(body))
      app.save(rec)
    } catch (err) {
      const histCol = app.findCollectionByNameOrId('payments_history')
      const rec = new Record(histCol)
      rec.set('mp_payment_id', `prod_verify_run_err_${Date.now()}`)
      rec.set('payment_type', 'prod_verify_result')
      rec.set('status', 'error')
      rec.set('status_detail', JSON.stringify({ error: err.message || String(err) }))
      app.save(rec)
    }
  },
  (app) => {},
)
