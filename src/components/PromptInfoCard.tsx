import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Clock, Film, ShoppingBag, User } from 'lucide-react'
import {
  NICHE_LABELS,
  NICHE_EMOJIS,
  STYLE_LABELS,
  STYLE_EMOJIS,
  PLATFORM_LABELS,
  type PromptRecord,
  type NicheType,
  type StyleType,
  type PlatformType,
} from '@/types'
import { getPlatformInfo, getEstimatedDuration } from '@/lib/promptHooks'

export interface PromptInfoCardProps {
  prompt?: PromptRecord | null
  title?: string
  niche?: string
  style?: string
  platform?: string
  category?: 'ecommerce' | 'virais' | string
  customProductOrCharacter?: string
  isAdapted?: boolean
  photosCount?: number
  className?: string
}

export const PromptInfoCard: React.FC<PromptInfoCardProps> = ({
  prompt,
  title,
  niche,
  style,
  platform,
  category,
  customProductOrCharacter,
  isAdapted = false,
  photosCount = 0,
  className = '',
}) => {
  const displayTitle = title || prompt?.title || 'Roteiro de Produção'
  const displayNiche = (niche || prompt?.niche || 'moda_feminina') as NicheType
  const displayStyle = (style || prompt?.style || 'pov') as StyleType
  const displayPlatform = (platform || prompt?.platform || 'ambos') as PlatformType
  const displayCategory = category || prompt?.category || 'ecommerce'

  const nicheLabel =
    (displayNiche && NICHE_LABELS[displayNiche as NicheType]) || displayNiche || 'Geral'
  const nicheEmoji = (displayNiche && NICHE_EMOJIS[displayNiche as NicheType]) || '👗'

  const styleLabel =
    (displayStyle && STYLE_LABELS[displayStyle as StyleType]) || displayStyle || 'Vídeo Liso'
  const styleEmoji = (displayStyle && STYLE_EMOJIS[displayStyle as StyleType]) || '🎬'

  const platformInfo = getPlatformInfo(displayPlatform)
  const platformLabel =
    (displayPlatform && PLATFORM_LABELS[displayPlatform as PlatformType]) ||
    platformInfo?.label ||
    displayPlatform ||
    'TikTok Shop & Shopee'

  const isViral = displayCategory === 'virais'
  const durationText = isViral ? '~60s (6 cenas de 10s)' : 'Até 10s (Vídeo Rápido)'

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-purple-500/10 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-500/15 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1">
            <Film className="w-3.5 h-3.5" />
            Biblioteca de Informações do Roteiro
          </span>
          {isAdapted && (
            <Badge className="bg-pink-600 text-white border-none text-[10px] font-bold py-0.5 px-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Roteiro Personalizado com Fotos
            </Badge>
          )}
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border">
          <Clock className="w-3 h-3 text-pink-500" />
          {durationText}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight leading-snug line-clamp-2">
          {displayTitle}
        </h4>
        {customProductOrCharacter && (
          <p className="text-xs text-pink-700 dark:text-pink-300 font-semibold flex items-center gap-1.5 pt-0.5">
            <User className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span>
              {isViral ? 'Personagem / Elemento Atual:' : 'Produto / Peça Atual:'}{' '}
              <strong className="underline decoration-pink-500/50">
                {customProductOrCharacter}
              </strong>
            </span>
          </p>
        )}
      </div>

      {/* Badges / Chips informativos com emoji */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        {/* Nicho com emoji */}
        <Badge
          variant="secondary"
          className="text-[11px] font-semibold gap-1 bg-background/80 border text-foreground"
        >
          <span>{nicheEmoji}</span>
          <span>{nicheLabel}</span>
        </Badge>

        {/* Estilo com emoji */}
        <Badge
          variant="outline"
          className="text-[11px] font-semibold gap-1 bg-background/80 text-foreground"
        >
          <span>{styleEmoji}</span>
          <span>{styleLabel.split('(')[0].trim()}</span>
        </Badge>

        {/* Canal / Plataforma */}
        <Badge
          variant="outline"
          className="text-[11px] font-semibold gap-1 bg-background/80 text-foreground"
        >
          <span>{platformInfo.emoji}</span>
          <span>{platformLabel}</span>
        </Badge>

        {/* Duração */}
        <Badge
          variant="outline"
          className="text-[11px] font-semibold gap-1 bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20"
        >
          <Clock className="w-3 h-3 text-pink-500" />
          <span>{durationText}</span>
        </Badge>

        {/* Fotos */}
        {photosCount > 0 && (
          <Badge
            variant="outline"
            className="text-[11px] font-semibold gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
          >
            📸 {photosCount} foto{photosCount > 1 ? 's' : ''} da peça
          </Badge>
        )}

        {/* Selo 100% limpo sem texto na tela */}
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-background/60 px-2 py-0.5 rounded-md border font-medium ml-auto">
          ✨ Vídeo 100% limpo (sem texto na tela)
        </span>
      </div>
    </div>
  )
}
export default PromptInfoCard
