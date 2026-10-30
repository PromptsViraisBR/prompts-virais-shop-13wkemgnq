import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/context/AuthContext'
import {
  getAdminOverview,
  AdminOverviewResult,
  refundMercadoPagoPayment,
} from '@/services/mercadoPago'
import {
  getFunnelMetrics,
  resetAnalyticsData,
  FunnelMetricsResponse,
  ResetAnalyticsResponse,
} from '@/services/events'
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
  Trash2,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  getEmailStatus,
  runExpirationCheck,
  testTransactionalEmail,
  getEmailPreview,
  resendWelcomeEmails,
  EmailStatusResponse,
  TransactionalEmailType,
  ResendWelcomeEmailsResponse,
} from '@/services/emailAutomations'
import {
  listAdminUsers,
  deleteUserAccount,
  toggleUserWelcomeSent,
  AdminUserItem,
} from '@/services/adminUsers'
import {
  getHypeonLimits,
  updateHypeonLimit,
  getHypeonSourcesStatus,
  getHypeonUsageStats,
  HypeonLimitItem,
  SourcesStatusResponse,
  HypeonUsageStatsResponse,
} from '@/services/hypeon'
import { Eye, Search, UserX, UserCheck, Radio, Sliders, Activity, Bookmark } from 'lucide-react'

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<AdminOverviewResult | null>(null)
  const [cancellations, setCancellations] = useState<any[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([])
  const [usersSearch, setUsersSearch] = useState('')
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null)
  const [deletingUser, setDeletingUser] = useState(false)
  const [togglingWelcomeId, setTogglingWelcomeId] = useState<string | null>(null)

  // HYPEON Admin State
  const [hypeonLimits, setHypeonLimits] = useState<HypeonLimitItem[]>([])
  const [hypeonSources, setHypeonSources] = useState<SourcesStatusResponse | null>(null)
  const [hypeonStats, setHypeonStats] = useState<HypeonUsageStatsResponse | null>(null)
  const [editingLimit, setEditingLimit] = useState<HypeonLimitItem | null>(null)
  const [savingLimit, setSavingLimit] = useState(false)

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Funil de Conversão
  const [funnelPeriod, setFunnelPeriod] = useState<'today' | '7d' | '30d' | 'all'>('30d')
  const [funnelData, setFunnelData] = useState<FunnelMetricsResponse | null>(null)
  const [funnelLoading, setFunnelLoading] = useState(false)

  // Automações de e-mail (Fase D)
  const [emailStatus, setEmailStatus] = useState<EmailStatusResponse | null>(null)
  const [runningExpiration, setRunningExpiration] = useState(false)
  const [resendingWelcome, setResendingWelcome] = useState(false)
  const [welcomeResultModalOpen, setWelcomeResultModalOpen] = useState(false)
  const [welcomeResult, setWelcomeResult] = useState<ResendWelcomeEmailsResponse | null>(null)
  const [sendingTestEmail, setSendingTestEmail] = useState(false)
  const [testEmailType, setTestEmailType] = useState<TransactionalEmailType>('pix_reminder')
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Modal de Zerar / Limpar Dados de Teste
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resettingData, setResettingData] = useState(false)
  const [resetResult, setResetResult] = useState<ResetAnalyticsResponse | null>(null)

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
      const [res, fRes, eRes, cRes, fbRes, uRes, hlRes, hsRes, hstRes] = await Promise.allSettled([
        getAdminOverview(),
        getFunnelMetrics(funnelPeriod),
        getEmailStatus(),
        pb.collection('events').getList(1, 20, {
          filter: 'event_type = "subscription_cancelled"',
          sort: '-created',
        }),
        pb.collection('feedback').getList(1, 30, {
          sort: '-created',
        }),
        listAdminUsers(),
        getHypeonLimits(),
        getHypeonSourcesStatus(),
        getHypeonUsageStats(),
      ])

      if (hlRes.status === 'fulfilled') {
        setHypeonLimits(hlRes.value.limits || [])
      }
      if (hsRes.status === 'fulfilled') {
        setHypeonSources(hsRes.value)
      }
      if (hstRes.status === 'fulfilled') {
        setHypeonStats(hstRes.value)
      }

      let criticalError = ''
      if (res.status === 'fulfilled') {
        setData(res.value)
      } else {
        console.error('getAdminOverview error:', res.reason)
        criticalError =
          res.reason?.data?.error || res.reason?.message || 'Erro ao carregar visão geral do admin.'
      }

      if (fRes.status === 'fulfilled') {
        setFunnelData(fRes.value)
      } else {
        console.warn('getFunnelMetrics warning:', fRes.reason)
      }

      if (eRes.status === 'fulfilled') {
        setEmailStatus(eRes.value)
      } else {
        console.warn('getEmailStatus warning:', eRes.reason)
      }

      if (cRes.status === 'fulfilled') {
        setCancellations(cRes.value.items || [])
      } else {
        console.warn('getCancellations warning:', cRes.reason)
      }

      if (fbRes.status === 'fulfilled') {
        setFeedbacks(fbRes.value.items || [])
      } else {
        console.warn('getFeedback warning:', fbRes.reason)
      }

      if (uRes.status === 'fulfilled') {
        setAdminUsers(uRes.value.users || [])
      } else {
        console.warn('listAdminUsers warning:', uRes.reason)
      }

      // Se falhou por autenticação/permissão em ambos ou se não obteve os dados principais
      if (!data && res.status === 'rejected') {
        setErrorMsg(criticalError || 'Falha ao carregar painel administrativo.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.data?.error || err?.message || 'Falha ao carregar painel administrativo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      navigate('/login')
      return
    }

    const email = (user.email || '').toLowerCase().trim()
    const isUserAdmin = Boolean(
      isAdmin || user.is_admin || email === 'juniorrodriguesjr123.jr@gmail.com',
    )

    if (!isUserAdmin) {
      setErrorMsg('Acesso restrito. Sua conta não possui privilégios de administrador.')
      setLoading(false)
      return
    }

    loadOverview()
  }, [user, isAdmin, authLoading, navigate])

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
      const pixCount = res.pix_reminders_count || 0
      toast({
        title: 'Varredura e lembretes concluídos',
        description: `${res.expired_count} vencidas processadas, ${pixCount} lembretes Pix verificados/enviados.`,
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

  const handleResendWelcomeEmails = async () => {
    setResendingWelcome(true)
    try {
      const res = await resendWelcomeEmails()
      setWelcomeResult(res)
      setWelcomeResultModalOpen(true)
      const countEnviados = res.enviados?.length || 0
      const countFalhas = res.falhas?.length || 0

      if (countEnviados > 0 && countFalhas === 0) {
        toast({
          title: 'E-mails de boas-vindas reenviados com sucesso!',
          description: `${countEnviados} usuário(s) receberam o guia de boas-vindas.`,
        })
      } else if (countEnviados > 0 && countFalhas > 0) {
        toast({
          title: 'Envio parcial de boas-vindas',
          description: `${countEnviados} enviado(s), ${countFalhas} falha(s). Verifique os detalhes na tela.`,
          variant: 'destructive',
        })
      } else if (countEnviados === 0 && countFalhas === 0) {
        toast({
          title: 'Nenhum e-mail pendente',
          description:
            'Todos os usuários cadastrados já receberam o e-mail de boas-vindas anteriormente.',
        })
      } else {
        toast({
          title: 'Falha no envio dos e-mails',
          description: `${countFalhas} falha(s) registrada(s). Verifique os detalhes e credenciais SMTP.`,
          variant: 'destructive',
        })
      }
      await loadOverview()
    } catch (err: any) {
      toast({
        title: 'Erro ao reenviar boas-vindas',
        description: err?.message || 'Falha na comunicação com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setResendingWelcome(false)
    }
  }

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true)
    try {
      const res = await testTransactionalEmail(testEmailType, user?.email)
      toast({
        title: res.sent_via_mailer ? 'E-mail enviado via Mailer' : 'Disparo processado com sucesso',
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

  const handleOpenPreview = async () => {
    setLoadingPreview(true)
    try {
      const preview = await getEmailPreview(testEmailType)
      setPreviewSubject(preview.subject)
      setPreviewHtml(preview.html)
      setPreviewModalOpen(true)
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar preview',
        description: err?.message || 'Não foi possível renderizar o template.',
        variant: 'destructive',
      })
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    // Proteção contra autoexclusão no front
    if (userToDelete.id === user?.id) {
      toast({
        title: 'Ação não permitida',
        description: 'Você não pode excluir a sua própria conta logada de administrador.',
        variant: 'destructive',
      })
      setUserToDelete(null)
      return
    }

    setDeletingUser(true)
    try {
      const res = await deleteUserAccount(userToDelete.id)
      if (res.success) {
        toast({
          title: 'Conta excluída com sucesso!',
          description: `A conta de ${userToDelete.name || userToDelete.email} (${userToDelete.email}) foi removida permanentemente.`,
        })
        // Atualiza a lista na hora sem quebrar nada
        setAdminUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
        setUserToDelete(null)
        // Recarregar métricas em background
        loadOverview()
      } else {
        toast({
          title: 'Erro ao excluir conta',
          description: res.error || 'Não foi possível excluir o usuário.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir conta',
        description: err?.message || 'Falha na comunicação com o backend.',
        variant: 'destructive',
      })
    } finally {
      setDeletingUser(false)
    }
  }

  const handleSaveHypeonLimit = async () => {
    if (!editingLimit) return
    setSavingLimit(true)
    try {
      await updateHypeonLimit({
        tool_id: editingLimit.tool_id,
        free_limit_daily: editingLimit.free_limit_daily,
        pro_limit_daily: editingLimit.pro_limit_daily,
        credit_cost: editingLimit.credit_cost,
        is_active: editingLimit.is_active,
        description: editingLimit.description,
      })
      toast({
        title: 'Limites atualizados!',
        description: `Configuração da ferramenta "${editingLimit.tool_name}" salva no servidor.`,
      })
      setHypeonLimits((prev) =>
        prev.map((l) => (l.tool_id === editingLimit.tool_id ? editingLimit : l)),
      )
      setEditingLimit(null)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar limites',
        description: err?.message || 'Falha ao atualizar limite.',
        variant: 'destructive',
      })
    } finally {
      setSavingLimit(false)
    }
  }

  const handleToggleWelcomeSent = async (u: AdminUserItem) => {
    setTogglingWelcomeId(u.id)
    try {
      const targetVal = !u.welcome_email_sent
      const res = await toggleUserWelcomeSent(u.id, targetVal)
      if (res.success) {
        toast({
          title: 'Status atualizado',
          description: `Boas-vindas marcada como ${res.welcome_email_sent ? 'enviada' : 'pendente'} para ${u.email}.`,
        })
        setAdminUsers((prev) =>
          prev.map((item) =>
            item.id === u.id ? { ...item, welcome_email_sent: res.welcome_email_sent } : item,
          ),
        )
      } else {
        toast({
          title: 'Erro ao atualizar',
          description: res.error || 'Não foi possível alterar o status de boas-vindas.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar',
        description: err?.message || 'Falha na comunicação com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setTogglingWelcomeId(null)
    }
  }

  const filteredUsers = adminUsers.filter((u) => {
    if (!usersSearch.trim()) return true
    const term = usersSearch.toLowerCase().trim()
    const nameMatch = (u.name || '').toLowerCase().includes(term)
    const emailMatch = (u.email || '').toLowerCase().includes(term)
    const idMatch = (u.id || '').toLowerCase().includes(term)
    return nameMatch || emailMatch || idMatch
  })

  const handleResetAnalytics = async () => {
    setResettingData(true)
    try {
      const res = await resetAnalyticsData()
      setResetResult(res)
      toast({
        title: 'Dados de teste zerados!',
        description: `${res.deleted_counts.events} eventos e ${res.deleted_counts.payments_history} pagamentos de teste foram removidos. O painel está pronto para novos acessos reais.`,
      })
      await loadOverview()
    } catch (err: any) {
      toast({
        title: 'Erro ao zerar dados',
        description: err?.message || 'Falha ao executar limpeza de estatísticas.',
        variant: 'destructive',
      })
    } finally {
      setResettingData(false)
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

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setResetResult(null)
              setResetModalOpen(true)
            }}
            className="gap-1.5 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            Limpar dados de teste
          </Button>
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

      {/* SEÇÃO: HYPEON ADMIN — LIMITES POR FERRAMENTA & FONTES DE TENDÊNCIAS */}
      <Card className="border-2 border-purple-500/30 bg-slate-950 text-slate-100 shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-purple-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                <span>Gestão HYPEON — Limites, Fontes & Estatísticas</span>
                <Badge className="bg-purple-600 text-white text-[10px] uppercase font-mono">
                  FASE 5
                </Badge>
              </CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              Configure limites diários por ferramenta, monitore conexões das fontes oficiais e
              visualize métricas da nova divisão.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/hypeon">
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 text-xs font-bold h-9 px-3.5 rounded-xl gap-1.5"
              >
                <span>Acessar /hypeon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          {/* Status das Fontes de Tendências (YouTube Data API, etc.) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Painel de Fontes de Tendências (APIs Oficiais)</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                Sem dados fictícios • Processamento server-side
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hypeonSources?.sources ? (
                Object.values(hypeonSources.sources).map((src) => (
                  <div
                    key={src.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                      src.connected
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-white">{src.name}</span>
                        <Badge
                          className={`text-[9px] uppercase font-mono font-bold ${
                            src.connected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {src.connected ? 'Conectado / Ativo' : 'Desconectado'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{src.description}</p>
                      {src.status_detail && (
                        <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                          Status: {src.status_detail}
                        </p>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">
                        Segredo: {src.required_secret}
                      </span>
                      <span className="font-semibold">
                        {src.connected ? '✓ Conexão Ativa' : '⚠ Pendente'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                  Consultando fontes no servidor...
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas de Uso HYPEON */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                Vídeos Salvos no Radar
              </span>
              <p className="text-2xl font-black text-white">
                {hypeonStats?.stats.total_saved_videos ?? 0}
              </p>
              <p className="text-[11px] text-slate-400">Referências armazenadas</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Módulos Ativos no Ar
              </span>
              <p className="text-2xl font-black text-emerald-400">
                {hypeonStats?.stats.active_tools_count ?? 3} / 8
              </p>
              <p className="text-[11px] text-slate-400">Radar, Tendências, Biblioteca</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-400" />
                Próximas Fases (Roadmap)
              </span>
              <p className="text-2xl font-black text-pink-400">
                {hypeonStats?.stats.planned_tools_count ?? 5}
              </p>
              <p className="text-[11px] text-slate-400">Clonador, Stories, Ideas...</p>
            </div>
          </div>

          {/* Tabela de Limites por Ferramenta */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Configuração de Limites por Ferramenta (Coleção hypeon_limits)</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                Aplicado no servidor via hook • Respeita planos existentes
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs min-w-[680px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Ferramenta</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Limite Grátis / Dia</th>
                    <th className="py-2.5 px-3 text-center">Limite PRO / Dia</th>
                    <th className="py-2.5 px-3 text-center">Custo em Créditos</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                  {hypeonLimits.map((tool) => (
                    <tr key={tool.tool_id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div className="flex flex-col">
                          <span>{tool.tool_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            id: {tool.tool_id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={`text-[9px] uppercase font-bold ${
                            tool.is_active
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {tool.is_active ? 'Ativa' : 'Fase Futura'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                        {tool.free_limit_daily} / dia
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-purple-300">
                        {tool.pro_limit_daily} / dia
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {tool.credit_cost > 0 ? `${tool.credit_cost} crédito(s)` : '0 (incluso)'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingLimit({ ...tool })}
                          className="h-7 px-2.5 text-xs border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
                        >
                          Editar Limites
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE EDIÇÃO DE LIMITES HYPEON */}
      <Dialog
        open={Boolean(editingLimit)}
        onOpenChange={(val) => {
          if (!val) setEditingLimit(null)
        }}
      >
        <DialogContent className="max-w-md bg-slate-950 text-slate-100 border border-purple-500/40 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <span>Editar Limites: {editingLimit?.tool_name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Ajuste as regras de cota diária por plano. Alterações refletem imediatamente no
              backend.
            </DialogDescription>
          </DialogHeader>

          {editingLimit && (
            <div className="space-y-4 py-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Limite Grátis Diário (Gerações/Consultas)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingLimit.free_limit_daily}
                  onChange={(e) =>
                    setEditingLimit({
                      ...editingLimit,
                      free_limit_daily: parseInt(e.target.value || '0', 10),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Limite PRO Diário (Assinantes Mensal e Anual)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingLimit.pro_limit_daily}
                  onChange={(e) =>
                    setEditingLimit({
                      ...editingLimit,
                      pro_limit_daily: parseInt(e.target.value || '0', 10),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Custo em Créditos Extras (quando esgotado o plano)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingLimit.credit_cost}
                  onChange={(e) =>
                    setEditingLimit({
                      ...editingLimit,
                      credit_cost: parseInt(e.target.value || '0', 10),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="tool_is_active"
                  checked={editingLimit.is_active}
                  onChange={(e) =>
                    setEditingLimit({
                      ...editingLimit,
                      is_active: e.target.checked,
                    })
                  }
                  className="rounded border-slate-700 bg-slate-900"
                />
                <label
                  htmlFor="tool_is_active"
                  className="text-xs text-slate-300 font-semibold cursor-pointer"
                >
                  Ferramenta Ativa para Usuários (Fase Atual)
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingLimit(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={savingLimit}
              onClick={handleSaveHypeonLimit}
              className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white"
            >
              {savingLimit ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={resendingWelcome}
              onClick={handleResendWelcomeEmails}
              className="text-xs gap-1.5 border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
            >
              <Send className={`w-3.5 h-3.5 ${resendingWelcome ? 'animate-spin' : ''}`} />
              Reenviar boas-vindas para quem não recebeu
            </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl border bg-card space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Boas-Vindas Enviados
              </span>
              <p className="text-2xl font-black text-foreground">
                {emailStatus?.metrics.welcome_emails_sent ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Cadastros orientados</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30 space-y-1">
              <span className="text-xs text-pink-700 dark:text-pink-300 font-bold">
                Lembretes Pix (3 Dias)
              </span>
              <p className="text-2xl font-black text-pink-600 dark:text-pink-400">
                {emailStatus?.metrics.pix_reminders_notified ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Idempotência por ciclo</p>
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
              <p className="text-[11px] text-muted-foreground">Ao expirar</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Recusa / Falha MP</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">Ativo</p>
              <p className="text-[11px] text-muted-foreground">Disparo em rejected</p>
            </div>
          </div>

          {/* Teste Rápido de Disparo Transacional e Preview */}
          <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-pink-500" />
                  Testar / Pré-visualizar E-mail Transacional ({user?.email})
                </h4>
                <p className="text-xs text-muted-foreground">
                  Valide a formatação, links e entrega dos templates incluindo o lembrete de
                  renovação Pix.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={testEmailType}
                  onChange={(e) => setTestEmailType(e.target.value as TransactionalEmailType)}
                  className="text-xs bg-background border rounded-lg px-2.5 py-1.5 text-foreground max-w-[260px]"
                >
                  <option value="pix_reminder">⏰ Lembrete Renovação Pix (3 Dias Antes)</option>
                  <option value="welcome">✨ 1. Boas-Vindas + 3 Passos</option>
                  <option value="subscription_active">🎉 2. Confirmação de Assinatura</option>
                  <option value="payment_failed">⚠️ 3. Falha de Cobrança / Recusa</option>
                  <option value="access_expired">⌛ 4. Fim de Acesso PRO</option>
                </select>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingPreview}
                  onClick={handleOpenPreview}
                  className="text-xs gap-1.5"
                >
                  <Eye className={`w-3.5 h-3.5 ${loadingPreview ? 'animate-spin' : ''}`} />
                  Ver Preview
                </Button>

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

      {/* SEÇÃO: GESTÃO DE USUÁRIOS E CONTAS */}
      <Card className="border-2 border-pink-500/20 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-pink-500" />
              Gestão de Contas de Usuários ({adminUsers.length})
            </CardTitle>
            <CardDescription>
              Consulte usuários cadastrados, gerencie o status de boas-vindas e exclua contas de
              teste com segurança sem quebrar o funil.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead>
                <tr className="border-b text-muted-foreground font-semibold">
                  <th className="pb-2">Usuário / Nome</th>
                  <th className="pb-2">E-mail</th>
                  <th className="pb-2">Plano / Status</th>
                  <th className="pb-2">Boas-Vindas</th>
                  <th className="pb-2">Cadastro</th>
                  <th className="pb-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      {usersSearch
                        ? 'Nenhum usuário corresponde à busca.'
                        : 'Nenhum usuário encontrado.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.id === user?.id
                    const isSuperAdminEmail =
                      (u.email || '').toLowerCase() === 'juniorrodriguesjr123.jr@gmail.com'

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-muted/30 ${isSelf ? 'bg-pink-500/5' : ''}`}
                      >
                        <td className="py-2.5 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {u.name || 'Sem nome'}
                            </span>
                            {u.is_admin && (
                              <Badge className="bg-pink-600 text-white text-[9px] px-1.5 py-0 uppercase">
                                Admin
                              </Badge>
                            )}
                            {isSelf && (
                              <Badge
                                variant="outline"
                                className="text-[9px] text-pink-600 border-pink-500/30 px-1.5 py-0"
                              >
                                Você (Logado)
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {u.id}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className="font-mono text-foreground text-[11px] block truncate max-w-[200px]"
                            title={u.email}
                          >
                            {u.email}
                          </span>
                          {u.verified ? (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 inline" /> Verificado
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              Não verificado
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase font-bold ${
                                u.active_plan === 'monthly' || u.active_plan === 'annual'
                                  ? 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {u.active_plan || 'free'}
                            </Badge>
                            {u.subscription_status && u.subscription_status !== 'none' && (
                              <span className="text-[10px] text-muted-foreground">
                                ({u.subscription_status})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            {u.welcome_email_sent ? (
                              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px] font-bold">
                                Enviado
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-500/30 bg-amber-500/10 text-[10px] font-semibold"
                              >
                                Pendente
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={togglingWelcomeId === u.id}
                              onClick={() => handleToggleWelcomeSent(u)}
                              title={
                                u.welcome_email_sent
                                  ? 'Marcar como pendente de e-mail'
                                  : 'Marcar boas-vindas como enviada'
                              }
                              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                            >
                              {togglingWelcomeId === u.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : u.welcome_email_sent ? (
                                'Desmarcar'
                              ) : (
                                'Marcar enviada'
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="py-2.5 text-muted-foreground text-[11px] whitespace-nowrap">
                          {u.created
                            ? new Date(u.created).toLocaleString('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })
                            : '—'}
                        </td>
                        <td className="py-2.5 text-right whitespace-nowrap">
                          {isSelf ? (
                            <span
                              className="text-[10px] text-muted-foreground italic px-2 py-1 bg-muted/40 rounded"
                              title="Você não pode excluir sua própria conta de administrador logada"
                            >
                              Conta própria (protegida)
                            </span>
                          ) : isSuperAdminEmail ? (
                            <span
                              className="text-[10px] text-muted-foreground italic px-2 py-1 bg-muted/40 rounded"
                              title="Conta mestre do administrador"
                            >
                              Admin Mestre
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setUserToDelete(u)}
                              className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive hover:text-destructive-foreground gap-1 border-destructive/30"
                            >
                              <UserX className="w-3 h-3" />
                              Excluir conta
                            </Button>
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

      {/* Grid: Tabela de Assinaturas & Histórico de Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* NOVA SEÇÃO: CANCELAMENTOS RECENTES & STATUS DO ESTORNO */}
        <Card className="border-2 border-rose-500/20 lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <RotateCcw className="w-5 h-5 text-rose-500" />
                Cancelamentos Recentes & Auditoria de Estornos ({cancellations.length})
              </CardTitle>
              <CardDescription>
                Histórico detalhado de cancelamentos. Estornos automáticos tentados pelo MP em até 7
                dias e alertas para reembolso manual.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-semibold self-start sm:self-auto border-rose-500/30 text-rose-600"
            >
              Notificação por e-mail ativa
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="pb-2">Data / Hora</th>
                    <th className="pb-2">Usuário</th>
                    <th className="pb-2">Plano</th>
                    <th className="pb-2">Valor</th>
                    <th className="pb-2">Status do Estorno</th>
                    <th className="pb-2">ID Pagamento MP</th>
                    <th className="pb-2">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cancellations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">
                        Nenhum cancelamento registrado recentemente.
                      </td>
                    </tr>
                  ) : (
                    cancellations.map((ev) => {
                      let meta: any = {}
                      try {
                        meta =
                          typeof ev.metadata === 'string'
                            ? JSON.parse(ev.metadata)
                            : ev.metadata || {}
                      } catch (_) {
                        meta = {}
                      }

                      const refundSuccess =
                        meta.refund_success === true ||
                        meta.refund_status === 'estornado automaticamente'
                      const isPendingManual =
                        meta.refund_status?.includes('PENDENTE') ||
                        (meta.refund_attempted && !refundSuccess)
                      const clientName = meta.user_name || 'Cliente'
                      const clientEmail = meta.user_email || ev.user || '—'
                      const planLabel = meta.plan || 'Plano'
                      const amountVal = meta.refund_amount
                        ? `R$ ${Number(meta.refund_amount).toFixed(2).replace('.', ',')}`
                        : '—'

                      return (
                        <tr key={ev.id} className="hover:bg-muted/30">
                          <td className="py-2.5 text-muted-foreground whitespace-nowrap">
                            {ev.created
                              ? new Date(ev.created).toLocaleString('pt-BR', {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })
                              : '—'}
                          </td>
                          <td className="py-2.5 font-medium">
                            <span className="block truncate max-w-[160px]" title={clientEmail}>
                              {clientName}
                            </span>
                            <span className="block text-[10px] text-muted-foreground truncate max-w-[160px]">
                              {clientEmail}
                            </span>
                          </td>
                          <td className="py-2.5 uppercase font-bold text-[10px]">
                            <Badge variant="outline">{planLabel}</Badge>
                          </td>
                          <td className="py-2.5 font-bold text-foreground">{amountVal}</td>
                          <td className="py-2.5">
                            {refundSuccess ? (
                              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px] font-bold">
                                Estornado Automaticamente
                              </Badge>
                            ) : isPendingManual ? (
                              <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/40 text-[10px] font-extrabold animate-pulse">
                                PENDENTE DE ESTORNO MANUAL
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-muted-foreground"
                              >
                                {meta.refund_status || 'Processado'}
                              </Badge>
                            )}
                          </td>
                          <td className="py-2.5 font-mono text-[10px] text-muted-foreground">
                            {meta.payment_id || '—'}
                          </td>
                          <td
                            className="py-2.5 text-[11px] text-muted-foreground max-w-xs truncate"
                            title={meta.refund_reason}
                          >
                            {meta.refund_reason ||
                              meta.reason ||
                              'Cancelamento solicitado pelo usuário'}
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

        {/* NOVA SEÇÃO: FEEDBACKS & RELATOS DOS USUÁRIOS */}
        <Card className="border-2 border-indigo-500/20 lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Feedbacks, Ideias e Relatos de Bugs Recebidos ({feedbacks.length})
              </CardTitle>
              <CardDescription>
                Mensagens enviadas pelos usuários e visitantes através do botão de feedback da
                landing page.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="pb-2">Data</th>
                    <th className="pb-2">Categoria</th>
                    <th className="pb-2">Remetente</th>
                    <th className="pb-2">E-mail</th>
                    <th className="pb-2">Mensagem</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        Nenhum feedback recebido ainda. As sugestões enviadas no site aparecerão
                        aqui.
                      </td>
                    </tr>
                  ) : (
                    feedbacks.map((fb) => (
                      <tr key={fb.id} className="hover:bg-muted/30">
                        <td className="py-2.5 text-muted-foreground whitespace-nowrap">
                          {fb.created
                            ? new Date(fb.created).toLocaleString('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })
                            : '—'}
                        </td>
                        <td className="py-2.5">
                          <Badge
                            className={`text-[10px] capitalize ${
                              fb.category === 'bug'
                                ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                                : fb.category === 'idea'
                                  ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                                  : fb.category === 'compliment'
                                    ? 'bg-pink-500/15 text-pink-600 border-pink-500/30'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {fb.category || 'outro'}
                          </Badge>
                        </td>
                        <td className="py-2.5 font-medium">{fb.name || 'Visitante'}</td>
                        <td className="py-2.5 text-muted-foreground">
                          {fb.email ? (
                            <a
                              href={`mailto:${fb.email}`}
                              className="text-pink-600 hover:underline"
                            >
                              {fb.email}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 max-w-md text-foreground whitespace-pre-wrap leading-relaxed">
                          {fb.message}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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
              <table className="w-full text-left text-xs min-w-[500px]">
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
              <table className="w-full text-left text-xs min-w-[500px]">
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

      {/* Modal de Confirmação para Exclusão de Conta de Usuário */}
      <Dialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mb-2">
              <UserX className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-rose-600 dark:text-rose-400">
              Excluir Conta de Usuário?
            </DialogTitle>
            <DialogDescription className="text-sm space-y-2 pt-1 text-muted-foreground">
              <p>Tem certeza que deseja excluir esta conta de usuário permanentemente?</p>
              <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1.5 border">
                <div>
                  <span className="font-semibold text-foreground">Nome: </span>
                  <span>{userToDelete?.name || '(sem nome)'}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">E-mail: </span>
                  <span className="font-mono text-foreground font-bold">{userToDelete?.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">ID do Usuário: </span>
                  <span className="font-mono">{userToDelete?.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Plano Atual: </span>
                  <span className="uppercase font-bold">{userToDelete?.active_plan || 'free'}</span>
                </div>
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                ⚠️ AVISO: Todos os registros vinculados a este usuário (assinaturas, favoritos,
                histórico de gerações e eventos) serão limpos com segurança para não deixar
                registros órfãos nem quebrar o funil. Esta ação é irreversível.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={deletingUser}
              onClick={() => setUserToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingUser}
              onClick={handleDeleteUser}
              className="gap-1.5"
            >
              {deletingUser ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Excluindo conta...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Sim, excluir conta permanentemente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Preview de E-mail Transacional */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-pink-500" />
              Preview do Template: {previewSubject}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Visualização exata de como o e-mail será renderizado na caixa de entrada do cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto border rounded-xl bg-slate-950 p-2 my-2">
            <iframe
              title="Preview do E-mail"
              srcDoc={previewHtml}
              className="w-full h-[450px] border-0 rounded-lg bg-transparent"
              sandbox="allow-same-origin"
            />
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
            <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
              Destino do teste: {user?.email}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewModalOpen(false)}>
                Fechar
              </Button>
              <Button
                size="sm"
                disabled={sendingTestEmail}
                onClick={async () => {
                  await handleSendTestEmail()
                  setPreviewModalOpen(false)
                }}
                className="gap-1.5 bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Send className="w-3.5 h-3.5" />
                Disparar para meu e-mail
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal com Relatório de Reenvio de Boas-Vindas */}
      <Dialog open={welcomeResultModalOpen} onOpenChange={setWelcomeResultModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
              <Mail className="w-5 h-5 text-pink-500" />
              Resultado do Reenvio de Boas-Vindas
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Relatório do processamento de e-mails para usuários que ainda não tinham a flag de
              boas-vindas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg border bg-muted/40">
                <span className="text-[11px] text-muted-foreground block">Pendentes</span>
                <strong className="text-lg font-bold">{welcomeResult?.total_pendentes ?? 0}</strong>
              </div>
              <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span className="text-[11px] block">Enviados</span>
                <strong className="text-lg font-bold">
                  {welcomeResult?.enviados?.length ?? 0}
                </strong>
              </div>
              <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400">
                <span className="text-[11px] block">Falhas</span>
                <strong className="text-lg font-bold">{welcomeResult?.falhas?.length ?? 0}</strong>
              </div>
            </div>

            {welcomeResult?.enviados && welcomeResult.enviados.length > 0 && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>E-mails entregues com sucesso ({welcomeResult.enviados.length}):</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground pl-1 max-h-32 overflow-y-auto">
                  {welcomeResult.enviados.map((em, idx) => (
                    <li key={idx} className="font-mono text-[11px] text-foreground">
                      {em}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Estes usuários tiveram o campo{' '}
                  <code className="font-mono text-emerald-600">welcome_email_sent = true</code>{' '}
                  atualizado e não receberão novamente.
                </p>
              </div>
            )}

            {welcomeResult?.falhas && welcomeResult.falhas.length > 0 && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Falhas no envio ({welcomeResult.falhas.length}):</span>
                </div>
                <ul className="space-y-1 text-muted-foreground max-h-32 overflow-y-auto">
                  {welcomeResult.falhas.map((f, idx) => (
                    <li key={idx} className="p-2 rounded bg-background/60 border text-[11px]">
                      <div className="font-mono font-bold text-foreground">
                        {f.email || '(sem e-mail)'}
                      </div>
                      <div className="text-rose-600 dark:text-rose-400 break-words">{f.erro}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {welcomeResult && welcomeResult.total_pendentes === 0 && (
              <div className="p-4 rounded-xl border bg-muted/30 text-center space-y-1">
                <p className="text-sm font-semibold text-foreground">Nenhum usuário pendente</p>
                <p className="text-xs text-muted-foreground">
                  Todos os usuários da base de dados já receberam o e-mail de boas-vindas com
                  sucesso anteriormente.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setWelcomeResultModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação para Limpar / Zerar Dados de Teste */}
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Zerar Dados de Teste do Painel
            </DialogTitle>
            <DialogDescription>
              Limpe o histórico de métricas, eventos de navegação, funil e pagamentos de teste para
              começar a divulgação com métricas 100% limpas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 space-y-2 text-xs">
              <p className="font-semibold text-rose-700 dark:text-rose-300">
                ⚠️ O que será apagado e zerado:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                <li>
                  <strong className="text-foreground">Eventos do funil</strong> (visitas de página,
                  inícios de checkout, cliques de teste, visualizações de planos);
                </li>
                <li>
                  <strong className="text-foreground">Histórico de pagamentos de teste</strong> da
                  coleção payments_history;
                </li>
                <li>
                  <strong className="text-foreground">Contadores de uso diário de teste</strong>{' '}
                  (daily_generation_usage) e créditos de vídeo de teste;
                </li>
                <li>
                  <strong className="text-foreground">Flags de auditoria de e-mails</strong>{' '}
                  (welcome_email_sent, lembretes de PIX e notificações de teste).
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 space-y-2 text-xs">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                🛡️ O que permanece 100% SEGURO (não será alterado):
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                <li>
                  <strong className="text-foreground">Contas de usuários</strong> (contas criadas,
                  login e perfis permanecem intactos);
                </li>
                <li>
                  <strong className="text-foreground">Assinaturas ativas</strong> e status de planos
                  dos usuários;
                </li>
                <li>
                  <strong className="text-foreground">Biblioteca de Prompts</strong> (todos os
                  prompts e modelos cadastrados);
                </li>
                <li>
                  <strong className="text-foreground">Favoritos</strong> dos usuários.
                </li>
              </ul>
            </div>

            {resetResult && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs space-y-1">
                <p className="font-bold text-emerald-700 dark:text-emerald-300">
                  ✅ Limpeza realizada com sucesso!
                </p>
                <p className="text-muted-foreground">
                  Eventos removidos: {resetResult.deleted_counts.events} | Pagamentos de teste:{' '}
                  {resetResult.deleted_counts.payments_history} | Usos diários:{' '}
                  {resetResult.deleted_counts.daily_generation_usage}.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetModalOpen(false)}
              disabled={resettingData}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleResetAnalytics}
              disabled={resettingData}
              className="gap-1.5"
            >
              {resettingData ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Limpando dados...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Sim, zerar dados de teste
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
