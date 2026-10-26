import pb from '@/lib/pocketbase/client'

export type FunnelEventType =
  | 'page_view'
  | 'signup'
  | 'first_prompt_generated'
  | 'plans_view'
  | 'checkout_start'
  | 'checkout_start_pix'
  | 'payment_confirmed'
  | 'subscription_cancelled'

export interface TrackEventParams {
  event_type: FunnelEventType
  user_id?: string
  session_id?: string
  metadata?: Record<string, unknown>
}

export interface FunnelMetricsResponse {
  success: boolean
  period: 'today' | '7d' | '30d' | 'all'
  filter_date: string
  metrics: {
    page_views: number
    signups: number
    first_prompts: number
    plans_views: number
    checkout_starts: number
    payments_confirmed: number
    cancellations: number
  }
  conversion_rates: {
    visit_to_signup: string
    signup_to_prompt: string
    prompt_to_checkout: string
    checkout_to_payment: string
    global_conversion: string
  }
}

export interface ResetAnalyticsResponse {
  success: boolean
  message: string
  deleted_counts: {
    events: number
    payments_history: number
    daily_generation_usage: number
    video_credits_usage: number
    users_welcome_flags_reset: number
    subscriptions_email_flags_reset: number
  }
  preserved: {
    users: boolean
    subscriptions: boolean
    prompts: boolean
    favorites: boolean
  }
  error?: string
}

const SESSION_KEY = 'pv_funnel_session_id'

export function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now()
      sessionStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return 'sid_fallback_' + Date.now()
  }
}

/**
 * Envia evento para o hook /backend/v1/track-event
 * Silencioso em caso de falha de rede para nunca degradar a experiência do usuário.
 */
export async function trackFunnelEvent(
  eventType: FunnelEventType,
  metadata?: Record<string, unknown>,
  userIdOverride?: string,
): Promise<void> {
  try {
    const authUser = pb.authStore.model
    const userId = userIdOverride || (authUser ? authUser.id : undefined)
    const sessionId = getOrCreateSessionId()

    await pb.send('/backend/v1/track-event', {
      method: 'POST',
      body: {
        event_type: eventType,
        user_id: userId,
        session_id: sessionId,
        metadata: metadata || {},
      },
    })
  } catch (err) {
    // Não interromper o fluxo do usuário por falha em telemetria
    console.debug('[events] Telemetria não entregue:', err)
  }
}

/**
 * Consulta métricas agregadas do funil para o painel de administração
 */
export async function getFunnelMetrics(
  period: 'today' | '7d' | '30d' | 'all' = '30d',
): Promise<FunnelMetricsResponse | null> {
  try {
    const res = await pb.send<FunnelMetricsResponse>('/backend/v1/admin/funnel-metrics', {
      method: 'GET',
      query: { period },
    })
    return res
  } catch (err) {
    console.error('[events] Falha ao consultar métricas do funil:', err)
    return null
  }
}

/**
 * Zera todos os dados de métricas/estatísticas de teste acumulados (Apenas Admin).
 * PRESERVA: contas de usuários, assinaturas ativas, prompts e favoritos.
 */
export async function resetAnalyticsData(): Promise<ResetAnalyticsResponse> {
  return await pb.send<ResetAnalyticsResponse>('/backend/v1/admin/reset-analytics', {
    method: 'POST',
  })
}
