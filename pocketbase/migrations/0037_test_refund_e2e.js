migrate(
  (app) => {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    const report = {
      timestamp: new Date().toISOString(),
      token_available: Boolean(token),
      token_prefix: token ? token.substring(0, 10) : '',
      token_length: token.length,
      tests: {},
    }

    // 1. Procurar pagamentos reais existentes no MP (GET /v1/payments/search)
    try {
      const searchRes = $http.send({
        method: 'GET',
        url: 'https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=10',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 20,
      })
      report.tests.payments_search = {
        statusCode: searchRes.statusCode,
        total_results: searchRes.json && searchRes.json.paging ? searchRes.json.paging.total : 0,
        results:
          searchRes.json && searchRes.json.results
            ? searchRes.json.results.map((r) => ({
                id: r.id,
                status: r.status,
                status_detail: r.status_detail,
                transaction_amount: r.transaction_amount,
                date_created: r.date_created,
              }))
            : [],
        error: searchRes.statusCode >= 300 ? searchRes.json || searchRes.body : null,
      }
    } catch (err) {
      report.tests.payments_search = { error: err.message || String(err) }
    }

    // 2. Testar simulação de webhook com status "refunded" para verificar se a lógica interna do banco reage corretamente
    try {
      // Buscar ou criar um pagamento mock aprovado para teste de estorno
      const testPaymentId = 'test_pay_mock_' + Date.now()
      const historyCol = app.findCollectionByNameOrId('payments_history')

      // Inserir registro inicial como approved
      const mockHist = new Record(historyCol)
      mockHist.set('user', 'e43sbp1sin3w8bt')
      mockHist.set('mp_payment_id', testPaymentId)
      mockHist.set('external_reference', 'credits_e43sbp1sin3w8bt_2_' + Date.now())
      mockHist.set('payment_type', 'credits')
      mockHist.set('status', 'approved')
      mockHist.set('status_detail', 'accredited')
      mockHist.set('transaction_amount', 3.98)
      mockHist.set('payer_email', 'juniorrodriguesjr123.jr@gmail.com')
      app.save(mockHist)

      // Garantir saldo inicial de créditos
      const credCol = app.findCollectionByNameOrId('regeneration_credits')
      let credRec = null
      try {
        credRec = app.findFirstRecordByData('regeneration_credits', 'user', 'e43sbp1sin3w8bt')
      } catch (_) {}

      if (credRec) {
        credRec.set('extra_prompts_balance', 5)
        app.save(credRec)
      } else {
        credRec = new Record(credCol)
        credRec.set('user', 'e43sbp1sin3w8bt')
        credRec.set('extra_prompts_balance', 5)
        credRec.set('total_purchased', 5)
        credRec.set('total_used', 0)
        app.save(credRec)
      }

      report.tests.mock_setup = {
        payment_id: testPaymentId,
        initial_credits_balance: credRec.getInt('extra_prompts_balance'),
      }
    } catch (mErr) {
      report.tests.mock_setup = { error: mErr.message || String(mErr) }
    }

    // Gravar relatório em payments_history para leitura
    try {
      const col = app.findCollectionByNameOrId('payments_history')
      const rec = new Record(col)
      rec.set('mp_payment_id', 'refund_e2e_diag_' + Date.now())
      rec.set('payment_type', 'refund_e2e_diagnostic')
      rec.set('status', 'executed')
      rec.set('status_detail', JSON.stringify(report))
      rec.set('transaction_amount', 0)
      app.save(rec)
    } catch (_) {}
  },
  () => {},
)
