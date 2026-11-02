import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import {
  Eraser,
  UploadCloud,
  Download,
  RotateCcw,
  Sparkles,
  Link2,
  AlertCircle,
  CheckCircle2,
  Video,
  ArrowLeft,
  Info,
  ShieldAlert,
  Loader2,
  Crop,
  Layers,
  Scissors,
  HelpCircle,
} from 'lucide-react'
import {
  VideoRegion,
  VideoMetadata,
  ProcessingMode,
  extractVideoMetadata,
  processVideoCleaning,
} from '@/services/videoCleaner'

export const VideoCleaner: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  // Entradas
  const [videoLink, setVideoLink] = useState('')
  const [linkNotice, setLinkNotice] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)

  // Configurações da limpeza
  const [mode, setMode] = useState<ProcessingMode>('blur')
  // Região da legenda padrão: parte inferior do vídeo (onde ficam 90% das legendas do TikTok/Reels)
  const [region, setRegion] = useState<VideoRegion>({
    x: 10,
    y: 72,
    width: 80,
    height: 18,
  })

  // Processamento e Resultado
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressPercent, setProgressPercent] = useState(0)
  const [progressStatus, setProgressStatus] = useState('')
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [processedFileName, setProcessedFileName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)

  // Checagem honesta de link de plataformas
  const handleLinkCheck = () => {
    const trimmed = videoLink.trim()
    if (!trimmed) {
      toast({
        title: 'Insira um link de vídeo',
        description: 'Cole o link de uma publicação para verificar a importação.',
        variant: 'destructive',
      })
      return
    }

    const lower = trimmed.toLowerCase()
    if (
      lower.includes('tiktok.com') ||
      lower.includes('instagram.com') ||
      lower.includes('facebook.com') ||
      lower.includes('fb.watch')
    ) {
      setLinkNotice(
        'Importação direta por link bloqueada pela plataforma: TikTok, Instagram e Facebook protegem seus vídeos contra extração sem autenticação paga. Por respeito às diretrizes das plataformas e para evitar serviços pagos de terceiros, salve o vídeo pelo app oficial e envie o arquivo abaixo pelo botão "Enviar Arquivo".',
      )
    } else {
      setLinkNotice(
        'Esta plataforma externa não oferece método de importação direto e gratuito. Por gentileza, faça o upload do vídeo salvo no seu dispositivo.',
      )
    }
  }

  // Upload de arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limite honesto de ~200MB (limite de memória do navegador para Canvas/MediaRecorder)
    const maxBytes = 200 * 1024 * 1024
    if (file.size > maxBytes) {
      toast({
        title: 'Arquivo muito pesado',
        description: `O vídeo tem ${(file.size / (1024 * 1024)).toFixed(1)}MB. O limite recomendado para processamento seguro no navegador é 200MB.`,
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
    setProcessedUrl(null)
    setLinkNotice(null)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    try {
      const meta = await extractVideoMetadata(file)
      setMetadata(meta)
      toast({
        title: 'Vídeo carregado com sucesso!',
        description: `${meta.width}x${meta.height} (${meta.aspectRatio}) • ${meta.duration.toFixed(1)}s`,
      })
    } catch {
      toast({
        title: 'Vídeo carregado',
        description: 'Metadados lidos no dispositivo.',
      })
    }
  }

  // Ajustes pré-definidos de região da legenda
  const handlePresetRegion = (type: 'bottom' | 'center' | 'top') => {
    if (type === 'bottom') {
      setRegion({ x: 10, y: 70, width: 80, height: 22 })
    } else if (type === 'center') {
      setRegion({ x: 10, y: 40, width: 80, height: 22 })
    } else if (type === 'top') {
      setRegion({ x: 10, y: 8, width: 80, height: 20 })
    }
  }

  // Disparo do processamento
  const handleProcessVideo = async () => {
    if (!user) {
      toast({
        title: 'Faça login para processar',
        description: 'Entre na sua conta para utilizar o Limpador de Vídeos.',
        variant: 'destructive',
      })
      return
    }

    if (!selectedFile) {
      toast({
        title: 'Nenhum vídeo selecionado',
        description: 'Selecione um arquivo de vídeo do seu dispositivo primeiro.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    setProgressPercent(5)
    setProgressStatus('Iniciando decodificação do vídeo...')

    try {
      const result = await processVideoCleaning({
        videoFile: selectedFile,
        region,
        mode,
        onProgress: (pct, msg) => {
          setProgressPercent(pct)
          setProgressStatus(msg)
        },
      })

      setProcessedUrl(result.outputUrl)
      setProcessedFileName(result.fileName)

      toast({
        title: 'Vídeo processado com sucesso!',
        description: 'Seu vídeo limpo está pronto para download em MP4.',
      })
    } catch (err: any) {
      console.error('[VideoCleaner] Falha no processamento:', err)
      toast({
        title: 'Erro no processamento',
        description:
          err?.message ||
          'Falha ao renderizar vídeo no navegador. Verifique a compatibilidade do formato.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Baixar o vídeo processado
  const handleDownload = () => {
    if (!processedUrl) return
    const a = document.createElement('a')
    a.href = processedUrl
    a.download = processedFileName || 'video_limpo.mp4'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: 'Download iniciado!',
      description: `Arquivo: ${processedFileName || 'video_limpo.mp4'}`,
    })
  }

  // Limpar formulário
  const handleReset = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (processedUrl) URL.revokeObjectURL(processedUrl)
    setProcessedUrl(null)
    setMetadata(null)
    setVideoLink('')
    setLinkNotice(null)
    setProgressPercent(0)
    setProgressStatus('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Voltar */}
      <div className="flex items-center justify-between">
        <Link
          to="/ferramentas"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Ferramentas Virais</span>
        </Link>
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold">
          Processamento Local
        </Badge>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
          <Eraser className="w-3.5 h-3.5" />
          <span>Ferramenta 2 • Prompts Virais</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
          Baixar & Limpar Vídeos
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Remova legendas ou textos sobrepostos de vídeos autorizados/próprios sem custos de APIs
          externas. Marque a área da legenda na pré-visualização e aplique desfoque inteligente ou
          recorte com áudio original preservado em MP4.
        </p>
      </div>

      {/* Card 1: Importação do Vídeo */}
      <Card className="border-2 border-border/80 shadow-md rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-500" />
            <span>1. Importar Vídeo</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Cole o link da publicação ou envie o arquivo MP4 diretamente do seu computador ou
            celular.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Campo de Link com checagem honesta */}
          <div className="space-y-2">
            <Label
              htmlFor="video_clean_link"
              className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Link do Vídeo (TikTok, Instagram, Facebook ou direto)</span>
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="video_clean_link"
                type="url"
                value={videoLink}
                onChange={(e) => {
                  setVideoLink(e.target.value)
                  if (linkNotice) setLinkNotice(null)
                }}
                placeholder="Ex: https://www.tiktok.com/@criador/video/... ou https://instagram.com/reel/..."
                className="h-11 rounded-xl text-xs sm:text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLinkCheck}
                className="h-11 px-4 rounded-xl text-xs font-bold border-emerald-500/30 hover:bg-emerald-500/10 shrink-0"
              >
                Importar por Link
              </Button>
            </div>

            {linkNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{linkNotice}</p>
                  <p className="text-[11px] opacity-80">
                    Clique no botão abaixo para enviar o vídeo salvo diretamente do seu aparelho.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t w-full" />
            <span className="bg-card px-3 text-[11px] font-bold text-muted-foreground uppercase">
              OU ENVIE O ARQUIVO DO DISPOSITIVO
            </span>
          </div>

          {/* Upload de arquivo */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
              onChange={handleFileChange}
              className="hidden"
              id="cleaner-file-input"
            />

            {!selectedFile ? (
              <label
                htmlFor="cleaner-file-input"
                className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500/70 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-emerald-500/[0.02] hover:bg-emerald-500/[0.06] transition-all space-y-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-foreground">
                    Clique para selecionar um vídeo (MP4 ou WebM)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tamanho recomendado: até 200 MB para processamento rápido
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-bold text-xs pointer-events-none"
                >
                  Selecionar Vídeo do Dispositivo
                </Button>
              </label>
            ) : (
              <div className="p-4 rounded-2xl border bg-muted/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        {metadata && (
                          <span>
                            {' '}
                            • {metadata.width}x{metadata.height} ({metadata.aspectRatio}) •{' '}
                            {metadata.duration.toFixed(1)}s
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs text-muted-foreground hover:text-destructive h-8 px-2.5 rounded-lg shrink-0"
                  >
                    Trocar Vídeo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Marcação da Área da Legenda e Configurações */}
      {selectedFile && previewUrl && (
        <Card className="border-2 border-emerald-500/40 shadow-lg rounded-3xl overflow-hidden space-y-6 p-5 sm:p-7">
          <div className="space-y-1 border-b pb-4">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Scissors className="w-5 h-5 text-emerald-500" />
              <span>2. Marcar Região da Legenda & Opções de Limpeza</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Ajuste onde a legenda está localizada no vídeo e escolha o modo de remoção desejado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visualizador do Vídeo com Máscara Interativa */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-muted-foreground block">
                Pré-visualização da Região Marcada:
              </span>

              <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[460px] border border-muted">
                <video
                  ref={videoPreviewRef}
                  src={previewUrl}
                  controls
                  playsInline
                  className="max-h-[460px] w-auto mx-auto object-contain block"
                />

                {/* Camada sobreposta mostrando a região selecionada */}
                <div
                  className="absolute pointer-events-none border-2 border-dashed border-pink-500 bg-pink-500/20 backdrop-blur-[2px] transition-all rounded-md flex items-center justify-center"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    width: `${region.width}%`,
                    height: `${region.height}%`,
                  }}
                >
                  <span className="text-[10px] bg-pink-600 text-white font-bold px-1.5 py-0.5 rounded shadow">
                    Área da Legenda
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Posição rápida:
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetRegion('bottom')}
                  className="h-7 text-[11px] rounded-lg"
                >
                  Inferior (Padrão TikTok)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetRegion('center')}
                  className="h-7 text-[11px] rounded-lg"
                >
                  Centro da Tela
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetRegion('top')}
                  className="h-7 text-[11px] rounded-lg"
                >
                  Superior
                </Button>
              </div>
            </div>

            {/* Configurações de Modo e Controles Finos */}
            <div className="space-y-5">
              {/* Modo de Processamento */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase text-muted-foreground">
                  Método de Remoção da Legenda
                </Label>
                <RadioGroup
                  value={mode}
                  onValueChange={(val) => setMode(val as ProcessingMode)}
                  className="space-y-2"
                >
                  <div
                    onClick={() => setMode('blur')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      mode === 'blur'
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-muted hover:border-emerald-500/30'
                    }`}
                  >
                    <RadioGroupItem value="blur" id="mode-blur" className="mt-0.5" />
                    <div className="space-y-0.5">
                      <label
                        htmlFor="mode-blur"
                        className="text-xs font-bold text-foreground cursor-pointer block"
                      >
                        Desfoque Suave (Recomendado)
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Aplica um desfoque óptico na área marcada. Mantém 100% da resolução e
                        proporção original (9:16).
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setMode('cover')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      mode === 'cover'
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-muted hover:border-emerald-500/30'
                    }`}
                  >
                    <RadioGroupItem value="cover" id="mode-cover" className="mt-0.5" />
                    <div className="space-y-0.5">
                      <label
                        htmlFor="mode-cover"
                        className="text-xs font-bold text-foreground cursor-pointer block"
                      >
                        Tarja Neutra de Cobertura
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Cobre o texto com uma barra semi-transparente elegante, ideal para sobrepor
                        novas legendas.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setMode('crop')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      mode === 'crop'
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-muted hover:border-emerald-500/30'
                    }`}
                  >
                    <RadioGroupItem value="crop" id="mode-crop" className="mt-0.5" />
                    <div className="space-y-0.5">
                      <label
                        htmlFor="mode-crop"
                        className="text-xs font-bold text-foreground cursor-pointer block"
                      >
                        Recorte de Enquadramento (Crop)
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Corta a faixa inferior ou superior onde a legenda reside, eliminando-a
                        fisicamente.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Ajuste Fino da Região */}
              <div className="space-y-3 p-4 rounded-2xl bg-muted/20 border">
                <span className="text-xs font-bold text-foreground block">
                  Ajuste Fino da Área (% da tela)
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Posição Vertical (Y)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={85}
                      value={region.y}
                      onChange={(e) => setRegion({ ...region, y: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-500"
                    />
                    <span className="text-[10px] text-muted-foreground font-mono">{region.y}%</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Altura da Faixa (H)
                    </label>
                    <input
                      type="range"
                      min={8}
                      max={45}
                      value={region.height}
                      onChange={(e) =>
                        setRegion({ ...region, height: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-emerald-500"
                    />
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {region.height}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Aviso Transparente Obrigatório */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Aviso de Qualidade e Limitações Físicas:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  A remoção de legendas por desfoque ou cobertura atenua textos sobrepostos mas pode
                  deixar pequenas imperfeições visuais na região tratada. O áudio original e o
                  formato MP4 são preservados intactos.
                </p>
              </div>

              {/* Botão de Disparo */}
              <div className="pt-2">
                <Button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessVideo}
                  className="w-full min-h-[48px] h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-500/20 gap-2 transition-all active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando Vídeo no Navegador...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>PROCESSAR VÍDEO</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Barra de Progresso */}
              {isProcessing && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                    <span>{progressStatus || 'Codificando...'}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Card 3: Resultado & Download do Vídeo Limpo */}
      {processedUrl && (
        <Card className="border-2 border-emerald-500/60 bg-card rounded-3xl shadow-xl space-y-5 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Vídeo Processado com Sucesso!
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Arquivo final:{' '}
                <span className="font-bold text-foreground">{processedFileName}</span> • Áudio e
                proporção mantidos.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleDownload}
              className="h-11 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold rounded-2xl gap-2 shadow-md shadow-emerald-500/20 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR VÍDEO MP4</span>
            </Button>
          </div>

          {/* Player do Vídeo Limpo */}
          <div className="rounded-2xl overflow-hidden bg-black/90 flex items-center justify-center max-h-[460px] border border-muted">
            <video
              src={processedUrl}
              controls
              playsInline
              className="max-h-[460px] w-auto mx-auto object-contain block"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Tudo pronto! Você já pode publicar ou reutilizar seu vídeo no TikTok Shop, Shopee ou
              Reels.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Outro Vídeo</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Conformidade Legal e Diretrizes Obrigatórias */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-muted/20 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <ShieldAlert className="w-4 h-4 text-emerald-500" />
          <span>Diretrizes de Uso & Conformidade Legal:</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Esta ferramenta foi desenvolvida para criadores que necessitam limpar textos e legendas de
          vídeos de sua própria autoria ou devidamente autorizados. É terminantemente proibido
          utilizar este recurso para remover marcas-d'água de autoria de terceiros, identificações
          de criadores originais ou para contornar mecanismos de proteção das plataformas.
        </p>
      </div>
    </div>
  )
}
export default VideoCleaner
