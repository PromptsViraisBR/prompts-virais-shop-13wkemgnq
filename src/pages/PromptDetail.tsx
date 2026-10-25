import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPromptById } from '@/services/prompts'
import { toggleFavorite, isPromptFavorited } from '@/services/favorites'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Copy,
  Check,
  Heart,
  ArrowLeft,
  Lock,
  Sparkles,
  ShoppingBag,
  Crown,
  CheckCircle2,
  Image as ImageIcon,
  ImagePlus,
  Upload,
  X,
} from 'lucide-react'
import {
  adaptPromptWithImages,
  regeneratePromptVariations,
  type PromptVariation,
} from '@/services/generations'
import {
  getUserRegenerationCredits,
  consumeExtraRegenerationCredit,
  VIRAL_REGENERATION_LIMIT,
  getViralRegenerationsUsed,
  recordViralRegenerationUsed,
} from '@/services/regenerationCredits'
import { RegenerationPaymentModal } from '@/components/RegenerationPaymentModal'
import { AuthGateModal } from '@/components/AuthGateModal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, STYLE_LABELS, STYLE_EMOJIS, PLATFORM_LABELS } from '@/types'
import {
  formatHookTitle,
  getEstimatedDuration,
  getPlatformInfo,
  extractScenesFromPrompt,
} from '@/lib/promptHooks'
import { Clock, RefreshCw } from 'lucide-react'
import { PromptInfoCard } from '@/components/PromptInfoCard'
import { PromptSceneList } from '@/components/PromptSceneList'
import { PromptCustomizeModal } from '@/components/PromptCustomizeModal'

export const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState<PromptRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [copiedSceneIndex, setCopiedSceneIndex] = useState<number | null>(null)
  const [isFav, setIsFav] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Estado de Regeneração e Créditos
  const [extraCreditsBalance, setExtraCreditsBalance] = useState<number>(0)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [variations, setVariations] = useState<PromptVariation[]>([])
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null)
  const [copiedVarId, setCopiedVarId] = useState<string | null>(null)
  const [hasFreeRegenerated, setHasFreeRegenerated] = useState(false)

  // Auth Gate Modal para deslogados
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState('')

  // Estado da Personalização com Fotos
  const [modalOpen, setModalOpen] = useState(false)
  const [customProductName, setCustomProductName] = useState('')
  const [adaptedResult, setAdaptedResult] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    loadPrompt(id)
  }, [id, user])

  const loadPrompt = async (promptId: string) => {
    setLoading(true)
    try {
      const data = await getPromptById(promptId)
      setPrompt(data)

      if (user) {
        const fav = await isPromptFavorited(user.id, promptId)
        setIsFav(fav)

        const credits = await getUserRegenerationCredits(user.id)
        if (credits) setExtraCreditsBalance(credits.extra_prompts_balance || 0)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Prompt não encontrado',
        description: 'O roteiro solicitado não existe ou foi removido.',
        variant: 'destructive',
      })
      navigate('/biblioteca')
    } finally {
      setLoading(false)
    }
  }

  const activePromptText = adaptedResult || prompt?.prompt_text || ''

  const handleCopy = () => {
    if (!prompt) return

    if (!user) {
      setAuthGateAction(`Copiar roteiro "${prompt.title}"`)
      setAuthGateOpen(true)
      return
    }

    if (!prompt.is_free && !isPaidPlan) {
      toast({
        title: 'Conteúdo Exclusivo do Plano Pago',
        description: 'Faça upgrade para o plano Mensal ou Anual para copiar este roteiro completo.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(activePromptText)
    setCopied(true)
    toast({
      title: adaptedResult ? 'Roteiro adaptado copiado! 📋✨' : 'Prompt copiado com sucesso! 📋',
      description: 'Pronto para você gravar ou ajustar com as peças do seu catálogo.',
    })

    setTimeout(() => setCopied(false), 2500)
  }

  const handleCopyScene = (sceneIndex: number, sceneText: string, sceneTitle: string) => {
    if (!prompt) return

    if (!user) {
      setAuthGateAction(`Copiar cena de "${prompt.title}"`)
      setAuthGateOpen(true)
      return
    }

    if (!prompt.is_free && !isPaidPlan) {
      toast({
        title: 'Conteúdo Exclusivo do Plano Pago',
        description:
          'Faça upgrade para o plano Mensal ou Anual para copiar as cenas deste roteiro.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(sceneText)
    setCopiedSceneIndex(sceneIndex)
    toast({
      title: `${sceneTitle || `Cena ${sceneIndex + 1}`} copiada! 🎬`,
      description: 'Texto da cena copiado para a área de transferência.',
    })

    setTimeout(() => setCopiedSceneIndex(null), 2500)
  }

  const handleToggleFav = async () => {
    if (!prompt) return
    if (!user) {
      setAuthGateAction('Salvar este roteiro nos favoritos')
      setAuthGateOpen(true)
      return
    }

    try {
      const result = await toggleFavorite(user.id, prompt.id)
      setIsFav(result)
      toast({
        title: result ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      })
    } catch (err) {
      toast({
        title: 'Erro ao favoritar',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando roteiro...</p>
      </div>
    )
  }

  if (!prompt) {
    return null
  }

  const isLocked = !user || (!prompt.is_free && !isPaidPlan)

  const openCustomizeModal = () => {
    if (!prompt) return
    if (!user) {
      setAuthGateAction('Personalizar roteiro com fotos da sua peça')
      setAuthGateOpen(true)
      return
    }
    if (!customProductName) {
      setCustomProductName(prompt.title)
    }
    setModalOpen(true)
  }

  const handleRegenerateClick = async () => {
    if (!prompt) return

    if (!user) {
      setAuthGateAction('Regenerar variações do roteiro')
      setAuthGateOpen(true)
      return
    }

    const isViral = prompt.category === 'virais'
    const viralKey = `detail_${prompt.id}`
    const usedViral = isViral ? getViralRegenerationsUsed(user.id, viralKey) : 0
    const hasFreeViralAvailable = isViral && usedViral < VIRAL_REGENERATION_LIMIT

    if (isViral) {
      if (!hasFreeViralAvailable && extraCreditsBalance <= 0) {
        setPaymentModalOpen(true)
        return
      }
    } else {
      if (extraCreditsBalance <= 0 && hasFreeRegenerated) {
        setPaymentModalOpen(true)
        return
      }
    }

    setRegenerating(true)
    try {
      const res = await regeneratePromptVariations({
        basePrompt: activePromptText,
        promptTitle: customProductName.trim() || prompt.title,
        productName: customProductName.trim() || prompt.title,
        visualDetails: undefined,
        niche: prompt.niche,
        category: prompt.category || 'ecommerce',
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.variations?.length) {
        setVariations(res.variations)
        setSelectedVariationId(res.variations[0].id)

        if (isViral) {
          if (hasFreeViralAvailable) {
            const recorded = recordViralRegenerationUsed(user.id, viralKey)
            toast({
              title: '3 Novas Variações Virais (~60s) Geradas! 🎬✨',
              description: `Regeneração ${recorded.used} de ${VIRAL_REGENERATION_LIMIT} gratuitas utilizadas. (${recorded.remainingFree} restante${recorded.remainingFree === 1 ? '' : 's'})`,
            })
          } else if (extraCreditsBalance > 0) {
            await consumeExtraRegenerationCredit(user.id)
            setExtraCreditsBalance((prev) => Math.max(0, prev - 1))
            toast({
              title: '3 Novas Variações Virais Regeneradas! ⚡',
              description: '1 crédito extra (R$ 1,99) foi utilizado com sucesso.',
            })
          }
        } else {
          if (hasFreeRegenerated && extraCreditsBalance > 0) {
            await consumeExtraRegenerationCredit(user.id)
            setExtraCreditsBalance((prev) => Math.max(0, prev - 1))
            toast({
              title: '3 Novas Variações Regeneradas! ⚡',
              description: '1 crédito extra foi utilizado com sucesso.',
            })
          } else {
            setHasFreeRegenerated(true)
            toast({
              title: '3 Novas Variações Geradas! 🎨✨',
              description:
                '3 abordagens diferentes (Emocional, Urgência e Prova Social) incluídas.',
            })
          }
        }
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao regenerar variações',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setRegenerating(false)
    }
  }

  const handleCopyVariation = (vId: string, text: string) => {
    if (!user) {
      setAuthGateAction('Copiar variação do roteiro')
      setAuthGateOpen(true)
      return
    }
    navigator.clipboard.writeText(text)
    setCopiedVarId(vId)
    toast({
      title: 'Variação copiada! 📋✨',
      description: 'Roteiro copiado para a área de transferência.',
    })
    setTimeout(() => setCopiedVarId(null), 2500)
  }

  const hasVideo = Boolean(prompt.reference_video_url && !videoError)
  const hasImage = Boolean(prompt.reference_image_url && !imageError)

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Botão voltar */}
      <div className="flex items-center justify-between">
        <Link to="/biblioteca">
          <Button variant="ghost" size="sm" className="gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Biblioteca
          </Button>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botão Regenerar Prompt Sempre Visível na Tela de Detalhes */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateClick}
            disabled={regenerating}
            className="gap-1.5 text-xs border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 font-bold shadow-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-pink-500 ${regenerating ? 'animate-spin' : ''}`}
            />
            Regenerar Prompt (
            {prompt?.category === 'virais' && user
              ? `${Math.max(0, VIRAL_REGENERATION_LIMIT - getViralRegenerationsUsed(user.id, `detail_${prompt.id}`))} grátis + ${extraCreditsBalance} extras`
              : `${extraCreditsBalance} disponíveis`}
            )
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openCustomizeModal}
            className="gap-1.5 text-xs border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 font-bold"
          >
            <ImagePlus className="w-4 h-4 text-pink-500" />
            Personalizar com fotos 📸
          </Button>

          <Button variant="outline" size="sm" onClick={handleToggleFav} className="gap-2">
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isFav ? 'Favoritado' : 'Favoritar'}
          </Button>
        </div>
      </div>

      {/* Hero Visual de Referência (Cena 9:16 com clip em loop ou fallback animado) */}
      <div className="relative rounded-3xl overflow-hidden border bg-muted/30 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Clip Animado / Imagem Vertical de Referência em destaque */}
          <div className="md:col-span-5 relative aspect-[9/14] sm:aspect-[9/13] max-h-[480px] w-full overflow-hidden bg-black/5 dark:bg-black/20 flex items-center justify-center border-b md:border-b-0 md:border-r group">
            {hasVideo ? (
              <video
                src={prompt.reference_video_url}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : hasImage ? (
              <img
                src={prompt.reference_image_url}
                alt={prompt.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center ken-burns-active"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Visual de Referência</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Demonstração da cena, corte e caimento do produto para a gravação.
                  </p>
                </div>
              </div>
            )}

            {/* Gradient Overlay sutil inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              {hasVideo
                ? 'Clip Animado de Referência (Loop)'
                : 'Preview Animado da Referência (9:16)'}
            </div>
          </div>

          {/* Contexto do Visual ao lado */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-semibold text-xs gap-1">
                <span>{NICHE_EMOJIS[prompt.niche] || '👗'}</span>
                <span>{NICHE_LABELS[prompt.niche] || prompt.niche}</span>
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <span>{STYLE_EMOJIS[prompt.style] || '🎬'}</span>
                <span>{STYLE_LABELS[prompt.style] || prompt.style}</span>
              </Badge>
              {prompt.platform && (
                <Badge variant="outline" className="text-xs gap-1">
                  <span>{getPlatformInfo(prompt.platform).emoji}</span>
                  <span>{PLATFORM_LABELS[prompt.platform]}</span>
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                <Clock className="w-3 h-3" />
                {getEstimatedDuration(prompt)}
              </span>
              {prompt.is_free ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold">
                  🎁 Gratuito
                </Badge>
              ) : (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-bold">
                  👑 Premium PRO
                </Badge>
              )}
            </div>

            {/* Gancho em destaque no título com emojis */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gancho Viral (0-3s)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
                {formatHookTitle(prompt).fullDisplay}
              </h1>
            </div>

            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <span>{NICHE_EMOJIS[prompt.niche] || '👗'}</span>
              <span>
                Peça do Catálogo: <strong>{prompt.title}</strong>
              </span>
            </p>

            {prompt.description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {prompt.description}
              </p>
            )}

            <div className="p-3.5 rounded-xl bg-background/80 border text-xs space-y-1">
              <span className="font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider text-[10px] block">
                💡 O que este visual demonstra
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Mostra o estilo de gravação ({STYLE_LABELS[prompt.style] || prompt.style}),
                iluminação e postura ideais para reter o público nos primeiros segundos do TikTok
                Shop e Shopee Vídeo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Destaques: Gancho e Chamada de Ação */}
      {(prompt.hook || prompt.call_to_action) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prompt.hook && (
            <div className="p-4 rounded-xl border bg-pink-500/5 border-pink-500/20 space-y-1.5">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gancho Viral (Hook 0-3s)
              </span>
              <p className="text-sm font-medium italic text-foreground">"{prompt.hook}"</p>
            </div>
          )}

          {prompt.call_to_action && (
            <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20 space-y-1.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Call To Action (Conversão no Carrinho)
              </span>
              <p className="text-sm font-medium italic text-foreground">
                "{prompt.call_to_action}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* BLOCO DESTACADO DE INFORMAÇÕES DO PROMPT (ITEM 3 DO PEDIDO) */}
      <PromptInfoCard
        prompt={prompt}
        title={customProductName || prompt.title}
        niche={prompt.niche}
        style={prompt.style}
        platform={prompt.platform}
        category={prompt.category}
        customProductOrCharacter={adaptedResult ? customProductName || prompt.title : undefined}
        isAdapted={Boolean(adaptedResult)}
      />

      {/* Caixa do Prompt Completo */}
      <Card className="border shadow-lg relative overflow-hidden">
        <CardHeader className="bg-muted/40 border-b flex flex-row items-center justify-between py-3.5 px-4 sm:px-6">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              Roteiro de Gravação
              {adaptedResult && (
                <Badge className="bg-pink-600 text-white text-[10px] py-0 px-2 font-bold">
                  Personalizado Ativo
                </Badge>
              )}
            </CardTitle>
            {adaptedResult && (
              <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                Exibindo sua versão adaptada com fotos para "{customProductName || prompt.title}".
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {adaptedResult && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAdaptedResult(null)
                  toast({
                    title: 'Restaurado para o original',
                    description: 'O roteiro base da biblioteca foi recarregado.',
                  })
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Voltar ao original
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerateClick}
              disabled={regenerating}
              className="gap-1.5 font-bold text-xs border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-pink-500 ${regenerating ? 'animate-spin' : ''}`}
              />
              Regenerar (
              {prompt?.category === 'virais' && user
                ? `${Math.max(0, VIRAL_REGENERATION_LIMIT - getViralRegenerationsUsed(user.id, `detail_${prompt.id}`))} grátis`
                : extraCreditsBalance}
              )
            </Button>

            <Button
              size="sm"
              onClick={handleCopy}
              className={`gap-1.5 font-semibold text-xs ${
                !user
                  ? 'bg-gradient-to-r from-pink-600 to-amber-500 text-white'
                  : isLocked
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-gradient-to-r from-pink-600 to-amber-500 text-white'
              }`}
            >
              {!user ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Entrar para Copiar
                </>
              ) : isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Desbloquear no PRO
                </>
              ) : copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Roteiro Completo
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 relative">
          {isLocked ? (
            <div className="space-y-4">
              {/* Blur preview */}
              <div className="filter blur-sm select-none opacity-40 font-mono text-xs sm:text-sm space-y-2 pointer-events-none">
                <p>[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO LISO)]</p>
                <p>🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO: POV ou modelo com a peça...</p>
                <p>
                  🎬 CENA 2 (3-7s) - DETALHES DE TECIDO E COSTURA REFORÇADA: Close na textura...
                </p>
                <p>🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO: Apontando para a sacolinha...</p>
              </div>

              {/* Overlay de bloqueio: distingue visitante deslogado de usuário logado sem plano */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-600 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="font-extrabold text-lg text-foreground">
                    {!user
                      ? 'Faça login ou crie uma conta para desbloquear'
                      : 'Este roteiro é exclusivo para assinantes PRO'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {!user
                      ? 'Visitantes podem ver amostras na tela inicial. Crie uma conta grátis para liberar a biblioteca completa e copiar roteiros.'
                      : 'Assine o plano Mensal ou Anual para desbloquear todos os roteiros da biblioteca e o gerador personalizado para as roupas da sua loja.'}
                  </p>
                </div>
                {!user ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Link to="/login">
                      <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold">
                        Criar Conta Grátis
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="font-semibold">
                        Já tenho conta
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/planos">
                    <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold">
                      <Crown className="w-4 h-4 mr-2" />
                      Ver Planos e Assinar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <PromptSceneList
                promptText={activePromptText}
                promptTitle={customProductName || prompt.title}
                onCopyScene={(sceneIndex, sceneRaw, sceneTitle) => {
                  handleCopyScene(sceneIndex, sceneRaw, sceneTitle)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção das 3 Variações Regeneradas em Abas */}
      {variations.length > 0 && (
        <Card className="border shadow-md">
          <CardHeader className="py-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />3 Variações Regeneradas (10s | Vídeo
                Liso PT-BR)
              </CardTitle>
              <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold">
                1-Clique
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariationId(v.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    selectedVariationId === v.id
                      ? 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                      : 'border-border bg-card hover:bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <span className="block truncate text-xs">{v.badge}</span>
                </button>
              ))}
            </div>

            {selectedVariationId &&
              (() => {
                const currentVar = variations.find((v) => v.id === selectedVariationId)
                if (!currentVar) return null
                const isVarCopied = copiedVarId === currentVar.id
                return (
                  <div className="p-4 rounded-2xl border bg-muted/20 space-y-3 animate-in fade-in-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-foreground">
                          {currentVar.angle}
                        </span>
                        <p className="text-xs text-muted-foreground">{currentVar.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCopyVariation(currentVar.id, currentVar.prompt_text)}
                        className="h-8 text-xs gap-1 font-bold bg-pink-600 text-white hover:bg-pink-700"
                      >
                        {isVarCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Variação
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="bg-background border rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto select-all">
                      {currentVar.prompt_text}
                    </div>
                  </div>
                )
              })()}
          </CardContent>
        </Card>
      )}

      {/* Dicas de Execução para Criadores */}
      <div className="border rounded-2xl p-6 bg-muted/20 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Como executar esse roteiro com sucesso:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Iluminação frontal:</strong> Use luz natural de frente para a janela ou ring
              light na altura dos olhos.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Primeiros 3 segundos (Vídeo Liso):</strong> Não dê "oi galera", comece direto
              com o gancho visual falado em PT-BR e deixe o vídeo totalmente liso sem texto na tela
              para evitar erros da IA.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Música em alta:</strong> Adicione uma música viral com volume em 10% de fundo
              para reter o público.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Vincule o produto:</strong> Adicione o link direto da vitrine/sacola antes de
              publicar.
            </span>
          </li>
        </ul>
      </div>

      {/* Modal Reutilizável: Personalizar com Minhas Fotos */}
      <PromptCustomizeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prompt={prompt}
        userId={user?.id}
        isPaidPlan={isPaidPlan}
        extraCreditsBalance={extraCreditsBalance}
        onCreditsUpdated={(newBal) => setExtraCreditsBalance(newBal)}
        onRequestPayment={() => setPaymentModalOpen(true)}
        category={prompt.category}
        initialAdaptedPrompt={adaptedResult}
        initialProductName={customProductName}
        onAdaptedApplied={(newText, newProd) => {
          setAdaptedResult(newText)
          if (newProd) setCustomProductName(newProd)
        }}
      />

      {/* Modal de Pagamento Demonstrativo para Regeneração */}
      {user && (
        <RegenerationPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          userId={user.id}
          onPaymentSuccess={(newBalance) => {
            setExtraCreditsBalance(newBalance)
            setTimeout(() => {
              handleRegenerateClick()
            }, 300)
          }}
        />
      )}

      {/* Auth Gate Modal para Visitantes Não Autenticados */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre para Acessar este Roteiro"
        description="Para copiar, favoritar, regenerar ou personalizar esse roteiro com as fotos do seu catálogo, entre na sua conta ou cadastre-se grátis."
      />
    </div>
  )
}
