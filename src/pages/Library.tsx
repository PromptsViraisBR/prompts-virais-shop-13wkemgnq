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
  ShoppingBag,
  Heart,
  SlidersHorizontal,
} from 'lucide-react'
import { PromptAnimatedMedia } from '@/components/PromptAnimatedMedia'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord, NicheType, StyleType } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, STYLE_LABELS, STYLE_EMOJIS } from '@/types'
import { formatHookTitle, getEstimatedDuration, getPlatformInfo } from '@/lib/promptHooks'
import { PromptCustomizeModal } from '@/components/PromptCustomizeModal'
import { getUserRegenerationCredits } from '@/services/regenerationCredits'
import { RegenerationPaymentModal } from '@/components/RegenerationPaymentModal'
import { AuthGateModal } from '@/components/AuthGateModal'
import { ImagePlus, RefreshCw } from 'lucide-react'

// Lista ordenada de nichos para os chips táteis
const NICHE_KEYS: NicheType[] = [
  'moda_feminina',
  'perfumes_cosmeticos',
  'streetwear_casual',
  'fitness_academia',
  'moda_fitness_plus_size',
  'espelhos_decoracao',
  'produtos_eletronicos',
  'capinhas_acessorios_celular',
  'pet_acessorios',
  'cozinha_utilidades',
  'relogios_bijus',
  'acessorios_calcados',
  'moda_praia',
  'moda_masculina',
  'infantil_kids',
  'lingerie_pijamas',
]

// Lista de estilos
const STYLE_KEYS: StyleType[] = ['pov', 'modelo', 'unboxing_vitrine']

export const Library: React.FC = () => {
  const { user, isAdmin, isPaidPlan } = useAuth()
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

  // Auth Gate para deslogados
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState<string>('')

  // Modal de Personalização com Fotos e Regeneração com 3 Variações
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
        category: 'ecommerce',
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
      console.error('Erro ao carregar biblioteca:', err)
      toast({
        title: 'Erro ao carregar prompts 😅',
        description: 'Tente recarregar a página em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openCustomizeModal = (e: React.MouseEvent, prompt: PromptRecord) => {
    e.stopPropagation()
    if (!user) {
      setAuthGateAction('Personalizar roteiro com fotos da sua peça')
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
      setAuthGateAction('Salvar roteiro nos favoritos')
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

  const handleCopyPrompt = (e: React.MouseEvent, prompt: PromptRecord) => {
    e.stopPropagation()

    // 1. Portão de Login: visitantes não autenticados não podem copiar roteiros da biblioteca
    if (!user) {
      setAuthGateAction(`Copiar roteiro "${prompt.title}"`)
      setAuthGateOpen(true)
      return
    }

    // 2. Bloqueio de Plano Pago para roteiros não gratuitos
    if (!prompt.is_free && !isPaidPlan) {
      toast({
        title: '🔒 Roteiro Exclusivo do Plano Pago',
        description: 'Assine o plano Mensal ou Anual para copiar todos os prompts virais.',
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
        ? 'Roteiro personalizado copiado! 📋✨'
        : 'Roteiro copiado com sucesso! 📋✨',
      description: 'Pronto para gravar ou colar na sua ferramenta de criação!',
    })

    setTimeout(() => {
      setCopiedId(null)
    }, 2500)
  }

  // Filtragem local para aba de favoritos se selecionada
  const displayedPrompts = useMemo(() => {
    if (activeTab === 'favorites') {
      return prompts.filter((p) => favoritePromptIds.has(p.id))
    }
    return prompts
  }, [activeTab, prompts, favoritePromptIds])

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
    <div className="py-6 sm:py-12 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Cabeçalho Amigável e Acolhedor (TikTok / Shopee Style) */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-purple-500/10 p-4 xs:p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[11px] sm:text-xs font-bold tracking-wide max-w-full">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Ganchos & Roteiros Testados em Vitrines</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight break-words">
              Biblioteca de Prompts Virais 🎬✨
            </h1>

            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground font-medium">
              Escolha seu roteiro viral e copie em 1 toque 🚀 — com gancho nos primeiros 3 segundos,
              caimento perfeito e chamada direta para o carrinho da Shopee ou TikTok Shop!
            </p>

            {/* Micro badges de garantia e facilidade */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                ⚡ Copie e cole na hora
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                🎯 Ganchos de alta retenção
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                🛍️ Feito para vender produtos físicos
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
                  Criar Conta Grátis para Acessar
                </Button>
              </Link>
              <p className="text-[11px] text-center text-muted-foreground">
                Cadastre-se grátis para desbloquear e copiar roteiros 🔒
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
                  Liberar Todos os Roteiros PRO 👑
                </Button>
              </Link>
              <p className="text-[11px] text-center text-muted-foreground">
                Planos mensais ou anuais com IA inclusa 🔒
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* 2. Barra de Busca Conversacional e Abas Principais */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Abas com visual moderno e acolhedor */}
          <div className="inline-flex p-1 rounded-2xl bg-muted/60 border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔥 Todos ({prompts.length})
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
                  setAuthGateAction('Acessar seus roteiros favoritos')
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

          {/* Campo de Busca Conversacional */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque seu nicho... ex: vestido, gym, streetwear 🔍"
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

        {/* 3. Chips Táteis de Nicho (Scroll horizontal suave no mobile, wrap no desktop) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <span>👗 Nichos em Alta</span>
              <span className="text-[11px] font-normal lowercase">
                ({NICHE_KEYS.length} categorias)
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
              <span>✨ Todos os Nichos</span>
            </button>

            {/* Chips individuais com emojis */}
            {NICHE_KEYS.map((key) => {
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

        {/* 4. Filtro Tátil de Estilo de Gravação */}
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

      {/* 5. Grid de Cards com Ganchos em Destaque no Título */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent" />
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              Buscando roteiros virais... 🎬
            </p>
            <p className="text-xs text-muted-foreground">
              Preparando os melhores ganchos para sua vitrine
            </p>
          </div>
        </div>
      ) : displayedPrompts.length === 0 ? (
        /* Estado Vazio Amigável e Acolhedor */
        <div className="py-16 px-6 text-center border-2 border-dashed rounded-3xl bg-muted/20 space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto text-2xl">
            😅
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-xl text-foreground">Nada encontrado por aqui 😅</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tente outra palavra na busca ou escolha outro nicho acima. Temos mais de{' '}
              {prompts.length || 40} roteiros validados com ganchos prontos!
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleResetFilters}
              className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold rounded-full px-5"
            >
              ✨ Ver todos os {prompts.length || 40}+ roteiros
            </Button>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="rounded-full"
              >
                Limpar busca "{searchTerm}"
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrompts.map((prompt) => {
            const isLocked = !prompt.is_free && !isPaidPlan
            const isFav = favoritePromptIds.has(prompt.id)
            const isHovered = hoveredPromptId === prompt.id

            // Gancho formatado no estilo TikTok/Shopee
            const hookData = formatHookTitle(prompt)
            const duration = getEstimatedDuration(prompt)
            const platformInfo = getPlatformInfo(prompt.platform)
            const nicheEmoji = NICHE_EMOJIS[prompt.niche] || '👗'

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
                {/* Visual Animated Preview Header: video clip on hover or Ken Burns motion fallback */}
                <PromptAnimatedMedia
                  prompt={prompt}
                  isHovered={isHovered}
                  isFav={isFav}
                  onToggleFavorite={(e) => handleToggleFavorite(e, prompt.id)}
                  aspectClassName="aspect-[16/10] sm:aspect-[16/11]"
                  showBadgeOverlays={true}
                />

                {/* Conteúdo com Gancho no Título em Primeiro Lugar */}
                <CardHeader className="space-y-2 pb-2 pt-4 px-4 sm:px-5">
                  {/* Micro-pílulas com o que o usuário ganha no vídeo */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {/* Tag Gancho em destaque */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/20">
                      <Sparkles className="w-3 h-3" />
                      Gancho 0-3s
                    </span>

                    {/* Duração Estimada */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      <Clock className="w-3 h-3" />
                      {duration}
                    </span>

                    {/* Plataforma */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      <span>{platformInfo.emoji}</span>
                      <span>{platformInfo.label}</span>
                    </span>
                  </div>

                  {/* Título Principal = Gancho Viral com Emojis */}
                  <CardTitle className="text-base sm:text-lg font-extrabold group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug pt-1">
                    {hookData.fullDisplay}
                  </CardTitle>

                  {/* Subtítulo amigável: nome da peça / contexto da gravação */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 line-clamp-1">
                      <span>{nicheEmoji}</span>
                      <span className="font-semibold text-foreground/90">
                        {adaptedPromptsMap[prompt.id]?.productName || prompt.title}
                      </span>
                    </p>
                    {adaptedPromptsMap[prompt.id] && (
                      <Badge className="bg-pink-600 text-white text-[9px] py-0 px-1.5 font-bold shrink-0">
                        Personalizado 📸
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-3 flex-1 px-4 sm:px-5">
                  {/* Descrição curta e acolhedora da cena */}
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {prompt.description ||
                      'Roteiro dinâmico validado para vitrine vertical com link direto no carrinho.'}
                  </p>

                  {/* Call to action de vitrine preview */}
                  {prompt.call_to_action && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-0.5">
                      <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        CTA do Carrinho:
                      </span>
                      <p className="text-foreground/90 italic line-clamp-1">
                        "{prompt.call_to_action}"
                      </p>
                    </div>
                  )}

                  {/* Bloqueio visual para visitante não autenticado sobre o roteiro */}
                  {!user && (
                    <div className="mt-2 p-2.5 rounded-xl bg-pink-500/5 border border-pink-500/20 text-[11px] flex items-center justify-between gap-2">
                      <span className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        Faça login para copiar e ver o roteiro completo
                      </span>
                      <span className="text-[10px] font-bold text-pink-600 underline shrink-0">
                        Entrar →
                      </span>
                    </div>
                  )}
                </CardContent>

                {/* Rodapé com Ações Claras e Rápidas */}
                <CardFooter className="pt-3 pb-4 px-4 sm:px-5 border-t flex flex-col gap-2.5 bg-muted/20">
                  {/* Botão Regenerar Prompt Sempre Visível no Card */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => openCustomizeModal(e, prompt)}
                    className="w-full text-xs font-bold gap-1.5 border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 hover:text-pink-700 shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
                    Regenerar Prompt ({extraCreditsBalance} disponíveis)
                  </Button>

                  {/* Botão de Personalização com Fotos para Gratuito e PRO */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => openCustomizeModal(e, prompt)}
                    className="w-full text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8"
                  >
                    <ImagePlus className="w-3.5 h-3.5 text-pink-500" />
                    Personalizar com minhas fotos 📸
                  </Button>

                  <div className="w-full flex items-center justify-between gap-2">
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
                      variant={!user || isLocked ? 'outline' : 'default'}
                      className={`text-xs gap-1.5 rounded-xl font-bold shadow-xs ${
                        !user
                          ? 'border-pink-500/40 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20'
                          : !isLocked
                            ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:opacity-95'
                            : 'border-amber-500/40 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                      }`}
                      onClick={(e) => handleCopyPrompt(e, prompt)}
                    >
                      {!user ? (
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
        category="ecommerce"
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

      {/* Modal de Pagamento Demonstrativo para Regenerações Extras na Biblioteca */}
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

      {/* Auth Gate Modal para Visitantes Não Logados */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre ou Crie uma Conta para Acessar"
        description="Para copiar roteiros, salvá-los nos favoritos, personalizar com fotos e regenerar variações, crie sua conta gratuita em poucos instantes!"
      />
    </div>
  )
}
