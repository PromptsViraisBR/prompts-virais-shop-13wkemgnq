import pb from '@/lib/pocketbase/client'

export interface EmailStatusResponse {
  success: boolean
  smtp_configured: boolean
  sender_address: string
  sender_name: string
  metrics: {
    total_users: number
    welcome_emails_sent: number
    expired_subscriptions_notified: number
    subscription_confirmations_notified: number
  }
  automations: Array<{
    name: string
    schedule?: string
    description: string
    status: string
  }>
}

export interface RunExpirationCheckResponse {
  success: boolean
  executed_at: string
  expired_count: number
  processed: Array<{
    id: string
    user_id: string
    plan: string
    email: string
    email_sent: boolean
    mail_error: string | null
    already_notified: boolean
  }>
}

export interface TestEmailResponse {
  success: boolean
  type: string
  target_email: string
  sent_via_mailer: boolean
  error_from_mailer: string | null
  diagnostic: string
}

/**
 * Obtém status do mailer nativo e métricas de automações de e-mail (Admin)
 */
export async function getEmailStatus(): Promise<EmailStatusResponse> {
  const res = await pb.send('/backend/v1/admin/email-status', {
    method: 'GET',
  })
  return res as EmailStatusResponse
}

/**
 * Executa manualmente a varredura de vencimento de assinaturas (Admin)
 */
export async function runExpirationCheck(): Promise<RunExpirationCheckResponse> {
  const res = await pb.send('/backend/v1/admin/run-expiration-check', {
    method: 'POST',
  })
  return res as RunExpirationCheckResponse
}

/**
 * Dispara teste de e-mail transacional para um endereço (Admin)
 */
export async function testTransactionalEmail(
  type: 'welcome' | 'subscription_active' | 'payment_failed' | 'access_expired',
  targetEmail?: string,
): Promise<TestEmailResponse> {
  const res = await pb.send('/backend/v1/admin/test-transactional-email', {
    method: 'POST',
    body: {
      type,
      target_email: targetEmail,
    },
  })
  return res as TestEmailResponse
}
