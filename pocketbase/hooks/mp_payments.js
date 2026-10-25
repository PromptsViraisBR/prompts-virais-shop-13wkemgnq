/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Pagamentos Mercado Pago (APIs oficiais):
 * 1. GET  /backend/v1/mp/config-status
 * 2. POST /backend/v1/mp/create-checkout
 * 3. POST /backend/v1/mp/webhook
 * 4. POST /backend/v1/mp/cancel-subscription
 * 5. GET  /backend/v1/mp/admin/overview
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

    return e.json(200, {
      success: true,
      configured: isConfigured,
      has_token: Boolean(token),
      has_webhook_secret: Boolean(webhookSecret),
      webhook_url: 'https://prompts-virais-shop-16b33.goskip.app/backend/v1/mp/webhook',
      message: isConfigured
        ? 'Mercado Pago pronto para processamento real.'
        : 'Pagamentos em configuração: o administrador precisa inserir MERCADO_PAGO_ACCESS_TOKEN nas variáveis de ambiente do Skip Cloud.',
    })
  } catch (err) {
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

    // FLUXO A: Assinatura Mensal PRO Recorrente (API /preapproval)
    if (itemType === 'subscription' && plan === 'monthly') {
      const externalRef = `sub_${userId}_monthly_${Date.now()}`
      const reason = 'Plano PRO Mensal - Prompts Virais Shop'
      const backUrl = `${siteUrl}/checkout/sucesso?tipo=assinatura&plano=monthly`

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
        const initPoint = mpData.init_point || ''
        const preapprovalId = mpData.id || ''

        return e.json(200, {
          success: true,
          type: 'subscription_preapproval',
          init_point: initPoint,
          preapproval_id: preapprovalId,
          external_reference: externalRef,
        })
      } else {
        const errDetail = res.json || res.body || ''
        console.warn('[mp-create-checkout] Erro ao criar preapproval:', res.statusCode, errDetail)
        return e.json(res.statusCode || 500, {
          success: false,
          error:
            'Não foi possível criar o checkout de assinatura recorrente no Mercado Pago. Verifique as credenciais.',
          details: errDetail,
        })
      }
    }

    // FLUXO B: Checkout Pro (API /checkout/preferences)
    // Para Anual VIP (R$ 238,80) e Créditos Extras (R$ 1,99 unid)
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
// ROTA 3: POST /backend/v1/mp/webhook
// -------------------------------------------------------------
routerAdd('POST', '/backend/v1/mp/webhook', (e) => {
  try {
    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const webhookSecret = ($os.getenv('MERCADO_PAGO_WEBHOOK_SECRET') || '').trim()

    if (!token) {
      console.warn('[mp-webhook] MERCADO_PAGO_ACCESS_TOKEN ausente. Ignorando evento.')
      return e.json(503, { success: false, error: 'Mercado Pago não configurado.' })
    }

    const reqInfo = e.requestInfo()
    const headers = reqInfo.headers || {}
    const query = reqInfo.query || {}
    const body = reqInfo.body || {}

    // 1. Validação de Assinatura se MERCADO_PAGO_WEBHOOK_SECRET estiver configurado
    if (webhookSecret) {
      const xSignature = headers['x-signature'] || headers['X-Signature'] || ''
      const xRequestId = headers['x-request-id'] || headers['X-Request-Id'] || ''

      if (!xSignature) {
        console.warn('[mp-webhook] Cabeçalho x-signature ausente.')
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
        console.warn('[mp-webhook] Assinatura inválida:', {
          calculatedHash,
          hashV1,
          manifest,
        })
        return e.json(401, { success: false, error: 'Assinatura do webhook inválida.' })
      }
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
      const pmtStatus = pmtData.status || '' // approved, pending, rejected, refunded, cancelled
      const pmtStatusDetail = pmtData.status_detail || ''
      const externalRef = pmtData.external_reference || ''
      const payerEmail = (pmtData.payer && pmtData.payer.email) || ''
      const transactionAmount = pmtData.transaction_amount || 0
      const paymentMethodId = pmtData.payment_method_id || ''
      const cardInfo = pmtData.card || {}
      const cardLast4 = cardInfo.last_four_digits || ''
      const cardBrand =
        (pmtData.payment_method && pmtData.payment_method.id) || paymentMethodId || ''

      let targetUserId = ''
      let isSubscriptionPayment = false
      let planTarget = 'monthly'
      let isCreditsPayment = false
      let creditsToAdd = 0

      if (externalRef.startsWith('sub_')) {
        const spl = externalRef.split('_')
        if (spl.length >= 3) {
          targetUserId = spl[1]
          planTarget = spl[2]
          isSubscriptionPayment = true
        }
      } else if (externalRef.startsWith('credits_')) {
        const spl = externalRef.split('_')
        if (spl.length >= 3) {
          targetUserId = spl[1]
          creditsToAdd = parseInt(spl[2] || '1', 10)
          isCreditsPayment = true
        }
      }

      if (!targetUserId && payerEmail) {
        try {
          const userRec = $app.findAuthRecordByEmail('_pb_users_auth_', payerEmail)
          if (userRec) targetUserId = userRec.id
        } catch (_) {}
      }

      // Idempotência com payments_history
      let existingHistoryRec = null
      try {
        existingHistoryRec = $app.findFirstRecordByData(
          'payments_history',
          'mp_payment_id',
          String(resourceId),
        )
      } catch (_) {}

      if (existingHistoryRec) {
        const previousStatus = existingHistoryRec.getString('status')
        existingHistoryRec.set('status', pmtStatus)
        existingHistoryRec.set('status_detail', pmtStatusDetail)
        $app.save(existingHistoryRec)

        if (previousStatus === 'approved') {
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
        } catch (histErr) {
          console.warn('[mp-webhook] Erro ao salvar histórico:', histErr)
        }
      }

      // Ações com base no status do pagamento
      if (targetUserId && pmtStatus === 'approved') {
        if (isCreditsPayment && creditsToAdd > 0) {
          try {
            let credRecord = null
            try {
              credRecord = $app.findFirstRecordByData('regeneration_credits', 'user', targetUserId)
            } catch (_) {}

            if (credRecord) {
              const currentBalance = credRecord.getInt('extra_prompts_balance') || 0
              const totalPurchased = credRecord.getInt('total_purchased') || 0
              credRecord.set('extra_prompts_balance', currentBalance + creditsToAdd)
              credRecord.set('total_purchased', totalPurchased + creditsToAdd)
              if (cardLast4) credRecord.set('last_purchase_card_last4', cardLast4)
              $app.save(credRecord)
            } else {
              const credCol = $app.findCollectionByNameOrId('regeneration_credits')
              const newCred = new Record(credCol)
              newCred.set('user', targetUserId)
              newCred.set('extra_prompts_balance', creditsToAdd)
              newCred.set('total_purchased', creditsToAdd)
              newCred.set('total_used', 0)
              if (cardLast4) newCred.set('last_purchase_card_last4', cardLast4)
              $app.save(newCred)
            }
            console.log(
              `[mp-webhook] Concedidos ${creditsToAdd} créditos para usuário ${targetUserId}`,
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
            }
            console.log(
              `[mp-webhook] Assinatura ${planTarget} ativada para usuário ${targetUserId}`,
            )
          } catch (subSaveErr) {
            console.error('[mp-webhook] Erro ao salvar assinatura:', subSaveErr)
          }
        }
      } else if (
        targetUserId &&
        (pmtStatus === 'rejected' || pmtStatus === 'cancelled' || pmtStatus === 'refunded')
      ) {
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
          const now = new Date()
          const endDate = nextPaymentDate
            ? new Date(nextPaymentDate)
            : new Date(now.getTime() + 31 * 24 * 3600 * 1000)

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
          }
          console.log(`[mp-webhook] Assinatura mensal ativada via preapproval para ${targetUserId}`)
        } else if (preStatus === 'cancelled' || preStatus === 'paused') {
          if (subRecord) {
            subRecord.set('status', 'cancelled')
            $app.save(subRecord)
            console.log(
              `[mp-webhook] Assinatura cancelada para ${targetUserId} (preapproval status=${preStatus})`,
            )
          }
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

    return e.json(200, {
      success: true,
      mp_cancelled: mpCancelled,
      message: 'Assinatura cancelada com sucesso.',
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

    const isAdmin =
      authUser.getBool('is_admin') ||
      authUser.getString('email') === 'juniorrodriguesjr123.jr@gmail.com'
    if (!isAdmin) {
      return e.json(403, {
        success: false,
        error: 'Acesso restrito ao administrador do sistema.',
      })
    }

    const token = ($os.getenv('MERCADO_PAGO_ACCESS_TOKEN') || '').trim()
    const isConfigured = Boolean(token)

    const totalUsers = $app.countRecords('users')
    const activeMonthlySubs = $app.countRecords(
      'subscriptions',
      'status = "active" && plan = "monthly"',
    )
    const activeAnnualSubs = $app.countRecords(
      'subscriptions',
      'status = "active" && plan = "annual"',
    )
    const cancelledSubs = $app.countRecords('subscriptions', 'status = "cancelled"')

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
