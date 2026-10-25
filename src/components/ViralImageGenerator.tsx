import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  generateViralImage,
  getImageEngines,
  type GenerateImageResponse,
} from '@/services/imageGeneration'
import { generateViralSceneWithImages, type GenerateViralSceneResult } from '@/services/generations'
import { PromptSceneList } from '@/components/PromptSceneList'
import { AuthGateModal } from '@/components/AuthGateModal'
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
  Sparkles,
  Upload,
  X,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Film,
  Lock,
  Download,
  Crown,
  Cpu,
  Info,
  Wand2,
  ExternalLink,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { NicheType, ImageEngineType, ImageEngineMeta } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, VIRAL_NICHE_KEYS } from '@/types'

export const ViralImageGenerator: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  // Formulário
  const [ideaText, setIdeaText] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [niche, setNiche] = useState<NicheType>('historinhas_frutas')
  const [selectedEngine, setSelectedEngine] = useState<ImageEngineType>('nano_banana')
  const [engines, setEngines] = useState<ImageEngineMeta[]>([])

  // Fotos de referência opcionais (até 3)
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [referencePreviews, setReferencePreviews] = useState<string[]>([])

  // Estados de geração de imagem
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<GenerateImageResponse | null>(null)

  // Estados de geração de roteiro a partir da imagem gerada
  const [generatingScript, setGeneratingScript] = useState(false)
  const [scriptResult, setScriptResult] = useState<GenerateViralSceneResult | null>(null)
  const [copiedConcept, setCopiedConcept] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  // Auth gate
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState('')

  // Carregar motores disponíveis no backend
  useEffect(() => {
    getImageEngines().then((res) => {
      setEngines(res)
    })
  }, [])

  // Limpar ObjectURLs
  useEffect(() => {
    return () => {
      referencePreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      })
    }
  }, [referencePreviews])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (!user) {
      setAuthGateAction('Subir foto de referência para o Gerador de Imagens PRO')
      setAuthGateOpen(true)
      e.target.value = ''
      return
    }

    if (!isPaidPlan) {
      toast({
        title: '👑 Recurso Exclusivo do Plano PRO',
        description: 'Faça upgrade para o plano Mensal ou Anual para gerar imagens com IA.',
        variant: 'destructive',
      })
      navigate('/planos')
      e.target.value = ''
      return
    }

    const incoming = Array.from(files)
    const availableSlots = 3 - referenceFiles.length

    if (availableSlots <= 0) {
      toast({
        title: 'Limite de fotos atingido',
        description: 'Você pode subir até 3 imagens de referência para fidelidade total.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    const accepted = incoming.slice(0, availableSlots)
    const newUrls = accepted.map((file) => URL.createObjectURL(file))
    setReferenceFiles((prev) => [...prev, ...accepted])
    setReferencePreviews((prev) => [...prev, ...newUrls])
    toast({
      title: `${accepted.length} foto(s) de referência carregada(s)! 📸✨`,
      description: 'A IA vai preservar rosto, tons de pele, cores e traços originais.',
    })
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    const url = referencePreviews[index]
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    setReferenceFiles((prev) => prev.filter((_, i) => i !== index))
    setReferencePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // 1. Gerar Imagem a partir da Ideia do Usuário
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setAuthGateAction('Gerar imagens com IA para Vídeos Virais')
      setAuthGateOpen(true)
      return
    }

    if (!isPaidPlan) {
      toast({
        title: '👑 Recurso Exclusivo do Plano PRO',
        description:
          'O Gerador de Imagens com Nano Banana e ChatGPT é exclusivo para assinantes PRO. Assine por apenas R$ 49,90/mês!',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    if (!ideaText.trim() && referenceFiles.length === 0) {
      toast({
        title: 'Descreva a sua ideia de imagem',
        description: 'Digite o que você pensou para a cena ou suba uma foto de referência.',
        variant: 'destructive',
      })
      return
    }

    setGeneratingImage(true)
    setScriptResult(null)

    try {
      const fullPrompt = characterName.trim()
        ? `Personagem: ${characterName.trim()}. ${ideaText.trim()}`
        : ideaText.trim()

      const res = await generateViralImage({
        userId: user.id,
        prompt: fullPrompt,
        engine: selectedEngine,
        referenceFiles,
        niche,
        saveToHistory: true,
      })

      if (res.success && res.image_url) {
        setGeneratedImage(res)
        toast({
          title: '🎨 Imagem Gerada com Sucesso!',
          description:
            res.notice ||
            'Imagem criada com fidelidade à sua ideia. Agora crie o roteiro com 1 clique!',
        })
      } else {
        if (res.code === 'PRO_REQUIRED') {
          toast({
            title: '👑 Plano PRO Necessário',
            description: res.error,
            variant: 'destructive',
          })
          navigate('/planos')
        } else {
          throw new Error(res.error || 'Erro ao gerar imagem.')
        }
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar imagem',
        description: err.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setGeneratingImage(false)
    }
  }

  // 2. Fluxo 1-Clique: Criar Roteiro Viral a partir da Ideia e Imagem Gerada
  const handleGenerateScriptFromImage = async () => {
    if (!user) {
      setAuthGateAction('Criar roteiro viral a partir da imagem')
      setAuthGateOpen(true)
      return
    }

    if (!isPaidPlan) {
      toast({
        title: '👑 Recurso Exclusivo do Plano PRO',
        description: 'Faça upgrade para o plano Mensal ou Anual para criar roteiros virais.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    setGeneratingScript(true)

    try {
      const theme = ideaText.trim() || characterName.trim() || 'Cena Viral Criada com IA'
      const char = characterName.trim() || undefined

      // Se houver imagem gerada, prepara detalhes visuais enriquecidos
      const visualNotes = `Cena baseada na imagem gerada via IA (${selectedEngine === 'chatgpt' ? 'ChatGPT OpenAI' : 'Nano Banana Gemini'}). Enquadramento vertical 9:16 fotorrealista de altíssima definição.`

      // Se temos arquivos de referência, enviamos; se a imagem gerada for dataUri/blob, enviamos como arquivo
      let filesToSend = [...referenceFiles]
      if (filesToSend.length === 0 && generatedImage?.image_url?.startsWith('data:')) {
        try {
          const arr = generatedImage.image_url.split(',')
          const mimeMatch = arr[0].match(/:(.*?);/)
          const mime = mimeMatch ? mimeMatch[1] : 'image/png'
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          const blobFile = new File([u8arr], 'imagem-gerada-viral.png', { type: mime })
          filesToSend = [blobFile]
        } catch (e) {
          console.warn('Falha ao converter data URL em File:', e)
        }
      }

      const res = await generateViralSceneWithImages({
        userId: user.id,
        themeName: theme,
        characterName: char,
        niche,
        visualDetails: visualNotes,
        referenceImages: filesToSend,
        imagesCount: filesToSend.length,
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success) {
        setScriptResult(res)
        toast({
          title: '🎬 Roteiro Viral Criado com 1 Clique!',
          description:
            'Ideia de Cena e Roteiro de ~60s dividido em 6 cenas de 10s pronto para gravação!',
        })
      } else {
        throw new Error(res.error || 'Erro ao gerar roteiro da cena.')
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao criar roteiro viral',
        description: err.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setGeneratingScript(false)
    }
  }

  // Download da imagem gerada
  const handleDownloadImage = () => {
    if (!generatedImage?.image_url) return
    const link = document.createElement('a')
    link.href = generatedImage.image_url
    link.download = `imagem-viral-${selectedEngine}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: 'Download iniciado! 📥',
      description: 'Sua imagem está sendo baixada em alta resolução.',
    })
  }

  const handleCopyConcept = () => {
    if (!scriptResult?.scene_concept) return
    navigator.clipboard.writeText(scriptResult.scene_concept)
    setCopiedConcept(true)
    setTimeout(() => setCopiedConcept(false), 2500)
    toast({
      title: 'Ideia de Cena copiada! 💡',
      description: 'Texto copiado para a área de transferência.',
    })
  }

  const handleCopyAll = () => {
    if (!scriptResult) return
    const fullText = `${scriptResult.scene_concept}\n\n${scriptResult.optional_script}`
    navigator.clipboard.writeText(fullText)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
    toast({
      title: 'Roteiro completo copiado! 📋',
      description: 'Ideia de cena e as 6 cenas copiadas com sucesso.',
    })
  }

  return (
    <div className="space-y-6 rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 p-5 sm:p-8 shadow-md">
      {/* Topo do Bloco com Badge PRO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Crown className="w-3.5 h-3.5" />
              EXCLUSIVO PLANO PRO
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              Web & Mobile
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Gerador de Imagens com IA</span>
            <span className="text-2xl">🎨✨</span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Tenha uma ideia na hora, peça uma imagem fotorrealista a partir dela com fidelidade
            total (ou suba fotos de referência) e, no mesmo fluxo com <strong>1 clique</strong>,
            gere o <strong>roteiro viral de ~60s</strong> pronto para copiar cena por cena (10s
            cada).
          </p>
        </div>

        {/* Status do Plano */}
        <div className="shrink-0 flex items-center gap-2">
          {!user ? (
            <Button
              type="button"
              onClick={() => {
                setAuthGateAction('Acessar o Gerador de Imagens PRO')
                setAuthGateOpen(true)
              }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs rounded-2xl shadow-sm gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Entre para Desbloquear</span>
            </Button>
          ) : !isPaidPlan ? (
            <Link to="/planos">
              <Button
                type="button"
                className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs rounded-2xl shadow-sm gap-1.5 hover:scale-[1.02] transition-transform"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Assinar Plano PRO (R$ 49,90)</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Plano PRO Ativo</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid Principal: Formulário + Preview e Roteiro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Formulário de Imagem */}
        <Card className="lg:col-span-5 border bg-card/95 shadow-sm rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-pink-500" />
              1. Descreva sua ideia ou envie referência
            </CardTitle>
            <CardDescription className="text-xs">
              Escreva o que pensou na hora para a imagem da sua cena viral.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleGenerateImage} className="space-y-4">
              {/* Campo de Texto para a Ideia */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="viral-img-idea" className="text-xs font-bold text-foreground">
                    Sua Ideia de Cena / Imagem *
                  </Label>
                  <span className="text-[10px] text-pink-600 font-semibold">Ideia na hora 💡</span>
                </div>
                <Textarea
                  id="viral-img-idea"
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Ex: Abacate musculoso treinando na academia com expressão engraçada, luz neon dramática, iluminação de estúdio profissional..."
                  rows={3}
                  className="rounded-2xl text-xs sm:text-sm resize-none focus-visible:ring-pink-500 border-pink-500/30"
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  A IA gerará uma imagem com fidelidade máxima ao que você descrever.
                </p>
              </div>

              {/* Seletor de Motor de Geração (Nano Banana / ChatGPT) */}
              <div className="space-y-1.5 p-3 rounded-2xl border bg-muted/30">
                <Label
                  htmlFor="image-engine-select"
                  className="text-xs font-bold flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-pink-500" />
                  Motor de Geração de Imagem
                </Label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Motor 1: Nano Banana (Gemini) */}
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('nano_banana')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedEngine === 'nano_banana'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500 shadow-xs'
                        : 'border-border bg-background hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold flex items-center gap-1">
                        🍌 Nano Banana
                      </span>
                      <span className="text-[9px] bg-pink-500/15 text-pink-600 px-1.5 py-0.5 rounded-full font-bold">
                        Gemini
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Fidelidade facial e fotos de referência.
                    </p>
                  </button>

                  {/* Motor 2: ChatGPT (OpenAI) */}
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('chatgpt')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedEngine === 'chatgpt'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500 shadow-xs'
                        : 'border-border bg-background hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold flex items-center gap-1">
                        🤖 ChatGPT
                      </span>
                      <span className="text-[9px] bg-purple-500/15 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">
                        OpenAI
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Estética cinematográfica e iluminação.
                    </p>
                  </button>
                </div>
              </div>

              {/* Upload Opcional de Imagens de Referência (até 3) */}
              <div className="space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-pink-500/30 bg-pink-500/5">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-pink-500" />
                    Fotos de Referência (Opcional - até 3)
                  </span>
                  {referenceFiles.length > 0 && (
                    <span className="text-[11px] text-pink-600 font-semibold">
                      {referenceFiles.length} de 3
                    </span>
                  )}
                </div>

                {referencePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {referencePreviews.map((preview, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border bg-background group"
                      >
                        <img
                          src={preview}
                          alt="Referência"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/75 text-white hover:bg-black transition-colors"
                          title="Remover"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {referenceFiles.length < 3 && (
                  <div>
                    <label
                      htmlFor="viral-image-ref-input"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-pink-500/40 bg-background hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {referenceFiles.length === 0
                          ? 'Subir foto de referência (preserva rosto/cores)'
                          : 'Adicionar mais foto (máx 3)'}
                      </span>
                    </label>
                    <input
                      id="viral-image-ref-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Suba fotos reais ou artes anteriores para fidelidade absoluta a rostos e traços.
                </p>
              </div>

              {/* Nicho Viral */}
              <div className="space-y-1.5">
                <Label htmlFor="viral-img-niche" className="text-xs font-semibold">
                  Nicho de Vídeo Viral
                </Label>
                <Select value={niche} onValueChange={(val) => setNiche(val as NicheType)}>
                  <SelectTrigger id="viral-img-niche" className="rounded-xl text-xs h-10">
                    <SelectValue placeholder="Selecione o nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIRAL_NICHE_KEYS.map((k) => (
                      <SelectItem key={k} value={k} className="text-xs">
                        <span className="mr-1.5">{NICHE_EMOJIS[k]}</span>
                        <span>{NICHE_LABELS[k]}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Personagem (Opcional) */}
              <div className="space-y-1.5">
                <Label htmlFor="viral-img-character" className="text-xs font-semibold">
                  Personagem Principal (Opcional)
                </Label>
                <Input
                  id="viral-img-character"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Ex: Pinguim falante, Morango gigante, Detetive..."
                  className="rounded-xl text-xs h-10"
                />
              </div>

              {/* Botão de Disparo para Gerar Imagem */}
              <Button
                type="submit"
                disabled={generatingImage}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 gap-2"
              >
                {generatingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      Gerando Imagem com {selectedEngine === 'chatgpt' ? 'ChatGPT' : 'Nano Banana'}
                      ...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Imagem a partir da Minha Ideia 🎨</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coluna Direita: Preview da Imagem + Fluxo 1-Clique para Roteiro */}
        <div className="lg:col-span-7 space-y-6">
          {/* Se nenhuma imagem gerada ainda */}
          {!generatedImage && !generatingImage && (
            <Card className="border-2 border-dashed bg-muted/15 rounded-3xl p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto text-2xl">
                🖼️
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-foreground">
                  Sua imagem gerada aparecerá aqui
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Digite a sua ideia ao lado e clique em <strong>Gerar Imagem</strong>. Você poderá
                  baixar a imagem e, no mesmo fluxo com <strong>1 clique</strong>, criar o roteiro
                  completo de ~60s com cenas de 10s para copiar separadamente.
                </p>
              </div>
            </Card>
          )}

          {/* Estado de Carregamento da Imagem */}
          {generatingImage && (
            <Card className="border bg-card rounded-3xl p-10 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-foreground">
                  Transformando sua ideia em imagem...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Processando com alta fidelidade visual via motor{' '}
                  {selectedEngine === 'chatgpt' ? 'ChatGPT (OpenAI)' : 'Nano Banana (Gemini)'}.
                </p>
              </div>
            </Card>
          )}

          {/* Resultado: Imagem Gerada + Botão de Roteiro */}
          {generatedImage && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Card da Imagem Gerada */}
              <Card className="border-2 border-pink-500/40 bg-card rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="bg-pink-500/10 border-b border-pink-500/20 py-3.5 px-5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-pink-600 text-white font-bold text-[10px]">
                      {generatedImage.engine === 'chatgpt'
                        ? 'ChatGPT (OpenAI)'
                        : 'Nano Banana (Gemini)'}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">
                      Imagem Gerada da sua Ideia
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadImage}
                    className="h-8 text-xs font-bold border-pink-500/30 text-pink-600 hover:bg-pink-500/10 gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Imagem</span>
                  </Button>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="relative mx-auto max-w-sm aspect-[9/16] rounded-2xl overflow-hidden border shadow-lg bg-black/90">
                    <img
                      src={generatedImage.image_url}
                      alt={generatedImage.prompt || 'Imagem gerada com IA'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {generatedImage.notice && (
                    <p className="text-[11px] text-center text-muted-foreground">
                      💡 {generatedImage.notice}
                    </p>
                  )}

                  {/* FLUXO 1-CLIQUE: CRIAR ROTEIRO VIRAL A PARTIR DESTA IMAGEM */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          Próximo Passo: Criar Roteiro com 1 Clique
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Gera a <strong>Ideia de Cena</strong> + <strong>Roteiro de ~60s</strong>{' '}
                          em 6 cenas de 10s baseadas nesta imagem.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleGenerateScriptFromImage}
                      disabled={generatingScript}
                      className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 gap-2"
                    >
                      {generatingScript ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Criando Roteiro a partir da Imagem...</span>
                        </>
                      ) : (
                        <>
                          <Film className="w-4 h-4" />
                          <span>Criar Roteiro Viral a partir desta Imagem 🎬</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ROTEIRO GERADO A PARTIR DA IMAGEM */}
              {scriptResult && (
                <div className="space-y-5 animate-in fade-in-50 duration-300">
                  {/* 1. IDEIA DE CENA */}
                  <Card className="border-2 border-purple-500/30 bg-purple-500/5 rounded-3xl overflow-hidden shadow-xs">
                    <CardHeader className="bg-purple-500/10 border-b border-purple-500/20 py-3.5 px-5 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-extrabold text-foreground">
                            1. Ideia de Cena Viral (Conceito Curto)
                          </CardTitle>
                          <span className="text-[10px] text-muted-foreground">
                            Conceito focado na sua ideia e na imagem criada
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyConcept}
                        className="h-8 text-xs font-bold border-purple-500/30 text-purple-700 dark:text-purple-300 gap-1.5"
                      >
                        {copiedConcept ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-purple-600" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Ideia
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="p-5">
                      <p className="text-xs sm:text-sm text-foreground/95 leading-relaxed font-medium whitespace-pre-wrap">
                        {scriptResult.scene_concept}
                      </p>
                    </CardContent>
                  </Card>

                  {/* 2. ROTEIRO VIRAL ~60s EM 6 CENAS DE 10S - PROMPT SCENE LIST */}
                  <Card className="border rounded-3xl overflow-hidden shadow-sm bg-card">
                    <CardHeader className="bg-muted/30 border-b py-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-extrabold text-foreground flex items-center gap-2">
                            <span>2. Roteiro Viral Sugerido (~60s)</span>
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                              6 Cenas de 10s
                            </Badge>
                          </CardTitle>
                          <span className="text-[10px] text-muted-foreground">
                            Copie cada cena separadamente para renderizar nas IAs de vídeo (Kling,
                            Hailuo, Luma)
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyAll}
                        className="text-xs font-bold text-pink-600 hover:text-pink-700 h-8 gap-1 self-end sm:self-auto"
                      >
                        {copiedAll ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copiar Ideia + Roteiro
                      </Button>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 space-y-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>
                          <strong>Cópia Cena por Cena (Até 10s cada):</strong> As ferramentas de
                          vídeo com IA funcionam melhor renderizando até 10 segundos por vez. Use os
                          botões <strong>"Copiar esta cena"</strong> abaixo para máxima fidelidade.
                        </span>
                      </div>

                      {/* Componente padrão do projeto para cópia cena a cena */}
                      <PromptSceneList
                        promptText={scriptResult.optional_script}
                        promptTitle={
                          scriptResult.character_name || scriptResult.theme_name || 'Roteiro Viral'
                        }
                        inModal={false}
                      />
                    </CardContent>

                    <CardFooter className="bg-muted/20 border-t py-3 px-5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Vídeo 100% limpo sem texto gravado • Narração em áudio PT-BR • Salvo no
                        Histórico
                      </span>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auth Gate Modal para Visitantes deslogados */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre para Desbloquear o Gerador de Imagens PRO"
        description="O Gerador de Imagens com Nano Banana e ChatGPT é um recurso exclusivo do Plano PRO. Entre na sua conta ou assine para gerar imagens e roteiros virais sem limites!"
      />
    </div>
  )
}

export default ViralImageGenerator
