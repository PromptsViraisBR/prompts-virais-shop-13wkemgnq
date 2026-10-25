import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPrompts } from '@/services/prompts'
import { getUserFavorites, toggleFavorite } from '@/services/favorites'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Sparkles,
  Lock,
  Copy,
  Check,
  ArrowRight,
  Clock,
  X,
  Flame,
  Zap,
  Info,
  SlidersHorizontal,
  Video,
  Layers,
} from 'lucide-react'
import { PromptAnimatedMedia } from '@/components/PromptAnimatedMedia'
import { PromptHowToUseModal } from '@/components/PromptHowToUseModal'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord, NicheType, StyleType } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, STYLE_LABELS, STYLE_EMOJIS, VIRAL_NICHE_KEYS } from '@/types'
import {
  formatHookTitle,
  getEstimatedDuration,
  getPlatformInfo,
  extractScenesFromPrompt,
} from '@/lib/promptHooks'
import {
  adaptPromptWithImages,
  regeneratePromptVariations,
  PromptVariation,
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
import { ViralGenerator } from '@/components/ViralGenerator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImagePlus, Upload, RefreshCw } from 'lucide-react'

// Estilos de gravação
const STYLE_KEYS: StyleType[] = ['pov', 'modelo', 'unboxing_vitrine']

// Quantidade máxima de amostras liberadas para visitantes deslogados
const FREE_SAMPLES_COUNT = 3

export const ViralVideos: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [prompts, setPrompts] = useState<PromptRecord[]>([])
  const [favoritePromptIds, setFavoritePromptIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [hoveredPromptId, setHoveredPromptId] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState<string>('all')
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'favorites'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedSceneKey, setCopiedSceneKey] = useState<string | null>(null)
  const [expandedScenesPromptId, setExpandedScenesPromptId] = useState<string | null>(null)

  // Modal "Como usar este prompt"
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [infoPrompt, setInfoPrompt] = useState<PromptRecord | null>(null)

  // Auth Gate para deslogados
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState<string>('')

  // Modal de Personalização com Fotos e Regeneração
  const [customizePrompt, setCustomizePrompt] = useState<PromptRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [customFiles, setCustomFiles] = useState<File[]>([])
  const [customPreviews, setCustomPreviews] = useState<string[]>([])
  const [customProductName, setCustomProductName] = useState('')
  const [customCharacterName, setCustomCharacterName] = useState('')
  const [customVisualDetails, setCustomVisualDetails] = useState('')
  const [adapting, setAdapting] = useState(false)
  const [adaptedResult, setAdaptedResult] = useState<string | null>(null)
  const [copiedAdapted, setCopiedAdapted] = useState(false)

  // Variações e créditos
  const [customVariations, setCustomVariations] = useState<PromptVariation[]>([])
  const [selectedCustomVarId, setSelectedCustomVarId] = useState<string | null>(null)
  const [copiedCustomVarId, setCopiedCustomVarId] = useState<string | null>(null)
  const [customRegenerating, setCustomRegenerating] = useState(false)
  const [hasCustomFreeRegenerated, setHasCustomFreeRegenerated] = useState(false)
  const [extraCreditsBalance, setExtraCreditsBalance] = useState<number>(0)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  useEffect(() => {
    loadData()
    if (user) {
      getUserRegenerationCredits(user.id).then((c) => {
        if (c) setExtraCreditsBalance(c.extra_prompts_balance || 0)
      })
    }
  }, [searchTerm, selectedNiche, selectedStyle, activeTab, user])

  const loadData = async () => {
    setLoading(true)
    try {
      const isFreeOnly = activeTab === 'free'
      const items = await getPrompts({
        category: 'virais',
        search: searchTerm,
        niche: selectedNiche === 'all' ? undefined : (selectedNiche as NicheType),
        style: selectedStyle === 'all' ? undefined : (selectedStyle as StyleType),
        isFreeOnly,
      })

      setPrompts(items)

      if (user) {
        const favs = await getUserFavorites(user.id)
        const ids = new Set(favs.map((f) => f.prompt))
        setFavoritePromptIds(ids)
      }
    } catch (err) {
      console.error('Erro ao carregar prompts virais:', err)
      toast({
        title: 'Erro ao carregar prompts virais 😅',
        description: 'Tente recarregar a página em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      customPreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      })
    }
  }, [customPreviews])

  // Filtragem local para aba de favoritos
  const displayedPrompts = useMemo(() => {
    if (activeTab === 'favorites') {
      return prompts.filter((p) => favoritePromptIds.has(p.id))
    }
    return prompts
  }, [activeTab, prompts, favoritePromptIds])

  // Identifica os 3 primeiros prompts gratuitos como amostras liberadas para visitantes deslogados
  const samplePromptIds = useMemo(() => {
    const freeItems = prompts.filter((p) => p.is_free)
    const samples = (freeItems.length > 0 ? freeItems : prompts).slice(0, FREE_SAMPLES_COUNT)
    return new Set(samples.map((p) => p.id))
  }, [prompts])

  // Abrir modal de instruções ("Como usar este prompt")
  const openHowToUseModal = (e: React.MouseEvent, prompt: PromptRecord) => {
    e.stopPropagation()
    setInfoPrompt(prompt)
    setInfoModalOpen(true)
  }

  // Abrir modal de personalização
  const openCustomizeModal = (e: React.MouseEvent, prompt: PromptRecord) => {
    e.stopPropagation()
    if (!user) {
      setAuthGateAction('Personalizar roteiro viral com suas referências')
      setAuthGateOpen(true)
      return
    }
    setCustomizePrompt(prompt)
    setCustomProductName(prompt.title)
    setCustomCharacterName('')
    setCustomVisualDetails('')
    setCustomFiles([])
    setCustomPreviews([])
    setAdaptedResult(null)
    setCopiedAdapted(false)
    setCustomVariations([])
    setSelectedCustomVarId(null)
    setCopiedCustomVarId(null)
    setHasCustomFreeRegenerated(false)
    if (user) {
      getUserRegenerationCredits(user.id).then((c) => {
        if (c) setExtraCreditsBalance(c.extra_prompts_balance || 0)
      })
    }
    setModalOpen(true)
  }

  const handleCopyCustomVariation = (vId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCustomVarId(vId)
    toast({
      title: 'Variação copiada! 📋✨',
      description: 'Roteiro copiado para a área de transferência.',
    })
    setTimeout(() => setCopiedCustomVarId(null), 2500)
  }

  const handleCustomRegenerate = async () => {
    if (!customizePrompt) return

    if (!user) {
      setAuthGateAction('Regenerar variações do roteiro')
      setAuthGateOpen(true)
      return
    }

    const viralKey = `customize_${customizePrompt.id}`
    const usedViral = getViralRegenerationsUsed(user.id, viralKey)
    const canFree = usedViral < VIRAL_REGENERATION_LIMIT

    if (!canFree && extraCreditsBalance <= 0) {
      setPaymentModalOpen(true)
      return
    }

    setCustomRegenerating(true)
    try {
      const res = await regeneratePromptVariations({
        basePrompt: adaptedResult || customizePrompt.prompt_text,
        promptTitle: customProductName.trim() || customizePrompt.title,
        productName:
          customCharacterName.trim() || customProductName.trim() || customizePrompt.title,
        characterName: customCharacterName.trim() || undefined,
        visualDetails: customVisualDetails.trim() || undefined,
        niche: customizePrompt.niche,
        imagesCount: customFiles.length,
        category: 'virais',
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.variations?.length) {
        setCustomVariations(res.variations)
        setSelectedCustomVarId(res.variations[0].id)

        if (canFree) {
          const recorded = recordViralRegenerationUsed(user.id, viralKey)
          setHasCustomFreeRegenerated(true)
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
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao regenerar variações',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setCustomRegenerating(false)
    }
  }

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const incoming = Array.from(files)
    const availableSlots = 3 - customFiles.length
    if (availableSlots <= 0) {
      toast({
        title: 'Limite atingido',
        description: 'Você pode subir no máximo 3 fotos de referência.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    const accepted = incoming.slice(0, availableSlots)
    const newUrls = accepted.map((file) => URL.createObjectURL(file))
    setCustomFiles((prev) => [...prev, ...accepted])
    setCustomPreviews((prev) => [...prev, ...newUrls])
    e.target.value = ''
  }

  const handleRemoveCustomFile = (index: number) => {
    const url = customPreviews[index]
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    setCustomFiles((prev) => prev.filter((_, i) => i !== index))
    setCustomPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAdaptPrompt = async () => {
    if (!customizePrompt) return
    setAdapting(true)
    try {
      const res = await adaptPromptWithImages({
        originalPrompt: customizePrompt.prompt_text,
        promptTitle: customizePrompt.title,
        productName:
          customCharacterName.trim() || customProductName.trim() || customizePrompt.title,
        characterName: customCharacterName.trim() || undefined,
        visualDetails: customVisualDetails.trim() || undefined,
        niche: customizePrompt.niche,
        style: customizePrompt.style,
        platform: customizePrompt.platform,
        referenceImages: customFiles,
        imagesCount: customFiles.length,
        category: 'virais',
        iterationSeed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.adapted_prompt) {
        setAdaptedResult(res.adapted_prompt)
        toast({
          title: 'Prompt atualizado com suas fotos! 📸✨',
          description: 'Roteiro adaptado com sucesso para a sua cena.',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao adaptar roteiro',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setAdapting(false)
    }
  }

  const handleCopyAdapted = () => {
    if (!adaptedResult) return
    navigator.clipboard.writeText(adaptedResult)
    setCopiedAdapted(true)
    toast({
      title: 'Roteiro adaptado copiado! 📋',
    })
    setTimeout(() => setCopiedAdapted(false), 2500)
  }

  const handleToggleFavorite = async (e: React.MouseEvent, promptId: string) => {
    e.stopPropagation()
    if (!user) {
      setAuthGateAction('Salvar prompt nos favoritos')
      setAuthGateOpen(true)
      return
    }

    try {
      const isFav = await toggleFavorite(user.id, promptId)
      setFavoritePromptIds((prev) => {
        const next = new Set(prev)
        if (isFav) next.add(promptId)
        else next.delete(promptId)
        return next
      })

      toast({
        title: isFav ? 'Adicionado aos favoritos! ⭐' : 'Removido dos favoritos',
        description: isFav ? 'Acesse rapidamente na aba Favoritos.' : undefined,
      })
    } catch (err) {
      toast({
        title: 'Erro ao favoritar',
        variant: 'destructive',
      })
    }
  }

  // Copiar prompt com portão de login respeitando as 3 amostras gratuitas
  const handleCopyPrompt = (e: React.MouseEvent, prompt: PromptRecord) => {
    e.stopPropagation()

    // 1. Visitante deslogado: se estiver entre as 3 amostras gratuitas, cópia permitida!
    if (!user) {
      const isSample = samplePromptIds.has(prompt.id)
      if (!isSample) {
        setAuthGateAction(`Copiar prompt viral "${prompt.title}"`)
        setAuthGateOpen(true)
        return
      }
    }

    // 2. Usuário autenticado, mas o prompt é PRO e usuário não possui plano pago
    if (user && !prompt.is_free && !isPaidPlan) {
      toast({
        title: '🔒 Prompt Exclusivo do Plano Pago',
        description: 'Assine o plano Mensal ou Anual para copiar todos os prompts virais PRO.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(prompt.prompt_text)
    setCopiedId(prompt.id)
    toast({
      title: !user ? 'Amostra Gratuita Copiada! 🎁✨' : 'Prompt Viral Copiado! 📋✨',
      description: 'Pronto para subir na plataforma de geração de vídeo junto com a imagem!',
    })

    setTimeout(() => {
      setCopiedId(null)
    }, 2500)
  }

  // Copia cena individual do prompt viral
  const handleCopyScene = (
    e: React.MouseEvent,
    prompt: PromptRecord,
    sceneIdx: number,
    sceneRaw: string,
    sceneTitle: string,
  ) => {
    e.stopPropagation()

    if (!user) {
      setAuthGateAction(`Copiar cena de "${prompt.title}"`)
      setAuthGateOpen(true)
      return
    }

    const isLocked = !prompt.is_free && !isPaidPlan
    if (isLocked) {
      toast({
        title: 'Conteúdo Exclusivo do Plano Pago',
        description:
          'Faça upgrade para o plano Mensal ou Anual para copiar as cenas deste roteiro.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(sceneRaw)
    const key = `${prompt.id}_scene_${sceneIdx}`
    setCopiedSceneKey(key)
    toast({
      title: `${sceneTitle || `Cena ${sceneIdx + 1}`} copiada! 🎬`,
      description: 'Texto da cena copiado para a área de transferência.',
    })

    setTimeout(() => {
      setCopiedSceneKey((curr) => (curr === key ? null : curr))
    }, 2500)
  }

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedNiche !== 'all' ||
    selectedStyle !== 'all' ||
    activeTab !== 'all'

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedNiche('all')
    setSelectedStyle('all')
    setActiveTab('all')
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Cabeçalho Especial Criadores de Conteúdo */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-amber-500/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Para Criadores de Conteúdo, Reels, Shorts & TikTok</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Vídeos Virais 🚀🎬
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Acervo de prompts e roteiros prontos para gerar vídeos virais com IA: historinhas de
              frutas humanoides, fábulas infantis, terror 3AM, comédia, troca de rosto (face swap),
              ASMR e animais falantes!
            </p>

            {/* Micro badges de garantia */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                🇧🇷 Roteiros em PT-BR
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                ⏱️ Roteiro ~60s (Cenas de 10s)
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                ✨ Vídeo 100% limpo sem texto na tela
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                ℹ️ Guia passo a passo em cada prompt
              </span>
            </div>
          </div>

          {!user ? (
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <Link to="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Criar Conta Grátis
                </Button>
              </Link>
              <p className="text-[11px] text-center text-muted-foreground">
                3 amostras liberadas para testar sem cadastro 🎁
              </p>
            </div>
          ) : !isPaidPlan ? (
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <Link to="/planos">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Liberar Todos os Virais PRO 👑
                </Button>
              </Link>
              <p className="text-[11px] text-center text-muted-foreground">
                Planos mensais ou anuais com IA inclusa 🔒
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* NOVO GERADOR EXCLUSIVO DE VÍDEOS VIRAIS */}
      <section id="gerador-viral" className="scroll-mt-20">
        <ViralGenerator />
      </section>

      {/* 2. Barra de Busca e Abas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Abas */}
          <div className="inline-flex p-1 rounded-2xl bg-muted/60 border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔥 Todos os Virais ({prompts.length})
            </button>
            <button
              onClick={() => setActiveTab('free')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'free'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🎁 Gratuitos
            </button>
            <button
              onClick={() => {
                if (!user) {
                  setAuthGateAction('Acessar seus roteiros virais favoritos')
                  setAuthGateOpen(true)
                  return
                }
                setActiveTab('favorites')
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ⭐ Meus Favoritos ({favoritePromptIds.size})
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque por frutas, terror, face swap, ASMR... 🔍"
              className="pl-10 pr-9 py-5 rounded-2xl border-muted-foreground/20 focus-visible:ring-pink-500 bg-background shadow-xs text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Chips de Nicho Virais */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <span>🎬 Nichos para Criadores</span>
              <span className="text-[11px] font-normal lowercase">
                ({VIRAL_NICHE_KEYS.length} categorias)
              </span>
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs h-7 text-pink-600 dark:text-pink-400 hover:text-pink-700 p-0"
              >
                Limpar todos os filtros ✕
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar sm:flex-wrap">
            {/* Chip Todos */}
            <button
              onClick={() => setSelectedNiche('all')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                selectedNiche === 'all'
                  ? 'bg-gradient-to-r from-pink-600 to-amber-500 text-white border-transparent shadow-sm scale-105'
                  : 'bg-background hover:bg-muted/70 text-foreground border-border'
              }`}
            >
              <span>✨ Todos os Nichos Virais</span>
            </button>

            {/* Chips individuais */}
            {VIRAL_NICHE_KEYS.map((key) => {
              const label = NICHE_LABELS[key]
              const emoji = NICHE_EMOJIS[key]
              const isSelected = selectedNiche === key

              return (
                <button
                  key={key}
                  onClick={() => setSelectedNiche(isSelected ? 'all' : key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-pink-600 text-white border-pink-600 shadow-sm scale-105'
                      : 'bg-background hover:bg-muted/70 text-foreground border-border hover:border-pink-300'
                  }`}
                >
                  <span className="text-sm">{emoji}</span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 4. Filtro de Estilo */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-muted-foreground font-semibold shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Estilo:
          </span>

          <button
            onClick={() => setSelectedStyle('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 border ${
              selectedStyle === 'all'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Qualquer Estilo
          </button>

          {STYLE_KEYS.map((key) => {
            const label = STYLE_LABELS[key]
            const emoji = STYLE_EMOJIS[key]
            const isSelected = selectedStyle === key

            return (
              <button
                key={key}
                onClick={() => setSelectedStyle(isSelected ? 'all' : key)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground font-bold'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground border-transparent hover:border-border'
                }`}
              >
                <span>{emoji}</span>
                <span>{label.split('(')[0].trim()}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Grid de Cards */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent" />
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              Carregando prompts de vídeos virais... 🎬
            </p>
            <p className="text-xs text-muted-foreground">
              Preparando os melhores ganchos para criadores de conteúdo
            </p>
          </div>
        </div>
      ) : displayedPrompts.length === 0 ? (
        <div className="py-16 px-6 text-center border-2 border-dashed rounded-3xl bg-muted/20 space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto text-2xl">
            😅
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-xl text-foreground">
              Nenhum vídeo viral encontrado
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tente outra palavra na busca ou escolha outro nicho acima.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleResetFilters}
              className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold rounded-full px-5"
            >
              ✨ Ver todos os prompts virais
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrompts.map((prompt) => {
            const isSample = !user && samplePromptIds.has(prompt.id)
            const isLocked = !user ? !isSample : !prompt.is_free && !isPaidPlan
            const isFav = favoritePromptIds.has(prompt.id)
            const isHovered = hoveredPromptId === prompt.id

            const hookData = formatHookTitle(prompt)
            const duration = getEstimatedDuration(prompt)
            const platformInfo = getPlatformInfo(prompt.platform)
            const nicheEmoji = NICHE_EMOJIS[prompt.niche] || '🎬'

            return (
              <Card
                key={prompt.id}
                onClick={() => navigate(`/prompt/${prompt.id}`)}
                onMouseEnter={() => setHoveredPromptId(prompt.id)}
                onMouseLeave={() =>
                  setHoveredPromptId((curr) => (curr === prompt.id ? null : curr))
                }
                onTouchStart={() => setHoveredPromptId(prompt.id)}
                className={`flex flex-col justify-between border cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-pink-500/50 group relative overflow-hidden rounded-3xl bg-card ${
                  isLocked ? 'bg-muted/10' : ''
                }`}
              >
                {/* Visual Animated Preview Header */}
                <PromptAnimatedMedia
                  prompt={prompt}
                  isHovered={isHovered}
                  isFav={isFav}
                  onToggleFavorite={(e) => handleToggleFavorite(e, prompt.id)}
                  aspectClassName="aspect-[16/10] sm:aspect-[16/11]"
                  showBadgeOverlays={true}
                />

                {/* Conteúdo com Gancho no Título */}
                <CardHeader className="space-y-2 pb-2 pt-4 px-4 sm:px-5">
                  {/* Micro-pílulas */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/20">
                      <Sparkles className="w-3 h-3" />
                      Gancho 0-3s
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      <Clock className="w-3 h-3" />
                      {duration}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      <span>{platformInfo.emoji}</span>
                      <span>{platformInfo.label}</span>
                    </span>

                    {/* Tag de Amostra Gratuita para Visitantes */}
                    {isSample && (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                        🎁 Amostra Liberada
                      </Badge>
                    )}
                  </div>

                  {/* Título Principal = Gancho Viral */}
                  <CardTitle className="text-base sm:text-lg font-extrabold group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug pt-1">
                    {hookData.fullDisplay}
                  </CardTitle>

                  {/* Subtítulo: Nicho e Nome do Roteiro */}
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 line-clamp-1">
                    <span>{nicheEmoji}</span>
                    <span className="font-semibold text-foreground/90">{prompt.title}</span>
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 pb-3 flex-1 px-4 sm:px-5">
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {prompt.description ||
                      'Roteiro viral para criadores de conteúdo com até 10s e narração em PT-BR.'}
                  </p>

                  {/* CTA para Engajamento nos Comentários */}
                  {prompt.call_to_action && (
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] space-y-0.5">
                      <span className="font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        CTA de Engajamento:
                      </span>
                      <p className="text-foreground/90 italic line-clamp-1">
                        "{prompt.call_to_action}"
                      </p>
                    </div>
                  )}

                  {/* Aviso amigável para visitantes nas cartas bloqueadas */}
                  {!user && !isSample && (
                    <div className="mt-2 p-2.5 rounded-xl bg-pink-500/5 border border-pink-500/20 text-[11px] flex items-center justify-between gap-2">
                      <span className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        Faça login gratuito para liberar este roteiro
                      </span>
                      <span className="text-[10px] font-bold text-pink-600 underline shrink-0">
                        Entrar →
                      </span>
                    </div>
                  )}
                </CardContent>

                {/* Rodapé do Card */}
                <CardFooter className="pt-3 pb-4 px-4 sm:px-5 border-t flex flex-col gap-2 bg-muted/20">
                  {/* Cenas individuais (Cena 1 a Cena 6) expansíveis com botão "Copiar esta cena" */}
                  {(() => {
                    const scenes = extractScenesFromPrompt(prompt.prompt_text)
                    const isExpanded = expandedScenesPromptId === prompt.id
                    if (scenes.length === 0) return null

                    return (
                      <div className="w-full rounded-2xl border border-pink-500/20 bg-background/60 p-2.5 space-y-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedScenesPromptId(isExpanded ? null : prompt.id)
                          }}
                          className="w-full flex items-center justify-between text-left text-xs font-bold text-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                            Cenas ({scenes.length}) — Copiar Cena por Cena
                          </span>
                          <span className="text-[10px] bg-pink-500/10 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-semibold">
                            {isExpanded ? 'Recolher ▲' : 'Ver Cenas ▼'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="space-y-1.5 pt-1 border-t border-border/50 max-h-56 overflow-y-auto">
                            {scenes.map((sc, sIdx) => {
                              const sceneKey = `${prompt.id}_scene_${sIdx}`
                              const isSceneCopied = copiedSceneKey === sceneKey
                              return (
                                <div
                                  key={sIdx}
                                  className="p-2 rounded-xl bg-muted/40 border border-border/40 text-[11px] flex items-center justify-between gap-2"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-foreground truncate">{sc.title}</p>
                                    {sc.timeRange && (
                                      <span className="text-[10px] font-mono text-muted-foreground">
                                        ⏱️ {sc.timeRange}
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) =>
                                      handleCopyScene(e, prompt, sIdx, sc.raw, sc.title)
                                    }
                                    className="h-6 px-2 text-[10px] gap-1 font-bold shrink-0 border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10"
                                  >
                                    {isSceneCopied ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-500" />
                                        <span>Copiada!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copiar esta cena</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* Botão de Instrução "Como Usar Este Prompt" (ITEM PEDIDO) */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => openHowToUseModal(e, prompt)}
                    className="w-full text-xs font-bold gap-1.5 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 hover:text-purple-700 shadow-xs h-8"
                  >
                    <Info className="w-3.5 h-3.5 text-purple-500" />
                    <span>Como usar este prompt</span>
                  </Button>
                  {/* Botão Regenerar Prompt (com limite de até 2 gratuitas para virais) */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => openCustomizeModal(e, prompt)}
                    className="w-full text-xs font-semibold gap-1.5 border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 hover:text-pink-700 shadow-xs h-8"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
                    <span>
                      Regenerar Prompt (
                      {user
                        ? `${Math.max(0, VIRAL_REGENERATION_LIMIT - getViralRegenerationsUsed(user.id, `customize_${prompt.id}`))} grátis`
                        : '2 grátis'}
                      )
                    </span>
                  </Button>

                  {/* Botões Inferiores: Ver Roteiro + Copiar */}
                  <div className="w-full flex items-center justify-between gap-2 pt-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground group-hover:text-foreground p-0 h-auto font-medium"
                      onClick={() => navigate(`/prompt/${prompt.id}`)}
                    >
                      Ver Roteiro
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant={!user && !isSample ? 'outline' : isLocked ? 'outline' : 'default'}
                      className={`text-xs gap-1.5 rounded-xl font-bold shadow-xs ${
                        !user && !isSample
                          ? 'border-pink-500/40 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20'
                          : !isLocked
                            ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:opacity-95'
                            : 'border-amber-500/40 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                      }`}
                      onClick={(e) => handleCopyPrompt(e, prompt)}
                    >
                      {!user && !isSample ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-pink-500" />
                          Entrar para Copiar
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          Liberar no PRO 👑
                        </>
                      ) : copiedId === prompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          Copiado! 🎉
                        </>
                      ) : isSample ? (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar Amostra
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar 1-Toque
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal: Instruções de Uso ("Como usar este prompt") */}
      <PromptHowToUseModal
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        prompt={infoPrompt}
        onCopyPrompt={() => {
          if (infoPrompt) {
            handleCopyPrompt({ stopPropagation: () => {} } as any, infoPrompt)
          }
        }}
      />

      {/* Modal: Personalizar com Minhas Fotos */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <ImagePlus className="w-5 h-5 text-pink-500" />
              Personalizar com Suas Imagens de Referência 📸
            </DialogTitle>
            <DialogDescription>
              Suba até 3 fotos ou imagens de base para adaptar este roteiro com as características
              exatas da sua cena.
            </DialogDescription>
          </DialogHeader>

          {customizePrompt && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-xl bg-muted/40 border text-xs space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[10px]">
                  Roteiro Base Selecionado:
                </span>
                <p className="font-semibold text-foreground">{customizePrompt.title}</p>
              </div>

              {/* Upload de até 3 fotos */}
              <div className="space-y-2 p-3.5 rounded-2xl border-2 border-dashed bg-muted/20 border-pink-500/30">
                <div className="flex items-center justify-between text-xs">
                  <Label className="font-bold uppercase tracking-wider text-foreground">
                    Fotos de Referência ({customFiles.length} de 3)
                  </Label>
                </div>

                {customPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {customPreviews.map((preview, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border bg-background"
                      >
                        <img
                          src={preview}
                          alt="Foto de referência"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomFile(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {customFiles.length < 3 && (
                  <div>
                    <label
                      htmlFor="custom-viral-upload"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Anexar Imagens / Referências</span>
                    </label>
                    <input
                      id="custom-viral-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleCustomFileUpload}
                    />
                  </div>
                )}
              </div>

              {/* Troca de Personagem / Novo Personagem */}
              <div className="space-y-1.5 p-3 rounded-xl border border-pink-500/30 bg-pink-500/5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="custom-viral-character"
                    className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Trocar Personagem / Elemento Central
                  </Label>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full">
                    Substituição Total
                  </span>
                </div>
                <Input
                  id="custom-viral-character"
                  value={customCharacterName}
                  onChange={(e) => setCustomCharacterName(e.target.value)}
                  placeholder="Ex: Pinguim falante, Gato detetive, Espelho mágico..."
                  className="text-sm border-pink-500/30 focus-visible:ring-pink-500"
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Quer mudar o personagem do prompt pronto? Escreva aqui (ex: se o prompt era com um
                  cachorro, digite <span className="font-semibold text-foreground">pinguim</span>) e
                  o roteiro de ~60s será adaptado substituindo totalmente o antigo pelo novo.
                </p>
              </div>

              {/* Título / Tema da Cena */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-viral-title" className="text-xs font-semibold">
                  Tema ou Contexto da Cena
                </Label>
                <Input
                  id="custom-viral-title"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  placeholder="Ex: Aventuras cômicas na cozinha, mistério na floresta..."
                  className="text-sm"
                />
              </div>

              {/* Detalhes Visuais */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-viral-details" className="text-xs font-semibold">
                  Detalhes Visuais Observados (Opcional)
                </Label>
                <Textarea
                  id="custom-viral-details"
                  value={customVisualDetails}
                  onChange={(e) => setCustomVisualDetails(e.target.value)}
                  placeholder="Ex: Iluminação cinematográfica, expressão assustada, close nos olhos..."
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  type="button"
                  onClick={handleCustomRegenerate}
                  disabled={customRegenerating || adapting}
                  variant="outline"
                  className="flex-1 py-5 border-pink-500/40 text-pink-600 dark:text-pink-400 font-bold hover:bg-pink-500/10 gap-2 text-xs shadow-xs"
                >
                  {customRegenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      <span>Regenerando...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>
                        Regenerar Prompt (
                        {user && customizePrompt
                          ? `${Math.max(0, VIRAL_REGENERATION_LIMIT - getViralRegenerationsUsed(user.id, `customize_${customizePrompt.id}`))} grátis`
                          : '2 grátis'}
                        )
                      </span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleAdaptPrompt}
                  disabled={adapting || customRegenerating}
                  className="flex-1 py-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-2 text-xs"
                >
                  {adapting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Atualizando Roteiro...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Atualizar com Fotos 📸</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Roteiro Adaptado */}
              {adaptedResult && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Roteiro Adaptado com Suas Imagens:
                    </span>
                  </div>

                  <div className="bg-muted/40 border rounded-xl p-3.5 font-mono text-xs whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed select-all">
                    {adaptedResult}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <Button
                      onClick={handleCopyAdapted}
                      className="flex-1 py-4 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-2 text-xs"
                    >
                      {copiedAdapted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Roteiro Adaptado Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar Roteiro Adaptado
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Variações */}
                  {customVariations.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-500" />3 Variações de Ângulos:
                        </span>
                        <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[10px] font-bold">
                          1-Clique
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {customVariations.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedCustomVarId(v.id)}
                            className={`p-2 rounded-xl text-left border text-xs transition-all ${
                              selectedCustomVarId === v.id
                                ? 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                                : 'border-border bg-card hover:bg-muted/30 text-muted-foreground'
                            }`}
                          >
                            <span className="block truncate text-[11px]">{v.badge}</span>
                          </button>
                        ))}
                      </div>

                      {selectedCustomVarId &&
                        (() => {
                          const cVar = customVariations.find((v) => v.id === selectedCustomVarId)
                          if (!cVar) return null
                          const isCopied = copiedCustomVarId === cVar.id
                          return (
                            <div className="p-3 rounded-2xl border bg-muted/20 space-y-2 animate-in fade-in-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-bold text-foreground">
                                    {cVar.angle}
                                  </span>
                                  <p className="text-[11px] text-muted-foreground">
                                    {cVar.description}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCopyCustomVariation(cVar.id, cVar.prompt_text)
                                  }
                                  className="h-7 text-xs gap-1 font-bold bg-pink-600 text-white hover:bg-pink-700"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      Copiado!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      Copiar
                                    </>
                                  )}
                                </Button>
                              </div>

                              <div className="bg-background border rounded-xl p-3 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                                {cVar.prompt_text}
                              </div>
                            </div>
                          )
                        })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento Demonstrativo */}
      {user && (
        <RegenerationPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          userId={user.id}
          onPaymentSuccess={(newBalance) => {
            setExtraCreditsBalance(newBalance)
            setTimeout(() => {
              handleCustomRegenerate()
            }, 300)
          }}
        />
      )}

      {/* Auth Gate Modal */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre ou Crie uma Conta Gratuita"
        description="Você tem direito a 3 amostras gratuitas liberadas para testar. Para copiar todo o acervo de prompts virais, salvar favoritos e personalizar com fotos, crie sua conta grátis em instantes!"
      />
    </div>
  )
}
export default ViralVideos
