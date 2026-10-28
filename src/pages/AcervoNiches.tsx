import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPrompts } from '@/services/prompts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Crown,
  PlayCircle,
  Clock,
  ShieldCheck,
  Video,
} from 'lucide-react'
import type { NicheType } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, VIRAL_NICHE_KEYS } from '@/types'

interface NicheMetaInfo {
  key: NicheType
  name: string
  emoji: string
  benefit: string
  description: string
  gradient: string
  accentColor: string
  borderAccent: string
  badgeText: string
  recommendedStyle: string
}

const NICHE_DETAILS: Record<NicheType, NicheMetaInfo> = {
  historinhas_frutas: {
    key: 'historinhas_frutas',
    name: NICHE_LABELS.historinhas_frutas,
    emoji: NICHE_EMOJIS.historinhas_frutas,
    benefit: 'Altíssima retenção com frutas 3D carismáticas e comédias cotidianas.',
    description:
      'Personagens de frutas humanoides 3D hiper-realistas com fofocas e situações divertidas na geladeira e cozinha.',
    gradient: 'from-rose-500/15 via-red-500/10 to-amber-500/5',
    accentColor: 'text-rose-600 dark:text-rose-400',
    borderAccent: 'group-hover:border-rose-500/50',
    badgeText: 'Viral do TikTok',
    recommendedStyle: 'POV ou Modelo',
  },
  infantil_historinhas: {
    key: 'infantil_historinhas',
    name: NICHE_LABELS.infantil_historinhas,
    emoji: NICHE_EMOJIS.infantil_historinhas,
    benefit: 'Visual lúdico e cativante para engajar famílias, crianças e mães.',
    description:
      'Fábulas lúdicas, historinhas de ninar e aventuras fofas para reter pais e crianças em canais Dark ou Kids.',
    gradient: 'from-amber-500/15 via-yellow-500/10 to-pink-500/5',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderAccent: 'group-hover:border-amber-500/50',
    badgeText: 'Kids & Família',
    recommendedStyle: 'Cenas 10s Fábulas',
  },
  terror_suspense: {
    key: 'terror_suspense',
    name: NICHE_LABELS.terror_suspense,
    emoji: NICHE_EMOJIS.terror_suspense,
    benefit: 'Ganchos misteriosos de 3AM que prendem a respiração até o último segundo.',
    description:
      'Lendas urbanas, relatos de mistério, sons na penumbra e terror psicológico com retenção explosiva.',
    gradient: 'from-purple-500/15 via-indigo-500/10 to-slate-500/5',
    accentColor: 'text-purple-600 dark:text-purple-400',
    borderAccent: 'group-hover:border-purple-500/50',
    badgeText: '3AM & Mistério',
    recommendedStyle: 'POV Suspense',
  },
  comedia_engracado: {
    key: 'comedia_engracado',
    name: NICHE_LABELS.comedia_engracado,
    emoji: NICHE_EMOJIS.comedia_engracado,
    benefit: 'Identificação imediata com perrengues reais para compartilhamentos em massa.',
    description:
      'Situações do home office, dieta, família e vida real que geram milhares de comentários e marcações.',
    gradient: 'from-amber-500/15 via-orange-500/10 to-rose-500/5',
    accentColor: 'text-orange-600 dark:text-orange-400',
    borderAccent: 'group-hover:border-orange-500/50',
    badgeText: 'Humor & Meme',
    recommendedStyle: 'POV & Reação',
  },
  face_swap: {
    key: 'face_swap',
    name: NICHE_LABELS.face_swap,
    emoji: NICHE_EMOJIS.face_swap,
    benefit: 'Efeitos cinematográficos de cinema para transformar qualquer foto.',
    description:
      'Roteiros calibrados para ferramentas de swap facial, transformando selfies em personagens históricos ou de cinema.',
    gradient: 'from-pink-500/15 via-purple-500/10 to-indigo-500/5',
    accentColor: 'text-pink-600 dark:text-pink-400',
    borderAccent: 'group-hover:border-pink-500/50',
    badgeText: 'IA Avançada',
    recommendedStyle: 'Modelo & Cinema',
  },
  asmr_sensorial: {
    key: 'asmr_sensorial',
    name: NICHE_LABELS.asmr_sensorial,
    emoji: NICHE_EMOJIS.asmr_sensorial,
    benefit: 'Sons crocantes e texturas relaxantes com tempo de tela prolongado.',
    description:
      'Cortes de areia cinética, esferas de gel e sons crocantes que induzem relaxamento profundo e hipnotizam o feed.',
    gradient: 'from-cyan-500/15 via-teal-500/10 to-blue-500/5',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    borderAccent: 'group-hover:border-cyan-500/50',
    badgeText: 'Relax & Satisfatório',
    recommendedStyle: 'Vitrine ASMR',
  },
  animais_falantes: {
    key: 'animais_falantes',
    name: NICHE_LABELS.animais_falantes,
    emoji: NICHE_EMOJIS.animais_falantes,
    benefit: 'O carisma imbatível dos pets com dublagens expressivas e cômicas.',
    description:
      'Cachorros, gatos e pets expressivos cobrando passeios, petiscos e reagindo a tutores de forma hilária.',
    gradient: 'from-emerald-500/15 via-teal-500/10 to-amber-500/5',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    borderAccent: 'group-hover:border-emerald-500/50',
    badgeText: 'Pets & Humor',
    recommendedStyle: 'POV Pet Cômico',
  },
  curiosidades_fatos: {
    key: 'curiosidades_fatos',
    name: NICHE_LABELS.curiosidades_fatos,
    emoji: NICHE_EMOJIS.curiosidades_fatos,
    benefit: 'Fatos impressionantes de ciência e mistério que explodem no feed.',
    description:
      'Segredos do oceano, enigmas do corpo humano, espaço e mistérios históricos que despertam debates intensos.',
    gradient: 'from-indigo-500/15 via-blue-500/10 to-violet-500/5',
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    borderAccent: 'group-hover:border-indigo-500/50',
    badgeText: 'Ciência & Fatos',
    recommendedStyle: 'Documental ~60s',
  },
  moda_feminina: {
    key: 'moda_feminina',
    name: 'Moda Feminina',
    emoji: '👗',
    benefit: 'Vitrines e provadores de alta conversão.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  moda_masculina: {
    key: 'moda_masculina',
    name: 'Moda Masculina',
    emoji: '👔',
    benefit: 'Estilo masculino casual e elegante.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  fitness_academia: {
    key: 'fitness_academia',
    name: 'Fitness & Academia',
    emoji: '💪',
    benefit: 'Treinos e moda fitness de alta energia.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  moda_praia: {
    key: 'moda_praia',
    name: 'Moda Praia',
    emoji: '👙',
    benefit: 'Verão e praia.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  acessorios_calcados: {
    key: 'acessorios_calcados',
    name: 'Acessórios & Calçados',
    emoji: '👠',
    benefit: 'Calçados e bolsas.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  streetwear_casual: {
    key: 'streetwear_casual',
    name: 'Streetwear & Casual',
    emoji: '🧢',
    benefit: 'Cultura urbana.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  infantil_kids: {
    key: 'infantil_kids',
    name: 'Infantil & Kids',
    emoji: '👶',
    benefit: 'Infantil.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  lingerie_pijamas: {
    key: 'lingerie_pijamas',
    name: 'Lingerie & Pijamas',
    emoji: '🩱',
    benefit: 'Noite e conforto.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  espelhos_decoracao: {
    key: 'espelhos_decoracao',
    name: 'Espelhos & Decoração',
    emoji: '🪞',
    benefit: 'Casa e decoração.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  produtos_eletronicos: {
    key: 'produtos_eletronicos',
    name: 'Produtos Eletrônicos',
    emoji: '📱',
    benefit: 'Gadgets.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  capinhas_acessorios_celular: {
    key: 'capinhas_acessorios_celular',
    name: 'Capinhas & Celular',
    emoji: '🔌',
    benefit: 'Acessórios mobile.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  moda_fitness_plus_size: {
    key: 'moda_fitness_plus_size',
    name: 'Plus Size',
    emoji: '🏋️',
    benefit: 'Fitness plus size.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  pet_acessorios: {
    key: 'pet_acessorios',
    name: 'Pet & Acessórios',
    emoji: '🧸',
    benefit: 'Pets.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  cozinha_utilidades: {
    key: 'cozinha_utilidades',
    name: 'Cozinha & Utilidades',
    emoji: '🏠',
    benefit: 'Cozinha.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  relogios_bijus: {
    key: 'relogios_bijus',
    name: 'Relógios & Bijus',
    emoji: '⌚',
    benefit: 'Acessórios.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
  perfumes_cosmeticos: {
    key: 'perfumes_cosmeticos',
    name: 'Perfumes & Cosméticos',
    emoji: '💄',
    benefit: 'Beleza.',
    description: '',
    gradient: '',
    accentColor: '',
    borderAccent: '',
    badgeText: '',
    recommendedStyle: '',
  },
}

export const AcervoNiches: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [countsByNiche, setCountsByNiche] = useState<Record<string, number>>({})
  const [freeCountsByNiche, setFreeCountsByNiche] = useState<Record<string, number>>({})
  const [totalPrompts, setTotalPrompts] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Configura SEO no carregamento
    document.title = 'Nichos do Acervo Viral | Prompts Virais Shop'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Conheça os 8 nichos de vídeos virais do acervo PV: historinhas de frutas, infantil, terror 3AM, comédia, face swap, ASMR, animais falantes e curiosidades.',
      )
    }

    loadNicheCounts()
  }, [])

  const loadNicheCounts = async () => {
    setLoading(true)
    try {
      // Busca todos os prompts da categoria virais ao vivo da coleção
      const allViralPrompts = await getPrompts({ category: 'virais' })
      const counts: Record<string, number> = {}
      const freeCounts: Record<string, number> = {}

      // Inicializa os 8 nichos
      VIRAL_NICHE_KEYS.forEach((key) => {
        counts[key] = 0
        freeCounts[key] = 0
      })

      allViralPrompts.forEach((p) => {
        if (p.niche) {
          counts[p.niche] = (counts[p.niche] || 0) + 1
          if (p.is_free) {
            freeCounts[p.niche] = (freeCounts[p.niche] || 0) + 1
          }
        }
      })

      setCountsByNiche(counts)
      setFreeCountsByNiche(freeCounts)
      setTotalPrompts(allViralPrompts.length)
    } catch (err) {
      console.error('Erro ao carregar contagens reais de nichos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNicheClick = (nicheKey: NicheType) => {
    // Redireciona diretamente para o acervo de vídeos virais já filtrado por aquele nicho
    navigate(`/virais?nicho=${nicheKey}`)
  }

  return (
    <div className="py-4 sm:py-12 px-2.5 xs:px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Cabeçalho da Página de Nichos */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 p-4 xs:p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-center lg:text-left items-center">
          <div className="space-y-2.5 max-w-2xl flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[11px] sm:text-xs font-bold tracking-wide">
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Categorias Estratégicas para Criadores de Conteúdo</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight break-words">
              Nichos do Acervo Viral 🚀
            </h1>

            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Explore os {VIRAL_NICHE_KEYS.length} nichos de alta retenção calibrados para vídeos
              curtos (TikTok, Reels e Shorts). Escolha o formato ideal para o seu canal e acesse
              roteiros cena a cena prontos para gravar.
            </p>

            {/* Micro badges com métricas reais */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <strong>{VIRAL_NICHE_KEYS.length}</strong> Nichos Estratégicos
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                <Video className="w-3.5 h-3.5 text-pink-500" />
                {loading ? '...' : <strong>{totalPrompts}</strong>} Prompts no Acervo
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Roteiros ~60s (Cenas de 10s)
              </span>
              <span className="inline-flex items-center gap-1 bg-background/80 px-2.5 py-1 rounded-full border">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                100% PT-BR sem texto na tela
              </span>
            </div>
          </div>

          {/* CTA Superior */}
          <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
            <Link to="/virais" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[46px] h-12 px-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all rounded-xl"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                <span>Ver Todos no Acervo</span>
              </Button>
            </Link>
            {!user && (
              <p className="text-[11px] text-center text-muted-foreground">
                3 amostras liberadas para teste sem cadastro 🎁
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Regra de Ouro Informativa: Acesso Livre aos Nichos e Portão nos Prompts */}
      {!user ? (
        <div className="p-3.5 rounded-2xl bg-pink-500/5 border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                Amostras Gratuitas Liberadas em Todos os Nichos!
              </p>
              <p className="text-muted-foreground text-[11px]">
                Você pode explorar qualquer nicho abaixo. Ao clicar, os 3 primeiros roteiros são
                100% gratuitos para testar antes de entrar.
              </p>
            </div>
          </div>
          <Link to="/login" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold border-pink-500/30 text-pink-600 hover:bg-pink-500/10 rounded-xl h-9"
            >
              Criar Conta Grátis →
            </Button>
          </Link>
        </div>
      ) : !isPaidPlan ? (
        <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                Assine o Plano PRO para Copiar Todo o Acervo
              </p>
              <p className="text-muted-foreground text-[11px]">
                Desbloqueie todos os roteiros cena a cena, regenerações extras e prompts PRO de cada
                nicho.
              </p>
            </div>
          </div>
          <Link to="/planos" className="shrink-0 w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full text-xs font-bold bg-gradient-to-r from-pink-600 to-amber-500 text-white rounded-xl h-9 shadow-xs"
            >
              Ver Planos PRO →
            </Button>
          </Link>
        </div>
      ) : null}

      {/* 2. Grid de Cartões dos 8 Nichos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <span>Grade de Nichos</span>
              <span className="text-xs font-medium text-muted-foreground">
                ({VIRAL_NICHE_KEYS.length} nichos disponíveis)
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Clique em qualquer cartão para abrir o acervo filtrado pronto para copiar ou
              personalizar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {VIRAL_NICHE_KEYS.map((key) => {
            const info = NICHE_DETAILS[key]
            const totalCount = countsByNiche[key] || 0
            const freeCount = freeCountsByNiche[key] || 0

            return (
              <Card
                key={key}
                onClick={() => handleNicheClick(key)}
                className={`group cursor-pointer border border-border/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${info.borderAccent} rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between bg-card relative`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleNicheClick(key)
                  }
                }}
                aria-label={`Ver prompts do nicho ${info.name}`}
              >
                {/* Topo do Card com Gradiente suave por nicho */}
                <div
                  className={`p-4 sm:p-5 bg-gradient-to-br ${info.gradient} border-b border-border/40 relative`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Ícone Emojificado em destaque com círculo suave */}
                    <div className="w-12 h-12 rounded-2xl bg-background/90 shadow-xs border border-border/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {info.emoji}
                    </div>

                    {/* Tag de destaque */}
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold px-2 py-0.5 bg-background/80 text-foreground border shadow-2xs"
                    >
                      {info.badgeText}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1">
                    <CardTitle className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
                      {info.name}
                    </CardTitle>
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {info.recommendedStyle}
                    </p>
                  </div>
                </div>

                {/* Conteúdo com Frase de Benefício e Descrição */}
                <CardContent className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Frase Curta de Benefício (Item Obrigatório) */}
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
                      <span className="font-bold text-foreground block mb-0.5">
                        💡 Por que viraliza:
                      </span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {info.benefit}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {info.description}
                    </p>
                  </div>

                  {/* Rodapé Interno com Contagem Real de Prompts */}
                  <div className="pt-3 border-t border-border/40 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-pink-500" />
                        Acervo ao vivo:
                      </span>
                      <span className="font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded-lg border text-[11px]">
                        {loading
                          ? '...'
                          : `${totalCount} ${totalCount === 1 ? 'prompt' : 'prompts'}`}
                      </span>
                    </div>

                    {/* Amostras Gratuitas Disponíveis */}
                    {freeCount > 0 && (
                      <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>🎁 Amostras gratuitas:</span>
                        <span>{freeCount} liberadas</span>
                      </div>
                    )}

                    {/* Botão de Ação Visual com Área de Toque Confortável */}
                    <Button
                      size="sm"
                      className="w-full min-h-[40px] h-10 rounded-xl text-xs font-bold gap-1.5 bg-gradient-to-r from-pink-600 to-rose-500 group-hover:from-pink-500 group-hover:to-amber-500 text-white shadow-xs transition-all"
                    >
                      <span>Explorar Nicho</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 3. Seção Informativa de Apoio ao Criador */}
      <section className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border bg-muted/20 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              Como escolher o nicho ideal para começar?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Todos os nossos 8 nichos possuem ganchos de alta retenção validados para reter até o
              final do vídeo. Se você está começando, teste os 3 prompts gratuitos liberados em cada
              categoria para ver qual perfil se adapta melhor ao seu estilo!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Link to="/virais" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs font-bold border-pink-500/30 text-pink-600 hover:bg-pink-500/10 rounded-xl h-10 min-h-[40px]"
              >
                <span>Acessar Acervo Geral</span>
              </Button>
            </Link>
            <Link to="/gerador" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto text-xs font-bold bg-gradient-to-r from-pink-600 to-amber-500 text-white rounded-xl h-10 min-h-[40px]">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>Gerar do Zero com IA</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
export default AcervoNiches
