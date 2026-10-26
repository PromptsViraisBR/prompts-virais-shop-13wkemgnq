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

  // Se for da categoria virais ou contiver 60s
  if (
    prompt.category === 'virais' ||
    text.includes('60 SEGUNDOS') ||
    text.includes('60s') ||
    text.includes('CENA 6')
  ) {
    return '~60s (cenas de 10s)'
  }

  // Se o prompt já indica explicitamente 10s ou menos
  if (text.includes('10 SEGUNDOS') || text.includes('10s') || text.includes('10 segundos')) {
    return '10s'
  }

  const matchRange = text.match(/(\d{1,2})\s*(?:a|-)\s*(\d{1,2})\s*segundos/i)
  if (matchRange) {
    const end = parseInt(matchRange[2], 10)
    const start = parseInt(matchRange[1], 10)
    return `${start}-${end}s`
  }

  const matchSingle = text.match(/(\d{1,2})\s*segundos/i)
  if (matchSingle) {
    const s = parseInt(matchSingle[1], 10)
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
  if (!platform) {
    return { label: 'TikTok & Shopee', badgeVariant: 'outline', emoji: '🚀' }
  }
  const clean = String(platform).toLowerCase().trim()
  if (clean === 'tiktok_shop' || clean === 'tiktok') {
    return { label: 'TikTok Shop', badgeVariant: 'outline', emoji: '🎵' }
  }
  if (clean === 'shopee') {
    return { label: 'Shopee Vídeo', badgeVariant: 'outline', emoji: '🛍️' }
  }
  if (clean === 'ambos') {
    return { label: 'TikTok Shop & Shopee', badgeVariant: 'outline', emoji: '🚀' }
  }
  // Fallback amigável caso venha qualquer outra string do banco ou campo
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1).replace(/_/g, ' ')
  return { label: capitalized, badgeVariant: 'outline', emoji: '✨' }
}

export interface ParsedScene {
  number: number
  title: string
  timeRange: string
  content: string
  raw: string
}

/**
 * Extrai as cenas estruturadas de um prompt (ex: CENA 1 (0-10s) ... CENA 6 (50-60s)).
 * Funciona para virais (6 cenas de 10s) e e-commerce (3 cenas).
 */
export function extractScenesFromPrompt(promptText: string): ParsedScene[] {
  if (!promptText) return []

  const sceneHeaderRegex = /(?:🎬\s*)?CENA\s*(\d+)[\s:-]*(\([^)]+\)|[^\n\r]*)/gi
  const matches = Array.from(promptText.matchAll(sceneHeaderRegex))
  if (matches.length === 0) return []

  const scenes: ParsedScene[] = []

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const sceneNum = parseInt(match[1], 10)
    const headerRest = (match[2] || '').trim()
    const startIndex = match.index ?? 0
    const nextIndex =
      i + 1 < matches.length ? (matches[i + 1].index ?? promptText.length) : promptText.length

    const rawScene = promptText.slice(startIndex, nextIndex).trim()

    // Extrair faixa de tempo se houver (ex: "(0-10s)" ou "0-10s")
    const timeMatch = rawScene.match(/\(?(\d{1,2}\s*[-–]\s*\d{1,2}s?)\)?/i)
    const timeRange = timeMatch ? timeMatch[1].trim() : ''

    // Título da cena
    const firstLine = rawScene.split('\n')[0].trim()

    // Conteúdo sem a primeira linha de cabeçalho
    const contentLines = rawScene.split('\n').slice(1).join('\n').trim()

    scenes.push({
      number: sceneNum,
      title: firstLine,
      timeRange: timeRange || `Cena ${sceneNum}`,
      content: contentLines || rawScene,
      raw: rawScene,
    })
  }

  return scenes
}
