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
  Key,
  Cpu,
  Eye,
  EyeOff,
  Zap,
  Share2,
  Copy,
  Users,
  Gift,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const Profile: React.FC = () => {
  const { user, subscription, plan, isPaidPlan, updateProfile, refreshSubscription, logout } =
    useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [xaiApiKey, setXaiApiKey] = useState(user?.xai_api_key || '')
  const [googleAiApiKey, setGoogleAiApiKey] = useState(user?.google_ai_api_key || '')
  const [showXaiKey, setShowXaiKey] = useState(false)
  const [showGoogleKey, setShowGoogleKey] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Programa de Indicação (Afiliados)
  const [referralData, setReferralData] = useState<ReferralOverviewResponse | null>(null)
  const [copiedRef, setCopiedRef] = useState(false)

  useEffect(() => {
    if (user) {
      getReferralOverview()
        .then((res) => setReferralData(res))
        .catch((err) => console.warn('Erro ao carregar dados de indicação:', err))
    }
  }, [user])

  const handleCopyReferralLink = () => {
    if (!referralData) return
    navigator.clipboard.writeText(referralData.referral_link)
    setCopiedRef(true)
    toast({
      title: 'Link copiado! 📋✨',
      description: 'Envie para seus amigos criadores ou compartilhe nas redes sociais.',
    })
    setTimeout(() => setCopiedRef(false), 2500)
  }

  const handleShareReferral = async () => {
    if (!referralData) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Prompts Virais Shop - Indicação',
          text: 'Ganhe roteiros virais e ganchos prontos para TikTok Shop e Shopee! Cadastre-se pelo meu link:',
          url: referralData.referral_link,
        })
        return
      } catch {
        /* intentionally ignored */
      }
    }
    handleCopyReferralLink()
  }

  if (!user) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold">Você precisa estar conectado</h2>
        <p className="text-sm text-muted-foreground">
          Faça login para ver seu perfil, status do plano e assinaturas.
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
        name,
        email,
        xai_api_key: xaiApiKey.trim(),
        google_ai_api_key: googleAiApiKey.trim(),
      })
      toast({
        title: 'Dados e chaves atualizados!',
        description: 'Seu perfil e credenciais do Modo Completo foram salvos com sucesso.',
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
    if (!confirm('Deseja realmente cancelar sua assinatura? O plano voltará ao Gratuito.')) {
      return
    }

    setCancelling(true)
    try {
      await cancelSubscription(subscription.id)
      await refreshSubscription()
      toast({
        title: 'Assinatura cancelada',
        description: 'Seu plano agora é o Gratuito.',
      })
    } catch (err) {
      toast({
        title: 'Erro ao cancelar',
        variant: 'destructive',
      })
    } finally {
      setCancelling(false)
    }
  }

  const planName =
    plan === 'annual' ? 'Anual VIP' : plan === 'monthly' ? 'PRO (Vídeo IA)' : 'Gratuito'

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Meu Perfil & Assinatura
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações cadastrais e acompanhe seu plano ativo.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="text-destructive hover:bg-destructive/10 gap-2 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </Button>
      </div>

      {/* SEÇÃO ESPECIAL: PROGRAMA DE INDICAÇÃO (AFILIADOS) */}
      <Card className="border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-amber-500/10 shadow-md overflow-hidden rounded-3xl">
        <CardHeader className="pb-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-extrabold text-xs px-3 py-1 gap-1.5 shadow-xs">
              <Gift className="w-3.5 h-3.5" />
              Programa de Indicação (Afiliados)
            </Badge>
            <span className="text-xs text-muted-foreground font-semibold">
              Bônus de 20 Prompts PRO
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-black text-foreground pt-1">
            Indique Amigos e Ganhe 20 Prompts PRO Grátis 🎁✨
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Compartilhe seu link exclusivo. Quando um amigo se cadastrar e assinar{' '}
            <strong>1 mês pago (Plano PRO ou Anual)</strong>, e você também for assinante pago
            ativo, você ganha <strong>+20 prompts PRO grátis válidos por 30 dias</strong>!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Link e Botões de Compartilhamento */}
          <div className="p-4 rounded-2xl bg-background/90 border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-pink-500" />
                Seu Link Exclusivo de Indicação:
              </span>
              {referralData && (
                <span className="text-xs font-mono font-bold text-pink-600 bg-pink-500/10 px-2 py-0.5 rounded-md">
                  Código: {referralData.referral_code}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                readOnly
                value={referralData?.referral_link || 'Carregando link...'}
                className="font-mono text-xs bg-muted/40 h-11 border-pink-500/30"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="h-11 px-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedRef ? 'Copiado!' : 'Copiar Link'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleShareReferral}
                  className="h-11 px-3 border-pink-500/40 text-pink-600 font-bold text-xs gap-1.5 shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Métricas de Indicações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border bg-card/80 space-y-1">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                Amigos Cadastrados com Seu Link:
              </span>
              <p className="text-2xl font-black text-foreground">
                {referralData?.total_referred_users || 0}
              </p>
            </div>

            <div className="p-4 rounded-2xl border bg-card/80 space-y-1">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Créditos de Indicação Ativos:
              </span>
              <p className="text-2xl font-black text-pink-600">
                {referralData?.total_credits_remaining || 0} prompts PRO
              </p>
            </div>
          </div>

          {/* Histórico de Créditos Concedidos */}
          {referralData && referralData.credits.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Histórico de Bônus Concedidos:
              </span>
              <div className="space-y-2">
                {referralData.credits.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border bg-background/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <p className="font-bold text-foreground">+20 Créditos de Indicação PRO</p>
                      <p className="text-[11px] text-muted-foreground">
                        Restam {c.credits_remaining} de {c.credits_granted} créditos • Válido até{' '}
                        {new Date(c.expires_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge
                      className={
                        c.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {c.status === 'active'
                        ? 'Ativo (Válido)'
                        : c.status === 'consumed'
                          ? 'Utilizado'
                          : 'Expirado'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                        {new Date(subscription.next_payment_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ) : subscription.end_date ? (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        Válido até
                      </span>
                      <span className="text-foreground font-semibold">
                        {new Date(subscription.end_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ) : null}
                  {subscription.mp_preapproval_id && (
                    <div className="flex justify-between items-center text-[11px] pt-1 border-t text-muted-foreground font-mono">
                      <span>Assinatura MP:</span>
                      <span>{subscription.mp_preapproval_id.slice(0, 12)}...</span>
                    </div>
                  )}{' '}
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
                <Button className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold text-xs">
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
                  className="w-full text-xs text-muted-foreground hover:text-destructive"
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

                {/* Seção Chaves de API para Modo Completo */}
                <div className="pt-4 border-t space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-500" />
                      <h3 className="text-sm font-bold text-foreground">
                        Modo Completo com Chaves de API Próprias
                      </h3>
                      <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-bold">
                        Opcional
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Conecte sua própria chave oficial para desbloquear o{' '}
                      <strong>Modo Completo</strong> nos motores correspondentes. Você gera vídeos e
                      imagens usando seu próprio saldo da API, sem consumir as cotas diárias do
                      site!
                    </p>
                  </div>

                  {/* Chave Google AI Studio (Flow / Veo / Nano Banana) */}
                  <div className="space-y-2 p-3.5 rounded-xl border bg-purple-500/5 border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="google-key"
                        className="text-xs font-bold flex items-center gap-1.5"
                      >
                        <Cpu className="w-3.5 h-3.5 text-purple-500" />
                        Chave Google AI Studio (Flow / Veo / Nano Banana)
                      </Label>
                      {googleAiApiKey.trim() ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] font-bold">
                          Modo Completo Ativo
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Usa cotas in-app</span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="google-key"
                        type={showGoogleKey ? 'text' : 'password'}
                        placeholder="AIzaSy..."
                        value={googleAiApiKey}
                        onChange={(e) => setGoogleAiApiKey(e.target.value)}
                        className="font-mono text-xs pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGoogleKey(!showGoogleKey)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showGoogleKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Obtida em <em>aistudio.google.com</em>. Libera o Flow (Veo 3.1) sem debitar
                      dos 50 créditos diários do site.
                    </p>
                  </div>

                  {/* Chave xAI (Grok Imagine) */}
                  <div className="space-y-2 p-3.5 rounded-xl border bg-black/5 dark:bg-white/5 border-muted">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="xai-key"
                        className="text-xs font-bold flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Chave xAI Oficial (Grok Imagine Video)
                      </Label>
                      {xaiApiKey.trim() ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] font-bold">
                          Modo Completo Ativo
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Usa cotas in-app</span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="xai-key"
                        type={showXaiKey ? 'text' : 'password'}
                        placeholder="xai-..."
                        value={xaiApiKey}
                        onChange={(e) => setXaiApiKey(e.target.value)}
                        className="font-mono text-xs pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowXaiKey(!showXaiKey)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showXaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Obtida em <em>console.x.ai</em>. Libera o Grok Imagine Video direto no site
                      com a sua conta.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    Armazenamento Seguro e Criptografado
                  </p>
                  <p>
                    Suas chaves são armazenadas com segurança no seu registro de usuário no Skip
                    Cloud (PocketBase) e enviadas apenas pelo backend diretamente às APIs oficiais
                    via conexão TLS protegida.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t flex justify-end">
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold"
                >
                  {savingProfile ? 'Salvando...' : 'Salvar Perfil e Chaves'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
