import pb from '@/lib/pocketbase/client'

export interface HypeonUserLimitStatus {
  success: boolean
  tool_id: string
  is_pro: boolean
  is_admin: boolean
  daily_limit: number
  used_today: number
  remaining: number
  allowed: boolean
  error?: string
}

export async function getHypeonUserLimit(toolId: string): Promise<HypeonUserLimitStatus> {
  try {
    const res = await pb.send(
      `/backend/v1/hypeon/user-limits?tool_id=${encodeURIComponent(toolId)}`,
      {
        method: 'GET',
      },
    )
    return res as HypeonUserLimitStatus
  } catch (err: any) {
    return {
      success: false,
      tool_id: toolId,
      is_pro: false,
      is_admin: false,
      daily_limit: 2,
      used_today: 0,
      remaining: 2,
      allowed: true,
      error: err?.message,
    }
  }
}

// -------------------------------------------------------------
// CLONADOR VIRAL TYPES & API
// -------------------------------------------------------------
export type ClonadorMode = 'recriar_formato' | 'melhorar_original' | 'nova_versao' | 'versao_curta'
export type ShortDuration = '15s' | '30s' | '45s'

export interface ClonadorScene {
  scene_number: number
  duration: string
  visual_description: string
  voiceover: string
  screen_text: string
  sound_effects: string
  transition: string
}

export interface ClonadorResult {
  title: string
  category: string
  reference_analysis: {
    detected_hook: string
    narrative_structure: string
    pacing: string
    emotional_trigger: string
    peak_impact_moment: string
    originality_note: string
  }
  hook: string
  full_script: string
  narration: string
  dialogues: string
  scenes: ClonadorScene[]
  sound_effects_overview: string
  transitions_overview: string
  closure: string
  cta: string
}

export interface CloneVideoParams {
  video_url?: string
  manual_description?: string
  mode: ClonadorMode
  duration_short?: ShortDuration
  category?: string
}

export interface CloneVideoResponse {
  success: boolean
  mode: ClonadorMode
  youtube_metadata?: {
    videoId: string
    title: string
    description: string
    channelTitle: string
    views: number
    likes: number
  } | null
  data: ClonadorResult
  project_id?: string
  usage: {
    used_today: number
    daily_limit: number
    remaining: number
  }
  error?: string
  is_limit_reached?: boolean
}

const BACKEND_URL = import.meta.env.VITE_POCKETBASE_URL || ''

export async function cloneVideo(params: CloneVideoParams): Promise<CloneVideoResponse> {
  const controller = new AbortController()
  const timeoutMs = 120000 // 120s para IA completa sem cancelamento prematuro
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/clone-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(pb.authStore.token ? { Authorization: `Bearer ${pb.authStore.token}` } : {}),
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      if (res.status === 429) {
        return {
          success: false,
          mode: params.mode,
          data: null as any,
          usage: { used_today: 0, daily_limit: 0, remaining: 0 },
          error:
            data?.error ||
            'Você atingiu o limite diário de uso do Clonador Viral. Faça upgrade para o plano PRO para gerar sem limites!',
          is_limit_reached: true,
        }
      }
      if (res.status === 401) {
        throw new Error('Sua sessão expirou ou você não está autenticado. Faça login novamente.')
      }
      if (res.status === 400) {
        throw new Error(
          data?.error ||
            'O link informado parece inválido ou incompleto. Verifique a URL do YouTube Shorts, TikTok ou Reels e tente novamente.',
        )
      }
      if (res.status === 504 || res.status === 408) {
        throw new Error(
          'O processamento de IA atingiu o tempo limite de resposta. O serviço pode estar sobrecarregado; tente novamente em instantes com um vídeo ou descrição mais objetiva.',
        )
      }
      if (res.status >= 500) {
        throw new Error(
          data?.error ||
            'O serviço de geração de IA está temporariamente sobrecarregado. Tentamos a recuperação resiliente, mas os servidores de IA estão com alta demanda. Tente novamente em instantes.',
        )
      }
      throw new Error(
        data?.error || `Não foi possível processar o vídeo (código HTTP ${res.status}).`,
      )
    }

    return data as CloneVideoResponse
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error(
        'O processamento demorou mais do que o esperado (limite de 120s). Tente novamente com uma descrição mais curta.',
      )
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// -------------------------------------------------------------
// HYPEON STORIES TYPES & API
// -------------------------------------------------------------
export interface StoryCharacter {
  id: string
  name: string
  appearance: string
  clothes: string
  personality: string
  role?: string
}

export interface StorySeries {
  id: string
  series_title: string
  category: string
  description: string
  characters: StoryCharacter[]
  recurring_settings: string[]
  episodes_count: number
  last_events_summary?: string
  created?: string
}

export interface StoryScene {
  scene_number: number
  duration: string
  visual_description: string
  voiceover: string
  image_prompt: string
  video_prompt: string
  sound_effects: string
  characters_present?: string[]
}

export interface StoryResult {
  title: string
  category: string
  episode_number: number
  hook: string
  full_story: string
  narration: string
  dialogues: string
  scenes: StoryScene[]
  sound_effects_overview: string
  cta: string
  next_episode_hook?: string
  episode_summary_for_next?: string
}

export interface GenerateStoryParams {
  theme: string
  category: string
  duration?: string
  characters_count?: number
  visual_style?: string
  ending_type?: string
  platform?: string
  series_id?: string
  episode_number?: number
}

export interface GenerateStoryResponse {
  success: boolean
  data: StoryResult
  project_id?: string
  series_id?: string | null
  usage: {
    used_today: number
    daily_limit: number
    remaining: number
  }
  error?: string
  is_limit_reached?: boolean
}

export async function generateStory(params: GenerateStoryParams): Promise<GenerateStoryResponse> {
  const res = await pb.send('/backend/v1/hypeon/generate-story', {
    method: 'POST',
    body: params,
  })
  return res as GenerateStoryResponse
}

export async function listUserSeries(): Promise<{ success: boolean; series: StorySeries[] }> {
  const res = await pb.send('/backend/v1/hypeon/series/list', {
    method: 'GET',
  })
  return res as { success: boolean; series: StorySeries[] }
}

export async function saveUserSeries(
  payload: Partial<StorySeries>,
): Promise<{ success: boolean; series: StorySeries }> {
  const res = await pb.send('/backend/v1/hypeon/series/save', {
    method: 'POST',
    body: payload,
  })
  return res as { success: boolean; series: StorySeries }
}

// -------------------------------------------------------------
// HYPEON IDEAS TYPES & API
// -------------------------------------------------------------
export interface HypeonIdeaItem {
  id: string
  title: string
  hook: string
  summary: string
  script_outline: string
  suggested_scenes: string[]
  cta: string
  engagement_score: number
  engagement_estimate: string
}

export interface GenerateIdeasParams {
  niche: string
  theme: string
  platform?: string
  target_audience?: string
  duration?: string
  video_style?: string
  content_goal?: string
  count: 5 | 10 | 20
}

export interface GenerateIdeasResponse {
  success: boolean
  data: {
    niche: string
    ideas: HypeonIdeaItem[]
  }
  count: number
  usage: {
    used_today: number
    daily_limit: number
    remaining: number
  }
  error?: string
  is_limit_reached?: boolean
}

export async function generateIdeas(params: GenerateIdeasParams): Promise<GenerateIdeasResponse> {
  const res = await pb.send('/backend/v1/hypeon/generate-ideas', {
    method: 'POST',
    body: params,
  })
  return res as GenerateIdeasResponse
}

// -------------------------------------------------------------
// ANALISADOR DE VÍDEOS TYPES & API
// -------------------------------------------------------------
export interface VideoAnalysisScores {
  first_seconds: number
  hook_strength: number
  message_clarity: number
  pacing: number
  curiosity_build: number
  narrative: number
  retention_potential: number
  closure_and_cta: number
}

export interface VideoAnalysisDiagnostics {
  what_is_working: string[]
  what_needs_improvement: string[]
  dropoff_risks: string[]
  how_to_improve_hook: string
  how_to_improve_script: string
  how_to_increase_retention: string
}

export interface VideoAnalysisResult {
  overall_score: number
  disclaimer: string
  scores: VideoAnalysisScores
  diagnostics: VideoAnalysisDiagnostics
  suggested_hook_rewrite?: string
}

export interface AnalyzeVideoParams {
  video_url?: string
  description?: string
  niche?: string
}

export interface AnalyzeVideoResponse {
  success: boolean
  data: VideoAnalysisResult
  project_id?: string
  youtube_metadata?: any
  usage: {
    used_today: number
    daily_limit: number
    remaining: number
  }
  error?: string
  is_limit_reached?: boolean
}

export async function analyzeVideo(params: AnalyzeVideoParams): Promise<AnalyzeVideoResponse> {
  const res = await pb.send('/backend/v1/hypeon/analyze-video', {
    method: 'POST',
    body: params,
  })
  return res as AnalyzeVideoResponse
}

// -------------------------------------------------------------
// PROJETOS SALVOS (HYPEON PROJECTS)
// -------------------------------------------------------------
// -------------------------------------------------------------
// CRIADOR DE CENAS (HYPEON CENAS - FASE 4)
// -------------------------------------------------------------
export type VisualStyle =
  | 'Realista cinematográfico'
  | 'Animação 3D'
  | 'Cartoon'
  | 'Anime'
  | 'Documentário'
  | 'Terror cinematográfico'
  | 'Estilo viral de redes sociais'

export interface SceneItem {
  scene_number: number
  duration: string
  visual_description: string
  characters?: string
  setting?: string
  framing?: string
  lighting?: string
  camera_movement?: string
  action?: string
  expressions?: string
  image_prompt: string
  video_prompt: string
  narration: string
}

export interface GenerateScenesResult {
  title: string
  visual_style: string
  total_scenes_in_batch: number
  scenes: SceneItem[]
}

export interface GenerateScenesParams {
  script: string
  visual_style: VisualStyle
  title?: string
  batch_index?: number
  scenes_count?: number
}

export interface GenerateScenesResponse {
  success: boolean
  data: GenerateScenesResult
  project_id?: string
  visual_style: string
  usage: {
    used_today: number
    daily_limit: number
    remaining: number
  }
  is_limit_reached?: boolean
  error?: string
  warning?: string
}

export async function generateScenes(
  params: GenerateScenesParams,
): Promise<GenerateScenesResponse> {
  const token = pb.authStore.token
  const res = await fetch(`${BACKEND_URL}/backend/v1/hypeon/generate-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `Erro HTTP ${res.status} ao gerar cenas`)
  }
  return data
}

// -------------------------------------------------------------
// PROJETOS SALVOS (HYPEON PROJECTS - FASE 3 e 4)
// -------------------------------------------------------------
export interface HypeonProjectRecord {
  id: string
  user: string
  tool_id:
    | 'clonador'
    | 'stories'
    | 'ideas'
    | 'analisador'
    | 'cenas'
    | 'prompt_imagem'
    | 'prompt_video'
  title: string
  category?: string
  mode?: string
  source_type?: string
  source_reference?: string
  content_type?: string
  folder?: string
  notes?: string
  payload: any
  is_favorite?: boolean
  created: string
  updated: string
}

export async function listHypeonProjects(
  toolId?: string,
  folder?: string,
): Promise<HypeonProjectRecord[]> {
  const filters: string[] = []
  if (toolId && toolId !== 'all') {
    filters.push(`tool_id = "${toolId}"`)
  }
  if (folder) {
    filters.push(`folder = "${folder}"`)
  }
  const filter = filters.join(' && ')
  const records = await pb.collection('hypeon_projects').getList<HypeonProjectRecord>(1, 100, {
    filter,
    sort: '-created',
  })
  return records.items
}

export async function deleteHypeonProject(id: string): Promise<boolean> {
  return await pb.collection('hypeon_projects').delete(id)
}

export async function updateHypeonProject(
  id: string,
  data: Partial<
    Pick<HypeonProjectRecord, 'title' | 'category' | 'folder' | 'notes' | 'is_favorite' | 'payload'>
  >,
): Promise<HypeonProjectRecord> {
  return await pb.collection('hypeon_projects').update<HypeonProjectRecord>(id, data)
}

export async function saveHypeonProject(data: {
  tool_id: string
  title: string
  category?: string
  mode?: string
  source_type?: string
  source_reference?: string
  content_type?: string
  folder?: string
  notes?: string
  payload: any
  is_favorite?: boolean
}): Promise<HypeonProjectRecord> {
  if (!pb.authStore.record?.id) {
    throw new Error('Você precisa estar logado para salvar projetos.')
  }
  return await pb.collection('hypeon_projects').create<HypeonProjectRecord>({
    user: pb.authStore.record.id,
    tool_id: data.tool_id as any,
    title: data.title,
    category: data.category || '',
    mode: data.mode || '',
    source_type: data.source_type || '',
    source_reference: data.source_reference || '',
    content_type: data.content_type || data.tool_id,
    folder: data.folder || '',
    notes: data.notes || '',
    payload: data.payload,
    is_favorite: !!data.is_favorite,
  })
}

export async function duplicateHypeonProject(
  project: HypeonProjectRecord,
): Promise<HypeonProjectRecord> {
  return await saveHypeonProject({
    tool_id: project.tool_id,
    title: `${project.title} (Cópia)`,
    category: project.category,
    mode: project.mode,
    source_type: project.source_type,
    source_reference: project.source_reference,
    content_type: project.content_type,
    folder: project.folder,
    notes: project.notes,
    payload: project.payload,
    is_favorite: project.is_favorite,
  })
}
