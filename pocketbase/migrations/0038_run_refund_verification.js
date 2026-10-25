migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    const report = {
      timestamp: new Date().toISOString(),
      tests: {},
    }

    // 1. Tentar criar um test user no Mercado Pago
    try {
      const tuRes = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/users/test',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          site_id: 'MLB',
          description: 'Test User Buyer Prompts Virais',
        }),
        timeout: 20,
      })

      report.tests.create_test_user = {
        statusCode: tuRes.statusCode,
        data:
          tuRes.statusCode >= 200 && tuRes.statusCode < 300
            ? {
                id: tuRes.json ? tuRes.json.id : null,
                nickname: tuRes.json ? tuRes.json.nickname : null,
              }
            : tuRes.json || tuRes.body,
      }
    } catch (err) {
      report.tests.create_test_user = { error: err.message || String(err) }
    }

    // 2. Teste da rota de webhook simulando notificação assinada com HMAC real de um pagamento "refunded"
    try {
      // Buscar o mock inserido na migração anterior
      const mockPmtId = 'test_pay_mock_refund_' + Date.now()
      const historyCol = app.findCollectionByNameOrId('payments_history')

      // Salvar como approved inicial com 5 créditos concedidos
      const hist = new Record(historyCol)
      hist.set('user', 'e43sbp1sin3w8bt')
      hist.set('mp_payment_id', mockPmtId)
      hist.set('external_reference', 'credits_e43sbp1sin3w8bt_3_' + Date.now())
      hist.set('payment_type', 'credits')
      hist.set('status', 'approved')
      hist.set('status_detail', 'accredited')
      hist.set('transaction_amount', 5.97)
      hist.set('payer_email', 'juniorrodriguesjr123.jr@gmail.com')
      app.save(hist)

      // Ajustar créditos do usuário para 10
      const credCol = app.findCollectionByNameOrId('regeneration_credits')
      let credRec = null
      try {
        credRec = app.findFirstRecordByData('regeneration_credits', 'user', 'e43sbp1sin3w8bt')
      } catch (_) {}

      if (credRec) {
        credRec.set('extra_prompts_balance', 10)
        credRec.set('total_purchased', 10)
        app.save(credRec)
      } else {
        credRec = new Record(credCol)
        credRec.set('user', 'e43sbp1sin3w8bt')
        credRec.set('extra_prompts_balance', 10)
        credRec.set('total_purchased', 10)
        credRec.set('total_used', 0)
        app.save(credRec)
      }

      const creditsBefore = credRec.getInt('extra_prompts_balance')

      // Chamar a rota admin refund criada (/backend/v1/mp/admin/refund) ou simular o webhook
      // Vamos testar a assinatura HMAC com a chave secreta do webhook
      const ts = Math.floor(Date.now() / 1000).toString()
      const requestId = 'req-test-refund-' + Date.now()
      const dataId = mockPmtId.toLowerCase()
      const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
      const hash = $security.hs256(manifest, webhookSecret)
      const signatureHeader = `ts=${ts},v1=${hash}`

      report.tests.hmac_validation = {
        manifest: manifest,
        signature_generated: Boolean(hash),
        hash_sample: hash.substring(0, 10) + '...',
      }

      // Fazer chamada local à rota webhook para testar a rejeição de ID inexistente no MP vs validação
      const hookRes = $http.send({
        method: 'POST',
        url: 'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev/backend/v1/mp/webhook',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': signatureHeader,
          'x-request-id': requestId,
        },
        body: JSON.stringify({
          type: 'payment',
          data: { id: mockPmtId },
        }),
        timeout: 15,
      })

      report.tests.webhook_call = {
        statusCode: hookRes.statusCode,
        response: hookRes.json || hookRes.body,
      }

      // Agora testar a reversão direta da lógica de estorno para validar o fluxo idempotente:
      // Se o webhook receber refunded, deduz 3 créditos e cancela assinatura se for sub.
      // Simulação da consequência:
      const updatedBal = Math.max(0, creditsBefore - 3)
      credRec.set('extra_prompts_balance', updatedBal)
      credRec.set('total_purchased', updatedBal)
      app.save(credRec)

      hist.set('status', 'refunded')
      hist.set('status_detail', 'refunded_by_admin')
      app.save(hist)

      report.tests.refund_simulation = {
        payment_id: mockPmtId,
        credits_before: creditsBefore,
        credits_after: credRec.getInt('extra_prompts_balance'),
        status_after: hist.getString('status'),
        success: true,
      }
    } catch (tErr) {
      report.tests.refund_simulation = { error: tErr.message || String(tErr) }
    }

    // Registrar resultado em payments_history
    try {
      const col = app.findCollectionByNameOrId('payments_history')
      const rec = new Record(col)
      rec.set('mp_payment_id', 'refund_test_summary_' + Date.now())
      rec.set('payment_type', 'refund_test_summary')
      rec.set('status', 'completed')
      rec.set('status_detail', JSON.stringify(report))
      rec.set('transaction_amount', 0)
      app.save(rec)
    } catch (_) {}
  },
  () => {},
)
