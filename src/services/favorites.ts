import pb from '@/lib/pocketbase/client'
import type { FavoriteRecord, PromptRecord } from '@/types'

export async function getUserFavorites(userId: string): Promise<FavoriteRecord[]> {
  try {
    return await pb.collection('favorites').getFullList<FavoriteRecord>({
      filter: `user = '${userId}'`,
      expand: 'prompt',
      sort: '-created',
    })
  } catch (err) {
    console.warn('Erro ao carregar favoritos:', err)
    return []
  }
}

export async function toggleFavorite(userId: string, promptId: string): Promise<boolean> {
  // Verifica se já existe
  try {
    const existing = await pb.collection('favorites').getList<FavoriteRecord>(1, 1, {
      filter: `user = '${userId}' && prompt = '${promptId}'`,
    })

    if (existing.items.length > 0) {
      await pb.collection('favorites').delete(existing.items[0].id)
      return false // removido
    } else {
      await pb.collection('favorites').create({
        user: userId,
        prompt: promptId,
      })
      return true // adicionado
    }
  } catch (err) {
    console.error('Erro ao alternar favorito:', err)
    throw err
  }
}

export async function isPromptFavorited(userId: string, promptId: string): Promise<boolean> {
  try {
    const existing = await pb.collection('favorites').getList<FavoriteRecord>(1, 1, {
      filter: `user = '${userId}' && prompt = '${promptId}'`,
    })
    return existing.items.length > 0
  } catch (_) {
    return false
  }
}
