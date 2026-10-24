import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sparkles,
  BookOpen,
  Wand2,
  Crown,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  CheckCircle,
  Video,
  Flame,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, plan, isPaidPlan, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const planBadge = () => {
    if (plan === 'annual') {
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold gap-1">
          <Crown className="w-3 h-3 text-amber-500" />
          Anual VIP
        </Badge>
      )
    }
    if (plan === 'monthly') {
      return (
        <Badge className="bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30 font-semibold gap-1">
          <Sparkles className="w-3 h-3 text-pink-500" />
          PRO
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-muted-foreground font-medium">
        Gratuito
      </Badge>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight transition-opacity hover:opacity-90"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Video className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent font-extrabold text-lg sm:text-xl">
              Prompts Virais
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              TikTok Shop & Shopee
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link to="/biblioteca">
            <Button
              variant={isActive('/biblioteca') ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2 font-medium"
            >
              <BookOpen className="w-4 h-4 text-pink-500" />
              Biblioteca
            </Button>
          </Link>

          <Link to="/virais">
            <Button
              variant={isActive('/virais') ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2 font-medium relative"
            >
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              Vídeos Virais
              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 ml-0.5">
                NOVO
              </span>
            </Button>
          </Link>

          <Link to="/gerador">
            <Button
              variant={isActive('/gerador') ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2 font-medium relative"
            >
              <Wand2 className="w-4 h-4 text-amber-500" />
              Gerador
              {!isPaidPlan && (
                <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 ml-1">
                  PRO
                </span>
              )}
            </Button>
          </Link>

          <Link to="/planos">
            <Button
              variant={isActive('/planos') ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2 font-medium"
            >
              <Crown className="w-4 h-4 text-indigo-500" />
              Planos
            </Button>
          </Link>
        </nav>

        {/* Desktop User / Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:block">{planBadge()}</div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 pl-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                    </div>
                    <span className="max-w-[120px] truncate text-sm font-medium">
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Conectado como{' '}
                    <strong className="text-foreground block truncate">{user.email}</strong>
                  </div>
                  <div className="px-2 py-1 lg:hidden">{planBadge()}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/perfil')}
                    className="cursor-pointer gap-2"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Meu Perfil & Assinatura
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/planos')}
                    className="cursor-pointer gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    Alterar Plano
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da Conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-medium gap-1.5">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
              </Link>
              <Link to="/planos">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold shadow-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Assinar Agora
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {user && <div className="sm:block hidden">{planBadge()}</div>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            <Link
              to="/biblioteca"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-sm ${
                isActive('/biblioteca') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
            >
              <BookOpen className="w-4 h-4 text-pink-500" />
              Biblioteca de Prompts
            </Link>

            <Link
              to="/virais"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-md font-medium text-sm ${
                isActive('/virais') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Vídeos Virais
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] bg-rose-500/15 text-rose-600 font-bold"
              >
                NOVO
              </Badge>
            </Link>

            <Link
              to="/gerador"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-md font-medium text-sm ${
                isActive('/gerador') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Wand2 className="w-4 h-4 text-amber-500" />
                Gerador Personalizado
              </span>
              {!isPaidPlan && (
                <Badge variant="secondary" className="text-[10px] text-amber-600">
                  PRO
                </Badge>
              )}
            </Link>

            <Link
              to="/planos"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-sm ${
                isActive('/planos') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Crown className="w-4 h-4 text-indigo-500" />
              Planos & Preços
            </Link>
          </div>

          <div className="pt-2 border-t flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="truncate">{user.email}</span>
                  {planBadge()}
                </div>
                <Link to="/perfil" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <User className="w-4 h-4" />
                    Meu Perfil & Assinatura
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full justify-start text-destructive gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/planos" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white">
                    Assinar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white">
                <Video className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 to-amber-500 bg-clip-text text-transparent">
                Prompts Virais Shop
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              A maior biblioteca e gerador de roteiros virais e prompts em estilo POV ou com modelo
              para vendedores, lojistas e afiliados do TikTok Shop e Shopee.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Roteiros testados com alto engajamento e retenção</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/biblioteca" className="hover:text-foreground transition-colors">
                  Biblioteca de Vendas
                </Link>
              </li>
              <li>
                <Link
                  to="/virais"
                  className="hover:text-foreground transition-colors text-pink-600 dark:text-pink-400 font-semibold"
                >
                  Vídeos Virais (Criadores)
                </Link>
              </li>
              <li>
                <Link to="/gerador" className="hover:text-foreground transition-colors">
                  Gerador de Roteiros
                </Link>
              </li>
              <li>
                <Link to="/planos" className="hover:text-foreground transition-colors">
                  Planos de Assinatura
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Nichos Principais
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Moda Feminina & Vestidos</li>
              <li>Frutas Humanoides & ASMR</li>
              <li>Troca de Rosto (Face Swap)</li>
              <li>Terror 3AM & Comédia Viral</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Prompts Virais Shop. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido para criadores de e-commerce e afiliados</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
