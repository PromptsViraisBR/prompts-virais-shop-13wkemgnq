import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPrompts } from '@/services/prompts'
import { getUserFavorites, toggleFavorite } from '@/services/favorites'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Sparkles,
  Lock,
  Heart,
  Copy,
  Check,
  Video,
  ArrowRight,
  Filter,
  Layers,
  Crown,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord, NicheType, StyleType } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

export const Library: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [prompts, setPrompts] = useState<PromptRecord[]>([])
  const [favoritePromptIds, setFavoritePromptIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState<string>('all')
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'favorites'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [searchTerm, selectedNiche, selectedStyle, activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      const isFreeOnly = activeTab === 'free'
      const items = await getPrompts({
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
        title: 'Erro ao carregar prompts',
        description: 'Tente recarregar a página.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, promptId: string) => {
    e.stopPropagation()
    if (!user) {
      toast({
        title: 'Faça login para favoritar',
        description: 'Salve seus roteiros preferidos na sua conta.',
      })
      navigate('/login')
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
        title: isFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
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

    // Se o prompt for premium e usuário não tiver plano pago
    if (!prompt.is_free && !isPaidPlan) {
      toast({
        title: 'Recurso Exclusivo do Plano Pago',
        description: 'Assine o plano Mensal ou Anual para copiar prompts premium.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(prompt.prompt_text)
    setCopiedId(prompt.id)
    toast({
      title: 'Prompt copiado com sucesso! 📋',
      description: 'Pronto para colar e usar no seu roteiro do TikTok Shop / Shopee.',
    })

    setTimeout(() => {
      setCopiedId(null)
    }, 2500)
  }

  // Filtragem local para aba de favoritos se selecionada
  const displayedPrompts =
    activeTab === 'favorites' ? prompts.filter((p) => favoritePromptIds.has(p.id)) : prompts

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-pink-600 dark:text-pink-400 border-pink-500/30 text-xs font-semibold uppercase"
          >
            Acervo Curado
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Biblioteca de Prompts Virais
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Roteiros validados prontos para copiar, focados em conversão, retenção nos primeiros 3
            segundos e links na vitrine.
          </p>
        </div>

        {!isPaidPlan && (
          <Link to="/planos">
            <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold shadow-md">
              <Crown className="w-4 h-4 mr-2" />
              Liberar Todos os Prompts
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs & Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'all' | 'free' | 'favorites')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="all">Todos ({prompts.length})</TabsTrigger>
              <TabsTrigger value="free">Gratuitos</TabsTrigger>
              <TabsTrigger value="favorites" disabled={!user}>
                Favoritos ({favoritePromptIds.size})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por peça, gancho ou nicho..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Dropdowns de Nicho e Estilo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Nicho / Categoria</label>
            <Select value={selectedNiche} onValueChange={setSelectedNiche}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Nichos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Nichos</SelectItem>
                {Object.entries(NICHE_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Estilo do Vídeo</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Estilos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estilos</SelectItem>
                {Object.entries(STYLE_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <Button
              variant="outline"
              className="w-full text-xs"
              onClick={() => {
                setSearchTerm('')
                setSelectedNiche('all')
                setSelectedStyle('all')
                setActiveTab('all')
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando roteiros virais...</p>
        </div>
      ) : displayedPrompts.length === 0 ? (
        <div className="py-16 text-center border rounded-2xl bg-muted/20 space-y-3">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-lg">Nenhum prompt encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Tente mudar os filtros de busca ou nicho para encontrar outros roteiros disponíveis.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedNiche('all')
              setSelectedStyle('all')
              setActiveTab('all')
            }}
          >
            Ver todos os prompts
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrompts.map((prompt) => {
            const isLocked = !prompt.is_free && !isPaidPlan
            const isFav = favoritePromptIds.has(prompt.id)
            const hasCustomImage = Boolean(prompt.reference_image_url && !imageErrors[prompt.id])
            const fallbackColor =
              prompt.niche === 'moda_feminina'
                ? 'from-pink-500/20 via-rose-500/10 to-transparent'
                : prompt.niche === 'fitness_academia'
                  ? 'from-purple-500/20 via-indigo-500/10 to-transparent'
                  : prompt.niche === 'moda_praia'
                    ? 'from-cyan-500/20 via-teal-500/10 to-transparent'
                    : 'from-amber-500/20 via-orange-500/10 to-transparent'

            return (
              <Card
                key={prompt.id}
                onClick={() => navigate(`/prompt/${prompt.id}`)}
                className={`flex flex-col justify-between border cursor-pointer transition-all hover:shadow-xl hover:border-pink-500/50 group relative overflow-hidden rounded-2xl ${
                  isLocked ? 'bg-muted/10' : ''
                }`}
              >
                {/* Visual Reference Header / Thumbnail 9:16 compact banner */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden bg-muted/40 border-b">
                  {hasCustomImage ? (
                    <img
                      src={prompt.reference_image_url}
                      alt={prompt.title}
                      loading="lazy"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [prompt.id]: true }))
                      }}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${fallbackColor} flex flex-col items-center justify-center p-4 text-center space-y-2`}
                    >
                      <div className="w-10 h-10 rounded-full bg-background/80 shadow-xs flex items-center justify-center text-pink-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground line-clamp-1">
                        Cena de Referência Visual
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay & Badges em cima da imagem */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-black/30 pointer-events-none" />

                  {/* Top floating actions */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-semibold backdrop-blur-md bg-background/80 shadow-xs"
                    >
                      {NICHE_LABELS[prompt.niche] || prompt.niche}
                    </Badge>

                    <div className="flex items-center gap-1">
                      {prompt.is_free ? (
                        <Badge className="bg-emerald-500/90 hover:bg-emerald-600 text-white border-0 text-[10px] font-bold shadow-xs">
                          Gratuito
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white border-0 text-[10px] font-bold shadow-xs">
                          PRO
                        </Badge>
                      )}

                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 rounded-full backdrop-blur-md bg-background/80 shadow-xs hover:bg-background"
                        onClick={(e) => handleToggleFavorite(e, prompt.id)}
                        aria-label="Favoritar"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Bottom visual tag */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/95 font-medium drop-shadow-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs">
                      <Video className="w-3 h-3 text-pink-400" />
                      {STYLE_LABELS[prompt.style] || prompt.style}
                    </span>
                    {prompt.platform && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs">
                        {PLATFORM_LABELS[prompt.platform]}
                      </span>
                    )}
                  </div>
                </div>

                <CardHeader className="space-y-2 pb-2 pt-3 px-4 sm:px-5">
                  <CardTitle className="text-base sm:text-lg font-bold group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug">
                    {prompt.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-2 text-xs">
                    {prompt.description ||
                      'Roteiro dinâmico e pronto para gravação em vídeo vertical.'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pb-3 flex-1">
                  {/* Hook preview */}
                  {prompt.hook && (
                    <div className="p-2.5 rounded-lg bg-muted/60 border text-xs space-y-1">
                      <span className="font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider text-[10px] block">
                        🎯 Gancho Inicial (0-3s)
                      </span>
                      <p className="italic text-foreground line-clamp-2">"{prompt.hook}"</p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 border-t flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground group-hover:text-foreground p-0 h-auto font-medium"
                    onClick={() => navigate(`/prompt/${prompt.id}`)}
                  >
                    Ver Roteiro Completo
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>

                  <Button
                    size="sm"
                    variant={isLocked ? 'outline' : 'default'}
                    className={`text-xs gap-1.5 ${
                      !isLocked
                        ? 'bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold'
                        : ''
                    }`}
                    onClick={(e) => handleCopyPrompt(e, prompt)}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        Bloqueado (PRO)
                      </>
                    ) : copiedId === prompt.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Prompt
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
