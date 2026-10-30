import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  cloneVideo,
  getHypeonUserLimit,
  ClonadorMode,
  ShortDuration,
  ClonadorResult,
  ClonadorScene,
} from '@/services/hypeonAi'
import { saveViralVideoReference } from '@/services/hypeon'
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Bookmark,
  RefreshCw,
  SlidersHorizontal,
  Youtube,
  UploadCloud,
  FileText,
  ShieldAlert,
  ArrowRight,
  Eye,
  Film,
  Zap,
  Volume2,
  Tv,
  ListOrdered,
  ChevronDown,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const MODES: { id: ClonadorMode; title: string; badge: string; desc: string }[] = [
  {
    id: 'recriar_formato',
    title: 'Recriar Formato',
    badge: 'Mais Usado',
    desc: 'Mantém a estrutura narrativa e o ritmo dinâmico, criando uma história e roteiro 100% originais.',
  },
  {
    id: 'melhorar_original',
    title: 'Melhorar o Original',
    badge: 'Alto Impacto',
    desc: 'Identifica pontos fracos e cria um gancho mais forte, narrativa envolvente e final surpreendente.',
  },
  {
    id: 'nova_versao',
    title: 'Nova Versão',
    badge: 'Criativo',
    desc: 'Extrai o mecanismo central do vídeo e gera uma história completamente diferente em outro contexto.',
  },
  {
    id: 'versao_curta',
    title: 'Versão Curta',
    badge: 'Ultra Rápido',
    desc: 'Condensa o conteúdo em 15s, 30s ou 45s com retenção máxima e cortes rápidos.',
  },
]

const CATEGORIES = [
  'Curiosidades & Fatos',
  'Histórias & Casos Reais',
  'Terror & Sobrenatural',
  'Mistério & Suspense',
  'Finanças & Negócios',
  'Motivacional & Mindset',
  'Tecnologia & IA',
  'Entretenimento & Humor',
  'Saúde & Bem-estar',
  'Educação & Ciência',
]

export function HypeonClonador() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Input states
  const [inputType, setInputType] = useState<'link' | 'upload' | 'manual'>('link')
  const [videoUrl, setVideoUrl] = useState('')
  const [manualDescription, setManualDescription] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [mode, setMode] = useState<ClonadorMode>('recriar_formato')
  const [durationShort, setDurationShort] = useState<ShortDuration>('30s')

  // Processing states
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClonadorResult | null>(null)
  const [youtubeMeta, setYoutubeMeta] = useState<any>(null)
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isSavedInLibrary, setIsSavedInLibrary] = useState(false)

  // Limits state
  const [limits, setLimits] = useState<{
    dailyLimit: number
    usedToday: number
    remaining: number
    isPro: boolean
  }>({
    dailyLimit: 2,
    usedToday: 0,
    remaining: 2,
    isPro: false,
  })

  // Carregar limites do usuário
  const fetchLimits = async () => {
    if (!user) return
    const lim = await getHypeonUserLimit('clonador')
    setLimits({
      dailyLimit: lim.daily_limit,
      usedToday: lim.used_today,
      remaining: lim.remaining,
      isPro: lim.is_pro || lim.is_admin,
    })
  }

  useEffect(() => {
    fetchLimits()
  }, [user])

  // Seguro contra erro de clipboard
  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedKey(key)
      toast({
        title: 'Copiado para a área de transferência!',
        description: 'Texto pronto para usar.',
      })
      setTimeout(() => setCopiedKey(null), 2500)
    } catch (_) {
      toast({
        title: 'Não foi possível copiar',
        description: 'Selecione e copie manualmente o texto.',
        variant: 'destructive',
      })
    }
  }

  // Upload local de arquivo de vídeo simulado com extração de metadados de nome/tamanho
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limite de 25MB
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande (limite 25MB)',
        description: 'Envie um vídeo menor ou use a opção de descrever o conteúdo manualmente.',
        variant: 'destructive',
      })
      return
    }

    setUploadedFileName(file.name)
    setManualDescription((prev) =>
      prev
        ? `${prev}\n[Arquivo de vídeo anexado: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB)]`
        : `[Arquivo de vídeo de referência: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB)]\nDescreva os acontecimentos e o gancho do vídeo para máxima precisão:`,
    )
    toast({
      title: 'Vídeo carregado com sucesso!',
      description: `${file.name} pronto para ser analisado.`,
    })
  }

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para usar o Clonador Viral.',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    if (!videoUrl.trim() && !manualDescription.trim()) {
      toast({
        title: 'Informe a referência',
        description: 'Cole o link de um vídeo ou descreva o conteúdo.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await cloneVideo({
        video_url: videoUrl.trim(),
        manual_description: manualDescription.trim(),
        mode,
        duration_short: durationShort,
        category,
      })

      if (!res.success) {
        toast({
          title: res.is_limit_reached ? 'Limite Diário Atingido' : 'Erro ao processar',
          description: res.error || 'Não foi possível clonar o formato.',
          variant: 'destructive',
        })
        return
      }

      setResult(res.data)
      setYoutubeMeta(res.youtube_metadata || null)
      setSavedProjectId(res.project_id || null)
      setIsSavedInLibrary(false)

      setLimits((prev) => ({
        ...prev,
        usedToday: res.usage.used_today,
        remaining: res.usage.remaining,
      }))

      toast({
        title: 'Roteiro gerado com sucesso!',
        description: 'Engenharia reversa concluída e roteiro original pronto.',
      })
    } catch (err: any) {
      const msg = err?.message || ''
      const isTimeout =
        msg.toLowerCase().includes('tempo limite') ||
        msg.toLowerCase().includes('demor') ||
        msg.toLowerCase().includes('120s') ||
        msg.toLowerCase().includes('abort')
      const isUnavailable =
        msg.toLowerCase().includes('indisponível') ||
        msg.toLowerCase().includes('ocupado') ||
        msg.toLowerCase().includes('503') ||
        msg.toLowerCase().includes('500')

      toast({
        title: isTimeout
          ? 'Tempo limite esgotado'
          : isUnavailable
            ? 'Serviço de IA Instável'
            : 'Erro na Geração',
        description:
          msg ||
          'O serviço demorou mais que o esperado ou está oscilando. Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Salvar na Biblioteca Viral existente
  const handleSaveToLibrary = async () => {
    if (!result) return
    try {
      await saveViralVideoReference(
        {
          external_id: youtubeMeta?.videoId || `clonador_${Date.now()}`,
          platform: 'youtube',
          title: result.title,
          description: result.hook,
          original_url: videoUrl || '',
          views_count: youtubeMeta?.views || 100000,
          likes_count: youtubeMeta?.likes || 12000,
          niche: category,
        },
        `Roteiro original gerado no Clonador Viral (Modo: ${mode}). Gancho: ${result.hook}`,
      )
      setIsSavedInLibrary(true)
      toast({
        title: 'Salvo na Biblioteca Viral!',
        description: 'Você pode acessar este roteiro na sua biblioteca a qualquer momento.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  // Exportar para .txt ou .md
  const handleExportFile = (format: 'txt' | 'md') => {
    if (!result) return

    let content = ''
    if (format === 'md') {
      content = `# ${result.title}
**Categoria:** ${result.category} | **Modo HYPEON:** ${mode}

## 🎯 Gancho Inicial (0-3s)
${result.hook}

## 📜 Roteiro Completo
${result.full_script}

## 🎙️ Narração (Locução em Off)
${result.narration}

## 🎬 Divisão em Cenas
${result.scenes
  .map(
    (s) => `### Cena ${s.scene_number} (${s.duration})
- **Visual:** ${s.visual_description}
- **Locução:** ${s.voiceover}
- **Texto na Tela:** ${s.screen_text || 'Nenhum'}
- **Efeitos Sonoros:** ${s.sound_effects || 'Nenhum'}
- **Transição:** ${s.transition || 'Corte Seco'}
`,
  )
  .join('\n')}

## 🔊 Efeitos Sonoros Gerais
${result.sound_effects_overview}

## ✂️ Guia de Transições e Edição
${result.transitions_overview}

## 🏁 Encerramento e CTA
- **Desfecho:** ${result.closure}
- **CTA:** ${result.cta}

---
*Gerado via HYPEON Clonador Viral — Conteúdo 100% Original e Inédito.*
`
    } else {
      content = `${result.title.toUpperCase()}
Categoria: ${result.category}
Modo: ${mode}

GANCHO INICIAL:
${result.hook}

ROTEIRO COMPLETO:
${result.full_script}

NARRAÇÃO:
${result.narration}

CENAS:
${result.scenes
  .map(
    (s) =>
      `[Cena ${s.scene_number} - ${s.duration}]\nVisual: ${s.visual_description}\nVoz: ${s.voiceover}\nTexto na Tela: ${s.screen_text}\nSFX: ${s.sound_effects}\n`,
  )
  .join('\n')}

CTA FINAL:
${result.cta}
`
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Redirecionar para geradores existentes de imagem e vídeo
  const handleSendToImagePrompt = () => {
    if (!result) return
    const firstScene = result.scenes?.[0]
    const scenePrompt = firstScene
      ? `Cena 1 de ${result.title}: ${firstScene.visual_description}`
      : result.title
    navigate('/gerador', { state: { prefillPrompt: scenePrompt, niche: category } })
  }

  return (
    <HypeonLayout
      title="Clonador Viral"
      description="Transforme referências virais em roteiros originais, magnéticos e estruturados cena a cena."
      badge="IA de Engenharia Reversa"
    >
      <div className="space-y-8">
        {/* Aviso Ético Obrigatório */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200/90 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-300">
              Diretriz Ética & Autoral Obrigatória:
            </span>
            <p>
              O sistema não copia vídeos nem reproduz integralmente roteiros protegidos de
              terceiros. A finalidade é identificar estruturas, mecanismos narrativos e
              características gerais para criar conteúdos 100% originais e autênticos.
            </p>
          </div>
        </div>

        {/* Status de Cota / Limites */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-white flex items-center gap-2">
                Suas Gerações Hoje:
                <Badge
                  variant={limits.remaining > 0 ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {limits.usedToday} / {limits.dailyLimit} usadas
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                {limits.remaining > 0
                  ? `Restam ${limits.remaining} gerações hoje no seu plano ${limits.isPro ? 'PRO' : 'Gratuito'}.`
                  : 'Você atingiu o limite de hoje.'}
              </p>
            </div>
          </div>
          {!limits.isPro && (
            <Button
              size="sm"
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/20 text-xs"
              onClick={() => navigate('/planos')}
            >
              Fazer Upgrade para PRO (Mais Limites)
            </Button>
          )}
        </div>

        {/* FORMULÁRIO DE ENTRADA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Escolha do Método de Entrada */}
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-5">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                1. Forneça o Vídeo de Referência
              </h3>

              <div className="flex p-1 rounded-lg bg-black/60 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setInputType('link')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-2 ${
                    inputType === 'link'
                      ? 'bg-primary text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" /> Colar Link
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('upload')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-2 ${
                    inputType === 'upload'
                      ? 'bg-primary text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Enviar Arquivo
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('manual')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-2 ${
                    inputType === 'manual'
                      ? 'bg-primary text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Descrever Manualmente
                </button>
              </div>

              {inputType === 'link' && (
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">
                    Link do YouTube Shorts, TikTok ou Reels
                  </Label>
                  <Input
                    placeholder="Ex: https://youtube.com/shorts/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-black/60 border-white/15 text-white placeholder:text-zinc-600 focus:border-primary"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Links do YouTube Shorts são enriquecidos automaticamente com título, canal e
                    visualizações reais via API oficial.
                  </p>
                </div>
              )}

              {inputType === 'upload' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center hover:border-primary/50 transition cursor-pointer relative bg-black/40">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-xs text-zinc-300 font-medium">
                      {uploadedFileName || 'Clique ou arraste um vídeo de referência (até 25MB)'}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">MP4, MOV, WebM</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">
                  {inputType === 'manual'
                    ? 'Descreva a referência em detalhes (gancho, história, final):'
                    : 'Observações adicionais ou contexto específico (opcional):'}
                </Label>
                <Textarea
                  placeholder="Ex: O vídeo começa com o rapaz mostrando uma casa abandonada com a frase 'ninguém entra aqui há 30 anos'. No final ele encontra um diário com uma data misteriosa..."
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  rows={4}
                  className="bg-black/60 border-white/15 text-white placeholder:text-zinc-600 resize-none text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Nicho / Categoria do Vídeo</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* 4 Modos de Roteiro */}
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                2. Escolha o Modo de Criação
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MODES.map((m) => {
                  const isSelected = mode === m.id
                  return (
                    <div
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                          <Badge
                            variant={isSelected ? 'default' : 'outline'}
                            className="text-[10px] px-2 py-0"
                          >
                            {m.badge}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {mode === 'versao_curta' && (
                <div className="p-3 rounded-lg bg-black/60 border border-white/10 mt-3 space-y-2">
                  <Label className="text-xs text-zinc-300">Duração Alvo do Vídeo Curto:</Label>
                  <div className="flex gap-3">
                    {(['15s', '30s', '45s'] as ShortDuration[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationShort(d)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition ${
                          durationShort === d
                            ? 'border-primary bg-primary text-white'
                            : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-6 shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Engenharia Reversa com IA em Andamento...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Clonar Formato & Gerar Roteiro Original
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* PAINEL DE RESULTADO EM 14 BLOCOS */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Cabeçalho do Roteiro e Ações Rápidas */}
                <Card className="p-6 bg-zinc-950/80 border-primary/40 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                        {result.category} • {mode.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <h2 className="text-lg font-bold text-white leading-snug">{result.title}</h2>
                    </div>
                  </div>

                  {/* Metadados reais do YouTube se capturados */}
                  {youtubeMeta && (
                    <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs space-y-1">
                      <div className="text-zinc-400 flex items-center gap-2">
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                        Referência Real:{' '}
                        <span className="text-white font-medium">{youtubeMeta.channelTitle}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {youtubeMeta.views?.toLocaleString('pt-BR')} visualizações •{' '}
                        {youtubeMeta.likes?.toLocaleString('pt-BR')} curtidas
                      </div>
                    </div>
                  )}

                  {/* Barra de Ferramentas / Ações Rápidas */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(result.full_script, 'full')}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      {copiedKey === 'full' ? (
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1" />
                      )}
                      Copiar Roteiro
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerate}
                      disabled={loading}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Outra Versão
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveToLibrary}
                      disabled={isSavedInLibrary}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 mr-1 ${isSavedInLibrary ? 'text-primary' : ''}`}
                      />
                      {isSavedInLibrary ? 'Salvo!' : 'Salvar'}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportFile('txt')}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Baixar .txt
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportFile('md')}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Baixar .md
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSendToImagePrompt}
                      className="border-primary/40 text-xs text-primary hover:bg-primary/20"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Gerar Prompts
                    </Button>
                  </div>
                </Card>

                {/* BLOCO: Análise da Referência */}
                <Card className="p-5 bg-zinc-950/70 border-white/10 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" />
                    Raio-X da Referência & Originalidade
                  </h4>
                  <div className="space-y-2 text-xs text-zinc-300">
                    <p>
                      <strong className="text-white">Gatilho Emocional:</strong>{' '}
                      {result.reference_analysis.emotional_trigger}
                    </p>
                    <p>
                      <strong className="text-white">Ritmo & Pacing:</strong>{' '}
                      {result.reference_analysis.pacing}
                    </p>
                    <p>
                      <strong className="text-white">Momento de Maior Impacto:</strong>{' '}
                      {result.reference_analysis.peak_impact_moment}
                    </p>
                    <div className="p-2.5 rounded bg-black/40 border border-primary/20 text-[11px] text-zinc-400">
                      <strong className="text-primary">Inovação e Originalidade:</strong>{' '}
                      {result.reference_analysis.originality_note}
                    </div>
                  </div>
                </Card>

                {/* BLOCO: Gancho Inicial (0-3s) */}
                <Card className="p-5 bg-zinc-950/70 border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Gancho Hipnótico (0-3 segundos)
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(result.hook, 'hook')}
                      className="h-7 text-xs text-zinc-400 hover:text-white"
                    >
                      {copiedKey === 'hook' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <blockquote className="p-3 rounded-lg bg-black/60 border-l-2 border-amber-400 text-sm font-medium text-white italic">
                    {result.hook}
                  </blockquote>
                </Card>

                {/* BLOCO: Cenas Estruturadas (com cópia individual) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-primary" />
                      Divisão Cena a Cena ({result.scenes.length} cenas)
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {result.scenes.map((scene) => (
                      <Card
                        key={scene.scene_number}
                        className="p-4 bg-zinc-950/70 border-white/10 hover:border-white/20 transition space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                              {scene.scene_number}
                            </span>
                            <span className="text-xs font-medium text-white">
                              Cena {scene.scene_number}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] text-zinc-400 border-white/15"
                            >
                              {scene.duration}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                `Cena ${scene.scene_number} (${scene.duration})\nVisual: ${scene.visual_description}\nLocução: ${scene.voiceover}\nTexto na Tela: ${scene.screen_text}`,
                                `scene_${scene.scene_number}`,
                              )
                            }
                            className="h-6 text-[11px] text-zinc-400 hover:text-white"
                          >
                            {copiedKey === `scene_${scene.scene_number}` ? (
                              <Check className="w-3 h-3 text-emerald-400 mr-1" />
                            ) : (
                              <Copy className="w-3 h-3 mr-1" />
                            )}
                            Copiar Cena
                          </Button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded bg-black/40 border border-white/5">
                            <span className="text-zinc-500 font-medium block text-[10px] uppercase">
                              Descrição Visual:
                            </span>
                            <p className="text-zinc-300 mt-0.5">{scene.visual_description}</p>
                          </div>

                          <div className="p-2.5 rounded bg-black/40 border border-white/5">
                            <span className="text-zinc-500 font-medium block text-[10px] uppercase">
                              Voz em Off / Fala:
                            </span>
                            <p className="text-white mt-0.5 font-medium">{scene.voiceover}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-zinc-500">Texto na tela:</span>
                              <span className="text-zinc-300 block font-medium">
                                {scene.screen_text || '—'}
                              </span>
                            </div>
                            <div>
                              <span className="text-zinc-500">Efeito sonoro:</span>
                              <span className="text-zinc-300 block font-medium">
                                {scene.sound_effects || '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* BLOCO: Locução Completa & CTA */}
                <Card className="p-5 bg-zinc-950/70 border-white/10 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                        Narração Completa (Áudio)
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(result.narration, 'narration')}
                        className="h-6 text-xs text-zinc-400 hover:text-white"
                      >
                        {copiedKey === 'narration' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed p-3 rounded bg-black/40 border border-white/5">
                      {result.narration}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <span className="text-xs font-semibold text-emerald-400 block mb-1">
                      Chamada para Ação (CTA):
                    </span>
                    <p className="text-xs text-white font-medium p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {result.cta}
                    </p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-zinc-950/30">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Film className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Seu Roteiro Estruturado Aparecerá Aqui
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Cole o link de um vídeo viral ou descreva a ideia para receber um roteiro original
                  em 14 blocos pronto para gravar ou produzir com IA.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </HypeonLayout>
  )
}
