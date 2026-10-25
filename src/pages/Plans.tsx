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
  getMercadoPagoConfigStatus,
  cancelMercadoPagoSubscription,
} from '@/services/mercadoPago'

export const Plans: React.FC = () => {
  const { user, plan, subscription, refreshSubscription } = useAuth()
  const navigate = useNavigate()

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<'monthly' | 'annual' | null>(
    null,
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [mpConfigured, setMpConfigured] = useState<boolean | null>(null)

  // Consultar se as credenciais oficiais do Mercado Pago estão no backend
  React.useEffect(() => {
    getMercadoPagoConfigStatus().then((res) => {
      setMpConfigured(res.configured)
    })
  }, [])

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
    setModalOpen(true)
  }

  const handleDowngradeToFree = async () => {
    try {
      setProcessing(true)
      await cancelMercadoPagoSubscription(subscription?.id)
      await refreshSubscription()
      toast({
        title: 'Plano revertido para Gratuito',
        description: 'Sua assinatura anterior foi cancelada com sucesso.',
      })
    } catch (err) {
      toast({
        title: 'Erro ao cancelar plano',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleProceedToMercadoPago = async () => {
    if (!selectedPlanForModal) return

    setProcessing(true)
    try {
      const res = await createMercadoPagoCheckout({
        type: 'subscription',
        plan: selectedPlanForModal,
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
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge
          variant="outline"
          className="text-pink-600 dark:text-pink-400 border-pink-500/30 px-3 py-1 font-semibold uppercase tracking-wider text-xs"
        >
          Planos Transparentes
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Multiplique as vendas da sua vitrine com roteiros virais
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Escolha o plano ideal para a sua loja ou canal de afiliados no TikTok Shop e Shopee.
          Pagamentos 100% seguros processados através da API oficial do{' '}
          <strong>Mercado Pago</strong> (Pix, Cartão de Crédito e Boleto).
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
          <CardFooter className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold shadow-md"
              disabled={plan === 'monthly'}
              onClick={() => handleSelectPlan('monthly')}
            >
              {plan === 'monthly' ? 'Plano Ativo' : 'Assinar PRO (R$ 19,90/mês)'}
              {plan !== 'monthly' && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
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

          <CardFooter className="pt-4">
            <Button
              variant={plan === 'annual' ? 'outline' : 'default'}
              className="w-full font-semibold bg-amber-500 hover:bg-amber-600 text-white"
              disabled={plan === 'annual'}
              onClick={() => handleSelectPlan('annual')}
            >
              {plan === 'annual' ? 'Plano Ativo' : 'Assinar Anual VIP'}
              {plan !== 'annual' && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
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
              <CreditCard className="w-5 h-5 text-pink-500" />
              Contratação Segura —{' '}
              {selectedPlanForModal === 'annual' ? 'Plano Anual VIP' : 'Plano PRO Mensal'}
            </DialogTitle>
            <DialogDescription>
              Você será direcionado ao checkout oficial do Mercado Pago para efetuar o pagamento com
              Pix, Cartão ou Saldo em conta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Plano Escolhido:</span>
                <span className="font-bold text-foreground">
                  {selectedPlanForModal === 'annual'
                    ? 'Anual VIP (12 Meses)'
                    : 'PRO Mensal (Recorrente)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Valor:</span>
                <span className="text-lg font-black text-foreground">
                  {selectedPlanForModal === 'annual' ? 'R$ 238,80 /ano' : 'R$ 19,90 /mês'}
                </span>
              </div>
              {selectedPlanForModal === 'monthly' && (
                <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold pt-1 border-t">
                  🔥 Preço promocional de lançamento garantido enquanto sua assinatura estiver
                  ativa.
                </p>
              )}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                <strong>Checkout Seguro Mercado Pago:</strong> Seus dados de pagamento nunca passam
                por nossos servidores. A liberação ocorre via webhook oficial criptografado.
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
              onClick={handleProceedToMercadoPago}
              disabled={processing}
              className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold gap-2 shadow-md"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando Checkout...
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
    </div>
  )
}
