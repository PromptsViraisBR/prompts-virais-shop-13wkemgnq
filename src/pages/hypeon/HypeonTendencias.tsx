import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { RADAR_NICHES } from '@/pages/hypeon/HypeonRadar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Flame, Radio, ArrowRight, Sparkles, Layers, Video, Filter } from 'lucide-react'

const NICHE_TRENDS = [
  {
    id: 'historias',
    niche: 'Histórias & Relatos',
    growth: '+42% este mês',
    dominantStyle: 'POV Narrado com cortes visuais dinâmicos',
    hotAudio: 'Trilhas cinematográficas lentas + transições dramáticas',
    tip: 'O gancho nos primeiros 2 segundos precisa anunciar o clímax ("Não acreditei quando li aquilo...").',
    link: '/nichos',
  },
  {
    id: 'curiosidades',
    niche: 'Curiosidades & Fatos',
    growth: '+38% este mês',
    dominantStyle: 'Unboxing visual / Zoom dramático em objetos',
    hotAudio: 'Vozes sintéticas realistas com pausas estratégicas',
    tip: 'Faça perguntas contra-intuitivas ("Por que quase ninguém sabe disso?").',
    link: '/nichos',
  },
  {
    id: 'terror',
    niche: 'Terror & Suspense',
    growth: '+29% este mês',
    dominantStyle: 'Câmera escura, efeito VHS, iluminação pontual',
    hotAudio: 'Sons graves contínuos (drones) e ruídos de passos',
    tip: 'O susto ou revelação não deve passar de 7 segundos de espera.',
    link: '/nichos',
  },
  {
    id: 'suspense',
    niche: 'Suspense & Mistério',
    growth: '+33% este mês',
    dominantStyle: 'Loop narrativo aberto com revelação final nos últimos 3s',
    hotAudio: 'Batimento cardíaco acelerando + silêncio repentino antes do susto',
    tip: 'Nunca entregue a resposta da pergunta antes de 80% do vídeo rodar.',
    link: '/nichos',
  },
  {
    id: 'humor',
    niche: 'Comédia & Humor',
    growth: '+35% este mês',
    dominantStyle: 'Interpretação rápida de dois personagens com cortes secos',
    hotAudio: 'Áudios virais dublados em sincronia labial',
    tip: 'O texto na tela precisa antecipar a quebra de expectativa.',
    link: '/nichos',
  },
  {
    id: 'ia',
    niche: 'Inteligência Artificial & Tech',
    growth: '+62% este mês',
    dominantStyle: 'Gravação de tela acelerada + rosto em miniatura reagindo',
    hotAudio: 'Música eletrônica lo-fi dinâmica sem vocais',
    tip: 'Mostre o resultado final impressionante já nos primeiros 1.5 segundo.',
    link: '/gerador',
  },
  {
    id: 'animacoes',
    niche: 'Animações & Arte 3D',
    growth: '+47% este mês',
    dominantStyle: 'Cenas 3D hiper-realistas intercaladas com zoom in/out',
    hotAudio: 'Sonoplastia detalhada (foley) com passos e estalos',
    tip: 'Cada transição de cena precisa coincidir com o compasso da música.',
    link: '/nichos',
  },
  {
    id: 'personagens',
    niche: 'Personagens Humanizados',
    growth: '+58% este mês',
    dominantStyle: 'Objetos ou animais falando com voz humana e sotaque regional',
    hotAudio: 'Diálogos sarcásticos com pausas para risada mental',
    tip: 'Crie uma personalidade marcante recorrente para gerar comunidade.',
    link: '/hypeon/stories',
  },
  {
    id: 'animais',
    niche: 'Animais & Pets',
    growth: '+40% este mês',
    dominantStyle: 'POV do pet com pensamentos legendados em fontes coloridas',
    hotAudio: 'Voz fina cômica ou narração séria estilo documentário',
    tip: 'Gere empatia imediata mostrando o dilema do animal no primeiro frame.',
    link: '/nichos',
  },
  {
    id: 'relacionamentos',
    niche: 'Relacionamentos & Comportamento',
    growth: '+39% este mês',
    dominantStyle: 'Prints de conversas encenadas com narração expressiva',
    hotAudio: 'Trilha suave melancólica ou comédia romântica',
    tip: 'Use perguntas polarizadoras ("Você aceitaria isso?") para inflamar os comentários.',
    link: '/nichos',
  },
  {
    id: 'motivacao',
    niche: 'Motivação & Desenvolvimento Pessoal',
    growth: '+31% este mês',
    dominantStyle: 'Cenas estéticas em academia/trabalho com tipografia bold central',
    hotAudio: 'Discursos de impacto gravados com sub-bass e piano épico',
    tip: 'Corte imediatamente qualquer frase que pareça clichê sem ação prática.',
    link: '/nichos',
  },
  {
    id: 'conhecimento',
    niche: 'Conhecimento & Educação Prática',
    growth: '+45% este mês',
    dominantStyle: 'Micro-aulas com 3 tópicos numerados em até 45 segundos',
    hotAudio: 'Trilhas neutras que não competem com a voz do narrador',
    tip: 'Entregue o valor logo de cara: "3 coisas que mudaram minha produtividade".',
    link: '/nichos',
  },
  {
    id: 'experimentos',
    niche: 'Experimentos & Desafios',
    growth: '+48% este mês',
    dominantStyle: 'Câmera lenta nos momentos de colisão, mistura ou explosão controlada',
    hotAudio: 'Whooshes acentuados e som de impacto amplificado',
    tip: 'Mostre o aviso "Não tente isso em casa" para aumentar a curiosidade.',
    link: '/nichos',
  },
  {
    id: 'satisfatorios',
    niche: 'Vídeos Satisfatórios & ASMR',
    growth: '+53% este mês',
    dominantStyle: 'Cortes perfeitos, prensas hidráulicas, restauração e sabonete cortado',
    hotAudio: 'Áudio binaural hiper-nítido sem nenhuma música de fundo',
    tip: 'A iluminação suave e sem reflexos indesejados dobra o tempo de tela.',
    link: '/nichos',
  },
]

export const HypeonTendencias: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>('all')

  useEffect(() => {
    document.title = 'Tendências por Nicho — HYPEON | Prompts Virais'
  }, [])

  const filteredTrends =
    selectedNiche === 'all'
      ? NICHE_TRENDS
      : NICHE_TRENDS.filter(
          (t) => t.id === selectedNiche || t.niche.toLowerCase().includes(selectedNiche),
        )

  return (
    <HypeonLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Tendências por Nicho</h1>
              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-[10px] font-mono"
              >
                Mapeamento Contínuo
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Padrões estéticos, áudios e estruturas de retenção validadas por segmento de mercado.
            </p>
          </div>

          <Link to="/hypeon/radar">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Ver Vídeos no Radar</span>
            </Button>
          </Link>
        </div>

        {/* BARRA DE CHIPS DE NICHOS COM QUEBRA (FLEX-WRAP) A PARTIR DE 320PX */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              Filtrar por Nicho ({RADAR_NICHES.length} opções disponíveis)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Exibindo {filteredTrends.length} card(s)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {RADAR_NICHES.map((n) => {
              const isSelected = selectedNiche === n.id
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNiche(n.id)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTrends.map((t, idx) => (
            <Card
              key={idx}
              className="rounded-2xl bg-slate-900/90 border-slate-800 hover:border-purple-500/40 transition-all p-5 space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-300 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <h3 className="font-bold text-white text-sm">{t.niche}</h3>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                  {t.growth}
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Formato Vencedor:
                  </span>
                  <p className="text-slate-200 font-medium">{t.dominantStyle}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Áudio & Trilha:
                  </span>
                  <p className="text-slate-300">{t.hotAudio}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-purple-300 space-y-0.5">
                  <span className="font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Dica de Retenção:
                  </span>
                  <p>{t.tip}</p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <Link to="/gerador">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-purple-400 hover:text-purple-300 px-2 h-8"
                  >
                    Gerar Roteiro Deste Nicho →
                  </Button>
                </Link>
                <Link to={t.link}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-slate-800 text-slate-300 hover:text-white h-8 px-3 rounded-lg"
                  >
                    Ver Prompts
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </HypeonLayout>
  )
}
export default HypeonTendencias
