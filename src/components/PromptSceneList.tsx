import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Sparkles, Film } from 'lucide-react'
import { extractScenesFromPrompt, type ParsedScene } from '@/lib/promptHooks'
import { toast } from '@/hooks/use-toast'

export interface PromptSceneListProps {
  promptText: string
  promptTitle?: string
  /**
   * Se true, oculta a opção de ver texto bruto ou simplifica para o modal
   */
  inModal?: boolean
  className?: string
  onCopyScene?: (sceneIndex: number, sceneRaw: string, sceneTitle: string) => void
}

export const PromptSceneList: React.FC<PromptSceneListProps> = ({
  promptText,
  promptTitle,
  inModal = false,
  className = '',
  onCopyScene,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const parsedScenes: ParsedScene[] = extractScenesFromPrompt(promptText)

  const handleCopy = (index: number, raw: string, title: string) => {
    navigator.clipboard.writeText(raw)
    setCopiedIndex(index)
    if (onCopyScene) {
      onCopyScene(index, raw, title)
    } else {
      toast({
        title: `${title || `Cena ${index + 1}`} copiada! 🎬`,
        description: 'Texto da cena copiado para a área de transferência.',
      })
    }
    setTimeout(() => {
      setCopiedIndex((curr) => (curr === index ? null : curr))
    }, 2500)
  }

  if (parsedScenes.length === 0) {
    // Fallback: se o texto não contiver o padrão "CENA X", exibe em bloco único com botão de cópia
    const isCopied = copiedIndex === 0
    return (
      <div className={`space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-pink-500" />
            Roteiro da Cena:
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopy(0, promptText, promptTitle || 'Roteiro')}
            className="h-7 text-xs gap-1 font-bold border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Cena Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copiar esta cena</span>
              </>
            )}
          </Button>
        </div>
        <div className="bg-background/80 border rounded-xl p-3.5 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all text-foreground max-h-60 overflow-y-auto">
          {promptText}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          Roteiro Dividido Cena por Cena ({parsedScenes.length} cenas):
        </span>
        <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">
          Copie cena por cena separada 🎯
        </span>
      </div>

      <div className="space-y-2.5">
        {parsedScenes.map((sc, idx) => {
          const isCopied = copiedIndex === idx
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-xs font-bold bg-background text-pink-600 dark:text-pink-400 border-pink-500/30"
                  >
                    {sc.title}
                  </Badge>
                  {sc.timeRange && (
                    <span className="text-[11px] font-mono text-muted-foreground">
                      ⏱️ {sc.timeRange}
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(idx, sc.raw, sc.title)}
                  className="h-7 text-xs gap-1 font-bold border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 shrink-0"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Cena Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar esta cena</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-background/80 border rounded-lg p-2.5 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all text-foreground">
                {sc.content}
              </div>
            </div>
          )
        })}
      </div>

      {!inModal && (
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-semibold py-1">
            Ver texto bruto completo do roteiro
          </summary>
          <div className="mt-2 bg-muted/30 border rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all">
            {promptText}
          </div>
        </details>
      )}
    </div>
  )
}
export default PromptSceneList
