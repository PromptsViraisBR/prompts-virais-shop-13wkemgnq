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

  // Se o prompt já indica explicitamente 10s ou menos
  if (text.includes('10 SEGUNDOS') || text.includes('10s') || text.includes('10 segundos')) {
    return '10s'
  }

  const matchRange = text.match(/(\d{1,2})\s*(?:a|-)\s*(\d{1,2})\s*segundos/i)
  if (matchRange) {
    const end = Math.min(10, parseInt(matchRange[2], 10))
    const start = Math.min(end, parseInt(matchRange[1], 10))
    return `${start}-${end}s`
  }

  const matchSingle = text.match(/(\d{1,2})\s*segundos/i)
  if (matchSingle) {
    const s = Math.min(10, parseInt(matchSingle[1], 10))
    return `${s}s`
  }

  return '10s'
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
