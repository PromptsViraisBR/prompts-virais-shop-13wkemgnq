/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let rToken = null
    let rCheckouts = null
    let rWebhook = null
    try {
      rToken = app.findFirstRecordByData('payments_history', 'mp_payment_id', 'diag_sec_token')
      rCheckouts = app.findFirstRecordByData(
        'payments_history',
        'mp_payment_id',
        'diag_sec_checkouts',
      )
      rWebhook = app.findFirstRecordByData('payments_history', 'mp_payment_id', 'diag_sec_webhook')
    } catch (_) {
      return
    }

    const tokenData = JSON.parse(rToken.getString('status_detail') || '{}')
    const chkData = JSON.parse(rCheckouts.getString('status_detail') || '{}')
    const whData = JSON.parse(rWebhook.getString('status_detail') || '{}')

    const histCol = app.findCollectionByNameOrId('payments_history')

    // Salvar campos individuais com strings curtas
    // 1. Seller details
    const s = tokenData.seller || {}
    const rS = new Record(histCol)
    rS.set('mp_payment_id', 'f_seller_details')
    rS.set('payment_type', 'diag_field')
    rS.set('status', 'seller_details')
    rS.set(
      'status_detail',
      `id=${s.id}|nick=${s.nickname}|email=${s.email}|tags=${JSON.stringify(s.tags)}|user_type=${s.user_type}|site_id=${s.site_id}|has_test_tag=${s.has_test_user_tag}`,
    )
    app.save(rS)

    // 2. Token details
    const rT = new Record(histCol)
    rT.set('mp_payment_id', 'f_token_details')
    rT.set('payment_type', 'diag_field')
    rT.set('status', 'token_details')
    rT.set(
      'status_detail',
      `len=${tokenData.length}|pfx=${tokenData.prefix}|sfx=${tokenData.suffix}|prod=${tokenData.is_production_prefix}|test=${tokenData.is_test_prefix}|http=${tokenData.http_status}`,
    )
    app.save(rT)

    // 3. Monthly PRO
    const m = chkData.monthly_pro || {}
    const rM = new Record(histCol)
    rM.set('mp_payment_id', 'f_monthly_details')
    rM.set('payment_type', 'diag_field')
    rM.set('status', 'monthly_details')
    rM.set(
      'status_detail',
      `status=${m.status}|success=${m.success}|mode=${m.mode}|init_pt=${m.has_init_point}|dom=${m.init_point_domain}`,
    )
    app.save(rM)

    // 4. Annual VIP
    const a = chkData.annual_vip || {}
    const rA = new Record(histCol)
    rA.set('mp_payment_id', 'f_annual_details')
    rA.set('payment_type', 'diag_field')
    rA.set('status', 'annual_details')
    rA.set(
      'status_detail',
      `status=${a.status}|success=${a.success}|init_pt=${a.has_init_point}|sb_init_pt=${a.has_sandbox_init_point}|dom=${a.init_point_domain}`,
    )
    app.save(rA)

    // 5. Credits
    const c = chkData.credits_extra || {}
    const rC = new Record(histCol)
    rC.set('mp_payment_id', 'f_credits_details')
    rC.set('payment_type', 'diag_field')
    rC.set('status', 'credits_details')
    rC.set(
      'status_detail',
      `status=${c.status}|success=${c.success}|init_pt=${c.has_init_point}|sb_init_pt=${c.has_sandbox_init_point}|dom=${c.init_point_domain}`,
    )
    app.save(rC)

    // 6. Webhook details
    const rW = new Record(histCol)
    rW.set('mp_payment_id', 'f_webhook_details')
    rW.set('payment_type', 'diag_field')
    rW.set('status', 'webhook_details')
    rW.set(
      'status_detail',
      `len=${whData.secret_length}|pfx=${whData.secret_prefix}|sfx=${whData.secret_suffix}|noSigStat=${whData.no_signature_test ? whData.no_signature_test.http_status : null}|fakeSigStat=${whData.fake_signature_test ? whData.fake_signature_test.http_status : null}|noRecsWritten=${whData.database_integrity ? whData.database_integrity.no_records_written : null}`,
    )
    app.save(rW)
  },
  (app) => {},
)
