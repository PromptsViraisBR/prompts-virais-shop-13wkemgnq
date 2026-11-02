import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import {
  Languages,
  UploadCloud,
  FileText,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Link2,
  AlertCircle,
  CheckCircle2,
  Volume2,
  Video,
  ArrowLeft,
  Info,
  Clock,
  Loader2,
} from 'lucide-react'
import {
  transcribeAndTranslateMedia,
  SUPPORTED_LANGUAGES,
  SOURCE_LANGUAGES,
  TranscribeMediaResponse,
} from '@/services/viralTranscriber'
import { VideoDownloadGuideCard } from '@/components/VideoDownloadGuideCard'

export const VideoTranscriber: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  // Estados de entrada
  const [videoLink, setVideoLink] = useState('')
  const [linkNotice, setLinkNotice] = useState<string | null>(null)
  const [showGuideCard, setShowGuideCard] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<
    'tiktok' | 'instagram' | 'facebook' | 'generic'
  >('generic')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('Português Brasileiro')

  // Estados de processamento
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStep, setProcessStep] = useState<string>('')
  const [result, setResult] = useState<TranscribeMediaResponse | null>(null)

  // Campos editáveis pós-transcrição
  const [editableOriginal, setEditableOriginal] = useState('')
  const [editableTranslated, setEditableTranslated] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadSectionRef = useRef<HTMLDivElement>(null)

  // Rolar e focar no campo de upload
  const handleFocusUpload = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // Abre seletor nativo de arquivo
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 350)
  }

  // Tratamento de link inserido
  const handleLinkCheck = () => {
    const trimmed = videoLink.trim()
    if (!trimmed) {
      toast({
        title: 'Insira um link',
        description: 'Cole o link de um vídeo para verificar a compatibilidade.',
        variant: 'destructive',
      })
      return
    }

    const lower = trimmed.toLowerCase()
    let detected: 'tiktok' | 'instagram' | 'facebook' | 'generic' = 'generic'
    if (lower.includes('tiktok.com')) {
      detected = 'tiktok'
    } else if (lower.includes('instagram.com')) {
      detected = 'instagram'
    } else if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
      detected = 'facebook'
    }

    setDetectedPlatform(detected)
    setShowGuideCard(true)

    if (
      lower.includes('tiktok.com') ||
      lower.includes('instagram.com') ||
      lower.includes('facebook.com') ||
      lower.includes('fb.watch')
    ) {
      setLinkNotice(
        'As plataformas TikTok, Instagram e Facebook bloqueiam o download direto via link sem autenticação oficial paga. Para garantir 100% de precisão e sem custos extras, salve o vídeo pelo app da rede e envie o arquivo abaixo.',
      )
    } else if (lower.endsWith('.mp4') || lower.endsWith('.mp3') || lower.endsWith('.wav')) {
      setLinkNotice(
        'Link direto detectado. Para garantir estabilidade sem bloqueios de CORS, salve o arquivo e envie no campo abaixo.',
      )
    } else {
      setLinkNotice(
        'Esta fonte não possui API pública gratuita para extração direta de áudio. Por favor, salve o arquivo no seu dispositivo e envie abaixo.',
      )
    }
  }

  // Tratamento de arquivo local selecionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limite honesto de tamanho: 25 MB
    const maxBytes = 25 * 1024 * 1024
    if (file.size > maxBytes) {
      toast({
        title: 'Arquivo muito grande',
        description: `O arquivo tem ${(file.size / (1024 * 1024)).toFixed(1)}MB. O limite para transcrição rápida por IA é 25MB. Sugestão: envie apenas a faixa de áudio em MP3.`,
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
    setResult(null)
    setLinkNotice(null)
    setShowGuideCard(false)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    toast({
      title: 'Arquivo selecionado!',
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
    })
  }

  // Conversão para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const res = reader.result as string
        resolve(res)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  // Ação de Transcrever
  const handleTranscribe = async () => {
    if (!user) {
      toast({
        title: 'Faça login para transcrever',
        description: 'Entre na sua conta para utilizar o Transcritor & Tradutor Viral.',
        variant: 'destructive',
      })
      return
    }

    if (!selectedFile) {
      toast({
        title: 'Nenhum arquivo anexado',
        description: 'Envie um arquivo de vídeo ou áudio do seu computador ou celular.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    setProcessStep('Preparando arquivo e codificando áudio...')

    // Timeout de segurança após 110 segundos (mesmo padrão do PV)
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false)
        toast({
          title: 'Tempo limite excedido',
          description:
            'A IA demorou mais que o esperado para responder. Tente com um arquivo de áudio menor ou mais curto.',
          variant: 'destructive',
        })
      }
    }, 115000)

    try {
      setProcessStep('Enviando mídia para o gateway de IA Gemini...')
      const b64 = await fileToBase64(selectedFile)

      setProcessStep('Identificando idioma original e transcrevendo falas...')
      const res = await transcribeAndTranslateMedia({
        mediaBase64: b64,
        mimeType: selectedFile.type || 'audio/mp3',
        sourceLang: sourceLang,
        targetLang: targetLang,
        mediaName: selectedFile.name,
      })

      clearTimeout(timeoutId)
      setResult(res)
      setEditableOriginal(res.original_transcription || '')
      setEditableTranslated(res.translated_transcription || '')

      toast({
        title: 'Transcrição concluída com sucesso!',
        description: `Idioma detectado: ${res.detected_language}. Tradução pronta para ${res.target_lang}.`,
      })
    } catch (err: any) {
      clearTimeout(timeoutId)
      console.error('[Transcritor] Erro:', err)
      const errorMsg =
        err?.data?.error ||
        err?.message ||
        'Não foi possível concluir a transcrição. Verifique o áudio e tente novamente.'
      toast({
        title: 'Erro na transcrição',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
      setProcessStep('')
    }
  }

  // Copiar Original
  const handleCopyOriginal = async () => {
    try {
      await navigator.clipboard.writeText(editableOriginal)
      toast({
        title: 'Copiado!',
        description: 'Transcrição original copiada para a área de transferência.',
      })
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Copie manualmente selecionando o texto.',
        variant: 'destructive',
      })
    }
  }

  // Copiar Tradução
  const handleCopyTranslated = async () => {
    try {
      await navigator.clipboard.writeText(editableTranslated)
      toast({
        title: 'Copiado!',
        description: 'Tradução copiada para a área de transferência.',
      })
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Copie manualmente selecionando o texto.',
        variant: 'destructive',
      })
    }
  }

  // Baixar em TXT com ambos os blocos
  const handleDownloadTxt = () => {
    const content = `=====================================================
PROMPTS VIRAIS — TRANSCRITOR & TRADUTOR DE VÍDEOS
Arquivo: ${selectedFile?.name || 'video_transcricao'}
Idioma Detectado: ${result?.detected_language || 'Automático'}
Idioma de Tradução: ${result?.target_lang || targetLang}
Data: ${new Date().toLocaleString('pt-BR')}
=====================================================

--- TRANSCRIÇÃO ORIGINAL (${result?.detected_language || 'ORIGINAL'}) ---
${editableOriginal}

-----------------------------------------------------

--- TRADUÇÃO (${result?.target_lang || targetLang}) ---
${editableTranslated}

=====================================================
Gerado por Prompts Virais (https://promptsvirais.com.br)
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcricao_${(selectedFile?.name || 'video').replace(/\.[^/.]+$/, '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Arquivo TXT baixado!',
      description: 'O relatório completo com transcrição e tradução foi salvo.',
    })
  }

  // Nova Transcrição
  const handleReset = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setResult(null)
    setEditableOriginal('')
    setEditableTranslated('')
    setVideoLink('')
    setLinkNotice(null)
    setShowGuideCard(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Navegação de volta */}
      <div className="flex items-center justify-between">
        <Link
          to="/ferramentas"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Ferramentas Virais</span>
        </Link>
        <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30 text-xs font-bold">
          IA Gemini Ativa
        </Badge>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold uppercase tracking-wider">
          <Languages className="w-3.5 h-3.5" />
          <span>Ferramenta 1 • Prompts Virais</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
          Transcritor & Tradutor de Vídeos
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Extraia toda a narração falada de qualquer vídeo em texto editável — mesmo em outros
          idiomas — com tradução coloquial e natural em Português, ideal para gravar uma nova
          narração de alta conversão.
        </p>
      </div>

      {/* Card Principal: Importação e Configuração */}
      <Card className="border-2 border-border/80 shadow-md rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-pink-500" />
            <span>1. Envie o Vídeo ou Áudio</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Compatível com MP4, WebM, MP3, WAV, M4A ou OGG de até 25 MB.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Opção 1: Link do Vídeo com checagem honesta */}
          <div className="space-y-2">
            <Label
              htmlFor="video_link"
              className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5 text-pink-500" />
              <span>Link de Vídeo (Opcional)</span>
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="video_link"
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
                className="h-11 px-4 rounded-xl text-xs font-bold border-pink-500/30 hover:bg-pink-500/10 shrink-0"
              >
                Verificar Link
              </Button>
            </div>

            {linkNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{linkNotice}</p>
                  <p className="text-[11px] opacity-80">
                    Confira o guia abaixo com o passo a passo oficial de como salvar o vídeo para
                    enviar aqui.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card de Orientação útil para obter o vídeo */}
          {showGuideCard && (
            <VideoDownloadGuideCard
              detectedPlatform={detectedPlatform}
              onUploadClick={handleFocusUpload}
              toolName="Transcritor de Vídeos"
            />
          )}

          {/* Divisor */}
          <div className="relative flex items-center justify-center" ref={uploadSectionRef}>
            <div className="border-t w-full" />
            <span className="bg-card px-3 text-[11px] font-bold text-muted-foreground uppercase">
              OU ENVIE O ARQUIVO DIRETO
            </span>
          </div>

          {/* Opção 2: Upload direto do dispositivo */}
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/ogg"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
            />

            {!selectedFile ? (
              <label
                htmlFor="file-upload-input"
                className="border-2 border-dashed border-pink-500/40 hover:border-pink-500/70 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-pink-500/[0.02] hover:bg-pink-500/[0.06] transition-all space-y-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-foreground">
                    Clique para selecionar um arquivo de vídeo ou áudio
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: MP4, WebM, MP3, WAV, M4A (até 25 MB)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-pink-500/40 text-pink-600 dark:text-pink-300 font-bold text-xs pointer-events-none"
                >
                  Procurar no Computador ou Celular
                </Button>
              </label>
            ) : (
              <div className="p-4 rounded-2xl border bg-muted/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                      {selectedFile.type.startsWith('video/') ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                        {selectedFile.type || 'Mídia'}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      if (previewUrl) URL.revokeObjectURL(previewUrl)
                      setPreviewUrl(null)
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive h-8 px-2.5 rounded-lg shrink-0"
                  >
                    Trocar Arquivo
                  </Button>
                </div>

                {/* Preview de vídeo ou áudio */}
                {previewUrl && (
                  <div className="rounded-xl overflow-hidden bg-black/80 flex items-center justify-center max-h-64">
                    {selectedFile.type.startsWith('video/') ? (
                      <video src={previewUrl} controls className="max-h-64 max-w-full rounded-xl" />
                    ) : (
                      <div className="w-full p-4 flex flex-col items-center gap-2">
                        <Volume2 className="w-8 h-8 text-pink-400" />
                        <audio src={previewUrl} controls className="w-full max-w-md" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Configuração de Idiomas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">
                Idioma Original do Vídeo
              </Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="h-11 rounded-xl text-xs sm:text-sm">
                  <SelectValue placeholder="Selecione o idioma original" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-xs">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Deixe em "Detecção Automática" para a IA identificar o idioma falado.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">
                Idioma de Tradução Desejado
              </Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="h-11 rounded-xl text-xs sm:text-sm">
                  <SelectValue placeholder="Selecione o idioma de tradução" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.label} className="text-xs">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Gera um roteiro pronto para nova locução em Português ou outro idioma.
              </p>
            </div>
          </div>

          {/* Botão de Disparo */}
          <div className="pt-2">
            <Button
              type="button"
              disabled={!selectedFile || isProcessing}
              onClick={handleTranscribe}
              className="w-full min-h-[48px] h-12 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-pink-500/20 gap-2 transition-all active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transcrevendo e Traduzindo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>TRANSCREVER VÍDEO COM IA</span>
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="mt-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-700 dark:text-pink-300 flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin shrink-0" />
                <span>{processStep || 'Processando áudio via IA...'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card de Resultados (quando concluído) */}
      {result && (
        <Card className="border-2 border-pink-500/40 bg-card rounded-3xl shadow-xl space-y-6 p-5 sm:p-7">
          {/* Topo do resultado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Transcrição Concluída
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Idioma Original Detectado:{' '}
                <span className="font-bold text-foreground">{result.detected_language}</span> •
                Destino:{' '}
                <span className="font-bold text-pink-600 dark:text-pink-400">
                  {result.target_lang}
                </span>
              </p>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTxt}
                className="h-9 rounded-xl text-xs font-bold gap-1.5 border-pink-500/40 text-pink-600 dark:text-pink-300 hover:bg-pink-500/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>BAIXAR TXT</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 rounded-xl text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>NOVA TRANSCRIÇÃO</span>
              </Button>
            </div>
          </div>

          {/* Grid com Blocos: Original vs Tradução */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Transcrição Original */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold uppercase tracking-wider"
                  >
                    Original
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    TRANSCRIÇÃO ORIGINAL — {result.detected_language.toUpperCase()}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyOriginal}
                  className="h-7 px-2.5 rounded-lg text-[11px] font-bold gap-1 border-muted"
                >
                  <Copy className="w-3 h-3" />
                  <span>COPIAR ORIGINAL</span>
                </Button>
              </div>

              <Textarea
                value={editableOriginal}
                onChange={(e) => setEditableOriginal(e.target.value)}
                rows={12}
                className="rounded-2xl text-xs sm:text-sm leading-relaxed font-sans bg-muted/20 border resize-y"
                placeholder="Texto da transcrição original..."
              />
              <p className="text-[11px] text-muted-foreground">
                Texto editável. Você pode ajustar palavras ou nomes próprios antes de copiar.
              </p>
            </div>

            {/* Bloco 2: Tradução Natural */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-gradient-to-r from-pink-600 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    Tradução
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    TRADUÇÃO — {result.target_lang.toUpperCase()}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyTranslated}
                  className="h-7 px-2.5 rounded-lg text-[11px] font-bold gap-1 border-pink-500/40 text-pink-600 dark:text-pink-300 hover:bg-pink-500/10"
                >
                  <Copy className="w-3 h-3" />
                  <span>COPIAR TRADUÇÃO</span>
                </Button>
              </div>

              <Textarea
                value={editableTranslated}
                onChange={(e) => setEditableTranslated(e.target.value)}
                rows={12}
                className="rounded-2xl text-xs sm:text-sm leading-relaxed font-sans bg-pink-500/[0.03] border-pink-500/30 resize-y focus:border-pink-500"
                placeholder="Texto traduzido para narração..."
              />
              <p className="text-[11px] text-muted-foreground">
                Tradução coloquial e fluida, pronta para gravação de uma nova voz no seu vídeo.
              </p>
            </div>
          </div>

          {/* Dica de Uso */}
          <div className="p-4 rounded-2xl bg-muted/30 border text-xs text-muted-foreground flex items-start gap-2.5">
            <Info className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Como usar no seu fluxo de criação viral:
              </p>
              <p>
                Copie a tradução em Português e use em geradores de voz por IA (ex: ElevenLabs,
                CapCut) ou grave a sua própria voz para recriar o vídeo viral com o seu produto ou
                estilo.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
export default VideoTranscriber
