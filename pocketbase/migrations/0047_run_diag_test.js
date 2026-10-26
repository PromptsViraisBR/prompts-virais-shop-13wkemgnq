/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let diagRes = null
    try {
      const res = $http.send({
        method: 'GET',
        url: 'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev/backend/v1/mp/diag-test',
        timeout: 60,
      })
      diagRes = res.json || res.body
    } catch (err) {
      diagRes = { error: err.message || String(err) }
    }

    // Grava o resultado completo num registro temporário em payments_history para podermos ler via db_query
    const histCol = app.findCollectionByNameOrId('payments_history')
    const r = new Record(histCol)
    r.set('mp_payment_id', 'diag_run_prod_eval')
    r.set('payment_type', 'diag_run')
    r.set('status', 'diag_completed')
    r.set('raw_payload', JSON.stringify(diagRes))
    app.save(r)
  },
  (app) => {
    try {
      const r = app.findFirstRecordByData('payments_history', 'mp_payment_id', 'diag_run_prod_eval')
      app.delete(r)
    } catch (_) {}
  },
)
