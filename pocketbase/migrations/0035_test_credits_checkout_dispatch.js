/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    let testUserId = 'e43sbp1sin3w8bt'
    let testUserEmail = 'juniorrodriguesjr123.jr@gmail.com'
    try {
      const u = app.findAuthRecordByEmail('_pb_users_auth_', testUserEmail)
      testUserId = u.id
    } catch (_) {}

    const now = Date.now()
    const credExtRef = `credits_${testUserId}_1_${now}`

    let siteUrl = ($os.getenv('SITE_URL') || '').trim()
    if (!siteUrl) siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
    siteUrl = siteUrl.replace(/\/+$/, '')

    let statusCode = 0
    let responseData = null
    let errorMsg = null

    try {
      const res = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/checkout/preferences',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              id: 'extra_credits_1',
              title: '1x Prompt Extra de Regeneração - Prompts Virais',
              description: 'Crédito adicional para adaptação e regeneração de roteiros virais.',
              quantity: 1,
              unit_price: 1.99,
              currency_id: 'BRL',
            },
          ],
          payer: {
            email: testUserEmail,
          },
          external_reference: credExtRef,
          back_urls: {
            success: `${siteUrl}/checkout/sucesso?tipo=creditos&qtd=1`,
            pending: `${siteUrl}/checkout/sucesso?status=pendente`,
            failure: `${siteUrl}/planos?status=falha`,
          },
          auto_return: 'approved',
          notification_url: 'https://prompts-virais-shop-16b33.goskip.app/backend/v1/mp/webhook',
        }),
        timeout: 30,
      })

      statusCode = res.statusCode
      responseData = res.json || res.body
    } catch (err) {
      errorMsg = err.message || String(err)
    }

    const histCol = app.findCollectionByNameOrId('payments_history')
    const rec = new Record(histCol)
    rec.set('mp_payment_id', `task_credits_test_${now}`)
    rec.set('payment_type', 'task_credits_test')
    rec.set('status', String(statusCode))
    rec.set(
      'status_detail',
      JSON.stringify({
        token_length: token.length,
        token_prefix: token.slice(0, 10),
        status_code: statusCode,
        error: errorMsg,
        has_init_point: Boolean(responseData?.init_point),
        init_point: responseData?.init_point || null,
        sandbox_init_point: responseData?.sandbox_init_point || null,
        preference_id: responseData?.id || null,
        external_reference: credExtRef,
        raw_response: responseData,
      }),
    )
    app.save(rec)
  },
  (app) => {},
)
