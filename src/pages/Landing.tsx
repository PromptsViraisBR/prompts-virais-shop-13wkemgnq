import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPrompts } from '@/services/prompts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sparkles,
  Video,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Crown,
  Wand2,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Eye,
  Star,
  Users,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, STYLE_LABELS } from '@/types'

export const Landing: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [samplePrompts, setSamplePrompts] = useState<PromptRecord[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    // Carrega exatamente 3 prompts com ganchos fortes como amostra grátis para visitantes / vitrine
    const strongHookIds = ['3pp1iid3x7gx6bv', 'gudc14e8frah6e1', 'ssbe8ohn75zzp6t']

    getPrompts({ isFreeOnly: true })
      .then((records) => {
        // Tenta priorizar os 3 ganchos mais fortes fixos, completando com os primeiros caso algum falte
        const selected: PromptRecord[] = []
        strongHookIds.forEach((id) => {
          const found = records.find((r) => r.id === id)
          if (found) selected.push(found)
        })

        // Se por ventura faltar algum, completa com os outros
        if (selected.length < 3) {
          records.forEach((r) => {
            if (selected.length < 3 && !selected.some((s) => s.id === r.id)) {
              selected.push(r)
            }
          })
        }

        setSamplePrompts(selected.slice(0, 3))
      })
      .catch((err) => console.warn('Erro ao carregar exemplos:', err))
  }, [])

  const handleCopy = (e: React.MouseEvent, prompt: PromptRecord) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt.prompt_text)
    setCopiedId(prompt.id)
    toast({
      title: 'Prompt copiado com sucesso! 📋',
      description: 'Cole e use direto no seu vídeo do TikTok Shop ou Shopee.',
    })
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b bg-gradient-to-b from-pink-500/5 via-amber-500/5 to-background">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Roteiros de Alta Conversão para TikTok Shop & Shopee
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Venda até 10x mais roupas com{' '}
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Prompts de Roteiros Virais
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Acesso ilimitado a roteiros prontos em estilo <strong>POV (Primeira Pessoa)</strong> e
            com <strong>Modelo vestindo a peça</strong>. Copie ganchos que prendem a atenção nos
            primeiros 3 segundos e geram cliques imediatos no carrinho da sua vitrine.
          </p>

          {/* Ações Hero com destaque principal para o Gerador de Prompt personalizado */}
          <div className="space-y-4 pt-4">
            {/* Super CTA chamativo: Gerador de Prompts sob medida para a peça que o lojista quer vender */}
            <div className="flex justify-center">
              <Link to="/gerador" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-7 sm:py-8 text-base sm:text-lg font-black bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:via-rose-400 hover:to-amber-400 text-white shadow-2xl shadow-pink-500/40 ring-4 ring-pink-500/20 hover:ring-pink-500/40 hover:scale-[1.03] active:scale-[0.99] transition-all duration-200 rounded-2xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  <div className="flex items-center justify-center gap-3">
                    <span className="p-1.5 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner">
                      <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    </span>
                    <div className="text-left leading-tight">
                      <span className="block text-sm sm:text-base font-extrabold tracking-wide">
                        ✨ Gerar o Prompt da Minha Roupa (Grátis)
                      </span>
                      <span className="block text-[11px] sm:text-xs font-medium text-white/90">
                        Crie um roteiro viral sob medida para o que você quer vender hoje
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1 shrink-0" />
                  </div>
                </Button>
              </Link>
            </div>

            {/* CTAs Secundários Harmonizados: Assinatura e Biblioteca Pronta */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/planos" className="w-full sm:w-auto">
                <Button
                  size="default"
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-5 text-sm font-bold border-pink-500/40 text-foreground hover:bg-pink-500/10 hover:border-pink-500"
                >
                  <Crown className="w-4 h-4 mr-2 text-amber-500" />
                  Assinar e Liberar Todos os Prompts
                </Button>
              </Link>

              <Link to="/biblioteca" className="w-full sm:w-auto">
                <Button
                  size="default"
                  variant="ghost"
                  className="w-full sm:w-auto px-6 py-5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ShoppingBag className="w-4 h-4 mr-2 text-pink-500" />
                  Explorar Prompts Prontos na Biblioteca
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ganchos validados para retenção</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Específico para Moda & Roupas</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Gerador para o seu catálogo próprio</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXEMPLOS DE PROMPTS AO VIVO — 3 AMOSTRAS GRÁTIS COM GANCHOS FORTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Amostra Gratuita da Vitrine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            3 Roteiros com Ganchos Fortes Liberados
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Copie gratuitamente esses 3 roteiros abaixo para testar nos seus vídeos. Para acessar
            todos os 40+ roteiros da biblioteca e o gerador inteligente com fotos, crie sua conta
            grátis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samplePrompts.map((prompt, idx) => (
            <Card
              key={prompt.id}
              className="flex flex-col justify-between border-2 border-pink-500/20 hover:border-pink-500/50 transition-all hover:shadow-xl rounded-2xl bg-card overflow-hidden group"
            >
              <CardHeader className="space-y-2.5 pb-3 bg-muted/20 border-b">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {NICHE_LABELS[prompt.niche] || prompt.niche}
                  </Badge>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                    Amostra Grátis #{idx + 1}
                  </Badge>
                </div>
                {/* Gancho Forte em Destaque no Título com Emoji */}
                <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2">
                  🎯 "{prompt.hook || prompt.title}"
                </CardTitle>
                <CardDescription className="line-clamp-1 text-xs font-medium text-muted-foreground">
                  Peça: {prompt.title}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3.5 py-4 flex-1">
                {/* Roteiro quase completo ou completo visível */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider block">
                    📜 Estrutura do Roteiro Cena a Cena
                  </span>
                  <div className="p-3 rounded-xl bg-muted/40 border font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto text-foreground whitespace-pre-wrap select-all">
                    {prompt.prompt_text}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-pink-500" />
                    <span>{STYLE_LABELS[prompt.style] || prompt.style}</span>
                  </div>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    ✓ Cópia liberada mesmo deslogado
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-4 border-t flex items-center justify-between bg-muted/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto font-medium"
                  onClick={() => navigate(`/prompt/${prompt.id}`)}
                >
                  Ver Detalhes →
                </Button>
                <Button
                  size="sm"
                  className="text-xs gap-1.5 bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold shadow-xs hover:opacity-95"
                  onClick={(e) => handleCopy(e, prompt)}
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copiado! 🎉
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Amostra Grátis
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Abaixo dos 3 Cards de Amostra */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              Gostou dos ganchos? Desbloqueie todos os outros 40+ roteiros!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {user
                ? 'Você já está conectado. Acesse a biblioteca completa e aproveite!'
                : 'Crie sua conta grátis em menos de 30 segundos para explorar a biblioteca e o gerador com fotos.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!user ? (
              <>
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold py-5 px-5 shadow-md">
                    Criar Conta Grátis
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="font-semibold py-5">
                    Fazer Login
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/biblioteca">
                <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold py-5 px-5">
                  Ir para a Biblioteca Completa
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA: 3 PASSOS SIMPLES */}
      <section className="bg-muted/30 border-y py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Como funciona o fluxo do sucesso
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Você não precisa ser especialista em edição nem passar horas pensando no que falar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border bg-background space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 font-extrabold flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-lg">Escolha ou Gere o Prompt</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Acesse a biblioteca por nicho (Moda Feminina, Perfumes & Cosméticos, Streetwear,
                Fitness) ou informe a peça exata do seu catálogo no Gerador Inteligente.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-background space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 font-extrabold flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-lg">Grave em Estilo POV ou Modelo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Siga a orientação de cenas: ângulo no espelho, detalhes de tecido com as mãos ou
                modelo caminhando na rua com a roupa.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-background space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 font-extrabold flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-lg">Publique com Link na Vitrine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use a chamada final para direcionar os espectadores ao carrinho amarelo do TikTok
                Shop ou sacolinha da Shopee e veja as vendas entrarem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS RESUMIDOS NA LANDING */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge
            variant="outline"
            className="text-amber-600 border-amber-500/30 text-xs font-semibold uppercase"
          >
            Investimento
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Planos acessíveis que se pagam na primeira venda
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Cancele a qualquer momento. Fluxo demonstrativo nesta primeira versão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
          {/* MENSAL PRO */}
          <Card className="flex flex-col justify-between border-2 border-pink-500 shadow-xl relative">
            <div className="absolute -top-3 left-6">
              <Badge className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow animate-pulse">
                🔥 OFERTA DE LANÇAMENTO
              </Badge>
            </div>
            <CardHeader className="pt-6">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Plano PRO</span>
                <Badge className="bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30 text-[10px] font-bold">
                  Com Upload de Fotos
                </Badge>
              </CardTitle>
              <CardDescription>
                Acesso total com gerador personalizado para fotos do catálogo da sua vitrine.
              </CardDescription>
              <div className="pt-2 space-y-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-lg font-semibold text-muted-foreground line-through decoration-rose-500 decoration-2 opacity-80">
                    R$ 49,90
                  </span>
                  <span className="text-4xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                    R$ 19,90
                  </span>
                  <span className="text-muted-foreground text-sm font-bold"> /mês</span>
                </div>
                <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                  Preço promocional por tempo limitado — para os primeiros assinantes do site
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Cobrança mensal, sem fidelidade • Cancele quando quiser
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2 bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
                <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                <span className="font-semibold text-xs text-pink-950 dark:text-pink-200">
                  Gerador inteligente com upload de até 3 fotos da peça
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Biblioteca de prompts 100% liberada (40+ roteiros)</span>{' '}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Personalize qualquer prompt pré-pronto com fotos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Estilos POV, Modelo e Unboxing ASMR</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/planos" className="w-full">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold py-5">
                  Assinar PRO (R$ 19,90/mês)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* ANUAL */}
          <Card className="flex flex-col justify-between border-2 hover:border-amber-500 transition-colors">
            <CardHeader className="pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Anual VIP</CardTitle>
                <Badge className="bg-amber-500 text-white text-xs font-bold">12 Meses VIP</Badge>
              </div>
              <CardDescription>Para lojas e afiliados com visão de longo prazo.</CardDescription>
              <div className="pt-2 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">R$ 19,90</span>
                  <span className="text-muted-foreground text-sm font-medium"> /mês</span>
                </div>
                <p className="text-xs text-amber-600 font-bold">
                  Faturado anualmente: R$ 238,80/ano
                </p>
                <p className="text-[11px] text-muted-foreground">
                  12 meses de acesso contínuo com suporte prioritário
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-semibold text-xs text-amber-950 dark:text-amber-200">
                  Tudo do PRO: biblioteca completa + gerador com fotos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Economia de mais de R$ 360 no comparativo anual</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Fila prioritária para geração com IA</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/planos" className="w-full">
                <Button
                  variant="outline"
                  className="w-full font-bold py-5 border-amber-500 text-foreground hover:bg-amber-500 hover:text-white"
                >
                  Assinar Anual VIP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA FINAL DE CONVERSÃO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl shadow-pink-500/25">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Pronto para transformar sua vitrine em uma máquina de vendas?
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Pare de postar vídeos que ninguém assiste até o final. Use roteiros com ganchos
            comprovados para o TikTok Shop e Shopee.
          </p>
          <div className="pt-2">
            <Link to="/planos">
              <Button
                size="lg"
                className="bg-white text-pink-600 hover:bg-white/90 font-extrabold px-8 py-6 text-base shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                Começar Agora Mesmo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
