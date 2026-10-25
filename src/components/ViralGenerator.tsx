import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  generateViralSceneWithImages,
  regeneratePromptVariations,
  type PromptVariation,
  type GenerateViralSceneResult,
} from '@/services/generations'
import {
  getUserRegenerationCredits,
  consumeExtraRegenerationCredit,
  VIRAL_REGENERATION_LIMIT,
  getViralRegenerationsUsed,
  recordViralRegenerationUsed,
} from '@/services/regenerationCredits'
import { RegenerationPaymentModal } from '@/components/RegenerationPaymentModal'
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
  Layers,
  ArrowRight,
  ShieldCheck,
  Film,
  Flame,
  Lock,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { NicheType } from '@/types'
import { NICHE_LABELS, NICHE_EMOJIS, VIRAL_NICHE_KEYS } from '@/types'

export const ViralGenerator: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  // Form State
  const [themeName, setThemeName] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [niche, setNiche] = useState<NicheType>('historinhas_frutas')
  const [visualDetails, setVisualDetails] = useState('')

  // Upload de fotos (até 3 imagens da imagem criada)
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [referencePreviews, setReferencePreviews] = useState<string[]>([])

  // Resultados da Geração Viral
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GenerateViralSceneResult | null>(null)
  const [copiedConcept, setCopiedConcept] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  // Auth Gate para deslogados
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [authGateAction, setAuthGateAction] = useState('')

  // Regeneração com limite de 2 vezes
  const [variations, setVariations] = useState<PromptVariation[]>([])
  const [selectedVarId, setSelectedVarId] = useState<string | null>(null)
  const [copiedVarId, setCopiedVarId] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const [extraCreditsBalance, setExtraCreditsBalance] = useState<number>(0)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const viralStorageKey = 'generator_viral_main'
  const usedViralCount = user ? getViralRegenerationsUsed(user.id, viralStorageKey) : 0
  const freeRegenerationsRemaining = Math.max(0, VIRAL_REGENERATION_LIMIT - usedViralCount)

  useEffect(() => {
    if (user) {
      getUserRegenerationCredits(user.id).then((c) => {
        if (c) setExtraCreditsBalance(c.extra_prompts_balance || 0)
      })
    }
  }, [user])

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
      setAuthGateAction('Subir suas imagens criadas para o gerador de vídeos virais')
      setAuthGateOpen(true)
      e.target.value = ''
      return
    }

    const incoming = Array.from(files)
    const availableSlots = 3 - referenceFiles.length

    if (availableSlots <= 0) {
      toast({
        title: 'Limite atingido',
        description: 'Você pode subir no máximo 3 imagens criadas de referência.',
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
      title: `${accepted.length} imagem(ns) carregada(s)! 📸✨`,
      description:
        'A IA vai analisar a imagem para criar a ideia de cena e o roteiro opcional de 60s.',
    })
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    const url = referencePreviews[index]
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    setReferenceFiles((prev) => prev.filter((_, i) => i !== index))
    setReferencePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setAuthGateAction('Gerar ideia de cena e roteiro opcional para vídeos virais')
      setAuthGateOpen(true)
      return
    }

    if (referenceFiles.length === 0 && !themeName.trim() && !characterName.trim()) {
      toast({
        title: 'Suba sua imagem ou digite o tema/personagem',
        description: 'Suba até 3 imagens já criadas ou defina o personagem da cena.',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)
    try {
      const generatedTheme =
        characterName.trim() || themeName.trim() || 'Personagem da Imagem Criada'
      const genRes = await generateViralSceneWithImages({
        userId: user.id,
        themeName: generatedTheme,
        characterName: characterName.trim() || undefined,
        niche,
        visualDetails: visualDetails.trim() || undefined,
        referenceImages: referenceFiles,
        imagesCount: referenceFiles.length,
        seed: Math.floor(Math.random() * 1000000),
      })

      if (genRes.success) {
        setResult(genRes)
        setVariations([])
        setSelectedVarId(null)
        toast({
          title: 'Ideia de Cena e Roteiro Opcional Gerados! 🎬✨',
          description: 'Roteiro de ~60s dividido em 6 cenas de 10s pronto para gravação.',
        })
      } else {
        throw new Error(genRes.error || 'Erro ao gerar roteiro viral.')
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar cena viral',
        description: err.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = (text: string, type: 'concept' | 'script' | 'all') => {
    navigator.clipboard.writeText(text)
    if (type === 'concept') {
      setCopiedConcept(true)
      setTimeout(() => setCopiedConcept(false), 2500)
    } else if (type === 'script') {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2500)
    } else {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2500)
    }
    toast({
      title: 'Copiado com sucesso! 📋',
      description: 'Texto copiado para a área de transferência.',
    })
  }

  // Regeneração com limite de até 2 vezes gratuitas para virais
  const handleRegenerateClick = async () => {
    if (!result) return

    if (!user) {
      setAuthGateAction('Regenerar variações do roteiro viral')
      setAuthGateOpen(true)
      return
    }

    const hasFreeAvailable = freeRegenerationsRemaining > 0

    if (!hasFreeAvailable && extraCreditsBalance <= 0) {
      setPaymentModalOpen(true)
      return
    }

    setRegenerating(true)
    try {
      const res = await regeneratePromptVariations({
        basePrompt: result.optional_script,
        promptTitle: result.theme_name,
        productName: characterName.trim() || result.theme_name,
        characterName: characterName.trim() || undefined,
        visualDetails: visualDetails.trim() || undefined,
        niche: result.niche,
        imagesCount: referenceFiles.length,
        category: 'virais',
        seed: Math.floor(Math.random() * 1000000),
      })

      if (res.success && res.variations?.length) {
        setVariations(res.variations)
        setSelectedVarId(res.variations[0].id)

        if (hasFreeAvailable) {
          const recorded = recordViralRegenerationUsed(user.id, viralStorageKey)
          toast({
            title: '3 Novas Abordagens Virais (~60s) Regeneradas! 🎬✨',
            description: `Regeneração ${recorded.used} de ${VIRAL_REGENERATION_LIMIT} gratuitas utilizadas. (${recorded.remainingFree} restante${recorded.remainingFree === 1 ? '' : 's'})`,
          })
        } else if (extraCreditsBalance > 0) {
          await consumeExtraRegenerationCredit(user.id)
          setExtraCreditsBalance((prev) => Math.max(0, prev - 1))
          toast({
            title: '3 Novas Variações Virais Regeneradas! ⚡',
            description: '1 crédito extra (R$ 1,99) foi utilizado com sucesso.',
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
    })
    setTimeout(() => setCopiedVarId(null), 2500)
  }

  return (
    <div className="space-y-8 rounded-3xl border bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-amber-500/5 p-5 sm:p-8 shadow-sm">
      {/* Topo do Gerador Viral */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerador Exclusivo de Vídeos Virais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Gerador a partir de Imagem Criada</span>
            <span className="text-2xl">📸🎬</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Suba a sua imagem já criada (até 3 fotos). A IA analisa a composição visual e gera
            primeiro <strong>uma Ideia de Cena</strong> (conceito curto e impactante) e, na
            sequência, <strong>um Roteiro Opcional</strong> de ~60 segundos organizado em 6 cenas de
            até 10 segundos, 100% limpo sem texto gravado na tela.
          </p>
        </div>

        {/* Status de Regenerações Disponíveis */}
        <div className="shrink-0 flex items-center gap-2 bg-background/80 border p-2.5 rounded-2xl shadow-xs">
          <div className="text-right text-xs">
            <span className="text-muted-foreground font-medium block text-[11px]">
              Regenerações Virais:
            </span>
            <span className="font-extrabold text-pink-600 dark:text-pink-400">
              {user
                ? `${freeRegenerationsRemaining} grátis ${extraCreditsBalance > 0 ? `+ ${extraCreditsBalance} extras` : ''}`
                : '2 grátis no login'}
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (!user) {
                setAuthGateAction('Adquirir créditos de regeneração')
                setAuthGateOpen(true)
                return
              }
              setPaymentModalOpen(true)
            }}
            className="h-8 text-xs font-bold border-pink-500/40 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            + Extras
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Formulário de Upload e Parâmetros */}
        <Card className="lg:col-span-5 border bg-card/90 shadow-sm rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="w-4 h-4 text-pink-500" />
              1. Suba sua imagem e escolha o nicho
            </CardTitle>
            <CardDescription className="text-xs">
              Aceita até 3 imagens já criadas (Midjourney, Flux, DALL-E ou fotos reais).
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Upload de até 3 imagens */}
              <div className="space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-pink-500/30 bg-pink-500/5">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-pink-500" />
                    Sua Imagem Criada ({referenceFiles.length} de 3)
                  </span>
                  {referenceFiles.length > 0 && (
                    <span className="text-[11px] text-pink-600 font-medium">
                      {referenceFiles.length} foto(s) anexada(s)
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
                          alt="Referência viral"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/75 text-white hover:bg-black transition-colors"
                          title="Remover imagem"
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
                      htmlFor="viral-image-upload-input"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-3 rounded-xl border border-dashed border-pink-500/40 bg-background hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {referenceFiles.length === 0
                          ? 'Clique para subir a sua imagem criada'
                          : 'Adicionar mais uma imagem (máx 3)'}
                      </span>
                    </label>
                    <input
                      id="viral-image-upload-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Formatos aceitos: PNG, JPG, WEBP. A imagem servirá de referência para gerar a
                  ideia e as cenas.
                </p>
              </div>

              {/* Nicho Viral */}
              <div className="space-y-1.5">
                <Label htmlFor="viral-niche-select" className="text-xs font-semibold">
                  Nicho de Vídeo Viral
                </Label>
                <Select value={niche} onValueChange={(val) => setNiche(val as NicheType)}>
                  <SelectTrigger id="viral-niche-select" className="rounded-xl text-xs h-10">
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

              {/* Troca / Definição de Personagem Central */}
              <div className="space-y-1.5 p-3 rounded-2xl border border-pink-500/30 bg-pink-500/5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="viral-character-input"
                    className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Personagem Principal do Roteiro
                  </Label>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full">
                    Troca Inteligente
                  </span>
                </div>
                <Input
                  id="viral-character-input"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Ex: Pinguim falante, Cachorro detetive, Espelho que fala..."
                  className="rounded-xl text-xs sm:text-sm h-10 border-pink-500/30 focus-visible:ring-pink-500 bg-background"
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Defina o personagem central. Se você estiver adaptando uma história, o personagem
                  antigo será substituído integralmente por este.
                </p>
              </div>

              {/* Tema ou Contexto da Imagem */}
              <div className="space-y-1.5">
                <Label htmlFor="viral-theme-input" className="text-xs font-semibold">
                  Tema ou Situação da Cena
                </Label>
                <Input
                  id="viral-theme-input"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Ex: Fuga cômica na cozinha, mistério na floresta à noite..."
                  className="rounded-xl text-xs sm:text-sm h-10"
                />
              </div>

              {/* Detalhes Visuais Observados (Opcional) */}
              <div className="space-y-1.5">
                <Label htmlFor="viral-visual-details" className="text-xs font-semibold">
                  Detalhes Específicos da Imagem (Opcional)
                </Label>
                <Textarea
                  id="viral-visual-details"
                  value={visualDetails}
                  onChange={(e) => setVisualDetails(e.target.value)}
                  placeholder="Ex: Cor vermelha brilhante, olhos grandes 3D, iluminação de estúdio na cozinha, fundo borrado..."
                  rows={2}
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              {/* Duração Alvo travada em ~60s / cenas de 10s */}
              <div className="p-3 rounded-xl bg-muted/40 border text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                    Duração & Estrutura Alvo:
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    ~60 segundos (Cenas de 10s)
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  O roteiro opcional é estruturado em <strong>6 cenas de até 10 segundos</strong>,
                  permitindo renderizar pedaço por pedaço nas IAs de vídeo (Kling, Hailuo, Luma) sem
                  distorções.
                </p>
              </div>

              {/* Botão de Disparo */}
              <Button
                type="submit"
                disabled={generating}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-extrabold text-sm shadow-md hover:opacity-95 gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analisando Imagem e Criando Roteiro...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Ideia de Cena & Roteiro Opcional ✨</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coluna Direita: Resultado (Ideia de Cena + Roteiro Opcional + Regenerações) */}
        <div className="lg:col-span-7 space-y-5">
          {!result && !generating && (
            <Card className="border-2 border-dashed bg-muted/15 rounded-3xl p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-2xl">
                🎬
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-foreground">
                  Nenhuma cena gerada ainda
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Suba a sua imagem no formulário ao lado e clique em gerar. O sistema devolverá
                  primeiro a <strong>Ideia de Cena</strong> e logo abaixo o{' '}
                  <strong>Roteiro Opcional de ~60s em cenas de 10s</strong>.
                </p>
              </div>
            </Card>
          )}

          {generating && (
            <Card className="border bg-card rounded-3xl p-12 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-foreground">
                  Criando conceito viral e roteiro de 60s...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organizando em 6 cenas de até 10 segundos com narração fluida em PT-BR.
                </p>
              </div>
            </Card>
          )}

          {result && (
            <div className="space-y-5 animate-in fade-in-50 duration-300">
              {/* 1. IDEIA DE CENA (Conceito Curto do Vídeo) */}
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
                        Visão criativa sintetizada para a sua imagem
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(result.scene_concept, 'concept')}
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
                    {result.scene_concept}
                  </p>
                </CardContent>
              </Card>

              {/* 2. ROTEIRO OPCIONAL (60s em Cenas de 10s) */}
              <Card className="border rounded-3xl overflow-hidden shadow-sm bg-card">
                <CardHeader className="bg-muted/30 border-b py-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-extrabold text-foreground flex items-center gap-2">
                        <span>2. Roteiro Opcional Sugerido</span>
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                          Opcional / Sugestão
                        </Badge>
                      </CardTitle>
                      <span className="text-[10px] text-muted-foreground">
                        Você pode ou não querer seguir este roteiro de ~60s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRegenerateClick}
                      disabled={regenerating}
                      className="h-8 text-xs font-bold border-pink-500/40 text-pink-600 dark:text-pink-400 gap-1.5 hover:bg-pink-500/10"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-pink-500 ${regenerating ? 'animate-spin' : ''}`}
                      />
                      <span>
                        Regenerar (
                        {freeRegenerationsRemaining > 0
                          ? `${freeRegenerationsRemaining} disp.`
                          : `${extraCreditsBalance} extras`}
                        )
                      </span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleCopy(result.optional_script, 'script')}
                      className="h-8 text-xs font-bold bg-gradient-to-r from-pink-600 to-amber-500 text-white gap-1.5"
                    >
                      {copiedScript ? (
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
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5">
                  <div className="p-3 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <strong>Roteiro Opcional:</strong> Este roteiro de ~60 segundos foi
                      estruturado em 6 cenas sequenciais de até 10 segundos. Você é livre para
                      segui-lo à risca ou adaptar livremente com base na sua Ideia de Cena acima!
                    </span>
                  </div>

                  <div className="bg-muted/40 border rounded-2xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
                    {result.optional_script}
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/20 border-t py-3 px-5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Vídeo 100% limpo sem texto na tela • Narração em áudio PT-BR
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleCopy(`${result.scene_concept}\n\n${result.optional_script}`, 'all')
                    }
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 h-8 gap-1"
                  >
                    {copiedAll ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copiar Ideia + Roteiro Completo
                  </Button>
                </CardFooter>
              </Card>

              {/* Variações Regeneradas (caso o usuário tenha clicado em Regenerar) */}
              {variations.length > 0 && (
                <Card className="border border-pink-500/30 rounded-3xl bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-500" />3 Novas Variações Virais de
                        60s
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Abordagens alternativas geradas a partir da sua cena.
                      </p>
                    </div>
                    <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20 text-[10px] font-bold">
                      Cenas de 10s
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {variations.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVarId(v.id)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                          selectedVarId === v.id
                            ? 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                            : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                        }`}
                      >
                        <span className="block truncate text-[11px] font-bold">{v.badge}</span>
                      </button>
                    ))}
                  </div>

                  {selectedVarId &&
                    (() => {
                      const curVar = variations.find((v) => v.id === selectedVarId)
                      if (!curVar) return null
                      const isVarCopied = copiedVarId === curVar.id

                      return (
                        <div className="p-4 rounded-2xl border bg-muted/20 space-y-3 animate-in fade-in-50">
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
                                  Copiar Roteiro 60s
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="bg-background border rounded-xl p-3.5 font-mono text-xs whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed select-all">
                            {curVar.prompt_text}
                          </div>
                        </div>
                      )
                    })()}
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pagamento Demonstrativo quando esgotar as 2 regenerações gratuitas */}
      {user && (
        <RegenerationPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          userId={user.id}
          onPaymentSuccess={(newBalance) => {
            setExtraCreditsBalance(newBalance)
            setTimeout(() => {
              handleRegenerateClick()
            }, 300)
          }}
        />
      )}

      {/* Auth Gate Modal para Visitantes */}
      <AuthGateModal
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        title="Entre ou Crie sua Conta Gratuita"
        description="Para usar o gerador de vídeos virais a partir de fotos criadas, salvar no histórico e desbloquear suas regenerações gratuitas, entre ou cadastre-se grátis em instantes."
      />
    </div>
  )
}

export default ViralGenerator
