import pb from '@/lib/pocketbase/client'

export interface MpConfigStatus {
  success: boolean
  configured: boolean
  has_token: boolean
  has_webhook_secret: boolean
  webhook_url: string
  message: string
}

export interface CreateCheckoutParams {
  type: 'subscription' | 'credits'
  plan?: 'monthly' | 'annual'
  quantity?: number
}

export interface CreateCheckoutResult {
  success: boolean
  type: 'subscription_preapproval' | 'checkout_pro'
  init_point?: string
  sandbox_init_point?: string
  preapproval_id?: string
  preference_id?: string
  external_reference?: string
  error?: string
  code?: string
}

export interface AdminOverviewResult {
  success: boolean
  is_configured: boolean
  webhook_url: string
  metrics: {
    total_users: number
    active_monthly_subscriptions: number
    active_annual_subscriptions: number
    total_active_subscriptions: number
    cancelled_subscriptions: number
  }
  users: Array<{
    id: string
    name: string
    email: string
    is_admin: boolean
    created: string
  }>
  subscriptions: Array<{
    id: string
    user_id: string
    plan: string
    status: string
    mp_preapproval_id?: string
    mp_payment_id?: string
    payer_email?: string
    start_date?: string
    end_date?: string
    next_payment_date?: string
    created: string
  }>
  payments: Array<{
    id: string
    user_id?: string
    mp_payment_id: string
    payment_type?: string
    status: string
    status_detail?: string
    transaction_amount?: number
    payer_email?: string
    payment_method_id?: string
    created: string
  }>
}

/**
 * Consulta o status de configuração das credenciais privadas do Mercado Pago no backend
 */
export async function getMercadoPagoConfigStatus(): Promise<MpConfigStatus> {
  try {
    const res = await pb.send<MpConfigStatus>('/backend/v1/mp/config-status', {
      method: 'GET',
    })
    return res
  } catch (err: any) {
    console.warn('Erro ao consultar status MP:', err)
    return {
      success: false,
      configured: false,
      has_token: false,
      has_webhook_secret: false,
      webhook_url: `${pb.baseUrl}/backend/v1/mp/webhook`,
      message: 'Não foi possível conectar ao servidor para verificar pagamentos.',
    }
  }
}

/**
 * Inicia a criação de checkout oficial do Mercado Pago (Checkout Pro ou Assinatura Recorrente)
 */
export async function createMercadoPagoCheckout(
  params: CreateCheckoutParams,
): Promise<CreateCheckoutResult> {
  try {
    const res = await pb.send<CreateCheckoutResult>('/backend/v1/mp/create-checkout', {
      method: 'POST',
      body: params,
    })
    return res
  } catch (err: any) {
    const errMsg = err?.data?.error || err?.message || 'Falha ao iniciar checkout com Mercado Pago'
    const code = err?.data?.code || (err?.status === 503 ? 'PAYMENTS_NOT_CONFIGURED' : 'ERROR')
    return {
      success: false,
      type: 'checkout_pro',
      error: errMsg,
      code,
    }
  }
}

/**
 * Cancela a assinatura ativa no Mercado Pago e atualiza a base local
 */
export async function cancelMercadoPagoSubscription(
  subscriptionId?: string,
): Promise<{ success: boolean; mp_cancelled?: boolean; message?: string; error?: string }> {
  try {
    const res = await pb.send<{ success: boolean; mp_cancelled?: boolean; message?: string }>(
      '/backend/v1/mp/cancel-subscription',
      {
        method: 'POST',
        body: { subscription_id: subscriptionId },
      },
    )
    return res
  } catch (err: any) {
    return {
      success: false,
      error: err?.data?.error || err?.message || 'Erro ao cancelar assinatura.',
    }
  }
}

/**
 * Consulta dados gerenciais para o painel admin
 */
export async function getAdminOverview(): Promise<AdminOverviewResult> {
  return await pb.send<AdminOverviewResult>('/backend/v1/mp/admin/overview', {
    method: 'GET',
  })
}

export interface RefundPaymentResult {
  success: boolean
  message?: string
  refund_id?: string | number
  payment_id?: string
  status?: string
  error?: string
  consequences?: {
    subscription_cancelled: boolean
    credits_deducted: number
  }
  details?: any
}

/**
 * Executa o estorno/reembolso oficial de um pagamento via Mercado Pago (Apenas Admins)
 */
export async function refundMercadoPagoPayment(
  paymentId: string,
  amount?: number,
): Promise<RefundPaymentResult> {
  try {
    const res = await pb.send<RefundPaymentResult>('/backend/v1/mp/admin/refund', {
      method: 'POST',
      body: {
        payment_id: paymentId,
        amount: amount,
      },
    })
    return res
  } catch (err: any) {
    return {
      success: false,
      error: err?.data?.error || err?.message || 'Falha ao solicitar estorno no Mercado Pago.',
      details: err?.data?.details,
    }
  }
}
