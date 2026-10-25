/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const records = app.findRecordsByFilter(
      'payments_history',
      'payment_type = "task_credits_test"',
      '-created',
      1,
      0,
    )
    if (!records || records.length === 0) return

    const rec = records[0]
    const detail = JSON.parse(rec.getString('status_detail') || '{}')

    const histCol = app.findCollectionByNameOrId('payments_history')

    // Gravar preference_id e init_point em campos separados para leitura direta
    const r1 = new Record(histCol)
    r1.set('mp_payment_id', `credits_pref_id_${Date.now()}`)
    r1.set('payment_type', 'credits_pref_result')
    r1.set('status', '201')
    r1.set('status_detail', String(detail.preference_id))
    app.save(r1)

    const r2 = new Record(histCol)
    r2.set('mp_payment_id', `credits_init_point_${Date.now()}`)
    r2.set('payment_type', 'credits_init_point_result')
    r2.set('status', '201')
    r2.set('status_detail', String(detail.init_point))
    app.save(r2)

    const r3 = new Record(histCol)
    r3.set('mp_payment_id', `credits_ext_ref_${Date.now()}`)
    r3.set('payment_type', 'credits_ext_ref_result')
    r3.set('status', '201')
    r3.set('status_detail', String(detail.external_reference))
    app.save(r3)
  },
  (app) => {},
)
