import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Lock, Sparkles, UserPlus, LogIn, ArrowRight, CheckCircle2 } from 'lucide-react'

interface AuthGateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  actionName?: string
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  open,
  onOpenChange,
  title = 'Acesso Exclusivo para Usuários Cadastrados',
  description = 'Para copiar, personalizar ou gerar roteiros virais completos, entre na sua conta ou crie uma conta gratuita em poucos segundos.',
  actionName,
}) => {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    onOpenChange(false)
    navigate(path)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 border-pink-500/20 bg-card/95 backdrop-blur-md">
        <DialogHeader className="text-center space-y-3 pt-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
            <Lock className="w-7 h-7" />
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
            {title}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {actionName ? (
              <span className="block mb-1 text-foreground font-medium">
                Você tentou:{' '}
                <strong className="text-pink-600 dark:text-pink-400">{actionName}</strong>
              </span>
            ) : null}
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Benefícios rápidos */}
          <div className="bg-muted/40 border border-pink-500/15 rounded-2xl p-3.5 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
              <span>O que você desbloqueia ao entrar:</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Acesso a todos os roteiros cena por cena da biblioteca</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Cópia com 1 toque para o seu TikTok Shop / Shopee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Personalização de roteiros com fotos da sua vitrine</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              onClick={() => handleNavigate('/login')}
              className="w-full py-5 text-sm font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white shadow-md gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNavigate('/login')}
              className="w-full py-5 text-sm font-semibold border-muted-foreground/30 hover:bg-muted gap-2"
            >
              <LogIn className="w-4 h-4 text-pink-500" />
              Já tenho conta — Fazer Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
