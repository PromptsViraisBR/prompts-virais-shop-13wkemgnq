import type { PromptRecord } from '@/types'
import { STYLE_EMOJIS, NICHE_EMOJIS } from '@/types'

/**
 * Deriva um gancho forte caso o campo hook esteja ausente ou vazio.
 * Extrai da CENA 1 / HOOK do prompt_text ou das primeiras linhas.
 */
export function deriveHookText(prompt: PromptRecord): string {
  if (prompt.hook && prompt.hook.trim()) {
    return prompt.hook.trim()
  }

  const text = prompt.prompt_text || ''

  // Tenta encontrar padrão CENA 1 ... HOOK
  const hookMatch = text.match(/CENA 1[^:]*:\s*([^.\n\r]+[.!?]?)/i)
  if (hookMatch && hookMatch[1]?.trim()) {
    return hookMatch[1].trim()
  }

  // Tenta primeira linha com conteúdo
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('[') && !l.startsWith('🎬'))

  if (lines.length > 0) {
    const first = lines[0].replace(/^[-•*]\s*/, '').trim()
    return first.slice(0, 110)
  }

  return prompt.title
}

/**
 * Retorna o melhor emoji inicial para o gancho/título com base no estilo e nicho
 */
export function getHookLeadEmoji(prompt: PromptRecord): string {
  if (prompt.style === 'pov') return '🪞'
  if (prompt.style === 'unboxing_vitrine') return '📦'
  if (prompt.style === 'modelo') return '🔥'

  return NICHE_EMOJIS[prompt.niche] || '✨'
}

/**
 * Formata o título com gancho em destaque no estilo TikTok Shop / Shopee.
 * Ex: "🪞 POV: você acabou de ganhar essa peça 😍"
 */
export function formatHookTitle(prompt: PromptRecord): {
  emoji: string
  hookText: string
  fullDisplay: string
} {
  const hook = deriveHookText(prompt)
  const leadEmoji = getHookLeadEmoji(prompt)

  // Verifica se o texto do hook já começa com emoji
  const hasLeadingEmoji = /^[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}]/u.test(hook)

  const emoji = hasLeadingEmoji ? '' : leadEmoji
  const fullDisplay = emoji ? `${emoji} ${hook}` : hook

  return {
    emoji,
    hookText: hook,
    fullDisplay,
  }
}

/**
 * Extrai ou estima o tempo do vídeo a partir do prompt_text.
 * Ex: "[ESTRUTURA DE VÍDEO TIKTOK SHOP - 18 SEGUNDOS]" -> "18s"
 * Default: "15-20s"
 */
export function getEstimatedDuration(prompt: PromptRecord): string {
  const text = prompt.prompt_text || ''

  const matchRange = text.match(/(\d{1,2})\s*(?:a|-)\s*(\d{1,2})\s*segundos/i)
  if (matchRange) {
    return `${matchRange[1]}-${matchRange[2]}s`
  }

  const matchSingle = text.match(/(\d{1,2})\s*segundos/i)
  if (matchSingle) {
    return `${matchSingle[1]}s`
  }

  return '15-20s'
}

/**
 * Retorna o rótulo amigável com emoji para a plataforma
 */
export function getPlatformInfo(platform?: string): {
  label: string
  badgeVariant: 'default' | 'secondary' | 'outline'
  emoji: string
} {
  if (platform === 'tiktok_shop') {
    return { label: 'TikTok Shop', badgeVariant: 'outline', emoji: '🎵' }
  }
  if (platform === 'shopee') {
    return { label: 'Shopee Vídeo', badgeVariant: 'outline', emoji: '🛍️' }
  }
  return { label: 'TikTok & Shopee', badgeVariant: 'outline', emoji: '🚀' }
}
