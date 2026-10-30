import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { analyzeVideo, getHypeonUserLimit, VideoAnalysisResult } from '@/services/hypeonAi'
import {
  BarChart3,
  Sparkles,
  UploadCloud,
  Youtube,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const NICHES = [
  'Geral / Entretenimento',
  'Curiosidades & Fatos',
  'Histórias & Casos Reais',
  'Terror & Suspense',
  'Finanças & Negócios',
  'Desenvolvimento Pessoal',
  'Tecnologia & IA',
  'Saúde & Fitness',
]

const CRITERIA_LABELS: Record<string, { label: string; desc: string }> = {
  first_seconds: {
    label: 'Primeiros Segundos',
    desc: 'Capacidade imediata de interromper o scroll',
  },
  hook_strength: { label: 'Força do Gancho', desc: 'Promessa clara e gatilho de curiosidade' },
  message_clarity: {
    label: 'Clareza da Mensagem',
    desc: 'Facilidade de entendimento pelo espectador',
  },
  pacing: { label: 'Ritmo & Pacing', desc: 'Cadência de fala e velocidade de cortes' },
  curiosity_build: {
    label: 'Construção da Curiosidade',
    desc: 'Loops abertos para reter atenção contínua',
  },
  narrative: { label: 'Narrativa & Conexão', desc: 'Estrutura da história e impacto emocional' },
  retention_potential: {
    label: 'Potencial de Retenção',
    desc: 'Probabilidade estimada de assistir até o final',
  },
  closure_and_cta: { label: 'Encerramento & CTA', desc: 'Desfecho e chamada para ação assertiva' },
}

export function HypeonAnalisador() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Form states
  const [inputType, setInputType] = useState<'link' | 'upload' | 'text'>('link')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [niche, setNiche] = useState(NICHES[0])

  // Processing states
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null)
  const [youtubeMeta, setYoutubeMeta] = useState<any>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [limits, setLimits] = useState({
    dailyLimit: 2,
    usedToday: 0,
    remaining: 2,
    isPro: false,
  })

  const fetchLimits = async () => {
    if (!user) return
    const lim = await getHypeonUserLimit('analisador')
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande (limite 25MB)',
        description: 'Envie um vídeo menor ou use a opção de descrever o roteiro.',
        variant: 'destructive',
      })
      return
    }

    setUploadedFileName(file.name)
    setDescription(
      `[Vídeo anexado: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB)]\nDescreva a estrutura ou o roteiro falado do vídeo:`,
    )
    toast({
      title: 'Vídeo anexado!',
      description: 'Pronto para análise.',
    })
  }

  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para analisar vídeos.',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    if (!videoUrl.trim() && !description.trim()) {
      toast({
        title: 'Forneça o vídeo ou roteiro',
        description: 'Cole o link de um vídeo ou descreva o roteiro para análise.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await analyzeVideo({
        video_url: videoUrl.trim(),
        description: description.trim(),
        niche,
      })

      if (!res.success) {
        toast({
          title: res.is_limit_reached ? 'Limite Diário Atingido' : 'Erro ao analisar',
          description: res.error || 'Não foi possível analisar o vídeo.',
          variant: 'destructive',
        })
        return
      }

      setAnalysis(res.data)
      setYoutubeMeta(res.youtube_metadata || null)
      setLimits((prev) => ({
        ...prev,
        usedToday: res.usage.used_today,
        remaining: res.usage.remaining,
      }))

      toast({
        title: 'Diagnóstico concluído!',
        description: 'Notas de retenção e recomendações de melhoria prontas.',
      })
    } catch (err: any) {
      toast({
        title: 'Falha na conexão',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    return 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  return (
    <HypeonLayout
      title="Analisador de Vídeos"
      description="Raio-X de retenção, diagnóstico cirúrgico do gancho e notas de 0 a 100 por critério com recomendações práticas."
      badge="Diagnóstico de Retenção"
    >
      <div className="space-y-8">
        {/* Status de Cota */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-white flex items-center gap-2">
                Suas Análises Hoje:
                <Badge
                  variant={limits.remaining > 0 ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {limits.usedToday} / {limits.dailyLimit} usadas
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                {limits.remaining > 0
                  ? `Restam ${limits.remaining} análises hoje no seu plano ${limits.isPro ? 'PRO' : 'Gratuito'}.`
                  : 'Você atingiu o limite de análises hoje.'}
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
              Fazer Upgrade para PRO
            </Button>
          )}
        </div>

        {/* FORMULÁRIO DE ENTRADA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Submeter Vídeo para Diagnóstico
              </h3>

              {/* Seletor de Tipo */}
              <div className="flex p-1 rounded-lg bg-black/60 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setInputType('link')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-1.5 ${
                    inputType === 'link'
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" /> Link do Vídeo
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('upload')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-1.5 ${
                    inputType === 'upload'
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Upload (25MB)
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('text')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-1.5 ${
                    inputType === 'text'
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Texto / Roteiro
                </button>
              </div>

              {inputType === 'link' && (
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">
                    Link do YouTube Shorts, TikTok ou Reels
                  </Label>
                  <Input
                    placeholder="https://youtube.com/shorts/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-black/60 border-white/15 text-white text-xs"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Links do YouTube Shorts são enriquecidos com estatísticas reais (visualizações,
                    curtidas, canal).
                  </p>
                </div>
              )}

              {inputType === 'upload' && (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-white/15 rounded-xl p-5 text-center hover:border-blue-400/50 transition cursor-pointer relative bg-black/40">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-7 h-7 mx-auto text-blue-400 mb-2" />
                    <p className="text-xs text-zinc-300 font-medium">
                      {uploadedFileName || 'Clique ou arraste um vídeo (até 25MB)'}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">
                  {inputType === 'text'
                    ? 'Cole o roteiro completo ou transcrição do vídeo:'
                    : 'Roteiro falado ou observações extras (opcional, melhora a precisão):'}
                </Label>
                <Textarea
                  placeholder="Ex: Primeiros segundos: 'Você sabia que o Titanic nunca afundou?...'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-black/60 border-white/15 text-white placeholder:text-zinc-600 text-xs resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Nicho do Conteúdo</Label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-blue-600 to-primary hover:from-blue-700 hover:to-primary/90 text-white font-semibold py-6 shadow-xl shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Avaliando Retenção com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Iniciar Diagnóstico Completo
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* PAINEL DE NOTAS E DIAGNÓSTICO */}
          <div className="lg:col-span-7 space-y-6">
            {analysis ? (
              <div className="space-y-6 animate-fade-in">
                {/* Nota Geral & Disclaimer Obrigatório */}
                <Card className="p-6 bg-zinc-950/80 border-blue-500/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Potencial Geral de Retenção
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        Diagnóstico Geral de Viralização
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-3xl font-black text-white">
                          {analysis.overall_score}
                        </span>
                        <span className="text-xs text-zinc-500 block">/ 100 pts</span>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border ${getScoreColor(
                          analysis.overall_score,
                        )}`}
                      >
                        {analysis.overall_score}%
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer Oficial Obrigatório */}
                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200/90 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Aviso de Estimativa:</strong> {analysis.disclaimer}
                    </p>
                  </div>
                </Card>

                {/* Grade de Notas 0 a 100 por Critério */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(analysis.scores).map(([key, score]) => {
                    const info = CRITERIA_LABELS[key] || { label: key, desc: '' }
                    return (
                      <Card
                        key={key}
                        className="p-4 bg-zinc-950/70 border-white/10 hover:border-white/20 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{info.label}</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(
                              score,
                            )}`}
                          >
                            {score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{info.desc}</p>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              score >= 85
                                ? 'bg-emerald-400'
                                : score >= 70
                                  ? 'bg-amber-400'
                                  : 'bg-red-400'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {/* O Que Está Funcionando vs O Que Precisa Melhorar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-5 bg-zinc-950/70 border-emerald-500/20 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      O Que Está Funcionando
                    </h4>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {analysis.diagnostics.what_is_working.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-5 bg-zinc-950/70 border-amber-500/20 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      O Que Precisa Melhorar
                    </h4>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {analysis.diagnostics.what_needs_improvement.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 shrink-0 font-bold">!</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Riscos de Abandono */}
                <Card className="p-5 bg-zinc-950/70 border-red-500/20 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    O Que Pode Fazer as Pessoas Abandonarem o Vídeo (Drop-off)
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {analysis.diagnostics.dropoff_risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 shrink-0 font-bold">✕</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Como Melhorar Gancho, Roteiro e Retenção */}
                <Card className="p-6 bg-zinc-950/80 border-primary/40 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Plano Prático de Otimização Imediata
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <strong className="text-amber-400 block">Como Melhorar o Gancho:</strong>
                      <p className="text-zinc-300 leading-relaxed">
                        {analysis.diagnostics.how_to_improve_hook}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <strong className="text-blue-400 block">Como Otimizar o Roteiro:</strong>
                      <p className="text-zinc-300 leading-relaxed">
                        {analysis.diagnostics.how_to_improve_script}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <strong className="text-purple-400 block">
                        Como Manter Interesse até o Final:
                      </strong>
                      <p className="text-zinc-300 leading-relaxed">
                        {analysis.diagnostics.how_to_increase_retention}
                      </p>
                    </div>
                  </div>

                  {/* Sugestão de Gancho Reescrito */}
                  {analysis.suggested_hook_rewrite && (
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400">
                          Sugestão de Gancho Reescrito pela IA:
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(analysis.suggested_hook_rewrite || '', 'hook_rewritten')
                          }
                          className="h-6 text-xs text-zinc-400 hover:text-white"
                        >
                          {copiedKey === 'hook_rewritten' ? (
                            <Check className="w-3 h-3 text-emerald-400 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          Copiar Gancho
                        </Button>
                      </div>
                      <blockquote className="p-3 rounded-lg bg-black/60 border-l-2 border-emerald-400 text-xs italic text-white">
                        {analysis.suggested_hook_rewrite}
                      </blockquote>
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      navigate('/hypeon/clonador', {
                        state: {
                          manualDescription: `Gancho sugerido: ${analysis.suggested_hook_rewrite || ''}\nRecomendações aplicadas: ${analysis.diagnostics.how_to_improve_script}`,
                          category: niche,
                        },
                      })
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-white text-xs mt-2"
                  >
                    Recriar este Roteiro Otimizado no Clonador Viral
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-zinc-950/30">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Diagnóstico de Retenção Aparecerá Aqui
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Submeta o link de um vídeo ou o roteiro para receber notas de 0 a 100 por
                  critério, análise de riscos de abandono e reescrita imediata do gancho.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </HypeonLayout>
  )
}
