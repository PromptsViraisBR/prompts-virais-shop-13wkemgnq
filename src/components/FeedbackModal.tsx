import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { sendFeedback } from '@/services/feedback'
import {
  MessageSquarePlus,
  Send,
  Bug,
  Lightbulb,
  Heart,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react'

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth()
  const { toast } = useToast()

  const [category, setCategory] = useState<'bug' | 'idea' | 'compliment' | 'other'>('idea')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast({
        title: 'Mensagem obrigatória',
        description: 'Por favor, escreva sua sugestão ou o problema encontrado.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      await sendFeedback({
        category,
        name: name.trim() || user?.name || (user?.email ? user.email.split('@')[0] : 'Visitante'),
        email: email.trim() || user?.email || '',
        message: message.trim(),
      })

      setSuccess(true)
      toast({
        title: 'Feedback enviado com sucesso! 🎉',
        description: 'Obrigado por ajudar a tornar o Prompts Virais cada vez melhor.',
      })

      setTimeout(() => {
        setMessage('')
        setSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (err: any) {
      toast({
        title: 'Erro ao enviar feedback',
        description: err?.message || 'Tente novamente em instantes ou nos mande um e-mail.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!submitting) {
          onOpenChange(val)
          if (!val) setSuccess(false)
        }
      }}
    >
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold">Enviar Feedback & Ideias</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Encontrou algum problema ou tem uma sugestão para deixar a plataforma ainda mais
            incrível? Conte para nós!
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Mensagem recebida com sucesso!</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Nossa equipe lê todas as sugestões e relatos com carinho para aplicar melhorias
              rápidas no site.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Categoria */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tipo de mensagem</Label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCategory('idea')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                    category === 'idea'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Ideia</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('bug')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                    category === 'bug'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>Bug</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('compliment')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                    category === 'compliment'
                      ? 'bg-pink-500/15 border-pink-500/40 text-pink-600 dark:text-pink-400 font-bold'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Elogio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('other')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                    category === 'other'
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-400 font-bold'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Outro</span>
                </button>
              </div>
            </div>

            {/* Nome e Email (se deslogado ou editável) */}
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="feedback-name" className="text-xs font-semibold">
                    Seu Nome (opcional)
                  </Label>
                  <Input
                    id="feedback-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="feedback-email" className="text-xs font-semibold">
                    Seu E-mail (opcional)
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className="text-xs h-8"
                  />
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-muted/40 border text-[11px] text-muted-foreground flex items-center justify-between">
                <span>
                  Logado como: <strong>{user.name || user.email}</strong>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Identificado
                </span>
              </div>
            )}

            {/* Mensagem */}
            <div className="space-y-1">
              <Label htmlFor="feedback-msg" className="text-xs font-semibold">
                Sua mensagem / detalhes do relato <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="feedback-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva o que aconteceu ou sugira uma nova função que você adoraria ver no site..."
                rows={4}
                required
                className="text-xs resize-none"
              />
            </div>

            <div className="pt-1 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Ou fale diretamente:</span>
              <a
                href="mailto:juniorrodriguesjr123.jr@gmail.com"
                className="font-medium text-pink-600 dark:text-pink-400 hover:underline"
              >
                juniorrodriguesjr123.jr@gmail.com
              </a>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !message.trim()}
                className="text-xs gap-1.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Enviando...' : 'Enviar Feedback'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
export default FeedbackModal
