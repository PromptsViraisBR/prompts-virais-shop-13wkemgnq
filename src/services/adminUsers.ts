import pb from '@/lib/pocketbase/client'

export interface AdminUserItem {
  id: string
  email: string
  name: string
  avatar?: string
  is_admin: boolean
  verified: boolean
  welcome_email_sent: boolean
  referral_code?: string
  created: string
  updated: string
  active_plan?: string
  subscription_status?: string
}

export interface AdminUsersListResponse {
  success: boolean
  users: AdminUserItem[]
  total: number
  error?: string
}

export interface DeleteUserResponse {
  success: boolean
  already_deleted?: boolean
  user_id: string
  email?: string
  name?: string
  orphans_cleaned?: Record<string, number>
  message: string
  error?: string
}

export interface WelcomeToggleResponse {
  success: boolean
  user_id: string
  welcome_email_sent: boolean
  message: string
  error?: string
}

/**
 * Lista todos os usuários cadastrados com planos e status para o painel administrativo.
 */
export async function listAdminUsers(): Promise<AdminUsersListResponse> {
  const res = await pb.send('/backend/v1/admin/users', {
    method: 'GET',
  })
  return res as AdminUsersListResponse
}

/**
 * Exclui permanentemente um usuário e limpa todos os dados órfãos associados (hard delete idempotente).
 * O backend recusa se o admin tentar excluir a própria conta logada.
 */
export async function deleteUserAccount(userId: string): Promise<DeleteUserResponse> {
  const res = await pb.send('/backend/v1/admin/users/delete', {
    method: 'POST',
    body: {
      user_id: userId,
    },
  })
  return res as DeleteUserResponse
}

/**
 * Alterna ou define o status welcome_email_sent de um usuário específico.
 */
export async function toggleUserWelcomeSent(
  userId: string,
  targetValue?: boolean,
): Promise<WelcomeToggleResponse> {
  const res = await pb.send('/backend/v1/admin/users/welcome-toggle', {
    method: 'POST',
    body: {
      user_id: userId,
      welcome_email_sent: targetValue,
    },
  })
  return res as WelcomeToggleResponse
}
