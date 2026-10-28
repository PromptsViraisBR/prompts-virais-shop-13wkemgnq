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
  Layers,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, plan, isPaidPlan, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const planBadge = (compact = false) => {
    if (plan === 'annual') {
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold gap-1 text-[11px] px-2 py-0.5">
          <Crown className="w-3 h-3 text-amber-500" />
          {compact ? 'VIP' : 'Anual VIP'}
        </Badge>
      )
    }
    if (plan === 'monthly') {
      return (
        <Badge className="bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30 font-semibold gap-1 text-[11px] px-2 py-0.5">
          <Sparkles className="w-3 h-3 text-pink-500" />
          PRO
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="text-muted-foreground font-medium text-[11px] px-2 py-0.5"
      >
        Grátis
      </Badge>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur shadow-xs pt-[env(safe-area-inset-top)]">
      {/* Linha Principal da Navbar */}
      <div className="w-full px-2.5 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo Compactada para mobile com visual profissional */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold tracking-tight shrink-0 transition-opacity hover:opacity-90 py-1"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-pink-500/20 shrink-0">
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent font-black text-sm sm:text-lg">
                Prompts Virais
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground hidden xs:inline">
                Shop & Virais
              </span>
            </div>
          </Link>

          {/* Abas Superiores no Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/biblioteca">
              <Button
                variant={isActive('/biblioteca') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2 font-medium h-9 text-xs sm:text-sm"
              >
                <BookOpen className="w-4 h-4 text-pink-500" />
                Biblioteca
              </Button>
            </Link>

            <Link to="/virais">
              <Button
                variant={isActive('/virais') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-1.5 font-medium h-9 text-xs sm:text-sm relative"
              >
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                Vídeos Virais
                <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  HOT
                </span>
              </Button>
            </Link>

            <Link to="/nichos">
              <Button
                variant={isActive('/nichos') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-1.5 font-medium h-9 text-xs sm:text-sm relative"
              >
                <Layers className="w-4 h-4 text-purple-500" />
                Nichos
                <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  8
                </span>
              </Button>
            </Link>

            <Link to="/gerador">
              <Button
                variant={isActive('/gerador') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-1.5 font-medium h-9 text-xs sm:text-sm relative"
              >
                <Wand2 className="w-4 h-4 text-amber-500" />
                Gerador
                {!isPaidPlan && (
                  <span className="inline-flex items-center px-1 py-0.2 text-[9px] font-bold rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    PRO
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/planos">
              <Button
                variant={isActive('/planos') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2 font-medium h-9 text-xs sm:text-sm"
              >
                <Crown className="w-4 h-4 text-indigo-500" />
                Planos
              </Button>
            </Link>
          </nav>

          {/* Área de Usuário / Ações */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden sm:block">{planBadge()}</div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 sm:gap-2 h-9 px-2 sm:px-3 rounded-full border-pink-500/30"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                        {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                      </div>
                      <span className="max-w-[70px] sm:max-w-[120px] truncate text-xs sm:text-sm font-semibold">
                        {user.name ? user.name.split(' ')[0] : user.email.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Conectado como{' '}
                      <strong className="text-foreground block truncate">{user.email}</strong>
                    </div>
                    <div className="px-2 py-1">{planBadge()}</div>
                    <DropdownMenuSeparator />
                    {(user.is_admin ||
                      (user.email || '').toLowerCase().trim() ===
                        'juniorrodriguesjr123.jr@gmail.com') && (
                      <DropdownMenuItem
                        onClick={() => navigate('/admin')}
                        className="cursor-pointer gap-2 text-pink-600 dark:text-pink-400 font-semibold"
                      >
                        <Crown className="w-4 h-4 text-pink-500" />
                        Painel Admin Mercado Pago
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => navigate('/perfil')}
                      className="cursor-pointer gap-2"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Meu Perfil & Indicação
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/planos')}
                      className="cursor-pointer gap-2"
                    >
                      <Crown className="w-4 h-4 text-amber-500" />
                      Planos de Assinatura
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
              <div className="flex items-center gap-1.5">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-[40px] h-10 px-2.5 sm:px-3 font-bold text-xs sm:text-sm rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span>Entrar</span>
                  </Button>
                </Link>
                <Link to="/planos">
                  <Button
                    size="sm"
                    className="min-h-[40px] h-10 px-3 sm:px-3.5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xs rounded-xl"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-200" />
                    <span>PRO</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* NAVEGAÇÃO TOTALMENTE VISÍVEL NO MOBILE / PWA / WEB
            NUNCA ESCONDIDA EM HAMBÚRGUER OU GAVETA!
            Nomes das abas visíveis, botões generosos para toque no polegar,
            com scroll horizontal suave em telas estreitas */}
        <div className="flex lg:hidden items-center gap-1.5 pb-2.5 pt-1 overflow-x-auto no-scrollbar scroll-smooth -mx-2.5 px-2.5">
          <Link to="/biblioteca" className="shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                isActive('/biblioteca')
                  ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-foreground border border-pink-500/40 shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Biblioteca</span>
            </button>
          </Link>

          <Link to="/virais" className="shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                isActive('/virais')
                  ? 'bg-gradient-to-r from-rose-500/25 to-pink-500/25 text-foreground border border-rose-500/50 shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0 animate-pulse" />
              <span>Vídeos Virais</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500 text-white font-black uppercase">
                Hot
              </span>
            </button>
          </Link>

          <Link to="/nichos" className="shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                isActive('/nichos')
                  ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-foreground border border-purple-500/50 shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Nichos</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-extrabold">
                8
              </span>
            </button>
          </Link>

          <Link to="/gerador" className="shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                isActive('/gerador')
                  ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-foreground border border-amber-500/40 shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Gerador</span>
              {!isPaidPlan && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold">
                  PRO
                </span>
              )}
            </button>
          </Link>

          <Link to="/planos" className="shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                isActive('/planos')
                  ? 'bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-foreground border border-indigo-500/40 shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Planos</span>
            </button>
          </Link>

          {user && (
            <Link to="/perfil" className="shrink-0">
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                  isActive('/perfil')
                    ? 'bg-secondary text-foreground border border-border shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                }`}
              >
                <User className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Perfil</span>
              </button>
            </Link>
          )}

          {user &&
            (user.is_admin ||
              (user.email || '').toLowerCase().trim() === 'juniorrodriguesjr123.jr@gmail.com') && (
              <Link to="/admin" className="shrink-0">
                <button
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                    isActive('/admin')
                      ? 'bg-pink-500/20 text-pink-600 border border-pink-500/40 shadow-xs'
                      : 'bg-muted/50 text-pink-600/80 hover:text-pink-600 hover:bg-muted border border-transparent'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>Admin</span>
                </button>
              </Link>
            )}
        </div>
      </div>
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
                <Link to="/nichos" className="hover:text-foreground transition-colors">
                  Nichos do Acervo (8 Categorias)
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
              Legal & Suporte
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacidade" className="hover:text-pink-600 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-pink-600 transition-colors">
                  Termos de Uso & Assinatura
                </Link>
              </li>
              <li className="pt-1 text-xs text-muted-foreground">
                <span className="block font-medium text-foreground">Suporte:</span>
                <a
                  href="mailto:juniorrodriguesjr123.jr@gmail.com"
                  className="hover:underline text-pink-600 dark:text-pink-400 break-all"
                >
                  juniorrodriguesjr123.jr@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Prompts Virais Shop. Todos os direitos reservados.</p>
            <div className="flex items-center gap-3">
              <Link
                to="/privacidade"
                className="hover:underline text-muted-foreground hover:text-foreground"
              >
                Privacidade
              </Link>
              <span>•</span>
              <Link
                to="/termos"
                className="hover:underline text-muted-foreground hover:text-foreground"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
          <p className="flex items-center gap-1">
            <span>Desenvolvido para criadores de e-commerce e afiliados</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
