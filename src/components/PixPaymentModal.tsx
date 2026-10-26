import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  QrCode,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { checkPaymentStatus, type CreatePixResult } from '@/services/mercadoPago'

interface PixPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pixData: CreatePixResult | null
  onPaymentApproved?: () => void
  onPayWithCard?: () => void
  title?: string
  description?: string
}

const DEFAULT_EXPIRATION_SECONDS = 30 * 60 // 30 minutos padrão do MP

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  open,
  onOpenChange,
  pixData,
  onPaymentApproved,
  onPayWithCard,
  title = 'Pagamento via Pix Oficial',
  description = 'Escaneie o QR Code ou copie o código Pix para pagar no aplicativo do seu banco.',
}) => {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(DEFAULT_EXPIRATION_SECONDS)
  const [isApproved, setIsApproved] = useState(false)
  const [checking, setChecking] = useState(false)
  const [imageError, setImageError] = useState(false)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reseta contador, imagem e status quando abrir ou receber novo Pix
  useEffect(() => {
    if (open && pixData?.payment_id) {
      setIsApproved(false)
      setImageError(false)

      // Calcula os segundos restantes de forma estritamente tolerante a datas inválidas/nulas
      let initialSeconds = DEFAULT_EXPIRATION_SECONDS
      if (pixData?.date_of_expiration) {
        try {
          const parsed = new Date(pixData.date_of_expiration).getTime()
          if (!isNaN(parsed)) {
            const diffSec = Math.floor((parsed - Date.now()) / 1000)
            if (diffSec > 0 && diffSec <= 48 * 3600) {
              initialSeconds = diffSec
            }
          }
        } catch (_) {
          initialSeconds = DEFAULT_EXPIRATION_SECONDS
        }
      }
      setSecondsRemaining(initialSeconds)

      // Inicia polling leve a cada 3.5 segundos para detectar aprovação automática
      const interval = setInterval(async () => {
        try {
          const res = await checkPaymentStatus(pixData.payment_id!)
          if (res.is_approved || res.status === 'approved') {
            setIsApproved(true)
            clearInterval(interval)
            toast({
              title: 'Pagamento Pix Aprovado! 🎉',
              description: 'Seus recursos foram liberados instantaneamente.',
            })
            if (onPaymentApproved) {
              onPaymentApproved()
            }
          }
        } catch (_) {
          // Erro silencioso no polling contínuo
        }
      }, 3500)

      pollTimerRef.current = interval

      return () => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current)
      }
    } else {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [open, pixData?.payment_id, pixData?.date_of_expiration, onPaymentApproved, toast])

  // Contagem regressiva de expiração tolerante
  useEffect(() => {
    if (!open || isApproved) return
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (typeof prev !== 'number' || isNaN(prev)) return DEFAULT_EXPIRATION_SECONDS
        return prev > 0 ? prev - 1 : 0
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [open, isApproved])

  const formatTimer = (totalSeconds: number) => {
    const safeSecs =
      typeof totalSeconds === 'number' && !isNaN(totalSeconds) && totalSeconds >= 0
        ? totalSeconds
        : DEFAULT_EXPIRATION_SECONDS
    const mins = Math.floor(safeSecs / 60)
    const secs = safeSecs % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopy = () => {
    if (!pixData?.qr_code) return
    navigator.clipboard.writeText(pixData.qr_code)
    setCopied(true)
    toast({
      title: 'Código Pix Copiado! 📋✨',
      description: 'Cole no aplicativo do seu banco na opção Pix Copia e Cola.',
    })
    setTimeout(() => setCopied(false), 3000)
  }

  const handleManualCheck = async () => {
    if (!pixData?.payment_id || checking) return
    setChecking(true)
    try {
      const res = await checkPaymentStatus(pixData.payment_id)
      if (res.is_approved || res.status === 'approved') {
        setIsApproved(true)
        if (pollTimerRef.current) clearInterval(pollTimerRef.current)
        toast({
          title: 'Pagamento Confirmado! 🎉',
          description: 'A transação foi aprovada pelo Mercado Pago.',
        })
        if (onPaymentApproved) onPaymentApproved()
      } else {
        toast({
          title: 'Aguardando compensação',
          description:
            'O pagamento ainda está sendo processado pelo seu banco. Tente novamente em instantes.',
        })
      }
    } catch (_) {
      toast({
        title: 'Status pendente',
        description: 'Ainda não recebemos a confirmação. Continue aguardando.',
      })
    } finally {
      setChecking(false)
    }
  }

  const qrBase64Src = pixData?.qr_code_base64
    ? pixData.qr_code_base64.startsWith('data:image')
      ? pixData.qr_code_base64
      : `data:image/png;base64,${pixData.qr_code_base64}`
    : null

  const formattedAmount = pixData?.transaction_amount
    ? pixData.transaction_amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-left space-y-1.5 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <QrCode className="w-4 h-4" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                {title}
              </DialogTitle>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
              PIX OFICIAL MP
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {isApproved ? (
          // TELA DE SUCESSO APROVADO
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-foreground">Pagamento Pix Aprovado! 🎉</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                A transferência foi confirmada com sucesso pelo Mercado Pago e sua conta já foi
                atualizada.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 max-w-sm mx-auto text-xs text-emerald-700 dark:text-emerald-300">
              Valor confirmado: <strong>{formattedAmount}</strong> • ID:{' '}
              <span className="font-mono">{pixData?.payment_id}</span>
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => {
                onOpenChange(false)
                if (onPaymentApproved) onPaymentApproved()
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Continuar
            </Button>
          </div>
        ) : (
          // TELA DE PAGAMENTO PIX (QR CODE + COPIA E COLA)
          <div className="space-y-4 pt-2">
            {/* Bloco de Valor e Tempo de Expiração */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  Valor a Pagar
                </span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {formattedAmount}
                </p>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Expira em:
                </span>
                <span className="font-mono text-base font-bold text-foreground">
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
            </div>

            {/* Imagem do QR Code oficial do Mercado Pago com Fallback Gracioso */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-muted/30 border rounded-2xl space-y-3 max-w-full overflow-hidden">
              <div className="p-2 sm:p-3 bg-white rounded-2xl shadow-md border-2 border-emerald-500/30 flex items-center justify-center min-w-[180px] max-w-full">
                {qrBase64Src && !imageError ? (
                  <img
                    src={qrBase64Src}
                    alt="QR Code Pix Mercado Pago"
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageError(true)}
                    className="w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 object-contain max-w-full"
                  />
                ) : (
                  <div className="w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-center p-2 text-muted-foreground gap-2 bg-emerald-500/5 rounded-xl">
                    <QrCode className="w-12 h-12 text-emerald-600" />
                    <span className="text-xs font-bold text-foreground">
                      Use o Pix Copia e Cola
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      Copie o código oficial abaixo ou abra a fatura no Mercado Pago.
                    </span>
                    {pixData?.qr_code && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCopy}
                        className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 gap-1 font-bold"
                      >
                        <Copy className="w-3 h-3" />
                        Copiar Pix
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-foreground">
                  {qrBase64Src && !imageError
                    ? 'Abra o app do seu banco → Pix → Ler QR Code'
                    : 'Pague pelo Pix Copia e Cola no app do seu banco'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {qrBase64Src && !imageError
                    ? 'Aponte a câmera do seu celular para escanear'
                    : 'Cole a chave EMV oficial abaixo no seu banco'}
                </p>
              </div>
            </div>

            {/* Pix Copia e Cola */}
            {pixData?.qr_code && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5 text-emerald-500" />
                    Código Pix Copia e Cola:
                  </label>
                  <span className="text-[10px] text-muted-foreground">Clique para copiar</span>
                </div>

                <div className="relative">
                  <div
                    onClick={handleCopy}
                    className="w-full p-2.5 pr-24 rounded-xl bg-muted/60 border text-[11px] font-mono text-muted-foreground truncate cursor-pointer hover:bg-muted select-all break-all"
                  >
                    {pixData.qr_code}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopy}
                    className={`absolute right-1 top-1 h-7 text-xs font-bold gap-1 rounded-lg shrink-0 ${
                      copied
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Código
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Aviso de Reembolso Garantido em até 7 dias */}
            <div className="p-3 rounded-xl bg-muted/40 border space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Garantia de 7 Dias & Devolução Automática</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Conforme o Código de Defesa do Consumidor, qualquer compra realizada via Pix conta
                com direito a reembolso total solicitado em até 7 dias. Ao ser estornado, o valor{' '}
                <strong>retorna diretamente para a mesma conta bancária do comprador</strong> em
                instantes ou em até 7 dias.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="w-full sm:flex-1 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={handleManualCheck}
                disabled={checking}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Consultando...' : 'Já Paguei! Verificar Agora'}
              </Button>

              {pixData?.ticket_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <a href={pixData.ticket_url} target="_blank" rel="noopener noreferrer">
                    Recibo Oficial MP
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}

              {onPayWithCard && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    onOpenChange(false)
                    onPayWithCard()
                  }}
                >
                  Pagar com Cartão
                </Button>
              )}
            </div>

            <div className="text-center pt-1">
              <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Aguardando transferência via Banco Central do Brasil...
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PixPaymentModal
