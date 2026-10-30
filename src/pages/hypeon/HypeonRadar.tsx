import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import {
  getRadarViralVideos,
  getHypeonSourcesStatus,
  saveViralVideoReference,
  RadarVideoItem,
  RadarFilterParams,
  SourcesStatusResponse,
} from '@/services/hypeon'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Radio,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Bookmark,
  Check,
  AlertCircle,
  Clock,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Video,
  Key,
  ShieldCheck,
  Lock,
  Play,
  Pause,
  X,
  Youtube,
  Copy,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// 16 Nichos obrigatórios descritos na especificação
export const RADAR_NICHES = [
  { id: 'all', label: 'Todos os Nichos' },
  { id: 'historias', label: 'Histórias' },
  { id: 'terror', label: 'Terror' },
  { id: 'suspense', label: 'Suspense' },
  { id: 'misterio', label: 'Mistério' },
  { id: 'humor', label: 'Humor' },
  { id: 'curiosidades', label: 'Curiosidades' },
  { id: 'ia', label: 'Inteligência Artificial' },
  { id: 'animacoes', label: 'Animações' },
  { id: 'personagens', label: 'Personagens Humanizados' },
  { id: 'animais', label: 'Animais' },
  { id: 'relacionamentos', label: 'Relacionamentos' },
  { id: 'motivacao', label: 'Motivação' },
  { id: 'conhecimento', label: 'Conhecimento' },
  { id: 'tecnologia', label: 'Tecnologia' },
  { id: 'experimentos', label: 'Experimentos' },
  { id: 'satisfatorios', label: 'Satisfatórios' },
  { id: 'outros', label: 'Outros' },
]

export const PLATFORMS = [
  { id: 'all', label: 'Todas as Redes' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram Reels' },
  { id: 'youtube', label: 'YouTube Shorts' },
  { id: 'facebook', label: 'Facebook Reels' },
]

export const PERIODS = [
  { id: '24h', label: 'Últimas 24h' },
  { id: '7d', label: 'Últimos 7 dias' },
  { id: '30d', label: 'Últimos 30 dias' },
]

export const SORTS = [
  { id: 'recent', label: 'Mais Recentes' },
  { id: 'views', label: 'Mais Visualizados' },
  { id: 'engagement', label: 'Maior Engajamento' },
  { id: 'growth', label: 'Em Crescimento' },
]

export const HypeonRadar: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // YouTube passa a ser a plataforma selecionada por padrão (com outras visíveis)
  const [platform, setPlatform] = useState<string>('youtube')
  const [niche, setNiche] = useState<string>('all')
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d')
  const [sort, setSort] = useState<'recent' | 'views' | 'engagement' | 'growth'>('views')

  const [videos, setVideos] = useState<RadarVideoItem[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [sourceMessage, setSourceMessage] = useState<string>('')
  const [sourcesStatus, setSourcesStatus] = useState<SourcesStatusResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  // Controle de reprodução embutida por vídeo
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Radar Viral — HYPEON | Prompts Virais'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Radar Viral HYPEON: feed de tendências reais do TikTok, Instagram Reels e YouTube Shorts. Métricas verdadeiras, filtros de nicho e retenção.',
      )
    }
  }, [])

  const loadRadar = async () => {
    setLoading(true)
    try {
      const [radarRes, sourcesRes] = await Promise.allSettled([
        getRadarViralVideos({ platform: platform as any, niche, period, sort }),
        getHypeonSourcesStatus(),
      ])

      if (sourcesRes.status === 'fulfilled') {
        setSourcesStatus(sourcesRes.value)
      }

      if (radarRes.status === 'fulfilled') {
        setIsConnected(radarRes.value.connected)
        setSourceMessage(radarRes.value.message || '')
        setVideos(radarRes.value.items || [])
      } else {
        setIsConnected(false)
        setSourceMessage('Não foi possível conectar ao provedor de dados.')
      }
    } catch (err: any) {
      console.warn('[RadarViral] Erro ao carregar feed:', err)
      setIsConnected(false)
      setSourceMessage('Erro na comunicação com o backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRadar()
  }, [platform, niche, period, sort])

  const handleCopyLink = async (video: RadarVideoItem) => {
    const url = video.original_url || `https://www.youtube.com/watch?v=${video.id}`
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedId(video.id)
      toast({
        title: 'Link copiado! 📋',
        description: 'URL do YouTube copiada para a área de transferência.',
      })
      setTimeout(() => {
        setCopiedId((curr) => (curr === video.id ? null : curr))
      }, 2500)
    } catch (_) {
      toast({
        title: 'Não foi possível copiar',
        description: 'Copie manualmente o link direto do YouTube.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveReference = async (video: RadarVideoItem) => {
    if (!user) {
      toast({
        title: 'Faça login para salvar',
        description: 'Crie ou acesse sua conta para guardar referências na sua Biblioteca Viral.',
      })
      navigate('/login')
      return
    }

    setSavingId(video.id)
    try {
      await saveViralVideoReference(video)
      setSavedIds((prev) => new Set([...prev, video.id]))
      toast({
        title: 'Referência salva! 📌',
        description: `"${video.title.slice(0, 40)}..." adicionado à sua Biblioteca Viral.`,
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err?.message || 'Não foi possível salvar na biblioteca.',
        variant: 'destructive',
      })
    } finally {
      setSavingId(null)
    }
  }

  const formatNumber = (num?: number | null) => {
    if (num === null || num === undefined) return '-'
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return String(num)
  }

  return (
    <HypeonLayout>
      <div className="space-y-6">
        {/* Header do Radar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Radar Viral</h1>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px] font-mono uppercase"
              >
                Curadoria de Entretenimento • Ao Vivo
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Feed curado para criadores: curiosidades, tutoriais, historinhas narradas, personagens
              humanizados e experimentos — 100% livre de notícias e política.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadRadar}
              disabled={loading}
              className="text-xs font-semibold border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl gap-1.5 h-9"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar Feed</span>
            </Button>
          </div>
        </div>

        {/* BARRA DE FILTROS AVANÇADOS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-purple-400" />
              <span>Filtros do Radar</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {videos.length} vídeo(s) encontrado(s)
            </span>
          </div>

          {/* Filtros em Linha: Plataforma, Período, Ordenação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Plataforma */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Plataforma
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {PERIODS.map((per) => (
                  <option key={per.id} value={per.id}>
                    {per.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ordenar por
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nichos: Tags Selecionáveis com quebra de linha (flex-wrap) acessível a partir de 320px */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nicho Viral ({RADAR_NICHES.length - 1} nichos mapeados)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {RADAR_NICHES.length} opções disponíveis
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 py-1">
              {RADAR_NICHES.map((n) => {
                const isSelected = niche === n.id
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNiche(n.id)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation text-center ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs ring-1 ring-purple-400/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {n.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* AVISO ELEGANTE: DADOS REAIS & FONTE NÃO CONECTADA (SEM DADOS FAKE) */}
        {!isConnected && (
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-950 to-purple-950/20 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono uppercase font-bold">
                    Fonte Oficial Não Conectada
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Transparência HYPEON • Política Anti-Simulação
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Radar Viral preparado para dados reais da YouTube Data API
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Para garantir total fidelidade e não exibir dados ou métricas forjadas, o Radar
                  Viral busca tendências em tempo real diretamente via API oficial. O backend já
                  possui o provedor implementado e pronto para consumo.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Key className="w-4 h-4" />
                <span>Como ativar a exibição de vídeos reais:</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed pl-1">
                <li>
                  Gere uma chave de API gratuita no{' '}
                  <strong className="text-white">Google Cloud Console</strong> ativando a{' '}
                  <strong>YouTube Data API v3</strong>.
                </li>
                <li>
                  Cadastre o segredo com o nome exato{' '}
                  <code className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300 font-mono text-[11px]">
                    YOUTUBE_API_KEY
                  </code>{' '}
                  no painel de segredos do Skip Cloud.
                </li>
                <li>
                  O Radar Viral começará a renderizar os Shorts virais mais recentes, ordenados por
                  visualizações e retenção real com os filtros acima.
                </li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/admin">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs h-10 px-4 rounded-xl"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  <span>Ver Status das Fontes no Admin</span>
                </Button>
              </Link>
              <Link to="/hypeon/tendencias">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold h-10 px-4 rounded-xl"
                >
                  <TrendingUp className="w-4 h-4 mr-1.5 text-purple-400" />
                  <span>Explorar Tendências por Nicho</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* FEED DE VÍDEOS (QUANDO HÁ CONEXÃO REAL) */}
        {isConnected && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video) => {
              const isSaved = savedIds.has(video.id)
              const isSaving = savingId === video.id
              const isPlaying = playingVideoId === video.id
              const embedSrc =
                video.embed_url ||
                `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`

              return (
                <Card
                  key={video.id}
                  className="overflow-hidden rounded-2xl bg-slate-900/90 border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  {/* Player Embutido / Thumbnail */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    {isPlaying ? (
                      <div className="relative w-full h-full bg-black">
                        <iframe
                          src={`${embedSrc}${embedSrc.includes('?') ? '&' : '?'}autoplay=1&playsinline=1`}
                          title={video.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                        <button
                          type="button"
                          onClick={() => setPlayingVideoId(null)}
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all"
                          title="Fechar player"
                          aria-label="Fechar player"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">
                            <Video className="w-10 h-10" />
                          </div>
                        )}

                        {/* Botão Play Centralizado */}
                        <button
                          type="button"
                          onClick={() => setPlayingVideoId(video.id)}
                          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 border-2 border-white/30 backdrop-blur-xs"
                          title="Reproduzir vídeo embutido"
                          aria-label={`Reproduzir ${video.title}`}
                        >
                          <Play className="w-6 h-6 fill-white translate-x-0.5" />
                        </button>

                        <div className="absolute top-2.5 left-2.5 pointer-events-none">
                          <Badge className="bg-slate-950/80 backdrop-blur-md text-white border-0 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Youtube className="w-3 h-3 text-red-500" />
                            <span>{video.platform_name}</span>
                          </Badge>
                        </div>

                        <div className="absolute top-2.5 right-2.5 pointer-events-none">
                          <Badge className="bg-purple-600/90 backdrop-blur-md text-white border-0 text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-cyan-300" />
                            <span>Score {video.growth_score}%</span>
                          </Badge>
                        </div>

                        <div className="absolute bottom-2 left-2.5 pointer-events-none">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/75 text-slate-200 font-mono font-semibold">
                            Toque para assistir
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <CardHeader className="p-4 space-y-1.5 flex-1">
                    {/* Crédito explícito ao Criador */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-slate-400 text-[10px]">Criador:</span>
                        <span
                          className="font-semibold text-purple-300 truncate"
                          title={video.author_name}
                        >
                          {video.author_name}
                        </span>
                      </div>
                      <span className="shrink-0">
                        {video.published_at ? video.published_at.slice(0, 10) : ''}
                      </span>
                    </div>

                    <CardTitle className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                      {video.title}
                    </CardTitle>

                    {video.description && (
                      <CardDescription className="text-xs text-slate-400 line-clamp-2 pt-1">
                        {video.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3">
                    {/* Grid de Métricas Reais do YouTube */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" /> Views
                        </span>
                        <strong className="text-white text-xs">
                          {formatNumber(video.views_count)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400" /> Likes
                        </span>
                        <strong className="text-white text-xs">
                          {formatNumber(video.likes_count)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                          <MessageCircle className="w-3 h-3 text-cyan-400" /> Coment.
                        </span>
                        <strong className="text-white text-xs">
                          {formatNumber(video.comments_count)}
                        </strong>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 bg-slate-950/40">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPlayingVideoId(isPlaying ? null : video.id)}
                        className="h-8 px-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 gap-1 rounded-lg"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3 h-3 text-amber-400" />
                            <span className="hidden sm:inline">Pausar</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-rose-400 fill-rose-400" />
                            <span className="hidden sm:inline">Assistir</span>
                          </>
                        )}
                      </Button>

                      {/* Botão Copiar Link com feedback visual */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyLink(video)}
                        className={`h-8 px-2.5 text-xs font-medium rounded-lg gap-1 border-slate-800 transition-colors ${
                          copiedId === video.id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Copiar URL do vídeo"
                      >
                        {copiedId === video.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-cyan-400" />
                            <span>Copiar link</span>
                          </>
                        )}
                      </Button>

                      <a
                        href={video.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-medium hover:underline px-1"
                        title="Abrir no YouTube"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleSaveReference(video)}
                      disabled={isSaved || isSaving}
                      className={`text-xs font-bold h-8 px-3 rounded-xl gap-1.5 transition-all shrink-0 ${
                        isSaved
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvo</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Salvar Ref</span>
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        {/* FEED VAZIO MAS CONECTADO */}
        {isConnected && videos.length === 0 && !loading && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Radio className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              Nenhum vídeo retornado para este filtro
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Tente selecionar outro nicho ou ampliar o período para 30 dias para capturar mais
              tendências.
            </p>
          </div>
        )}
      </div>
    </HypeonLayout>
  )
}
export default HypeonRadar
