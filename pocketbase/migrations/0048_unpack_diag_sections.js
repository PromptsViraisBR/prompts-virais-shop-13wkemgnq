/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let rec = null
    try {
      rec = app.findFirstRecordByData('payments_history', 'mp_payment_id', 'diag_run_prod_eval')
    } catch (_) {
      return
    }

    const raw = rec.getString('raw_payload')
    const data = JSON.parse(raw || '{}')

    const histCol = app.findCollectionByNameOrId('payments_history')

    // Part 1: Token & Seller
    const r1 = new Record(histCol)
    r1.set('mp_payment_id', 'diag_sec_token')
    r1.set('payment_type', 'diag_part')
    r1.set('status', 'sec_token')
    r1.set('status_detail', JSON.stringify(data.token_check || {}))
    app.save(r1)

    // Part 2: Checkouts
    const r2 = new Record(histCol)
    r2.set('mp_payment_id', 'diag_sec_checkouts')
    r2.set('payment_type', 'diag_part')
    r2.set('status', 'sec_checkouts')
    r2.set('status_detail', JSON.stringify(data.checkouts || {}))
    app.save(r2)

    // Part 3: Webhook
    const r3 = new Record(histCol)
    r3.set('mp_payment_id', 'diag_sec_webhook')
    r3.set('payment_type', 'diag_part')
    r3.set('status', 'sec_webhook')
    r3.set('status_detail', JSON.stringify(data.webhook_check || {}))
    app.save(r3)
  },
  (app) => {
    ;['diag_sec_token', 'diag_sec_checkouts', 'diag_sec_webhook'].forEach((id) => {
      try {
        const r = app.findFirstRecordByData('payments_history', 'mp_payment_id', id)
        app.delete(r)
      } catch (_) {}
    })
  },
)
