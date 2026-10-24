import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Info,
  Upload,
  Sparkles,
  CheckCircle2,
  Copy,
  Lightbulb,
  Layers,
  ArrowRight,
} from 'lucide-react'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS } from '@/types'

interface PromptHowToUseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt: PromptRecord | null
  onCopyPrompt?: () => void
}

export const PromptHowToUseModal: React.FC<PromptHowToUseModalProps> = ({
  open,
  onOpenChange,
  prompt,
  onCopyPrompt,
}) => {
  if (!prompt) return null

  const isFaceSwap = prompt.niche === 'face_swap'
  const isFruits = prompt.niche === 'historinhas_frutas'
  const isKids = prompt.niche === 'infantil_historinhas'
  const isHorror = prompt.niche === 'terror_suspense'
  const isAsmr = prompt.niche === 'asmr_sensorial'
  const isAnimals = prompt.niche === 'animais_falantes'

  const nicheEmoji = NICHE_EMOJIS[prompt.niche] || '🎬'
  const nicheLabel = NICHE_LABELS[prompt.niche] || 'Vídeo Viral'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto border-pink-500/20 bg-card/95 backdrop-blur-md">
        <DialogHeader className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground">
                Como usar este prompt
              </DialogTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                <span>{nicheEmoji}</span>
                <span className="font-semibold text-foreground/80">{nicheLabel}</span>
              </div>
            </div>
          </div>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Instruções rápidas e diretas para gerar o melhor resultado em ferramentas de IA de vídeo
            (Kling, Hailuo, Luma, Runway, Pika ou Midjourney/Flux para a imagem base).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Mensagem Base em Destaque */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-purple-500/10 border border-pink-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400">
              <Sparkles className="w-4 h-4" />
              <span>Regra de Ouro (Pronto em 1 minuto)</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
              {isFaceSwap
                ? 'Para usar este prompt de troca de rosto (Face Swap), suba a foto do rosto original (ou o vídeo de base) e a foto nítida do novo rosto que será colocado junto com o prompt na plataforma de IA. Pronto.'
                : 'Para usar esse prompt, suba a imagem e o vídeo junto do prompt na plataforma de geração de vídeo que irá usar o prompt. Pronto.'}
            </p>
          </div>

          {/* Passo a Passo Numerado e Visual */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-pink-500" />
              <span>Passo a passo detalhado</span>
            </h4>

            {/* Passo 1 */}
            <div className="p-3 rounded-xl border bg-muted/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-foreground">Copie o Roteiro / Prompt</p>
                <p className="text-muted-foreground leading-relaxed">
                  Copie o texto completo com o botão abaixo. Ele já está otimizado em Português
                  (PT-BR), com gancho de 0-3 segundos e duração máxima de 10 segundos.
                </p>
              </div>
            </div>

            {/* Passo 2 - Adaptado por nicho */}
            <div className="p-3 rounded-xl border bg-muted/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-foreground">
                  {isFaceSwap
                    ? 'Suba as duas imagens (Rosto Alvo + Rosto de Referência)'
                    : 'Suba sua imagem de referência ou o vídeo base'}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {isFaceSwap &&
                    'Suba a foto/vídeo onde o rosto deve aparecer (corpo, pose, cena) e a foto nítida e bem iluminada do rosto que você quer estampar.'}
                  {isFruits &&
                    'Suba a imagem de uma fruta humanoide em 3D (ex.: morango ou banana com olhinhos) ou gere primeiro a imagem no Midjourney/Flux.'}
                  {isKids &&
                    'Suba a ilustração infantil fofa ou a cena 3D colorida do personagem para a IA manter a consistência visual.'}
                  {isHorror &&
                    'Suba uma foto de ambiente escuro, porta entreaberta ou espelho com iluminação cinematográfica tensa.'}
                  {isAsmr &&
                    'Suba uma imagem em close macro da textura (areia cinética, sabão, massinha) com foco nítido nos detalhes.'}
                  {isAnimals &&
                    'Suba a foto do seu pet ou de um animal fofo em close no rosto para animar a boca em sincronia com a fala.'}
                  {!isFaceSwap &&
                    !isFruits &&
                    !isKids &&
                    !isHorror &&
                    !isAsmr &&
                    !isAnimals &&
                    'Suba a imagem ou vídeo de base na ferramenta de IA escolhida (Kling, Hailuo, Luma, Runway ou Pika).'}
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="p-3 rounded-xl border bg-muted/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-foreground">Cole o Prompt e Clique em Gerar</p>
                <p className="text-muted-foreground leading-relaxed">
                  Cole o prompt no campo de texto da plataforma, defina a proporção para 9:16
                  (formato vertical para TikTok / Reels / Shorts) e gere seu vídeo!
                </p>
              </div>
            </div>
          </div>

          {/* Dicas de Criador */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
              <span>Dica de Alta Retenção:</span>
            </div>
            <p className="text-foreground/80 leading-relaxed text-[11px]">
              O roteiro foi construído para vídeo <strong>100% limpo sem texto na tela</strong> (as
              IAs erram palavras visuais). Use a narração em áudio e coloque as legendas dinâmicas
              usando o próprio editor do CapCut, TikTok ou Instagram!
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
            {onCopyPrompt && (
              <Button
                onClick={() => {
                  onCopyPrompt()
                  onOpenChange(false)
                }}
                className="flex-1 py-5 text-xs font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:opacity-95 shadow-md gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Prompt Agora
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="py-5 text-xs font-semibold"
            >
              Entendido, Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
