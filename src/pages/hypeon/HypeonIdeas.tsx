import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { generateIdeas, getHypeonUserLimit, HypeonIdeaItem } from '@/services/hypeonAi'
import {
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  Bookmark,
  Share2,
  FileText,
  Target,
  Clock,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const NICHES = [
  'Curiosidades & Fatos Desconhecidos',
  'Mistérios & Casos Não Resolvidos',
  'Finanças & Renda Extra',
  'Tecnologia, IA & Inovação',
  'Desenvolvimento Pessoal & Hábitos',
  'Saúde, Fitness & Nutrição',
  'Entretenimento & Cinema',
  'Negócios & Marketing Digital',
  'História Antiga & Civilizações',
  'Relacionamentos & Comportamento',
]

const PLATFORMS = [
  'TikTok / Shorts / Reels (Vertical)',
  'YouTube (Vídeo Médio / Longo)',
  'Instagram Carrossel + Reels',
]

const VIDEO_STYLES = [
  'Cortes Rápidos & Dinâmicos (Alta Retenção)',
  'Narrativa Suspense / Storytelling',
  'Explicativo com Gráficos & Imagens',
  'Provocativo & Contrarian (Quebra de Mito)',
  'Lista Top 3 / Top 5',
]

const CONTENT_GOALS = [
  'Viralização e Máximo Alcance',
  'Engajamento e Comentários',
  'Atração de Novos Seguidores',
  'Venda de Produto / Afiliado',
  'Construção de Autoridade',
]

export function HypeonIdeas() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Form states
  const [niche, setNiche] = useState(NICHES[0])
  const [theme, setTheme] = useState('')
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [targetAudience, setTargetAudience] = useState('Jovens e adultos curiosos')
  const [duration, setDuration] = useState('30s a 60s')
  const [videoStyle, setVideoStyle] = useState(VIDEO_STYLES[0])
  const [contentGoal, setContentGoal] = useState(CONTENT_GOALS[0])
  const [countRequested, setCountRequested] = useState<5 | 10 | 20>(5)

  // Processing states
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<HypeonIdeaItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [limits, setLimits] = useState({
    dailyLimit: 3,
    usedToday: 0,
    remaining: 3,
    isPro: false,
  })

  const fetchLimits = async () => {
    if (!user) return
    const lim = await getHypeonUserLimit('ideas')
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

  const copyToClipboard = async (text: string, id: string) => {
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
      setCopiedId(id)
      toast({
        title: 'Copiado para a área de transferência!',
        description: 'Ideia pronta para usar.',
      })
      setTimeout(() => setCopiedId(null), 2500)
    } catch (_) {
      toast({
        title: 'Não foi possível copiar',
        description: 'Selecione o texto e copie manualmente.',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateIdeas = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para gerar ideias.',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      const res = await generateIdeas({
        niche,
        theme: theme.trim() || niche,
        platform,
        target_audience: targetAudience,
        duration,
        video_style: videoStyle,
        content_goal: contentGoal,
        count: countRequested,
      })

      if (!res.success) {
        toast({
          title: res.is_limit_reached ? 'Limite Diário Atingido' : 'Erro ao processar',
          description: res.error || 'Não foi possível gerar ideias.',
          variant: 'destructive',
        })
        return
      }

      setIdeas(res.data.ideas || [])
      setLimits((prev) => ({
        ...prev,
        usedToday: res.usage.used_today,
        remaining: res.usage.remaining,
      }))

      toast({
        title: `${res.data.ideas.length} ideias geradas com sucesso!`,
        description: 'Você pode transformar qualquer ideia em roteiro completo.',
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

  // Transformar qualquer ideia em roteiro completo pelo Clonador Viral
  const handleTransformIntoScript = (idea: HypeonIdeaItem) => {
    const description = `Ideia Selecionada: ${idea.title}
Gancho Inicial: ${idea.hook}
Resumo Narrativo: ${idea.summary}
Esboço: ${idea.script_outline}
Sugestões de Cenas:
${idea.suggested_scenes.join('\n')}
CTA: ${idea.cta}`

    navigate('/hypeon/clonador', {
      state: {
        manualDescription: description,
        category: niche,
        mode: 'recriar_formato',
      },
    })
  }

  return (
    <HypeonLayout
      title="HYPEON Ideas"
      description="Gere 5, 10 ou 20 ideias de alta retenção por solicitação, com pontuação preditiva estimada e conversão direta para roteiro."
      badge="Gerador Infinito de Ideias"
    >
      <div className="space-y-8">
        {/* Status de Cota */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-white flex items-center gap-2">
                Suas Gerações de Ideias Hoje:
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
                  : 'Você atingiu o limite de ideias de hoje.'}
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

        {/* FORMULÁRIO */}
        <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Configurar Geração de Ideias
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Nicho Principal</Label>
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

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Tema Específico ou Palavra-Chave</Label>
              <Input
                placeholder="Ex: Segredos da mente, IA no trabalho, etc."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-black/60 border-white/15 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Plataforma Alvo</Label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Público-Alvo</Label>
              <Input
                placeholder="Ex: Jovens criadores, empreendedores"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="bg-black/60 border-white/15 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Estilo de Vídeo</Label>
              <select
                value={videoStyle}
                onChange={(e) => setVideoStyle(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              >
                {VIDEO_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Objetivo do Conteúdo</Label>
              <select
                value={contentGoal}
                onChange={(e) => setContentGoal(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              >
                {CONTENT_GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Quantidade de Ideias</Label>
              <div className="flex gap-2">
                {([5, 10, 20] as const).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setCountRequested(cnt)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md border transition ${
                      countRequested === cnt
                        ? 'border-primary bg-primary text-white'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cnt} ideias
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerateIdeas}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-primary hover:from-amber-600 hover:to-primary/90 text-white font-semibold py-6 shadow-xl shadow-amber-500/10"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Gerando {countRequested} Ideias com IA...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5 mr-2" />
                Gerar {countRequested} Ideias Virais
              </>
            )}
          </Button>
        </Card>

        {/* LISTAGEM DE IDEIAS GERADAS */}
        {ideas.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                {ideas.length} Ideias Prontas para Produzir ({niche})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea, idx) => (
                <Card
                  key={idea.id || idx}
                  className="p-5 bg-zinc-950/80 border-white/10 hover:border-primary/40 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-snug">{idea.title}</h4>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] shrink-0">
                        {idea.engagement_score}/100
                      </Badge>
                    </div>

                    {/* Estimativa de Engajamento Rotulada */}
                    <div className="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-zinc-400 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{idea.engagement_estimate}</span>
                    </div>

                    {/* Gancho */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        Gancho (0-3s):
                      </span>
                      <p className="text-xs text-white font-medium italic p-2 rounded bg-black/60 border-l-2 border-amber-400">
                        {idea.hook}
                      </p>
                    </div>

                    {/* Resumo */}
                    <p className="text-xs text-zinc-300 leading-relaxed">{idea.summary}</p>

                    {/* Cenas Sugeridas */}
                    {idea.suggested_scenes && idea.suggested_scenes.length > 0 && (
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Sugestão de Cenas:
                        </span>
                        <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-0.5">
                          {idea.suggested_scenes.map((sc, i) => (
                            <li key={i}>{sc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação da Ideia */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(
                          `TÍTULO: ${idea.title}\nGANCHO: ${idea.hook}\nRESUMO: ${idea.summary}\nCTA: ${idea.cta}`,
                          idea.id,
                        )
                      }
                      className="h-8 text-xs text-zinc-400 hover:text-white"
                    >
                      {copiedId === idea.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1" />
                      )}
                      Copiar
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleTransformIntoScript(idea)}
                      className="bg-primary hover:bg-primary/90 text-white text-xs h-8"
                    >
                      Transformar em Roteiro
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-zinc-950/30">
            <Lightbulb className="w-10 h-10 text-amber-400 mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">Nenhuma ideia gerada ainda</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Escolha seu nicho e a quantidade de ideias acima para gerar ângulos virais imediatos.
            </p>
          </div>
        )}
      </div>
    </HypeonLayout>
  )
}
