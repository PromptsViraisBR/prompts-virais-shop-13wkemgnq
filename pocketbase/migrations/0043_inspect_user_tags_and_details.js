/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let rUser = null
    let rMonthly = null
    let rAnnual = null
    let rCredits = null
    try {
      rUser = app.findFirstRecordByData('payments_history', 'status', 'user_me')
      rMonthly = app.findFirstRecordByData('payments_history', 'status', 'monthly')
      rAnnual = app.findFirstRecordByData('payments_history', 'status', 'annual')
      rCredits = app.findFirstRecordByData('payments_history', 'status', 'credits')
    } catch (_) {
      return
    }

    const histCol = app.findCollectionByNameOrId('payments_history')

    // Salvar user_me expandido
    if (rUser) {
      const uData = JSON.parse(rUser.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `eval_user_me_${Date.now()}`)
      r.set('payment_type', 'eval_report')
      r.set('status', 'user_me_tags')
      r.set(
        'status_detail',
        JSON.stringify({
          id: uData.id,
          nickname: uData.nickname,
          email: uData.email,
          tags: uData.tags,
          user_type: uData.user_type,
          status_sub: uData.status,
        }),
      )
      app.save(r)
    }

    // Salvar direct_preapproval_error se houver
    if (rMonthly) {
      const mData = JSON.parse(rMonthly.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `eval_monthly_${Date.now()}`)
      r.set('payment_type', 'eval_report')
      r.set('status', 'monthly_direct_err')
      r.set(
        'status_detail',
        JSON.stringify({
          method: mData.method,
          status: mData.status,
          id: mData.id,
          direct_preapproval_error: mData.direct_preapproval_error,
          init_point: mData.init_point,
        }),
      )
      app.save(r)
    }

    // Salvar annual init_point
    if (rAnnual) {
      const aData = JSON.parse(rAnnual.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `eval_annual_${Date.now()}`)
      r.set('payment_type', 'eval_report')
      r.set('status', 'annual_info')
      r.set(
        'status_detail',
        JSON.stringify({
          status: aData.status,
          preference_id: aData.preference_id,
          init_point: aData.init_point,
        }),
      )
      app.save(r)
    }

    // Salvar credits init_point
    if (rCredits) {
      const cData = JSON.parse(rCredits.getString('status_detail') || '{}')
      const r = new Record(histCol)
      r.set('mp_payment_id', `eval_credits_${Date.now()}`)
      r.set('payment_type', 'eval_report')
      r.set('status', 'credits_info')
      r.set(
        'status_detail',
        JSON.stringify({
          status: cData.status,
          preference_id: cData.preference_id,
          init_point: cData.init_point,
        }),
      )
      app.save(r)
    }
  },
  (app) => {},
)
