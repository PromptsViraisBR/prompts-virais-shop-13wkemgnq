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
import { PromptCustomizeModal } from '@/components/PromptCustomizeModal'
import {
  getUserRegenerationCredits,
  VIRAL_REGENERATION_LIMIT,
  getViralRegenerationsUsed,
} from '@/services/regenerationCredits'
import { RegenerationPaymentModal } from '@/components/RegenerationPaymentModal'
import { AuthGateModal } from '@/components/AuthGateModal'
import { ViralGenerator } from '@/components/ViralGenerator'
import { ImagePlus, RefreshCw } from 'lucide-react'

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
  // Roteiros adaptados persistidos na sessão por promptId para o usuário não perder após fechar
  const [adaptedPromptsMap, setAdaptedPromptsMap] = useState<
    Record<string, { text: string; productName: string }>
  >({})
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
    if (user) {
      getUserRegenerationCredits(user.id).then((c) => {
        if (c) setExtraCreditsBalance(c.extra_prompts_balance || 0)
      })
    }
    setModalOpen(true)
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

    const textToCopy = adaptedPromptsMap[prompt.id]?.text || prompt.prompt_text
    navigator.clipboard.writeText(textToCopy)
    setCopiedId(prompt.id)
    toast({
      title: adaptedPromptsMap[prompt.id]
        ? 'Prompt Viral Personalizado Copiado! 📋✨'
        : !user
          ? 'Amostra Gratuita Copiada! 🎁✨'
          : 'Prompt Viral Copiado! 📋✨',
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
                    const activePromptForCard =
                      adaptedPromptsMap[prompt.id]?.text || prompt.prompt_text
                    const scenes = extractScenesFromPrompt(activePromptForCard)
                    const isExpanded = expandedScenesPromptId === prompt.id
                    if (scenes.length === 0) return null

                    return (
                      <div className="w-full rounded-2xl border border-pink-500/20 bg-background/60 p-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedScenesPromptId(isExpanded ? null : prompt.id)
                            }}
                            className="flex-1 flex items-center justify-between text-left text-xs font-bold text-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                              Cenas ({scenes.length}) — Copiar Cena por Cena
                            </span>
                            <span className="text-[10px] bg-pink-500/10 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-semibold">
                              {isExpanded ? 'Recolher ▲' : 'Ver Cenas ▼'}
                            </span>
                          </button>
                          {adaptedPromptsMap[prompt.id] && (
                            <Badge className="bg-pink-600 text-white text-[9px] py-0 px-1.5 font-bold shrink-0">
                              Personalizado 📸
                            </Badge>
                          )}
                        </div>

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

      {/* Modal Reutilizável: Personalizar com Minhas Fotos (Mantém cenas separadas e salva no histórico) */}
      <PromptCustomizeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prompt={customizePrompt}
        userId={user?.id}
        isPaidPlan={isPaidPlan}
        extraCreditsBalance={extraCreditsBalance}
        onCreditsUpdated={(newBal) => setExtraCreditsBalance(newBal)}
        onRequestPayment={() => setPaymentModalOpen(true)}
        category="virais"
        initialAdaptedPrompt={customizePrompt ? adaptedPromptsMap[customizePrompt.id]?.text : null}
        initialProductName={
          customizePrompt ? adaptedPromptsMap[customizePrompt.id]?.productName : ''
        }
        onAdaptedApplied={(newText, newProd) => {
          if (customizePrompt) {
            setAdaptedPromptsMap((prev) => ({
              ...prev,
              [customizePrompt.id]: {
                text: newText,
                productName: newProd || customizePrompt.title,
              },
            }))
          }
        }}
      />

      {/* Modal de Pagamento Demonstrativo */}
      {user && (
        <RegenerationPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          userId={user.id}
          onPaymentSuccess={(newBalance) => {
            setExtraCreditsBalance(newBalance)
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
