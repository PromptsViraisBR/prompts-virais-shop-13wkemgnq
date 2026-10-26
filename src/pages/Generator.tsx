import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ExternalVideoToolsCard } from '@/components/ExternalVideoToolsCard'
import {
  saveGeneratedPrompt,
  getUserGenerations,
  adaptPromptWithImages,
  regeneratePromptVariations,
  PromptVariation,
} from '@/services/generations'
import {
  getDailyLimitStatus,
  consumeDailyGeneration,
  DailyLimitStatus,
} from '@/services/freeLimitsAndReferrals'
import {
  getUserRegenerationCredits,
  consumeExtraRegenerationCredit,
} from '@/services/regenerationCredits'
import { RegenerationPaymentModal } from '@/components/RegenerationPaymentModal'
import { AuthGateModal } from '@/components/AuthGateModal'
import { RefreshCw, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  History,
  Crown,
  Upload,
  X,
  ImagePlus,
  FileImage,
  ArrowRight,
  Flame,
  ShoppingBag,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { GenerationRecord, NicheType, StyleType, PlatformType } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

export const Generator: React.FC = () => {
  const { user, isAdmin, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  // Limite diário no servidor para vendas (6 prompts/dia no modo grátis)
  const [dailyLimitStatus, setDailyLimitStatus] = useState<DailyLimitStatus | null>(null)

  useEffect(() => {
    if (user) {
      getDailyLimitStatus('vendas')
        .then((st) => setDailyLimitStatus(st))
        .catch(() => {})
    }
  }, [user])

  // Form State
  const [productName, setProductName] = useState('')
  const [niche, setNiche] = useState<NicheType>('moda_feminina')
  const [style, setStyle] = useState<StyleType>('pov')
  const [platform, setPlatform] = useState<PlatformType>('tiktok_shop')
  const [targetAudience, setTargetAudience] = useState('')
  const [details, setDetails] = useState('')
  const [visualDetails, setVisualDetails] = useState('')

  // Upload de fotos (até 3 imagens)
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [referencePreviews, setReferencePreviews] = useState<string[]>([])

  // Resultados
  const [generating, setGenerating] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)

  // Auth Gate para deslogados
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState('')

  // Estados de Regeneração com 3 Variações e Cobrança de Extras
  const [variations, setVariations] = useState<PromptVariation[]>([])
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const [copiedVarId, setCopiedVarId] = useState<string | null>(null)
  const [hasFreeRegenerated, setHasFreeRegenerated] = useState(false)
  const [extraCreditsBalance, setExtraCreditsBalance] = useState<number>(0)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  useEffect(() => {
    if (user && isPaidPlan) {
      loadHistory()
      loadRegenCredits()
    }
  }, [user, isPaidPlan])

  const loadRegenCredits = async () => {
    if (!user) return
    const credits = await getUserRegenerationCredits(user.id)
    if (credits) {
      setExtraCreditsBalance(credits.extra_prompts_balance || 0)
    }
  }

  // Limpeza de Object URLs quando previews mudarem
  useEffect(() => {
    return () => {
      referencePreviews.forEach((previewUrl) => {
        if (previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl)
        }
      })
    }
  }, [referencePreviews])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return

      if (!user) {
        setAuthGateAction('Fazer upload de fotos da sua peça')
        setAuthGateOpen(true)
        e.target.value = ''
        return
      }

      const incoming = Array.from(files)
      const availableSlots = 3 - referenceFiles.length

      if (availableSlots <= 0) {
        toast({
          title: 'Limite de imagens atingido',
          description: 'Você pode adicionar no máximo 3 imagens da peça/vitrine.',
          variant: 'destructive',
        })
        e.target.value = ''
        return
      }

      const validFiles: File[] = []
      const newPreviews: string[] = []

      for (const file of incoming.slice(0, availableSlots)) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Formato inválido',
            description: `O arquivo "${file.name}" não é uma imagem válida.`,
            variant: 'destructive',
          })
          continue
        }
        if (file.size > 15 * 1024 * 1024) {
          toast({
            title: 'Imagem muito pesada',
            description: `A foto "${file.name}" excede 15MB.`,
            variant: 'destructive',
          })
          continue
        }

        try {
          const preview = URL.createObjectURL(file)
          validFiles.push(file)
          newPreviews.push(preview)
        } catch (objErr) {
          console.warn('[Generator] Falha ao criar preview:', objErr)
        }
      }

      if (validFiles.length > 0) {
        setReferenceFiles((prev) => [...prev, ...validFiles])
        setReferencePreviews((prev) => [...prev, ...newPreviews])

        if (incoming.length > availableSlots) {
          toast({
            title: 'Algumas imagens não foram adicionadas',
            description: `Limite máximo de 3 imagens. Apenas ${validFiles.length} foram adicionada(s).`,
          })
        } else {
          toast({
            title: 'Foto(s) adicionada(s) com sucesso! 📸',
            description: 'O roteiro será gerado fielmente de acordo com a sua peça física.',
          })
        }
      }
    } catch (err: any) {
      console.error('[Generator] Erro no upload de imagem:', err)
      toast({
        title: 'Não foi possível carregar a imagem',
        description: 'Tente selecionar outro arquivo de imagem.',
        variant: 'destructive',
      })
    } finally {
      if (e.target) e.target.value = ''
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const removedPreview = referencePreviews[indexToRemove]
    if (removedPreview && removedPreview.startsWith('blob:')) {
      URL.revokeObjectURL(removedPreview)
    }

    setReferenceFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    setReferencePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const loadHistory = async () => {
    if (!user) return
    try {
      const records = await getUserGenerations(user.id)
      setHistory(records)
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setAuthGateAction('Gerar roteiro personalizado com fotos')
      setAuthGateOpen(true)
      return
    }

    if (!productName.trim()) {
      toast({
        title: 'Informe o nome do produto',
        description: 'Exemplo: Vestido Midi Canelado, Camiseta Oversized, etc.',
        variant: 'destructive',
      })
      return
    }

    // 1. CHECAGEM E CONSUMO DO LIMITE DIÁRIO NO SERVIDOR (6 por dia no modo grátis / ilimitado PRO)
    try {
      const limitRes = await consumeDailyGeneration('vendas')
      setDailyLimitStatus({
        tab: 'vendas',
        date: limitRes.date,
        count_today: limitRes.count_today,
        limit: limitRes.limit,
        remaining: limitRes.remaining,
        is_unlimited: limitRes.is_unlimited,
        reason: limitRes.is_unlimited ? 'paid_or_admin' : 'free',
      })
    } catch (limitErr: any) {
      if (limitErr.limitReached) {
        toast({
          title: 'Limite diário atingido (6/6 prompts)',
          description:
            limitErr.message ||
            'Você atingiu o limite de 6 prompts hoje na aba de Vendas/TikTok Shop. Assine o plano PRO para gerar sem limites!',
          variant: 'destructive',
        })
        return
      }
      // Se não for limitReached e o usuário for free sem permissão, redireciona
      if (!isPaidPlan && !isAdmin) {
        toast({
          title: 'Acesse com plano PRO',
          description: 'Assine um plano para desbloquear todas as funções.',
          variant: 'destructive',
        })
        navigate('/planos')
        return
      }
    }

    setGenerating(true)
    try {
      // 1. Se o usuário enviou fotos ou detalhes visuais, chama a adaptação com IA
      let scriptToSave = ''

      if (referenceFiles.length > 0 || visualDetails.trim()) {
        try {
          const adaptRes = await adaptPromptWithImages({
            productName: productName.trim(),
            visualDetails: visualDetails.trim() || details.trim() || undefined,
            style,
            platform,
            referenceImages: referenceFiles,
            imagesCount: referenceFiles.length,
          })

          if (adaptRes && adaptRes.success && adaptRes.adapted_prompt) {
            scriptToSave = adaptRes.adapted_prompt
          }
        } catch (adaptErr) {
          console.warn(
            '[Generator] Falha na adaptação de imagem, recorrendo ao roteiro base estruturado:',
            adaptErr,
          )
        }
      }

      // 2. Salva no banco de dados através de saveGeneratedPrompt
      const record = await saveGeneratedPrompt({
        userId: user.id,
        productName: productName.trim(),
        niche: niche || 'moda_feminina',
        style: style || 'pov',
        platform: platform || 'ambos',
        targetAudience: targetAudience.trim() || undefined,
        details: details.trim() || undefined,
        visualDetails: visualDetails.trim() || undefined,
        referenceImages: referenceFiles.length > 0 ? referenceFiles : undefined,
      })

      // Se a IA gerou um roteiro adaptado customizado, utiliza no display
      const finalPromptText = scriptToSave || record.generated_prompt
      setCurrentPrompt(finalPromptText)
      setCurrentGenerationId(record.id)
      setHistory((prev) => [record, ...prev])

      toast({
        title: 'Roteiro Gerado com Sucesso! 🎬✨',
        description:
          referenceFiles.length > 0
            ? `Roteiro 100% calibrado nas ${referenceFiles.length} foto(s) da sua vitrine!`
            : 'Pronto para você gravar e vender no TikTok Shop ou Shopee.',
      })
    } catch (err: any) {
      console.error('Erro na geração do prompt:', err)
      toast({
        title: 'Não foi possível gerar agora',
        description: err?.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyPrompt = () => {
    if (!currentPrompt) return
    if (!user) {
      setAuthGateAction('Copiar roteiro gerado')
      setAuthGateOpen(true)
      return
    }
    navigator.clipboard.writeText(currentPrompt)
    setCopied(true)
    toast({
      title: 'Roteiro copiado! 📋✨',
      description: 'Cole no bloco de notas ou vá direto para a gravação da vitrine.',
    })
    setTimeout(() => setCopied(false), 2500)
  }

  const handleCopyVariation = (vId: string, text: string) => {
    if (!user) {
      setAuthGateAction('Copiar variação do roteiro')
      setAuthGateOpen(true)
      return
    }
    navigator.clipboard.writeText(text)
    setCopiedVarId(vId)
    toast({
      title: 'Variação copiada! 📋✨',
      description: 'Roteiro copiado para a área de transferência.',
    })
    setTimeout(() => setCopiedVarId(null), 2500)
  }

  const handleRegenerateClick = async () => {
    if (!user) {
      setAuthGateAction('Regenerar variações do roteiro')
      setAuthGateOpen(true)
      return
    }

    if (!isPaidPlan) {
      toast({
        title: 'Recurso Exclusivo PRO',
        description: 'Assine um plano para usar a regeneração inteligente.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    // Se não há créditos extras e já usou a cota gratuita ou não há saldo
    if (!isAdmin && extraCreditsBalance <= 0 && hasFreeRegenerated) {
      setPaymentModalOpen(true)
      return
    }

    setRegenerating(true)
    try {
      const res = await regeneratePromptVariations({
        basePrompt: currentPrompt || undefined,
        promptTitle: productName.trim(),
        productName: productName.trim(),
        visualDetails: visualDetails.trim() || details.trim() || undefined,
        niche: niche || 'moda_feminina',
        imagesCount: referenceFiles.length,
        category: 'ecommerce',
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res && res.success && res.variations?.length) {
        setVariations(res.variations)
        setSelectedVariationId(res.variations[0].id)

        // Se era uma regeneração extra com crédito, deduz 1 crédito
        if (isAdmin) {
          toast({
            title: '3 Novas Variações Geradas! 🎨👑',
            description: 'Acesso Admin PRO Total — regenerações ilimitadas.',
          })
        } else if (hasFreeRegenerated && extraCreditsBalance > 0) {
          await consumeExtraRegenerationCredit(user.id)
          setExtraCreditsBalance((prev) => Math.max(0, prev - 1))
          toast({
            title: '3 Novas Variações Regeneradas! ⚡',
            description: '1 crédito extra foi utilizado com sucesso.',
          })
        } else {
          setHasFreeRegenerated(true)
          toast({
            title: '3 Novas Variações Geradas! 🎨✨',
            description: '3 abordagens diferentes (Emocional, Urgência e Prova Social) incluídas.',
          })
        }

        // Salvar a 1ª variação no histórico também
        try {
          await saveGeneratedPrompt({
            userId: user.id,
            productName: productName.trim() || 'Variação de Roteiro',
            niche,
            style,
            platform,
            details: details.trim() || undefined,
            visualDetails: visualDetails.trim() || undefined,
          })
          loadHistory()
        } catch {
          /* intentionally ignored */
        }
      }
    } catch (err: any) {
      console.error('[Generator] Erro ao regenerar variações:', err)
      toast({
        title: 'Não foi possível gerar variações agora',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="py-4 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header - Mobile First */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 sm:pb-6 text-center md:text-left items-center">
        <div className="space-y-1.5 flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerador TikTok Shop & Shopee</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>Gerador de Vendas 🎬</span>
            {isPaidPlan && (
              <Badge className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs uppercase">
                PRO Ilimitado
              </Badge>
            )}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl">
            Suba até 3 fotos da sua peça física ou da vitrine da sua loja. Nossa inteligência cria
            um roteiro viral cena a cena fiel às cores, caimento e detalhes reais do seu produto!
          </p>
        </div>

        {isPaidPlan && history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(!historyOpen)}
            className="self-start md:self-auto gap-2"
          >
            <History className="w-4 h-4 text-pink-500" />
            Histórico ({history.length})
          </Button>
        )}
      </div>

      {/* Alerta para Visitantes Deslogados ou Status de Limite Diário no Modo Grátis */}
      {!user ? (
        <Card className="border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-transparent shadow-sm">
          <CardHeader className="pb-3 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <Badge className="bg-pink-600 text-white font-bold text-xs uppercase">
                Login Necessário
              </Badge>
              <Lock className="w-5 h-5 text-pink-500" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold">
              Entre ou Crie Sua Conta Grátis para Usar o Gerador 👗📸
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Usuários cadastrados no modo grátis têm direito a <strong>6 gerações por dia</strong>{' '}
              de roteiros TikTok Shop/Vendas e <strong>6 gerações por dia</strong> em Vídeos Virais
              (totalizando 12/dia).
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-2 shadow-md">
                Criar Conta Grátis (12 prompts/dia)
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full font-semibold">
                Já tenho conta — Entrar
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : !isPaidPlan && !isAdmin ? (
        <Card className="border border-pink-500/30 bg-gradient-to-br from-pink-500/5 via-amber-500/5 to-transparent shadow-xs">
          <CardHeader className="pb-3 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-pink-600 border-pink-500/40 font-bold text-[11px] uppercase"
              >
                Modo Gratuito Ativo
              </Badge>
              <Sparkles className="w-4 h-4 text-pink-500" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Seu Limite Diário na Aba de Vendas:{' '}
              {dailyLimitStatus
                ? `${dailyLimitStatus.count_today} de ${dailyLimitStatus.limit} gerados hoje`
                : '6 prompts/dia'}
            </CardTitle>
            <CardDescription className="text-xs">
              Você tem 6 prompts por dia nesta aba e mais 6 na aba de Vídeos Virais. Ao batermos 10
              assinantes anuais no site, a liberação será automática e ilimitada! Deseja gerar sem
              limites agora?
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-1 flex flex-wrap gap-2">
            <Link to="/planos">
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                Assinar PRO Ilimitado
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : null}

      {/* Histórico Deslizante / Recolhível */}
      {isPaidPlan && historyOpen && history.length > 0 && (
        <Card className="border bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <CardHeader className="py-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <History className="w-4 h-4 text-pink-500" />
                Seus Roteiros Gerados Recentemente
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistoryOpen(false)}
                className="h-7 text-xs"
              >
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentPrompt(item.generated_prompt)
                    setCurrentGenerationId(item.id)
                    setProductName(item.product_name)
                    setNiche(item.niche)
                    setStyle(item.style)
                    setHistoryOpen(false)
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                  className="p-3.5 rounded-xl border bg-card hover:border-pink-500/50 cursor-pointer transition-all space-y-1.5 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground line-clamp-1">
                      {item.product_name}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {NICHE_LABELS[item.niche] || item.niche}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.generated_prompt}
                  </p>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold block pt-1">
                    Ver e copiar este roteiro →
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid Principal: Formulário + Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário (Col 7) */}
        <div className="lg:col-span-7">
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-pink-500" />
                Dados do Produto & Fotos da Vitrine
              </CardTitle>
              <CardDescription>
                Preencha os detalhes e anexe até 3 fotos da peça para calibrar o gancho e as cenas.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleGenerate}>
              <CardContent className="space-y-5">
                {/* 1. Nome do Produto */}
                <div className="space-y-2">
                  <Label
                    htmlFor="product-name"
                    className="text-sm font-semibold flex items-center justify-between"
                  >
                    <span>Nome da Roupa / Produto *</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Ex: Vestido Midi Canelado
                    </span>
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="Ex: Cropped Canelado Gola Alta, Calça Wide Leg Alfaiataria..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    disabled={!user}
                    className="py-5"
                  />
                </div>

                {/* 2. Upload de Fotos da Peça (Até 3 imagens) */}
                <div className="space-y-2.5 p-4 rounded-2xl border-2 border-dashed bg-muted/20 border-pink-500/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <ImagePlus className="w-4 h-4 text-pink-500" />
                      Fotos Reais da Peça (Até 3)
                    </Label>
                    <span className="text-xs text-muted-foreground font-medium">
                      {referenceFiles.length} de 3 anexadas
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Suba fotos tiradas com o celular, da arara ou da vitrine. Nosso roteiro vai
                    descrever exatamente o tecido, cor e caimento da foto!
                  </p>

                  {/* Previews das Imagens Selecionadas */}
                  {referencePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {referencePreviews.map((previewUrl, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden border bg-background group shadow-xs"
                        >
                          <img
                            src={previewUrl}
                            alt={`Referência ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                            title="Remover foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white font-medium">
                            Foto {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botão de Upload se houver vagas */}
                  {referenceFiles.length < 3 && (
                    <div className="pt-1">
                      <label
                        htmlFor="image-upload-input"
                        className={`inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs cursor-pointer transition-colors ${
                          !user ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>Adicionar Foto da Peça ({3 - referenceFiles.length} restantes)</span>
                      </label>
                      <input
                        id="image-upload-input"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={!user || referenceFiles.length >= 3}
                      />
                    </div>
                  )}
                </div>

                {/* 3. Nicho e Estilo em Linha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Nicho do Produto</Label>
                    <Select
                      value={niche}
                      onValueChange={(val) => setNiche(val as NicheType)}
                      disabled={!user}
                    >
                      <SelectTrigger>
                        {' '}
                        <SelectValue placeholder="Selecione o nicho" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(NICHE_LABELS) as NicheType[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {NICHE_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Estilo de Gravação</Label>
                    <Select
                      value={style}
                      onValueChange={(val) => setStyle(val as StyleType)}
                      disabled={!user}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estilo" />{' '}
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STYLE_LABELS) as StyleType[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {STYLE_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 4. Canal de Venda e Público-Alvo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Canal de Venda</Label>
                    <Select
                      value={platform}
                      onValueChange={(val) => setPlatform(val as PlatformType)}
                      disabled={!user}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o canal" />{' '}
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PLATFORM_LABELS) as PlatformType[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {PLATFORM_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target-audience" className="text-sm font-semibold">
                      Público-Alvo (Opcional)
                    </Label>
                    <Input
                      id="target-audience"
                      placeholder="Ex: Mulheres 20-35 anos, mães, homens streetwear..."
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      disabled={!user}
                    />
                  </div>
                </div>

                {/* 5. Detalhes Visuais / Benefícios da Peça */}
                <div className="space-y-2">
                  <Label
                    htmlFor="visual-details"
                    className="text-sm font-semibold flex items-center justify-between"
                  >
                    <span>Detalhes do Tecido / Caimento das Fotos (Opcional)</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Ex: canelado grosso, zero transparência
                    </span>
                  </Label>
                  <Textarea
                    id="visual-details"
                    placeholder="Descreva detalhes específicos da foto: cor vinho acetinada, zíper reforçado, cintura com elástico embutido, caimento soltinho..."
                    value={visualDetails}
                    onChange={(e) => setVisualDetails(e.target.value)}
                    disabled={!user}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* 6. Benefício Principal / Oferta */}
                <div className="space-y-2">
                  <Label htmlFor="product-details" className="text-sm font-semibold">
                    Oferta / Benefício para o CTA (Opcional)
                  </Label>
                  <Input
                    id="product-details"
                    placeholder="Ex: Frete grátis hoje, cupom de 1ª compra, envio imediato..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={!user}
                  />
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-pink-500" />
                    Roteiro máx 10s • Vídeo 100% liso (PT-BR)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Botão Regenerar Sempre Visível no Formulário */}
                  <Button
                    type="button"
                    onClick={handleRegenerateClick}
                    disabled={generating || regenerating}
                    variant="outline"
                    className="border-pink-500/40 text-pink-600 dark:text-pink-400 font-bold hover:bg-pink-500/10 gap-1.5 shadow-xs"
                  >
                    <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                    <span>Regenerar Prompt ({extraCreditsBalance} disponíveis)</span>
                  </Button>

                  <Button
                    type="submit"
                    disabled={generating || (!user ? false : !isPaidPlan)}
                    size="lg"
                    className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold shadow-md gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Calibrando Roteiro com as Fotos...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Gerar Meu Prompt 🎬</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Exibição do Resultado (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border shadow-lg sticky top-24">
            <CardHeader className="bg-muted/40 border-b py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Roteiro Completo para Gravação
                </CardTitle>

                {currentPrompt && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleCopyPrompt}
                    className="gap-1.5 text-xs font-bold bg-gradient-to-r from-pink-600 to-amber-500 text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Roteiro
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {currentPrompt ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-700 dark:text-pink-300 font-medium flex items-center justify-between">
                    <span>✨ Roteiro pronto e calibrado para suas fotos!</span>
                    <Badge variant="outline" className="text-[10px] bg-background">
                      {referenceFiles.length > 0 ? `${referenceFiles.length} foto(s)` : 'Sem fotos'}
                    </Badge>
                  </div>

                  <div className="bg-muted/30 border rounded-xl p-4 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground select-all max-h-[460px] overflow-y-auto">
                    {currentPrompt}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <Button
                      onClick={handleCopyPrompt}
                      className="flex-1 py-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Roteiro Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar Roteiro Principal
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleRegenerateClick}
                      disabled={regenerating}
                      variant="outline"
                      className="py-5 border-pink-500/40 text-pink-600 dark:text-pink-400 font-bold hover:bg-pink-500/10 gap-2 shadow-xs"
                    >
                      {regenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                          <span>Regenerando...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Regenerar Prompt ({extraCreditsBalance} disponíveis)</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Informação sobre regenerações extras e saldo de créditos */}
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
                    <span>
                      {hasFreeRegenerated
                        ? extraCreditsBalance > 0
                          ? `Saldo: ${extraCreditsBalance} prompt(s) extra(s) liberado(s)`
                          : 'Próxima regeneração: R$ 1,99 por prompt extra'
                        : '1º clique de regeneração incluído no plano PRO'}
                    </span>
                    {extraCreditsBalance > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold"
                      >
                        {extraCreditsBalance} crédito(s)
                      </Badge>
                    )}
                  </div>

                  {/* Seção das 3 variações regeneradas */}
                  {variations.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-500" />3 Variações em Ângulos
                          Diferentes:
                        </span>
                        <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[10px] font-bold">
                          1-Clique
                        </Badge>
                      </div>

                      {/* Abas / Pílulas para alternar entre as 3 variações */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {variations.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariationId(v.id)}
                            className={`p-2 rounded-xl text-left border text-xs transition-all ${
                              selectedVariationId === v.id
                                ? 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                                : 'border-border bg-card hover:bg-muted/30 text-muted-foreground'
                            }`}
                          >
                            <span className="block truncate text-[11px]">{v.badge}</span>
                          </button>
                        ))}
                      </div>

                      {/* Variação selecionada em destaque com botão de copiar individual */}
                      {selectedVariationId &&
                        (() => {
                          const currentVar = variations.find((v) => v.id === selectedVariationId)
                          if (!currentVar) return null
                          const isVarCopied = copiedVarId === currentVar.id
                          return (
                            <div className="p-3.5 rounded-2xl border bg-muted/20 space-y-2.5 animate-in fade-in-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-bold text-foreground">
                                    {currentVar.angle}
                                  </span>
                                  <p className="text-[11px] text-muted-foreground">
                                    {currentVar.description}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCopyVariation(currentVar.id, currentVar.prompt_text)
                                  }
                                  className="h-8 text-xs gap-1 font-bold bg-pink-600 text-white hover:bg-pink-700"
                                >
                                  {isVarCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      Copiado!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      Copiar Variação
                                    </>
                                  )}
                                </Button>
                              </div>

                              <div className="bg-background border rounded-xl p-3 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto select-all">
                                {currentVar.prompt_text}
                              </div>
                            </div>
                          )
                        })()}
                    </div>
                  )}

                  {/* Sugestão de Ferramentas de Vídeo: Flow/Veo, Gemini, Motion 16 logo após roteiro, cópias e variações */}
                  <ExternalVideoToolsCard
                    title="Para onde levar este roteiro agora?"
                    description="Copie o roteiro acima e escolha a ferramenta recomendada para renderizar seu vídeo:"
                    compact
                  />
                </div>
              ) : (
                <div className="py-16 px-4 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto text-2xl">
                    🎬
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">
                      Seu roteiro aparecerá aqui
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Preencha o formulário ao lado com os dados da peça e suba até 3 fotos. Ao
                      clicar em "Gerar Meu Prompt", o roteiro completo será montado cena por cena.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Cobrança Demonstrativa para Regenerações Extras */}
      {user && (
        <RegenerationPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          userId={user.id}
          onPaymentSuccess={(newBalance) => {
            setExtraCreditsBalance(newBalance)
            // Dispara a regeneração logo após o pagamento demonstrativo
            setTimeout(() => {
              handleRegenerateClick()
            }, 300)
          }}
        />
      )}

      {/* Auth Gate Modal para Visitantes Não Autenticados */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre para Acessar o Gerador Inteligente"
        description="Para gerar roteiros sob medida com fotos da sua vitrine, copiar ou regenerar variações, crie sua conta gratuita em poucos segundos."
      />
    </div>
  )
}
export default Generator
