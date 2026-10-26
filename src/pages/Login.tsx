import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { trackFunnelEvent } from '@/services/events'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Video, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const Login: React.FC = () => {
  const { login, signup, loginWithOAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Captura código de indicação da URL (?ref=CODE ou ?r=CODE)
  const [referralCode, setReferralCode] = useState<string>(() => {
    return (
      searchParams.get('ref') ||
      searchParams.get('r') ||
      localStorage.getItem('prompts_virais_referral_code') ||
      ''
    )
  })

  useEffect(() => {
    const qRef = searchParams.get('ref') || searchParams.get('r')
    if (qRef) {
      setReferralCode(qRef)
      try {
        localStorage.setItem('prompts_virais_referral_code', qRef)
      } catch {
        /* intentionally ignored */
      }
    }
  }, [searchParams])

  // Social Login loading
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup form state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor preencha e-mail e senha.',
        variant: 'destructive',
      })
      return
    }

    setLoginLoading(true)
    try {
      await login(loginEmail, loginPassword)
      toast({
        title: 'Bem-vindo de volta!',
        description: 'Login realizado com sucesso.',
      })
      navigate('/biblioteca')
    } catch (err: unknown) {
      console.error(err)
      toast({
        title: 'Falha no login',
        description: 'E-mail ou senha inválidos. Tente novamente ou use a conta de teste.',
        variant: 'destructive',
      })
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupEmail || !signupPassword || !signupName) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor preencha nome, e-mail e senha.',
        variant: 'destructive',
      })
      return
    }

    if (signupPassword.length < 8) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setSignupLoading(true)
    try {
      await signup(signupEmail, signupPassword, signupName, referralCode)
      trackFunnelEvent('signup', {
        email: signupEmail,
        source: 'login_page',
        referral_code: referralCode || undefined,
      })
      toast({
        title: 'Conta criada com sucesso!',
        description: referralCode
          ? 'Você já está conectado com indicação vinculada no plano Gratuito!'
          : 'Você já está conectado no plano Gratuito. Aproveite!',
      })
      navigate('/biblioteca')
    } catch (err: unknown) {
      console.error(err)
      toast({
        title: 'Erro no cadastro',
        description: 'Não foi possível criar a conta. Este e-mail pode já estar cadastrado.',
        variant: 'destructive',
      })
    } finally {
      setSignupLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider)
    try {
      const res = await loginWithOAuth(provider)
      if (res.success) {
        trackFunnelEvent('signup', { source: `oauth_${provider}` })
        toast({
          title: `Login com ${provider === 'google' ? 'Google' : 'Apple'} realizado! 🎉`,
          description: 'Bem-vindo ao Prompts Virais Shop!',
        })
        navigate('/biblioteca')
      } else {
        // Mensagem amigável sem quebrar a tela
        toast({
          title: `Login com ${provider === 'google' ? 'Google' : 'Apple'} em configuração`,
          description: `As credenciais OAuth de ${provider === 'google' ? 'Google (Gmail)' : 'Apple ID'} estão aguardando o cadastro das chaves no painel. Use seu e-mail e senha normalmente.`,
          variant: 'default',
        })
      }
    } catch (err) {
      toast({
        title: 'Login social em configuração',
        description:
          'O provedor social está sendo configurado. Você pode entrar com e-mail e senha abaixo.',
      })
    } finally {
      setSocialLoading(null)
    }
  }

  const fillDemoAccount = () => {
    setLoginEmail('juniorrodriguesjr123.jr@gmail.com')
    setLoginPassword('Junior@Admin2025!')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 items-center justify-center text-white shadow-lg shadow-pink-500/25">
            <Video className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Acesse sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Desbloqueie roteiros virais e crie conteúdos que vendem todos os dias
          </p>
        </div>

        <Card className="border shadow-lg">
          {/* BOTÕES DE LOGIN SOCIAL (GOOGLE E APPLE) NATIVOS */}
          <div className="p-6 pb-2 space-y-3">
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 font-medium flex items-center justify-center gap-3 hover:bg-muted/60 transition-colors"
                onClick={() => handleSocialAuth('google')}
                disabled={Boolean(socialLoading)}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>
                  {socialLoading === 'google'
                    ? 'Conectando ao Google...'
                    : 'Continuar com o Google (Gmail)'}
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 font-medium flex items-center justify-center gap-3 hover:bg-muted/60 transition-colors"
                onClick={() => handleSocialAuth('apple')}
                disabled={Boolean(socialLoading)}
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.38-.56.65-.99 1.7-0.86 2.74 1.03.08 2.01-.52 2.61-1.25z" />
                </svg>
                <span>
                  {socialLoading === 'apple' ? 'Conectando à Apple...' : 'Continuar com Apple'}
                </span>
              </Button>
            </div>

            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t w-full border-muted" />
              <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold absolute">
                Ou use seu e-mail
              </span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pt-2 pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta {referralCode && '🎁'}</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-9"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Demonstração rápida */}
                  <div className="bg-muted/50 p-3 rounded-lg border text-xs text-muted-foreground space-y-1.5">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Conta de demonstração (Plano Mensal Ativo):
                    </p>
                    <p>
                      E-mail:{' '}
                      <code className="bg-background px-1 py-0.5 rounded text-foreground font-mono">
                        juniorrodriguesjr123.jr@gmail.com
                      </code>
                    </p>
                    <p>
                      Senha:{' '}
                      <code className="bg-background px-1 py-0.5 rounded text-foreground font-mono">
                        Junior@Admin2025!
                      </code>
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs text-pink-600 dark:text-pink-400 font-semibold"
                      onClick={fillDemoAccount}
                    >
                      Preencher automaticamente
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Entrando...' : 'Entrar na Conta'}
                    {!loginLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Ex: Maria Silva"
                        className="pl-9"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-9"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha (mínimo 8 caracteres)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  {/* Código de Indicação (Afiliados) */}
                  <div className="space-y-1.5 p-3 rounded-xl border bg-pink-500/5 border-pink-500/20">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="referral-code"
                        className="text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        Código de Indicação (Afiliado)
                      </Label>
                      <span className="text-[10px] text-muted-foreground">Opcional</span>
                    </div>
                    <Input
                      id="referral-code"
                      type="text"
                      placeholder="Ex: REF12345"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="text-xs uppercase font-mono tracking-wider"
                    />
                    {referralCode && (
                      <p className="text-[10px] text-pink-600 dark:text-pink-400 font-medium">
                        ✨ Código de indicação aplicado! Ao assinar 1 mês pago, seu indicador ganha
                        +20 créditos PRO.
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acesso imediato com plano Gratuito incluso</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Possibilidade de upgrade para PRO quando quiser</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold"
                    disabled={signupLoading}
                  >
                    {signupLoading ? 'Criando Conta...' : 'Criar Minha Conta'}
                    {!signupLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </div>
  )
}
