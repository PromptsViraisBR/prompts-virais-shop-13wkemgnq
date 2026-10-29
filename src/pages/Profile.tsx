import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cancelSubscription } from '@/services/subscriptions'
import { getReferralOverview, ReferralOverviewResponse } from '@/services/freeLimitsAndReferrals'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  User,
  Mail,
  Crown,
  Sparkles,
  CreditCard,
  Calendar,
  LogOut,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Share2,
  Copy,
  Users,
  Gift,
  Check,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const Profile: React.FC = () => {
  const { user, subscription, plan, isPaidPlan, updateProfile, refreshSubscription, logout } =
    useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Programa de Indicação (Novo Sistema)
  const [referralData, setReferralData] = useState<ReferralOverviewResponse | null>(null)
  const [loadingReferrals, setLoadingReferrals] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  const loadReferralData = async () => {
    if (!user) return
    setLoadingReferrals(true)
    try {
      const res = await getReferralOverview()
      setReferralData(res)
    } catch (err) {
      console.warn('Erro ao carregar dados de indicação:', err)
    } finally {
      setLoadingReferrals(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadReferralData()
    }
  }, [user])

  /**
   * Cópia segura com fallback universal (navigator.clipboard + textarea oculta)
   * que passou por correções em navegadores mobile restritos e webviews.
   */
  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        console.warn('[Profile] navigator.clipboard falhou, tentando fallback...', err)
      }
    }

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
          /* intentionally ignored */
        }
      }
      let successful = false
      try {
        successful = document.execCommand('copy')
      } catch (cmdErr) {
        console.warn('[Profile] execCommand falhou:', cmdErr)
      }
      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea)
      }
      if (activeEl && typeof activeEl.focus === 'function') {
        try {
          activeEl.focus()
        } catch {
          /* intentionally ignored */
        }
      }
      return successful
    } catch (fallbackErr) {
      console.warn('[Profile] Erro contido no fallback de cópia:', fallbackErr)
      return false
    }
  }

  const handleCopyReferralLink = async () => {
    if (!referralData?.referral_link) return
    const ok = await copyTextToClipboard(referralData.referral_link)
    setCopiedRef(true)
    toast({
      title: ok ? 'Link copiado! 📋✨' : 'Link selecionado para cópia',
      description: 'Envie para seus amigos criadores ou compartilhe nas redes sociais.',
    })
    setTimeout(() => setCopiedRef(false), 2500)
  }

  const handleShareReferral = async () => {
    if (!referralData?.referral_link) return
    const isPro = referralData.is_pro
    const shareTitle = isPro
      ? 'Ganhe um mês grátis no Prompts Virais!'
      : 'Indique e ganhe gerações no Prompts Virais!'
    const shareText = isPro
      ? 'Conheça o Prompts Virais Shop! Cadastre-se pelo meu link exclusivo:'
      : 'Cadastre-se pelo meu link no Prompts Virais e desbloqueie roteiros virais para TikTok e Shopee:'

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: referralData.referral_link,
        })
        return
      } catch {
        /* fallback silencioso para cópia */
      }
    }
    await handleCopyReferralLink()
  }

  if (!user) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold">Você precisa estar conectado</h2>
        <p className="text-sm text-muted-foreground">
          Faça login para ver seu perfil, status do plano e indicações.
        </p>
        <Link to="/login">
          <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold">
            Ir para Login
          </Button>
        </Link>
      </div>
    )
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
      })
      toast({
        title: 'Perfil atualizado!',
        description: 'Seus dados foram salvos com sucesso.',
      })
    } catch (err: unknown) {
      console.error(err)
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancelSub = async () => {
    if (!subscription) return
    if (!confirm('Deseja realmente cancelar sua assinatura? Seu plano voltará para o Gratuito.')) {
      return
    }

    setCancelling(true)
    try {
      const res = await cancelSubscription(subscription.id)
      if (res.success) {
        await refreshSubscription()
        await loadReferralData()
        toast({
          title: 'Assinatura cancelada com sucesso',
          description: 'Seu plano agora é o Gratuito. Você não terá novas cobranças.',
        })
      } else {
        toast({
          title: 'Não foi possível cancelar',
          description: res.error || 'Ocorreu um erro ao cancelar. Tente novamente mais tarde.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao cancelar assinatura',
        description:
          err?.message || 'Falha de comunicação com o servidor. Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setCancelling(false)
    }
  }

  const planName =
    plan === 'annual' ? 'Anual VIP' : plan === 'monthly' ? 'PRO (Vídeo IA)' : 'Gratuito'

  const isProUser = Boolean(referralData ? referralData.is_pro : isPaidPlan)
  const freeStats = referralData?.free_stats
  const proStats = referralData?.pro_stats
  const proOpp = proStats?.opportunity_record
  const historyList = referralData?.history || []

  return (
    <div className="py-6 sm:py-12 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
            Meu Perfil & Assinatura
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Gerencie suas informações cadastrais, acompanhe seu plano e ganhe recompensas com
            indicações.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="text-destructive hover:bg-destructive/10 gap-2 shrink-0 self-start sm:self-auto min-h-[38px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </Button>
      </div>

      {/* =========================================================================
          CARD DE INDICAÇÕES: REGRAS NOVAS OFICIAIS
          1. PLANO GRÁTIS — INDICAÇÃO ILIMITADA (+5 GERAÇÕES POR CADASTRO NOVO)
          2. PLANO PRO — UMA INDICAÇÃO = ESTORNO DE 1 MENSALIDADE
          ========================================================================= */}
      {!isProUser ? (
        /* CARD PLANO GRÁTIS */
        <Card className="border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-amber-500/10 shadow-md overflow-hidden rounded-3xl">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-xs px-3 py-1 gap-1.5 shadow-xs">
                <Gift className="w-3.5 h-3.5" />
                Programa de Indicação • Plano Grátis
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold text-xs"
              >
                5 gerações por indicação — ilimitado.
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-foreground pt-1.5">
              Indique sem limites e ganhe gerações!
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Compartilhe seu link exclusivo. Cada nova pessoa que se cadastrar pelo seu link rende
              5 gerações extras para você. Quanto mais indicar, mais gerações poderá acumular!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            {/* Bloco de Cópia do Link (Permanente no Plano Grátis) */}
            <div className="p-4 rounded-2xl bg-background/90 border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-pink-500" />
                  Seu Link Exclusivo e Permanente:
                </span>
                {referralData?.referral_code && (
                  <span className="text-xs font-mono font-bold text-pink-600 bg-pink-500/10 px-2 py-0.5 rounded-md">
                    Código: {referralData.referral_code}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  readOnly
                  value={referralData?.referral_link || 'Carregando link exclusivo...'}
                  className="font-mono text-xs bg-muted/40 h-11 border-pink-500/30 select-all"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleCopyReferralLink}
                    disabled={!referralData?.referral_link}
                    className="h-11 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs gap-1.5 shrink-0 transition-all"
                  >
                    {copiedRef ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar meu link</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShareReferral}
                    disabled={!referralData?.referral_link}
                    className="h-11 px-3 border-pink-500/40 text-pink-600 hover:bg-pink-500/10 font-bold text-xs gap-1.5 shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Compartilhar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contadores Reais do Banco (Server-side) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl border bg-card/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-500 shrink-0" />
                  Indicadas
                </span>
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  {freeStats?.total_referred_users || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Cadastros vinculados</p>
              </div>

              <div className="p-3.5 rounded-2xl border bg-card/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  Válidas
                </span>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {freeStats?.valid_referrals || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Confirmadas no servidor</p>
              </div>

              <div className="p-3.5 rounded-2xl border bg-card/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  Gerações Ganhas
                </span>
                <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                  +{freeStats?.generations_earned || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">5 por cada nova conta</p>
              </div>

              <div className="p-3.5 rounded-2xl border bg-card/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-pink-500 shrink-0" />
                  Saldo Atual
                </span>
                <p className="text-xl sm:text-2xl font-black text-pink-600 dark:text-pink-400">
                  {freeStats?.current_balance || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Gerações acumuladas</p>
              </div>
            </div>

            {/* Histórico das Recompensas */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Histórico de Recompensas de Indicação:
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadReferralData}
                  disabled={loadingReferrals}
                  className="h-7 text-[11px] px-2 text-muted-foreground"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${loadingReferrals ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>

              {historyList.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed bg-muted/20 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    Você ainda não tem indicações registradas.
                  </p>
                  <p>
                    Compartilhe seu link exclusivo com amigos para começar a acumular gerações
                    extras!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {historyList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border bg-background/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground flex items-center gap-1.5">
                          <span>+5 Gerações Extras</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            • Amigo: <strong>{item.referred_user_name}</strong>
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Cadastro realizado em{' '}
                          {item.created ? new Date(item.created).toLocaleDateString('pt-BR') : '—'}
                          {item.processed_at ? ' • Processado no servidor' : ''}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 self-start sm:self-auto font-bold">
                        Creditado (+5)
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* CARD PLANO PRO */
        <Card className="border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-pink-500/10 shadow-lg overflow-hidden rounded-3xl">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-black text-xs px-3 py-1 gap-1.5 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-200" />
                Programa Exclusivo • Assinantes PRO
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-black text-xs"
              >
                Ganhe um mês grátis — uma indicação elegível.
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-foreground pt-1.5">
              Indique e ganhe um mês grátis!
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Você é PRO? Indique uma pessoa para assinar o PROMPTS VIRAIS. Quando ela contratar um
              plano PRO elegível e o pagamento for confirmado, você poderá receber o estorno de uma
              mensalidade. Benefício limitado a uma indicação por usuário.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            {/* Se ainda NÃO houver cadastro confirmado do indicado: exibe o link exclusivo */}
            {!proStats?.has_referral_registered ? (
              <div className="p-4 rounded-2xl bg-background/90 border border-amber-500/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-amber-500" />
                    Seu Link Exclusivo PRO (Oportunidade Única):
                  </span>
                  {referralData?.referral_code && (
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Código: {referralData.referral_code}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    readOnly
                    value={referralData?.referral_link || 'Carregando link exclusivo...'}
                    className="font-mono text-xs bg-muted/40 h-11 border-amber-500/40 select-all"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleCopyReferralLink}
                      disabled={!referralData?.referral_link}
                      className="h-11 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 text-white font-bold text-xs gap-1.5 shrink-0"
                    >
                      {copiedRef ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar meu link</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShareReferral}
                      disabled={!referralData?.referral_link}
                      className="h-11 px-3 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 font-bold text-xs gap-1.5 shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Compartilhar</span>
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Assim que seu amigo indicado concluir o cadastro pelo link, ele será vinculado à
                  sua recompensa e o link será recolhido da interface.
                </p>
              </div>
            ) : (
              /* REGRA PRO: Link REMOVIDO da interface após cadastro do indicado; registro mantido no banco */
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Indicação vinculada com sucesso! (Cota de 1 indicação PRO em andamento)
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Conforme as regras do plano PRO, o link de indicação foi recolhido da sua
                  interface porque você já vinculou 1 indicado (
                  <strong>{proOpp?.referred_user_name}</strong>). O registro histórico segue salvo
                  com segurança no banco de dados.
                </p>
              </div>
            )}

            {/* STATUS DO FLUXO NO PAINEL DO INDICADOR PRO */}
            <div className="p-4 rounded-2xl border bg-card/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Status da Sua Indicação PRO:
                </span>
                <Badge
                  className={
                    proStats?.stage === 'refund_confirmed'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold'
                      : proStats?.stage === 'pending_manual'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-bold'
                        : proStats?.stage === 'not_completed'
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 font-bold'
                  }
                >
                  {proStats?.stage_label || 'Aguardando cadastro'}
                </Badge>
              </div>

              {/* Linha de Progresso Visual dos 4 Passos do Fluxo PRO */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold space-y-0.5 ${
                    proStats?.has_referral_registered
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted/40 border-muted text-muted-foreground'
                  }`}
                >
                  <p className="font-bold">1. Cadastro</p>
                  <p className="text-[10px]">
                    {proStats?.has_referral_registered ? '✓ Confirmado' : 'Aguardando'}
                  </p>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold space-y-0.5 ${
                    proOpp?.referred_user_plan === 'monthly' ||
                    proOpp?.referred_user_plan === 'annual' ||
                    proOpp?.refund_status === 'refunded' ||
                    proOpp?.refund_status === 'refund_pending_manual'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted/40 border-muted text-muted-foreground'
                  }`}
                >
                  <p className="font-bold">2. Assinatura PRO</p>
                  <p className="text-[10px]">
                    {proOpp?.referred_user_plan === 'monthly' ||
                    proOpp?.referred_user_plan === 'annual'
                      ? '✓ Contratada'
                      : 'Aguardando'}
                  </p>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold space-y-0.5 ${
                    proOpp?.refund_status === 'refunded' ||
                    proOpp?.refund_status === 'refund_pending_manual' ||
                    proOpp?.refund_status === 'processing'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted/40 border-muted text-muted-foreground'
                  }`}
                >
                  <p className="font-bold">3. Pagamento MP</p>
                  <p className="text-[10px]">
                    {proOpp?.refund_status === 'refunded' ||
                    proOpp?.refund_status === 'refund_pending_manual'
                      ? '✓ Confirmado'
                      : 'Aguardando Webhook'}
                  </p>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold space-y-0.5 ${
                    proOpp?.refund_status === 'refunded'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : proOpp?.refund_status === 'refund_pending_manual'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                        : 'bg-muted/40 border-muted text-muted-foreground'
                  }`}
                >
                  <p className="font-bold">4. Estorno / Bônus</p>
                  <p className="text-[10px]">
                    {proOpp?.refund_status === 'refunded'
                      ? '✓ Estornado'
                      : proOpp?.refund_status === 'refund_pending_manual'
                        ? 'Pendente Manual'
                        : 'Aguardando'}
                  </p>
                </div>
              </div>

              {/* Detalhes do Estágio */}
              <div className="p-3 rounded-xl bg-muted/40 border text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">{proStats?.stage_detail}</p>
                {proOpp && (
                  <div className="pt-1 text-[11px] space-y-0.5">
                    <p>
                      • Indicado vinculado:{' '}
                      <strong className="text-foreground">{proOpp.referred_user_name}</strong>
                    </p>
                    <p>
                      • Data do cadastro:{' '}
                      {proOpp.created ? new Date(proOpp.created).toLocaleDateString('pt-BR') : '—'}
                    </p>
                    {proOpp.refund_status === 'refunded' && proOpp.mp_refund_id && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-mono">
                        • ID do Estorno MP: {proOpp.mp_refund_id}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid: Plano Atual e Dados Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Cartão de Assinatura */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Plano Atual
                </CardTitle>
                <Badge
                  className={
                    isPaidPlan
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {subscription?.status === 'active' ? 'Ativo' : 'Padrão'}
                </Badge>
              </div>
              <CardDescription>Seus benefícios de acesso e limites na plataforma.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-muted/40 border space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Nível de Acesso
                </span>
                <p className="text-xl font-extrabold text-foreground flex items-center gap-1.5">
                  {planName}
                  {isPaidPlan && <Sparkles className="w-4 h-4 text-amber-500" />}
                </p>
              </div>

              {subscription && isPaidPlan && (
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      Cartão Cadastrado:
                    </span>
                    <span className="font-mono text-foreground font-semibold">
                      {subscription.card_brand || 'Mastercard'} ••••{' '}
                      {subscription.card_last4 || '4242'}
                    </span>
                  </div>
                  {subscription.next_payment_date ? (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        Próxima Cobrança (MP)
                      </span>
                      <span className="text-foreground font-semibold">
                        {subscription.next_payment_date
                          ? new Date(subscription.next_payment_date).toLocaleDateString('pt-BR')
                          : '—'}
                      </span>
                    </div>
                  ) : subscription.end_date ? (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        Válido até
                      </span>
                      <span className="text-foreground font-semibold">
                        {subscription.end_date
                          ? new Date(subscription.end_date).toLocaleDateString('pt-BR')
                          : '—'}
                      </span>
                    </div>
                  ) : null}
                  {subscription.mp_preapproval_id && (
                    <div className="flex justify-between items-center text-[11px] pt-1 border-t text-muted-foreground font-mono">
                      <span>Assinatura MP:</span>
                      <span>{subscription.mp_preapproval_id.slice(0, 12)}...</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Biblioteca de prompts prontos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${isPaidPlan ? 'text-emerald-500' : 'text-muted-foreground/50'}`}
                  />
                  <span>
                    Gerador personalizado de catálogo (
                    {isPaidPlan ? 'Liberado' : 'Bloqueado no plano gratuito'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${isPaidPlan ? 'text-purple-500' : 'text-muted-foreground/50'}`}
                  />
                  <span>
                    Gerador de vídeo com IA até 10s (
                    {isPaidPlan ? 'Liberado no PRO/VIP' : 'Exclusivo PRO'})
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-2 border-t bg-muted/10">
              <Link to="/planos" className="w-full">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold text-xs min-h-[40px]">
                  {isPaidPlan ? 'Fazer Upgrade / Trocar Plano' : 'Assinar Plano PRO'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>

              {isPaidPlan && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSub}
                  disabled={cancelling}
                  className="w-full text-xs text-muted-foreground hover:text-destructive min-h-[36px]"
                >
                  {cancelling ? 'Cancelando...' : 'Cancelar Assinatura'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Dados Pessoais */}
        <div className="md:col-span-7 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-pink-500" />
                Dados Cadastrais
              </CardTitle>
              <CardDescription>Atualize seu nome de exibição e e-mail cadastrado.</CardDescription>
            </CardHeader>

            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-name"
                      placeholder="Seu nome"
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t flex justify-end">
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold min-h-[40px]"
                >
                  {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default Profile
