/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let rUser = null
    let rMonthly = null
    let rAnnual = null
    let rCredits = null
    try {
      rUser = app.findFirstRecordByData('payments_history', 'status', 'user_me_tags')
      rMonthly = app.findFirstRecordByData('payments_history', 'status', 'monthly_direct_err')
      rAnnual = app.findFirstRecordByData('payments_history', 'status', 'annual_info')
      rCredits = app.findFirstRecordByData('payments_history', 'status', 'credits_info')
    } catch (_) {
      return
    }

    const histCol = app.findCollectionByNameOrId('payments_history')

    if (rUser) {
      const u = JSON.parse(rUser.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `full_user_${Date.now()}`)
      r.set('payment_type', 'full_diagnostic')
      r.set('status', 'full_user')
      r.set(
        'status_detail',
        `email: ${u.email} | tags: ${JSON.stringify(u.tags)} | nickname: ${u.nickname} | id: ${u.id}`,
      )
      app.save(r)
    }

    if (rMonthly) {
      const m = JSON.parse(rMonthly.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `full_monthly_${Date.now()}`)
      r.set('payment_type', 'full_diagnostic')
      r.set('status', 'full_monthly')
      r.set('status_detail', `id: ${m.id} | init_point: ${m.init_point}`)
      app.save(r)
    }

    if (rAnnual) {
      const a = JSON.parse(rAnnual.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `full_annual_${Date.now()}`)
      r.set('payment_type', 'full_diagnostic')
      r.set('status', 'full_annual')
      r.set('status_detail', `pref_id: ${a.preference_id} | init_point: ${a.init_point}`)
      app.save(r)
    }

    if (rCredits) {
      const c = JSON.parse(rCredits.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `full_credits_${Date.now()}`)
      r.set('payment_type', 'full_diagnostic')
      r.set('status', 'full_credits')
      r.set('status_detail', `pref_id: ${c.preference_id} | init_point: ${c.init_point}`)
      app.save(r)
    }
  },
  (app) => {},
)
