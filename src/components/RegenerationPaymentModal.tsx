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
import { Label } from '@/components/ui/label'
import { CreditCard, AlertCircle, ShieldCheck, Sparkles, Check } from 'lucide-react'
import { purchaseExtraRegenerations } from '@/services/regenerationCredits'
import { useToast } from '@/hooks/use-toast'

interface RegenerationPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onPaymentSuccess: (newBalance: number) => void
}

export const RegenerationPaymentModal: React.FC<RegenerationPaymentModalProps> = ({
  open,
  onOpenChange,
  userId,
  onPaymentSuccess,
}) => {
  const { toast } = useToast()
  const [quantity, setQuantity] = useState<number>(1)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardHolder, setCardHolder] = useState('MARIA SOUZA')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('888')
  const [processing, setProcessing] = useState(false)

  const unitPrice = 1.99
  const totalPrice = (quantity * unitPrice).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast({
        title: 'Faça login para continuar',
        description: 'Entre na sua conta para adquirir regenerações adicionais.',
        variant: 'destructive',
      })
      return
    }

    setProcessing(true)
    try {
      // Simulação rápida de processamento demonstrativo como no fluxo de Planos
      await new Promise((r) => setTimeout(r, 600))

      const updated = await purchaseExtraRegenerations({
        userId,
        quantity,
        cardNumber,
      })

      toast({
        title: '🎉 Créditos de Regeneração Liberados!',
        description: `Você adquiriu ${quantity} prompt(s) de regeneração extra por ${totalPrice} (simulação demonstrativa).`,
      })

      onPaymentSuccess(updated.extra_prompts_balance)
      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: 'Erro no pagamento demonstrativo',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="w-5 h-5 text-pink-500" />
            Regeneração de Prompts Extras
          </DialogTitle>
          <DialogDescription>
            As primeiras 3 variações foram incluídas no seu uso. Para regenerar prompts adicionais,
            o valor é de <strong>R$ 1,99 por prompt extra</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="space-y-4 py-1">
          {/* Alerta de demonstração idêntico à página Planos */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Ambiente de Demonstração:</strong> Nenhuma cobrança real será realizada no seu
              cartão. Os créditos extras serão computados e salvos no seu perfil do banco de dados.
            </span>
          </div>

          {/* Seleção de Quantidade */}
          <div className="p-3 bg-muted/40 border rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Quantidade de prompts extras:</span>
              <div className="flex items-center gap-1.5">
                {[1, 3, 5].map((q) => (
                  <Button
                    key={q}
                    type="button"
                    size="sm"
                    variant={quantity === q ? 'default' : 'outline'}
                    onClick={() => setQuantity(q)}
                    className={`h-7 px-2.5 text-xs ${
                      quantity === q
                        ? 'bg-pink-600 text-white font-bold'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {q} {q === 1 ? 'extra' : 'extras'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm pt-1 border-t">
              <span className="text-muted-foreground text-xs">Total a pagar:</span>
              <span className="font-extrabold text-foreground text-base text-pink-600 dark:text-pink-400">
                {totalPrice}
              </span>
            </div>
          </div>

          {/* Campos do Cartão Simulados */}
          <div className="space-y-2">
            <Label htmlFor="regen-card-number" className="text-xs">
              Número do Cartão
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="regen-card-number"
                placeholder="0000 0000 0000 0000"
                className="pl-9 font-mono text-sm"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regen-card-holder" className="text-xs">
              Nome no Cartão
            </Label>
            <Input
              id="regen-card-holder"
              placeholder="NOME COMO NO CARTÃO"
              className="text-sm"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="regen-card-expiry" className="text-xs">
                Validade
              </Label>
              <Input
                id="regen-card-expiry"
                placeholder="MM/AA"
                className="text-sm"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="regen-card-cvc" className="text-xs">
                CVC
              </Label>
              <Input
                id="regen-card-cvc"
                placeholder="123"
                maxLength={4}
                className="text-sm"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-2 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold"
              disabled={processing}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {processing ? 'Confirmando...' : `Pagar ${totalPrice} & Liberar`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
