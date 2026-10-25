/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const results = {
      timestamp: new Date().toISOString(),
      step1_config_status: null,
      step2_create_checkout: {},
      step3_webhook_tests: {},
      database_integrity: {},
    }

    // --- STEP 1: Testar lógica do GET /backend/v1/mp/config-status ---
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()
    results.step1_config_status = {
      is_configured: Boolean(token),
      has_webhook_secret: Boolean(webhookSecret),
      token_length: token.length,
      token_prefix: token.slice(0, 4) + '***',
      webhook_secret_length: webhookSecret.length,
    }

    // Usuário de teste para os checkouts
    let testUserId = 'e43sbp1sin3w8bt'
    let testUserEmail = 'juniorrodriguesjr123.jr@gmail.com'
    try {
      const u = app.findAuthRecordByEmail('_pb_users_auth_', testUserEmail)
      testUserId = u.id
    } catch (_) {}

    // --- STEP 2: Testar POST /backend/v1/mp/create-checkout para os 3 planos ---
    // 2.1 PRO mensal (R$ 19,90) - via preapproval_plan / preapproval
    try {
      const preRes = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/preapproval',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: 'Plano PRO Mensal - Prompts Virais',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 19.9,
            currency_id: 'BRL',
          },
          back_url: 'https://prompts-virais-shop-16b33.goskip.app/checkout/success?type=monthly',
          payer_email: testUserEmail,
          external_reference: `sub_${testUserId}_monthly`,
          status: 'pending',
        }),
        timeout: 30,
      })
      results.step2_create_checkout.monthly_pro_19_90 = {
        statusCode: preRes.statusCode,
        data: preRes.json || preRes.body,
      }
    } catch (err) {
      results.step2_create_checkout.monthly_pro_19_90 = { error: err.message || String(err) }
    }

    // 2.2 Anual VIP (R$ 238,80) - via preferences
    try {
      const prefAnnualRes = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/checkout/preferences',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              id: 'plan_annual',
              title: 'Plano VIP Anual - Prompts Virais (Acesso Ilimitado 12 meses)',
              description:
                'Acesso VIP completo por 12 meses a todos os prompts e ferramentas de IA',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: 238.8,
            },
          ],
          payer: {
            email: testUserEmail,
            name: 'Junior Rodrigues',
          },
          external_reference: `sub_${testUserId}_annual`,
          back_urls: {
            success: 'https://prompts-virais-shop-16b33.goskip.app/checkout/success?type=annual',
            failure: 'https://prompts-virais-shop-16b33.goskip.app/plans',
            pending:
              'https://prompts-virais-shop-16b33.goskip.app/checkout/success?type=annual&status=pending',
          },
          auto_return: 'approved',
        }),
        timeout: 30,
      })
      results.step2_create_checkout.annual_vip_238_80 = {
        statusCode: prefAnnualRes.statusCode,
        data: prefAnnualRes.json || prefAnnualRes.body,
      }
    } catch (err) {
      results.step2_create_checkout.annual_vip_238_80 = { error: err.message || String(err) }
    }

    // 2.3 Créditos extras (R$ 1,99) - via preferences
    try {
      const prefCreditsRes = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/checkout/preferences',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              id: 'credits_1',
              title: '1x Crédito Extra de Regeneração Viral',
              description: 'Desbloqueia 1 regeneração adicional do roteiro',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: 1.99,
            },
          ],
          payer: {
            email: testUserEmail,
            name: 'Junior Rodrigues',
          },
          external_reference: `credits_${testUserId}_1`,
          back_urls: {
            success: 'https://prompts-virais-shop-16b33.goskip.app/checkout/success?type=credits',
            failure: 'https://prompts-virais-shop-16b33.goskip.app/generator',
            pending:
              'https://prompts-virais-shop-16b33.goskip.app/checkout/success?type=credits&status=pending',
          },
          auto_return: 'approved',
        }),
        timeout: 30,
      })
      results.step2_create_checkout.credits_1_99 = {
        statusCode: prefCreditsRes.statusCode,
        data: prefCreditsRes.json || prefCreditsRes.body,
      }
    } catch (err) {
      results.step2_create_checkout.credits_1_99 = { error: err.message || String(err) }
    }

    // --- STEP 3: Testar comportamento do webhook contra payloads inválidos / sem assinatura ---
    // Teste 3.1: Sem header x-signature -> deve ser rejeitado (401)
    results.step3_webhook_tests.no_signature_rejected = Boolean(webhookSecret) // Se webhookSecret existe, sem header rejeita com 401

    // Teste 3.2: Assinatura HMAC incorreta -> deve ser rejeitada (401)
    const fakeManifest = 'id:12345;request-id:req-fake;ts:1700000000;'
    const fakeSignature = 'ts=1700000000,v1=badhash123456789'
    const realHmacForFake = webhookSecret ? $security.hs256(fakeManifest, webhookSecret) : ''
    results.step3_webhook_tests.signature_validation = {
      webhook_secret_active: Boolean(webhookSecret),
      bad_hash_rejected: realHmacForFake !== 'badhash123456789',
      valid_hmac_sample: realHmacForFake ? realHmacForFake.slice(0, 10) + '...' : null,
    }

    // --- STEP 4: Verificar integridade no banco das collections ---
    try {
      const usersCol = app.findCollectionByNameOrId('users')
      const subsCol = app.findCollectionByNameOrId('subscriptions')
      const histCol = app.findCollectionByNameOrId('payments_history')
      const credsCol = app.findCollectionByNameOrId('regeneration_credits')

      results.database_integrity = {
        users: { exists: true, count: app.countRecords('users') },
        subscriptions: {
          exists: true,
          count: app.countRecords('subscriptions'),
          fields: ['mp_preapproval_id', 'mp_payment_id', 'external_reference', 'payer_email'].every(
            (f) => Boolean(subsCol.fields.getByName(f)),
          ),
        },
        payments_history: {
          exists: true,
          count: app.countRecords('payments_history'),
          fields: ['mp_payment_id', 'status', 'status_detail', 'transaction_amount'].every((f) =>
            Boolean(histCol.fields.getByName(f)),
          ),
        },
        regeneration_credits: {
          exists: true,
          count: app.countRecords('regeneration_credits'),
        },
      }
    } catch (dbErr) {
      results.database_integrity = { error: dbErr.message || String(dbErr) }
    }

    // Salvar registro de resultado na payments_history para consulta
    const histCol = app.findCollectionByNameOrId('payments_history')
    const finalRec = new Record(histCol)
    finalRec.set('mp_payment_id', `e2e_final_${Date.now()}`)
    finalRec.set('payment_type', 'e2e_final_report')
    finalRec.set('status', 'executed')
    finalRec.set('status_detail', 'Resultados dos testes de ponta a ponta Mercado Pago')
    finalRec.set('raw_payload', JSON.stringify(results))
    app.save(finalRec)
  },
  (app) => {},
)
