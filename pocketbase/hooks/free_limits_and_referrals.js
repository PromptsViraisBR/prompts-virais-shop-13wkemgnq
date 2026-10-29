/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Limites do Modo Grátis & Novo Sistema de Indicação
 *
 * REGRAS DO SISTEMA DE INDICAÇÕES (SUBSTITUEM AS ANTIGAS):
 *
 * 1. PLANO GRÁTIS — indicações ILIMITADAS
 * - Link exclusivo e permanente, compartilhável quantas vezes quiser.
 * - Cada pessoa nova que concluir cadastro válido pelo link = +5 gerações extras na conta do indicador.
 * - Saldo acumula no sistema de créditos existente (`regeneration_credits`).
 * - Histórico completo no banco (`referral_credits`).
 * - Validações no servidor: autoindicação bloqueada, mesma conta não gera repetido, unicidade (processada 1 única vez).
 *
 * 2. PLANO PRO — UMA indicação = estorno de 1 mensalidade
 * - Limitado a 1 indicação válida por indicador PRO.
 * - Link é removido da interface assim que houver cadastro válido do indicado (permanece no banco).
 * - Indicado assina PRO elegível e pagamento é confirmado pelo webhook MP real -> estorno de 1 mensalidade na assinatura do indicador.
 * - Se MP não permitir automático -> "PENDENTE DE ESTORNO MANUAL".
 *
 * 3. PROCESSAMENTO DE CADASTRO NO SERVIDOR:
 * - Rota POST /backend/v1/referrals/process-signup: acionada com token do novo usuário recém-criado
 *   (ou fallback do hook onRecordAfterCreateSuccess de users).
 *   Verifica se foi indicado por código ou referred_by, valida segurança/autoindicação/unicidade,
 *   identifica plano do indicador, credita +5 se GRÁTIS ou registra oportunidade PRO.
 *
 * Observação arquitetural PocketBase JSVM:
 * Todas as funções auxiliares devem ficar INLINE dentro de cada callback de rota
 * para evitar erros de scoping entre VMs do pool.
 *
 * Rotas expostas:
 * 1. GET  /backend/v1/daily-limits/status?tab=virais|vendas
 * 2. POST /backend/v1/daily-limits/consume
 * 3. GET  /backend/v1/referrals/overview
 * 4. POST /backend/v1/referrals/process-signup
 * 5. POST /backend/v1/referrals/consume-credit
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
// Retorna os dados completos do programa de indicação de acordo com as regras atuais (GRÁTIS ou PRO)
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

  let siteUrl = ($os.getenv('SITE_URL') || '').trim()
  if (!siteUrl) siteUrl = 'https://promptsviraisbr.goskip.app'
  siteUrl = siteUrl.replace(/\/+$/, '')
  const referralLink = `${siteUrl}/login?ref=${refCode}`

  // Determinar plano do indicador autenticado
  let userPlan = 'free'
  const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase().trim()
  const isAdmin = authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

  let activeSub = null
  try {
    const subs = $app.findRecordsByFilter(
      'subscriptions',
      `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
      '-created',
      1,
      0,
    )
    if (subs && subs.length > 0) {
      activeSub = subs[0]
      userPlan = activeSub.getString('plan') || 'monthly'
    } else if (isAdmin) {
      userPlan = 'monthly'
    }
  } catch (_) {}

  const isUserPro = isAdmin || userPlan === 'monthly' || userPlan === 'annual'

  // Buscar saldo atual de gerações extras em regeneration_credits
  let currentExtraGenerationsBalance = 0
  try {
    const regRecs = $app.findRecordsByFilter(
      'regeneration_credits',
      `user = "${authRecord.id}"`,
      '-created',
      1,
      0,
    )
    if (regRecs && regRecs.length > 0) {
      currentExtraGenerationsBalance = regRecs[0].getInt('extra_prompts_balance') || 0
    }
  } catch (_) {}

  // Buscar total de indicados vinculados na coleção users (referred_by = authRecord.id)
  let totalReferredCount = 0
  try {
    totalReferredCount = $app.countRecords('_pb_users_auth_', `referred_by = "${authRecord.id}"`)
  } catch (_) {}

  // Buscar todos os registros de indicação onde este usuário é referrer
  let allRecords = []
  try {
    allRecords = $app.findRecordsByFilter(
      'referral_credits',
      `referrer = "${authRecord.id}"`,
      '-created',
      200,
      0,
    )
  } catch (err) {
    console.warn('[referrals] Erro ao buscar registros de indicação:', err)
  }

  // Processar histórico e métricas específicas para GRÁTIS
  let totalGenerationsEarned = 0
  let validReferralsCount = 0
  const historyList = []

  // Variáveis específicas para fluxo PRO
  let proOpportunityRecord = null

  for (let i = 0; i < allRecords.length; i++) {
    const r = allRecords[i]
    const rType = r.getString('reward_type') || ''
    const rPlan = r.getString('referrer_plan') || ''
    const creditsGranted = r.getInt('credits_granted') || 0
    const refundStatus = r.getString('refund_status') || 'not_applicable'
    const status = r.getString('status') || 'active'
    const referredUserId = r.getString('referred_user')

    // Tentar resgatar nome/email mascarado do indicado para exibir no histórico
    let referredUserName = 'Novo Usuário'
    let referredUserJoined = r.getString('created')
    let referredUserPlan = 'free'

    if (referredUserId) {
      try {
        const u = $app.findRecordById('_pb_users_auth_', referredUserId)
        if (u) {
          const un = u.getString('name')
          const ue = u.email() || u.getString('email') || ''
          if (un) {
            referredUserName = un
          } else if (ue) {
            const spl = ue.split('@')
            referredUserName = spl[0].slice(0, 3) + '***@' + (spl[1] || '')
          }
          if (u.getString('created')) {
            referredUserJoined = u.getString('created')
          }
        }
      } catch (_) {}

      // Checar se o indicado tem plano PRO ativo
      try {
        const indSubs = $app.findRecordsByFilter(
          'subscriptions',
          `user = "${referredUserId}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (indSubs && indSubs.length > 0) {
          referredUserPlan = indSubs[0].getString('plan') || 'monthly'
        }
      } catch (_) {}
    }

    if (rType === 'generations_5') {
      validReferralsCount++
      totalGenerationsEarned += creditsGranted
    }

    // Se este registro foi gerado sob contexto PRO ou reward_type = 'pro_refund'
    if (rType === 'pro_refund' || rPlan === 'monthly' || rPlan === 'annual') {
      if (!proOpportunityRecord) {
        proOpportunityRecord = {
          id: r.id,
          referred_user_id: referredUserId,
          referred_user_name: referredUserName,
          referred_user_plan: referredUserPlan,
          created: r.getString('created'),
          refund_status: refundStatus,
          refund_amount: r.getFloat('refund_amount') || 19.9,
          refund_reason: r.getString('refund_reason') || '',
          mp_payment_id: r.getString('mp_payment_id') || '',
          mp_refund_id: r.getString('mp_refund_id') || '',
          processed_at: r.getString('processed_at') || '',
        }
      }
    }

    historyList.push({
      id: r.id,
      referred_user_id: referredUserId,
      referred_user_name: referredUserName,
      referred_user_plan: referredUserPlan,
      reward_type: rType || (creditsGranted > 0 ? 'generations_5' : 'pro_refund'),
      referrer_plan: rPlan,
      credits_granted: creditsGranted,
      credits_remaining: r.getInt('credits_remaining') || 0,
      refund_status: refundStatus,
      refund_amount: r.getFloat('refund_amount') || 0,
      refund_reason: r.getString('refund_reason') || '',
      status: status,
      created: r.getString('created'),
      processed_at: r.getString('processed_at') || '',
    })
  }

  // Para usuários PRO: se já existe um cadastro de indicado registrado sob o fluxo PRO,
  // a regra exige que o link seja REMOVIDO da interface do indicador PRO.
  const hasProReferralRegistered = Boolean(proOpportunityRecord)
  const shouldHideProLink = isUserPro && hasProReferralRegistered

  // Status consolidado do fluxo PRO para exibição direta no painel do indicador
  // Status possíveis:
  // 1. "Aguardando cadastro" (ainda não indicou ninguém)
  // 2. "Cadastro confirmado" (indicado se cadastrou pelo link)
  // 3. "Aguardando assinatura PRO" (indicado cadastrado, mas ainda free)
  // 4. "Pagamento confirmado" (webhook MP aprovou contratação PRO do indicado)
  // 5. "Estorno em processamento"
  // 6. "Estorno confirmado" (estorno real concluído no MP)
  // 7. "Recompensa não concluída" (com motivo)
  let proFlowStage = 'awaiting_signup'
  let proFlowStageLabel = 'Aguardando cadastro'
  let proFlowStageDetail = 'Compartilhe seu link exclusivo com 1 amigo criador.'

  if (proOpportunityRecord) {
    const rfStatus = proOpportunityRecord.refund_status
    const indPlan = proOpportunityRecord.referred_user_plan

    if (rfStatus === 'refunded') {
      proFlowStage = 'refund_confirmed'
      proFlowStageLabel = 'Estorno confirmado'
      proFlowStageDetail = `Estorno de R$ ${proOpportunityRecord.refund_amount.toFixed(2).replace('.', ',')} creditado com sucesso via Mercado Pago!`
    } else if (rfStatus === 'processing') {
      proFlowStage = 'refund_processing'
      proFlowStageLabel = 'Estorno em processamento'
      proFlowStageDetail =
        'Pagamento do indicado confirmado. Estorno em comunicação com o Mercado Pago.'
    } else if (rfStatus === 'refund_pending_manual') {
      proFlowStage = 'pending_manual'
      proFlowStageLabel = 'Pendente de Estorno Manual'
      proFlowStageDetail =
        proOpportunityRecord.refund_reason ||
        'O pagamento foi confirmado e aguarda processamento manual pelo administrador.'
    } else if (rfStatus === 'not_eligible' || rfStatus === 'failed' || rfStatus === 'cancelled') {
      proFlowStage = 'not_completed'
      proFlowStageLabel = 'Recompensa não concluída'
      proFlowStageDetail =
        proOpportunityRecord.refund_reason ||
        'A indicação não atendeu aos critérios de elegibilidade.'
    } else if (indPlan === 'monthly' || indPlan === 'annual' || rfStatus === 'pending_payment') {
      proFlowStage = 'payment_confirmed'
      proFlowStageLabel = 'Pagamento confirmado'
      proFlowStageDetail = 'O indicado assinou o plano PRO. Validando estorno da sua mensalidade...'
    } else {
      proFlowStage = 'signup_confirmed_awaiting_pro'
      proFlowStageLabel = 'Cadastro confirmado'
      proFlowStageDetail = `Cadastro de ${proOpportunityRecord.referred_user_name} confirmado! Aguardando contratação do plano PRO.`
    }
  }

  return e.json(200, {
    success: true,
    user_plan: userPlan,
    is_pro: isUserPro,
    referral_code: refCode,
    referral_link: referralLink,
    link_active: isUserPro ? !shouldHideProLink : true,
    should_hide_link: shouldHideProLink,

    // Métricas Plano GRÁTIS
    free_stats: {
      total_referred_users: totalReferredCount,
      valid_referrals: validReferralsCount,
      generations_earned: totalGenerationsEarned,
      current_balance: currentExtraGenerationsBalance,
      reward_per_referral: 5,
      is_unlimited: true,
    },

    // Dados e status do Plano PRO
    pro_stats: {
      has_referral_registered: hasProReferralRegistered,
      opportunity_used: hasProReferralRegistered,
      opportunity_record: proOpportunityRecord,
      stage: proFlowStage,
      stage_label: proFlowStageLabel,
      stage_detail: proFlowStageDetail,
      max_referrals: 1,
    },

    // Histórico de recompensas
    history: historyList,

    // Textos Oficiais
    texts: {
      free: {
        title: 'Indique sem limites e ganhe gerações!',
        description:
          'Compartilhe seu link exclusivo. Cada nova pessoa que se cadastrar pelo seu link rende 5 gerações extras para você. Quanto mais indicar, mais gerações poderá acumular!',
        button: 'Copiar meu link',
        highlight: '5 gerações por indicação — ilimitado.',
      },
      pro: {
        title: 'Indique e ganhe um mês grátis!',
        description:
          'Você é PRO? Indique uma pessoa para assinar o PROMPTS VIRAIS. Quando ela contratar um plano PRO elegível e o pagamento for confirmado, você poderá receber o estorno de uma mensalidade. Benefício limitado a uma indicação por usuário.',
        button: 'Copiar meu link',
        highlight: 'Ganhe um mês grátis — uma indicação elegível.',
      },
    },
  })
})

// ROTA 4: POST /backend/v1/referrals/process-signup
// Acionada após cadastro de novo usuário para processar a indicação de forma segura, transacional e idempotente
routerAdd('POST', '/backend/v1/referrals/process-signup', (e) => {
  const authRecord = e.auth
  if (!authRecord) {
    return e.json(401, { success: false, error: 'Requer autenticação.' })
  }

  const reqInfo = e.requestInfo()
  const body = reqInfo.body || {}
  const rawRefCode = (body.referral_code || '').trim()

  const newUserId = authRecord.id
  let referrerId = authRecord.getString('referred_by') || ''

  // Se referred_by não estava salvo mas o cliente enviou referral_code, buscar referrer
  if (!referrerId && rawRefCode) {
    try {
      const refUser = $app.findFirstRecordByFilter(
        '_pb_users_auth_',
        `referral_code = "${rawRefCode}" || id = "${rawRefCode}"`,
      )
      if (refUser && refUser.id !== newUserId) {
        referrerId = refUser.id
        authRecord.set('referred_by', referrerId)
        try {
          $app.save(authRecord)
        } catch (_) {}
      }
    } catch (_) {}
  }

  if (!referrerId) {
    return e.json(200, {
      success: true,
      processed: false,
      message: 'Nenhum indicador vinculado a esta conta.',
    })
  }

  // 1. Proteção contra autoindicação
  if (referrerId === newUserId) {
    return e.json(400, {
      success: false,
      processed: false,
      error: 'Autoindicação não permitida.',
    })
  }

  // 2. Verificar se o indicador existe
  let referrerUser = null
  try {
    referrerUser = $app.findRecordById('_pb_users_auth_', referrerId)
  } catch (_) {
    return e.json(404, { success: false, error: 'Usuário indicador não encontrado.' })
  }

  // 3. Idempotência / Unicidade: checar se este par (referrer + newUserId) já foi registrado em referral_credits
  let existingPair = null
  try {
    const existingPairs = $app.findRecordsByFilter(
      'referral_credits',
      `referrer = "${referrerId}" && referred_user = "${newUserId}"`,
      '-created',
      1,
      0,
    )
    if (existingPairs && existingPairs.length > 0) {
      existingPair = existingPairs[0]
    }
  } catch (_) {}

  if (existingPair) {
    console.log(
      `[referrals-signup] Indicação já registrada anteriormente para referrer=${referrerId} e referred=${newUserId}. Idempotência mantida.`,
    )
    return e.json(200, {
      success: true,
      processed: true,
      idempotent: true,
      message: 'Indicação já processada anteriormente.',
      record_id: existingPair.id,
      reward_type: existingPair.getString('reward_type'),
    })
  }

  // 4. Determinar plano atual do indicador
  let referrerPlan = 'free'
  const refEmail = (referrerUser.email() || referrerUser.getString('email') || '')
    .toLowerCase()
    .trim()
  const isRefAdmin =
    referrerUser.getBool('is_admin') || refEmail === 'juniorrodriguesjr123.jr@gmail.com'

  try {
    const rSubs = $app.findRecordsByFilter(
      'subscriptions',
      `user = "${referrerId}" && status = "active" && (plan = "monthly" || plan = "annual")`,
      '-created',
      1,
      0,
    )
    if (rSubs && rSubs.length > 0) {
      referrerPlan = rSubs[0].getString('plan') || 'monthly'
    } else if (isRefAdmin) {
      referrerPlan = 'monthly'
    }
  } catch (_) {}

  const isReferrerPro = isRefAdmin || referrerPlan === 'monthly' || referrerPlan === 'annual'

  // =========================================================================
  // CASO PRO: LIMITADO A 1 INDICAÇÃO POR USUÁRIO PRO
  // =========================================================================
  if (isReferrerPro) {
    // Checar se o indicador PRO já possui QUALQUER indicação PRO registrada
    let existingProOpportunity = null
    try {
      const proRecords = $app.findRecordsByFilter(
        'referral_credits',
        `referrer = "${referrerId}" && (reward_type = "pro_refund" || referrer_plan = "monthly" || referrer_plan = "annual")`,
        '-created',
        1,
        0,
      )
      if (proRecords && proRecords.length > 0) {
        existingProOpportunity = proRecords[0]
      }
    } catch (_) {}

    if (existingProOpportunity) {
      console.warn(
        `[referrals-signup] Indicador PRO ${referrerId} já utilizou sua única indicação PRO (record ${existingProOpportunity.id}). Ignorando nova indicação PRO.`,
      )
      return e.json(200, {
        success: true,
        processed: false,
        message: 'O indicador PRO já utilizou sua cota de 1 indicação PRO.',
      })
    }

    // Criar o registro da oportunidade PRO (aguardando assinatura PRO do indicado)
    try {
      const refCol = $app.findCollectionByNameOrId('referral_credits')
      const newProRecord = new Record(refCol)
      newProRecord.set('referrer', referrerId)
      newProRecord.set('referred_user', newUserId)
      newProRecord.set('credits_granted', 0)
      newProRecord.set('credits_remaining', 0)
      newProRecord.set('status', 'active')
      newProRecord.set('referrer_plan', referrerPlan)
      newProRecord.set('referral_code_used', rawRefCode || referrerUser.getString('referral_code'))
      newProRecord.set('reward_type', 'pro_refund')
      newProRecord.set('refund_amount', 19.9)
      newProRecord.set('refund_status', 'pending_payment')
      newProRecord.set(
        'refund_reason',
        'Cadastro confirmado. Aguardando indicado assinar plano PRO elegível.',
      )
      $app.save(newProRecord)

      // Registrar evento de funil
      try {
        const evCol = $app.findCollectionByNameOrId('events')
        const evRec = new Record(evCol)
        evRec.set('user', referrerId)
        evRec.set('event_type', 'referral_pro_signup_registered')
        evRec.set(
          'metadata',
          JSON.stringify({
            referred_user: newUserId,
            referral_code: rawRefCode,
            status: 'pending_payment',
          }),
        )
        $app.save(evRec)
      } catch (_) {}

      console.log(
        `[referrals-signup] Indicação PRO registrada com sucesso! Referrer=${referrerId}, Referred=${newUserId}. Link do indicador deve ser ocultado na interface.`,
      )

      return e.json(200, {
        success: true,
        processed: true,
        reward_type: 'pro_refund',
        message: 'Cadastro de indicado PRO confirmado. Aguardando contratação do plano PRO.',
        record_id: newProRecord.id,
      })
    } catch (saveProErr) {
      console.error('[referrals-signup] Erro ao salvar indicação PRO:', saveProErr)
      return e.json(500, { success: false, error: 'Erro ao registrar indicação PRO no servidor.' })
    }
  }

  // =========================================================================
  // CASO GRÁTIS: ILIMITADO (+5 GERAÇÕES EXTRAS POR CADASTRO NOVO CONCLUÍDO)
  // =========================================================================
  try {
    // 1. Criar registro em referral_credits
    const refCol = $app.findCollectionByNameOrId('referral_credits')
    const newRefRecord = new Record(refCol)
    newRefRecord.set('referrer', referrerId)
    newRefRecord.set('referred_user', newUserId)
    newRefRecord.set('credits_granted', 5)
    newRefRecord.set('credits_remaining', 5)
    newRefRecord.set('status', 'active')
    newRefRecord.set('referrer_plan', 'free')
    newRefRecord.set('referral_code_used', rawRefCode || referrerUser.getString('referral_code'))
    newRefRecord.set('reward_type', 'generations_5')
    newRefRecord.set('refund_status', 'not_applicable')
    newRefRecord.set('processed_at', new Date().toISOString())
    $app.save(newRefRecord)

    // 2. Creditar +5 no saldo de regeneration_credits do indicador (acumula com saldo existente)
    let credRec = null
    try {
      credRec = $app.findFirstRecordByData('regeneration_credits', 'user', referrerId)
    } catch (_) {}

    let newBalance = 5
    if (credRec) {
      const curBal = credRec.getInt('extra_prompts_balance') || 0
      const curTot = credRec.getInt('total_purchased') || 0
      newBalance = curBal + 5
      credRec.set('extra_prompts_balance', newBalance)
      credRec.set('total_purchased', curTot + 5)
      $app.save(credRec)
    } else {
      const credCol = $app.findCollectionByNameOrId('regeneration_credits')
      const newCred = new Record(credCol)
      newCred.set('user', referrerId)
      newCred.set('extra_prompts_balance', 5)
      newCred.set('total_purchased', 5)
      newCred.set('total_used', 0)
      $app.save(newCred)
    }

    // 3. Registrar evento de funil
    try {
      const evCol = $app.findCollectionByNameOrId('events')
      const evRec = new Record(evCol)
      evRec.set('user', referrerId)
      evRec.set('event_type', 'referral_free_bonus_granted')
      evRec.set(
        'metadata',
        JSON.stringify({
          referred_user: newUserId,
          credits_granted: 5,
          new_balance: newBalance,
        }),
      )
      $app.save(evRec)
    } catch (_) {}

    console.log(
      `[referrals-signup] Sucesso! Indicador GRÁTIS ${referrerId} recebeu +5 gerações extras (novo saldo: ${newBalance}) pelo cadastro de ${newUserId}.`,
    )

    return e.json(200, {
      success: true,
      processed: true,
      reward_type: 'generations_5',
      credits_granted: 5,
      referrer_new_balance: newBalance,
      message: '+5 gerações creditadas com sucesso na conta do indicador!',
      record_id: newRefRecord.id,
    })
  } catch (freeErr) {
    console.error('[referrals-signup] Erro ao creditar bônus do modo grátis:', freeErr)
    return e.json(500, { success: false, error: 'Erro ao processar bônus de indicação grátis.' })
  }
})

// ROTA 5: POST /backend/v1/referrals/consume-credit (compatibilidade)
routerAdd('POST', '/backend/v1/referrals/consume-credit', (e) => {
  const authRecord = e.auth
  if (!authRecord) {
    return e.json(401, { error: 'Usuário não autenticado.' })
  }

  try {
    const records = $app.findRecordsByFilter(
      'referral_credits',
      `referrer = "${authRecord.id}" && status = "active" && credits_remaining > 0`,
      'created',
      10,
      0,
    )

    let consumed = false
    let remainingCreditsTotal = 0

    for (let i = 0; i < records.length; i++) {
      const cr = records[i]
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
