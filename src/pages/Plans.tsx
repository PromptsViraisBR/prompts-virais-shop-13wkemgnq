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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { PlanType } from '@/types'

export const Plans: React.FC = () => {
  const { user, plan, changePlanDemo } = useAuth()
  const navigate = useNavigate()

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PlanType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardHolder, setCardHolder] = useState('NOME DO COMPRADOR')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('123')
  const [processing, setProcessing] = useState(false)

  const handleSelectPlan = (targetPlan: PlanType) => {
    if (!user) {
      toast({
        title: 'Faça login para assinar',
        description: 'Crie ou acerte sua conta para concluir a assinatura.',
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
      // Downgrade direto
      handleDowngradeToFree()
      return
    }

    setSelectedPlanForModal(targetPlan)
    setModalOpen(true)
  }

  const handleDowngradeToFree = async () => {
    try {
      setProcessing(true)
      await changePlanDemo('free')
      toast({
        title: 'Plano alterado para Gratuito',
        description: 'Sua assinatura foi atualizada.',
      })
    } catch (err) {
      toast({
        title: 'Erro ao alterar plano',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlanForModal) return

    setProcessing(true)
    try {
      const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242'
      await changePlanDemo(selectedPlanForModal, {
        last4,
        brand: 'Mastercard',
      })

      setModalOpen(false)
      toast({
        title: 'Assinatura confirmada com sucesso! 🎉',
        description: `Seu plano foi atualizado para ${selectedPlanForModal === 'annual' ? 'Anual VIP' : 'Mensal PRO'}. Todos os recursos liberados!`,
      })
      navigate('/biblioteca')
    } catch (err) {
      toast({
        title: 'Erro ao processar',
        description: 'Ocorreu uma falha ao ativar a assinatura demonstrativa.',
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
          Escolha o plano ideal para a sua loja ou canal de afiliados no TikTok Shop e Shopee. Nesta
          versão 1, a cobrança é realizada em <strong>fluxo demonstrativo</strong> com cartão
          simulado.
        </p>
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

        {/* PLANO MENSAL (DESTAQUE) */}
        <Card
          className={`flex flex-col justify-between border-2 transition-all relative shadow-xl ${
            plan === 'monthly'
              ? 'border-pink-500 ring-2 ring-pink-500/20'
              : 'border-pink-500/60 hover:border-pink-500'
          }`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow">
              {plan === 'monthly' ? 'Seu Plano Ativo' : 'Mais Popular 🔥'}
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              Mensal PRO
              <Zap className="w-5 h-5 text-pink-500" />
            </CardTitle>
            <CardDescription>
              Acesso total para criadores e lojistas que postam diariamente.
            </CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-extrabold">R$ 29,90</span>
              <span className="text-muted-foreground text-sm font-medium"> /mês</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-sm flex-1">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Biblioteca 100% liberada</strong> de prompts virais
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Gerador Inteligente Ilimitado</strong> para roupas da sua vitrine
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
              <span>Favoritos e histórico de prompts salvos na nuvem</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Cancele quando quiser sem fidelidade</span>
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold shadow-md"
              disabled={plan === 'monthly'}
              onClick={() => handleSelectPlan('monthly')}
            >
              {plan === 'monthly' ? 'Plano Ativo' : 'Assinar Mensal'}
              {plan !== 'monthly' && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </CardFooter>
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
            <div className="pt-4">
              <span className="text-4xl font-extrabold">R$ 19,90</span>
              <span className="text-muted-foreground text-sm font-medium"> /mês</span>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                Faturado anualmente (R$ 238,80/ano)
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 text-sm flex-1">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Tudo do plano Mensal</strong> incluído
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Economia de mais de R$ 120</strong> no ano
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Acesso prioritário a novas atualizações de roteiro</span>
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
          Como funciona o pagamento demonstrativo nesta versão?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nesta primeira versão do projeto, o fluxo de assinatura e checkout com cartão de crédito é
          totalmente <strong>demonstrativo e simulado</strong>. Nenhum valor real é cobrado do seu
          cartão e você pode testar a alteração, upgrade e downgrade de planos instantaneamente
          salvando o status no banco de dados.
        </p>
      </div>

      {/* MODAL DE CHECKOUT COM CARTÃO DEMO */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <CreditCard className="w-5 h-5 text-pink-500" />
              Assinatura do Plano {selectedPlanForModal === 'annual' ? 'Anual VIP' : 'Mensal PRO'}
            </DialogTitle>
            <DialogDescription>
              Fluxo demonstrativo de pagamento com cartão de crédito. Preencha ou use os dados de
              teste pré-definidos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmCheckout} className="space-y-4 py-2">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Ambiente de Demonstração:</strong> Nenhuma cobrança real será realizada. O
                status da sua assinatura será ativado no banco de dados.
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-number">Número do Cartão</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="card-number"
                  placeholder="0000 0000 0000 0000"
                  className="pl-9 font-mono"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-holder">Nome no Cartão</Label>
              <Input
                id="card-holder"
                placeholder="NOME COMO NO CARTÃO"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Validade</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  id="card-cvc"
                  placeholder="123"
                  maxLength={4}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Valor a ativar:</span>
              <span className="font-extrabold text-foreground">
                {selectedPlanForModal === 'annual' ? 'R$ 238,80 /ano' : 'R$ 29,90 /mês'}
              </span>
            </div>

            <DialogFooter className="pt-2 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold"
                disabled={processing}
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                {processing ? 'Processando...' : 'Confirmar Assinatura'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
