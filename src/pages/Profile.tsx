import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cancelSubscription } from '@/services/subscriptions'
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
      await updateProfile({ name, email })
      toast({
        title: 'Dados atualizados!',
        description: 'Seu perfil foi salvo com sucesso.',
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

                  {subscription.end_date && (
                    <div className="flex items-center justify-between py-1 border-b">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Próxima Renovação:
                      </span>
                      <span className="text-foreground font-semibold">
                        {new Date(subscription.end_date).toLocaleDateString('pt-BR')}
                      </span>
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

                <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Ambiente Seguro</p>
                  <p>
                    Seus dados de acesso estão sincronizados diretamente com o banco de dados seguro
                    do Skip Cloud (PocketBase).
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t flex justify-end">
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-semibold"
                >
                  {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
