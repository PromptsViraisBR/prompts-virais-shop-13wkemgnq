/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    console.log('[0057_test_pix_probe] Ingressando probe Pix. Token length:', token.length)
    if (!token) {
      console.log('[0057_test_pix_probe] Sem token MERCADO_PAGO_ACCESS_TOKEN.')
      return
    }

    try {
      const res = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/v1/payments',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': `migration_test_pix_${Date.now()}`,
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

      console.log('[0057_test_pix_probe] Status HTTP da criação Pix:', res.statusCode)
      const data = res.json || {}
      console.log('[0057_test_pix_probe] Resposta Pix status:', data.status, 'ID:', data.id)
      if (data.point_of_interaction && data.point_of_interaction.transaction_data) {
        const td = data.point_of_interaction.transaction_data
        console.log(
          '[0057_test_pix_probe] qr_code presente:',
          Boolean(td.qr_code),
          'qr_code_base64 presente:',
          Boolean(td.qr_code_base64),
          'ticket_url presente:',
          Boolean(td.ticket_url),
        )
      } else {
        console.log('[0057_test_pix_probe] Payload sem point_of_interaction:', JSON.stringify(data))
      }
    } catch (err) {
      console.warn('[0057_test_pix_probe] Erro ao chamar Pix:', err.message || String(err))
    }
  },
  () => {},
)
