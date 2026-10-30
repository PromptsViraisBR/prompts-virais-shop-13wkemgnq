import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  Radio,
  Layers,
  Sliders,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  X,
  Flame,
} from 'lucide-react'
import { CURRENT_RELEASE, CURRENT_VERSION, STORAGE_KEY_WHATS_NEW } from '@/config/whatsNew'

interface WhatsNewModalProps {
  forceOpen?: boolean
  onClose?: () => void
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ forceOpen, onClose }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (forceOpen) {
      setOpen(true)
      return
    }

    const handleCustomOpen = () => {
      setOpen(true)
    }
    window.addEventListener('pv_open_whats_new', handleCustomOpen)

    try {
      const lastSeen = localStorage.getItem(STORAGE_KEY_WHATS_NEW)
      if (lastSeen !== CURRENT_VERSION) {
        // Exibir suavemente com pequeno delay para não colidir com render inicial
        const timer = setTimeout(() => {
          setOpen(true)
        }, 800)
        return () => {
          clearTimeout(timer)
          window.removeEventListener('pv_open_whats_new', handleCustomOpen)
        }
      }
    } catch (e) {
      console.warn('[WhatsNewModal] Falha ao ler localStorage:', e)
    }

    return () => {
      window.removeEventListener('pv_open_whats_new', handleCustomOpen)
    }
  }, [forceOpen])

  const markAsSeenAndClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY_WHATS_NEW, CURRENT_VERSION)
    } catch (e) {
      console.warn('[WhatsNewModal] Falha ao salvar localStorage:', e)
    }
    setOpen(false)
    if (onClose) onClose()
  }

  const handleCta = () => {
    markAsSeenAndClose()
    if (CURRENT_RELEASE.ctaLink) {
      navigate(CURRENT_RELEASE.ctaLink)
    }
  }

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-4 h-4 text-amber-400" />
      case 'radar':
        return <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
      case 'layers':
        return <Layers className="w-4 h-4 text-purple-400" />
      case 'sliders':
        return <Sliders className="w-4 h-4 text-pink-400" />
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-emerald-400" />
      default:
        return <Sparkles className="w-4 h-4 text-pink-400" />
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          markAsSeenAndClose()
        } else {
          setOpen(true)
        }
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 border border-purple-500/30 bg-slate-950 text-slate-100 shadow-2xl shadow-purple-950/50 rounded-2xl sm:rounded-3xl">
        {/* Header com gradiente espacial HYPEON */}
        <div className="relative p-5 sm:p-7 overflow-hidden border-b border-purple-500/20 bg-gradient-to-br from-purple-950/80 via-slate-950 to-blue-950/70">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-[11px] px-2.5 py-0.5 uppercase tracking-wider border-0 shadow-sm">
                  {CURRENT_RELEASE.version}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-[10px] font-semibold"
                >
                  NOVA ATUALIZAÇÃO
                </Badge>
              </div>
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              {CURRENT_RELEASE.headline}
            </DialogTitle>

            <DialogDescription className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {CURRENT_RELEASE.tagline}
            </DialogDescription>
          </div>
        </div>

        {/* Lista de destaques */}
        <div className="p-4 sm:p-6 space-y-3 bg-slate-950/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-400/90 flex items-center gap-1.5 px-1">
            <Flame className="w-3.5 h-3.5 text-pink-500" />
            O que há de novo nesta versão:
          </p>

          <div className="space-y-2.5">
            {CURRENT_RELEASE.highlights.map((item, idx) => (
              <div
                key={idx}
                className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  {renderIcon(item.icon)}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 px-1 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Suas assinaturas, créditos e dados continuam 100% preservados.</span>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={markAsSeenAndClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold h-10 px-4 rounded-xl order-2 sm:order-1"
          >
            Entendido, fechar
          </Button>

          <Button
            type="button"
            onClick={handleCta}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-xs sm:text-sm h-11 px-5 rounded-xl shadow-lg shadow-purple-600/30 gap-2 order-1 sm:order-2"
          >
            <span>{CURRENT_RELEASE.ctaText || 'Explorar Novidades'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default WhatsNewModal
