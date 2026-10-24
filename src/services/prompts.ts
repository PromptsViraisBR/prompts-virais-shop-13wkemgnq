import pb from '@/lib/pocketbase/client'
import type { PromptRecord, NicheType, StyleType, PromptCategoryType } from '@/types'

export interface PromptFilterOptions {
  search?: string
  niche?: NicheType | 'all'
  style?: StyleType | 'all'
  isFreeOnly?: boolean
  category?: PromptCategoryType | 'all'
}

export async function getPrompts(options: PromptFilterOptions = {}): Promise<PromptRecord[]> {
  const filters: string[] = []

  if (options.category && options.category !== 'all') {
    if (options.category === 'ecommerce') {
      filters.push(`(category = 'ecommerce' || category = '' || category = null)`)
    } else {
      filters.push(`category = '${options.category}'`)
    }
  }

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
