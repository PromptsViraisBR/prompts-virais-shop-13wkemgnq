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
import {
  CreditCard,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  QrCode,
  Copy,
  Check,
  Zap,
} from 'lucide-react'
import { purchaseExtraRegenerations } from '@/services/regenerationCredits'
import { createMercadoPagoCheckout } from '@/services/mercadoPago'
import { trackFunnelEvent } from '@/services/events'
import { useToast } from '@/hooks/use-toast'
import { ExternalLink, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface RegenerationPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onPaymentSuccess: (newBalance: number) => void
}

type PaymentTab = 'saved_card' | 'new_card' | 'pix'

export const RegenerationPaymentModal: React.FC<RegenerationPaymentModalProps> = ({
  open,
  onOpenChange,
  userId,
  onPaymentSuccess,
}) => {
  const { toast } = useToast()
  const { subscription } = useAuth()

  // Verifica se há cartão salvo na conta (da assinatura ou perfil)
  const savedCardLast4 = subscription?.card_last4 || '4242'
  const savedCardBrand = subscription?.card_brand || 'Mastercard'
  const hasSavedCard = Boolean(subscription?.card_last4 || subscription?.status === 'active')

  const [paymentTab, setPaymentTab] = useState<PaymentTab>(hasSavedCard ? 'saved_card' : 'new_card')
  const [quantity, setQuantity] = useState<number>(1)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardHolder, setCardHolder] = useState('MARIA SOUZA')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('888')
  const [processing, setProcessing] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  const unitPrice = 1.99
  const totalPriceNumber = quantity * unitPrice
  const totalPrice = totalPriceNumber.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  // Código Pix fictício demonstrativo
  const simulatedPixCode = `00020126580014br.gov.bcb.pix0136${userId.slice(0, 8)}-prompts-virais-shop520400005303986540${totalPriceNumber.toFixed(2)}5802BR5925PROMPTS VIRAIS SHOP6009SAO PAULO62070503***6304`

  const handleCopyPix = () => {
    navigator.clipboard.writeText(simulatedPixCode)
    setPixCopied(true)
    toast({
      title: 'Código Pix Copiado! 📋✨',
      description: 'Cole no aplicativo do seu banco para simular o pagamento.',
    })
    setTimeout(() => setPixCopied(false), 3000)
  }

  const handleConfirm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
      trackFunnelEvent('checkout_start', {
        type: 'credits',
        quantity,
      })

      // Inicia checkout oficial no Mercado Pago para compra avulsa de créditos (R$ 1,99 por unidade)
      const res = await createMercadoPagoCheckout({
        type: 'credits',
        quantity,
      })

      if (res.code === 'PAYMENTS_NOT_CONFIGURED' || !res.success) {
        toast({
          title: 'Pagamentos em Configuração',
          description:
            res.error ||
            'O administrador precisa inserir o token do Mercado Pago no painel Skip Cloud para processar cobranças reais.',
          variant: 'destructive',
        })
        return
      }

      if (res.init_point) {
        toast({
          title: 'Redirecionando para o Mercado Pago...',
          description: 'Conclua a compra com Pix, Cartão ou Boleto oficial.',
        })
        window.location.href = res.init_point
      } else {
        toast({
          title: 'Erro ao gerar checkout',
          description: res.error || 'Não foi possível iniciar a preferência no Mercado Pago.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro na conexão',
        description: err.message || 'Falha ao conectar com o serviço do Mercado Pago.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="w-5 h-5 text-pink-500" />
            Adquirir Prompts de Regeneração
          </DialogTitle>
          <DialogDescription>
            Seus créditos atuais chegaram a 0. Adquira regenerações adicionais por{' '}
            <strong>R$ 1,99 por prompt extra</strong> usando o cartão cadastrado ou Pix.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Selo oficial Mercado Pago */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>
              <strong>Pagamento Seguro via Mercado Pago:</strong> Checkout Pro oficial com liberação
              automática de créditos assim que o pagamento for aprovado.
            </span>
          </div>

          {/* Seleção de Quantidade */}
          <div className="p-3 bg-muted/40 border rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Quantidade de prompts:</span>
              <div className="flex items-center gap-1.5">
                {[1, 3, 5, 10].map((q) => (
                  <Button
                    key={q}
                    type="button"
                    size="sm"
                    variant={quantity === q ? 'default' : 'outline'}
                    onClick={() => setQuantity(q)}
                    className={`h-7 px-2.5 text-xs rounded-lg ${
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
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground text-xs">Total demonstrativo:</span>
              <span className="font-extrabold text-foreground text-base text-pink-600 dark:text-pink-400">
                {totalPrice}
              </span>
            </div>
          </div>

          {/* Abas de Método de Pagamento */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Escolha a Forma de Pagamento
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentTab('saved_card')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs ${
                  paymentTab === 'saved_card'
                    ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold shadow-xs'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <Zap className="w-4 h-4 text-pink-500" />
                <span>Cartão Salvo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('pix')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs ${
                  paymentTab === 'pix'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-500" />
                <span>Pix Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('new_card')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs ${
                  paymentTab === 'new_card'
                    ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold shadow-xs'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <CreditCard className="w-4 h-4 text-pink-500" />
                <span>Outro Cartão</span>
              </button>
            </div>
          </div>

          {/* Conteúdo: Cartão Cadastrado na Conta (1 Clique) */}
          {paymentTab === 'saved_card' && (
            <div className="p-4 rounded-2xl border bg-gradient-to-br from-pink-500/10 via-background to-amber-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-pink-500" />
                  Cartão cadastrado na sua conta
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Pronto para uso
                </span>
              </div>

              <div className="p-3 rounded-xl bg-background border flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">
                    {savedCardBrand} •••• {savedCardLast4}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Salvo no seu perfil • Cobrança em 1 clique
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-pink-600 dark:text-pink-400">
                    {totalPrice}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Clique abaixo para liberar {quantity} prompt(s) de regeneração imediatamente sem
                precisar digitar novamente os dados do seu cartão.
              </p>
            </div>
          )}

          {/* Conteúdo: Pix Instantâneo */}
          {paymentTab === 'pix' && (
            <div className="p-4 rounded-2xl border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-500" />
                  QR Code Pix Demonstrativo
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Liberação Imediata
                </span>
              </div>

              {/* QR Code Simulado Visual */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-background border">
                <div className="w-28 h-28 shrink-0 bg-white p-2 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
                  <div className="w-full h-full border-2 border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center text-emerald-600">
                    <QrCode className="w-16 h-16" />
                  </div>
                  <span className="absolute bottom-1 text-[9px] font-bold text-slate-700 bg-white/90 px-1 rounded">
                    PIX SIMULADO
                  </span>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      Valor a pagar: <strong>{totalPrice}</strong>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Escaneie ou copie a chave Pix demonstrativa abaixo para simular a liberação.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPix}
                    className="w-full text-xs gap-1.5 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold"
                  >
                    {pixCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Código Pix Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Código Pix
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo: Formulário de Novo Cartão */}
          {paymentTab === 'new_card' && (
            <form onSubmit={handleConfirm} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="regen-new-card-number" className="text-xs">
                  Número do Cartão
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="regen-new-card-number"
                    placeholder="0000 0000 0000 0000"
                    className="pl-9 font-mono text-xs sm:text-sm"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="regen-new-card-holder" className="text-xs">
                  Nome no Cartão
                </Label>
                <Input
                  id="regen-new-card-holder"
                  placeholder="NOME COMO NO CARTÃO"
                  className="text-xs sm:text-sm uppercase"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="regen-new-card-expiry" className="text-xs">
                    Validade
                  </Label>
                  <Input
                    id="regen-new-card-expiry"
                    placeholder="MM/AA"
                    className="text-xs sm:text-sm"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="regen-new-card-cvc" className="text-xs">
                    CVC
                  </Label>
                  <Input
                    id="regen-new-card-cvc"
                    placeholder="123"
                    maxLength={4}
                    className="text-xs sm:text-sm"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          )}

          <DialogFooter className="pt-2 sm:justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={() => handleConfirm()}
              className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-1.5 shadow-md"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando Checkout...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pagar {totalPrice} no Mercado Pago
                  <ExternalLink className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default RegenerationPaymentModal
