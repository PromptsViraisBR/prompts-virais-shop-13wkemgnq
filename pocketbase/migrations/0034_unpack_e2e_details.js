/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Buscar o último registro e salvar os campos separados para fácil inspeção
    const reports = app.findRecordsByFilter(
      'payments_history',
      'payment_type = "e2e_final_report"',
      '-created',
      1,
      0,
    )
    if (!reports || reports.length === 0) return

    const report = reports[0]
    const raw = JSON.parse(report.getString('raw_payload') || '{}')
    const histCol = app.findCollectionByNameOrId('payments_history')

    // 1. Step 1: Config status
    const r1 = new Record(histCol)
    r1.set('mp_payment_id', `detail_step1_${Date.now()}`)
    r1.set('payment_type', 'detail_step1')
    r1.set('status', 'ok')
    r1.set('status_detail', JSON.stringify(raw.step1_config_status))
    app.save(r1)

    // 2. Step 2: Mensal
    const r2 = new Record(histCol)
    r2.set('mp_payment_id', `detail_step2_monthly_${Date.now()}`)
    r2.set('payment_type', 'detail_step2_monthly')
    r2.set('status', String(raw.step2_create_checkout?.monthly_pro_19_90?.statusCode || 'err'))
    r2.set(
      'status_detail',
      JSON.stringify(raw.step2_create_checkout?.monthly_pro_19_90?.data || {}),
    )
    app.save(r2)

    // 3. Step 2: Anual
    const r3 = new Record(histCol)
    r3.set('mp_payment_id', `detail_step2_annual_${Date.now()}`)
    r3.set('payment_type', 'detail_step2_annual')
    r3.set('status', String(raw.step2_create_checkout?.annual_vip_238_80?.statusCode || 'err'))
    r3.set(
      'status_detail',
      JSON.stringify(raw.step2_create_checkout?.annual_vip_238_80?.data || {}),
    )
    app.save(r3)

    // 4. Step 2: Créditos
    const r4 = new Record(histCol)
    r4.set('mp_payment_id', `detail_step2_credits_${Date.now()}`)
    r4.set('payment_type', 'detail_step2_credits')
    r4.set('status', String(raw.step2_create_checkout?.credits_1_99?.statusCode || 'err'))
    r4.set('status_detail', JSON.stringify(raw.step2_create_checkout?.credits_1_99?.data || {}))
    app.save(r4)

    // 5. Step 3 & 4: Webhook e Integridade
    const r5 = new Record(histCol)
    r5.set('mp_payment_id', `detail_step3_and_4_${Date.now()}`)
    r5.set('payment_type', 'detail_step3_and_4')
    r5.set('status', 'ok')
    r5.set(
      'status_detail',
      JSON.stringify({
        webhook: raw.step3_webhook_tests,
        db: raw.database_integrity,
      }),
    )
    app.save(r5)
  },
  (app) => {},
)
