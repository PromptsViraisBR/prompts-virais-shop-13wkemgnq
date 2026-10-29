import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Gift,
  Crown,
  Sparkles,
  ArrowRight,
  Infinity as InfinityIcon,
  CheckCircle2,
  Share2,
  Users,
  Zap,
} from 'lucide-react'

export const ReferralHighlight: React.FC = () => {
  const { user, isPaidPlan } = useAuth()

  return (
    <section
      id="programa-indicacoes"
      className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8"
      aria-label="Programa de Indicação Indique e Ganhe"
    >
      <div className="relative overflow-hidden rounded-3xl border-2 border-pink-500/40 bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-amber-500/15 p-5 xs:p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xs space-y-6">
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do destaque: Badges e Chamada */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/20 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-extrabold text-xs px-3 py-1 shadow-md gap-1.5">
                <Gift className="w-3.5 h-3.5 animate-bounce-subtle" />
                <span>Indique e Ganhe</span>
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-black text-xs px-2.5 py-0.5"
              >
                5 gerações por indicação — ilimitado
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold text-xs px-2.5 py-0.5"
              >
                👑 PRO: 1 mês grátis
              </Badge>
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
              Compartilhe seu link exclusivo e{' '}
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                nunca fique sem gerações
              </span>
            </h2>

            <p className="text-xs xs:text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
              Ajude outros criadores e vendedores do TikTok Shop e Shopee a destravarem vendas e
              ganhe benefícios imediatos direto na sua conta.
            </p>
          </div>

          {/* CTA desktop no topo / rápido */}
          <div className="hidden lg:flex shrink-0">
            {user ? (
              <Link to="/perfil">
                <Button
                  size="lg"
                  className="min-h-[52px] px-6 text-sm sm:text-base font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-xl shadow-pink-500/25 rounded-2xl group"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  <span>Ver Meu Link de Indicação</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to="/cadastro">
                <Button
                  size="lg"
                  className="min-h-[52px] px-6 text-sm sm:text-base font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-xl shadow-pink-500/25 rounded-2xl group"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span>Criar Conta para Pegar Link</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Comparativo de Benefícios por Plano (Grátis vs PRO) */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
          {/* Card GRÁTIS */}
          <div className="rounded-2xl border-2 border-pink-500/30 bg-card/90 p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-foreground">Plano Gratuito</h3>
                    <p className="text-[11px] text-muted-foreground">Link permanente e ativo</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold">
                  Sem Teto
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-foreground/90 pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>+5 gerações completas</strong> por cada amigo que criar conta válida
                    pelo seu link
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <InfinityIcon className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Acumulação ilimitada:</strong> 10 indicados = 50 gerações extras livres
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Link fixo no seu perfil:</strong> use quantas vezes quiser no WhatsApp,
                    Instagram e grupos
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Crédito automático no cadastro</span>
              <span className="font-bold text-pink-600 dark:text-pink-400">100% Gratuito</span>
            </div>
          </div>

          {/* Card PRO */}
          <div className="rounded-2xl border-2 border-amber-500/40 bg-card/90 p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-foreground">Assinantes PRO</h3>
                    <p className="text-[11px] text-muted-foreground">Oportunidade de estorno</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 text-[11px] font-black">
                  1 Mês Grátis
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-foreground/90 pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Uma indicação elegível = estorno de 1 mensalidade</strong> (R$ 19,90) ou
                    +30 dias no plano
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Válido quando o amigo indicado contrata um plano PRO e tem o pagamento aprovado
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Acompanhamento do status de cada etapa direto no seu painel de perfil</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Válido para 1 indicação PRO por assinante</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">Economia Real</span>
            </div>
          </div>
        </div>

        {/* Bloco de Ação / CTA Mobile e Geral */}
        <div className="relative pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-background/80 rounded-2xl p-3.5 sm:p-4 border border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/15 text-pink-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-foreground">
                {user
                  ? isPaidPlan
                    ? 'Você é PRO! Acesse seu perfil para acompanhar ou pegar seu link.'
                    : 'Você já tem conta! Pegue seu link no perfil e comece a convidar.'
                  : 'Ainda não tem conta? Crie em 10 segundos para gerar seu link exclusivo.'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Seu link funciona instantaneamente em qualquer dispositivo.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-stretch sm:items-center gap-2">
            {user ? (
              <Link to="/perfil" className="w-full sm:w-auto">
                <Button
                  size="default"
                  className="w-full sm:w-auto min-h-[44px] px-5 font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl shadow-md gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Ir para Meu Link no Perfil</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button
                  size="default"
                  className="w-full sm:w-auto min-h-[44px] px-5 font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl shadow-md gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Criar Conta & Pegar Link</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReferralHighlight
