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

export type StyleType = 'pov' | 'modelo' | 'unboxing_vitrine'
export type PlatformType = 'tiktok_shop' | 'shopee' | 'ambos'

export interface UserRecord {
  id: string
  email: string
  name?: string
  avatar?: string
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
  created: string
  updated: string
}

export const NICHE_LABELS: Record<NicheType, string> = {
  moda_feminina: 'Moda Feminina',
  moda_masculina: 'Moda Masculina',
  fitness_academia: 'Fitness & Academia',
  moda_praia: 'Moda Praia & Biquínis',
  acessorios_calcados: 'Calçados & Acessórios',
  streetwear_casual: 'Streetwear & Casual',
  infantil_kids: 'Infantil & Kids',
  lingerie_pijamas: 'Lingerie & Pijamas',
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
