import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPrompts } from '@/services/prompts'
import { trackFunnelEvent } from '@/services/events'
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
  ShieldCheck,
  Lock,
  Zap,
  HelpCircle,
  MessageSquarePlus,
  Mail,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'
import { FeedbackModal } from '@/components/FeedbackModal'
import { toast as sonnerToast } from 'sonner'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, STYLE_LABELS } from '@/types'

export const Landing: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [samplePrompts, setSamplePrompts] = useState<PromptRecord[]>([])
  const [premiumTeasers, setPremiumTeasers] = useState<PromptRecord[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  useEffect(() => {
    // Registrar evento de visita de página (Landing)
    trackFunnelEvent('page_view', { page: 'landing' })

    // Carrega prompts gratuitos e alguns premium para a "espiada" borrada
    getPrompts({ isFreeOnly: true })
      .then((records) => {
        const strongHookIds = ['3pp1iid3x7gx6bv', 'gudc14e8frah6e1', 'ssbe8ohn75zzp6t']
        const selected: PromptRecord[] = []
        strongHookIds.forEach((id) => {
          const found = records.find((r) => r.id === id)
          if (found) selected.push(found)
        })

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

    // Carregar biblioteca para espiada premium
    getPrompts({ isPremiumOnly: true })
      .then((records) => {
        if (records && records.length > 0) {
          setPremiumTeasers(records.slice(0, 3))
        }
      })
      .catch(() => {
        // Fallback silencioso
      })
  }, [])

  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    // 1. Tenta API moderna navigator.clipboard se disponível e em contexto seguro
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        console.warn('[Landing] Falha no navigator.clipboard, tentando fallback...', err)
      }
    }

    // 2. Fallback universal resiliente usando textarea oculta + document.execCommand('copy')
    // Funciona mesmo em navegadores mobile restritos, webviews ou sem permissão direta de clipboard
    try {
      const activeEl =
        typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.width = '2em'
      textarea.style.height = '2em'
      textarea.style.padding = '0'
      textarea.style.border = 'none'
      textarea.style.outline = 'none'
      textarea.style.boxShadow = 'none'
      textarea.style.background = 'transparent'
      textarea.style.opacity = '0'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      if (typeof textarea.setSelectionRange === 'function') {
        try {
          textarea.setSelectionRange(0, textarea.value.length)
        } catch {
          // Ignora se o navegador restringir seleção em elemento readonly
        }
      }
      let successful = false
      try {
        successful = document.execCommand('copy')
      } catch (cmdErr) {
        console.warn('[Landing] execCommand copy falhou:', cmdErr)
      }
      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea)
      }
      if (activeEl && typeof activeEl.focus === 'function') {
        try {
          activeEl.focus()
        } catch {
          // Silencioso
        }
      }
      return successful
    } catch (fallbackErr) {
      console.warn('[Landing] Erro contido no fallback de cópia:', fallbackErr)
      return false
    }
  }

  const handleCopy = async (e: React.MouseEvent, prompt: PromptRecord) => {
    try {
      e.stopPropagation()
      e.preventDefault()

      const textToCopy = prompt?.prompt_text || ''
      if (!textToCopy) {
        try {
          sonnerToast.error('Texto não disponível', {
            description: 'Não foi possível carregar o roteiro para cópia.',
          })
        } catch {
          // Notificação opcional, não interrompe o fluxo
        }
        return
      }

      const ok = await copyTextToClipboard(textToCopy)

      // Atualiza o estado visual no próprio botão ("Copiado! 🎉")
      setCopiedId(prompt.id)
      setTimeout(() => setCopiedId(null), 2500)

      try {
        if (ok) {
          sonnerToast.success('Prompt copiado com sucesso! 📋', {
            description: 'Cole e use direto no seu vídeo do TikTok Shop ou Shopee.',
          })
        } else {
          sonnerToast.info('Prompt copiado! 📋', {
            description: 'Cole no seu editor ou selecione o texto acima.',
          })
        }
      } catch {
        // Notificação opcional, não interrompe o fluxo
      }
    } catch (err) {
      console.warn('[Landing] Exceção contida em handleCopy:', err)
      if (prompt?.id) {
        setCopiedId(prompt.id)
        setTimeout(() => setCopiedId(null), 2500)
      }
    }
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* BANNER INFORMATIVO DISCRETO & ELEGANTE: VERSÃO + APP NOVO + SUPORTE + FEEDBACK */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-amber-500/10 border border-pink-500/20 backdrop-blur-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-start sm:items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30 px-2 py-0"
                >
                  v0.0.61
                </Badge>
                <span className="font-bold text-foreground text-xs sm:text-sm">
                  O Prompts Virais é novo e estamos aperfeiçoando cada detalhe!
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Por ser uma plataforma recente, pequenos bugs podem acontecer. Caso encontre algo ou
                precise de suporte, conte com nosso time direto pelo e-mail{' '}
                <a
                  href="mailto:juniorrodriguesjr123.jr@gmail.com?subject=Suporte%20Prompts%20Virais%20v0.0.61"
                  className="font-semibold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center gap-1"
                >
                  juniorrodriguesjr123.jr@gmail.com
                </a>
                . Vamos resolver rapidinho!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => setFeedbackOpen(true)}
              className="text-xs h-8 gap-1.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold shadow-xs rounded-xl"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Dar Feedback / Ideias</span>
            </Button>
          </div>
        </div>
      </section>

      {/* HERO SECTION — MOBILE-FIRST & ALTA CONVERSÃO */}
      <section className="relative overflow-hidden pt-6 sm:pt-14 pb-14 sm:pb-20 px-3 xs:px-4 sm:px-6 lg:px-8 border-b bg-gradient-to-b from-pink-500/10 via-amber-500/5 to-background">
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider animate-in fade-in max-w-full">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Prompts Prontos para Vídeos Virais que Vendem</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15] break-words">
            Venda até 10x mais no TikTok Shop e Shopee com{' '}
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Roteiros que Retêm e Convertem
            </span>
          </h1>

          <p className="text-sm xs:text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-1">
            Pare de postar vídeos sem retenção. Acesse roteiros de 10s e 60s em <strong>POV</strong>{' '}
            e com <strong>Modelo</strong> calibrados para os primeiros 3 segundos — com chamada
            irresistível para o carrinho.
          </p>

          {/* CTA EM DESTAQUE ACIMA DA DOBRA (EXPERIMENTAR GRÁTIS + PLANOS) */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto px-1">
            <Link
              to={user ? '/gerador' : '/login'}
              className="w-full sm:w-auto flex-1"
              aria-label="Experimentar grátis o gerador de prompts"
            >
              <Button
                size="lg"
                className="w-full min-h-[50px] h-12 xs:h-14 sm:h-16 px-4 xs:px-6 sm:px-8 text-sm xs:text-base sm:text-lg font-black bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:via-rose-400 hover:to-amber-400 text-white shadow-xl shadow-pink-500/30 rounded-2xl group transition-all"
              >
                <Wand2 className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="truncate">Experimentar Grátis Agora</span>
                <ArrowRight className="w-4 h-4 xs:w-5 xs:h-5 ml-1.5 xs:ml-2 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link
              to="/planos"
              className="w-full sm:w-auto"
              aria-label="Ver comparativo de planos de assinatura"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full min-h-[50px] h-12 xs:h-14 sm:h-16 px-4 xs:px-6 font-bold border-2 border-pink-500/40 hover:border-pink-500 hover:bg-pink-500/10 rounded-2xl text-foreground text-xs xs:text-sm sm:text-base"
              >
                <Crown className="w-4 h-4 mr-1.5 xs:mr-2 text-amber-500 shrink-0" />
                <span>Ver Planos PRO</span>
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Sem fidelidade • Sem cartão para testar • Cancele quando quiser</span>
          </p>

          {/* Selos de Prova de Valor */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ganchos de 0 a 3s validados</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Moda, Beleza, Eletrônicos & Virais</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Gerador com Upload de Fotos</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXEMPLOS AO VIVO — 3 AMOSTRAS GRÁTIS DESBLOQUEADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Amostra Gratuita Imediata</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Copie e Use: 3 Roteiros Reais da Nossa Coleção
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Sem cadastro ou barreira: teste agora um desses roteiros no seu próximo vídeo de
            vitrine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samplePrompts.map((prompt, idx) => (
            <Card
              key={prompt.id}
              className="flex flex-col justify-between border-2 border-pink-500/20 hover:border-pink-500/50 transition-all hover:shadow-xl rounded-2xl bg-card overflow-hidden"
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
                <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2">
                  🎯 "{prompt.hook || prompt.title}"
                </CardTitle>
                <CardDescription className="line-clamp-1 text-xs font-medium text-muted-foreground">
                  Peça: {prompt.title}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3.5 py-4 flex-1">
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
                    ✓ 100% liberado para teste
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-4 border-t flex items-center justify-between bg-muted/10 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto font-medium"
                  onClick={() => navigate(`/prompt/${prompt.id}`)}
                >
                  Ver Detalhes →
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs gap-1.5 bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold shadow-xs hover:opacity-95"
                  onClick={(e) => handleCopy(e, prompt)}
                  aria-label="Copiar texto do prompt"
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copiado! 🎉
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Amostra
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* ESPIADA NA BIBLIOTECA PREMIUM (PROMPTS BORRADOS COM CTA DE CONVERSÃO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge className="bg-amber-500 text-white font-bold text-xs uppercase tracking-wider">
            Exclusivo Membros PRO
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Espiada da Biblioteca Premium (40+ Roteiros)
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Veja uma prévia dos roteiros avançados mais usados pelos criadores com alta conversão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(premiumTeasers.length > 0
            ? premiumTeasers
            : [
                {
                  id: 'teaser-1',
                  title: 'Vestido Canelado com Fenda Lateral',
                  niche: 'moda_feminina',
                  style: 'pov',
                  hook: 'O dia em que parei de comprar roupa cara e achei esse achadinho',
                },
                {
                  id: 'teaser-2',
                  title: 'Kit Perfume Árabe Marcante',
                  niche: 'perfumes_cosmeticos',
                  style: 'modelo',
                  hook: 'Ninguém passa do meu lado sem perguntar que cheiro surreal é esse',
                },
                {
                  id: 'teaser-3',
                  title: 'Conjunto Alfaiataria Streetwear Oversized',
                  niche: 'streetwear',
                  style: 'unboxing',
                  hook: 'Será que esse conjunto vale o preço de shopping? Veja os detalhes reais',
                },
              ]
          ).map((item, idx) => (
            <Card
              key={item.id || idx}
              className="relative overflow-hidden border-2 border-amber-500/30 rounded-2xl bg-card shadow-sm"
            >
              <CardHeader className="space-y-1.5 pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs uppercase font-bold text-amber-600">
                    VIP Premium
                  </Badge>
                  <Lock className="w-4 h-4 text-amber-500" />
                </div>
                <CardTitle className="text-base font-bold text-foreground">{item.title}</CardTitle>
                <CardDescription className="text-xs">
                  Gancho de Alta Retenção calibrado
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 relative">
                {/* Texto propositalmente borrado simulando conteúdo bloqueado */}
                <div className="p-3 rounded-xl bg-muted/60 border text-xs font-mono select-none filter blur-[4px] opacity-70 pointer-events-none space-y-1">
                  <p>🎬 CENA 1 (0-3s): [GANCHO HIPNÓTICO EM PRIMEIRA PESSOA]</p>
                  <p>Narração: "POV: Você descobriu a peça perfeita antes de todo mundo..."</p>
                  <p>🎬 CENA 2 (3-7s): [DETALHES REAIS DA PEÇA E COSTURAS]</p>
                  <p>Narração: "O caimento no corpo e acabamento surpreendem na hora."</p>
                  <p>🎬 CENA 3 (7-10s): [CTA PARA O CARRINHO AMARELO COM CUPOM]</p>
                </div>

                {/* Overlay com CTA de desbloqueio */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-background/80 backdrop-blur-[1px] rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Roteiro completo bloqueado para assinantes
                  </p>
                  <Link to="/planos">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs shadow-md"
                    >
                      Desbloquear com PRO
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SEÇÃO DE COMPARATIVO TRANSPARENTE: GRATUITO × PRO × ANUAL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge
            variant="outline"
            className="text-pink-600 border-pink-500/30 text-xs font-semibold uppercase tracking-wider"
          >
            Transparência Total
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Compare o que cada plano destrava para sua loja
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comece grátis e faça upgrade quando quiser acelerar a produção de vídeos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
          {/* GRATUITO */}
          <Card className="flex flex-col justify-between border-2 rounded-2xl bg-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Gratuito</span>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>Para testar seus primeiros vídeos.</CardDescription>
              <div className="pt-3">
                <span className="text-3xl font-extrabold">R$ 0</span>
                <span className="text-muted-foreground text-xs"> /sempre</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs flex-1">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>3 Prompts de exemplo liberados</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Copiar roteiros para TikTok Shop/Shopee</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground line-through opacity-70">
                <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>Biblioteca completa de 40+ roteiros</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground line-through opacity-70">
                <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>Gerador com Upload de Fotos da Vitrine</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground line-through opacity-70">
                <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>Adaptação inteligente de ângulos</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full font-semibold text-xs h-10">
                  Criar Conta Grátis
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* PRO MENSAL (DESTAQUE) */}
          <Card className="flex flex-col justify-between border-2 border-pink-500 rounded-2xl bg-card shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                🔥 MAIS POPULAR • LANÇAMENTO
              </Badge>
            </div>
            <CardHeader className="space-y-1 pt-6">
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>PRO Mensal</span>
                <Zap className="w-5 h-5 text-pink-500" />
              </CardTitle>
              <CardDescription>Para criadores e lojistas ativos.</CardDescription>
              <div className="pt-3 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-muted-foreground line-through decoration-rose-500">
                    R$ 49,90
                  </span>
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                    R$ 19,90
                  </span>
                  <span className="text-muted-foreground text-xs font-bold"> /mês</span>
                </div>
                <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">
                  Preço promocional sem fidelidade
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs flex-1">
              <div className="flex items-start gap-2 bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <span className="font-semibold text-pink-950 dark:text-pink-200">
                  <strong>Gerador Ilimitado com Upload de Fotos:</strong> até 3 fotos da sua vitrine
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Biblioteca 100% liberada</strong> (40+ roteiros e novos semanais)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Todos os estilos: POV, Modelo e Unboxing ASMR</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Histórico de roteiros salvos na nuvem</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Link to="/planos" className="w-full">
                <Button className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs h-10 shadow-md">
                  Assinar PRO (R$ 19,90/mês)
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* ANUAL VIP */}
          <Card className="flex flex-col justify-between border-2 border-amber-500/60 rounded-2xl bg-card">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                ECONOMIZE 35% 🏆
              </Badge>
            </div>
            <CardHeader className="space-y-1 pt-6">
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Anual VIP</span>
                <Crown className="w-5 h-5 text-amber-500" />
              </CardTitle>
              <CardDescription>Para lojas de alto volume.</CardDescription>
              <div className="pt-3 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">R$ 19,90</span>
                  <span className="text-muted-foreground text-xs"> /mês</span>
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  Total de R$ 238,80 cobrado em 12 meses
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs flex-1">
              <div className="flex items-start gap-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-semibold text-amber-950 dark:text-amber-200">
                  <strong>Tudo do PRO incluído</strong> por 12 meses garantidos
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Economia de mais de R$ 360 no total anual</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Processamento de IA prioritário</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Suporte direto e badge de Membro VIP</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Link to="/planos" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-amber-500 text-foreground hover:bg-amber-500 hover:text-white font-bold text-xs h-10"
                >
                  Assinar Anual VIP
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* COMO FUNCIONA: 3 PASSOS SIMPLES */}
      <section className="bg-muted/30 border-y py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Como funciona o fluxo do sucesso
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Você não precisa ser especialista em edição nem passar horas pensando no que falar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl border bg-background space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 font-extrabold flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-lg">Escolha ou Gere o Prompt</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Acesse a biblioteca por nicho ou envie até 3 fotos da peça da sua vitrine para que a
                nossa IA monte o roteiro fiel ao produto real.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-background space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 font-extrabold flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-lg">Grave em Estilo POV ou Modelo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Siga as orientações cena a cena: câmera na primeira pessoa, teste de caimento e foco
                nos detalhes sem texto na tela.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-background space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 font-extrabold flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-lg">Publique com Link na Vitrine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use a chamada final testada para direcionar os espectadores ao carrinho amarelo do
                TikTok Shop ou Shopee e multiplique os pedidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DÚVIDAS FREQUENTES COMPACTAS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <HelpCircle className="w-5 h-5 text-pink-500" />
          Perguntas Frequentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
            <h4 className="font-bold text-foreground">Como o pagamento funciona?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tudo é processado pelo ambiente criptografado e oficial do{' '}
              <strong>Mercado Pago</strong> (Pix, Cartão ou Saldo). O acesso é liberado
              instantaneamente pelo webhook.
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
            <h4 className="font-bold text-foreground">Posso cancelar quando quiser?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sim! Sem multas ou letras miúdas. Você cancela com 1 clique diretamente no seu perfil
              e continua com acesso até o fim do período já pago.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL DE CONVERSÃO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl shadow-pink-500/25">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Pronto para transformar seus vídeos em máquinas de vendas?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pare de perder tempo tentando adivinhar o que funciona. Use os roteiros que já geram
            cliques e pedidos todos os dias.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md mx-auto">
            <Link to={user ? '/gerador' : '/login'} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[50px] bg-white text-pink-600 hover:bg-white/90 font-extrabold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base shadow-lg rounded-2xl"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500 shrink-0" />
                <span>Experimentar Grátis Agora</span>
              </Button>
            </Link>
            <Link to="/planos" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[50px] border-2 border-white/60 bg-transparent text-white hover:bg-white/10 font-bold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base rounded-2xl"
              >
                Ver Planos Disponíveis
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* BOTÃO FLUTUANTE DE FEEDBACK */}
      <div className="fixed bottom-5 right-5 z-40">
        <Button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className="shadow-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs h-10 px-3.5 rounded-full border-2 border-white/20 flex items-center gap-2 animate-bounce-subtle"
          title="Deixe seu feedback ou dê ideias para melhorar o site"
        >
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Dê sua ideia / Feedback</span>
          <span className="sm:hidden">Feedback</span>
        </Button>
      </div>

      {/* MODAL DE FEEDBACK */}
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}
export default Landing
