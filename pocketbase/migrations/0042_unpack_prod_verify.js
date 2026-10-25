/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let orig = null
    try {
      orig = app.findRecordById('payments_history', 'fn3dyf5acqw7036')
    } catch (_) {
      return
    }

    const detail = orig.getString('status_detail')
    if (!detail) return

    let parsed = {}
    try {
      parsed = JSON.parse(detail)
    } catch (_) {
      return
    }

    const histCol = app.findCollectionByNameOrId('payments_history')

    // 1. user_me
    const r1 = new Record(histCol)
    r1.set('mp_payment_id', `unpacked_user_me_${Date.now()}`)
    r1.set('payment_type', 'unpacked_detail')
    r1.set('status', 'user_me')
    r1.set('status_detail', JSON.stringify(parsed.user_me || {}))
    app.save(r1)

    // 2. monthly
    const r2 = new Record(histCol)
    r2.set('mp_payment_id', `unpacked_monthly_${Date.now()}`)
    r2.set('payment_type', 'unpacked_detail')
    r2.set('status', 'monthly')
    r2.set('status_detail', JSON.stringify(parsed.monthly || {}))
    app.save(r2)

    // 3. annual
    const r3 = new Record(histCol)
    r3.set('mp_payment_id', `unpacked_annual_${Date.now()}`)
    r3.set('payment_type', 'unpacked_detail')
    r3.set('status', 'annual')
    r3.set('status_detail', JSON.stringify(parsed.annual || {}))
    app.save(r3)

    // 4. credits
    const r4 = new Record(histCol)
    r4.set('mp_payment_id', `unpacked_credits_${Date.now()}`)
    r4.set('payment_type', 'unpacked_detail')
    r4.set('status', 'credits')
    r4.set('status_detail', JSON.stringify(parsed.credits || {}))
    app.save(r4)

    // 5. webhook
    const r5 = new Record(histCol)
    r5.set('mp_payment_id', `unpacked_webhook_${Date.now()}`)
    r5.set('payment_type', 'unpacked_detail')
    r5.set('status', 'webhook')
    r5.set('status_detail', JSON.stringify(parsed.webhook_sec || {}))
    app.save(r5)
  },
  (app) => {},
)
