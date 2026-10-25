import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ImagePlus,
  Sparkles,
  Upload,
  X,
  RefreshCw,
  BookmarkCheck,
  Bookmark,
  Check,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react'
import type { PromptRecord, PromptVariation } from '@/types'
import { toast } from '@/hooks/use-toast'
import { PromptInfoCard } from '@/components/PromptInfoCard'
import { PromptSceneList } from '@/components/PromptSceneList'
import {
  adaptPromptWithImages,
  regeneratePromptVariations,
  saveGeneratedPrompt,
} from '@/services/generations'
import { consumeExtraRegenerationCredit } from '@/services/regenerationCredits'

export interface PromptCustomizeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt: PromptRecord | null
  userId?: string
  isPaidPlan?: boolean
  extraCreditsBalance: number
  onCreditsUpdated?: (newBalance: number) => void
  onRequestPayment?: () => void
  category?: 'ecommerce' | 'virais'
  /**
   * Callback quando o prompt é adaptado, para a página pai poder atualizar o estado exibido
   * e não perder as modificações ao fechar a janela!
   */
  onAdaptedApplied?: (adaptedText: string, customProductName: string) => void
  /**
   * Se a página pai já possuía um prompt adaptado para este promptId, repassa para continuar de onde parou
   */
  initialAdaptedPrompt?: string | null
  initialProductName?: string
  initialCharacterName?: string
}

export const PromptCustomizeModal: React.FC<PromptCustomizeModalProps> = ({
  open,
  onOpenChange,
  prompt,
  userId,
  isPaidPlan = false,
  extraCreditsBalance,
  onCreditsUpdated,
  onRequestPayment,
  category = 'ecommerce',
  onAdaptedApplied,
  initialAdaptedPrompt = null,
  initialProductName = '',
  initialCharacterName = '',
}) => {
  const isViral = category === 'virais' || prompt?.category === 'virais'

  // Estados locais do modal
  const [customFiles, setCustomFiles] = useState<File[]>([])
  const [customPreviews, setCustomPreviews] = useState<string[]>([])
  const [productName, setProductName] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [visualDetails, setVisualDetails] = useState('')
  const [adapting, setAdapting] = useState(false)
  const [adaptedResult, setAdaptedResult] = useState<string | null>(null)

  // Variações de regeneração
  const [variations, setVariations] = useState<PromptVariation[]>([])
  const [selectedVarId, setSelectedVarId] = useState<string | null>(null)
  const [copiedVarId, setCopiedVarId] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const [hasFreeRegenerated, setHasFreeRegenerated] = useState(false)

  // Salvar no histórico
  const [savingToHistory, setSavingToHistory] = useState(false)
  const [savedToHistory, setSavedToHistory] = useState(false)

  // Inicializa quando o modal abre ou troca de prompt
  useEffect(() => {
    if (open && prompt) {
      if (initialAdaptedPrompt) {
        setAdaptedResult(initialAdaptedPrompt)
      }
      setProductName(initialProductName || prompt.title)
      setCharacterName(initialCharacterName || '')
      setVisualDetails('')
      setSavedToHistory(false)
    }
  }, [open, prompt?.id])

  // Limpa URLs de preview
  useEffect(() => {
    return () => {
      customPreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      })
    }
  }, [customPreviews])

  if (!prompt) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const incoming = Array.from(files)
    const availableSlots = 3 - customFiles.length
    if (availableSlots <= 0) {
      toast({
        title: 'Limite atingido',
        description: 'Você pode subir no máximo 3 fotos de referência.',
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

  const handleRemoveFile = (index: number) => {
    const url = customPreviews[index]
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    setCustomFiles((prev) => prev.filter((_, i) => i !== index))
    setCustomPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAdaptPrompt = async () => {
    setAdapting(true)
    try {
      const targetProd = isViral
        ? characterName.trim() || productName.trim() || prompt.title
        : productName.trim() || prompt.title

      const res = await adaptPromptWithImages({
        originalPrompt: prompt.prompt_text,
        promptTitle: prompt.title,
        productName: targetProd,
        characterName: isViral ? characterName.trim() || undefined : undefined,
        visualDetails: visualDetails.trim() || undefined,
        niche: prompt.niche,
        style: prompt.style,
        platform: prompt.platform,
        referenceImages: customFiles,
        imagesCount: customFiles.length,
        category: isViral ? 'virais' : 'ecommerce',
        iterationSeed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.adapted_prompt) {
        setAdaptedResult(res.adapted_prompt)
        setSavedToHistory(false)

        // Comunica à página pai para já refletir o roteiro adaptado na sessão atual
        if (onAdaptedApplied) {
          onAdaptedApplied(res.adapted_prompt, targetProd)
        }

        toast({
          title: 'Prompt atualizado com suas fotos! 📸✨',
          description:
            'Roteiro adaptado com sucesso. As cenas separadas estão prontas abaixo para você copiar uma a uma.',
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

  const handleSaveToHistory = async () => {
    if (!userId) {
      toast({
        title: 'Faça login para salvar',
        description: 'Você precisa estar logado para salvar em seu histórico.',
        variant: 'destructive',
      })
      return
    }

    const textToSave = adaptedResult || prompt.prompt_text
    const prodName = isViral
      ? characterName.trim() || productName.trim() || prompt.title
      : productName.trim() || prompt.title

    setSavingToHistory(true)
    try {
      await saveGeneratedPrompt({
        userId,
        productName: prodName,
        niche: prompt.niche,
        style: prompt.style,
        platform: prompt.platform,
        targetAudience: isViral
          ? 'Criadores de Conteúdo para TikTok, Shorts e Reels'
          : 'Compradores de e-commerce e vitrines físicas',
        details: textToSave,
        visualDetails: visualDetails.trim() || undefined,
        referenceImages: customFiles.length > 0 ? customFiles : undefined,
      })

      setSavedToHistory(true)
      toast({
        title: 'Salvo no Histórico com Sucesso! 💾✨',
        description: 'Seu roteiro adaptado foi gravado na sua conta e não será perdido.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar no histórico',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setSavingToHistory(false)
    }
  }

  const handleRegenerate = async () => {
    if (extraCreditsBalance <= 0 && hasFreeRegenerated && onRequestPayment) {
      onRequestPayment()
      return
    }

    setRegenerating(true)
    try {
      const targetProd = isViral
        ? characterName.trim() || productName.trim() || prompt.title
        : productName.trim() || prompt.title

      const res = await regeneratePromptVariations({
        basePrompt: adaptedResult || prompt.prompt_text,
        promptTitle: targetProd,
        productName: targetProd,
        characterName: isViral ? characterName.trim() || undefined : undefined,
        visualDetails: visualDetails.trim() || undefined,
        niche: prompt.niche,
        imagesCount: customFiles.length,
        category: isViral ? 'virais' : 'ecommerce',
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.variations?.length) {
        setVariations(res.variations)
        setSelectedVarId(res.variations[0].id)

        if (hasFreeRegenerated && extraCreditsBalance > 0 && userId) {
          await consumeExtraRegenerationCredit(userId)
          if (onCreditsUpdated) {
            onCreditsUpdated(Math.max(0, extraCreditsBalance - 1))
          }
          toast({
            title: '3 Novas Variações Regeneradas! ⚡',
            description: '1 crédito extra foi utilizado com sucesso.',
          })
        } else {
          setHasFreeRegenerated(true)
          toast({
            title: '3 Novas Variações Geradas! 🎨✨',
            description: isViral
              ? '3 novas narrativas de ~60s criadas.'
              : '3 abordagens (Emocional, Urgência e Prova Social) geradas.',
          })
        }
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao regenerar variações',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setRegenerating(false)
    }
  }

  const handleCopyVariation = (vId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedVarId(vId)
    toast({
      title: 'Variação copiada! 📋✨',
      description: 'Roteiro copiado para a área de transferência.',
    })
    setTimeout(() => setCopiedVarId(null), 2500)
  }

  const activeProductOrCharacter = isViral
    ? characterName.trim() || productName.trim() || prompt.title
    : productName.trim() || prompt.title

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ImagePlus className="w-5 h-5 text-pink-500" />
            Personalizar com Minhas Fotos 📸
          </DialogTitle>
          <DialogDescription>
            {isViral
              ? 'Suba imagens de referência e/ou informe o novo personagem para que o roteiro viral seja adaptado fielmente à sua cena.'
              : 'Suba até 3 fotos da sua peça real para adaptar o roteiro com precisão às cores, caimento e detalhes físicos.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* BLOCO DESTACADO DE INFORMAÇÕES (ITEM 3 DO PEDIDO) */}
          <PromptInfoCard
            prompt={prompt}
            title={prompt.title}
            niche={prompt.niche}
            style={prompt.style}
            platform={prompt.platform}
            category={isViral ? 'virais' : 'ecommerce'}
            customProductOrCharacter={adaptedResult ? activeProductOrCharacter : undefined}
            isAdapted={Boolean(adaptedResult)}
            photosCount={customFiles.length}
          />

          {/* Upload de até 3 fotos */}
          <div className="space-y-2 p-3.5 rounded-2xl border-2 border-dashed bg-muted/20 border-pink-500/30">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-bold uppercase tracking-wider text-foreground">
                {isViral ? 'Fotos de Referência' : 'Fotos da Sua Peça'} ({customFiles.length} de 3)
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {customFiles.length === 3 ? 'Limite atingido (3/3)' : 'Opcional, até 3 fotos'}
              </span>
            </div>

            {customPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {customPreviews.map((preview, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border bg-background group"
                  >
                    <img
                      src={preview}
                      alt="Foto de referência"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      title="Remover foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white font-medium">
                      Foto {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {customFiles.length < 3 && (
              <div>
                <label
                  htmlFor="custom-modal-upload"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isViral
                      ? 'Anexar Imagens / Referências da Cena'
                      : 'Anexar Fotos da Minha Peça'}
                  </span>
                </label>
                <input
                  id="custom-modal-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          {/* Se for vídeo viral, campo para trocar personagem central */}
          {isViral && (
            <div className="space-y-1.5 p-3 rounded-xl border border-pink-500/30 bg-pink-500/5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="custom-char-name"
                  className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Trocar Personagem / Elemento Central
                </Label>
                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full">
                  Substituição Total
                </span>
              </div>
              <Input
                id="custom-char-name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Ex: Pinguim falante, Gato detetive, Espelho mágico..."
                className="text-sm bg-background border-pink-500/30 focus-visible:ring-pink-500"
              />
              <p className="text-[11px] text-muted-foreground leading-tight">
                Muda o personagem anterior pelo informado aqui, reformulando as 6 cenas de ~60s
                integralmente para o novo protagonista.
              </p>
            </div>
          )}

          {/* Nome do Produto / Tema da Cena */}
          <div className="space-y-1.5 p-3 rounded-xl border border-pink-500/20 bg-pink-500/5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="custom-product-name"
                className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isViral ? 'Tema ou Contexto da Cena' : 'Nome do Seu Produto / Peça Real'}
              </Label>
              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full">
                Substitui o original
              </span>
            </div>
            <Input
              id="custom-product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={
                isViral
                  ? 'Ex: Aventuras cômicas na cozinha, mistério na floresta...'
                  : 'Ex: Espelho de maquiagem LED, Vestido Midi Canelado...'
              }
              className="text-sm bg-background border-pink-500/30 focus-visible:ring-pink-500"
            />
            <p className="text-[11px] text-muted-foreground leading-tight">
              {isViral
                ? 'Contexto ou título da historinha para calibrar os diálogos e ações.'
                : 'O produto informado aqui substitui integralmente o do prompt original (ex: de capinha de celular para espelho de LED).'}
            </p>
          </div>

          {/* Detalhes Visuais Observados */}
          <div className="space-y-1.5">
            <Label htmlFor="custom-vis-details" className="text-xs font-semibold">
              Detalhes Visuais Observados (Opcional)
            </Label>
            <Textarea
              id="custom-vis-details"
              value={visualDetails}
              onChange={(e) => setVisualDetails(e.target.value)}
              placeholder={
                isViral
                  ? 'Ex: Iluminação cinematográfica, olhos expressivos, tom dramático...'
                  : 'Ex: caimento rodado, tecido canelado grosso, textura fosca, cor vibrante...'
              }
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          {/* Botões de Ação Principais: Regenerar e Atualizar com Fotos */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button
              type="button"
              onClick={handleRegenerate}
              disabled={regenerating || adapting}
              variant="outline"
              className="flex-1 py-5 border-pink-500/40 text-pink-600 dark:text-pink-400 font-bold hover:bg-pink-500/10 gap-2 text-xs shadow-xs"
            >
              {regenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  <span>Regenerando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
                  <span>Regenerar Prompt ({extraCreditsBalance} disponíveis)</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleAdaptPrompt}
              disabled={adapting || regenerating}
              className="flex-1 py-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold gap-2 text-xs"
            >
              {adapting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Atualizando Roteiro...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Atualizar com Fotos 📸</span>
                </>
              )}
            </Button>
          </div>

          {/* RESULTADO ADAPTADO: CENA POR CENA COM "Copiar esta cena" (ITEM 1 DO PEDIDO) */}
          {adaptedResult && (
            <div className="space-y-4 pt-3 border-t">
              {/* Barra de Ações: Salvar no Histórico para não perder (ITEM 2 DO PEDIDO) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    Roteiro Adaptado Gerado com Sucesso!
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Ao fechar a janela, o roteiro permanece salvo na tela atual. Você também pode
                    gravar no seu histórico:
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={handleSaveToHistory}
                  disabled={savingToHistory || savedToHistory || !userId}
                  variant={savedToHistory ? 'outline' : 'default'}
                  className={`text-xs gap-1.5 font-bold shrink-0 ${
                    savedToHistory
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  {savedToHistory ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Salvo no Histórico!</span>
                    </>
                  ) : savingToHistory ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Salvar no Histórico 💾</span>
                    </>
                  )}
                </Button>
              </div>

              {/* LISTA DE CENAS SEPARADAS (NÃO COPIAR ROTEIRO INTEIRO, FOCO CENA POR CENA) */}
              <PromptSceneList
                promptText={adaptedResult}
                promptTitle={activeProductOrCharacter}
                inModal={true}
              />

              {/* Botão Concluir & Manter na Página */}
              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => {
                    if (onAdaptedApplied) {
                      onAdaptedApplied(adaptedResult, activeProductOrCharacter)
                    }
                    onOpenChange(false)
                    toast({
                      title: 'Roteiro adaptado ativo! 🎬✨',
                      description: 'O texto modificado está pronto para uso na sua página.',
                    })
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs gap-1.5"
                >
                  <span>Concluir e usar este roteiro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Variações se houver */}
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

                  <div className="grid grid-cols-3 gap-1.5">
                    {variations.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVarId(v.id)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all ${
                          selectedVarId === v.id
                            ? 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                            : 'border-border bg-card hover:bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        <span className="block truncate text-[11px]">{v.badge}</span>
                      </button>
                    ))}
                  </div>

                  {selectedVarId &&
                    (() => {
                      const curVar = variations.find((v) => v.id === selectedVarId)
                      if (!curVar) return null
                      const isCopied = copiedVarId === curVar.id
                      return (
                        <div className="p-3 rounded-2xl border bg-muted/20 space-y-2 animate-in fade-in-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-foreground">
                                {curVar.angle}
                              </span>
                              <p className="text-[11px] text-muted-foreground">
                                {curVar.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCopyVariation(curVar.id, curVar.prompt_text)}
                              className="h-7 text-xs gap-1 font-bold bg-pink-600 text-white hover:bg-pink-700"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  <span>Copiar Variação</span>
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Mostra também em formato de cenas */}
                          <PromptSceneList
                            promptText={curVar.prompt_text}
                            promptTitle={curVar.angle}
                            inModal={true}
                          />
                        </div>
                      )
                    })()}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default PromptCustomizeModal
