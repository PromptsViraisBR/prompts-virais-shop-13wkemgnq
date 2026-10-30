import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Radio,
  Copy,
  BookOpen,
  Lightbulb,
  BarChart3,
  Clapperboard,
  TrendingUp,
  Bookmark,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export interface ToolCardData {
  id: string
  title: string
  subtitle: string
  description: string
  icon: any
  href: string
  status: 'active' | 'planned'
  statusBadge: string
  phase: string
  highlight?: string
}

export const HYPEON_TOOLS: ToolCardData[] = [
  {
    id: 'radar',
    title: 'Radar Viral',
    subtitle: 'Feed de tendências em tempo real',
    description:
      'Monitore vídeos de alto engajamento no TikTok, Reels e Shorts com métricas reais, filtros de nicho e crescimento.',
    icon: Radio,
    href: '/hypeon/radar',
    status: 'active',
    statusBadge: 'Ativo • Fase 2',
    phase: 'Fase 2',
    highlight: 'Dados oficiais via API',
  },
  {
    id: 'clonador',
    title: 'Clonador Viral',
    subtitle: 'Engenharia reversa com IA',
    description:
      'Transforme vídeos virais em roteiros originais em 14 blocos com 4 modos inteligentes e enriquecimento via YouTube.',
    icon: Copy,
    href: '/hypeon/clonador',
    status: 'active',
    statusBadge: 'Disponível',
    phase: 'Fase 3',
    highlight: '4 modos + 14 blocos originais',
  },
  {
    id: 'stories',
    title: 'HYPEON Stories',
    subtitle: 'Narrativas cinematográficas & séries',
    description:
      'Crie histórias em 11 categorias com cenas, prompts de imagem e vídeo, além de séries com personagens contínuos.',
    icon: BookOpen,
    href: '/hypeon/stories',
    status: 'active',
    statusBadge: 'Disponível',
    phase: 'Fase 3',
    highlight: 'Prompts de imagem/vídeo + séries',
  },
  {
    id: 'ideas',
    title: 'HYPEON Ideas',
    subtitle: 'Banco infinito com estimativa IA',
    description:
      'Gere 5, 10 ou 20 ideias de alta retenção com score preditivo de engajamento e transformação direta em roteiro.',
    icon: Lightbulb,
    href: '/hypeon/ideas',
    status: 'active',
    statusBadge: 'Disponível',
    phase: 'Fase 3',
    highlight: '5, 10 ou 20 ideias por vez',
  },
  {
    id: 'analisador',
    title: 'Analisador de Vídeos',
    subtitle: 'Diagnóstico de retenção e gancho',
    description:
      'Receba notas de 0 a 100 por critério, riscos de abandono (drop-off) e reescrita imediata do gancho.',
    icon: BarChart3,
    href: '/hypeon/analisador',
    status: 'active',
    statusBadge: 'Disponível',
    phase: 'Fase 3',
    highlight: 'Notas 0 a 100 em 8 critérios',
  },
  {
    id: 'cenas',
    title: 'Fábrica de Cenas',
    subtitle: 'Ganchos em lote para testes A/B',
    description:
      'Multiplique 1 roteiro base em 10 variações de ganchos visuais para encontrar o campeão de vendas.',
    icon: Clapperboard,
    href: '/hypeon/cenas',
    status: 'planned',
    statusBadge: 'Em desenvolvimento',
    phase: 'Fase 4',
  },
  {
    id: 'tendencias',
    title: 'Tendências por Nicho',
    subtitle: 'Mapeamento das 8 categorias',
    description:
      'Descubra padrões estéticos, músicas em alta e formatos vencedores específicos do seu segmento.',
    icon: TrendingUp,
    href: '/hypeon/tendencias',
    status: 'active',
    statusBadge: 'Ativo',
    phase: 'Fase 1',
    highlight: '8 Nichos Mapeados',
  },
  {
    id: 'biblioteca',
    title: 'Biblioteca Viral',
    subtitle: 'Suas referências organizadas',
    description:
      'Salve referências do Radar com 1 clique para organizar seu banco pessoal de roteiros e ideias.',
    icon: Bookmark,
    href: '/hypeon/biblioteca',
    status: 'active',
    statusBadge: 'Ativo',
    phase: 'Fase 2',
    highlight: 'Sincronizado na Nuvem',
  },
]

export const HypeonDashboard: React.FC = () => {
  useEffect(() => {
    document.title = 'HYPEON — Inteligência Viral | Prompts Virais'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'HYPEON: Núcleo de Inteligência Viral do Prompts Virais. Radar de tendências reais, 8 ferramentas de alta retenção para criadores e afiliados.',
      )
    }
  }, [])

  return (
    <HypeonLayout>
      <div className="space-y-8">
        {/* Hero do HYPEON */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-purple-500/30 bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Núcleo HYPEON • Inteligência Viral</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              O próximo viral{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                começa aqui.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Transforme a criação de conteúdo em ciência. O HYPEON reúne ferramentas de dados
              reais, engenharia reversa e inteligência de retenção para criadores, afiliados e
              marcas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/hypeon/radar">
                <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-bold h-11 px-5 rounded-xl shadow-lg shadow-purple-600/30 gap-2">
                  <Radio className="w-4 h-4 text-white" />
                  <span>Acessar Radar Viral</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/hypeon/tendencias">
                <Button
                  variant="outline"
                  className="border-purple-500/40 text-slate-200 hover:bg-purple-500/10 hover:text-white font-semibold h-11 px-4 rounded-xl"
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Ver Tendências por Nicho</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Status das Ferramentas: 8 Cards */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Central de Ferramentas HYPEON</span>
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-xs font-mono"
                >
                  8 Módulos
                </Badge>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Ferramentas ativas disponíveis para uso imediato e próximas etapas em implementação.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {HYPEON_TOOLS.map((tool) => {
              const Icon = tool.icon
              const isActive = tool.status === 'active'

              return (
                <Card
                  key={tool.id}
                  className={`relative overflow-hidden rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-slate-900/90 hover:bg-slate-900 border-purple-500/40 hover:border-purple-500/70 shadow-lg shadow-purple-950/30 group'
                      : 'bg-slate-950/70 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <CardHeader className="p-5 pb-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                            isActive
                              ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                            <span>{tool.title}</span>
                          </CardTitle>
                          <p className="text-xs text-slate-400 font-medium">{tool.subtitle}</p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 shrink-0 ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {tool.statusBadge}
                      </Badge>
                    </div>

                    <CardDescription className="text-xs text-slate-300 leading-relaxed pt-1">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-2 flex items-center justify-between gap-3 border-t border-slate-800/60 bg-slate-950/30 text-xs">
                    <div className="flex items-center gap-2">
                      {tool.highlight ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          {tool.highlight}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          Próxima Fase ({tool.phase})
                        </span>
                      )}
                    </div>

                    <Link to={tool.href}>
                      <Button
                        size="sm"
                        variant={isActive ? 'default' : 'secondary'}
                        className={`text-xs font-bold h-9 px-3.5 rounded-xl gap-1.5 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        <span>{isActive ? 'Abrir Módulo' : 'Ver Detalhes'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </HypeonLayout>
  )
}
export default HypeonDashboard
