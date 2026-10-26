import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Check,
  Crown,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Lock,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { PlanType } from '@/types'
import {
  createMercadoPagoCheckout,
  createMercadoPagoPix,
  getMercadoPagoConfigStatus,
  cancelMercadoPagoSubscription,
  type CreatePixResult,
} from '@/services/mercadoPago'
import { PixPaymentModal } from '@/components/PixPaymentModal'
import { trackFunnelEvent } from '@/services/events'
import { QrCode } from 'lucide-react'

export const Plans: React.FC = () => {
  const { user, plan, subscription, refreshSubscription } = useAuth()
  const navigate = useNavigate()

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<'monthly' | 'annual' | null>(
    null,
  )
  const [paymentMethodChoice, setPaymentMethodChoice] = useState<'checkout_pro' | 'pix'>('pix')
  const [modalOpen, setModalOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [mpConfigured, setMpConfigured] = useState<boolean | null>(null)

  // Estado para Modal de Pix
  const [pixModalOpen, setPixModalOpen] = useState(false)
  const [pixData, setPixData] = useState<CreatePixResult | null>(null)

  // Consultar se as credenciais oficiais do Mercado Pago estão no backend e registrar evento plans_view
  React.useEffect(() => {
    trackFunnelEvent('plans_view', { current_plan: plan })
    getMercadoPagoConfigStatus().then((res) => {
      setMpConfigured(res.configured)
    })
  }, [plan])

  const handleSelectPlan = (targetPlan: PlanType) => {
    if (!user) {
      toast({
        title: 'Faça login para assinar',
        description: 'Crie ou acesse sua conta para concluir a assinatura com o Mercado Pago.',
      })
      navigate('/login')
      return
    }

    if (targetPlan === plan) {
      toast({
        title: 'Seu plano atual',
        description: 'Você já possui este plano ativo.',
      })
      return
    }

    if (targetPlan === 'free') {
      handleDowngradeToFree()
      return
    }

    setSelectedPlanForModal(targetPlan as 'monthly' | 'annual')
    setPaymentMethodChoice('pix')
    setModalOpen(true)
  }

  const handleDowngradeToFree = async () => {
    try {
      setProcessing(true)
      const res = await cancelMercadoPagoSubscription(subscription?.id)
      if (res.success) {
        await refreshSubscription()
        toast({
          title: 'Plano revertido para Gratuito',
          description: 'Sua assinatura anterior foi cancelada com sucesso.',
        })
      } else {
        toast({
          title: 'Erro ao cancelar plano',
          description: res.error || 'Tente novamente em instantes.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao cancelar plano',
        description: err?.message || 'Falha na comunicação. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleProceedToCheckout = async () => {
    if (!selectedPlanForModal) return

    setProcessing(true)
    try {
      // 1. FLUXO PIX DIRETO COM QR CODE OFICIAL
      if (paymentMethodChoice === 'pix') {
        try {
          trackFunnelEvent('checkout_start_pix', {
            type: 'subscription',
            plan: selectedPlanForModal,
          })
        } catch {
          /* intentionally ignored */
        }

        let res: CreatePixResult
        try {
          res = await createMercadoPagoPix({
            type: 'subscription',
            plan: selectedPlanForModal,
          })
        } catch (callErr: any) {
          const isAuthErr =
            callErr?.status === 401 ||
            callErr?.data?.status === 401 ||
            callErr?.code === 'UNAUTHORIZED' ||
            String(callErr?.message || '')
              .toLowerCase()
              .includes('logado') ||
            String(callErr?.message || '')
              .toLowerCase()
              .includes('autentica') ||
            String(callErr?.message || '')
              .toLowerCase()
              .includes('sessão expirada')

          if (isAuthErr) {
            toast({
              title: 'Sessão expirada',
              description:
                'Sua sessão expirou. Faça login novamente para continuar com o Pix ou Cartão.',
              variant: 'destructive',
            })
            navigate('/login?redirect=/plans')
            return
          }

          toast({
            title: 'Não foi possível gerar o Pix',
            description:
              callErr?.message ||
              'Instabilidade temporária na comunicação com o Mercado Pago. Tente novamente ou use a opção de Cartão.',
            variant: 'destructive',
          })
          return
        }

        if (!res.success || !res.payment_id) {
          const isAuthErr =
            res.code === 'UNAUTHORIZED' ||
            String(res.error || '')
              .toLowerCase()
              .includes('logado') ||
            String(res.error || '')
              .toLowerCase()
              .includes('autentica') ||
            String(res.error || '')
              .toLowerCase()
              .includes('sessão expirada')

          if (isAuthErr) {
            toast({
              title: 'Sessão expirada',
              description: 'Faça login novamente para continuar seu pagamento.',
              variant: 'destructive',
            })
            navigate('/login?redirect=/plans')
            return
          }

          toast({
            title: 'Erro ao gerar Pix no Mercado Pago',
            description:
              res.error ||
              'O Mercado Pago não pôde gerar o QR Code no momento. Você pode tentar novamente ou pagar com Cartão de Crédito.',
            variant: 'destructive',
          })
          return
        }

        setPixData(res)
        setModalOpen(false)
        setPixModalOpen(true)
        return
      }

      // 2. FLUXO CHECKOUT PRO / CARTÃO DE CRÉDITO OU ASSINATURA RECORRENTE
      try {
        trackFunnelEvent('checkout_start', {
          type: 'subscription',
          plan: selectedPlanForModal,
        })
      } catch {
        /* intentionally ignored */
      }

      const res = await createMercadoPagoCheckout({
        type: 'subscription',
        plan: selectedPlanForModal,
        method: selectedPlanForModal === 'monthly' ? 'checkout_pro' : undefined,
      })

      if (res.code === 'PAYMENTS_NOT_CONFIGURED' || !res.success) {
        toast({
          title: 'Pagamentos em Configuração',
          description:
            res.error ||
            'O sistema está aguardando o cadastro das chaves do Mercado Pago nas variáveis de ambiente do Skip Cloud.',
          variant: 'destructive',
        })
        return
      }

      if (res.init_point) {
        toast({
          title: 'Redirecionando para o Mercado Pago...',
          description: 'Você será levado ao checkout seguro e oficial.',
        })
        window.location.href = res.init_point
      } else {
        toast({
          title: 'Erro ao iniciar checkout',
          description: res.error || 'Não foi possível gerar a sessão de pagamento.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      const isAuthErr =
        err?.status === 401 ||
        err?.code === 'UNAUTHORIZED' ||
        String(err?.message || '')
          .toLowerCase()
          .includes('logado') ||
        String(err?.message || '')
          .toLowerCase()
          .includes('autentica') ||
        String(err?.message || '')
          .toLowerCase()
          .includes('sessão expirada')

      if (isAuthErr) {
        toast({
          title: 'Sessão expirada',
          description: 'Sua sessão expirou. Faça login novamente para continuar.',
          variant: 'destructive',
        })
        navigate('/login?redirect=/plans')
        return
      }

      toast({
        title: 'Erro na conexão',
        description: err?.message || 'Falha ao conectar com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="py-6 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge
            variant="outline"
            className="text-pink-600 dark:text-pink-400 border-pink-500/30 px-2.5 xs:px-3 py-1 font-semibold uppercase tracking-wider text-[11px] sm:text-xs"
          >
            Planos Transparentes
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 xs:px-3 py-1 font-bold uppercase tracking-wider text-[11px] sm:text-xs flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            PIX Disponível em Tudo
          </Badge>
        </div>
        <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight break-words">
          Multiplique as vendas da sua vitrine com roteiros virais
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Escolha o plano ideal para a sua loja ou canal de afiliados no TikTok Shop e Shopee.
          Pagamentos 100% seguros processados através da API oficial do{' '}
          <strong>Mercado Pago</strong> (Pix direto com QR Code, Cartão de Crédito ou Saldo).
        </p>
        {mpConfigured === false && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 max-w-xl mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Ambiente de Integração:</strong> Credenciais do Mercado Pago aguardando
              configuração nas variáveis de ambiente.
            </span>
          </div>
        )}
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {/* PLANO GRATUITO */}
        <Card
          className={`flex flex-col justify-between border-2 transition-all relative ${
            plan === 'free' ? 'border-primary/50 shadow-md' : 'hover:border-border'
          }`}
        >
          {plan === 'free' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="secondary" className="font-bold text-xs uppercase tracking-wider">
                Seu Plano Atual
              </Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              Gratuito
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Para conhecer a estrutura de roteiros e testar seus primeiros vídeos.
            </CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-extrabold">R$ 0</span>
              <span className="text-muted-foreground text-sm font-medium"> /sempre</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-sm flex-1">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Acesso aos <strong>prompts de exemplo gratuitos</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Copiar roteiros para TikTok Shop e Shopee</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Filtro por nicho e estilo POV/Modelo</span>
            </div>
            <div className="flex items-start gap-2.5 text-muted-foreground line-through opacity-70">
              <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>Gerador ilimitado de prompts personalizados</span>
            </div>
            <div className="flex items-start gap-2.5 text-muted-foreground line-through opacity-70">
              <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>Biblioteca premium completa e novos roteiros semanais</span>
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              variant={plan === 'free' ? 'outline' : 'secondary'}
              className="w-full font-semibold"
              disabled={plan === 'free'}
              onClick={() => handleSelectPlan('free')}
            >
              {plan === 'free' ? 'Plano Ativo' : 'Mudar para Gratuito'}
            </Button>
          </CardFooter>
        </Card>

        {/* PLANO MENSAL (DESTAQUE COM PROMOÇÃO DE LANÇAMENTO) */}
        <Card
          className={`flex flex-col justify-between border-2 transition-all relative shadow-xl ${
            plan === 'monthly'
              ? 'border-pink-500 ring-2 ring-pink-500/20'
              : 'border-pink-500/60 hover:border-pink-500'
          }`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <Badge className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow animate-pulse">
              {plan === 'monthly' ? 'Seu Plano Ativo' : '🔥 OFERTA DE LANÇAMENTO'}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              <span>PRO Mensal</span>
              <Zap className="w-5 h-5 text-pink-500" />
            </CardTitle>
            <CardDescription>
              Acesso total à biblioteca e gerador personalizado fiel às fotos da sua vitrine.
            </CardDescription>
            <div className="pt-4 space-y-1">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-lg sm:text-xl font-semibold text-muted-foreground line-through decoration-rose-500 decoration-2 opacity-80">
                  R$ 49,90
                </span>
                <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  R$ 19,90
                </span>
                <span className="text-muted-foreground text-sm font-bold"> /mês</span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-pink-600 dark:text-pink-400">
                Preço promocional por tempo limitado — para os primeiros assinantes do site
              </p>
              <p className="text-[11px] text-muted-foreground">
                Cobrança mensal, sem fidelidade • Cancele quando quiser
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3.5 text-sm flex-1">
            <div className="flex items-start gap-2.5 bg-pink-500/10 p-2.5 rounded-lg border border-pink-500/20">
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
              <span className="text-pink-950 dark:text-pink-200 font-semibold text-xs">
                <strong>Gerador Ilimitado com Upload de Fotos:</strong> até 3 fotos da sua peça
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Biblioteca 100% liberada</strong> de prompts virais (40+ roteiros)
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Personalização com Fotos:</strong> adapte qualquer roteiro pronto
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Todos os estilos: <strong>POV, Modelo e Unboxing ASMR</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Ganchos calibrados de 0 a 3 segundos e CTAs para o carrinho</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Histórico completo de roteiros salvos na nuvem</span>
            </div>
          </CardContent>
          <CardFooter className="pt-4 space-y-2 flex-col">
            <Button
              className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold shadow-md"
              disabled={plan === 'monthly'}
              onClick={() => handleSelectPlan('monthly')}
            >
              {plan === 'monthly' ? 'Plano Ativo' : 'Assinar PRO (R$ 19,90/mês)'}
              {plan !== 'monthly' && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <QrCode className="w-3.5 h-3.5 text-emerald-500" />
              <span>Aceita Pix instantâneo ou Cartão</span>
            </div>
          </CardFooter>{' '}
        </Card>

        {/* PLANO ANUAL */}
        <Card
          className={`flex flex-col justify-between border-2 transition-all relative ${
            plan === 'annual'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'hover:border-border'
          }`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow">
              {plan === 'annual' ? 'Seu Plano Ativo' : 'Economize 35% 🏆'}
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              Anual VIP
              <Crown className="w-5 h-5 text-amber-500" />
            </CardTitle>
            <CardDescription>
              Para lojas e agências que faturam alto e querem o melhor custo por ano.
            </CardDescription>
            <div className="pt-4 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">R$ 19,90</span>
                <span className="text-muted-foreground text-sm font-medium"> /mês</span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                Faturado anualmente em parcela única (Total: R$ 238,80/ano)
              </p>
              <p className="text-[11px] text-muted-foreground">
                12 meses de acesso garantido com suporte VIP
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-sm flex-1">
            <div className="flex items-start gap-2.5 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="text-amber-950 dark:text-amber-200 font-semibold text-xs">
                <strong>Tudo do PRO incluído:</strong> Biblioteca 100% + Gerador Ilimitado com Fotos
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Economia de mais de R$ 360</strong> no comparativo anual
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Processamento prioritário na IA de adaptação de prompts</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Suporte VIP e badge de membro VIP no perfil</span>
            </div>
          </CardContent>

          <CardFooter className="pt-4 space-y-2 flex-col">
            <Button
              variant={plan === 'annual' ? 'outline' : 'default'}
              className="w-full font-semibold bg-amber-500 hover:bg-amber-600 text-white"
              disabled={plan === 'annual'}
              onClick={() => handleSelectPlan('annual')}
            >
              {plan === 'annual' ? 'Plano Ativo' : 'Assinar Anual VIP'}
              {plan !== 'annual' && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <QrCode className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pix em parcela única ou Cartão</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Dúvidas / FAQ Compacto */}
      <div className="border rounded-2xl p-6 sm:p-8 bg-muted/20 max-w-4xl mx-auto space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-pink-500" />
          Como funciona a segurança e o pagamento no Mercado Pago?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ao contratar um plano, você é direcionado diretamente ao ambiente criptografado e oficial
          do <strong>Mercado Pago</strong>. Todos os seus dados financeiros permanecem 100%
          protegidos pelo banco emissor. A ativação dos seus recursos PRO ocorre de forma automática
          e instantânea assim que a notificação oficial for confirmada pelo nosso servidor.
        </p>
      </div>

      {/* MODAL DE CHECKOUT SEGURO COM MERCADO PAGO */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Contratação Segura —{' '}
              {selectedPlanForModal === 'annual' ? 'Plano Anual VIP' : 'Plano PRO Mensal'}
            </DialogTitle>
            <DialogDescription>
              Escolha pagar via Pix instantâneo (com QR Code direto) ou Cartão de Crédito pelo
              Mercado Pago.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Detalhes do Plano */}
            <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Plano Escolhido:</span>
                <span className="font-bold text-foreground">
                  {selectedPlanForModal === 'annual'
                    ? 'Anual VIP (12 Meses)'
                    : paymentMethodChoice === 'pix'
                      ? 'PRO Mensal (30 Dias via Pix)'
                      : 'PRO Mensal (Recorrente no Cartão)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Valor:</span>
                <span className="text-lg font-black text-foreground">
                  {selectedPlanForModal === 'annual' ? 'R$ 238,80' : 'R$ 19,90'}
                </span>
              </div>
              {selectedPlanForModal === 'monthly' && paymentMethodChoice === 'pix' && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t">
                  💡 O Pix dá acesso imediato por 30 dias (sem renovação automática debitada do
                  banco).
                </p>
              )}
            </div>

            {/* Seleção do Método de Pagamento */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Como deseja pagar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethodChoice('pix')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                    paymentMethodChoice === 'pix'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <QrCode className="w-4 h-4 text-emerald-500" />
                      Pix Oficial
                    </span>
                    <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0 h-4">
                      Recomendado
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    QR Code na tela + Copia e Cola
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodChoice('checkout_pro')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                    paymentMethodChoice === 'checkout_pro'
                      ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400 shadow-xs'
                      : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <CreditCard className="w-4 h-4 text-pink-500" />
                      Cartão / MP
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Checkout Pro ou Recorrente
                  </span>
                </button>
              </div>
            </div>

            {/* Aviso de Política de Reembolso em até 7 dias */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                <strong>Garantia de 7 dias com devolução direta na conta:</strong> Caso solicite
                reembolso em até 7 dias, o estorno retorna certinho para a mesma conta do comprador
                via Mercado Pago.
              </span>
            </div>

            {mpConfigured === false && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Aviso:</strong> O administrador do sistema ainda não cadastrou o token do
                  Mercado Pago no painel Skip Cloud.
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={processing}
              className={
                paymentMethodChoice === 'pix'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md'
                  : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold gap-2 shadow-md'
              }
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {paymentMethodChoice === 'pix' ? 'Gerando QR Code Pix...' : 'Gerando Checkout...'}
                </>
              ) : paymentMethodChoice === 'pix' ? (
                <>
                  <QrCode className="w-4 h-4" />
                  Gerar QR Code Pix
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pagar no Mercado Pago
                  <ExternalLink className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DEDICADO DE PAGAMENTO PIX DIRETO */}
      <PixPaymentModal
        open={pixModalOpen}
        onOpenChange={setPixModalOpen}
        pixData={pixData}
        title={
          selectedPlanForModal === 'annual' ? 'Pix — Plano Anual VIP' : 'Pix — Plano PRO Mensal'
        }
        description={`Conclua a ativação do seu plano pagando ${
          selectedPlanForModal === 'annual' ? 'R$ 238,80' : 'R$ 19,90'
        } via Pix Oficial.`}
        onPayWithCard={() => {
          setPaymentMethodChoice('checkout_pro')
          setModalOpen(true)
        }}
        onPaymentApproved={async () => {
          await refreshSubscription()
          navigate(
            '/checkout/sucesso?tipo=assinatura&plano=' + selectedPlanForModal + '&status=approved',
          )
        }}
      />
    </div>
  )
}
