import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { generateImagePrompt, type GenerateImagePromptResult } from '@/services/generations'
import {
  VIRAL_REGENERATION_LIMIT,
  getViralRegenerationsUsed,
  recordViralRegenerationUsed,
  consumeExtraRegenerationCredit,
} from '@/services/regenerationCredits'
import { AuthGateModal } from '@/components/AuthGateModal'
import { RegenerationPaymentModal } from '@/components/RegenerationPaymentModal'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Flame,
  ShieldCheck,
  Wand2,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ImagePromptGeneratorCardProps {
  onScrollToTools?: () => void
}

export const ImagePromptGeneratorCard: React.FC<ImagePromptGeneratorCardProps> = ({
  onScrollToTools,
}) => {
  const { user, isAdmin } = useAuth()
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateImagePromptResult | null>(null)
  const [copied, setCopied] = useState(false)

  // Auth Gate
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState('')

  // Regenerações
  const [regenerating, setRegenerating] = useState(false)
  const [extraCreditsBalance, setExtraCreditsBalance] = useState<number>(0)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const viralStorageKey = 'image_prompt_generator_virais'
  const usedViralCount = user ? getViralRegenerationsUsed(user.id, viralStorageKey) : 0
  const freeRegenerationsRemaining = Math.max(0, VIRAL_REGENERATION_LIMIT - usedViralCount)

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const trimmed = idea.trim()
    if (!trimmed) {
      toast({
        title: 'Descreva o que você quer na imagem 🍌✍️',
        description: 'Exemplo: crie uma banana com asas',
        variant: 'destructive',
      })
      return
    }

    if (!user) {
      setAuthGateAction('Criar prompt profissional para imagem')
      setAuthGateOpen(true)
      return
    }

    setLoading(true)
    try {
      const res = await generateImagePrompt({
        userId: user.id,
        idea: trimmed,
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.prompt) {
        setResult(res)
        toast({
          title: 'Prompt de Imagem Gerado com Sucesso! ✍️✨',
          description: 'Pronto para copiar e colar no ChatGPT ou no Google Flow / Nano Banana.',
        })
      } else {
        throw new Error(res.error || 'Não foi possível gerar o prompt.')
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar prompt',
        description: err.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result?.prompt) return
    navigator.clipboard.writeText(result.prompt)
    setCopied(true)
    toast({
      title: 'Prompt Copiado! 📋✨',
      description: 'Agora cole no ChatGPT ou Google Flow para gerar sua imagem em segundos.',
    })
    setTimeout(() => setCopied(false), 2500)
  }

  const handleRegenerate = async () => {
    if (!idea.trim()) return

    if (!user) {
      setAuthGateAction('Regenerar versão do prompt de imagem')
      setAuthGateOpen(true)
      return
    }

    const hasFreeAvailable = isAdmin || freeRegenerationsRemaining > 0

    if (!isAdmin && !hasFreeAvailable && extraCreditsBalance <= 0) {
      setPaymentModalOpen(true)
      return
    }

    setRegenerating(true)
    try {
      const res = await generateImagePrompt({
        userId: user.id,
        idea: idea.trim(),
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.prompt) {
        setResult(res)

        if (isAdmin) {
          toast({
            title: 'Nova Versão do Prompt Gerada! ✍️👑',
            description: 'Acesso Admin PRO Ilimitado — sem consumo de créditos.',
          })
        } else if (hasFreeAvailable) {
          const recorded = recordViralRegenerationUsed(user.id, viralStorageKey)
          toast({
            title: 'Nova Versão do Prompt Gerada! ✍️✨',
            description: `Regeneração ${recorded.used} de ${VIRAL_REGENERATION_LIMIT} gratuitas utilizadas. (${recorded.remainingFree} restante${recorded.remainingFree === 1 ? '' : 's'})`,
          })
        } else if (extraCreditsBalance > 0) {
          await consumeExtraRegenerationCredit(user.id)
          setExtraCreditsBalance((prev) => Math.max(0, prev - 1))
          toast({
            title: 'Nova Versão Gerada com Crédito Extra! ⚡',
            description: '1 crédito extra foi utilizado com sucesso.',
          })
        }
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao regenerar prompt',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div
      id="gerador-prompt-imagem"
      className="space-y-6 rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-amber-500/10 p-5 sm:p-8 shadow-md scroll-mt-20"
    >
      {/* Topo do Bloco */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-5">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Wand2 className="w-3.5 h-3.5" />
              NOVO RECURSO VIRAL
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              ✨ Digite a referência e copie o prompt perfeito
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Criar Prompt para Imagem</span>
            <span className="text-2xl">✍️🍌🖼️</span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Escreva <strong>somente a referência do que você quer</strong> (ex:{' '}
            <code className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold font-mono text-[11px]">
              crie uma banaca com asas
            </code>
            ). A IA transforma a sua ideia em um <strong>prompt profissional hiper-realista</strong>
            , com fidelidade total ao pedido original, formato vertical 9:16 e imagem 100% limpa
            (sem letras nem legendas), pronto para copiar e colar no ChatGPT ou Google Flow.
          </p>
        </div>

        {/* Micro-status de regenerações */}
        <div className="shrink-0 flex items-center gap-2 bg-background/80 border p-2.5 rounded-2xl shadow-xs self-start md:self-auto">
          <div className="text-right text-xs">
            <span className="text-muted-foreground font-medium block text-[11px]">
              Regenerações:
            </span>
            <span className="font-extrabold text-pink-600 dark:text-pink-400">
              {isAdmin
                ? 'Ilimitadas (Admin PRO)'
                : user
                  ? `${freeRegenerationsRemaining} grátis ${extraCreditsBalance > 0 ? `+ ${extraCreditsBalance} extras` : ''}`
                  : '2 grátis no login'}
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (isAdmin) {
                toast({
                  title: 'Acesso Admin PRO Total 👑',
                  description: 'Você já possui regenerações ilimitadas na sua conta!',
                })
                return
              }
              if (!user) {
                setAuthGateAction('Adquirir créditos de regeneração')
                setAuthGateOpen(true)
                return
              }
              setPaymentModalOpen(true)
            }}
            className="h-8 text-xs font-bold border-pink-500/40 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            {isAdmin ? '👑 PRO Total' : '+ Extras'}
          </Button>
        </div>
      </div>

      {/* Grid Principal: Entrada da Ideia + Resultado do Prompt Gerado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna de Entrada */}
        <Card className="lg:col-span-5 border bg-card/95 rounded-3xl shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                1. Sua Referência / O que você quer
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold text-purple-600 border-purple-500/30"
              >
                Somente Texto
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="image-prompt-idea"
                  className="text-xs sm:text-sm font-extrabold text-foreground flex items-center justify-between"
                >
                  <span>Descreva a ideia da imagem:</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Tolerante a erros de digitação
                  </span>
                </label>

                <Textarea
                  id="image-prompt-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Ex: crie uma banaca com asas"
                  rows={3}
                  className="rounded-2xl text-xs sm:text-sm bg-background border-purple-500/30 focus-visible:ring-purple-500 resize-none font-medium leading-relaxed"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Exemplos rápidos:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIdea('crie uma banaca com asas')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition-colors"
                  >
                    🍌 Banana com asas
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdea('um abacate com óculos escuros na praia')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-700 dark:text-pink-300 hover:bg-pink-500/20 border border-pink-500/20 transition-colors"
                  >
                    🥑 Abacate na praia
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdea('um morango astronauta flutuando no espaço')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                  >
                    🍓 Morango astronauta
                  </button>
                </div>
              </div>

              {/* Regras e Diretrizes do Prompt */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground space-y-1.5">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Diretrizes automáticas inclusas no prompt:</span>
                </div>
                <ul className="space-y-1 pl-4 list-disc text-[10px] leading-relaxed">
                  <li>
                    <strong>Fidelidade total:</strong> O que você pedir será o sujeito exato da
                    arte.
                  </li>
                  <li>
                    <strong>Vertical 9:16:</strong> Formato perfeito para vídeos e stories virais.
                  </li>
                  <li>
                    <strong>Imagem 100% limpa:</strong> Sem letras, legendas ou marcas d'água na
                    arte.
                  </li>
                  <li>
                    <strong>Português (PT-BR):</strong> Otimizado para ChatGPT e Google Flow.
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-sm shadow-md hover:opacity-95 gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Criando Prompt Fiel com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Prompt para Imagem ✍️✨</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coluna de Saída (Prompt Gerado + Botão Copiar + Atalhos ChatGPT e Google Flow) */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <Card className="border-2 border-dashed bg-muted/15 rounded-3xl p-8 sm:p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
                ✍️
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-foreground">
                  Seu prompt profissional vai aparecer aqui
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Digite a referência ao lado (como{' '}
                  <strong className="text-foreground">"crie uma banaca com asas"</strong>) e clique
                  no botão. O sistema gera o texto completo, detalhado e corrigido para você copiar
                  com 1 clique!
                </p>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="border bg-card rounded-3xl p-10 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-foreground">
                  Construindo o prompt perfeito com fidelidade total...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Adicionando iluminação de estúdio, texturas hiper-realistas, proporção 9:16 e
                  regra de imagem limpa.
                </p>
              </div>
            </Card>
          )}

          {result && (
            <Card className="border-2 border-purple-500/40 bg-card rounded-3xl overflow-hidden shadow-md animate-in fade-in-50 duration-300">
              <CardHeader className="bg-purple-500/10 border-b border-purple-500/20 py-3.5 px-5 flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    ✍️
                  </div>
                  <div>
                    <CardTitle className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                      <span>Prompt de Imagem Pronto</span>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                        9:16 Vertical
                      </Badge>
                    </CardTitle>
                    <span className="text-[10px] text-muted-foreground">
                      Baseado na sua ideia: "{result.original_idea}"
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="h-8 text-xs font-bold border-pink-500/40 text-pink-600 dark:text-pink-400 gap-1.5 hover:bg-pink-500/10"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 text-pink-500 ${regenerating ? 'animate-spin' : ''}`}
                    />
                    <span className="hidden sm:inline">Regenerar</span>
                    <span className="text-[10px] opacity-80">
                      (
                      {freeRegenerationsRemaining > 0
                        ? `${freeRegenerationsRemaining} disp.`
                        : `${extraCreditsBalance} extras`}
                      )
                    </span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Bloco de texto do prompt */}
                <div className="relative rounded-2xl border-2 border-purple-500/20 bg-muted/30 p-4 font-mono text-xs leading-relaxed text-foreground select-all whitespace-pre-wrap">
                  {result.prompt}
                </div>

                {/* Botão Principal de Copiar */}
                <Button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full py-5 rounded-2xl font-extrabold text-sm gap-2 shadow-md transition-all ${
                    copied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:opacity-95'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com Sucesso! 🎉</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Prompt com 1 Clique 📋</span>
                    </>
                  )}
                </Button>

                {/* ATALHOS EXTERNOS: Onde colar o prompt copiado */}
                <div className="pt-2 border-t border-border/50 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-foreground flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-pink-500" />
                      <span>Onde colar o prompt para criar a imagem grátis:</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">Abre em nova aba ↗</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Botão ChatGPT */}
                    <a
                      href="https://chatgpt.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between h-11 rounded-xl text-xs font-bold border-emerald-500/40 text-foreground hover:bg-emerald-500/10 hover:border-emerald-500 group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">🤖</span>
                          <span>ChatGPT (OpenAI)</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Button>
                    </a>

                    {/* Botão Google Flow */}
                    <a
                      href="https://labs.google/flow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between h-11 rounded-xl text-xs font-bold border-amber-500/40 text-foreground hover:bg-amber-500/10 hover:border-amber-500 group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">🍌</span>
                          <span>Google Flow / Nano Banana</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/20 border-t py-2.5 px-5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Salvo automaticamente no histórico da sua conta
                </span>

                {onScrollToTools && (
                  <button
                    type="button"
                    onClick={onScrollToTools}
                    className="font-semibold text-pink-600 hover:underline flex items-center gap-1"
                  >
                    <span>Ver mais ferramentas de imagem</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Pagamento Demonstrativo caso esgote as regenerações gratuitas */}
      {user && (
        <RegenerationPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          userId={user.id}
          onPaymentSuccess={(newBalance) => {
            setExtraCreditsBalance(newBalance)
            setTimeout(() => {
              handleRegenerate()
            }, 300)
          }}
        />
      )}

      {/* Auth Gate Modal para Visitantes Deslogados */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre ou Crie uma Conta Gratuita"
        description="Para usar o gerador de prompts de imagem com IA, salvar o histórico na sua conta e liberar 2 regenerações gratuitas, crie sua conta grátis em instantes!"
      />
    </div>
  )
}

export default ImagePromptGeneratorCard
