/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Pagamentos Mercado Pago (APIs oficiais):
 * 1. GET  /backend/v1/mp/config-status
 * 2. POST /backend/v1/mp/create-checkout
 * 3. POST /backend/v1/mp/webhook
 * 4. POST /backend/v1/mp/cancel-subscription
 * 5. GET  /backend/v1/mp/admin/overview
 * 6. POST /backend/v1/mp/admin/refund
 *
 * REGRA CRÍTICA POCKETBASE JSVM:
 * Todas as funções utilitárias e variáveis ficam INLINE dentro do corpo de cada callback de rota
 * para evitar ReferenceError no pool JSVM.
 */

// -------------------------------------------------------------
// ROTA 1: GET /backend/v1/mp/config-status
// -------------------------------------------------------------
routerAdd('GET', '/backend/v1/mp/config-status', (e) => {
  try {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()
    const isConfigured = Boolean(token)

    // Detecção da validade do formato do token:
    // Token real do Mercado Pago começa com APP_USR- (produção) ou TEST- (sandbox) e tem 70~80 chars
    const isTestToken = token.startsWith('TEST-')
    const isProductionToken = token.startsWith('APP_USR-')
    const isValidFormat = (isTestToken || isProductionToken) && token.length >= 35

    let message = ''
    if (!token) {
      message =
        'Pagamentos em configuração: o administrador precisa inserir MERCADO_PAGO_ACCESS_TOKEN nas variáveis de ambiente do Skip Cloud.'
    } else if (!isValidFormat) {
      message =
        `Atenção: o Access Token salvo no painel é inválido ou incompleto (apenas ${token.length} caracteres). ` +
        'O Mercado Pago exige um Access Token completo que começa com "APP_USR-" (produção) ou "TEST-" (testes). ' +
        'Acesse o portal Mercado Pago Developers -> Suas Integrações -> Credenciais para copiar o Access Token completo.'
    } else if (isTestToken) {
      message = 'Mercado Pago conectado em Modo de Teste (Token Sandbox TEST-).'
    } else {
      message = 'Mercado Pago conectado e pronto para processamento real em produção.'
    }

    // Se o cliente passar ?run_e2e=true, executa o teste E2E completo no servidor
    const reqInfo = e.requestInfo()
    const query = reqInfo.query || {}
    let e2eReport = null

    if (query.run_e2e === 'true' || query.run_e2e === '1') {
      let siteUrl = ($os.getenv('SITE_URL') || '').trim()
      if (!siteUrl) siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
      siteUrl = siteUrl.replace(/\/+$/, '')

      // Se for fornecido email na query (?payer_email=...), usa-o; caso contrário usa o email do admin ou cliente
      let testUserEmail = (query.payer_email || 'juniorrodriguesjr123.jr@gmail.com').trim()
      let testUserId = 'e43sbp1sin3w8bt'
      try {
        const u = $app.findAuthRecordByEmail('_pb_users_auth_', testUserEmail)
        if (u) testUserId = u.id
      } catch (_) {}

      e2eReport = {
        executed_at: new Date().toISOString(),
        tested_payer_email: testUserEmail,
        checkouts: {},
        webhooks: {},
      }

      // 1. Mensal PRO (R$ 19,90) - Teste do fluxo real (com fallback para preapproval_plan)
      try {
        const preExtRef = `test_sub_${testUserId}_monthly_${Date.now()}`
        let preStatus = 0
        let preId = null
        let preInitPoint = null
        let preErr = null
        let preMode = ''

        // Tentativa 1: POST /preapproval
        const preRes = $http.send({
          method: 'POST',
          url: 'https://api.mercadopago.com/preapproval',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: 'Plano PRO Mensal - Prompts Virais Shop',
            external_reference: preExtRef,
            payer_email: testUserEmail,
            back_url: `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=monthly`,
            auto_recurring: {
              frequency: 1,
              frequency_type: 'months',
              transaction_amount: 19.9,
              currency_id: 'BRL',
            },
          }),
          timeout: 30,
        })

        if (preRes.statusCode >= 200 && preRes.statusCode < 300) {
          const mpData = preRes.json || {}
          preStatus = preRes.statusCode
          preId = mpData.id || null
          preInitPoint = mpData.init_point || null
          preMode = 'direct_preapproval'
        } else {
          // Fallback para preapproval_plan
          const planRes = $http.send({
            method: 'POST',
            url: 'https://api.mercadopago.com/preapproval_plan',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reason: 'Plano PRO Mensal - Prompts Virais Shop',
              auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: 19.9,
                currency_id: 'BRL',
              },
              back_url: `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=monthly`,
            }),
            timeout: 30,
          })

          preStatus = planRes.statusCode
          if (planRes.statusCode >= 200 && planRes.statusCode < 300) {
            const pData = planRes.json || {}
            preId = pData.id || null
            preInitPoint = pData.init_point || null
            preMode = 'preapproval_plan_subscription'
          } else {
            preErr = planRes.json || planRes.body || preRes.json || preRes.body
          }
        }

        // Inspeção da conta do vendedor (GET /users/me)
        let sellerInfo = null
        try {
          const meRes = $http.send({
            method: 'GET',
            url: 'https://api.mercadopago.com/users/me',
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10,
          })
          if (meRes.statusCode === 200) {
            const j = meRes.json || {}
            sellerInfo = {
              id: j.id,
              nickname: j.nickname,
              site_id: j.site_id,
              email: j.email,
            }
          }
        } catch (_) {}

        e2eReport.checkouts.monthly_pro = {
          http_status: preStatus,
          success: preStatus >= 200 && preStatus < 300,
          mode: preMode,
          id: preId,
          init_point: preInitPoint,
          external_reference: preExtRef,
          direct_preapproval_error: preRes.statusCode >= 300 ? preRes.json || preRes.body : null,
          seller_account: sellerInfo,
          error_details: preErr,
        }
      } catch (mErr) {
        e2eReport.checkouts.monthly_pro = {
          http_status: 500,
          success: false,
          error: mErr.message || String(mErr),
        }
      }

      // 2. Anual VIP (R$ 238,80) - Preferences Checkout Pro
      try {
        const annExtRef = `test_sub_${testUserId}_annual_${Date.now()}`
        const annRes = $http.send({
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
                description: 'Acesso anual completo à biblioteca de roteiros e geradores.',
                quantity: 1,
                unit_price: 238.8,
                currency_id: 'BRL',
              },
            ],
            payer: { email: testUserEmail },
            external_reference: annExtRef,
            back_urls: {
              success: `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=annual`,
              pending: `${siteUrl}/checkout/sucesso?status=pendente`,
              failure: `${siteUrl}/planos?status=falha`,
            },
            auto_return: 'approved',
            notification_url: `${siteUrl}/backend/v1/mp/webhook`,
          }),
          timeout: 30,
        })
        const annData = annRes.json || {}
        e2eReport.checkouts.annual_vip = {
          http_status: annRes.statusCode,
          success: annRes.statusCode >= 200 && annRes.statusCode < 300,
          preference_id: annData.id || null,
          init_point: annData.init_point || null,
          sandbox_init_point: annData.sandbox_init_point || null,
          external_reference: annExtRef,
          error_details: annRes.statusCode >= 300 ? annRes.json || annRes.body : null,
        }
      } catch (aErr) {
        e2eReport.checkouts.annual_vip = {
          http_status: 500,
          success: false,
          error: aErr.message || String(aErr),
        }
      }

      // 3. Créditos extras (R$ 1,99) - Preferences Checkout Pro
      try {
        const credExtRef = `test_credits_${testUserId}_1_${Date.now()}`
        const credRes = $http.send({
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
            payer: { email: testUserEmail },
            external_reference: credExtRef,
            back_urls: {
              success: `${siteUrl}/checkout/sucesso?tipo=creditos&qtd=1`,
              pending: `${siteUrl}/checkout/sucesso?status=pendente`,
              failure: `${siteUrl}/planos?status=falha`,
            },
            auto_return: 'approved',
            notification_url: `${siteUrl}/backend/v1/mp/webhook`,
          }),
          timeout: 30,
        })
        const credData = credRes.json || {}
        e2eReport.checkouts.credits_extra = {
          http_status: credRes.statusCode,
          success: credRes.statusCode >= 200 && credRes.statusCode < 300,
          preference_id: credData.id || null,
          init_point: credData.init_point || null,
          sandbox_init_point: credData.sandbox_init_point || null,
          external_reference: credExtRef,
          error_details: credRes.statusCode >= 300 ? credRes.json || credRes.body : null,
        }
      } catch (cErr) {
        e2eReport.checkouts.credits_extra = {
          http_status: 500,
          success: false,
          error: cErr.message || String(cErr),
        }
      }

      // 4. Teste de rejeição de webhooks
      const countBefore = $app.countRecords('payments_history')
      const noSigRes = $http.send({
        method: 'POST',
        url: 'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev/backend/v1/mp/webhook',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'payment', data: { id: '999999999999' } }),
        timeout: 10,
      })
      const fakeSigRes = $http.send({
        method: 'POST',
        url: 'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev/backend/v1/mp/webhook',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': 'ts=1700000000,v1=badhash1234567890abcdef',
          'x-request-id': 'req-fake-test-001',
        },
        body: JSON.stringify({ type: 'payment', data: { id: '999999999999' } }),
        timeout: 10,
      })
      const countAfter = $app.countRecords('payments_history')

      e2eReport.webhooks = {
        no_signature_status: noSigRes.statusCode,
        no_signature_rejected: noSigRes.statusCode === 401,
        fake_signature_status: fakeSigRes.statusCode,
        fake_signature_rejected: fakeSigRes.statusCode === 401,
        db_records_unchanged: countBefore === countAfter,
      }
    }

    return e.json(200, {
      success: true,
      configured: isConfigured && isValidFormat,
      has_token: Boolean(token),
      has_webhook_secret: Boolean(webhookSecret),
      token_valid_format: isValidFormat,
      token_length: token.length,
      is_test_token: isTestToken,
      is_production_token: isProductionToken,
      webhook_url: 'https://prompts-virais-shop-16b33.goskip.app/backend/v1/mp/webhook',
      message: message,
      e2e_report: e2eReport,
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -------------------------------------------------------------
// ROTA 6: POST /backend/v1/mp/admin/refund
// Executa o estorno/reembolso oficial via API do Mercado Pago
// POST https://api.mercadopago.com/v1/payments/{payment_id}/refunds
// -------------------------------------------------------------
routerAdd('POST', '/backend/v1/mp/admin/refund', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, { success: false, error: 'Requer autenticação.' })
    }

    const email = (authUser.getString('email') || '').toLowerCase().trim()
    const isAdmin = authUser.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'
    if (!isAdmin) {
      return e.json(403, {
        success: false,
        error: 'Acesso restrito ao administrador do sistema.',
      })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    if (!token) {
      return e.json(503, {
        success: false,
        error: 'MERCADO_PAGO_ACCESS_TOKEN não está configurado no servidor.',
      })
    }

    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}
    const paymentId = (body.payment_id || body.mp_payment_id || '').toString().trim()
    const refundAmount = body.amount ? parseFloat(body.amount) : undefined

    if (!paymentId) {
      return e.json(400, {
        success: false,
        error: 'ID do pagamento (payment_id) é obrigatório.',
      })
    }

    console.log(`[mp-admin-refund] Iniciando reembolso para payment_id=${paymentId}...`)

    // Chamar a API oficial do Mercado Pago: POST /v1/payments/{id}/refunds
    // Header X-Idempotency-Key para evitar duplicidade
    const idempotencyKey = `refund_${paymentId}_${Date.now()}`
    const refundPayload = refundAmount && refundAmount > 0 ? { amount: refundAmount } : {}

    const mpRefundRes = $http.send({
      method: 'POST',
      url: `https://api.mercadopago.com/v1/payments/${paymentId}/refunds`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(refundPayload),
      timeout: 30,
    })

    const mpRefundData = mpRefundRes.json || {}
    const isSuccess = mpRefundRes.statusCode >= 200 && mpRefundRes.statusCode < 300

    if (!isSuccess) {
      console.warn(
        `[mp-admin-refund] Falha na API do MP: status=${mpRefundRes.statusCode}`,
        mpRefundData,
      )
      const errorMsg =
        mpRefundData.message ||
        mpRefundData.error ||
        (Array.isArray(mpRefundData.cause) &&
          mpRefundData.cause[0] &&
          mpRefundData.cause[0].description) ||
        `Erro ao estornar pagamento na API do Mercado Pago (Status ${mpRefundRes.statusCode}).`

      return e.json(mpRefundRes.statusCode || 400, {
        success: false,
        error: errorMsg,
        details: mpRefundData,
      })
    }

    console.log(`[mp-admin-refund] Reembolso aprovado na API do MP! ID=${mpRefundData.id}`)

    // Consultar o pagamento atualizado no MP para saber detalhes completos
    let updatedPaymentData = null
    try {
      const getPmt = $http.send({
        method: 'GET',
        url: `https://api.mercadopago.com/v1/payments/${paymentId}`,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15,
      })
      if (getPmt.statusCode === 200) {
        updatedPaymentData = getPmt.json || {}
      }
    } catch (_) {}

    // Atualizar registro no banco de dados local (payments_history)
    let historyRec = null
    try {
      historyRec = $app.findFirstRecordByData('payments_history', 'mp_payment_id', paymentId)
    } catch (_) {}

    if (historyRec) {
      historyRec.set('status', 'refunded')
      historyRec.set('status_detail', 'refunded_by_admin')
      $app.save(historyRec)
    }

    // Aplicar as consequências no banco (assinatura ou créditos) caso o webhook demore a chegar
    let consequencesApplied = { subscription_cancelled: false, credits_deducted: 0 }
    let targetUserId = historyRec ? historyRec.getString('user') : ''
    let paymentType = historyRec ? historyRec.getString('payment_type') : ''
    let externalRef = historyRec ? historyRec.getString('external_reference') : ''

    if (updatedPaymentData && !targetUserId) {
      const payerEmail = (updatedPaymentData.payer && updatedPaymentData.payer.email) || ''
      if (payerEmail) {
        try {
          const u = $app.findAuthRecordByEmail('_pb_users_auth_', payerEmail)
          if (u) targetUserId = u.id
        } catch (_) {}
      }
      if (!externalRef) {
        externalRef = updatedPaymentData.external_reference || ''
      }
    }

    // 1. Assinatura: desativar / cancelar
    try {
      let linkedSubs = []
      try {
        linkedSubs = $app.findRecordsByFilter(
          'subscriptions',
          `mp_payment_id = "${paymentId}"`,
          '-created',
          5,
          0,
        )
      } catch (_) {}

      if ((!linkedSubs || linkedSubs.length === 0) && targetUserId && paymentType !== 'credits') {
        try {
          linkedSubs = $app.findRecordsByFilter(
            'subscriptions',
            `user = "${targetUserId}" && status = "active"`,
            '-created',
            5,
            0,
          )
        } catch (_) {}
      }

      if (linkedSubs && linkedSubs.length > 0) {
        for (let i = 0; i < linkedSubs.length; i++) {
          const s = linkedSubs[i]
          s.set('status', 'cancelled')
          $app.save(s)
          consequencesApplied.subscription_cancelled = true
        }
      }
    } catch (subErr) {
      console.warn('[mp-admin-refund] Erro ao atualizar assinatura:', subErr)
    }

    // 2. Créditos: deduzir
    if (paymentType === 'credits' || (externalRef && externalRef.includes('credits'))) {
      try {
        let creditsQty = 1
        if (externalRef) {
          const parts = externalRef.split('_')
          if (parts.length >= 3) {
            creditsQty = parseInt(parts[2] || '1', 10)
          }
        }
        if (targetUserId) {
          let credRec = null
          try {
            credRec = $app.findFirstRecordByData('regeneration_credits', 'user', targetUserId)
          } catch (_) {}

          if (credRec) {
            const currentBal = credRec.getInt('extra_prompts_balance') || 0
            const currentTot = credRec.getInt('total_purchased') || 0
            const newBal = Math.max(0, currentBal - creditsQty)
            const newTot = Math.max(0, currentTot - creditsQty)
            credRec.set('extra_prompts_balance', newBal)
            credRec.set('total_purchased', newTot)
            $app.save(credRec)
            consequencesApplied.credits_deducted = creditsQty
          }
        }
      } catch (credErr) {
        console.warn('[mp-admin-refund] Erro ao deduzir créditos:', credErr)
      }
    }

    return e.json(200, {
      success: true,
      message: 'Pagamento estornado com sucesso no Mercado Pago!',
      refund_id: mpRefundData.id,
      payment_id: paymentId,
      status: 'refunded',
      consequences: consequencesApplied,
      refund_data: mpRefundData,
    })
  } catch (err) {
    console.error('[mp-admin-refund] Erro interno:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})
// -------------------------------------------------------------
// ROTA 2: POST /backend/v1/mp/create-checkout
// -------------------------------------------------------------
routerAdd('POST', '/backend/v1/mp/create-checkout', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, {
        success: false,
        error: 'Você precisa estar logado para iniciar o checkout.',
      })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    if (!token) {
      return e.json(503, {
        success: false,
        code: 'PAYMENTS_NOT_CONFIGURED',
        error:
          'O sistema de pagamentos está em configuração. As credenciais oficiais do Mercado Pago ainda não foram configuradas.',
      })
    }

    // Validação preventiva do formato do token
    const isTokenFormatValid =
      (token.startsWith('APP_USR-') || token.startsWith('TEST-')) && token.length >= 35
    if (!isTokenFormatValid) {
      return e.json(400, {
        success: false,
        code: 'INVALID_ACCESS_TOKEN',
        error:
          'O Access Token do Mercado Pago configurado no sistema está incompleto ou inválido. ' +
          'O token deve começar com "APP_USR-" (produção) ou "TEST-" (sandbox) e conter a chave completa (~80 caracteres). ' +
          'Por favor, atualize o segredo MERCADO_PAGO_ACCESS_TOKEN nas configurações do Skip Cloud.',
      })
    }

    let siteUrl = ($os.getenv('SITE_URL') || '').trim()
    if (!siteUrl) {
      siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
    }
    siteUrl = siteUrl.replace(/\/+$/, '')

    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}
    const itemType = (body.type || 'subscription').toLowerCase().trim() // 'subscription' | 'credits'
    const plan = (body.plan || 'monthly').toLowerCase().trim() // 'monthly' | 'annual'
    const creditsQuantity = parseInt(body.quantity || '1', 10)

    const userEmail = authUser.getString('email') || ''
    const userId = authUser.id

    const checkoutMethod = (body.method || '').toLowerCase().trim() // se for 'checkout_pro', força Checkout Pro para plano mensal

    // FLUXO A: Assinatura Mensal PRO Recorrente (caso método não seja explicitamente checkout_pro)
    // O Mercado Pago oferece duas formas para assinatura:
    // 1) POST /preapproval (quando payer e collector são ambos reais ou ambos de teste)
    // 2) POST /preapproval_plan (plano recorrente hospedado pelo Mercado Pago com link público de assinatura em /subscriptions/checkout?preapproval_plan_id=...)
    // A abordagem com preapproval_plan é mais resiliente pois não exige que o payer seja pré-definido como test user caso a conta seja de teste.
    if (itemType === 'subscription' && plan === 'monthly' && checkoutMethod !== 'checkout_pro') {
      const externalRef = `sub_${userId}_monthly_${Date.now()}`
      const reason = 'Plano PRO Mensal - Prompts Virais Shop'
      const backUrl = `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=monthly`

      let initPoint = ''
      let preapprovalId = ''
      let successType = 'subscription_preapproval'

      // Tentativa 1: POST /preapproval direto
      const preapprovalPayload = {
        reason: reason,
        external_reference: externalRef,
        payer_email: userEmail,
        back_url: backUrl,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 19.9,
          currency_id: 'BRL',
        },
      }

      const res = $http.send({
        method: 'POST',
        url: 'https://api.mercadopago.com/preapproval',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preapprovalPayload),
        timeout: 30,
      })

      if (res.statusCode >= 200 && res.statusCode < 300) {
        const mpData = res.json || {}
        initPoint = mpData.init_point || ''
        preapprovalId = mpData.id || ''
      } else {
        // Fallback robusto: se /preapproval falhar (ex: Both payer and collector must be real or test users),
        // criamos via /preapproval_plan, que gera um init_point oficial do Mercado Pago para assinaturas recorrentes
        console.warn(
          '[mp-create-checkout] Tentativa preapproval direta retornou ' +
            res.statusCode +
            '. Tentando via /preapproval_plan...',
        )
        const planRes = $http.send({
          method: 'POST',
          url: 'https://api.mercadopago.com/preapproval_plan',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: reason,
            auto_recurring: {
              frequency: 1,
              frequency_type: 'months',
              transaction_amount: 19.9,
              currency_id: 'BRL',
            },
            back_url: backUrl,
          }),
          timeout: 30,
        })

        if (planRes.statusCode >= 200 && planRes.statusCode < 300) {
          const planData = planRes.json || {}
          initPoint = planData.init_point || ''
          preapprovalId = planData.id || ''
          successType = 'subscription_preapproval_plan'
        } else {
          const errDetail = res.json || res.body || planRes.json || planRes.body || ''
          console.warn(
            '[mp-create-checkout] Erro ao criar preapproval e preapproval_plan:',
            errDetail,
          )
          return e.json(res.statusCode || 500, {
            success: false,
            error:
              'Não foi possível criar o checkout de assinatura recorrente no Mercado Pago. Verifique as credenciais.',
            details: errDetail,
          })
        }
      }

      return e.json(200, {
        success: true,
        type: successType,
        init_point: initPoint,
        preapproval_id: preapprovalId,
        external_reference: externalRef,
      })
    }

    // FLUXO B: Checkout Pro (API /checkout/preferences)
    // Para Mensal (quando solicitado via Checkout Pro), Anual VIP (R$ 238,80) e Créditos Extras (R$ 1,99 unid)
    let preferenceItems = []
    let externalRef = ''
    let successBackUrl = ''

    if (itemType === 'subscription' && plan === 'annual') {
      externalRef = `sub_${userId}_annual_${Date.now()}`
      successBackUrl = `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=annual`
      preferenceItems = [
        {
          id: 'plan_annual_vip',
          title: 'Plano Anual VIP - Prompts Virais Shop (12 Meses)',
          description:
            'Acesso anual completo à biblioteca de roteiros e geradores de catálogo e virais.',
          quantity: 1,
          unit_price: 238.8,
          currency_id: 'BRL',
        },
      ]
    } else if (itemType === 'subscription' && plan === 'monthly') {
      externalRef = `sub_${userId}_monthly_${Date.now()}`
      successBackUrl = `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=monthly`
      preferenceItems = [
        {
          id: 'plan_monthly_pro',
          title: 'Plano Mensal PRO - Prompts Virais Shop (30 Dias)',
          description: 'Acesso por 30 dias à biblioteca completa de roteiros e geradores virais.',
          quantity: 1,
          unit_price: 19.9,
          currency_id: 'BRL',
        },
      ]
    } else if (itemType === 'credits') {
      const qty = Math.max(1, creditsQuantity || 1)
      externalRef = `credits_${userId}_${qty}_${Date.now()}`
      successBackUrl = `${siteUrl}/checkout/sucesso?tipo=creditos&qtd=${qty}`
      preferenceItems = [
        {
          id: `extra_credits_${qty}`,
          title: `${qty}x Prompt(s) Extra de Regeneração - Prompts Virais`,
          description: 'Créditos adicionais para adaptação e regeneração de roteiros virais.',
          quantity: qty,
          unit_price: 1.99,
          currency_id: 'BRL',
        },
      ]
    } else {
      return e.json(400, {
        success: false,
        error: 'Opção de plano ou item inválida para o checkout.',
      })
    }

    const preferencePayload = {
      items: preferenceItems,
      payer: {
        email: userEmail,
      },
      external_reference: externalRef,
      back_urls: {
        success: successBackUrl,
        pending: `${siteUrl}/checkout/sucesso?status=pendente`,
        failure: `${siteUrl}/planos?status=falha`,
      },
      auto_return: 'approved',
      notification_url: 'https://prompts-virais-shop-16b33.goskip.app/backend/v1/mp/webhook',
    }

    const prefRes = $http.send({
      method: 'POST',
      url: 'https://api.mercadopago.com/checkout/preferences',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferencePayload),
      timeout: 30,
    })

    if (prefRes.statusCode >= 200 && prefRes.statusCode < 300) {
      const prefData = prefRes.json || {}
      return e.json(200, {
        success: true,
        type: 'checkout_pro',
        init_point: prefData.init_point || '',
        sandbox_init_point: prefData.sandbox_init_point || '',
        preference_id: prefData.id || '',
        external_reference: externalRef,
      })
    } else {
      const errDetail = prefRes.json || prefRes.body || ''
      console.warn('[mp-create-checkout] Erro ao criar preferência:', prefRes.statusCode, errDetail)
      return e.json(prefRes.statusCode || 500, {
        success: false,
        error:
          'Não foi possível iniciar a preferência de pagamento no Mercado Pago. Verifique as credenciais.',
        details: errDetail,
      })
    }
  } catch (err) {
    console.error('[mp-create-checkout] Erro inesperado:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -------------------------------------------------------------
// ROTA 7: POST /backend/v1/mp/create-pix
// Gera cobrança Pix direta oficial via Mercado Pago API (POST /v1/payments)
// Retorna QR Code (imagem/base64), chave copia-e-cola (EMV), ticket_url e expiração
// -------------------------------------------------------------
routerAdd('POST', '/backend/v1/mp/create-pix', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, {
        success: false,
        error: 'Você precisa estar logado para gerar uma cobrança Pix.',
      })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    if (!token) {
      return e.json(503, {
        success: false,
        code: 'PAYMENTS_NOT_CONFIGURED',
        error:
          'O sistema de pagamentos Pix está aguardando configuração de credenciais no servidor.',
      })
    }

    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}
    const itemType = (body.type || 'credits').toLowerCase().trim() // 'credits' | 'subscription'
    const plan = (body.plan || 'monthly').toLowerCase().trim() // 'monthly' | 'annual'
    const creditsQuantity = parseInt(body.quantity || '1', 10)

    const userId = authUser.id
    const userEmail = (authUser.getString('email') || '').trim()
    const rawUserName = (authUser.getString('name') || '').trim()

    // Sanitizar payer: se name estiver vazio, usar prefixo do email antes do @; nunca enviar first_name vazio/nulo
    let emailPrefix = 'Cliente'
    if (userEmail && userEmail.includes('@')) {
      const p = userEmail
        .split('@')[0]
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .trim()
      if (p.length > 0) {
        emailPrefix = p.charAt(0).toUpperCase() + p.slice(1)
      }
    }

    const effectiveName = rawUserName || emailPrefix
    const nameParts = effectiveName.split(/\s+/).filter(Boolean)
    const firstName = (nameParts[0] || emailPrefix || 'Cliente').substring(0, 30)
    const lastName = (nameParts.slice(1).join(' ') || 'Cliente').substring(0, 30)

    let amount = 1.99
    let description = ''
    let externalRef = ''

    if (itemType === 'subscription') {
      if (plan === 'annual') {
        amount = 238.8
        description = 'Plano Anual VIP - Prompts Virais Shop (12 Meses)'
        externalRef = `sub_${userId}_annual_${Date.now()}`
      } else {
        amount = 19.9
        description = 'Plano PRO Mensal (30 Dias) - Prompts Virais Shop'
        externalRef = `sub_${userId}_monthly_${Date.now()}`
      }
    } else {
      const qty = Math.max(1, creditsQuantity || 1)
      amount = parseFloat((qty * 1.99).toFixed(2))
      description = `${qty}x Prompt(s) Extra de Regeneração - Prompts Virais`
      externalRef = `credits_${userId}_${qty}_${Date.now()}`
    }

    // Configuração de expiração: 30 minutos a partir de agora no formato ISO 8601 estrito aceito pelo MP (ex: YYYY-MM-DDTHH:mm:ss.000-00:00 ou .000Z)
    const expireTimestamp = Date.now() + 30 * 60 * 1000
    const expireDate = new Date(expireTimestamp)
    const isoString = expireDate.toISOString()
    // Garante milissegundos e timezone explícita compatível com a API de Pagamentos v1 do Mercado Pago
    const dateOfExpiration = isoString.includes('.') ? isoString.split('.')[0] + '.000Z' : isoString

    const idempotencyKey = `pix_${externalRef}`

    const pixPayload = {
      transaction_amount: amount,
      description: description,
      payment_method_id: 'pix',
      external_reference: externalRef,
      notification_url: 'https://prompts-virais-shop-16b33.goskip.app/backend/v1/mp/webhook',
      date_of_expiration: dateOfExpiration,
      payer: {
        email: userEmail || 'cliente@prompts-virais.com',
        first_name: firstName,
        last_name: lastName,
      },
    }

    console.log(
      `[mp-create-pix] Criando cobrança Pix de R$ ${amount} para user ${userId} (${externalRef})...`,
    )

    const mpRes = $http.send({
      method: 'POST',
      url: 'https://api.mercadopago.com/v1/payments',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(pixPayload),
      timeout: 30,
    })

    const mpData = mpRes.json || {}
    const isSuccess = mpRes.statusCode >= 200 && mpRes.statusCode < 300

    if (!isSuccess) {
      console.warn(`[mp-create-pix] Erro na API do MP (status ${mpRes.statusCode}):`, mpData)
      const errorMsg =
        mpData.message ||
        (Array.isArray(mpData.cause) && mpData.cause[0] && mpData.cause[0].description) ||
        'Não foi possível gerar a cobrança Pix no Mercado Pago.'

      return e.json(mpRes.statusCode || 400, {
        success: false,
        error: errorMsg,
        details: mpData,
      })
    }

    const pointOfInteraction = mpData.point_of_interaction || {}
    const transactionData = pointOfInteraction.transaction_data || {}

    const qrCode = transactionData.qr_code || '' // Código EMV Copia e Cola
    const qrCodeBase64 = transactionData.qr_code_base64 || '' // Imagem PNG em base64
    const ticketUrl = transactionData.ticket_url || '' // URL do recibo/página do MP com QR Code
    const paymentId = String(mpData.id || '')
    const status = mpData.status || 'pending'
    const statusDetail = mpData.status_detail || 'waiting_transfer'

    // Registrar pré-lançamento em payments_history para rastreabilidade imediata e idempotência
    try {
      const histCol = $app.findCollectionByNameOrId('payments_history')
      const newHist = new Record(histCol)
      newHist.set('user', userId)
      newHist.set('mp_payment_id', paymentId)
      newHist.set('external_reference', externalRef)
      newHist.set('payment_type', itemType === 'credits' ? 'credits' : 'subscription')
      newHist.set('status', status)
      newHist.set('status_detail', statusDetail)
      newHist.set('transaction_amount', amount)
      newHist.set('payer_email', userEmail)
      newHist.set('payment_method_id', 'pix')
      newHist.set(
        'raw_payload',
        JSON.stringify({
          id: paymentId,
          status: status,
          point_of_interaction: {
            transaction_data: {
              ticket_url: ticketUrl,
            },
          },
        }),
      )
      $app.save(newHist)
    } catch (saveHistErr) {
      console.warn('[mp-create-pix] Aviso ao registrar payments_history:', saveHistErr)
    }

    // Registrar evento de funil: checkout_start_pix
    try {
      const evCol = $app.findCollectionByNameOrId('events')
      const evRec = new Record(evCol)
      evRec.set('user', userId)
      evRec.set('event_type', 'checkout_start_pix')
      evRec.set(
        'metadata',
        JSON.stringify({
          payment_id: paymentId,
          amount: amount,
          type: itemType,
          plan: itemType === 'subscription' ? plan : undefined,
          quantity: itemType === 'credits' ? creditsQuantity : undefined,
        }),
      )
      $app.save(evRec)
    } catch (_) {}

    return e.json(200, {
      success: true,
      payment_id: paymentId,
      status: status,
      status_detail: statusDetail,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
      ticket_url: ticketUrl,
      external_reference: externalRef,
      transaction_amount: amount,
      date_of_expiration: dateOfExpiration,
      expires_in_minutes: 30,
      description: description,
    })
  } catch (err) {
    console.error('[mp-create-pix] Erro fatal:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -------------------------------------------------------------
// ROTA 8: GET /backend/v1/mp/check-payment
// Consulta o status atual de uma cobrança específica na API do MP
// Permite ao frontend fazer polling leve e instantâneo sem recarregar a tela
// -------------------------------------------------------------
routerAdd('GET', '/backend/v1/mp/check-payment', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, { success: false, error: 'Requer autenticação.' })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    if (!token) {
      return e.json(503, { success: false, error: 'Mercado Pago não configurado.' })
    }

    const reqInfo = e.requestInfo()
    const query = reqInfo.query || {}
    const paymentId = (query.payment_id || query.id || '').trim()

    if (!paymentId) {
      return e.json(400, { success: false, error: 'payment_id é obrigatório.' })
    }

    // Consultar o pagamento oficial na API do Mercado Pago
    const pmtRes = $http.send({
      method: 'GET',
      url: `https://api.mercadopago.com/v1/payments/${paymentId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 15,
    })

    if (pmtRes.statusCode !== 200) {
      return e.json(pmtRes.statusCode || 404, {
        success: false,
        error: 'Pagamento não localizado na API do Mercado Pago.',
      })
    }

    const pmtData = pmtRes.json || {}
    const status = (pmtData.status || '').toLowerCase()
    const statusDetail = pmtData.status_detail || ''
    const externalRef = pmtData.external_reference || ''
    const transactionAmount = pmtData.transaction_amount || 0
    const paymentMethodId = pmtData.payment_method_id || ''

    const isApproved = status === 'approved'

    // Se aprovado, sincronizar com o banco de dados (idempotência com o webhook)
    if (isApproved) {
      let histRec = null
      try {
        histRec = $app.findFirstRecordByData('payments_history', 'mp_payment_id', paymentId)
      } catch (_) {}

      const previousStatus = histRec ? histRec.getString('status') : ''

      if (histRec) {
        histRec.set('status', status)
        histRec.set('status_detail', statusDetail)
        $app.save(histRec)
      }

      // Se ainda não estava aprovado no banco, conceder benefício imediatamente
      if (previousStatus !== 'approved') {
        let targetUserId = authUser.id
        let isCreditsPayment = externalRef.includes('credits_')
        let planTarget = externalRef.includes('annual') ? 'annual' : 'monthly'
        let creditsQty = 1

        if (isCreditsPayment) {
          const parts = externalRef.split('_')
          if (parts.length >= 3) {
            creditsQty = parseInt(parts[2] || '1', 10)
          }
        }

        // Conceder créditos
        if (isCreditsPayment) {
          try {
            let credRecord = null
            try {
              credRecord = $app.findFirstRecordByData('regeneration_credits', 'user', targetUserId)
            } catch (_) {}

            if (credRecord) {
              const currentBal = credRecord.getInt('extra_prompts_balance') || 0
              const currentTot = credRecord.getInt('total_purchased') || 0
              credRecord.set('extra_prompts_balance', currentBal + creditsQty)
              credRecord.set('total_purchased', currentTot + creditsQty)
              $app.save(credRecord)
            } else {
              const credCol = $app.findCollectionByNameOrId('regeneration_credits')
              const newCred = new Record(credCol)
              newCred.set('user', targetUserId)
              newCred.set('extra_prompts_balance', creditsQty)
              newCred.set('total_purchased', creditsQty)
              newCred.set('total_used', 0)
              $app.save(newCred)
            }
          } catch (cErr) {
            console.warn('[mp-check-payment] Erro ao creditar:', cErr)
          }
        } else {
          // Conceder assinatura
          try {
            const now = new Date()
            const endDate = new Date()
            if (planTarget === 'annual') {
              endDate.setFullYear(now.getFullYear() + 1)
            } else {
              endDate.setMonth(now.getMonth() + 1)
            }

            let subRecord = null
            try {
              const subs = $app.findRecordsByFilter(
                'subscriptions',
                `user = "${targetUserId}"`,
                '-created',
                1,
                0,
              )
              if (subs && subs.length > 0) subRecord = subs[0]
            } catch (_) {}

            if (subRecord) {
              subRecord.set('plan', planTarget)
              subRecord.set('status', 'active')
              subRecord.set('start_date', now.toISOString())
              subRecord.set('end_date', endDate.toISOString())
              subRecord.set('mp_payment_id', paymentId)
              subRecord.set('external_reference', externalRef)
              $app.save(subRecord)
            } else {
              const subsCol = $app.findCollectionByNameOrId('subscriptions')
              const newSub = new Record(subsCol)
              newSub.set('user', targetUserId)
              newSub.set('plan', planTarget)
              newSub.set('status', 'active')
              newSub.set('start_date', now.toISOString())
              newSub.set('end_date', endDate.toISOString())
              newSub.set('mp_payment_id', paymentId)
              newSub.set('external_reference', externalRef)
              $app.save(newSub)
            }
          } catch (sErr) {
            console.warn('[mp-check-payment] Erro ao ativar sub:', sErr)
          }
        }
      }
    }

    return e.json(200, {
      success: true,
      payment_id: paymentId,
      status: status,
      status_detail: statusDetail,
      is_approved: isApproved,
      payment_method_id: paymentMethodId,
      transaction_amount: transactionAmount,
      external_reference: externalRef,
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -------------------------------------------------------------
// ROTA 3: POST /backend/v1/mp/webhook
// -------------------------------------------------------------
routerAdd('POST', '/backend/v1/mp/webhook', (e) => {
  try {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    const reqInfo = e.requestInfo()
    const headers = reqInfo.headers || {}
    const query = reqInfo.query || {}
    const body = reqInfo.body || {}

    // 1. Validação obrigatória de Assinatura HMAC via MERCADO_PAGO_WEBHOOK_SECRET
    // Qualquer requisição sem a assinatura correta é rejeitada imediatamente com 401
    if (webhookSecret) {
      const xSignature = headers['x-signature'] || headers['X-Signature'] || ''
      const xRequestId = headers['x-request-id'] || headers['X-Request-Id'] || ''

      if (!xSignature) {
        console.warn('[mp-webhook] Rejeitado: Cabeçalho x-signature ausente.')
        return e.json(401, { success: false, error: 'Assinatura x-signature ausente.' })
      }

      let ts = ''
      let hashV1 = ''
      const parts = xSignature.split(',')
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i].trim()
        if (p.startsWith('ts=')) ts = p.substring(3)
        if (p.startsWith('v1=')) hashV1 = p.substring(3)
      }

      const dataIdRaw = query['data.id'] || (body.data && body.data.id) || query['id'] || ''
      const dataIdLower = String(dataIdRaw).toLowerCase().trim()

      let manifest = ''
      if (dataIdLower) {
        manifest += `id:${dataIdLower};`
      }
      if (xRequestId) {
        manifest += `request-id:${xRequestId};`
      }
      if (ts) {
        manifest += `ts:${ts};`
      }

      const calculatedHash = $security.hs256(manifest, webhookSecret)
      if (calculatedHash !== hashV1) {
        console.warn('[mp-webhook] Rejeitado: Assinatura inválida HMAC.')
        return e.json(401, { success: false, error: 'Assinatura do webhook inválida.' })
      }
    }

    if (!token) {
      console.warn('[mp-webhook] MERCADO_PAGO_ACCESS_TOKEN ausente. Ignorando evento.')
      return e.json(503, { success: false, error: 'Mercado Pago não configurado.' })
    }

    // 2. Extrair tópico / tipo do evento recebido
    const eventType = (body.type || query.type || body.topic || query.topic || '').toLowerCase()
    const resourceId = query['data.id'] || (body.data && body.data.id) || body.id || query.id || ''

    if (!resourceId) {
      return e.json(200, { success: true, message: 'Evento sem resourceId ignorado.' })
    }

    console.log(`[mp-webhook] Recebido evento tipo="${eventType}" id="${resourceId}"`)

    // CASO A: Tópico PAYMENT (Checkout Pro ou cobrança avulsa)
    if (eventType === 'payment' || (!eventType && String(resourceId).length > 5)) {
      const pmtRes = $http.send({
        method: 'GET',
        url: `https://api.mercadopago.com/v1/payments/${resourceId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30,
      })

      if (pmtRes.statusCode !== 200) {
        console.warn(
          `[mp-webhook] Pagamento ${resourceId} não encontrado na API do MP (status ${pmtRes.statusCode}).`,
        )
        return e.json(200, { success: true, message: 'Pagamento não localizado na API do MP.' })
      }

      const pmtData = pmtRes.json || {}
      const pmtStatus = (pmtData.status || '').toLowerCase() // approved, pending, rejected, refunded, charged_back, cancelled
      const pmtStatusDetail = pmtData.status_detail || ''
      let externalRef = pmtData.external_reference || ''
      const payerEmail = (pmtData.payer && pmtData.payer.email) || ''
      const transactionAmount = pmtData.transaction_amount || 0
      const paymentMethodId = pmtData.payment_method_id || ''
      const cardInfo = pmtData.card || {}
      const cardLast4 = cardInfo.last_four_digits || ''
      const cardBrand =
        (pmtData.payment_method && pmtData.payment_method.id) || paymentMethodId || ''

      const isRefundOrChargeback =
        pmtStatus === 'refunded' ||
        pmtStatus === 'charged_back' ||
        pmtStatusDetail === 'refunded' ||
        pmtStatusDetail === 'by_admin' ||
        pmtStatusDetail === 'settled' ||
        pmtStatusDetail === 'reimbursed'

      let targetUserId = ''
      let isSubscriptionPayment = false
      let planTarget = 'monthly'
      let isCreditsPayment = false
      let creditsQty = 0

      // Tentar resgatar external_reference ou histórico prévio se o MP não retornar external_reference completo
      let existingHistoryRec = null
      try {
        existingHistoryRec = $app.findFirstRecordByData(
          'payments_history',
          'mp_payment_id',
          String(resourceId),
        )
      } catch (_) {}

      if (!externalRef && existingHistoryRec) {
        externalRef = existingHistoryRec.getString('external_reference') || ''
      }

      if (externalRef.startsWith('sub_') || externalRef.startsWith('test_sub_')) {
        const spl = externalRef.split('_')
        // formatos: sub_{userId}_{plan}_{timestamp} ou test_sub_{userId}_{plan}_{timestamp}
        if (externalRef.startsWith('test_sub_') && spl.length >= 4) {
          targetUserId = spl[2]
          planTarget = spl[3]
          isSubscriptionPayment = true
        } else if (spl.length >= 3) {
          targetUserId = spl[1]
          planTarget = spl[2]
          isSubscriptionPayment = true
        }
      } else if (externalRef.startsWith('credits_') || externalRef.startsWith('test_credits_')) {
        const spl = externalRef.split('_')
        if (externalRef.startsWith('test_credits_') && spl.length >= 4) {
          targetUserId = spl[2]
          creditsQty = parseInt(spl[3] || '1', 10)
          isCreditsPayment = true
        } else if (spl.length >= 3) {
          targetUserId = spl[1]
          creditsQty = parseInt(spl[2] || '1', 10)
          isCreditsPayment = true
        }
      }

      if (!targetUserId && existingHistoryRec) {
        targetUserId = existingHistoryRec.getString('user') || ''
        if (existingHistoryRec.getString('payment_type') === 'credits') {
          isCreditsPayment = true
        } else if (existingHistoryRec.getString('payment_type') === 'subscription') {
          isSubscriptionPayment = true
        }
      }

      if (!targetUserId && payerEmail) {
        try {
          const userRec = $app.findAuthRecordByEmail('_pb_users_auth_', payerEmail)
          if (userRec) targetUserId = userRec.id
        } catch (_) {}
      }

      // Idempotência: verificar o status salvo anteriormente
      let previousStatus = ''
      let alreadyRefunded = false
      if (existingHistoryRec) {
        previousStatus = existingHistoryRec.getString('status')
        alreadyRefunded = previousStatus === 'refunded' || previousStatus === 'charged_back'

        existingHistoryRec.set('status', pmtStatus)
        existingHistoryRec.set('status_detail', pmtStatusDetail)
        if (targetUserId && !existingHistoryRec.getString('user')) {
          existingHistoryRec.set('user', targetUserId)
        }
        $app.save(existingHistoryRec)

        // Se já foi processado como estorno anteriormente, encerra com idempotência
        if (isRefundOrChargeback && alreadyRefunded) {
          console.log(
            `[mp-webhook] Pagamento ${resourceId} já havia sido estornado anteriormente. Idempotência mantida.`,
          )
          return e.json(200, {
            success: true,
            idempotent: true,
            message: 'Reembolso já processado anteriormente.',
          })
        }

        // Se era approved e continua approved sem alteração, idempotência
        if (pmtStatus === 'approved' && previousStatus === 'approved') {
          console.log(
            `[mp-webhook] Pagamento ${resourceId} já processado anteriormente como approved.`,
          )
          return e.json(200, { success: true, message: 'Pagamento já processado anteriormente.' })
        }
      } else {
        try {
          const historyCol = $app.findCollectionByNameOrId('payments_history')
          const newHist = new Record(historyCol)
          if (targetUserId) newHist.set('user', targetUserId)
          newHist.set('mp_payment_id', String(resourceId))
          newHist.set('external_reference', externalRef)
          newHist.set('payment_type', isCreditsPayment ? 'credits' : 'subscription')
          newHist.set('status', pmtStatus)
          newHist.set('status_detail', pmtStatusDetail)
          newHist.set('transaction_amount', transactionAmount)
          newHist.set('payer_email', payerEmail)
          newHist.set('payment_method_id', paymentMethodId)
          newHist.set('raw_payload', JSON.stringify(pmtData))
          $app.save(newHist)
          existingHistoryRec = newHist
        } catch (histErr) {
          console.warn('[mp-webhook] Erro ao salvar histórico:', histErr)
        }
      }

      // =========================================================================
      // CASO A.1: PAGAMENTO REEMBOLSADO OU CHARGEBACK (REVERSÃO AUTOMÁTICA)
      // =========================================================================
      if (isRefundOrChargeback) {
        console.log(
          `[mp-webhook] REEMBOLSO DETECTADO para pagamento ${resourceId}! Status=${pmtStatus}, Detail=${pmtStatusDetail}, User=${targetUserId}`,
        )

        // A) Se era assinatura (mensal / anual) -> marcar subscription como cancelled/expired com motivo refunded
        // Tentar encontrar a subscription vinculada por mp_payment_id ou pelo user
        try {
          let userSubs = []
          try {
            userSubs = $app.findRecordsByFilter(
              'subscriptions',
              `mp_payment_id = "${resourceId}"`,
              '-created',
              5,
              0,
            )
          } catch (_) {}

          if ((!userSubs || userSubs.length === 0) && targetUserId) {
            try {
              userSubs = $app.findRecordsByFilter(
                'subscriptions',
                `user = "${targetUserId}" && status = "active"`,
                '-created',
                5,
                0,
              )
            } catch (_) {}
          }

          if (userSubs && userSubs.length > 0) {
            for (let sIdx = 0; sIdx < userSubs.length; sIdx++) {
              const sRec = userSubs[sIdx]
              sRec.set('status', 'cancelled')
              $app.save(sRec)
              console.log(
                `[mp-webhook] Assinatura ${sRec.id} do usuário ${sRec.getString('user')} CANCELADA por REEMBOLSO (payment ${resourceId}).`,
              )
            }
          }
        } catch (subRefundErr) {
          console.error('[mp-webhook] Erro ao reverter assinatura por reembolso:', subRefundErr)
        }

        // B) Se era compra de créditos de regeneração -> descontar os créditos creditados (sem ficar negativo)
        if (isCreditsPayment || creditsQty > 0) {
          try {
            const qtyToDeduct = creditsQty > 0 ? creditsQty : 1
            if (targetUserId) {
              let credRecord = null
              try {
                credRecord = $app.findFirstRecordByData(
                  'regeneration_credits',
                  'user',
                  targetUserId,
                )
              } catch (_) {}

              if (credRecord) {
                const currentBalance = credRecord.getInt('extra_prompts_balance') || 0
                const currentTotalPurchased = credRecord.getInt('total_purchased') || 0
                const newBalance = Math.max(0, currentBalance - qtyToDeduct)
                const newTotalPurchased = Math.max(0, currentTotalPurchased - qtyToDeduct)

                credRecord.set('extra_prompts_balance', newBalance)
                credRecord.set('total_purchased', newTotalPurchased)
                $app.save(credRecord)

                console.log(
                  `[mp-webhook] Créditos revertidos para o usuário ${targetUserId}. Saldo anterior: ${currentBalance}, novo saldo: ${newBalance} (deduzidos ${qtyToDeduct}).`,
                )
              }
            }
          } catch (credRefundErr) {
            console.error('[mp-webhook] Erro ao reverter créditos por reembolso:', credRefundErr)
          }
        }

        return e.json(200, {
          success: true,
          action: 'refund_processed',
          processed_payment: resourceId,
          status: pmtStatus,
          status_detail: pmtStatusDetail,
        })
      }

      // =========================================================================
      // CASO A.2: PAGAMENTO APROVADO (CONCESSÃO DE ASSINATURA OU CRÉDITOS)
      // =========================================================================
      if (targetUserId && pmtStatus === 'approved') {
        // Registrar evento de funil: payment_confirmed
        try {
          const evCol = $app.findCollectionByNameOrId('events')
          const evRec = new Record(evCol)
          evRec.set('user', targetUserId)
          evRec.set('event_type', 'payment_confirmed')
          evRec.set(
            'metadata',
            JSON.stringify({
              payment_id: String(resourceId),
              payment_type: isCreditsPayment ? 'credits' : 'subscription',
              amount: transactionAmount,
              plan: planTarget,
            }),
          )
          $app.save(evRec)
        } catch (_) {}
        if (isCreditsPayment && creditsQty > 0) {
          try {
            let credRecord = null
            try {
              credRecord = $app.findFirstRecordByData('regeneration_credits', 'user', targetUserId)
            } catch (_) {}

            if (credRecord) {
              const currentBalance = credRecord.getInt('extra_prompts_balance') || 0
              const totalPurchased = credRecord.getInt('total_purchased') || 0
              credRecord.set('extra_prompts_balance', currentBalance + creditsQty)
              credRecord.set('total_purchased', totalPurchased + creditsQty)
              if (cardLast4) credRecord.set('last_purchase_card_last4', cardLast4)
              $app.save(credRecord)
            } else {
              const credCol = $app.findCollectionByNameOrId('regeneration_credits')
              const newCred = new Record(credCol)
              newCred.set('user', targetUserId)
              newCred.set('extra_prompts_balance', creditsQty)
              newCred.set('total_purchased', creditsQty)
              newCred.set('total_used', 0)
              if (cardLast4) newCred.set('last_purchase_card_last4', cardLast4)
              $app.save(newCred)
            }
            console.log(
              `[mp-webhook] Concedidos ${creditsQty} créditos para usuário ${targetUserId}`,
            )
          } catch (cErr) {
            console.error('[mp-webhook] Erro ao conceder créditos:', cErr)
          }
        } else {
          // Ativação da assinatura
          try {
            const now = new Date()
            const endDate = new Date()
            if (planTarget === 'annual') {
              endDate.setFullYear(now.getFullYear() + 1)
            } else {
              endDate.setMonth(now.getMonth() + 1)
            }

            let subRecord = null
            try {
              const userSubs = $app.findRecordsByFilter(
                'subscriptions',
                `user = "${targetUserId}"`,
                '-created',
                1,
                0,
              )
              if (userSubs && userSubs.length > 0) {
                subRecord = userSubs[0]
              }
            } catch (_) {}

            let activeSubToNotify = null
            if (subRecord) {
              subRecord.set('plan', planTarget)
              subRecord.set('status', 'active')
              subRecord.set('start_date', now.toISOString())
              subRecord.set('end_date', endDate.toISOString())
              subRecord.set('mp_payment_id', String(resourceId))
              subRecord.set('external_reference', externalRef)
              subRecord.set('payer_email', payerEmail)
              if (cardLast4) subRecord.set('card_last4', cardLast4)
              if (cardBrand) subRecord.set('card_brand', cardBrand)
              $app.save(subRecord)
              activeSubToNotify = subRecord
            } else {
              const subsCol = $app.findCollectionByNameOrId('subscriptions')
              const newSub = new Record(subsCol)
              newSub.set('user', targetUserId)
              newSub.set('plan', planTarget)
              newSub.set('status', 'active')
              newSub.set('start_date', now.toISOString())
              newSub.set('end_date', endDate.toISOString())
              newSub.set('mp_payment_id', String(resourceId))
              newSub.set('external_reference', externalRef)
              newSub.set('payer_email', payerEmail)
              newSub.set('card_last4', cardLast4 || '4242')
              newSub.set('card_brand', cardBrand || 'Mastercard')
              $app.save(newSub)
              activeSubToNotify = newSub
            }

            // Disparo transacional de Confirmação de Assinatura (idempotente)
            try {
              if (activeSubToNotify && !activeSubToNotify.getBool('welcome_sub_notified')) {
                let recipient = payerEmail
                let userName = 'Criador(a)'
                try {
                  const u = $app.findRecordById('_pb_users_auth_', targetUserId)
                  if (u) {
                    if (!recipient) recipient = u.email() || u.getString('email')
                    const un = u.getString('name')
                    if (un) userName = un
                  }
                } catch (_) {}

                if (recipient) {
                  let sEmail = 'noreply@prompts-virais.com'
                  let sName = 'Prompts Virais Shop'
                  try {
                    const st = $app.settings()
                    if (st && st.meta) {
                      if (st.meta.senderAddress) sEmail = st.meta.senderAddress
                      if (st.meta.senderName) sName = st.meta.senderName
                    }
                  } catch (_) {}

                  const planLabel = planTarget === 'annual' ? 'Anual VIP' : 'Mensal PRO'
                  const planAmount =
                    planTarget === 'annual' ? 'R$ 238,80 (12 meses)' : 'R$ 19,90/mês'
                  const validityStr =
                    planTarget === 'annual' ? '12 meses' : '30 dias (renovação automática)'

                  const subSubject = `Assinatura confirmada: Plano ${planLabel} ativado!`
                  const subHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Assinatura Confirmada</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #10b981; margin-top: 0;">🎉 Pagamento aprovado com sucesso!</h2>
    <p>Olá, ${userName}! Sua assinatura do <strong>Plano ${planLabel}</strong> no Prompts Virais Shop está ativa.</p>
    <div style="background: #1e293b; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>Plano:</strong> ${planLabel}</p>
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>Valor pago:</strong> ${planAmount}</p>
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>Validade:</strong> ${validityStr}</p>
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>ID da transação:</strong> ${resourceId}</p>
    </div>
    <p style="color: #cbd5e1;">Você já pode acessar todos os roteiros PRO e utilizar os geradores virais sem restrições.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${siteUrl}/biblioteca" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Acessar Biblioteca PRO →</a>
    </div>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">Prompts Virais Shop • E-mail transacional de confirmação de pagamento.</p>
  </div>
</body>
</html>`

                  try {
                    const msg = new MailerMessage({
                      from: { address: sEmail, name: sName },
                      to: [{ address: recipient }],
                      subject: subSubject,
                      html: subHtml,
                    })
                    $app.newMailClient().send(msg)
                    console.log(
                      `[mp-webhook] E-mail de confirmação de assinatura enviado para ${recipient}`,
                    )
                  } catch (mErr) {
                    console.warn(
                      `[mp-webhook] Mailer não pôde entregar e-mail de assinatura para ${recipient}:`,
                      mErr.message || String(mErr),
                    )
                  }

                  activeSubToNotify.set('welcome_sub_notified', true)
                  $app.save(activeSubToNotify)
                }
              }
            } catch (notifyErr) {
              console.warn(
                '[mp-webhook] Erro ao disparar e-mail de confirmação de assinatura:',
                notifyErr,
              )
            }

            console.log(
              `[mp-webhook] Assinatura ${planTarget} ativada para usuário ${targetUserId}`,
            )

            // 🎁 PROGRAMA DE INDICAÇÃO (AFILIADOS):
            // Se o usuário foi indicado por alguém (referred_by) e fechou plano pago (mensal ou anual),
            // verificar se o indicador também é assinante pago ativo. Se for, conceder +20 créditos PRO válidos por 30 dias!
            try {
              const targetUserRec = $app.findRecordById('_pb_users_auth_', targetUserId)
              const referrerId = targetUserRec ? targetUserRec.getString('referred_by') : ''

              if (referrerId && referrerId !== targetUserId) {
                // Verificar se o indicador é assinante pago ativo
                let referrerIsActive = false
                try {
                  const refSubs = $app.findRecordsByFilter(
                    'subscriptions',
                    `user = "${referrerId}" && status = "active" && (plan = "monthly" || plan = "annual")`,
                    '-created',
                    1,
                    0,
                  )
                  if (refSubs && refSubs.length > 0) {
                    referrerIsActive = true
                  }
                } catch (_) {}

                if (referrerIsActive) {
                  // Verificar se já não foi concedido crédito para este par (referrer + targetUserId)
                  let alreadyGranted = false
                  try {
                    const existingCreds = $app.findRecordsByFilter(
                      'referral_credits',
                      `referrer = "${referrerId}" && referred_user = "${targetUserId}"`,
                      '-created',
                      1,
                      0,
                    )
                    if (existingCreds && existingCreds.length > 0) {
                      alreadyGranted = true
                    }
                  } catch (_) {}

                  if (!alreadyGranted) {
                    const refCredCol = $app.findCollectionByNameOrId('referral_credits')
                    const newCred = new Record(refCredCol)
                    const expireAtDate = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

                    newCred.set('referrer', referrerId)
                    newCred.set('referred_user', targetUserId)
                    newCred.set('credits_granted', 20)
                    newCred.set('credits_remaining', 20)
                    newCred.set('expires_at', expireAtDate.toISOString())
                    newCred.set('status', 'active')
                    $app.save(newCred)

                    // Registrar evento no funil
                    try {
                      const evCol = $app.findCollectionByNameOrId('events')
                      const evRec = new Record(evCol)
                      evRec.set('user', referrerId)
                      evRec.set('event_type', 'referral_converted')
                      evRec.set(
                        'metadata',
                        JSON.stringify({
                          referred_user: targetUserId,
                          credits_granted: 20,
                          expires_at: expireAtDate.toISOString(),
                          plan: planTarget,
                        }),
                      )
                      $app.save(evRec)
                    } catch (_) {}

                    console.log(
                      `[mp-webhook] Indicação convertida! Usuário ${referrerId} recebeu +20 créditos válidos por 30 dias pela assinatura de ${targetUserId}`,
                    )
                  }
                }
              }
            } catch (refErr) {
              console.warn('[mp-webhook] Erro ao processar bônus de indicação:', refErr)
            }
          } catch (subSaveErr) {
            console.error('[mp-webhook] Erro ao salvar assinatura:', subSaveErr)
          }
        }
      } else if (targetUserId && (pmtStatus === 'rejected' || pmtStatus === 'cancelled')) {
        if (isSubscriptionPayment) {
          try {
            const userSubs = $app.findRecordsByFilter(
              'subscriptions',
              `user = "${targetUserId}" && mp_payment_id = "${resourceId}"`,
              '-created',
              1,
              0,
            )
            if (userSubs && userSubs.length > 0) {
              const sRec = userSubs[0]
              sRec.set('status', 'cancelled')
              $app.save(sRec)
              console.log(
                `[mp-webhook] Assinatura cancelada para usuário ${targetUserId} devido a pagamento ${pmtStatus}`,
              )
            }

            // Disparo transacional de Falha de Cobrança / Recusa
            try {
              let failRecipient = payerEmail
              let userName = 'Criador(a)'
              try {
                const u = $app.findRecordById('_pb_users_auth_', targetUserId)
                if (u) {
                  if (!failRecipient) failRecipient = u.email() || u.getString('email')
                  const un = u.getString('name')
                  if (un) userName = un
                }
              } catch (_) {}

              if (failRecipient) {
                let sEmail = 'noreply@prompts-virais.com'
                let sName = 'Prompts Virais Shop'
                try {
                  const st = $app.settings()
                  if (st && st.meta) {
                    if (st.meta.senderAddress) sEmail = st.meta.senderAddress
                    if (st.meta.senderName) sName = st.meta.senderName
                  }
                } catch (_) {}

                const failSubject = 'Aviso: Falha no pagamento da sua assinatura - Prompts Virais'
                const failHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Pagamento Recusado</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #ef4444; margin-top: 0;">⚠️ Pagamento não aprovado</h2>
    <p>Olá, ${userName}.</p>
    <p>A tentativa de cobrança da sua assinatura no Prompts Virais Shop não foi autorizada pelo Mercado Pago ou pela operadora do seu cartão (Status: <strong>${pmtStatus}</strong>).</p>
    <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #cbd5e1; font-size: 14px;">Para evitar a interrupção do seu acesso aos roteiros PRO e geradores virais, por favor atualize seu cartão ou selecione outra forma de pagamento (Pix / Cartão).</p>
    </div>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${siteUrl}/planos" style="display: inline-block; background: #ef4444; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Regularizar Assinatura →</a>
    </div>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">Prompts Virais Shop • Mensagem transacional de conta e cobrança.</p>
  </div>
</body>
</html>`

                try {
                  const msg = new MailerMessage({
                    from: { address: sEmail, name: sName },
                    to: [{ address: failRecipient }],
                    subject: failSubject,
                    html: failHtml,
                  })
                  $app.newMailClient().send(msg)
                  console.log(
                    `[mp-webhook] E-mail de falha de cobrança enviado para ${failRecipient}`,
                  )
                } catch (mErr) {
                  console.warn(
                    `[mp-webhook] Mailer não pôde entregar e-mail de falha para ${failRecipient}:`,
                    mErr.message || String(mErr),
                  )
                }
              }
            } catch (failMailErr) {
              console.warn(
                '[mp-webhook] Erro ao disparar e-mail de falha de cobrança:',
                failMailErr,
              )
            }
          } catch (subCancelErr) {
            console.warn('[mp-webhook] Erro ao suspender assinatura:', subCancelErr)
          }
        }
      }

      return e.json(200, { success: true, processed_payment: resourceId, status: pmtStatus })
    }

    // CASO B: Tópico SUBSCRIPTION_PREAPPROVAL
    if (eventType === 'subscription_preapproval' || eventType === 'preapproval') {
      const preapprovalRes = $http.send({
        method: 'GET',
        url: `https://api.mercadopago.com/preapproval/${resourceId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30,
      })

      if (preapprovalRes.statusCode !== 200) {
        console.warn(
          `[mp-webhook] Preapproval ${resourceId} não localizado na API do MP (status ${preapprovalRes.statusCode})`,
        )
        return e.json(200, { success: true, message: 'Preapproval não localizado.' })
      }

      const preData = preapprovalRes.json || {}
      const preStatus = (preData.status || '').toLowerCase()
      const externalRef = preData.external_reference || ''
      const payerEmail = preData.payer_email || ''
      const nextPaymentDate = preData.next_payment_date || ''

      let targetUserId = ''
      if (externalRef.startsWith('sub_')) {
        const spl = externalRef.split('_')
        if (spl.length >= 2) targetUserId = spl[1]
      }
      if (!targetUserId && payerEmail) {
        try {
          const userRec = $app.findAuthRecordByEmail('_pb_users_auth_', payerEmail)
          if (userRec) targetUserId = userRec.id
        } catch (_) {}
      }

      if (targetUserId) {
        let subRecord = null
        try {
          const userSubs = $app.findRecordsByFilter(
            'subscriptions',
            `user = "${targetUserId}"`,
            '-created',
            1,
            0,
          )
          if (userSubs && userSubs.length > 0) subRecord = userSubs[0]
        } catch (_) {}

        if (preStatus === 'authorized') {
          // Registrar evento de funil: payment_confirmed
          try {
            const evCol = $app.findCollectionByNameOrId('events')
            const evRec = new Record(evCol)
            evRec.set('user', targetUserId)
            evRec.set('event_type', 'payment_confirmed')
            evRec.set(
              'metadata',
              JSON.stringify({
                preapproval_id: String(resourceId),
                payment_type: 'subscription_preapproval',
                plan: 'monthly',
              }),
            )
            $app.save(evRec)
          } catch (_) {}

          const now = new Date()
          const endDate = nextPaymentDate
            ? new Date(nextPaymentDate)
            : new Date(now.getTime() + 31 * 24 * 3600 * 1000)

          let preSubToNotify = null
          if (subRecord) {
            subRecord.set('plan', 'monthly')
            subRecord.set('status', 'active')
            subRecord.set('mp_preapproval_id', String(resourceId))
            subRecord.set('external_reference', externalRef)
            subRecord.set('payer_email', payerEmail)
            subRecord.set('start_date', now.toISOString())
            subRecord.set('end_date', endDate.toISOString())
            if (nextPaymentDate) subRecord.set('next_payment_date', nextPaymentDate)
            $app.save(subRecord)
            preSubToNotify = subRecord
          } else {
            const subsCol = $app.findCollectionByNameOrId('subscriptions')
            const newSub = new Record(subsCol)
            newSub.set('user', targetUserId)
            newSub.set('plan', 'monthly')
            newSub.set('status', 'active')
            newSub.set('mp_preapproval_id', String(resourceId))
            newSub.set('external_reference', externalRef)
            newSub.set('payer_email', payerEmail)
            newSub.set('start_date', now.toISOString())
            newSub.set('end_date', endDate.toISOString())
            if (nextPaymentDate) newSub.set('next_payment_date', nextPaymentDate)
            $app.save(newSub)
            preSubToNotify = newSub
          }

          // Disparo transacional de Confirmação de Assinatura Preapproval (idempotente)
          try {
            if (preSubToNotify && !preSubToNotify.getBool('welcome_sub_notified')) {
              let recipient = payerEmail
              let userName = 'Criador(a)'
              try {
                const u = $app.findRecordById('_pb_users_auth_', targetUserId)
                if (u) {
                  if (!recipient) recipient = u.email() || u.getString('email')
                  const un = u.getString('name')
                  if (un) userName = un
                }
              } catch (_) {}

              if (recipient) {
                let sEmail = 'noreply@prompts-virais.com'
                let sName = 'Prompts Virais Shop'
                try {
                  const st = $app.settings()
                  if (st && st.meta) {
                    if (st.meta.senderAddress) sEmail = st.meta.senderAddress
                    if (st.meta.senderName) sName = st.meta.senderName
                  }
                } catch (_) {}

                const subSubject = 'Assinatura confirmada: Plano Mensal PRO ativado!'
                const subHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Assinatura Confirmada</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #10b981; margin-top: 0;">🎉 Assinatura Mensal PRO confirmada!</h2>
    <p>Olá, ${userName}! Sua assinatura recorrente foi aprovada pelo Mercado Pago.</p>
    <div style="background: #1e293b; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>Plano:</strong> Mensal PRO</p>
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>Valor:</strong> R$ 19,90/mês</p>
      <p style="margin: 4px 0; color: #cbd5e1;"><strong>Próxima renovação:</strong> ${nextPaymentDate || 'Em 30 dias'}</p>
    </div>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${siteUrl}/biblioteca" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Acessar Biblioteca PRO →</a>
    </div>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">Prompts Virais Shop • E-mail transacional de assinatura.</p>
  </div>
</body>
</html>`

                try {
                  const msg = new MailerMessage({
                    from: { address: sEmail, name: sName },
                    to: [{ address: recipient }],
                    subject: subSubject,
                    html: subHtml,
                  })
                  $app.newMailClient().send(msg)
                  console.log(
                    `[mp-webhook] E-mail de confirmação preapproval enviado para ${recipient}`,
                  )
                } catch (mErr) {
                  console.warn(
                    `[mp-webhook] Mailer não pôde entregar e-mail para ${recipient}:`,
                    mErr.message || String(mErr),
                  )
                }

                preSubToNotify.set('welcome_sub_notified', true)
                $app.save(preSubToNotify)
              }
            }
          } catch (preNotifyErr) {
            console.warn(
              '[mp-webhook] Erro ao disparar e-mail de confirmação preapproval:',
              preNotifyErr,
            )
          }

          console.log(`[mp-webhook] Assinatura mensal ativada via preapproval para ${targetUserId}`)

          // 🎁 PROGRAMA DE INDICAÇÃO (AFILIADOS - PREAPPROVAL):
          try {
            const targetUserRec = $app.findRecordById('_pb_users_auth_', targetUserId)
            const referrerId = targetUserRec ? targetUserRec.getString('referred_by') : ''

            if (referrerId && referrerId !== targetUserId) {
              let referrerIsActive = false
              try {
                const refSubs = $app.findRecordsByFilter(
                  'subscriptions',
                  `user = "${referrerId}" && status = "active" && (plan = "monthly" || plan = "annual")`,
                  '-created',
                  1,
                  0,
                )
                if (refSubs && refSubs.length > 0) {
                  referrerIsActive = true
                }
              } catch (_) {}

              if (referrerIsActive) {
                let alreadyGranted = false
                try {
                  const existingCreds = $app.findRecordsByFilter(
                    'referral_credits',
                    `referrer = "${referrerId}" && referred_user = "${targetUserId}"`,
                    '-created',
                    1,
                    0,
                  )
                  if (existingCreds && existingCreds.length > 0) {
                    alreadyGranted = true
                  }
                } catch (_) {}

                if (!alreadyGranted) {
                  const refCredCol = $app.findCollectionByNameOrId('referral_credits')
                  const newCred = new Record(refCredCol)
                  const expireAtDate = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

                  newCred.set('referrer', referrerId)
                  newCred.set('referred_user', targetUserId)
                  newCred.set('credits_granted', 20)
                  newCred.set('credits_remaining', 20)
                  newCred.set('expires_at', expireAtDate.toISOString())
                  newCred.set('status', 'active')
                  $app.save(newCred)

                  try {
                    const evCol = $app.findCollectionByNameOrId('events')
                    const evRec = new Record(evCol)
                    evRec.set('user', referrerId)
                    evRec.set('event_type', 'referral_converted')
                    evRec.set(
                      'metadata',
                      JSON.stringify({
                        referred_user: targetUserId,
                        credits_granted: 20,
                        expires_at: expireAtDate.toISOString(),
                        plan: 'monthly_preapproval',
                      }),
                    )
                    $app.save(evRec)
                  } catch (_) {}
                  console.log(
                    `[mp-webhook] Indicação convertida via preapproval para ${referrerId}`,
                  )
                }
              }
            }
          } catch (refErr) {
            console.warn(
              '[mp-webhook] Erro ao processar bônus de indicação em preapproval:',
              refErr,
            )
          }
        } else if (preStatus === 'cancelled' || preStatus === 'paused') {
          if (subRecord) {
            subRecord.set('status', 'cancelled')
            $app.save(subRecord)
            console.log(
              `[mp-webhook] Assinatura cancelada para ${targetUserId} (preapproval status=${preStatus})`,
            )

            // Disparo transacional de Fim de Acesso / Cancelamento (idempotente)
            try {
              if (!subRecord.getBool('expiration_notified')) {
                let recipient = payerEmail
                let userName = 'Criador(a)'
                try {
                  const u = $app.findRecordById('_pb_users_auth_', targetUserId)
                  if (u) {
                    if (!recipient) recipient = u.email() || u.getString('email')
                    const un = u.getString('name')
                    if (un) userName = un
                  }
                } catch (_) {}

                if (recipient) {
                  let sEmail = 'noreply@prompts-virais.com'
                  let sName = 'Prompts Virais Shop'
                  try {
                    const st = $app.settings()
                    if (st && st.meta) {
                      if (st.meta.senderAddress) sEmail = st.meta.senderAddress
                      if (st.meta.senderName) sName = st.meta.senderName
                    }
                  } catch (_) {}

                  const endSubject = 'Sua assinatura no Prompts Virais Shop foi encerrada'
                  const endHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Assinatura Encerrada</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #ffffff; margin-top: 0;">Olá, ${userName}</h2>
    <p style="color: #cbd5e1;">Confirmamos que a renovação da sua assinatura PRO foi cancelada ou pausada (Status: ${preStatus}).</p>
    <p style="color: #94a3b8;">Seus prompts e histórico de geração continuam salvos na sua conta. Quando desejar reativar seus recursos PRO, basta acessar a página de planos.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${siteUrl}/planos" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reativar Plano PRO →</a>
    </div>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">Prompts Virais Shop • Mensagem transacional de conta.</p>
  </div>
</body>
</html>`

                  try {
                    const msg = new MailerMessage({
                      from: { address: sEmail, name: sName },
                      to: [{ address: recipient }],
                      subject: endSubject,
                      html: endHtml,
                    })
                    $app.newMailClient().send(msg)
                    console.log(`[mp-webhook] E-mail de encerramento enviado para ${recipient}`)
                  } catch (mErr) {
                    console.warn(
                      `[mp-webhook] Mailer não pôde entregar e-mail de encerramento para ${recipient}:`,
                      mErr.message || String(mErr),
                    )
                  }

                  subRecord.set('expiration_notified', true)
                  subRecord.set('expiration_notified_at', new Date().toISOString())
                  $app.save(subRecord)
                }
              }
            } catch (endMailErr) {
              console.warn('[mp-webhook] Erro ao disparar e-mail de cancelamento:', endMailErr)
            }
          }
          // Registrar evento de cancelamento
          try {
            const evCol = $app.findCollectionByNameOrId('events')
            const evRec = new Record(evCol)
            evRec.set('user', targetUserId)
            evRec.set('event_type', 'subscription_cancelled')
            evRec.set(
              'metadata',
              JSON.stringify({
                preapproval_id: String(resourceId),
                reason: 'preapproval_' + preStatus,
              }),
            )
            $app.save(evRec)
          } catch (_) {}
        }
      }

      return e.json(200, { success: true, processed_preapproval: resourceId, status: preStatus })
    }

    return e.json(200, { success: true, message: 'Evento recebido com sucesso.' })
  } catch (err) {
    console.error('[mp-webhook] Erro fatal:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -------------------------------------------------------------
// ROTA 4: POST /backend/v1/mp/cancel-subscription
// -------------------------------------------------------------
routerAdd('POST', '/backend/v1/mp/cancel-subscription', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, { success: false, error: 'Requer autenticação.' })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}
    const subscriptionId = (body.subscription_id || '').trim()

    let sub = null
    if (subscriptionId) {
      try {
        sub = $app.findRecordById('subscriptions', subscriptionId)
      } catch (_) {}
    } else {
      const subs = $app.findRecordsByFilter(
        'subscriptions',
        `user = "${authUser.id}" && status = "active"`,
        '-created',
        1,
        0,
      )
      if (subs && subs.length > 0) sub = subs[0]
    }

    if (!sub || sub.getString('user') !== authUser.id) {
      return e.json(404, { success: false, error: 'Assinatura ativa não encontrada.' })
    }

    const preapprovalId = sub.getString('mp_preapproval_id')

    let mpCancelled = false
    if (preapprovalId && token) {
      try {
        const mpRes = $http.send({
          method: 'PUT',
          url: `https://api.mercadopago.com/preapproval/${preapprovalId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'cancelled' }),
          timeout: 20,
        })
        if (mpRes.statusCode >= 200 && mpRes.statusCode < 300) {
          mpCancelled = true
        } else {
          console.warn('[cancel-subscription] MP PUT /preapproval status:', mpRes.statusCode)
        }
      } catch (mpErr) {
        console.warn('[cancel-subscription] Falha ao comunicar com MP:', mpErr)
      }
    }

    sub.set('status', 'cancelled')
    $app.save(sub)

    // Garantir que exista uma assinatura 'free' ativa para o usuário
    let freeSub = null
    try {
      const existingFree = $app.findRecordsByFilter(
        'subscriptions',
        `user = "${authUser.id}" && plan = "free"`,
        '-created',
        1,
        0,
      )
      if (existingFree && existingFree.length > 0) {
        freeSub = existingFree[0]
        freeSub.set('status', 'active')
        $app.save(freeSub)
      } else {
        const subsCol = $app.findCollectionByNameOrId('subscriptions')
        freeSub = new Record(subsCol)
        const now = new Date()
        const end = new Date()
        end.setFullYear(now.getFullYear() + 10)
        freeSub.set('user', authUser.id)
        freeSub.set('plan', 'free')
        freeSub.set('status', 'active')
        freeSub.set('start_date', now.toISOString())
        freeSub.set('end_date', end.toISOString())
        $app.save(freeSub)
      }
    } catch (freeErr) {
      console.warn('[cancel-subscription] Aviso ao reativar plano free:', freeErr)
    }

    // Registrar evento de cancelamento
    try {
      const evCol = $app.findCollectionByNameOrId('events')
      const evRec = new Record(evCol)
      evRec.set('user', authUser.id)
      evRec.set('event_type', 'subscription_cancelled')
      evRec.set(
        'metadata',
        JSON.stringify({
          subscription_id: sub.id,
          plan: sub.getString('plan'),
          payment_type: preapprovalId ? 'preapproval' : 'pix_or_single',
          reason: 'user_requested_cancellation',
        }),
      )
      $app.save(evRec)
    } catch (_) {}

    return e.json(200, {
      success: true,
      mp_cancelled: mpCancelled,
      message: 'Assinatura cancelada com sucesso.',
      subscription_id: sub.id,
      free_subscription_id: freeSub ? freeSub.id : null,
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -------------------------------------------------------------
// ROTA 5: GET /backend/v1/mp/admin/overview
// -------------------------------------------------------------
routerAdd('GET', '/backend/v1/mp/admin/overview', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, { success: false, error: 'Requer autenticação.' })
    }

    const email = (authUser.getString('email') || '').toLowerCase().trim()
    const isAdmin = authUser.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'
    if (!isAdmin) {
      return e.json(403, {
        success: false,
        error: 'Acesso restrito ao administrador do sistema.',
      })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const isConfigured = Boolean(token)

    let totalUsers = 0
    try {
      totalUsers = $app.countRecords('users')
    } catch (_) {
      try {
        const uList = $app.findRecordsByFilter('users', '', '', 10000, 0)
        totalUsers = uList ? uList.length : 0
      } catch (_) {}
    }

    let activeMonthlySubs = 0
    try {
      const mList = $app.findRecordsByFilter(
        'subscriptions',
        'status = "active" && plan = "monthly"',
        '',
        10000,
        0,
      )
      activeMonthlySubs = mList ? mList.length : 0
    } catch (_) {}

    let activeAnnualSubs = 0
    try {
      const aList = $app.findRecordsByFilter(
        'subscriptions',
        'status = "active" && plan = "annual"',
        '',
        10000,
        0,
      )
      activeAnnualSubs = aList ? aList.length : 0
    } catch (_) {}

    let cancelledSubs = 0
    try {
      const cList = $app.findRecordsByFilter('subscriptions', 'status = "cancelled"', '', 10000, 0)
      cancelledSubs = cList ? cList.length : 0
    } catch (_) {}

    const recentUsers = $app.findRecordsByFilter('users', '', '-created', 30, 0)
    const usersList = recentUsers.map((u) => ({
      id: u.id,
      name: u.getString('name'),
      email: u.getString('email'),
      is_admin: u.getBool('is_admin'),
      created: u.getDateTime('created'),
    }))

    const allSubs = $app.findRecordsByFilter('subscriptions', '', '-created', 50, 0)
    const subsList = allSubs.map((s) => ({
      id: s.id,
      user_id: s.getString('user'),
      plan: s.getString('plan'),
      status: s.getString('status'),
      mp_preapproval_id: s.getString('mp_preapproval_id'),
      mp_payment_id: s.getString('mp_payment_id'),
      payer_email: s.getString('payer_email'),
      start_date: s.getString('start_date'),
      end_date: s.getString('end_date'),
      next_payment_date: s.getString('next_payment_date'),
      created: s.getDateTime('created'),
    }))

    let paymentsHistory = []
    try {
      const pmts = $app.findRecordsByFilter('payments_history', '', '-created', 50, 0)
      paymentsHistory = pmts.map((p) => ({
        id: p.id,
        user_id: p.getString('user'),
        mp_payment_id: p.getString('mp_payment_id'),
        payment_type: p.getString('payment_type'),
        status: p.getString('status'),
        status_detail: p.getString('status_detail'),
        transaction_amount: p.getFloat('transaction_amount'),
        payer_email: p.getString('payer_email'),
        payment_method_id: p.getString('payment_method_id'),
        created: p.getDateTime('created'),
      }))
    } catch (_) {}

    return e.json(200, {
      success: true,
      is_configured: isConfigured,
      webhook_url: 'https://prompts-virais-shop-16b33.goskip.app/backend/v1/mp/webhook',
      metrics: {
        total_users: totalUsers,
        active_monthly_subscriptions: activeMonthlySubs,
        active_annual_subscriptions: activeAnnualSubs,
        total_active_subscriptions: activeMonthlySubs + activeAnnualSubs,
        cancelled_subscriptions: cancelledSubs,
      },
      users: usersList,
      subscriptions: subsList,
      payments: paymentsHistory,
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})
