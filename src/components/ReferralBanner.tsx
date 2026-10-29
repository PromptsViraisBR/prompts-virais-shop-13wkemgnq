import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getReferralOverview, ReferralOverviewResponse } from '@/services/freeLimitsAndReferrals'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Crown, Copy, Check, X, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const ReferralBanner: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [referralData, setReferralData] = useState<ReferralOverviewResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // 1. Não exibir para não logados (a Home já tem a seção dedicada)
  // 2. Não exibir na Home ('/'), pois a Home tem o ReferralHighlight completo
  // 3. Não exibir em telas de checkout/sucesso, termos ou política
  const pathname = location.pathname
  const isExcludedRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/cadastro' ||
    pathname.startsWith('/checkout') ||
    pathname === '/privacidade' ||
    pathname === '/termos'

  useEffect(() => {
    if (!user || isExcludedRoute) return

    let isMounted = true
    getReferralOverview()
      .then((data) => {
        if (isMounted) {
          setReferralData(data)
        }
      })
      .catch((err) => {
        console.warn('[ReferralBanner] Erro ao carregar overview de indicação:', err)
      })

    return () => {
      isMounted = false
    }
  }, [user, isExcludedRoute])

  if (!user || isExcludedRoute || dismissed) {
    return null
  }

  const isPro = Boolean(referralData ? referralData.is_pro : isPaidPlan)
  const proOpportunityUsed = Boolean(
    referralData?.pro_stats?.opportunity_used ||
    referralData?.pro_stats?.has_referral_registered ||
    referralData?.should_hide_link,
  )

  // Se o usuário é PRO e a oportunidade de indicação já foi utilizada/esgotada, não precisa exibir
  if (isPro && proOpportunityUsed) {
    return null
  }

  // Fallback universal de cópia resiliente no mobile/desktop
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
        console.warn('[ReferralBanner] Fallback para execCommand:', err)
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
      let successful = false
      try {
        successful = document.execCommand('copy')
      } catch (cmdErr) {
        console.warn('[ReferralBanner] execCommand copy falhou:', cmdErr)
      }
      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea)
      }
      if (activeEl && typeof activeEl.focus === 'function') {
        try {
          activeEl.focus()
        } catch {
          /* ignore */
        }
      }
      return successful
    } catch {
      return false
    }
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const link =
      referralData?.referral_link ||
      (user?.id ? `${window.location.origin}/login?ref=${user.id.slice(0, 8).toUpperCase()}` : '')

    if (!link) {
      navigate('/perfil')
      return
    }

    const ok = await copyTextToClipboard(link)
    setCopied(true)
    toast({
      title: ok ? 'Link copiado! 🎁✨' : 'Link de indicação selecionado',
      description: isPro
        ? 'Indique um amigo para assinar o PRO e ganhe uma mensalidade estornada!'
        : 'Indique amigos e ganhe +5 gerações por cadastro válido!',
    })
    setTimeout(() => setCopied(false), 2500)
  }

  const handleBannerClick = () => {
    navigate('/perfil')
  }

  return (
    <aside
      aria-label="Programa de indicações"
      className="sticky bottom-0 z-30 w-full border-t bg-background/95 backdrop-blur-md transition-all shadow-lg pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 text-xs">
        {/* Lado Esquerdo: Mensagem e Badges */}
        <div
          onClick={handleBannerClick}
          className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleBannerClick()
          }}
          title="Toque para ver detalhes no seu perfil"
        >
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
              isPro
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-pink-500/20 text-pink-600 dark:text-pink-400'
            }`}
          >
            {isPro ? (
              <Crown className="w-4 h-4 animate-pulse" />
            ) : (
              <Gift className="w-4 h-4 animate-bounce-subtle" />
            )}
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 shrink-0 ${
                isPro
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40'
                  : 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/40'
              }`}
            >
              {isPro ? 'Indique PRO' : 'Indique e Ganhe'}
            </Badge>

            <p className="text-foreground text-[11px] sm:text-xs font-semibold truncate leading-tight group-hover:text-pink-600 transition-colors">
              {isPro ? (
                <>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    👑 Indique e ganhe um mês grátis
                  </span>
                  <span className="hidden md:inline text-muted-foreground ml-1.5">
                    — estorno de R$ 19,90 após assinatura do amigo
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold text-pink-600 dark:text-pink-400">
                    🎁 Indique e ganhe +5 gerações
                  </span>
                  <span className="hidden md:inline text-muted-foreground ml-1.5">
                    — link ilimitado e sem teto de saldo
                  </span>
                </>
              )}
            </p>

            <span className="hidden lg:inline-flex items-center text-[10px] text-muted-foreground font-medium">
              (toque para ver no perfil)
            </span>
          </div>
        </div>

        {/* Lado Direito: Ações rápidas (Copiar Link + Ir ao Perfil + Fechar) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={handleCopyLink}
            className={`min-h-[34px] h-8 px-2.5 sm:px-3 text-xs font-bold gap-1 rounded-xl shadow-xs transition-all ${
              isPro
                ? 'bg-gradient-to-r from-amber-500 to-pink-600 hover:opacity-95 text-white'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white'
            }`}
            title="Copiar meu link de indicação"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Copiar Link</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/perfil')}
            className="hidden sm:inline-flex min-h-[34px] h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
          >
            <span>Ver Painel</span>
            <ArrowRight className="w-3 h-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setDismissed(true)
            }}
            className="min-h-[34px] h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
            title="Ocultar faixa temporariamente"
            aria-label="Ocultar faixa"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default ReferralBanner
