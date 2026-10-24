import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
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
  const { login, signup } = useAuth()
  const navigate = useNavigate()

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
      await signup(signupEmail, signupPassword, signupName)
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você já está conectado no plano Gratuito. Aproveite!',
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

  const fillDemoAccount = () => {
    setLoginEmail('juniorrodriguesjr123.jr@gmail.com')
    setLoginPassword('Skip@Pass')
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
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
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
                      <code className="bg-background px-1 py-0.5 rounded text-foreground">
                        juniorrodriguesjr123.jr@gmail.com
                      </code>
                    </p>
                    <p>
                      Senha:{' '}
                      <code className="bg-background px-1 py-0.5 rounded text-foreground">
                        Skip@Pass
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
