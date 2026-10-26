/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Limites do Modo Grátis & Programa de Indicação (Afiliados)
 *
 * Observação arquitetural PocketBase JSVM:
 * Todas as funções auxiliares devem ficar INLINE dentro de cada callback de rota
 * para evitar erros de scoping entre VMs do pool.
 *
 * Rotas expostas:
 * 1. GET  /backend/v1/daily-limits/status?tab=virais|vendas
 * 2. POST /backend/v1/daily-limits/consume
 * 3. GET  /backend/v1/referrals/overview
 * 4. POST /backend/v1/referrals/consume-credit
 */

// ROTA 1: GET /backend/v1/daily-limits/status
routerAdd('GET', '/backend/v1/daily-limits/status', (e) => {
  const authRecord = e.auth
  if (!authRecord) {
    return e.json(401, { error: 'Usuário não autenticado.' })
  }

  // Fuso de Brasília (UTC-3)
  const now = new Date()
  const brt = new Date(now.getTime() - 3 * 3600 * 1000)
  const today = brt.toISOString().slice(0, 10)

  // Checar se é admin ou assinante pago
  let isPaid = false
  if (authRecord.getBool('is_admin')) {
    isPaid = true
  } else {
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase()
    if (email === 'juniorrodriguesjr123.jr@gmail.com') {
      isPaid = true
    } else {
      try {
        const subs = $app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPaid = true
      } catch (_) {}
    }
  }

  // Checar regra futura: se houver 10 ou mais assinantes anuais ativos, o modo grátis vira ilimitado
  let annualUnlocked = false
  try {
    const annualCount = $app.countRecords('subscriptions', 'plan = "annual" && status = "active"')
    if (annualCount >= 10) annualUnlocked = true
  } catch (_) {}

  const isUnlimited = isPaid || annualUnlocked

  const tab = (e.request.url.query().get('tab') || 'virais').toLowerCase()
  const validTab = tab === 'vendas' ? 'vendas' : 'virais'

  let countToday = 0
  try {
    const records = $app.findRecordsByFilter(
      'daily_generation_usage',
      `user = "${authRecord.id}" && tab = "${validTab}" && date = "${today}"`,
      '-created',
      1,
      0,
    )
    if (records && records.length > 0) {
      countToday = records[0].getInt('count') || 0
    }
  } catch (_) {}

  const dailyLimit = 6
  const remaining = isUnlimited ? 999999 : Math.max(0, dailyLimit - countToday)

  return e.json(200, {
    tab: validTab,
    date: today,
    count_today: countToday,
    limit: dailyLimit,
    remaining,
    is_unlimited: isUnlimited,
    reason: isPaid ? 'paid_or_admin' : annualUnlocked ? 'ten_annual_subscribers_reached' : 'free',
  })
})

// ROTA 2: POST /backend/v1/daily-limits/consume
routerAdd('POST', '/backend/v1/daily-limits/consume', (e) => {
  const authRecord = e.auth
  if (!authRecord) {
    return e.json(401, { error: 'Usuário não autenticado.' })
  }

  const now = new Date()
  const brt = new Date(now.getTime() - 3 * 3600 * 1000)
  const today = brt.toISOString().slice(0, 10)

  let isPaid = false
  if (authRecord.getBool('is_admin')) {
    isPaid = true
  } else {
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase()
    if (email === 'juniorrodriguesjr123.jr@gmail.com') {
      isPaid = true
    } else {
      try {
        const subs = $app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPaid = true
      } catch (_) {}
    }
  }

  let annualUnlocked = false
  try {
    const annualCount = $app.countRecords('subscriptions', 'plan = "annual" && status = "active"')
    if (annualCount >= 10) annualUnlocked = true
  } catch (_) {}

  const isUnlimited = isPaid || annualUnlocked
  const dailyLimit = 6

  const data = e.requestInfo().body || {}
  const tab = (data.tab || 'virais').toLowerCase()
  const validTab = tab === 'vendas' ? 'vendas' : 'virais'

  let usageRec = null
  let currentCount = 0

  try {
    const records = $app.findRecordsByFilter(
      'daily_generation_usage',
      `user = "${authRecord.id}" && tab = "${validTab}" && date = "${today}"`,
      '-created',
      1,
      0,
    )
    if (records && records.length > 0) {
      usageRec = records[0]
      currentCount = usageRec.getInt('count') || 0
    }
  } catch (_) {}

  if (!isUnlimited && currentCount >= dailyLimit) {
    const tabName = validTab === 'vendas' ? 'TikTok Shop/Vendas' : 'Vídeos Virais'
    return e.json(429, {
      error: 'Limite diário de prompts atingido',
      message: `Você atingiu o limite de ${dailyLimit} prompts hoje na aba de ${tabName}. Assine o plano PRO para gerar sem limites!`,
      limit_reached: true,
      limit: dailyLimit,
      tab: validTab,
      count_today: currentCount,
      remaining: 0,
    })
  }

  // Incrementa contagem no servidor
  try {
    if (usageRec) {
      usageRec.set('count', currentCount + 1)
      $app.save(usageRec)
    } else {
      const col = $app.findCollectionByNameOrId('daily_generation_usage')
      const newRec = new Record(col)
      newRec.set('user', authRecord.id)
      newRec.set('tab', validTab)
      newRec.set('date', today)
      newRec.set('count', 1)
      $app.save(newRec)
    }
  } catch (saveErr) {
    console.error('[daily-limits] Erro ao incrementar uso diário:', saveErr)
  }

  const newCount = currentCount + 1
  return e.json(200, {
    success: true,
    tab: validTab,
    date: today,
    count_today: newCount,
    limit: dailyLimit,
    remaining: isUnlimited ? 999999 : Math.max(0, dailyLimit - newCount),
    is_unlimited: isUnlimited,
  })
})

// ROTA 3: GET /backend/v1/referrals/overview
routerAdd('GET', '/backend/v1/referrals/overview', (e) => {
  const authRecord = e.auth
  if (!authRecord) {
    return e.json(401, { error: 'Usuário não autenticado.' })
  }

  // Garantir referral_code gerado
  let refCode = authRecord.getString('referral_code')
  if (!refCode) {
    refCode = authRecord.id.slice(0, 8).toUpperCase()
    try {
      authRecord.set('referral_code', refCode)
      $app.save(authRecord)
    } catch (_) {}
  }

  const siteUrl = 'https://promptsviraisbr.goskip.app'
  const referralLink = `${siteUrl}/login?ref=${refCode}`

  // Buscar indicados vinculados
  let totalReferredCount = 0
  try {
    totalReferredCount = $app.countRecords('_pb_users_auth_', `referred_by = "${authRecord.id}"`)
  } catch (_) {}

  // Buscar créditos de indicação concedidos
  let activeCredits = []
  let totalCreditsRemaining = 0
  const now = new Date()

  try {
    const credRecords = $app.findRecordsByFilter(
      'referral_credits',
      `referrer = "${authRecord.id}"`,
      '-created',
      50,
      0,
    )

    for (let i = 0; i < credRecords.length; i++) {
      const cr = credRecords[i]
      const expDate = new Date(cr.getString('expires_at'))
      let status = cr.getString('status')

      // Atualiza status se expirou
      if (status === 'active' && expDate < now) {
        status = 'expired'
        cr.set('status', 'expired')
        try {
          $app.save(cr)
        } catch (_) {}
      }

      const remaining = cr.getInt('credits_remaining') || 0
      if (status === 'active' && remaining > 0) {
        totalCreditsRemaining += remaining
      }

      activeCredits.push({
        id: cr.id,
        referred_user: cr.getString('referred_user'),
        credits_granted: cr.getInt('credits_granted'),
        credits_remaining: remaining,
        expires_at: cr.getString('expires_at'),
        status,
        created: cr.getString('created'),
      })
    }
  } catch (err) {
    console.warn('[referrals] Erro ao buscar créditos de indicação:', err)
  }

  return e.json(200, {
    referral_code: refCode,
    referral_link: referralLink,
    total_referred_users: totalReferredCount,
    total_credits_remaining: totalCreditsRemaining,
    credits: activeCredits,
    rules: {
      credits_per_paid_sub: 20,
      validity_days: 30,
      condition: 'O indicado deve assinar 1 mês pago E você também deve ser assinante ativo.',
    },
  })
})

// ROTA 4: POST /backend/v1/referrals/consume-credit
routerAdd('POST', '/backend/v1/referrals/consume-credit', (e) => {
  const authRecord = e.auth
  if (!authRecord) {
    return e.json(401, { error: 'Usuário não autenticado.' })
  }

  const now = new Date()
  try {
    // Buscar o crédito ativo mais antigo com expiração válida
    const records = $app.findRecordsByFilter(
      'referral_credits',
      `referrer = "${authRecord.id}" && status = "active" && credits_remaining > 0`,
      'expires_at',
      10,
      0,
    )

    let consumed = false
    let remainingCreditsTotal = 0

    for (let i = 0; i < records.length; i++) {
      const cr = records[i]
      const expDate = new Date(cr.getString('expires_at'))
      if (expDate < now) {
        cr.set('status', 'expired')
        $app.save(cr)
        continue
      }

      if (!consumed) {
        const rem = cr.getInt('credits_remaining') - 1
        cr.set('credits_remaining', Math.max(0, rem))
        if (rem <= 0) {
          cr.set('status', 'consumed')
        }
        $app.save(cr)
        consumed = true
        remainingCreditsTotal += Math.max(0, rem)
      } else {
        remainingCreditsTotal += cr.getInt('credits_remaining')
      }
    }

    if (!consumed) {
      return e.json(400, {
        error: 'Nenhum crédito de indicação válido disponível.',
      })
    }

    return e.json(200, {
      success: true,
      consumed: 1,
      total_credits_remaining: remainingCreditsTotal,
    })
  } catch (err) {
    console.error('[referrals] Erro ao consumir crédito de indicação:', err)
    return e.json(500, { error: 'Erro ao processar crédito de indicação.' })
  }
})
