import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Video, Sparkles, CheckCircle2 } from 'lucide-react'

export interface VideoToolItem {
  id: string
  name: string
  provider: string
  url: string
  badge: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  emoji: string
  tagline: string
  description: string
  recommendedFor: string
  highlights: string[]
  buttonText: string
  cardBorder: string
  buttonClass: string
}

export const EXTERNAL_VIDEO_TOOLS: VideoToolItem[] = [
  {
    id: 'flow-veo',
    name: 'Google Flow (Veo)',
    provider: 'Google Labs',
    url: 'https://labs.google/flow',
    badge: 'Veo / Omine • Alta Fidelidade',
    emoji: '🌊',
    tagline: 'Gere vídeos hiper-realistas estilo POV e cinemáticos com Veo',
    description:
      'Acesse o Google Flow para rodar o modelo Veo do Google. Perfeito para vídeos realistas estilo POV, unboxing e movimentos de câmera naturais com consistência.',
    recommendedFor: 'Vídeos realistas estilo POV, texturas fiéis e estética de cinema',
    highlights: [
      'Motor Google Veo com qualidade cinemática',
      'Ideal para cenas de 10s cena por cena',
      'Entende prompts com iluminação e movimento',
    ],
    buttonText: 'Abrir Google Flow (Veo)',
    cardBorder: 'border-amber-500/30 hover:border-amber-500/60',
    buttonClass:
      'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white hover:opacity-95 shadow-sm',
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    provider: 'Google AI',
    url: 'https://gemini.google.com',
    badge: 'Grátis com Conta Google',
    emoji: '✨',
    tagline: 'Crie ou aprimore cenas e integre com o ecossistema Google',
    description:
      'Use o Gemini direto pelo navegador com a sua conta Google para refinar ganchos, expandir ideias de gravação e rodar criações multimídia instantâneas.',
    recommendedFor: 'Acesso imediato no celular ou PC com login do Google',
    highlights: [
      'Acesso 100% gratuito com conta Google',
      'Entende português perfeitamente sem tradução',
      'Fácil de usar tanto no celular quanto no PC',
    ],
    buttonText: 'Abrir Gemini',
    cardBorder: 'border-blue-500/30 hover:border-blue-500/60',
    buttonClass:
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm',
  },
  {
    id: 'motion16',
    name: 'Motion 16',
    provider: 'motion16.com',
    url: 'https://motion16.com/dashboard',
    badge: 'Especialista em Roupas & Modelos',
    emoji: '👗',
    tagline: 'Ideal para animar roupas com modelo vestindo a peça',
    description:
      'Plataforma feita para e-commerce e criadores: suba a foto da sua peça ou modelo e anime movimentos naturais de passarela, troca de ângulos e caimento perfeito.',
    recommendedFor: 'Animar suas roupas com modelo em movimento e vitrine viva',
    highlights: [
      'Dashboard especializado em animação de peças',
      'Preserva o caimento, cores e detalhes da roupa',
      'Ideal para TikTok Shop e Shopee de moda',
    ],
    buttonText: 'Abrir Motion 16 Dashboard',
    cardBorder: 'border-pink-500/30 hover:border-pink-500/60',
    buttonClass:
      'bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white hover:opacity-95 shadow-sm',
  },
]

export interface ExternalVideoToolsCardProps {
  /**
   * Título customizado opcional
   */
  title?: string
  /**
   * Subtítulo explicativo customizado opcional
   */
  description?: string
  /**
   * Se true, renderiza uma versão compacta (ex.: dentro de modais ou cartões de resultado)
   */
  compact?: boolean
  className?: string
}

export const ExternalVideoToolsCard: React.FC<ExternalVideoToolsCardProps> = ({
  title = 'Onde gerar seu vídeo com esse roteiro?',
  description = 'Não sabe qual ferramenta usar? Leve as cenas que você acabou de copiar para uma destas ferramentas recomendadas:',
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      } shadow-md space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs px-2.5 py-0.5 gap-1.5 shadow-sm">
              <Video className="w-3.5 h-3.5" />
              FERRAMENTAS RECOMENDADAS
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-500" /> Escolha onde rodar
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xl">🎬🚀</span>
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Grid de Ferramentas */}
      <div
        className={`grid grid-cols-1 ${
          compact ? 'md:grid-cols-3 gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'
        }`}
      >
        {EXTERNAL_VIDEO_TOOLS.map((tool) => (
          <Card
            key={tool.id}
            className={`border rounded-2xl bg-card/95 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${tool.cardBorder}`}
          >
            <div className="p-4 sm:p-4 space-y-3 flex-1">
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-muted/60 border flex items-center justify-center text-xl shadow-xs shrink-0">
                    {tool.emoji}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-foreground truncate">{tool.name}</h4>
                    <p className="text-[11px] font-medium text-muted-foreground truncate">
                      {tool.provider}
                    </p>
                  </div>
                </div>

                <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 text-[10px] font-bold shrink-0">
                  {tool.badge}
                </Badge>
              </div>

              {/* Tagline / Recomendação de Destaque */}
              <div className="p-2 rounded-xl bg-muted/40 border border-border/40 text-[11px] font-semibold text-foreground leading-tight">
                🎯 {tool.recommendedFor}
              </div>

              {/* Descrição curta */}
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>

              {/* Destaques (se não for ultracompacto) */}
              {!compact && (
                <div className="space-y-1.5 pt-1">
                  {tool.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 text-[11px] text-foreground/90"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rodapé com Botão em Nova Aba */}
            <div className="p-4 pt-0 border-t border-border/40 bg-muted/15 flex flex-col gap-2 mt-auto">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block pt-3"
              >
                <Button
                  type="button"
                  className={`w-full py-4 rounded-xl font-bold text-xs gap-1.5 h-10 ${tool.buttonClass}`}
                >
                  <span className="truncate">{tool.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Dica rápida de fluxo */}
      <div className="rounded-xl border border-pink-500/20 bg-background/60 p-3 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="font-bold text-foreground">💡 Dica de Sucesso:</span>
          Copie cena por cena (até 10 segundos cada), abra a ferramenta acima em nova aba e gere seu
          vídeo sem cortes!
        </span>
      </div>
    </div>
  )
}

export default ExternalVideoToolsCard
