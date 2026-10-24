export type PlanType = 'free' | 'monthly' | 'annual'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'

export type NicheType =
  | 'moda_feminina'
  | 'moda_masculina'
  | 'fitness_academia'
  | 'moda_praia'
  | 'acessorios_calcados'
  | 'streetwear_casual'
  | 'infantil_kids'
  | 'lingerie_pijamas'
  | 'espelhos_decoracao'
  | 'produtos_eletronicos'
  | 'capinhas_acessorios_celular'
  | 'moda_fitness_plus_size'
  | 'pet_acessorios'
  | 'cozinha_utilidades'
  | 'relogios_bijus'

export type StyleType = 'pov' | 'modelo' | 'unboxing_vitrine'
export type PlatformType = 'tiktok_shop' | 'shopee' | 'ambos'

export interface UserRecord {
  id: string
  email: string
  name?: string
  avatar?: string
  xai_api_key?: string
  google_ai_api_key?: string
  created: string
  updated: string
}

export interface SubscriptionRecord {
  id: string
  user: string
  plan: PlanType
  status: SubscriptionStatus
  start_date?: string
  end_date?: string
  card_last4?: string
  card_brand?: string
  created: string
  updated: string
}

export interface PromptRecord {
  id: string
  title: string
  description?: string
  niche: NicheType
  style: StyleType
  prompt_text: string
  hook?: string
  call_to_action?: string
  platform?: PlatformType
  is_free?: boolean
  tags?: string
  reference_image_url?: string
  reference_video_url?: string
  created: string
  updated: string
}

export interface FavoriteRecord {
  id: string
  user: string
  prompt: string
  expand?: {
    prompt?: PromptRecord
  }
  created: string
  updated: string
}

export interface GenerationRecord {
  id: string
  user: string
  product_name: string
  niche: NicheType
  style: StyleType
  platform?: PlatformType
  target_audience?: string
  generated_prompt: string
  generated_image_url?: string
  generated_video_url?: string
  video_engine?: string
  engine_mode?: string
  combination_mode?: string
  reference_images?: string[] | string
  reference_image_urls?: string[]
  image_prompt_description?: string
  created: string
  updated: string
}

export type VideoEngineType = 'flow' | 'grok' | 'kling' | 'hailuo' | 'luma'

export interface VideoEngineMeta {
  id: VideoEngineType
  name: string
  badge: string
  dailyLimit: number
  description: string
  supportsCustomKey: boolean
  keyProvider?: 'xai' | 'google'
  keyName?: string
}

export const VIDEO_ENGINES: Record<VideoEngineType, VideoEngineMeta> = {
  flow: {
    id: 'flow',
    name: 'Flow (Veo 3.1 Fast)',
    badge: '50 créditos/dia',
    dailyLimit: 50,
    description: 'Motor do Google DeepMind/Veo, formato vertical 9:16 de 5 a 8s.',
    supportsCustomKey: true,
    keyProvider: 'google',
    keyName: 'Google AI Studio API Key',
  },
  grok: {
    id: 'grok',
    name: 'Grok Imagine Video',
    badge: '30 créditos/dia',
    dailyLimit: 30,
    description: 'Motor da xAI com image-to-video e cinematografia realista.',
    supportsCustomKey: true,
    keyProvider: 'xai',
    keyName: 'xAI Grok API Key',
  },
  kling: {
    id: 'kling',
    name: 'Kling Video v1.5',
    badge: '20 créditos/dia',
    dailyLimit: 20,
    description: 'Renderização de alta fidelidade para tecidos e caimento.',
    supportsCustomKey: false,
  },
  hailuo: {
    id: 'hailuo',
    name: 'Hailuo (MiniMax)',
    badge: '20 créditos/dia',
    dailyLimit: 20,
    description: 'Movimentos naturais de modelos e iluminação de estúdio.',
    supportsCustomKey: false,
  },
  luma: {
    id: 'luma',
    name: 'Luma Dream Machine',
    badge: '15 créditos/dia',
    dailyLimit: 15,
    description: 'Câmera dinâmica e transições para unboxing e vitrine.',
    supportsCustomKey: false,
  },
}

export interface EngineCreditStatus {
  name: string
  limit: number
  used: number
  remaining: number | string
  has_custom_key: boolean
  full_mode: boolean
}

export interface VideoCreditsResponse {
  success: boolean
  is_pro: boolean
  date: string
  has_xai_key: boolean
  has_google_key: boolean
  engines: Record<VideoEngineType, EngineCreditStatus>
}

export const NICHE_LABELS: Record<NicheType, string> = {
  moda_feminina: 'Moda Feminina',
  moda_masculina: 'Moda Masculina',
  fitness_academia: 'Fitness & Academia',
  moda_praia: 'Moda Praia',
  acessorios_calcados: 'Acessórios & Calçados',
  streetwear_casual: 'Streetwear & Casual',
  infantil_kids: 'Infantil & Kids',
  lingerie_pijamas: 'Lingerie & Pijamas',
  espelhos_decoracao: 'Espelhos & Decoração',
  produtos_eletronicos: 'Produtos Eletrônicos',
  capinhas_acessorios_celular: 'Capinhas & Acessórios Celular',
  moda_fitness_plus_size: 'Moda Fitness Plus Size',
  pet_acessorios: 'Pet & Acessórios',
  cozinha_utilidades: 'Cozinha & Utilidades',
  relogios_bijus: 'Relógios & Bijus',
}

export const NICHE_EMOJIS: Record<NicheType, string> = {
  moda_feminina: '👗',
  moda_masculina: '👔',
  fitness_academia: '💪',
  moda_praia: '👙',
  acessorios_calcados: '👠',
  streetwear_casual: '🧢',
  infantil_kids: '👶',
  lingerie_pijamas: '🩱',
  espelhos_decoracao: '🪞',
  produtos_eletronicos: '📱',
  capinhas_acessorios_celular: '🔌',
  moda_fitness_plus_size: '🏋️',
  pet_acessorios: '🧸',
  cozinha_utilidades: '🏠',
  relogios_bijus: '⌚',
}

export interface RegenerationCreditRecord {
  id: string
  user: string
  extra_prompts_balance: number
  total_purchased: number
  total_used: number
  last_purchase_card_last4?: string
  created: string
  updated: string
}
export const STYLE_EMOJIS: Record<StyleType, string> = {
  pov: '🪞',
  modelo: '💃',
  unboxing_vitrine: '📦',
}

export const STYLE_LABELS: Record<StyleType, string> = {
  pov: 'POV (Primeira Pessoa / Espelho)',
  modelo: 'Com Modelo Usando a Peça',
  unboxing_vitrine: 'Unboxing / Vitrine com ASMR',
}

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  tiktok_shop: 'TikTok Shop',
  shopee: 'Shopee Vídeo / Vitrine',
  ambos: 'TikTok Shop & Shopee',
}
