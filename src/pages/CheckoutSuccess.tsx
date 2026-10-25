import React, { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getUserRegenerationCredits } from '@/services/regenerationCredits'
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
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'

export const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { user, subscription, plan, isPaidPlan, refreshSubscription } = useAuth()

  const [checking, setChecking] = useState(false)
  const [pollCount, setPollCount] = useState(0)
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)

  // Parâmetros da URL retornados pelo Mercado Pago ou gerados pelo backend
  const tipo = searchParams.get('tipo') // 'assinatura' | 'creditos'
  const plano = searchParams.get('plano') // 'monthly' | 'annual'
  const qtd = parseInt(searchParams.get('qtd') || '1', 10)
  const collectionStatus = searchParams.get('collection_status')
  const statusParam = searchParams.get('status')
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')

  const isCredits = tipo === 'creditos'

  const checkStatus = useCallback(async () => {
    if (!user?.id) return
    if (isCredits) {
      const rec = await getUserRegenerationCredits(user.id)
      if (rec) {
        setCreditsBalance(rec.extra_prompts_balance)
      }
    } else {
      await refreshSubscription()
    }
  }, [user?.id, isCredits, refreshSubscription])

  // Fazer polling suave nos primeiros 20 segundos para verificar se o webhook do MP já confirmou o pagamento
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const needsPolling = isCredits ? creditsBalance === null || creditsBalance === 0 : !isPaidPlan

    if (pollCount < 6 && (needsPolling || checking)) {
      timer = setTimeout(async () => {
        setChecking(true)
        try {
          await checkStatus()
        } finally {
          setChecking(false)
          setPollCount((prev) => prev + 1)
        }
      }, 3500)
    }
    return () => clearTimeout(timer)
  }, [pollCount, isCredits, creditsBalance, isPaidPlan, checkStatus, checking])

  // Carga inicial do saldo de créditos quando for compra de créditos
  useEffect(() => {
    if (user?.id && isCredits) {
      getUserRegenerationCredits(user.id).then((rec) => {
        if (rec) setCreditsBalance(rec.extra_prompts_balance)
      })
    }
  }, [user?.id, isCredits])

  const handleManualRefresh = async () => {
    setChecking(true)
    try {
      await checkStatus()
    } finally {
      setChecking(false)
    }
  }

  const isConfirmed = isCredits
    ? (creditsBalance !== null && creditsBalance > 0) ||
      collectionStatus === 'approved' ||
      statusParam === 'approved'
    : isPaidPlan || subscription?.status === 'active'

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden relative">
        <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500" />

        <CardHeader className="text-center pt-8 pb-4 space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-pink-500/10 via-rose-500/10 to-amber-500/10 border border-primary/20">
            {isConfirmed ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in" />
            ) : (
              <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
            )}
          </div>

          <Badge
            variant="outline"
            className={`mx-auto px-3 py-1 font-semibold text-xs uppercase tracking-wider ${
              isConfirmed
                ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
            }`}
          >
            {isConfirmed ? 'Pagamento Aprovado e Liberado' : 'Aguardando Confirmação do Provedor'}
          </Badge>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isConfirmed
              ? isCredits
                ? 'Créditos Adicionados com Sucesso! 🎉'
                : 'Parabéns! Seus recursos já estão liberados 🎉'
              : 'Recebemos o retorno do checkout seguro!'}
          </CardTitle>

          <CardDescription className="text-sm sm:text-base max-w-xl mx-auto">
            {isConfirmed ? (
              isCredits ? (
                <span>
                  O Mercado Pago confirmou seu pagamento. Foram adicionados{' '}
                  <strong className="text-foreground">{qtd} crédito(s) de regeneração</strong> à sua
                  conta. Saldo atual:{' '}
                  <strong className="text-pink-600 dark:text-pink-400">
                    {creditsBalance ?? qtd} prompts extras
                  </strong>
                  .
                </span>
              ) : (
                <span>
                  O Mercado Pago validou seu pagamento via webhook oficial. Seu plano{' '}
                  <strong className="text-foreground">
                    {plan === 'annual' ? 'Anual VIP' : 'PRO Mensal'}
                  </strong>{' '}
                  está totalmente ativo no banco de dados.
                </span>
              )
            ) : (
              <span>
                Por questões de segurança, a liberação dos recursos é realizada{' '}
                <strong>estritamente após a notificação oficial do Mercado Pago</strong>. Isso
                costuma levar apenas alguns segundos no cartão ou Pix.
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Caixa de detalhes */}
          <div className="p-4 rounded-xl bg-muted/40 border space-y-3 text-sm">
            <div className="flex items-center justify-between pb-2 border-b text-xs text-muted-foreground">
              <span>Status do Provedor:</span>
              <span className="font-semibold text-foreground capitalize">
                {collectionStatus || statusParam || (isConfirmed ? 'Aprovado' : 'Em processamento')}
              </span>
            </div>

            {paymentId && (
              <div className="flex items-center justify-between pb-2 border-b text-xs text-muted-foreground">
                <span>Identificador do Pagamento (MP):</span>
                <span className="font-mono text-foreground font-semibold">{paymentId}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status no seu Usuário:</span>
              <Badge
                className={
                  isConfirmed
                    ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs font-bold'
                    : 'bg-amber-500/15 text-amber-600 border-amber-500/30 text-xs font-bold'
                }
              >
                {isConfirmed
                  ? isCredits
                    ? `Créditos Liberados (${creditsBalance ?? qtd} disp.)`
                    : `Ativo (${plan.toUpperCase()})`
                  : 'Pendente / Verificando...'}
              </Badge>
            </div>
          </div>

          {!isConfirmed && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-bold">Diretriz de Segurança Anti-Fraude:</p>
                <p>
                  O sistema nunca confia apenas no retorno do navegador. A liberação real do Plano
                  PRO ou dos créditos extras acontece de forma 100% automatizada e à prova de falhas
                  assim que o webhook do Mercado Pago valida o evento no backend.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!isConfirmed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={checking}
                className="w-full sm:w-auto gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Checando pagamento...' : 'Verificar Status Novamente'}
              </Button>
            )}
            <Link to="/perfil" className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" className="w-full gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-500" />
                Gerenciar no Meu Perfil
              </Button>
            </Link>
            <Link
              to={isCredits ? '/virais' : isConfirmed ? '/gerador' : '/biblioteca'}
              className="w-full sm:w-auto"
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                {isCredits
                  ? 'Ir para Vídeos Virais'
                  : isConfirmed
                    ? 'Acessar o Gerador PRO'
                    : 'Ver Biblioteca de Roteiros'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>{' '}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 border-t py-4 px-6 text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Dúvidas sobre o processamento?
          </span>
          <span>Suporte Mercado Pago integrado</span>
        </CardFooter>
      </Card>
    </div>
  )
}
export default CheckoutSuccess
