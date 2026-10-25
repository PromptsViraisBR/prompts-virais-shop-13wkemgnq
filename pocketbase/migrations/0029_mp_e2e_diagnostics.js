/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Migração para executar diagnóstico E2E do Mercado Pago usando segredos atuais
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    const results = {
      timestamp: new Date().toISOString(),
      token_exists: Boolean(token),
      token_prefix: token ? token.substring(0, 15) + '...' : 'none',
      webhook_secret_exists: Boolean(webhookSecret),
      webhook_secret_length: webhookSecret.length,
      tests: {},
    }

    if (token) {
      // 1. Users/me
      try {
        const meRes = $http.send({
          method: 'GET',
          url: 'https://api.mercadopago.com/users/me',
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15,
        })
        results.tests.users_me = {
          statusCode: meRes.statusCode,
          data: meRes.json || meRes.body,
        }
      } catch (e1) {
        results.tests.users_me = { error: e1.message || String(e1) }
      }

      // 2. Preapproval (Plano PRO Mensal R$ 19,90)
      try {
        const preRes = $http.send({
          method: 'POST',
          url: 'https://api.mercadopago.com/preapproval',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: 'Plano PRO Mensal - Prompts Virais Shop',
            external_reference: `diag_sub_monthly_${Date.now()}`,
            payer_email: 'test_user_diagnostics@testuser.com',
            back_url:
              'https://prompts-virais-shop-16b33.goskip.app/checkout/sucesso?tipo=assinatura&plano=monthly',
            auto_recurring: {
              frequency: 1,
              frequency_type: 'months',
              transaction_amount: 19.9,
              currency_id: 'BRL',
            },
          }),
          timeout: 20,
        })
        results.tests.preapproval_monthly = {
          statusCode: preRes.statusCode,
          data: preRes.json || preRes.body,
        }
      } catch (e2) {
        results.tests.preapproval_monthly = { error: e2.message || String(e2) }
      }

      // 3. Checkout Pro (Plano Anual VIP R$ 238,80)
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
                id: 'plan_annual_vip',
                title: 'Plano Anual VIP - Prompts Virais Shop (12 Meses)',
                description:
                  'Acesso anual completo à biblioteca de roteiros e geradores de catálogo e virais.',
                quantity: 1,
                unit_price: 238.8,
                currency_id: 'BRL',
              },
            ],
            payer: { email: 'test_user_diagnostics@testuser.com' },
            external_reference: `diag_sub_annual_${Date.now()}`,
            back_urls: {
              success:
                'https://prompts-virais-shop-16b33.goskip.app/checkout/sucesso?tipo=assinatura&plano=annual',
              pending:
                'https://prompts-virais-shop-16b33.goskip.app/checkout/sucesso?status=pendente',
              failure: 'https://prompts-virais-shop-16b33.goskip.app/planos?status=falha',
            },
            auto_return: 'approved',
          }),
          timeout: 20,
        })
        results.tests.preference_annual = {
          statusCode: prefAnnualRes.statusCode,
          data: prefAnnualRes.json || prefAnnualRes.body,
        }
      } catch (e3) {
        results.tests.preference_annual = { error: e3.message || String(e3) }
      }

      // 4. Checkout Pro (Créditos Extras R$ 1,99)
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
                id: 'extra_credits_1',
                title: '1x Prompt Extra de Regeneração - Prompts Virais',
                description: 'Créditos adicionais para adaptação e regeneração de roteiros virais.',
                quantity: 1,
                unit_price: 1.99,
                currency_id: 'BRL',
              },
            ],
            payer: { email: 'test_user_diagnostics@testuser.com' },
            external_reference: `diag_credits_1_${Date.now()}`,
            back_urls: {
              success:
                'https://prompts-virais-shop-16b33.goskip.app/checkout/sucesso?tipo=creditos&qtd=1',
              pending:
                'https://prompts-virais-shop-16b33.goskip.app/checkout/sucesso?status=pendente',
              failure: 'https://prompts-virais-shop-16b33.goskip.app/planos?status=falha',
            },
            auto_return: 'approved',
          }),
          timeout: 20,
        })
        results.tests.preference_credits = {
          statusCode: prefCreditsRes.statusCode,
          data: prefCreditsRes.json || prefCreditsRes.body,
        }
      } catch (e4) {
        results.tests.preference_credits = { error: e4.message || String(e4) }
      }

      // 5. HMAC validation
      if (webhookSecret) {
        const testManifest = `id:123456;request-id:test-req;ts:1700000000;`
        const testHash = $security.hs256(testManifest, webhookSecret)
        results.tests.hmac_validation = {
          valid: Boolean(testHash && testHash.length === 64),
          hash_sample: testHash ? testHash.substring(0, 10) + '...' : '',
        }
      }
    }

    try {
      const histCol = app.findCollectionByNameOrId('payments_history')
      const rec = new Record(histCol)
      rec.set('mp_payment_id', `diag_m29_${Date.now()}`)
      rec.set('payment_type', 'm29_diag')
      rec.set('status', 'completed')
      rec.set('status_detail', 'Diagnostico E2E Mercado Pago')
      rec.set('raw_payload', JSON.stringify(results))
      app.save(rec)
    } catch (saveErr) {
      console.warn('Erro ao salvar em payments_history na m29:', saveErr)
    }
  },
  (app) => {
    try {
      const hist = app.findRecordsByFilter(
        'payments_history',
        'payment_type = "m29_diag"',
        '',
        10,
        0,
      )
      for (let i = 0; i < hist.length; i++) {
        app.delete(hist[i])
      }
    } catch (_) {}
  },
)
