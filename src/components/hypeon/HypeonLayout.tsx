import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Radio,
  Copy,
  BookOpen,
  Lightbulb,
  BarChart3,
  Clapperboard,
  TrendingUp,
  Bookmark,
  Sparkles,
  Zap,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface HypeonNavProps {
  children: React.ReactNode
  title?: string
  description?: string
  badge?: string
}

export const HYPEON_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Visão Geral HYPEON',
    href: '/hypeon',
    icon: Zap,
    status: 'active' as const,
    badge: 'Hub',
  },
  {
    id: 'clonador',
    label: 'Clonador Viral',
    href: '/hypeon/clonador',
    icon: Copy,
    status: 'active' as const,
    badge: 'NOVO',
  },
  {
    id: 'stories',
    label: 'HYPEON Stories',
    href: '/hypeon/stories',
    icon: BookOpen,
    status: 'active' as const,
    badge: 'NOVO',
  },
  {
    id: 'ideas',
    label: 'HYPEON Ideas',
    href: '/hypeon/ideas',
    icon: Lightbulb,
    status: 'active' as const,
    badge: 'NOVO',
  },
  {
    id: 'analisador',
    label: 'Analisador de Vídeos',
    href: '/hypeon/analisador',
    icon: BarChart3,
    status: 'active' as const,
    badge: 'NOVO',
  },
  {
    id: 'radar',
    label: 'Radar Viral',
    href: '/hypeon/radar',
    icon: Radio,
    status: 'active' as const,
    badge: 'YouTube',
  },
  {
    id: 'tendencias',
    label: 'Tendências por Nicho',
    href: '/hypeon/tendencias',
    icon: TrendingUp,
    status: 'active' as const,
    badge: 'Ativo',
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca Viral',
    href: '/hypeon/biblioteca',
    icon: Bookmark,
    status: 'active' as const,
    badge: 'Salvos',
  },
  {
    id: 'cenas',
    label: 'Fábrica de Cenas',
    href: '/hypeon/cenas',
    icon: Clapperboard,
    status: 'planned' as const,
    badge: 'Fase 4',
  },
]

export const HypeonLayout: React.FC<HypeonNavProps> = ({ children, title, description, badge }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500/30 selection:text-purple-300">
      {/* Top Banner de Contexto HYPEON */}
      <div className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md sticky top-14 sm:top-16 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              to="/virais"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Voltar para PV</span>
            </Link>
            <span className="text-slate-700 hidden xs:inline">•</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-sm tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                HYPEON
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:inline">
                Inteligência Viral
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-[10px] font-semibold px-2 py-0.5"
            >
              O próximo viral começa aqui
            </Badge>
          </div>
        </div>

        {/* Navegação horizontal no Mobile (320px+) */}
        <div className="lg:hidden flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-t border-slate-900 bg-slate-950/95">
          {HYPEON_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link key={item.id} to={item.href} className="shrink-0">
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation min-h-[38px] ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-500/50 shadow-xs'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-purple-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.status === 'planned' && (
                    <span className="text-[9px] font-normal text-slate-400 opacity-80">
                      (breve)
                    </span>
                  )}
                </button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Grid Principal: Sidebar Desktop + Conteúdo */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Fixa Desktop */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                    Núcleo HYPEON
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-100">Inteligência Viral</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  8 ferramentas avançadas para monitorar, criar e escalar vídeos de alta retenção.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                {HYPEON_NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link key={item.id} to={item.href} className="block">
                      <div
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600/25 to-pink-600/20 text-white border border-purple-500/40 shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-purple-400' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 font-mono shrink-0 ${
                            item.status === 'active'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Card Informativo de Transparência */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dados 100% Reais</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Todas as métricas de visualizações e engajamento são consultadas diretamente nas
                APIs oficiais. Sem métricas forjadas.
              </p>
            </div>
          </aside>

          {/* Conteúdo da Página */}
          <main className="lg:col-span-9 min-w-0">
            {title && (
              <div className="mb-6 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
                  {badge && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                      {badge}
                    </Badge>
                  )}
                </div>
                {description && <p className="text-xs text-slate-400">{description}</p>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
