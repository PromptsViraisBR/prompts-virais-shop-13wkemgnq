import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ExternalLink,
  Sparkles,
  ArrowDownCircle,
  Wand2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

interface ToolCard {
  name: string
  provider: string
  url: string
  badge: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  emoji: string
  tagline: string
  description: string
  highlights: string[]
  recommendedFor: string
  buttonText: string
  gradient: string
  buttonClass: string
}

const EXTERNAL_TOOLS: ToolCard[] = [
  {
    name: 'ChatGPT',
    provider: 'OpenAI',
    url: 'https://chatgpt.com',
    badge: 'Grátis no plano Free',
    emoji: '🤖',
    tagline: 'Gere a imagem descrevendo sua ideia em texto puro',
    description:
      'Abra o chat e peça qualquer cena viral (ex: "Crie uma imagem 9:16 fotorrealista de um abacate musculoso na academia"). É rápido, criativo e gratuito com cotas diárias.',
    highlights: [
      'Geração direta por texto em linguagem natural',
      'Excelente para ideias conceituais e personagens 3D',
      'Conta gratuita disponível sem necessidade de cartão',
    ],
    recommendedFor: 'Ideal para criar personagens do zero com descrição detalhada',
    buttonText: 'Criar no ChatGPT',
    gradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/30',
    buttonClass:
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm',
  },
  {
    name: 'Google Flow / Gemini',
    provider: 'Nano Banana (Google Labs)',
    url: 'https://labs.google/flow',
    badge: 'Google Labs • Nano Banana',
    emoji: '🍌',
    tagline: 'Nano Banana com alta fidelidade e consistência',
    description:
      'Acesse o Google Flow ou o Gemini para experimentar a tecnologia Nano Banana do Google. Perfeito para manter a fidelidade visual, iluminação natural e realismo cinematográfico.',
    highlights: [
      'Tecnologia Nano Banana do Google Labs',
      'Também disponível via Gemini (gemini.google.com)',
      'Acesso gratuito para contas Google conectadas',
    ],
    recommendedFor: 'Perfeito para fotos fotorrealistas e fidelidade estética',
    buttonText: 'Acessar Google Flow',
    gradient: 'from-amber-500/10 via-orange-500/10 to-pink-500/10 border-amber-500/30',
    buttonClass:
      'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white hover:opacity-95 shadow-sm',
  },
  {
    name: 'Bing Image Creator',
    provider: 'Microsoft Designer',
    url: 'https://www.bing.com/images/create',
    badge: '100% Gratuito',
    emoji: '🎨',
    tagline: 'Impulsionado por DALL-E 3 com boosts diários',
    description:
      'Ferramenta gratuita da Microsoft vinculada a qualquer conta Hotmail/Outlook. Cria imagens em segundos a partir de prompts em português, com 15 a 25 boosts rápidos todo dia.',
    highlights: [
      'Geração gratuita com conta Microsoft pessoal',
      'Entende perfeitamente prompts em português',
      'Opção extra confiável sem filas de espera',
    ],
    recommendedFor: 'Ótima alternativa rápida com créditos que recarregam todo dia',
    buttonText: 'Criar no Bing Creator',
    gradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-500/30',
    buttonClass:
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm',
  },
]

export const ExternalImageToolsCard: React.FC = () => {
  const scrollToGenerator = () => {
    const el =
      document.getElementById('gerador-prompt-imagem') || document.getElementById('gerador-viral')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 p-5 sm:p-8 shadow-md">
      {/* Topo do Bloco */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/20 pb-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              FERRAMENTAS GRATUITAS
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              ✨ Crie Grátis Externa & Volte Aqui
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Quer criar a imagem do seu vídeo?</span>
            <span className="text-2xl">🎬🎨</span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Para economizar e ter liberdade total, indicamos as melhores ferramentas gratuitas da
            internet. Você cria a imagem por lá sem pagar nada e depois{' '}
            <strong className="text-foreground font-bold">
              volta aqui para gerar o roteiro viral de ~60s
            </strong>{' '}
            (dividido em 6 cenas de 10s prontas para renderizar).
          </p>
        </div>

        {/* CTA rápido para navegar entre os blocos */}
        <div className="shrink-0 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            onClick={() => {
              const el = document.getElementById('gerador-prompt-imagem')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="outline"
            className="w-full sm:w-auto text-xs font-bold rounded-2xl border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 gap-1.5 h-10 shadow-xs"
          >
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span>✍️ Criar Prompt para Imagem</span>
          </Button>
          <Button
            type="button"
            onClick={() => {
              const el = document.getElementById('gerador-viral')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="outline"
            className="w-full sm:w-auto text-xs font-bold rounded-2xl border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 gap-1.5 h-10 shadow-xs"
          >
            <ArrowDownCircle className="w-4 h-4 text-pink-500" />
            <span>Já tenho a imagem → Criar Roteiro</span>
          </Button>
        </div>
      </div>

      {/* Grid de Ferramentas Indicadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {EXTERNAL_TOOLS.map((tool) => (
          <Card
            key={tool.name}
            className={`border rounded-3xl bg-card/95 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-500/50 relative overflow-hidden`}
          >
            <div className={`p-5 space-y-4 flex-1`}>
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-muted/60 border flex items-center justify-center text-2xl shadow-xs shrink-0">
                    {tool.emoji}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-foreground leading-tight">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] font-medium text-muted-foreground">{tool.provider}</p>
                  </div>
                </div>

                <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 text-[10px] font-bold shrink-0">
                  {tool.badge}
                </Badge>
              </div>

              {/* Tagline */}
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-[11px] font-semibold text-foreground">
                {tool.tagline}
              </div>

              {/* Descrição */}
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>

              {/* Lista de destaques */}
              <div className="space-y-1.5 pt-1">
                {tool.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <span className="leading-tight">{h}</span>
                  </div>
                ))}
              </div>

              {/* Dica extra de Gemini no card Flow */}
              {tool.name.includes('Flow') && (
                <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  💡 Dica extra: você também pode usar{' '}
                  <a
                    href="https://gemini.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 inline-flex items-center gap-0.5"
                  >
                    gemini.google.com
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  com a sua conta Google.
                </p>
              )}
            </div>

            {/* Rodapé com Botão Externo */}
            <div className="p-5 pt-0 border-t border-border/40 bg-muted/15 flex flex-col gap-2 mt-auto">
              <div className="text-[10px] text-muted-foreground italic line-clamp-1 pt-3">
                🎯 {tool.recommendedFor}
              </div>

              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block"
              >
                <Button
                  type="button"
                  className={`w-full py-5 rounded-2xl font-bold text-xs gap-2 ${tool.buttonClass}`}
                >
                  <span>{tool.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Passo a passo explicativo: Criou lá → Volta aqui */}
      <div className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm">
            💡
          </div>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span>Como funciona o fluxo recomendado:</span>
            </p>
            <p className="leading-relaxed">
              <strong>1.</strong> Acesse uma das ferramentas acima e gere sua imagem grátis. &nbsp;
              <strong>2.</strong> Salve a imagem no seu celular ou computador. &nbsp;
              <strong>3.</strong> Suba a imagem no{' '}
              <strong className="text-pink-600 dark:text-pink-400">
                Gerador de Roteiro Viral logo abaixo
              </strong>{' '}
              para criar a cena e as 6 partes de 10s!
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={scrollToGenerator}
          className="shrink-0 w-full md:w-auto bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md gap-1.5 hover:scale-[1.02] transition-transform"
        >
          <span>Ir para o Gerador de Roteiro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default ExternalImageToolsCard
