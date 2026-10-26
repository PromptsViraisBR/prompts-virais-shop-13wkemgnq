import { pb } from '@/lib/pocketbase/client'

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

export interface ReferralOverviewResponse {
  referral_code: string
  referral_link: string
  total_referred_users: number
  total_credits_remaining: number
  credits: Array<{
    id: string
    referred_user: string
    credits_granted: number
    credits_remaining: number
    expires_at: string
    status: 'active' | 'consumed' | 'expired'
    created: string
  }>
  rules: {
    credits_per_paid_sub: number
    validity_days: number
    condition: string
  }
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

  const res = await pb.send<DailyLimitStatus>(`/backend/v1/daily-limits/status?tab=${tab}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res
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
 * Consulta o painel de indicações e bônus de créditos PRO do usuário
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
 * Consome 1 crédito de indicação para ações PRO
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
