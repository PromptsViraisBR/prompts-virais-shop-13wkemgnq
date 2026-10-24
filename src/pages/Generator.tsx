import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  saveGeneratedPrompt,
  getUserGenerations,
  generateProductImage,
  generateProductVideo,
  updateGenerationImage,
  updateGenerationVideo,
} from '@/services/generations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  History,
  Video,
  ArrowRight,
  Crown,
  RefreshCw,
  ImageIcon,
  Download,
  Eye,
  ExternalLink,
  Flame,
  Play,
  Film,
  AlertCircle,
  Clock,
  Sparkle,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { GenerationRecord, NicheType, StyleType, PlatformType } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

export const Generator: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  // Form State
  const [productName, setProductName] = useState('')
  const [niche, setNiche] = useState<NicheType>('moda_feminina')
  const [style, setStyle] = useState<StyleType>('pov')
  const [platform, setPlatform] = useState<PlatformType>('tiktok_shop')
  const [targetAudience, setTargetAudience] = useState('')
  const [details, setDetails] = useState('')

  // Results State
  const [generating, setGenerating] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [videoFallbackMsg, setVideoFallbackMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'roteiro' | 'imagem' | 'video'>('roteiro')
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [copied, setCopied] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  useEffect(() => {
    if (user && isPaidPlan) {
      loadHistory()
    }
  }, [user, isPaidPlan])

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
      toast({
        title: 'Faça login para gerar prompts',
        description: 'Crie sua conta para acessar o gerador personalizado.',
      })
      navigate('/login')
      return
    }

    if (!isPaidPlan) {
      toast({
        title: 'Recurso Exclusivo do Plano Pago',
        description:
          'O gerador personalizado para peças do seu catálogo está disponível nos planos Mensal e Anual.',
        variant: 'destructive',
      })
      navigate('/planos')
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

    setGenerating(true)
    try {
      // Salva no banco de dados através do serviço
      const record = await saveGeneratedPrompt({
        userId: user.id,
        productName,
        niche,
        style,
        platform,
        targetAudience,
        details,
      })

      setCurrentPrompt(record.generated_prompt)
      setCurrentGenerationId(record.id)
      setCurrentImageUrl(record.generated_image_url || null)
      setCurrentVideoUrl(record.generated_video_url || null)
      setHistory((prev) => [record, ...prev])
      setActiveTab('roteiro')

      toast({
        title: 'Roteiro Gerado com Sucesso! 🚀',
        description: 'Pronto para você gravar com a sua peça da vitrine.',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro ao gerar roteiro',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  // Geração de Imagem com Nano Banana (Gratuito para todos)
  const handleGenerateImage = async () => {
    if (!productName.trim()) {
      toast({
        title: 'Informe o nome da roupa ou produto',
        description: 'Preencha o nome do produto no formulário para gerar a referência visual.',
        variant: 'destructive',
      })
      return
    }

    setGeneratingImage(true)
    setActiveTab('imagem')

    try {
      const res = await generateProductImage({
        productName,
        niche,
        style,
        details,
        generationId: currentGenerationId || undefined,
      })

      if (res && res.image_url) {
        setCurrentImageUrl(res.image_url)

        // Se houver roteiro gerado salvo no banco, atualiza com a nova imagem
        if (currentGenerationId) {
          try {
            await updateGenerationImage(currentGenerationId, res.image_url)
            setHistory((prev) =>
              prev.map((item) =>
                item.id === currentGenerationId
                  ? { ...item, generated_image_url: res.image_url }
                  : item,
              ),
            )
          } catch (updateErr) {
            console.warn('Erro ao vincular imagem à geração:', updateErr)
          }
        }

        toast({
          title: 'Imagem gerada com sucesso! 🎨',
          description: 'Modelo Nano Banana: imagem de alta conversão pronta para o seu criativo.',
        })
      }
    } catch (err) {
      console.error('Erro ao gerar imagem:', err)
      toast({
        title: 'Não foi possível gerar a imagem',
        description: 'Ocorreu uma falha no serviço de imagem. Tente novamente em alguns instantes.',
        variant: 'destructive',
      })
    } finally {
      setGeneratingImage(false)
    }
  }

  // Geração de Vídeo Curto até 10s (Exclusivo PRO)
  const handleGenerateVideo = async () => {
    if (!user) {
      toast({
        title: 'Faça login para gerar vídeos',
        description: 'Entre na sua conta para utilizar o gerador de vídeo com IA.',
      })
      navigate('/login')
      return
    }

    if (!isPaidPlan) {
      toast({
        title: 'Exclusivo do Plano PRO (R$ 49,90/mês)',
        description:
          'A geração de vídeo viral de até 10s é exclusiva para assinantes PRO e Anual VIP.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    if (!productName.trim()) {
      toast({
        title: 'Informe o produto',
        description: 'Digite o nome da peça no formulário para estruturar o vídeo.',
        variant: 'destructive',
      })
      return
    }

    setGeneratingVideo(true)
    setVideoFallbackMsg(null)
    setActiveTab('video')

    try {
      const res = await generateProductVideo({
        productName,
        niche,
        style,
        details,
        script: currentPrompt || undefined,
        generationId: currentGenerationId || undefined,
      })

      if (res.fallback) {
        // Fallback gracioso com mensagem explicativa e orientação
        setVideoFallbackMsg(
          res.message ||
            'A fila de geração de vídeo direto por IA está com alta demanda momentânea. Você pode gerar a imagem de alta definição com Nano Banana enquanto a fila normaliza.',
        )
        toast({
          title: 'Servidores de vídeo em alta demanda',
          description:
            'A renderização direta está congestionada nos servidores de IA. Sugerimos utilizar o gerador de imagem grátis com Nano Banana.',
        })
      } else if (res.video_url) {
        setCurrentVideoUrl(res.video_url)
        setVideoFallbackMsg(null)

        if (currentGenerationId) {
          try {
            await updateGenerationVideo(currentGenerationId, res.video_url)
            setHistory((prev) =>
              prev.map((item) =>
                item.id === currentGenerationId
                  ? { ...item, generated_video_url: res.video_url }
                  : item,
              ),
            )
          } catch (updateErr) {
            console.warn('Erro ao vincular vídeo à geração:', updateErr)
          }
        }

        toast({
          title: 'Vídeo gerado com sucesso! 🎬',
          description: 'Vídeo vertical 9:16 de até 10s pronto para o TikTok Shop / Shopee.',
        })
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string }
      if (errorObj?.code === 'PLAN_UPGRADE_REQUIRED') {
        toast({
          title: 'Upgrade para o Plano PRO Necessário',
          description: errorObj.message || 'Assine o plano PRO a R$ 49,90/mês para liberar vídeos.',
          variant: 'destructive',
        })
        navigate('/planos')
      } else {
        console.error('Erro na geração de vídeo:', err)
        setVideoFallbackMsg(
          'O serviço de geração de vídeo está temporariamente indisponível no momento. Você pode utilizar a geração de imagem grátis com Nano Banana como alternativa.',
        )
        toast({
          title: 'Geração temporariamente indisponível',
          description: 'Recomendamos usar o gerador de imagem Nano Banana como referência visual.',
          variant: 'destructive',
        })
      }
    } finally {
      setGeneratingVideo(false)
    }
  }

  const handleDownloadVideo = async () => {
    if (!currentVideoUrl) return
    try {
      const fileName = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'video_viral'}_10s.mp4`
      if (currentVideoUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = currentVideoUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const res = await fetch(currentVideoUrl)
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }

      toast({
        title: 'Download iniciado! 📥',
        description: 'Vídeo curto salvo para postar nas redes.',
      })
    } catch (err) {
      console.error('Erro no download do vídeo:', err)
      window.open(currentVideoUrl, '_blank')
    }
  }

  const handleDownloadImage = async () => {
    if (!currentImageUrl) return
    try {
      const fileName = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'criativo'}_nano_banana.png`

      if (currentImageUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = currentImageUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const res = await fetch(currentImageUrl)
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }

      toast({
        title: 'Download iniciado! 📥',
        description: 'Imagem salva com sucesso na sua galeria/downloads.',
      })
    } catch (err) {
      console.error('Erro no download:', err)
      // Fallback abre direto em nova aba
      window.open(currentImageUrl, '_blank')
    }
  }

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast({
      title: 'Prompt copiado com sucesso! 📋',
      description: 'Cole no seu bloco de notas ou teleprompter e grave seu vídeo.',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApplyPreset = (
    presetName: string,
    presetNiche: NicheType,
    presetStyle: StyleType,
    presetDetails: string,
  ) => {
    setProductName(presetName)
    setNiche(presetNiche)
    setStyle(presetStyle)
    setDetails(presetDetails)
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold uppercase"
          >
            Criador Sob Medida
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Gerador de Roteiros Personalizados
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Insira o nome da roupa ou acessório do seu catálogo e gere uma estrutura completa de
            roteiro com gancho, demonstração e CTA para a vitrine.
          </p>
        </div>

        {user && isPaidPlan && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(!historyOpen)}
            className="gap-2 font-medium"
          >
            <History className="w-4 h-4 text-pink-500" />
            {historyOpen ? 'Ocultar Histórico' : `Ver Histórico (${history.length})`}
          </Button>
        )}
      </div>

      {/* Alerta de bloqueio caso não seja plano pago */}
      {!isPaidPlan && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-lg">
              <Crown className="w-5 h-5 text-amber-500" />
              Recurso Exclusivo para Assinantes PRO
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              O gerador personalizado cria roteiros específicos para qualquer peça do seu estoque
              (vestidos, conjuntos, calças, tênis). Assine o plano Mensal ou Anual para gerar
              roteiros ilimitados.
            </p>
          </div>
          <Link to="/planos" className="shrink-0">
            <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold shadow-md">
              Desbloquear Gerador PRO
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Grid: Formulário x Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-500" />
                Dados da Peça do Catálogo
              </CardTitle>
              <CardDescription>
                Especifique a peça para criar um roteiro com gatilhos de venda precisos.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleGenerate}>
              <CardContent className="space-y-4">
                {/* Sugestões rápidas de preenchimento */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Sugestões rápidas de nicho:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          'Vestido Canelado Gola Alta',
                          'moda_feminina',
                          'pov',
                          'Tecido encorpado que modela sem marcar nada na cintura',
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      👗 Vestido Midi
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          'Camiseta Oversized Gola Ribana',
                          'streetwear_casual',
                          'modelo',
                          'Algodão pesado 240g com gola de 3cm que não laceia',
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      👕 Camiseta Oversized
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          'Conjunto Fitness Sem Costura',
                          'fitness_academia',
                          'modelo',
                          'Cós alto de compressão e tecido zero transparência',
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      🏋️ Legging / Top
                    </button>
                  </div>
                </div>

                {/* Nome do Produto */}
                <div className="space-y-2">
                  <Label htmlFor="product-name" className="font-semibold">
                    Nome da Roupa / Produto <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="Ex: Vestido Chemise Linho com Cinto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                {/* Nicho & Estilo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="niche" className="font-semibold">
                      Nicho / Categoria
                    </Label>
                    <Select value={niche} onValueChange={(v) => setNiche(v as NicheType)}>
                      <SelectTrigger id="niche">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NICHE_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style" className="font-semibold">
                      Estilo de Gravação
                    </Label>
                    <Select value={style} onValueChange={(v) => setStyle(v as StyleType)}>
                      <SelectTrigger id="style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STYLE_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Plataforma */}
                <div className="space-y-2">
                  <Label htmlFor="platform" className="font-semibold">
                    Plataforma Principal de Venda
                  </Label>
                  <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformType)}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLATFORM_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Detalhes que vendem */}
                <div className="space-y-2">
                  <Label htmlFor="details" className="font-semibold">
                    Diferenciais e Benefícios da Peça
                  </Label>
                  <Input
                    id="details"
                    placeholder="Ex: Tecido duplo, forro interno, elástico na cintura, não amassa fácil"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    O roteiro destacará esses pontos na cena de quebra de objeções.
                  </p>
                </div>

                {/* Público Alvo */}
                <div className="space-y-2">
                  <Label htmlFor="target-audience" className="font-semibold">
                    Público-Alvo ou Ocasião de Uso (Opcional)
                  </Label>
                  <Input
                    id="target-audience"
                    placeholder="Ex: Mulheres elegantes para look de trabalho e dates"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter className="pt-2 flex flex-col gap-2.5">
                <Button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold py-5 shadow-md"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Estruturando Cenas Virais...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Roteiro Viral Agora
                    </>
                  )}
                </Button>

                {/* Botão de Imagem Grátis com Nano Banana */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || generatingVideo}
                  className="w-full border-pink-500/30 hover:border-pink-500 hover:bg-pink-500/10 text-foreground font-semibold py-4 transition-all"
                >
                  {generatingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin text-pink-500" />
                      Criando Imagem com Nano Banana...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2 text-pink-500" />
                      <span>Gerar Imagem de Referência</span>
                      <Badge className="ml-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                        GRÁTIS • Nano Banana
                      </Badge>
                    </>
                  )}
                </Button>

                {/* Botão de Gerar Vídeo (até 10s) • Exclusivo PRO */}
                <Button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={generatingVideo || generating}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold py-4 shadow-md transition-all relative group"
                >
                  {generatingVideo ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Gerando Vídeo com IA (até 10s)...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4 mr-2" />
                      <span>Gerar Vídeo Viral (até 10s)</span>
                      <Badge className="ml-2 bg-amber-400 text-amber-950 font-extrabold text-[10px] shadow-sm">
                        PRO • R$ 49,90
                      </Badge>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Resultado Gerado */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border shadow-md min-h-[520px] flex flex-col justify-between">
            <CardHeader className="bg-muted/40 border-b py-3 px-4 sm:px-6 flex flex-row items-center justify-between gap-2">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as 'roteiro' | 'imagem' | 'video')}
                className="w-auto"
              >
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="roteiro" className="text-xs gap-1 px-2 sm:px-3">
                    <Video className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="hidden sm:inline">Roteiro</span>
                    <span className="sm:hidden">Texto</span>
                  </TabsTrigger>
                  <TabsTrigger value="imagem" className="text-xs gap-1 px-2 sm:px-3">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Imagem</span>
                    {currentImageUrl && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="video" className="text-xs gap-1 px-2 sm:px-3 relative">
                    <Film className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>Vídeo</span>
                    <Badge className="px-1 py-0 text-[8px] h-3.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold ml-0.5">
                      PRO
                    </Badge>
                    {currentVideoUrl && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block shrink-0" />
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {activeTab === 'roteiro' && currentPrompt && (
                <Button
                  size="sm"
                  onClick={() => handleCopy(currentPrompt)}
                  className="gap-1.5 font-semibold text-xs bg-gradient-to-r from-pink-600 to-amber-500 text-white h-8"
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

              {activeTab === 'imagem' && currentImageUrl && (
                <Button
                  size="sm"
                  onClick={handleDownloadImage}
                  className="gap-1.5 font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Imagem
                </Button>
              )}

              {activeTab === 'video' && currentVideoUrl && (
                <Button
                  size="sm"
                  onClick={handleDownloadVideo}
                  className="gap-1.5 font-semibold text-xs bg-purple-600 hover:bg-purple-700 text-white h-8"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Vídeo
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
              {activeTab === 'roteiro' ? (
                currentPrompt ? (
                  <div className="bg-muted/30 border rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground select-all h-full max-h-[500px] overflow-y-auto">
                    {currentPrompt}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4 space-y-4 text-muted-foreground">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                      <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h3 className="font-bold text-foreground text-base">
                        Seu roteiro pronto aparecerá aqui
                      </h3>
                      <p className="text-xs">
                        Preencha os dados da sua roupa ao lado e clique em "Gerar Roteiro Viral"
                        para montar as cenas em segundos.
                      </p>
                    </div>
                  </div>
                )
              ) : activeTab === 'video' ? (
                /* Aba Vídeo Viral (Até 10s) • Exclusivo PRO */
                <div className="flex flex-col items-center justify-center h-full">
                  {!isPaidPlan ? (
                    /* Prompt de Upgrade Amigável para Não-PRO */
                    <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-amber-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                        <Crown className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                          Exclusivo Plano PRO • R$ 49,90/mês
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground">
                          Gere Vídeos Virais de até 10s com IA
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Crie clipes verticais de alta conversão (formato 9:16) com inteligência
                          artificial para destacar suas roupas no TikTok Shop e Shopee sem precisar
                          gravar presencialmente.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-muted/50 border text-xs text-left space-y-2">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <Sparkles className="w-4 h-4 text-pink-500" />
                          O que está incluído no PRO:
                        </div>
                        <ul className="space-y-1 text-muted-foreground list-disc list-inside text-[11px]">
                          <li>Vídeos verticais 9:16 de 5 a 10 segundos com movimento</li>
                          <li>Estilos POV no espelho, modelo desfilando ou unboxing vitrine</li>
                          <li>Download em MP4 sem marca d'água para publicar na sacolinha</li>
                          <li>Acesso à biblioteca completa e gerador ilimitado</li>
                        </ul>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                        <Link to="/planos">
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-md">
                            <Crown className="w-3.5 h-3.5 mr-1.5" />
                            Assinar Plano PRO por R$ 49,90
                          </Button>
                        </Link>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveTab('imagem')
                            handleGenerateImage()
                          }}
                          className="w-full sm:w-auto text-xs"
                        >
                          Usar Imagem Grátis (Nano Banana)
                        </Button>
                      </div>
                    </div>
                  ) : generatingVideo ? (
                    /* Estado de Carregamento Claro */
                    <div className="text-center py-16 px-4 space-y-4 text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto text-purple-600 animate-pulse">
                        <Film className="w-8 h-8 animate-spin" />
                      </div>
                      <div className="space-y-1.5 max-w-sm mx-auto">
                        <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] font-bold">
                          Processamento em Andamento (até 10s)
                        </Badge>
                        <h3 className="font-bold text-foreground text-base">
                          Renderizando Vídeo com Inteligência Artificial...
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Vídeos com IA requerem computação pesada de renderização de quadros e
                          movimento cinemático. Isso pode levar de 30 a 90 segundos. Por favor,
                          aguarde.
                        </p>
                      </div>
                    </div>
                  ) : currentVideoUrl ? (
                    /* Player de Vídeo Vertical 9:16 */
                    <div className="w-full flex flex-col items-center space-y-4">
                      <div className="relative rounded-2xl overflow-hidden border shadow-xl bg-black max-w-xs w-full aspect-[9/16] max-h-[460px] flex items-center justify-center">
                        <video
                          src={currentVideoUrl}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-center space-y-1 max-w-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-bold">
                            Vídeo Vertical 9:16 • 10s
                          </Badge>
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                            Pronto para TikTok Shop / Shopee
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-foreground">
                          {productName || 'Vídeo gerado para criativo de vendas'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleDownloadVideo}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar MP4
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(currentVideoUrl, '_blank')}
                          className="text-xs gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Abrir em Nova Aba
                        </Button>
                      </div>
                    </div>
                  ) : videoFallbackMsg ? (
                    /* Fallback Gracioso com Sugestão do Gerador de Imagem */
                    <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-500/30 text-[10px] font-bold"
                        >
                          Servidores de Vídeo Ocupados
                        </Badge>
                        <h3 className="font-bold text-foreground text-base">
                          Renderização Temporariamente Ocupada
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {videoFallbackMsg}
                        </p>
                      </div>

                      <div className="p-3 bg-muted/40 rounded-xl border text-xs text-left space-y-1">
                        <span className="font-semibold text-foreground block">
                          💡 Alternativa Recomendada:
                        </span>
                        <p className="text-muted-foreground text-[11px]">
                          Utilize o <strong>Gerador de Imagens Nano Banana</strong> para criar a
                          referência visual imediata da sua peça e monte o carrossel ou fundo do
                          vídeo com o áudio de narração.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                        <Button
                          type="button"
                          onClick={handleGenerateImage}
                          className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold text-xs shadow-sm"
                        >
                          <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                          Gerar Imagem com Nano Banana
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateVideo}
                          className="text-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Tentar Novamente
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Estado Inicial Aba Vídeo para Usuário PRO */
                    <div className="text-center py-16 px-4 space-y-4 text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto">
                        <Film className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5 max-w-sm mx-auto">
                        <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Recurso PRO Ativo
                        </Badge>
                        <h3 className="font-bold text-foreground text-base">
                          Gerador de Vídeos Curtos com IA (até 10s)
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Preencha os dados do seu produto no formulário ao lado e clique em{' '}
                          <strong>"Gerar Vídeo Viral (até 10s)"</strong> para renderizar uma cena
                          vertical 9:16 com movimento e iluminação cinematográfica.
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleGenerateVideo}
                        disabled={generatingVideo}
                        className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Criar Vídeo Viral Agora (10s)
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* Aba Imagem Grátis (Nano Banana) */
                <div className="flex flex-col items-center justify-center h-full">
                  {generatingImage ? (
                    <div className="text-center py-16 px-4 space-y-4 text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto text-pink-500 animate-pulse">
                        <ImageIcon className="w-8 h-8 animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-foreground text-base">
                          Criando imagem com Nano Banana...
                        </h3>
                        <p className="text-xs max-w-xs mx-auto">
                          Renderizando iluminação de estúdio, peça em cena e detalhes de alta
                          conversão para TikTok Shop e Shopee.
                        </p>
                      </div>
                    </div>
                  ) : currentImageUrl ? (
                    <div className="w-full flex flex-col items-center space-y-4">
                      <div className="relative group rounded-xl overflow-hidden border shadow-lg bg-black/5 dark:bg-black/40 max-w-sm w-full aspect-[9/16] max-h-[440px] flex items-center justify-center">
                        <img
                          src={currentImageUrl}
                          alt={productName || 'Visual gerado por Nano Banana'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                          <Badge className="self-start bg-black/60 text-white border-white/20 text-[10px]">
                            Nano Banana • 9:16 Vertical
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleDownloadImage}
                              className="flex-1 bg-white text-black hover:bg-white/90 font-bold text-xs gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Baixar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(currentImageUrl, '_blank')}
                              className="bg-black/60 text-white border-white/30 hover:bg-black/80 text-xs px-2.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-center space-y-1">
                        <p className="text-xs font-semibold text-foreground">
                          Referência visual de cena para {productName || 'sua peça'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Use como inspiração para o cenário, iluminação e enquadramento do seu
                          vídeo.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 space-y-4 text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                        <ImageIcon className="w-8 h-8 text-pink-500" />
                      </div>
                      <div className="space-y-1.5 max-w-sm mx-auto">
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px] font-bold uppercase tracking-wider mb-1"
                        >
                          100% Gratuito
                        </Badge>
                        <h3 className="font-bold text-foreground text-base">
                          Gerador de Imagens Nano Banana
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Gere uma imagem hiper-realista da sua roupa em cena de e-commerce (estilo
                          POV ou com modelo). Preencha a peça ao lado e clique em{' '}
                          <strong>"Gerar Imagem de Referência"</strong>.
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={generatingImage}
                        className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Criar Imagem Grátis Agora
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t bg-muted/20 py-3 px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
              {activeTab === 'roteiro' ? (
                currentPrompt ? (
                  <>
                    <span>Roteiro salvo no seu histórico do banco de dados</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(currentPrompt)}
                      className="text-xs h-auto p-0 text-pink-600 dark:text-pink-400 font-semibold"
                    >
                      Copiar novamente
                    </Button>
                  </>
                ) : (
                  <span>Gere um roteiro estruturado com gancho e CTA</span>
                )
              ) : activeTab === 'video' ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-purple-500" />
                    Vídeo vertical 9:16 até 10s • Exclusivo PRO (R$ 49,90)
                  </span>
                  {currentVideoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateVideo}
                      disabled={generatingVideo}
                      className="text-xs h-auto p-0 text-purple-600 dark:text-purple-400 font-semibold gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Renderizar novo vídeo
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Modelo: Nano Banana (Gemini 2.5 Flash Image)
                  </span>
                  {currentImageUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={generatingImage}
                      className="text-xs h-auto p-0 text-pink-600 dark:text-pink-400 font-semibold gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Gerar nova variação
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Histórico de Gerações Salvas no Banco */}
      {historyOpen && user && isPaidPlan && (
        <div className="border rounded-2xl p-6 bg-muted/20 space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-pink-500" />
              Seu Histórico de Gerações Salvas
            </h2>
            <span className="text-xs text-muted-foreground">
              {history.length} roteiro(s) criados
            </span>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Você ainda não gerou nenhum roteiro personalizado. Comece agora!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <Card key={item.id} className="border bg-background shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {NICHE_LABELS[item.niche]}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.created).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {item.product_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Estilo: {STYLE_LABELS[item.style]}
                    </CardDescription>
                  </CardHeader>
                  {(item.generated_image_url || item.generated_video_url) && (
                    <div className="px-6 py-2 space-y-1.5">
                      {item.generated_image_url && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 border">
                          <ImageIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                          <span className="truncate flex-1">Imagem salva</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] px-2 text-pink-600"
                            onClick={() => {
                              setCurrentImageUrl(item.generated_image_url || null)
                              setActiveTab('imagem')
                            }}
                          >
                            Ver foto
                          </Button>
                        </div>
                      )}
                      {item.generated_video_url && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-purple-500/10 rounded-lg p-2 border border-purple-500/20">
                          <Film className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate flex-1">Vídeo de 10s salvo</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] px-2 text-purple-600"
                            onClick={() => {
                              setCurrentVideoUrl(item.generated_video_url || null)
                              setActiveTab('video')
                            }}
                          >
                            Ver vídeo
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <CardFooter className="pt-2 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setCurrentPrompt(item.generated_prompt)
                        setCurrentGenerationId(item.id)
                        if (item.generated_image_url) {
                          setCurrentImageUrl(item.generated_image_url)
                        }
                        if (item.generated_video_url) {
                          setCurrentVideoUrl(item.generated_video_url)
                        }
                        setActiveTab('roteiro')
                      }}
                    >
                      Visualizar Roteiro
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={() => handleCopy(item.generated_prompt)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
