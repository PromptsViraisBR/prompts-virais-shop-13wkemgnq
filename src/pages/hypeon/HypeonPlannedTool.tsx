import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Copy,
  BookOpen,
  Lightbulb,
  BarChart3,
  Clapperboard,
  Sparkles,
  ArrowRight,
  Clock,
  Radio,
  CheckCircle2,
} from 'lucide-react'

interface PlannedToolProps {
  toolId: 'clonador' | 'stories' | 'ideas' | 'analisador' | 'cenas'
}

const TOOLS_METADATA = {
  clonador: {
    title: 'Clonador de Estruturas',
    subtitle: 'Engenharia reversa inteligente de vídeos de alta performance',
    icon: Copy,
    phase: 'Fase 3',
    description:
      'Cole a URL de um vídeo do TikTok, Reels ou Shorts para que a inteligência do HYPEON desmonte a anatomia completa do conteúdo.',
    features: [
      'Transcrição automática do áudio com marcação de segundos',
      'Identificação do gancho exato (primeiros 3 segundos)',
      'Detecção de pontes psicológicas e transições visuais',
      'Exportação de roteiro pronto adaptado para a sua marca ou produto',
    ],
  },
  stories: {
    title: 'Gerador de Stories',
    subtitle: 'Sequências diárias calibradas para conversão e engajamento',
    icon: BookOpen,
    phase: 'Fase 3',
    description:
      'Elimine o bloqueio criativo com narrativas prontas de 3 a 5 stories em sequência lógica para prender visualizações até o final.',
    features: [
      'Estrutura Story 1: Gancho de curiosidade com enquete ou caixa',
      'Estrutura Story 2: Quebra de objeção ou bastidor autêntico',
      'Estrutura Story 3: Apresentação da solução ou produto',
      'Estrutura Story 4-5: Chamada direta para o Direct ou Link na Bio',
    ],
  },
  ideas: {
    title: 'Banco de Ideias IA',
    subtitle: 'Ideias infinitas baseadas no seu nicho e público-alvo',
    icon: Lightbulb,
    phase: 'Fase 4',
    description:
      'Mecanismo de brainstorming generativo treinado nos padrões de vídeos mais compartilhados das principais redes.',
    features: [
      'Ângulos contra-intuitivos para fugir do conteúdo clichê',
      'Variação de formatos: POV, Tutorial rápido, Desafio, Lista',
      'Filtro por objetivo: Alcance, Engajamento ou Venda imediata',
      'Envio direto com 1 clique para o Gerador de Prompts do PV',
    ],
  },
  analisador: {
    title: 'Analisador de Retenção',
    subtitle: 'Diagnóstico preditivo do seu roteiro antes de gravar',
    icon: BarChart3,
    phase: 'Fase 4',
    description:
      'Cole o texto do seu roteiro antes de ligar a câmera e receba um relatório com nota de retenção e pontos cegos.',
    features: [
      'Nota de força do gancho inicial (0 a 100)',
      'Alerta de enrolação ou palavras lentas nos primeiros segundos',
      'Sugestões de palavras-gatilho de alto impacto',
      'Recomendação de tempo ideal para a chamada de ação',
    ],
  },
  cenas: {
    title: 'Fábrica de Cenas',
    subtitle: 'Criação de ganchos em lote para testes A/B escaláveis',
    icon: Clapperboard,
    phase: 'Fase 4',
    description:
      'O segredo dos grandes canais é testar múltiplos ganchos para o mesmo miolo de vídeo. A Fábrica de Cenas automatiza esse processo.',
    features: [
      'Gere 10 ganchos alternativos para o mesmo produto com 1 clique',
      'Estilos variados: Pergunta provocativa, Choque visual, História rápida',
      'Roteiros prontos para exportar ou gravar no mesmo dia',
      'Otimizado para anúncios pagos e tráfego orgânico',
    ],
  },
}

export const HypeonPlannedTool: React.FC<PlannedToolProps> = ({ toolId }) => {
  const meta = TOOLS_METADATA[toolId]
  const Icon = meta.icon

  useEffect(() => {
    document.title = `${meta.title} — HYPEON | Prompts Virais`
  }, [meta.title])

  return (
    <HypeonLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{meta.title}</h1>
              <Badge
                variant="outline"
                className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px] font-mono"
              >
                {meta.phase} • Em Desenvolvimento
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">{meta.subtitle}</p>
          </div>
        </div>

        <Card className="rounded-3xl bg-slate-900/80 border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Funcionalidade Estratégica do HYPEON</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {meta.description}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              O que este módulo trará para a plataforma:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meta.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-white text-xs sm:text-sm">
                Enquanto este módulo finaliza:
              </span>
              <p className="text-xs text-slate-400">
                Aproveite o Radar Viral e os geradores de roteiros já liberados na plataforma.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/hypeon/radar">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Abrir Radar</span>
                </Button>
              </Link>
              <Link to="/gerador">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-800 text-slate-300 hover:text-white h-9 px-3 rounded-xl text-xs"
                >
                  Ir ao Gerador
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </HypeonLayout>
  )
}
export default HypeonPlannedTool
