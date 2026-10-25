import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  getAdminOverview,
  AdminOverviewResult,
  refundMercadoPagoPayment,
} from '@/services/mercadoPago'
import { getFunnelMetrics, FunnelMetricsResponse } from '@/services/events'
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
  Mail,
  Send,
  Inbox,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  getEmailStatus,
  runExpirationCheck,
  testTransactionalEmail,
  EmailStatusResponse,
} from '@/services/emailAutomations'

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<AdminOverviewResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Funil de Conversão
  const [funnelPeriod, setFunnelPeriod] = useState<'today' | '7d' | '30d' | 'all'>('30d')
  const [funnelData, setFunnelData] = useState<FunnelMetricsResponse | null>(null)
  const [funnelLoading, setFunnelLoading] = useState(false)

  // Automações de e-mail (Fase D)
  const [emailStatus, setEmailStatus] = useState<EmailStatusResponse | null>(null)
  const [runningExpiration, setRunningExpiration] = useState(false)
  const [sendingTestEmail, setSendingTestEmail] = useState(false)
  const [testEmailType, setTestEmailType] = useState<
    'welcome' | 'subscription_active' | 'payment_failed' | 'access_expired'
  >('welcome')

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
      const [res, fRes, eRes] = await Promise.all([
        getAdminOverview(),
        getFunnelMetrics(funnelPeriod),
        getEmailStatus().catch(() => null),
      ])
      setData(res)
      setFunnelData(fRes)
      if (eRes) setEmailStatus(eRes)
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

  const handlePeriodChange = async (period: 'today' | '7d' | '30d' | 'all') => {
    setFunnelPeriod(period)
    setFunnelLoading(true)
    try {
      const fRes = await getFunnelMetrics(period)
      setFunnelData(fRes)
    } finally {
      setFunnelLoading(false)
    }
  }

  const handleRunExpiration = async () => {
    setRunningExpiration(true)
    try {
      const res = await runExpirationCheck()
      toast({
        title: 'Varredura de vencimento concluída',
        description: `${res.expired_count} assinaturas processadas no servidor.`,
      })
      await loadOverview()
    } catch (err: any) {
      toast({
        title: 'Erro na varredura',
        description: err?.message || 'Falha ao executar verificação.',
        variant: 'destructive',
      })
    } finally {
      setRunningExpiration(false)
    }
  }

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true)
    try {
      const res = await testTransactionalEmail(testEmailType, user?.email)
      toast({
        title: res.sent_via_mailer ? 'E-mail enviado via Mailer' : 'Disparo simulado com sucesso',
        description: res.diagnostic,
      })
      await loadOverview()
    } catch (err: any) {
      toast({
        title: 'Erro ao disparar teste',
        description: err?.message || 'Falha no disparo.',
        variant: 'destructive',
      })
    } finally {
      setSendingTestEmail(false)
    }
  }

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

      {/* SEÇÃO: FUNIL DE CONVERSÃO (Fase B / Métricas) */}
      <Card className="border-2 border-pink-500/20 shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Funil de Conversão de Clientes
            </CardTitle>
            <CardDescription>
              Acompanhe a passagem de visitantes até clientes pagantes e identifique pontos de
              atrito.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl self-start sm:self-auto border">
            {(['today', '7d', '30d', 'all'] as const).map((p) => {
              const labels = {
                today: 'Hoje',
                '7d': '7 dias',
                '30d': '30 dias',
                all: 'Total',
              }
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePeriodChange(p)}
                  disabled={funnelLoading}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    funnelPeriod === p
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {labels[p]}
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 5 Etapas Visuais do Funil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Visitas */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>1. Visita à Landing</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-foreground">
                {funnelData?.metrics.page_views ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Topo do funil</p>
            </div>

            {/* 2. Cadastros */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>2. Cadastros</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-foreground">
                {funnelData?.metrics.signups ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span>{funnelData?.conversion_rates.visit_to_signup ?? '0.0'}%</span>
                <span className="font-normal text-muted-foreground">de visitas</span>
              </div>
            </div>

            {/* 3. 1º Prompt */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>3. Primeiro Prompt</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-foreground">
                {funnelData?.metrics.first_prompts ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <span>{funnelData?.conversion_rates.signup_to_prompt ?? '0.0'}%</span>
                <span className="font-normal text-muted-foreground">de cadastros</span>
              </div>
            </div>

            {/* 4. Checkout */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>4. Início Checkout</span>
                <CreditCard className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-2xl font-black text-foreground">
                {funnelData?.metrics.checkout_starts ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400">
                <span>{funnelData?.conversion_rates.prompt_to_checkout ?? '0.0'}%</span>
                <span className="font-normal text-muted-foreground">de quem gerou</span>
              </div>
            </div>

            {/* 5. Pagamento Concluído */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                <span>5. Pagamento</span>
                <Crown className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {funnelData?.metrics.payments_confirmed ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <span>{funnelData?.conversion_rates.checkout_to_payment ?? '0.0'}%</span>
                <span className="font-normal text-muted-foreground">de checkout</span>
              </div>
            </div>
          </div>

          {/* Resumo da Eficiência Global */}
          <div className="p-4 rounded-xl bg-muted/40 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground">
                Taxa Global de Conversão (Visita → Cliente Pagante):
              </span>
              <p className="text-muted-foreground text-[11px]">
                Considera todas as interações e registros confirmados no período selecionado (
                {funnelPeriod}).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-600 text-white font-black text-sm px-3 py-1">
                {funnelData?.conversion_rates.global_conversion ?? '0.00'}%
              </Badge>
              {Boolean(funnelData?.metrics.cancellations) && (
                <span className="text-muted-foreground text-[11px]">
                  Cancelamentos: <strong>{funnelData?.metrics.cancellations}</strong>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO: AUTOMAÇÕES TRANSACIONAIS E JOB DE VENCIMENTO (Fase D) */}
      <Card className="border-2 border-indigo-500/20 shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-500" />
              Automações de E-mail & Job de Vencimento (Fase D)
            </CardTitle>
            <CardDescription>
              E-mails 100% transacionais conectados aos ciclos de vida do usuário e pagamentos do
              Mercado Pago.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={runningExpiration}
              onClick={handleRunExpiration}
              className="text-xs gap-1.5"
            >
              <Clock className={`w-3.5 h-3.5 ${runningExpiration ? 'animate-spin' : ''}`} />
              Executar Job de Vencimento Agora
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Card de Diagnóstico do SMTP */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              emailStatus?.smtp_configured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Inbox className="w-4 h-4" />
                <span>
                  {emailStatus?.smtp_configured
                    ? 'SMTP Nativo Configurado e Ativo'
                    : 'Mailer Nativo PocketBase (Aguardando SMTP de Produção)'}
                </span>
              </div>
              <p className="text-xs opacity-90">
                Remetente configurado:{' '}
                <strong>
                  {emailStatus?.sender_name} &lt;{emailStatus?.sender_address}&gt;
                </strong>
                .
                {!emailStatus?.smtp_configured &&
                  ' Todas as automações estão ativas e com templates prontos no backend. Para envio real aos clientes finais, configure as credenciais SMTP no painel do PocketBase.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-semibold">
                Job Diário: 03:00 UTC
              </Badge>
            </div>
          </div>

          {/* Métricas de Disparos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border bg-card space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Boas-Vindas Enviados
              </span>
              <p className="text-2xl font-black text-foreground">
                {emailStatus?.metrics.welcome_emails_sent ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Cadastros orientados</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Confirmações de Plano
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {emailStatus?.metrics.subscription_confirmations_notified ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Assinaturas ativadas</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Avisos de Fim de Acesso
              </span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {emailStatus?.metrics.expired_subscriptions_notified ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Idempotência garantida</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Recusa / Falha MP</span>
              <p className="text-2xl font-black text-pink-600 dark:text-pink-400">Ativo</p>
              <p className="text-[11px] text-muted-foreground">Disparo em rejected</p>
            </div>
          </div>

          {/* Teste Rápido de Disparo Transacional */}
          <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-pink-500" />
                  Testar Envio Transacional para seu E-mail ({user?.email})
                </h4>
                <p className="text-xs text-muted-foreground">
                  Valide a composição, formatação e entrega de qualquer um dos 4 fluxos
                  transacionais.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={testEmailType}
                  onChange={(e) => setTestEmailType(e.target.value as any)}
                  className="text-xs bg-background border rounded-lg px-2.5 py-1.5 text-foreground"
                >
                  <option value="welcome">1. Boas-Vindas + 3 Passos</option>
                  <option value="subscription_active">2. Confirmação de Assinatura</option>
                  <option value="payment_failed">3. Falha de Cobrança / Recusa</option>
                  <option value="access_expired">4. Fim de Acesso PRO</option>
                </select>

                <Button
                  size="sm"
                  disabled={sendingTestEmail}
                  onClick={handleSendTestEmail}
                  className="text-xs gap-1.5 bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingTestEmail ? 'animate-spin' : ''}`} />
                  Disparar Teste
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
