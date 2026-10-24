import pb from '@/lib/pocketbase/client'
import type { PromptRecord, NicheType, StyleType } from '@/types'

export interface PromptFilterOptions {
  search?: string
  niche?: NicheType | 'all'
  style?: StyleType | 'all'
  isFreeOnly?: boolean
}

export async function getPrompts(options: PromptFilterOptions = {}): Promise<PromptRecord[]> {
  const filters: string[] = []

  if (options.niche && options.niche !== 'all') {
    filters.push(`niche = '${options.niche}'`)
  }

  if (options.style && options.style !== 'all') {
    filters.push(`style = '${options.style}'`)
  }

  if (options.isFreeOnly) {
    filters.push(`is_free = true`)
  }

  if (options.search && options.search.trim()) {
    const q = options.search.trim().replace(/'/g, "\\'")
    filters.push(`(title ~ '${q}' || description ~ '${q}' || tags ~ '${q}' || hook ~ '${q}')`)
  }

  const filterString = filters.join(' && ')

  const records = await pb.collection('prompts').getFullList<PromptRecord>({
    filter: filterString || undefined,
    sort: '-created',
  })

  return records
}

export async function getPromptById(id: string): Promise<PromptRecord> {
  return await pb.collection('prompts').getOne<PromptRecord>(id)
}

/**
 * Regenera ou preenche a imagem de referência do prompt usando o pipeline Nano Banana existente
 */
export async function regeneratePromptReferenceImage(
  prompt: PromptRecord,
  userGoogleKey?: string,
): Promise<{ success: boolean; image_url?: string; error?: string }> {
  try {
    const baseUrl = import.meta.env.VITE_POCKETBASE_URL || ''
    const res = await fetch(`${baseUrl}/backend/v1/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(pb.authStore.token ? { Authorization: `Bearer ${pb.authStore.token}` } : {}),
      },
      body: JSON.stringify({
        prompt_id: prompt.id,
        product_name: prompt.title,
        niche: prompt.niche,
        style: prompt.style,
        description: prompt.description || prompt.title,
        google_ai_api_key: userGoogleKey,
      }),
    })

    const data = await res.json()
    if (data.success && data.image_url) {
      return { success: true, image_url: data.image_url }
    }
    return { success: false, error: data.error || 'Falha ao gerar imagem' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro de conexão' }
  }
}
