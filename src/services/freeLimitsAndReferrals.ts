import pb from '@/lib/pocketbase/client'

export interface DailyLimitStatus {
  tab: 'virais' | 'vendas'
  date: string
  count_today: number
  limit: number
  remaining: number
  is_unlimited: boolean
  reason: 'paid_or_admin' | 'ten_annual_subscribers_reached' | 'free'
}

export interface ConsumeDailyLimitResponse {
  success: boolean
  tab: 'virais' | 'vendas'
  date: string
  count_today: number
  limit: number
  remaining: number
  is_unlimited: boolean
  error?: string
  message?: string
  limit_reached?: boolean
}

export interface ReferralHistoryItem {
  id: string
  referred_user_id: string
  referred_user_name: string
  referred_user_plan: string
  reward_type: 'generations_5' | 'pro_refund' | string
  referrer_plan: string
  credits_granted: number
  credits_remaining: number
  refund_status:
    | 'not_applicable'
    | 'pending_payment'
    | 'processing'
    | 'refunded'
    | 'refund_pending_manual'
    | 'not_eligible'
    | 'failed'
    | string
  refund_amount: number
  refund_reason: string
  status: string
  created: string
  processed_at?: string
}

export interface ProOpportunityRecord {
  id: string
  referred_user_id: string
  referred_user_name: string
  referred_user_plan: string
  created: string
  refund_status: string
  refund_amount: number
  refund_reason: string
  mp_payment_id?: string
  mp_refund_id?: string
  processed_at?: string
}

export interface ReferralOverviewResponse {
  success: boolean
  user_plan: 'free' | 'monthly' | 'annual' | string
  is_pro: boolean
  referral_code: string
  referral_link: string
  link_active: boolean
  should_hide_link: boolean
  free_stats: {
    total_referred_users: number
    valid_referrals: number
    generations_earned: number
    current_balance: number
    reward_per_referral: number
    is_unlimited: boolean
  }
  pro_stats: {
    has_referral_registered: boolean
    opportunity_used: boolean
    opportunity_record: ProOpportunityRecord | null
    stage:
      | 'awaiting_signup'
      | 'signup_confirmed_awaiting_pro'
      | 'payment_confirmed'
      | 'refund_processing'
      | 'refund_confirmed'
      | 'pending_manual'
      | 'not_completed'
      | string
    stage_label: string
    stage_detail: string
    max_referrals: number
  }
  history: ReferralHistoryItem[]
  texts: {
    free: {
      title: string
      description: string
      button: string
      highlight: string
    }
    pro: {
      title: string
      description: string
      button: string
      highlight: string
    }
  }
}

export interface ProcessSignupReferralResult {
  success: boolean
  processed: boolean
  idempotent?: boolean
  reward_type?: string
  credits_granted?: number
  referrer_new_balance?: number
  message?: string
  error?: string
}

/**
 * Consulta o status de limite diário do usuário logado na aba informada
 */
export async function getDailyLimitStatus(tab: 'virais' | 'vendas'): Promise<DailyLimitStatus> {
  const token = pb.authStore.token
  if (!token) {
    return {
      tab,
      date: new Date().toISOString().slice(0, 10),
      count_today: 0,
      limit: 6,
      remaining: 6,
      is_unlimited: false,
      reason: 'free',
    }
  }

  try {
    const res = await pb.send<DailyLimitStatus>(`/backend/v1/daily-limits/status?tab=${tab}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res
  } catch (err: any) {
    console.warn('[getDailyLimitStatus] Erro ao consultar backend:', err)
    return {
      tab,
      date: new Date().toISOString().slice(0, 10),
      count_today: 0,
      limit: 6,
      remaining: 6,
      is_unlimited: false,
      reason: 'free',
    }
  }
}

/**
 * Registra a geração de 1 prompt no servidor para a aba informada.
 * Se o limite de 6 já foi atingido e o usuário é free, lança erro com informações detalhadas.
 */
export async function consumeDailyGeneration(
  tab: 'virais' | 'vendas',
): Promise<ConsumeDailyLimitResponse> {
  const token = pb.authStore.token
  if (!token) {
    throw new Error('Usuário precisa estar autenticado para gerar prompts.')
  }

  try {
    const res = await pb.send<ConsumeDailyLimitResponse>('/backend/v1/daily-limits/consume', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { tab },
    })
    return res
  } catch (err: any) {
    // Se o backend retornou 429 (limite diário atingido)
    if (err?.status === 429 || err?.data?.limit_reached) {
      const msg =
        err?.data?.message ||
        `Você atingiu o limite de 6 prompts diários para a aba ${
          tab === 'virais' ? 'Vídeos Virais' : 'TikTok Shop/Vendas'
        }. Assine o plano PRO para gerar sem limites!`
      const customErr: any = new Error(msg)
      customErr.limitReached = true
      customErr.tab = tab
      throw customErr
    }
    throw err
  }
}

/**
 * Consulta o painel de indicações com regras completas (Grátis +5 e PRO Estorno)
 */
export async function getReferralOverview(): Promise<ReferralOverviewResponse> {
  const token = pb.authStore.token
  if (!token) {
    throw new Error('Usuário não autenticado.')
  }

  return await pb.send<ReferralOverviewResponse>('/backend/v1/referrals/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Processa a indicação no servidor após o cadastro de um novo usuário.
 * Idempotente, valida autoindicação, unicidade e credita +5 para GRÁTIS ou registra oportunidade PRO.
 */
export async function processSignupReferral(
  referralCode?: string,
): Promise<ProcessSignupReferralResult> {
  const token = pb.authStore.token
  if (!token) {
    return { success: false, processed: false, error: 'Usuário não autenticado.' }
  }

  try {
    const res = await pb.send<ProcessSignupReferralResult>('/backend/v1/referrals/process-signup', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        referral_code: referralCode || '',
      },
    })
    return res
  } catch (err: any) {
    console.warn('[processSignupReferral] Falha ao acionar rota de indicação:', err)
    return {
      success: false,
      processed: false,
      error: err?.message || 'Falha ao processar indicação.',
    }
  }
}

/**
 * Consome 1 crédito de indicação para ações PRO (compatibilidade)
 */
export async function consumeReferralCredit(): Promise<{
  success: boolean
  total_credits_remaining: number
}> {
  const token = pb.authStore.token
  if (!token) {
    throw new Error('Usuário não autenticado.')
  }

  return await pb.send<{ success: boolean; total_credits_remaining: number }>(
    '/backend/v1/referrals/consume-credit',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
