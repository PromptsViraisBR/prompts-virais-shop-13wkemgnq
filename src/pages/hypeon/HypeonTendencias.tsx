import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Flame, Radio, ArrowRight, Sparkles, Layers, Video } from 'lucide-react'

const NICHE_TRENDS = [
  {
    niche: 'Histórias & Relatos',
    growth: '+42% este mês',
    dominantStyle: 'POV Narrado com cortes visuais dinâmicos',
    hotAudio: 'Trilhas cinematográficas lentas + transições dramáticas',
    tip: 'O gancho nos primeiros 2 segundos precisa anunciar o clímax ("Não acreditei quando li aquilo...").',
    link: '/nichos',
  },
  {
    niche: 'Curiosidades & Fatos',
    growth: '+38% este mês',
    dominantStyle: 'Unboxing visual / Zoom dramático em objetos',
    hotAudio: 'Vozes sintéticas realistas com pausas estratégicas',
    tip: 'Faça perguntas contra-intuitivas ("Por que quase ninguém sabe disso?").',
    link: '/nichos',
  },
  {
    niche: 'Terror & Suspense',
    growth: '+29% este mês',
    dominantStyle: 'Câmera escura, efeito VHS, iluminação pontual',
    hotAudio: 'Sons graves contínuos (drones) e ruídos de passos',
    tip: 'O susto ou revelação não deve passar de 7 segundos de espera.',
    link: '/nichos',
  },
  {
    niche: 'Comédia & Humor',
    growth: '+35% este mês',
    dominantStyle: 'Interpretação rápida de dois personagens com cortes secos',
    hotAudio: 'Áudios virais dublados em sincronia labial',
    tip: 'O texto na tela precisa antecipar a quebra de expectativa.',
    link: '/nichos',
  },
  {
    niche: 'Moda Feminina & Achadinhos',
    growth: '+51% este mês',
    dominantStyle: 'Provador dinâmico, caimento real sem filtro exagerado',
    hotAudio: 'Pop instrumental acelerado + som de sacola abrindo',
    tip: 'Aponte o dedo diretamente para onde o carrinho amarelo fica no TikTok.',
    link: '/biblioteca',
  },
  {
    niche: 'Perfumes & Cosméticos',
    growth: '+44% este mês',
    dominantStyle: 'Spray em câmera lenta, ASMR da tampa e frasco',
    hotAudio: 'Sons sensoriais nítidos (vidro, borrifador)',
    tip: 'Descreva a sensação olfativa com metáforas ("cheiro de quem tem a vida ganha").',
    link: '/nichos',
  },
]

export const HypeonTendencias: React.FC = () => {
  useEffect(() => {
    document.title = 'Tendências por Nicho — HYPEON | Prompts Virais'
  }, [])

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {NICHE_TRENDS.map((t, idx) => (
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
