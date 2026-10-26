/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    let resultSummary = ''

    // Testar com usuário sem nome (ou first_name vazio simulado) e data ISO calibrada
    const expireTimestamp = Date.now() + 30 * 60 * 1000
    const expireDate = new Date(expireTimestamp)
    const isoString = expireDate.toISOString()
    const dateOfExpiration = isoString.includes('.') ? isoString.split('.')[0] + '.000Z' : isoString

    try {
      // Simula a chamada da API do Mercado Pago exatamente como o endpoint /backend/v1/mp/create-pix agora executa
      const res = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/v1/payments',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': `pix_validate_probe_${Date.now()}`,
        },
        body: JSON.stringify({
          transaction_amount: 1.99,
          description: 'Teste de Validacao Pix - Prompts Virais Shop',
          payment_method_id: 'pix',
          date_of_expiration: dateOfExpiration,
          payer: {
            email: 'juniorrodriguesjr123.jr@gmail.com',
            first_name: 'Junior',
            last_name: 'Cliente',
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
        has_ticket_url: Boolean(td && td.ticket_url),
        error: res.statusCode >= 300 ? data : null,
      })
    } catch (err) {
      resultSummary = JSON.stringify({ error: err.message || String(err) })
    }

    const evCol = app.findCollectionByNameOrId('events')
    const ev = new Record(evCol)
    ev.set('event_type', 'pix_validation_test_result')
    ev.set('session_id', 'diag_validation')
    ev.set('metadata', resultSummary)
    app.save(ev)
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'events',
        'event_type = "pix_validation_test_result"',
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
