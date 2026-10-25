import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  getAdminOverview,
  AdminOverviewResult,
  refundMercadoPagoPayment,
} from '@/services/mercadoPago'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Users,
  CreditCard,
  Crown,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<AdminOverviewResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Modal de Estorno/Reembolso
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<{
    id: string
    mp_payment_id: string
    transaction_amount?: number
    payment_type?: string
    payer_email?: string
  } | null>(null)
  const [refunding, setRefunding] = useState(false)

  const handleConfirmRefund = async () => {
    if (!selectedPaymentForRefund) return
    setRefunding(true)
    try {
      const res = await refundMercadoPagoPayment(selectedPaymentForRefund.mp_payment_id)
      if (res.success) {
        toast({
          title: 'Reembolso realizado com sucesso!',
          description: `Pagamento ${selectedPaymentForRefund.mp_payment_id} estornado na API oficial do Mercado Pago.`,
        })
        setSelectedPaymentForRefund(null)
        await loadOverview()
      } else {
        toast({
          title: 'Erro ao estornar',
          description: res.error || 'Não foi possível estornar o pagamento.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro no estorno',
        description: err?.message || 'Falha na comunicação com o Mercado Pago.',
        variant: 'destructive',
      })
    } finally {
      setRefunding(false)
    }
  }

  const loadOverview = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminOverview()
      setData(res)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.data?.error || err?.message || 'Falha ao carregar painel administrativo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadOverview()
  }, [user, navigate])

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="text-sm text-muted-foreground">Carregando painel administrativo...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Acesso Restrito</h2>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-pink-600 text-white font-bold text-xs uppercase tracking-wider">
              Admin Seguro
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Painel de Assinaturas & Usuários
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Consulta em tempo real de clientes, assinaturas do Mercado Pago e histórico de
            pagamentos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadOverview} className="gap-1.5">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Status da Configuração do Mercado Pago */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          data?.is_configured
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Key className="w-4 h-4" />
            <span>
              {data?.is_configured
                ? 'Mercado Pago Configurado no Backend (APIs Reais Ativas)'
                : 'Mercado Pago Aguardando Credenciais Privadas'}
            </span>
          </div>
          <p className="text-xs opacity-90">
            {data?.is_configured
              ? 'Token de acesso configurado no servidor. O checkout oficial e o webhook estão prontos.'
              : 'Defina MERCADO_PAGO_ACCESS_TOKEN e MERCADO_PAGO_WEBHOOK_SECRET nas variáveis do Skip Cloud para ativar pagamentos em produção.'}
          </p>
          <p className="text-[11px] font-mono opacity-80 pt-1">
            URL do Webhook: <strong>{data?.webhook_url}</strong>
          </p>
        </div>

        <a
          href="https://www.mercadopago.com.br/developers/panel/app"
          target="_blank"
          rel="noreferrer"
          className="shrink-0"
        >
          <Button size="sm" variant="outline" className="text-xs gap-1.5 bg-background">
            Painel de Apps MP
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-semibold">
              <span>Total de Usuários</span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {data?.metrics.total_users || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Cadastros registrados no banco de dados.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-semibold">
              <span>Assinaturas Ativas</span>
              <Crown className="w-4 h-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {data?.metrics.total_active_subscriptions || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {data?.metrics.active_monthly_subscriptions || 0} PRO Mensal •{' '}
            {data?.metrics.active_annual_subscriptions || 0} Anual VIP
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-semibold">
              <span>Assinaturas Canceladas</span>
              <XCircle className="w-4 h-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-muted-foreground">
              {data?.metrics.cancelled_subscriptions || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Planos revertidos para gratuito.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-semibold">
              <span>Transações Registradas</span>
              <CreditCard className="w-4 h-4 text-pink-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-pink-600 dark:text-pink-400">
              {data?.payments.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Eventos auditados na tabela payments_history.
          </CardContent>
        </Card>
      </div>

      {/* Grid: Tabela de Assinaturas & Histórico de Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Tabela de Assinaturas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Assinaturas Cadastradas ({data?.subscriptions.length || 0})
            </CardTitle>
            <CardDescription>
              Status de planos vinculados a cada usuário no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="pb-2">Usuário / E-mail</th>
                    <th className="pb-2">Plano</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">MP ID</th>
                    <th className="pb-2">Expiração / Próx.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(data?.subscriptions || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        Nenhuma assinatura registrada até o momento.
                      </td>
                    </tr>
                  ) : (
                    data?.subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-muted/30">
                        <td className="py-2.5 font-medium">
                          <span className="block truncate max-w-[140px]">
                            {sub.payer_email || sub.user_id}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <Badge variant="outline" className="uppercase font-bold text-[10px]">
                            {sub.plan}
                          </Badge>
                        </td>
                        <td className="py-2.5">
                          <Badge
                            className={`text-[10px] ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 font-mono text-[10px] text-muted-foreground">
                          {sub.mp_preapproval_id ? (
                            <span title="Preapproval ID">
                              {sub.mp_preapproval_id.slice(0, 10)}...
                            </span>
                          ) : sub.mp_payment_id ? (
                            <span title="Payment ID">{sub.mp_payment_id}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 text-muted-foreground text-[11px]">
                          {sub.end_date ? new Date(sub.end_date).toLocaleDateString('pt-BR') : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Pagamentos Recentes (Idempotência / Auditoria) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-500" />
              Histórico de Pagamentos MP ({data?.payments.length || 0})
            </CardTitle>
            <CardDescription>Pagamentos reais recebidos e validados pelo webhook.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="pb-2">ID Pagamento</th>
                    <th className="pb-2">Valor</th>
                    <th className="pb-2">Tipo</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Data</th>
                    <th className="pb-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(data?.payments || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        Nenhum pagamento registrado ainda. Os pagamentos aparecerão aqui assim que o
                        webhook receber os eventos do Mercado Pago.
                      </td>
                    </tr>
                  ) : (
                    data?.payments.map((pmt) => {
                      const isApproved = pmt.status === 'approved'
                      const isRefunded =
                        pmt.status === 'refunded' ||
                        pmt.status === 'charged_back' ||
                        pmt.status_detail?.includes('refund')

                      return (
                        <tr key={pmt.id} className="hover:bg-muted/30">
                          <td className="py-2.5 font-mono font-medium">{pmt.mp_payment_id}</td>
                          <td className="py-2.5 font-bold">
                            {pmt.transaction_amount
                              ? pmt.transaction_amount.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })
                              : '—'}
                          </td>
                          <td className="py-2.5 capitalize text-muted-foreground">
                            {pmt.payment_type || '—'}
                          </td>
                          <td className="py-2.5">
                            <Badge
                              className={`text-[10px] ${
                                isRefunded
                                  ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                                  : isApproved
                                    ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                              }`}
                            >
                              {pmt.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-muted-foreground text-[11px]">
                            {pmt.created ? new Date(pmt.created).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td className="py-2.5 text-right">
                            {isApproved ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setSelectedPaymentForRefund({
                                    id: pmt.id,
                                    mp_payment_id: pmt.mp_payment_id,
                                    transaction_amount: pmt.transaction_amount,
                                    payment_type: pmt.payment_type,
                                    payer_email: pmt.payer_email,
                                  })
                                }
                                className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive hover:text-destructive-foreground gap-1 border-destructive/30"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Estornar
                              </Button>
                            ) : isRefunded ? (
                              <span className="text-[11px] text-muted-foreground italic">
                                Estornado
                              </span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação de Estorno / Reembolso */}
      <Dialog
        open={Boolean(selectedPaymentForRefund)}
        onOpenChange={(open) => !open && setSelectedPaymentForRefund(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Confirmar Estorno no Mercado Pago?
            </DialogTitle>
            <DialogDescription className="text-sm space-y-2 pt-1 text-muted-foreground">
              <p>
                Esta ação chamará a API oficial do Mercado Pago (
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
                  POST /v1/payments/{selectedPaymentForRefund?.mp_payment_id}/refunds
                </code>
                ) e estornará o valor diretamente ao cliente.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1 border">
                <div>
                  <span className="font-semibold">ID do Pagamento: </span>
                  <span className="font-mono">{selectedPaymentForRefund?.mp_payment_id}</span>
                </div>
                {selectedPaymentForRefund?.transaction_amount ? (
                  <div>
                    <span className="font-semibold">Valor do Reembolso: </span>
                    <span className="font-bold text-foreground">
                      {selectedPaymentForRefund.transaction_amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                ) : null}
                <div>
                  <span className="font-semibold">Tipo: </span>
                  <span className="capitalize">
                    {selectedPaymentForRefund?.payment_type || 'Geral'}
                  </span>
                </div>
                {selectedPaymentForRefund?.payer_email && (
                  <div>
                    <span className="font-semibold">Comprador: </span>
                    <span>{selectedPaymentForRefund.payer_email}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                Ao confirmar, o sistema cancelará automaticamente o plano PRO ou deduzirá os
                créditos concedidos. O processo é irreversível.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={refunding}
              onClick={() => setSelectedPaymentForRefund(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={refunding}
              onClick={handleConfirmRefund}
              className="gap-1.5"
            >
              {refunding ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processando Estorno...
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Confirmar Estorno Oficial
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AdminDashboard
