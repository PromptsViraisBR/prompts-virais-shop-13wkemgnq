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

    // Contagens de eventos
    const pageViews = countEvents('page_view')
    let signups = countEvents('signup')
    let firstPrompts = countEvents('first_prompt_generated')
    const plansViews = countEvents('plans_view')
    const checkoutStarts = countEvents('checkout_start')
    let paymentsConfirmed = countEvents('payment_confirmed')
    const cancellations = countEvents('subscription_cancelled')

    // Complementar com dados reais do banco quando disponíveis
    // 1. Total de novos cadastros de usuários no período
    try {
      let uFilter = ''
      if (filterDateStr) {
        uFilter = `created >= '${filterDateStr}'`
      }
      const uRecs = $app.findRecordsByFilter('_pb_users_auth_', uFilter, '', 10000, 0)
      if (uRecs && uRecs.length > signups) {
        signups = uRecs.length
      }
    } catch (_) {}

    // 2. Total de usuários que geraram prompt no período
    try {
      let gFilter = ''
      if (filterDateStr) {
        gFilter = `created >= '${filterDateStr}'`
      }
      const gRecs = $app.findRecordsByFilter('generations', gFilter, '', 10000, 0)
      if (gRecs && gRecs.length > 0) {
        const uniqueUsers = {}
        for (let i = 0; i < gRecs.length; i++) {
          const u = gRecs[i].getString('user')
          if (u) uniqueUsers[u] = true
        }
        const uniqueCount = Object.keys(uniqueUsers).length
        if (uniqueCount > firstPrompts) {
          firstPrompts = uniqueCount
        }
      }
    } catch (_) {}

    // 3. Pagamentos confirmados de payments_history
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
