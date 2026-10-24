import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPromptById } from '@/services/prompts'
import { toggleFavorite, isPromptFavorited } from '@/services/favorites'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Copy,
  Check,
  Heart,
  ArrowLeft,
  Lock,
  Sparkles,
  ShoppingBag,
  Crown,
  CheckCircle2,
  Image as ImageIcon,
  ImagePlus,
  Upload,
  X,
} from 'lucide-react'
import { adaptPromptWithImages } from '@/services/generations'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, STYLE_LABELS, STYLE_EMOJIS, PLATFORM_LABELS } from '@/types'
import { formatHookTitle, getEstimatedDuration, getPlatformInfo } from '@/lib/promptHooks'
import { Clock } from 'lucide-react'

export const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState<PromptRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Estado da Personalização com Fotos
  const [modalOpen, setModalOpen] = useState(false)
  const [customFiles, setCustomFiles] = useState<File[]>([])
  const [customPreviews, setCustomPreviews] = useState<string[]>([])
  const [customProductName, setCustomProductName] = useState('')
  const [customVisualDetails, setCustomVisualDetails] = useState('')
  const [adapting, setAdapting] = useState(false)
  const [adaptedResult, setAdaptedResult] = useState<string | null>(null)
  const [copiedAdapted, setCopiedAdapted] = useState(false)

  useEffect(() => {
    if (!id) return

    loadPrompt(id)
  }, [id, user])

  useEffect(() => {
    return () => {
      customPreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      })
    }
  }, [customPreviews])

  const loadPrompt = async (promptId: string) => {
    setLoading(true)
    try {
      const data = await getPromptById(promptId)
      setPrompt(data)

      if (user) {
        const fav = await isPromptFavorited(user.id, promptId)
        setIsFav(fav)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Prompt não encontrado',
        description: 'O roteiro solicitado não existe ou foi removido.',
        variant: 'destructive',
      })
      navigate('/biblioteca')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!prompt) return

    if (!prompt.is_free && !isPaidPlan) {
      toast({
        title: 'Conteúdo Exclusivo do Plano Pago',
        description: 'Faça upgrade para o plano Mensal ou Anual para copiar este roteiro completo.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(prompt.prompt_text)
    setCopied(true)
    toast({
      title: 'Prompt copiado com sucesso! 📋',
      description: 'Pronto para você gravar ou ajustar com as peças do seu catálogo.',
    })

    setTimeout(() => setCopied(false), 2500)
  }

  const handleToggleFav = async () => {
    if (!prompt) return
    if (!user) {
      toast({
        title: 'Faça login para favoritar',
        description: 'Salve seus roteiros preferidos na sua conta.',
      })
      navigate('/login')
      return
    }

    try {
      const result = await toggleFavorite(user.id, prompt.id)
      setIsFav(result)
      toast({
        title: result ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      })
    } catch (err) {
      toast({
        title: 'Erro ao favoritar',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando roteiro...</p>
      </div>
    )
  }

  if (!prompt) {
    return null
  }

  const isLocked = !prompt.is_free && !isPaidPlan

  const openCustomizeModal = () => {
    if (!prompt) return
    setCustomProductName(prompt.title)
    setCustomVisualDetails('')
    setCustomFiles([])
    setCustomPreviews([])
    setAdaptedResult(null)
    setCopiedAdapted(false)
    setModalOpen(true)
  }

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const incoming = Array.from(files)
    const availableSlots = 3 - customFiles.length
    if (availableSlots <= 0) {
      toast({
        title: 'Limite atingido',
        description: 'Você pode subir no máximo 3 fotos da peça.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    const accepted = incoming.slice(0, availableSlots)
    const newUrls = accepted.map((file) => URL.createObjectURL(file))
    setCustomFiles((prev) => [...prev, ...accepted])
    setCustomPreviews((prev) => [...prev, ...newUrls])
    e.target.value = ''
  }

  const handleRemoveCustomFile = (index: number) => {
    const url = customPreviews[index]
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    setCustomFiles((prev) => prev.filter((_, i) => i !== index))
    setCustomPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAdaptPrompt = async () => {
    if (!prompt) return
    setAdapting(true)
    try {
      const res = await adaptPromptWithImages({
        originalPrompt: prompt.prompt_text,
        promptTitle: prompt.title,
        productName: customProductName.trim() || prompt.title,
        visualDetails: customVisualDetails.trim() || undefined,
        style: prompt.style,
        platform: prompt.platform,
        referenceImages: customFiles,
        imagesCount: customFiles.length,
      })

      if (res.success && res.adapted_prompt) {
        setAdaptedResult(res.adapted_prompt)
        toast({
          title: 'Roteiro adaptado com sucesso! 📸✨',
          description: 'O prompt foi calibrado nas fotos da sua vitrine.',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao adaptar roteiro',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setAdapting(false)
    }
  }

  const handleCopyAdapted = () => {
    if (!adaptedResult) return
    navigator.clipboard.writeText(adaptedResult)
    setCopiedAdapted(true)
    toast({
      title: 'Roteiro adaptado copiado! 📋',
    })
    setTimeout(() => setCopiedAdapted(false), 2500)
  }

  const hasVideo = Boolean(prompt.reference_video_url && !videoError)
  const hasImage = Boolean(prompt.reference_image_url && !imageError)

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Botão voltar */}
      <div className="flex items-center justify-between">
        <Link to="/biblioteca">
          <Button variant="ghost" size="sm" className="gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Biblioteca
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openCustomizeModal}
            className="gap-1.5 text-xs border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 font-bold"
          >
            <ImagePlus className="w-4 h-4 text-pink-500" />
            Personalizar com minhas fotos 📸
          </Button>

          <Button variant="outline" size="sm" onClick={handleToggleFav} className="gap-2">
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isFav ? 'Favoritado' : 'Favoritar'}
          </Button>
        </div>
      </div>

      {/* Hero Visual de Referência (Cena 9:16 com clip em loop ou fallback animado) */}
      <div className="relative rounded-3xl overflow-hidden border bg-muted/30 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Clip Animado / Imagem Vertical de Referência em destaque */}
          <div className="md:col-span-5 relative aspect-[9/14] sm:aspect-[9/13] max-h-[480px] w-full overflow-hidden bg-black/5 dark:bg-black/20 flex items-center justify-center border-b md:border-b-0 md:border-r group">
            {hasVideo ? (
              <video
                src={prompt.reference_video_url}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : hasImage ? (
              <img
                src={prompt.reference_image_url}
                alt={prompt.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center ken-burns-active"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Visual de Referência</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Demonstração da cena, corte e caimento do produto para a gravação.
                  </p>
                </div>
              </div>
            )}

            {/* Gradient Overlay sutil inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              {hasVideo
                ? 'Clip Animado de Referência (Loop)'
                : 'Preview Animado da Referência (9:16)'}
            </div>
          </div>

          {/* Contexto do Visual ao lado */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-semibold text-xs gap-1">
                <span>{NICHE_EMOJIS[prompt.niche] || '👗'}</span>
                <span>{NICHE_LABELS[prompt.niche] || prompt.niche}</span>
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <span>{STYLE_EMOJIS[prompt.style] || '🎬'}</span>
                <span>{STYLE_LABELS[prompt.style] || prompt.style}</span>
              </Badge>
              {prompt.platform && (
                <Badge variant="outline" className="text-xs gap-1">
                  <span>{getPlatformInfo(prompt.platform).emoji}</span>
                  <span>{PLATFORM_LABELS[prompt.platform]}</span>
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                <Clock className="w-3 h-3" />
                {getEstimatedDuration(prompt)}
              </span>
              {prompt.is_free ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold">
                  🎁 Gratuito
                </Badge>
              ) : (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-bold">
                  👑 Premium PRO
                </Badge>
              )}
            </div>

            {/* Gancho em destaque no título com emojis */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gancho Viral (0-3s)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
                {formatHookTitle(prompt).fullDisplay}
              </h1>
            </div>

            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <span>{NICHE_EMOJIS[prompt.niche] || '👗'}</span>
              <span>
                Peça do Catálogo: <strong>{prompt.title}</strong>
              </span>
            </p>

            {prompt.description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {prompt.description}
              </p>
            )}

            <div className="p-3.5 rounded-xl bg-background/80 border text-xs space-y-1">
              <span className="font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider text-[10px] block">
                💡 O que este visual demonstra
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Mostra o estilo de gravação ({STYLE_LABELS[prompt.style] || prompt.style}),
                iluminação e postura ideais para reter o público nos primeiros segundos do TikTok
                Shop e Shopee Vídeo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Destaques: Gancho e Chamada de Ação */}
      {(prompt.hook || prompt.call_to_action) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prompt.hook && (
            <div className="p-4 rounded-xl border bg-pink-500/5 border-pink-500/20 space-y-1.5">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gancho Viral (Hook 0-3s)
              </span>
              <p className="text-sm font-medium italic text-foreground">"{prompt.hook}"</p>
            </div>
          )}

          {prompt.call_to_action && (
            <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20 space-y-1.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Call To Action (Conversão no Carrinho)
              </span>
              <p className="text-sm font-medium italic text-foreground">
                "{prompt.call_to_action}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Caixa do Prompt Completo */}
      <Card className="border shadow-lg relative overflow-hidden">
        <CardHeader className="bg-muted/40 border-b flex flex-row items-center justify-between py-3.5 px-4 sm:px-6">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Roteiro Completo para Gravação
          </CardTitle>

          <Button
            size="sm"
            onClick={handleCopy}
            className={`gap-1.5 font-semibold text-xs ${
              isLocked
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gradient-to-r from-pink-600 to-amber-500 text-white'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Desbloquear no PRO
              </>
            ) : copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Roteiro Completo
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 relative">
          {isLocked ? (
            <div className="space-y-4">
              {/* Blur preview */}
              <div className="filter blur-sm select-none opacity-40 font-mono text-xs sm:text-sm space-y-2 pointer-events-none">
                <p>[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]</p>
                <p>
                  🎬 CENA 1 (0-3s) - O GANCHO VISUAL (HOOK): Câmera em primeira pessoa se
                  arrumando...
                </p>
                <p>
                  🎬 CENA 2 (3-9s) - DETALHES DE TECIDO E COSTURA REFORÇADA: Close na cintura
                  modelada...
                </p>
                <p>
                  🎬 CENA 3 (9-14s) - VERSATILIDADE E PROVA SOCIAL: Borrifando perfume e calçado...
                </p>
                <p>🎬 CENA 4 (14-18s) - CALL TO ACTION: Apontando para o carrinho amarelo...</p>
              </div>

              {/* Overlay de bloqueio */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="font-extrabold text-lg text-foreground">
                    Este roteiro é exclusivo para assinantes PRO
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Assine o plano Mensal ou Anual para desbloquear todos os roteiros da biblioteca
                    e o gerador personalizado para as roupas da sua loja.
                  </p>
                </div>
                <Link to="/planos">
                  <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold">
                    <Crown className="w-4 h-4 mr-2" />
                    Ver Planos e Assinar
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 border rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground select-all">
              {prompt.prompt_text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dicas de Execução para Criadores */}
      <div className="border rounded-2xl p-6 bg-muted/20 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Como executar esse roteiro com sucesso:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Iluminação frontal:</strong> Use luz natural de frente para a janela ou ring
              light na altura dos olhos.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Primeiros 3 segundos:</strong> Não dê "oi galera", comece direto com o gancho
              visual e texto grande.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Música em alta:</strong> Adicione uma música viral com volume em 10% de fundo
              para reter o público.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Vincule o produto:</strong> Adicione o link direto da vitrine/sacola antes de
              publicar.
            </span>
          </li>
        </ul>
      </div>

      {/* Modal: Personalizar com Minhas Fotos */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <ImagePlus className="w-5 h-5 text-pink-500" />
              Personalizar com Minhas Fotos 📸
            </DialogTitle>
            <DialogDescription>
              Suba até 3 fotos da sua peça para que este roteiro seja adaptado com fidelidade às
              cores, corte e detalhes da sua vitrine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Upload de até 3 fotos */}
            <div className="space-y-2 p-3.5 rounded-2xl border-2 border-dashed bg-muted/20 border-pink-500/30">
              <div className="flex items-center justify-between text-xs">
                <Label className="font-bold uppercase tracking-wider text-foreground">
                  Fotos da Sua Peça ({customFiles.length} de 3)
                </Label>
              </div>

              {customPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {customPreviews.map((preview, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border bg-background"
                    >
                      <img
                        src={preview}
                        alt="Foto da peça"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomFile(i)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {customFiles.length < 3 && (
                <div>
                  <label
                    htmlFor="custom-detail-upload"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Anexar Fotos da Minha Peça</span>
                  </label>
                  <input
                    id="custom-detail-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleCustomFileUpload}
                  />
                </div>
              )}
            </div>

            {/* Nome do Produto Customizado */}
            <div className="space-y-1.5">
              <Label htmlFor="custom-detail-prod" className="text-xs font-semibold">
                Nome da Sua Peça / Roupa
              </Label>
              <Input
                id="custom-detail-prod"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="Ex: Vestido Midi Canelado Terracota"
                className="text-sm"
              />
            </div>

            {/* Detalhes Visuais */}
            <div className="space-y-1.5">
              <Label htmlFor="custom-detail-vis" className="text-xs font-semibold">
                Detalhes Observados nas Fotos (Opcional)
              </Label>
              <Textarea
                id="custom-detail-vis"
                value={customVisualDetails}
                onChange={(e) => setCustomVisualDetails(e.target.value)}
                placeholder="Ex: canelado encorpado, decote quadrado, caimento justo sem transparência..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            {/* Botão de Disparo */}
            <Button
              onClick={handleAdaptPrompt}
              disabled={adapting}
              className="w-full py-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-2"
            >
              {adapting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Atualizando Roteiro com Suas Fotos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Atualizar Roteiro com Minhas Fotos 📸</span>
                </>
              )}
            </Button>

            {/* Exibição do Roteiro Adaptado */}
            {adaptedResult && (
              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Roteiro Adaptado com Suas Fotos:
                  </span>
                  <Button
                    size="sm"
                    onClick={handleCopyAdapted}
                    className="text-xs gap-1 font-bold bg-pink-600 text-white"
                  >
                    {copiedAdapted ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copiar Roteiro
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/40 border rounded-xl p-3.5 font-mono text-xs whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed select-all">
                  {adaptedResult}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
