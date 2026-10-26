/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    let resultSummary = ''

    try {
      const res = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/v1/payments',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': `migration_test_pix_store_${Date.now()}`,
        },
        body: JSON.stringify({
          transaction_amount: 1.99,
          description: '1x Prompt Extra de Regeneração - Prompts Virais (Teste Pix)',
          payment_method_id: 'pix',
          payer: {
            email: 'juniorrodriguesjr123.jr@gmail.com',
            first_name: 'Junior',
            last_name: 'Rodrigues',
          },
        }),
        timeout: 25,
      })

      const data = res.json || {}
      let td = null
      if (data.point_of_interaction && data.point_of_interaction.transaction_data) {
        td = data.point_of_interaction.transaction_data
      }

      resultSummary = JSON.stringify({
        statusCode: res.statusCode,
        id: data.id,
        status: data.status,
        payment_method_id: data.payment_method_id,
        has_qr_code: Boolean(td && td.qr_code),
        has_qr_code_base64: Boolean(td && td.qr_code_base64),
        qr_code_prefix: td && td.qr_code ? td.qr_code.substring(0, 30) : null,
        ticket_url: td && td.ticket_url ? td.ticket_url : null,
        error: res.statusCode >= 300 ? data : null,
      })
    } catch (err) {
      resultSummary = JSON.stringify({ error: err.message || String(err) })
    }

    // Grava temporariamente em events para visualização segura via db_query
    const evCol = app.findCollectionByNameOrId('events')
    const ev = new Record(evCol)
    ev.set('event_type', 'diag_pix_probe_result')
    ev.set('session_id', 'diag_pix')
    ev.set('metadata', resultSummary)
    app.save(ev)
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'events',
        'event_type = "diag_pix_probe_result"',
        '',
        10,
        0,
      )
      for (let i = 0; i < records.length; i++) {
        app.delete(records[i])
      }
    } catch (_) {}
  },
)
