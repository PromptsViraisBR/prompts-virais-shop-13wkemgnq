import { pb } from '@/lib/pocketbase/client'

export interface FeedbackRecord {
  id: string
  user?: string
  name?: string
  email?: string
  message: string
  category?: 'bug' | 'idea' | 'compliment' | 'other'
  status?: 'unread' | 'read' | 'archived'
  created: string
  updated: string
  expand?: {
    user?: {
      id: string
      name?: string
      email?: string
    }
  }
}

export interface SendFeedbackInput {
  name?: string
  email?: string
  message: string
  category?: 'bug' | 'idea' | 'compliment' | 'other'
}

/**
 * Envia um feedback/sugestão/relato de bug para a plataforma.
 * Funciona tanto para usuários logados quanto para visitantes anônimos.
 */
export async function sendFeedback(input: SendFeedbackInput): Promise<FeedbackRecord> {
  const currentAuthUser = pb.authStore.model
  const payload: Record<string, any> = {
    message: input.message.trim(),
    category: input.category || 'other',
    status: 'unread',
  }

  if (currentAuthUser?.id) {
    payload.user = currentAuthUser.id
    payload.name = input.name?.trim() || currentAuthUser.name || 'Usuário Autenticado'
    payload.email = input.email?.trim() || currentAuthUser.email || ''
  } else {
    payload.name = input.name?.trim() || 'Visitante'
    payload.email = input.email?.trim() || ''
  }

  const record = await pb.collection('feedback').create<FeedbackRecord>(payload)
  return record
}

/**
 * Lista feedbacks recebidos (apenas administradores têm permissão).
 */
export async function listFeedbacks(limit = 50): Promise<FeedbackRecord[]> {
  try {
    const list = await pb.collection('feedback').getList<FeedbackRecord>(1, limit, {
      sort: '-created',
      expand: 'user',
    })
    return list.items
  } catch (err) {
    console.warn('[listFeedbacks] Erro ou sem permissão de admin:', err)
    return []
  }
}

/**
 * Atualiza o status de um feedback (unread, read, archived) - apenas admin.
 */
export async function updateFeedbackStatus(
  id: string,
  status: 'unread' | 'read' | 'archived',
): Promise<FeedbackRecord> {
  const updated = await pb.collection('feedback').update<FeedbackRecord>(id, { status })
  return updated
}
