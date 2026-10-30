import pb from '@/lib/pocketbase/client'

export interface RadarVideoItem {
  id: string
  external_id: string
  platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook' | string
  platform_name: string
  title: string
  description: string
  thumbnail_url: string
  original_url: string
  author_name: string
  author_handle: string
  views_count: number
  likes_count: number
  comments_count: number
  shares_count?: number | null
  niche: string
  country?: string
  language?: string
  growth_score: number
  published_at: string
}

export interface RadarFilterParams {
  platform?: 'all' | 'tiktok' | 'instagram' | 'youtube' | 'facebook'
  niche?: string
  period?: '24h' | '7d' | '30d'
  sort?: 'recent' | 'views' | 'engagement' | 'growth'
}

export interface RadarResponse {
  success: boolean
  connected: boolean
  source?: string | null
  message?: string
  required_secret?: string
  filters_applied: RadarFilterParams
  total_items: number
  items: RadarVideoItem[]
}

export interface SourceItem {
  id: string
  name: string
  connected: boolean
  required_secret: string
  type: string
  description: string
}

export interface SourcesStatusResponse {
  success: boolean
  sources: Record<string, SourceItem>
  message?: string
}

export interface HypeonLimitItem {
  id: string
  tool_id: string
  tool_name: string
  free_limit_daily: number
  pro_limit_daily: number
  credit_cost: number
  is_active: boolean
  description: string
}

export interface HypeonLimitsResponse {
  success: boolean
  limits: HypeonLimitItem[]
}

export interface UpdateLimitPayload {
  tool_id: string
  free_limit_daily?: number
  pro_limit_daily?: number
  credit_cost?: number
  is_active?: boolean
  description?: string
}

export interface HypeonUsageStatsResponse {
  success: boolean
  stats: {
    total_saved_videos: number
    recent_events: any[]
    active_tools_count: number
    planned_tools_count: number
  }
}

export interface ViralSavedRecord {
  id: string
  user: string
  external_id: string
  platform: string
  title: string
  description?: string
  thumbnail_url?: string
  original_url: string
  author_name?: string
  author_handle?: string
  views_count?: number
  likes_count?: number
  comments_count?: number
  shares_count?: number
  niche?: string
  growth_score?: number
  published_at?: string
  notes?: string
  created: string
  updated: string
}

const BACKEND_URL = import.meta.env.VITE_POCKETBASE_URL || ''

/**
 * Consulta status das fontes de tendências (YouTube Data API, etc.)
 */
export async function getHypeonSourcesStatus(): Promise<SourcesStatusResponse> {
  const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/sources-status`, {
    headers: {
      Accept: 'application/json',
      ...(pb.authStore.token ? { Authorization: `Bearer ${pb.authStore.token}` } : {}),
    },
  })
  if (!res.ok) {
    throw new Error(`Falha ao obter status das fontes: HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Consulta o Radar Viral com filtros de nicho, plataforma, período e ordenação
 */
export async function getRadarViralVideos(params: RadarFilterParams = {}): Promise<RadarResponse> {
  const query = new URLSearchParams()
  if (params.platform) query.set('platform', params.platform)
  if (params.niche) query.set('niche', params.niche)
  if (params.period) query.set('period', params.period)
  if (params.sort) query.set('sort', params.sort)

  const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/radar?${query.toString()}`, {
    headers: {
      Accept: 'application/json',
      ...(pb.authStore.token ? { Authorization: `Bearer ${pb.authStore.token}` } : {}),
    },
  })
  if (!res.ok) {
    throw new Error(`Falha ao consultar Radar Viral: HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Lista os limites por ferramenta HYPEON
 */
export async function getHypeonLimits(): Promise<HypeonLimitsResponse> {
  const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/limits`, {
    headers: {
      Accept: 'application/json',
      ...(pb.authStore.token ? { Authorization: `Bearer ${pb.authStore.token}` } : {}),
    },
  })
  if (!res.ok) {
    throw new Error(`Falha ao consultar limites HYPEON: HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Atualiza os limites de uma ferramenta (Admin)
 */
export async function updateHypeonLimit(
  payload: UpdateLimitPayload,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/admin/update-limit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${pb.authStore.token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || `Falha ao atualizar limite: HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Estatísticas de uso HYPEON (Admin)
 */
export async function getHypeonUsageStats(): Promise<HypeonUsageStatsResponse> {
  const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/usage-stats`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${pb.authStore.token}`,
    },
  })
  if (!res.ok) {
    throw new Error(`Falha ao consultar estatísticas HYPEON: HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Salva uma referência de vídeo na biblioteca viral do usuário (viral_saved)
 */
export async function saveViralVideoReference(
  video: Partial<RadarVideoItem>,
  notes?: string,
): Promise<ViralSavedRecord> {
  if (!pb.authStore.record?.id) {
    throw new Error('Você precisa estar logado para salvar referências.')
  }

  const recordData = {
    user: pb.authStore.record.id,
    external_id: video.external_id || video.id || String(Date.now()),
    platform: video.platform || 'youtube',
    title: video.title || 'Vídeo Viral',
    description: video.description || '',
    thumbnail_url: video.thumbnail_url || '',
    original_url: video.original_url || '',
    author_name: video.author_name || '',
    author_handle: video.author_handle || '',
    views_count: video.views_count || 0,
    likes_count: video.likes_count || 0,
    comments_count: video.comments_count || 0,
    shares_count: video.shares_count || 0,
    niche: video.niche || '',
    growth_score: video.growth_score || 0,
    published_at: video.published_at || '',
    notes: notes || '',
  }

  return pb.collection('viral_saved').create<ViralSavedRecord>(recordData)
}

/**
 * Remove um vídeo salvo da biblioteca
 */
export async function removeViralSavedReference(recordId: string): Promise<boolean> {
  await pb.collection('viral_saved').delete(recordId)
  return true
}

/**
 * Lista as referências virais salvas pelo usuário
 */
export async function getViralSavedReferences(
  page = 1,
  perPage = 30,
): Promise<{ items: ViralSavedRecord[]; totalItems: number }> {
  if (!pb.authStore.record?.id) {
    return { items: [], totalItems: 0 }
  }
  const result = await pb.collection('viral_saved').getList<ViralSavedRecord>(page, perPage, {
    filter: `user = "${pb.authStore.record.id}"`,
    sort: '-created',
  })
  return {
    items: result.items,
    totalItems: result.totalItems,
  }
}
