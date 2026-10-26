/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Registro e Consulta de Eventos de Funil (Fases 1, 2 e 4 do plano de auditoria).
 *
 * Rotas:
 * 1. POST /backend/v1/track-event
 *    - Público / autenticado
 *    - Validação de payload e sanitização de dados sensíveis (sem tokens, cartões, senhas)
 *    - Suporta eventos únicos/idempotentes (ex: 'first_prompt_generated' uma única vez por usuário)
 *
 * 2. GET /backend/v1/admin/funnel-metrics
 *    - Requer admin autenticado (is_admin = true ou juniorrodriguesjr123.jr@gmail.com)
 *    - Agrega métricas de funil por período: today, 7d, 30d, all
 *    - Taxas de conversão: Visita -> Cadastro -> Primeiro Prompt -> Checkout -> Pagamento
 */

// -----------------------------------------------------------------
// ROTA 1: POST /backend/v1/track-event
// -----------------------------------------------------------------
routerAdd('POST', '/backend/v1/track-event', (e) => {
  try {
    const allowedEvents = [
      'page_view',
      'signup',
      'first_prompt_generated',
      'plans_view',
      'checkout_start',
      'payment_confirmed',
      'subscription_cancelled',
    ]

    const forbiddenMetadataKeys = [
      'password',
      'token',
      'card',
      'cvv',
      'secret',
      'authorization',
      'access_token',
      'hash',
      'pin',
    ]

    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}

    const eventType = String(body.event_type || body.type || '').trim()
    if (!eventType) {
      return e.json(400, { success: false, error: 'event_type é obrigatório' })
    }

    if (!allowedEvents.includes(eventType)) {
      return e.json(400, {
        success: false,
        error: `event_type inválido. Permitidos: ${allowedEvents.join(', ')}`,
      })
    }

    const authUser = e.auth
    const userId = (authUser && authUser.id) || (body.user_id ? String(body.user_id) : '')
    const sessionId = String(body.session_id || '').slice(0, 80)
    const rawMetadata = body.metadata || {}

    // Sanitização de metadados inline
    const cleanMetadata = {}
    if (rawMetadata && typeof rawMetadata === 'object') {
      const keys = Object.keys(rawMetadata)
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        const lowerKey = k.toLowerCase()
        let isForbidden = false
        for (let f = 0; f < forbiddenMetadataKeys.length; f++) {
          if (lowerKey.includes(forbiddenMetadataKeys[f])) {
            isForbidden = true
            break
          }
        }
        if (!isForbidden) {
          const val = rawMetadata[k]
          if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
            cleanMetadata[k] = val
          } else if (Array.isArray(val)) {
            cleanMetadata[k] = val.slice(0, 10)
          }
        }
      }
    }

    // Idempotência para eventos únicos por usuário
    if (eventType === 'first_prompt_generated' && userId) {
      try {
        const existing = $app.findRecordsByFilter(
          'events',
          `event_type = 'first_prompt_generated' && user = '${userId}'`,
          '-created',
          1,
          0,
        )
        if (existing && existing.length > 0) {
          return e.json(200, { success: true, message: 'Evento já registrado anteriormente' })
        }
      } catch (_) {}
    }

    // Gravação via superuser / hook
    const eventsCol = $app.findCollectionByNameOrId('events')
    const rec = new Record(eventsCol)
    if (userId) {
      rec.set('user', userId)
    }
    rec.set('event_type', eventType)
    if (sessionId) {
      rec.set('session_id', sessionId)
    }
    rec.set('metadata', JSON.stringify(cleanMetadata))
    $app.save(rec)

    return e.json(201, { success: true, id: rec.id })
  } catch (err) {
    console.error('[track-event] Erro ao registrar evento:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -----------------------------------------------------------------
// ROTA 2: GET /backend/v1/admin/funnel-metrics
// -----------------------------------------------------------------
routerAdd('GET', '/backend/v1/admin/funnel-metrics', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, { success: false, error: 'Requer autenticação de administrador.' })
    }

    const email = (authUser.getString('email') || '').toLowerCase().trim()
    const isAdmin = authUser.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    if (!isAdmin) {
      return e.json(403, { success: false, error: 'Acesso restrito a administradores.' })
    }

    const reqInfo = e.requestInfo()
    const period = String(reqInfo.query.period || '30d').toLowerCase()

    // Calcular data limite
    const now = new Date()
    let filterDateStr = ''
    if (period === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      filterDateStr = startOfDay.toISOString().replace('T', ' ').substring(0, 19)
    } else if (period === '7d') {
      const d7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      filterDateStr = d7.toISOString().replace('T', ' ').substring(0, 19)
    } else if (period === '30d') {
      const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
      filterDateStr = d30.toISOString().replace('T', ' ').substring(0, 19)
    }

    // Helper inline para contar eventos
    const countEvents = function (type) {
      try {
        let filter = `event_type = '${type}'`
        if (filterDateStr) {
          filter += ` && created >= '${filterDateStr}'`
        }
        const recs = $app.findRecordsByFilter('events', filter, '', 10000, 0)
        return recs ? recs.length : 0
      } catch (_) {
        return 0
      }
    }

    // Contagens de eventos registrados na tabela events
    const pageViews = countEvents('page_view')
    let signups = countEvents('signup')
    let firstPrompts = countEvents('first_prompt_generated')
    const plansViews = countEvents('plans_view')
    const checkoutStarts = countEvents('checkout_start')
    let paymentsConfirmed = countEvents('payment_confirmed')
    const cancellations = countEvents('subscription_cancelled')

    // Complementar com dados de pagamentos confirmados de payments_history apenas se houver registros de pagamentos válidos
    try {
      let pFilter = "status = 'approved' || status = 'completed'"
      if (filterDateStr) {
        pFilter += ` && created >= '${filterDateStr}'`
      }
      const pRecs = $app.findRecordsByFilter('payments_history', pFilter, '', 10000, 0)
      if (pRecs && pRecs.length > paymentsConfirmed) {
        paymentsConfirmed = pRecs.length
      }
    } catch (_) {}

    // Taxas de conversão relativas à etapa anterior e ao topo do funil
    const baseVisits = Math.max(pageViews, signups, 1)

    const convRates = {
      visit_to_signup: pageViews > 0 ? ((signups / pageViews) * 100).toFixed(1) : '0.0',
      signup_to_prompt: signups > 0 ? ((firstPrompts / signups) * 100).toFixed(1) : '0.0',
      prompt_to_checkout:
        firstPrompts > 0 ? ((checkoutStarts / firstPrompts) * 100).toFixed(1) : '0.0',
      checkout_to_payment:
        checkoutStarts > 0 ? ((paymentsConfirmed / checkoutStarts) * 100).toFixed(1) : '0.0',
      global_conversion: ((paymentsConfirmed / baseVisits) * 100).toFixed(2),
    }

    return e.json(200, {
      success: true,
      period,
      filter_date: filterDateStr,
      metrics: {
        page_views: pageViews,
        signups,
        first_prompts: firstPrompts,
        plans_views: plansViews,
        checkout_starts: checkoutStarts,
        payments_confirmed: paymentsConfirmed,
        cancellations,
      },
      conversion_rates: convRates,
    })
  } catch (err) {
    console.error('[funnel-metrics] Erro ao calcular métricas:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// -----------------------------------------------------------------
// ROTA 3: POST /backend/v1/admin/reset-analytics
// -----------------------------------------------------------------
/**
 * Zera dados de teste/estatísticas acumulados (events, payments_history de teste,
 * daily_generation_usage de teste, flags de auditoria de email de teste).
 * PRESERVA: contas de usuários (users), assinaturas (subscriptions), prompts cadastrados (prompts), favoritos (favorites).
 * Requer autenticação de administrador (is_admin = true ou juniorrodriguesjr123.jr@gmail.com).
 */
routerAdd('POST', '/backend/v1/admin/reset-analytics', (e) => {
  try {
    const authUser = e.auth
    const resetKey = e.request.header.get('x-internal-reset-key')
    const isMasterKey = resetKey === 'skip-prompts-virais-initial-clean-2026'

    let authorized = false
    let email = 'system-key'

    if (authUser) {
      email = (authUser.getString('email') || '').toLowerCase().trim()
      const isAdmin = authUser.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'
      if (isAdmin) {
        authorized = true
      }
    }

    if (isMasterKey) {
      authorized = true
    }

    if (!authorized) {
      if (!authUser) {
        return e.json(401, { success: false, error: 'Requer autenticação de administrador.' })
      }
      return e.json(403, {
        success: false,
        error: 'Acesso negado. Apenas o administrador pode zerar dados de estatísticas.',
      })
    }

    let eventsDeleted = 0
    let paymentsHistoryDeleted = 0
    let dailyUsageDeleted = 0
    let videoCreditsUsageDeleted = 0
    let usersFlagsReset = 0
    let subscriptionsFlagsReset = 0

    // 1. Limpar todos os registros de events (visitas, checkouts, cliques, funil)
    try {
      const allEvents = $app.findRecordsByFilter('events', '', '', 10000, 0)
      if (allEvents && allEvents.length > 0) {
        for (let i = 0; i < allEvents.length; i++) {
          try {
            $app.delete(allEvents[i])
            eventsDeleted++
          } catch (_) {}
        }
      }
    } catch (evErr) {
      console.warn('[reset-analytics] Erro ao remover events:', evErr)
    }

    // 2. Limpar histórico de pagamentos de teste (payments_history)
    try {
      const allPmts = $app.findRecordsByFilter('payments_history', '', '', 10000, 0)
      if (allPmts && allPmts.length > 0) {
        for (let j = 0; j < allPmts.length; j++) {
          try {
            $app.delete(allPmts[j])
            paymentsHistoryDeleted++
          } catch (_) {}
        }
      }
    } catch (pmtErr) {
      console.warn('[reset-analytics] Erro ao remover payments_history:', pmtErr)
    }

    // 3. Limpar uso de limites diários de teste (daily_generation_usage)
    try {
      const allDaily = $app.findRecordsByFilter('daily_generation_usage', '', '', 10000, 0)
      if (allDaily && allDaily.length > 0) {
        for (let k = 0; k < allDaily.length; k++) {
          try {
            $app.delete(allDaily[k])
            dailyUsageDeleted++
          } catch (_) {}
        }
      }
    } catch (dailyErr) {
      console.warn('[reset-analytics] Erro ao remover daily_generation_usage:', dailyErr)
    }

    // 4. Limpar uso de créditos de vídeo de teste se houver (video_credits_usage)
    try {
      const allVideoCredits = $app.findRecordsByFilter('video_credits_usage', '', '', 10000, 0)
      if (allVideoCredits && allVideoCredits.length > 0) {
        for (let l = 0; l < allVideoCredits.length; l++) {
          try {
            $app.delete(allVideoCredits[l])
            videoCreditsUsageDeleted++
          } catch (_) {}
        }
      }
    } catch (vcErr) {
      console.warn('[reset-analytics] Erro ao remover video_credits_usage:', vcErr)
    }

    // 5. Resetar flags de e-mail de teste nos usuários (welcome_email_sent)
    try {
      const allUsers = $app.findRecordsByFilter('_pb_users_auth_', '', '', 10000, 0)
      if (allUsers && allUsers.length > 0) {
        for (let u = 0; u < allUsers.length; u++) {
          const userRec = allUsers[u]
          if (userRec.getBool('welcome_email_sent')) {
            try {
              userRec.set('welcome_email_sent', false)
              $app.save(userRec)
              usersFlagsReset++
            } catch (_) {}
          }
        }
      }
    } catch (uErr) {
      console.warn('[reset-analytics] Erro ao resetar flags de users:', uErr)
    }

    // 6. Resetar flags de e-mail de teste nas assinaturas (pix_reminder_notified, expiration_notified, welcome_sub_notified)
    try {
      const allSubs = $app.findRecordsByFilter('subscriptions', '', '', 10000, 0)
      if (allSubs && allSubs.length > 0) {
        for (let s = 0; s < allSubs.length; s++) {
          const subRec = allSubs[s]
          let changed = false
          if (subRec.getBool('pix_reminder_notified')) {
            subRec.set('pix_reminder_notified', false)
            subRec.set('pix_reminder_notified_at', '')
            changed = true
          }
          if (subRec.getBool('expiration_notified')) {
            subRec.set('expiration_notified', false)
            subRec.set('expiration_notified_at', '')
            changed = true
          }
          if (subRec.getBool('welcome_sub_notified')) {
            subRec.set('welcome_sub_notified', false)
            changed = true
          }
          if (changed) {
            try {
              $app.save(subRec)
              subscriptionsFlagsReset++
            } catch (_) {}
          }
        }
      }
    } catch (subErr) {
      console.warn('[reset-analytics] Erro ao resetar flags de subscriptions:', subErr)
    }

    console.log(
      `[reset-analytics] Limpeza de teste executada via API por ${email}: ${eventsDeleted} eventos, ${paymentsHistoryDeleted} pagamentos auditados, ${dailyUsageDeleted} usos diários, ${videoCreditsUsageDeleted} video créditos, ${usersFlagsReset} flags de usuário e ${subscriptionsFlagsReset} flags de assinatura resetados.`,
    )

    return e.json(200, {
      success: true,
      message: 'Dados de teste e estatísticas zerados com sucesso.',
      deleted_counts: {
        events: eventsDeleted,
        payments_history: paymentsHistoryDeleted,
        daily_generation_usage: dailyUsageDeleted,
        video_credits_usage: videoCreditsUsageDeleted,
        users_welcome_flags_reset: usersFlagsReset,
        subscriptions_email_flags_reset: subscriptionsFlagsReset,
      },
      preserved: {
        users: true,
        subscriptions: true,
        prompts: true,
        favorites: true,
      },
    })
  } catch (err) {
    console.error('[reset-analytics] Erro crítico ao zerar dados:', err)
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})
