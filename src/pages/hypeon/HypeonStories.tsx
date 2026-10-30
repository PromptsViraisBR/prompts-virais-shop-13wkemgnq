import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  generateStory,
  listUserSeries,
  saveUserSeries,
  getHypeonUserLimit,
  StoryResult,
  StorySeries,
  StoryCharacter,
} from '@/services/hypeonAi'
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Download,
  Users,
  Plus,
  Trash2,
  Film,
  Image as ImageIcon,
  Video as VideoIcon,
  Zap,
  ArrowRight,
  Bookmark,
  Volume2,
  Layers,
  ChevronRight,
  Tv,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CATEGORIES = [
  'Terror',
  'Suspense',
  'Mistério',
  'Drama',
  'Romance',
  'Traição',
  'Histórias emocionantes',
  'Ficção científica',
  'Histórias sobrenaturais',
  'Histórias engraçadas',
  'Reviravoltas inesperadas',
]

const VISUAL_STYLES = [
  'Cinematográfico Realista 8K',
  'Sombrio & Hiper-realista (Dark Cinema)',
  'Anime / Mangá Estilizado',
  'Documentário Investigativo Retro',
  'Ilustração 3D Pixar / Disney',
  'Cyberpunk Neon Noir',
]

const ENDING_TYPES = [
  'Reviravolta Inesperada (Plot Twist)',
  'Gancho em Aberto para Parte 2 (Cliffhanger)',
  'Final Emocionante & Inspirador',
  'Terror Psicológico Perturbador',
  'Desfecho Engraçado e Irônico',
]

export function HypeonStories() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Form states
  const [theme, setTheme] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [duration, setDuration] = useState('60s')
  const [charactersCount, setCharactersCount] = useState(2)
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0])
  const [endingType, setEndingType] = useState(ENDING_TYPES[0])
  const [platform, setPlatform] = useState('TikTok / Shorts')

  // Series states (continuidade)
  const [seriesList, setSeriesList] = useState<StorySeries[]>([])
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('')
  const [episodeNumber, setEpisodeNumber] = useState<number>(1)
  const [isCreatingSeriesModal, setIsCreatingSeriesModal] = useState(false)
  const [newSeriesTitle, setNewSeriesTitle] = useState('')
  const [newCharacters, setNewCharacters] = useState<StoryCharacter[]>([
    {
      id: '1',
      name: 'Lucas',
      appearance: 'Jovem 28 anos, olhos castanhos, barba rala',
      clothes: 'Jaqueta de couro preta e jeans',
      personality: 'Curioso e cético',
    },
  ])

  // Processing states
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StoryResult | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [limits, setLimits] = useState({
    dailyLimit: 2,
    usedToday: 0,
    remaining: 2,
    isPro: false,
  })

  // Carregar limites e séries do usuário
  const loadData = async () => {
    if (!user) return
    const lim = await getHypeonUserLimit('stories')
    setLimits({
      dailyLimit: lim.daily_limit,
      usedToday: lim.used_today,
      remaining: lim.remaining,
      isPro: lim.is_pro || lim.is_admin,
    })

    const seriesRes = await listUserSeries()
    if (seriesRes.success) {
      setSeriesList(seriesRes.series)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  // Quando escolhe uma série, ajusta o próximo episódio sugerido
  useEffect(() => {
    if (selectedSeriesId) {
      const s = seriesList.find((item) => item.id === selectedSeriesId)
      if (s) {
        setCategory(s.category || CATEGORIES[0])
        setEpisodeNumber((s.episodes_count || 0) + 1)
      }
    } else {
      setEpisodeNumber(1)
    }
  }, [selectedSeriesId, seriesList])

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

  const handleCreateNewSeries = async () => {
    if (!newSeriesTitle.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Dê um nome para a sua série.',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await saveUserSeries({
        series_title: newSeriesTitle.trim(),
        category,
        characters: newCharacters,
        recurring_settings: ['Apartamento escuro', 'Rua deserta à noite'],
      })

      if (res.success) {
        setSeriesList((prev) => [res.series, ...prev])
        setSelectedSeriesId(res.series.id)
        setIsCreatingSeriesModal(false)
        setNewSeriesTitle('')
        toast({
          title: 'Série criada com sucesso!',
          description: `Banco de personagens ativo para "${res.series.series_title}".`,
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao criar série',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleAddCharacterRow = () => {
    setNewCharacters((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: `Personagem ${prev.length + 1}`,
        appearance: 'Descrição física detalhada',
        clothes: 'Roupas habituais',
        personality: 'Mistério / coragem',
      },
    ])
  }

  const handleRemoveCharacterRow = (idx: number) => {
    setNewCharacters((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleGenerateStory = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para criar histórias virais.',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    if (!theme.trim()) {
      toast({
        title: 'Informe a premissa',
        description: 'Escreva sobre o que será esta história.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await generateStory({
        theme: theme.trim(),
        category,
        duration,
        characters_count: charactersCount,
        visual_style: visualStyle,
        ending_type: endingType,
        platform,
        series_id: selectedSeriesId || undefined,
        episode_number: episodeNumber,
      })

      if (!res.success) {
        toast({
          title: res.is_limit_reached ? 'Limite Diário Atingido' : 'Erro ao processar',
          description: res.error || 'Não foi possível gerar a história.',
          variant: 'destructive',
        })
        return
      }

      setResult(res.data)
      setLimits((prev) => ({
        ...prev,
        usedToday: res.usage.used_today,
        remaining: res.usage.remaining,
      }))

      // Se faz parte de uma série, atualizar contador na lista
      if (selectedSeriesId) {
        setSeriesList((prev) =>
          prev.map((s) =>
            s.id === selectedSeriesId
              ? { ...s, episodes_count: Math.max(s.episodes_count || 0, episodeNumber) }
              : s,
          ),
        )
      }

      toast({
        title: 'História em cenas gerada!',
        description: 'Roteiro com prompts de imagem e vídeo pronto.',
      })
    } catch (err: any) {
      toast({
        title: 'Falha na conexão',
        description: err?.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportStory = (format: 'txt' | 'md') => {
    if (!result) return

    let content = ''
    if (format === 'md') {
      content = `# ${result.title}
**Categoria:** ${result.category} | **Episódio:** ${result.episode_number}

## 🎯 Gancho Inicial
${result.hook}

## 📖 História Completa
${result.full_story}

## 🎙️ Narração (Áudio em Off)
${result.narration}

## 🎬 Cenas com Prompts de Imagem e Vídeo
${result.scenes
  .map(
    (s) => `### Cena ${s.scene_number} (${s.duration})
- **Descrição Visual:** ${s.visual_description}
- **Voz em Off:** ${s.voiceover}
- **Prompt de Imagem (IA):** \`${s.image_prompt}\`
- **Prompt de Vídeo (IA):** \`${s.video_prompt}\`
- **Efeitos Sonoros:** ${s.sound_effects || 'Nenhum'}
`,
  )
  .join('\n')}

## 🏁 Chamada para Ação
${result.cta}

${result.next_episode_hook ? `## 🔮 Gancho para Próximo Episódio\n${result.next_episode_hook}` : ''}
`
    } else {
      content = `${result.title.toUpperCase()}
Categoria: ${result.category} (Episódio ${result.episode_number})

GANCHO:
${result.hook}

HISTÓRIA:
${result.full_story}

CENAS:
${result.scenes
  .map(
    (s) => `[Cena ${s.scene_number}]
Visual: ${s.visual_description}
Prompt Imagem: ${s.image_prompt}
Prompt Vídeo: ${s.video_prompt}
`,
  )
  .join('\n')}
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

  return (
    <HypeonLayout
      title="HYPEON Stories"
      description="Gerador de narrativas cinematográficas em cenas, prompts de imagem e vídeo, com suporte a séries e banco de personagens contínuos."
      badge="Narrativas Virais & Séries"
    >
      <div className="space-y-8">
        {/* Status de Cota */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-white flex items-center gap-2">
                Suas Gerações de Stories Hoje:
                <Badge
                  variant={limits.remaining > 0 ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {limits.usedToday} / {limits.dailyLimit} usadas
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                {limits.remaining > 0
                  ? `Restam ${limits.remaining} histórias hoje no seu plano ${limits.isPro ? 'PRO' : 'Gratuito'}.`
                  : 'Você atingiu o limite diário de histórias.'}
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

        {/* FORMULÁRIO & CONTINUIDADE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            {/* Opção de Série / Banco de Personagens */}
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-primary" />
                  Série em Episódios & Personagens
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCreatingSeriesModal(true)}
                  className="border-white/15 text-xs text-zinc-300 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Nova Série
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-zinc-400">Vincular a uma Série:</Label>
                  <select
                    value={selectedSeriesId}
                    onChange={(e) => setSelectedSeriesId(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary mt-1"
                  >
                    <option value="">Sem Série (Episódio Único)</option>
                    {seriesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.series_title} ({s.episodes_count || 0} eps)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSeriesId && (
                  <div>
                    <Label className="text-xs text-zinc-400">Número do Episódio:</Label>
                    <Input
                      type="number"
                      min={1}
                      value={episodeNumber}
                      onChange={(e) => setEpisodeNumber(parseInt(e.target.value, 10) || 1)}
                      className="bg-black/60 border-white/15 text-white text-xs mt-1"
                    />
                  </div>
                )}
              </div>

              {selectedSeriesId && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-zinc-300">
                  <strong className="text-primary block mb-1">Continuidade Ativada:</strong>
                  Esta história manterá os mesmos nomes, características físicas, roupas e desfecho
                  anterior dos episódios passados desta série.
                </div>
              )}
            </Card>

            {/* Modal Inline para Nova Série */}
            {isCreatingSeriesModal && (
              <Card className="p-5 bg-zinc-900 border-primary/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Criar Banco de Personagens para Nova Série
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsCreatingSeriesModal(false)}
                    className="h-6 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">Título da Série</Label>
                  <Input
                    placeholder="Ex: O Segredo de Nova Esperança"
                    value={newSeriesTitle}
                    onChange={(e) => setNewSeriesTitle(e.target.value)}
                    className="bg-black/60 border-white/15 text-white text-xs"
                  />
                </div>

                {/* Personagens */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-zinc-300">Personagens Fixos</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddCharacterRow}
                      className="h-6 text-[11px] text-primary"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Adicionar Personagem
                    </Button>
                  </div>

                  {newCharacters.map((char, idx) => (
                    <div
                      key={char.id || idx}
                      className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Nome do personagem"
                          value={char.name}
                          onChange={(e) => {
                            const val = e.target.value
                            setNewCharacters((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, name: val } : c)),
                            )
                          }}
                          className="w-1/2 bg-black/60 border-white/15 text-white text-xs h-7"
                        />
                        {newCharacters.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCharacterRow(idx)}
                            className="h-6 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Aparência física (idade, olhos, cabelo, traços)"
                        value={char.appearance}
                        onChange={(e) => {
                          const val = e.target.value
                          setNewCharacters((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, appearance: val } : c)),
                          )
                        }}
                        className="bg-black/60 border-white/15 text-white text-xs h-7"
                      />
                      <Input
                        placeholder="Roupas habituais (ex: moletom cinza e tênis surrado)"
                        value={char.clothes}
                        onChange={(e) => {
                          const val = e.target.value
                          setNewCharacters((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, clothes: val } : c)),
                          )
                        }}
                        className="bg-black/60 border-white/15 text-white text-xs h-7"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCreateNewSeries}
                  className="w-full bg-primary hover:bg-primary/90 text-white text-xs"
                >
                  Salvar Nova Série e Banco de Personagens
                </Button>
              </Card>
            )}

            {/* Parâmetros da História */}
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Parâmetros da Narrativa
              </h3>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Tema ou Premissa da História *</Label>
                <Textarea
                  placeholder="Ex: Uma mulher descobre que as fotos antigas guardadas no porão começaram a mudar de posição sozinhas durante a madrugada..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  rows={3}
                  className="bg-black/60 border-white/15 text-white placeholder:text-zinc-600 text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">Categoria</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">Duração Desejada</Label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="30s">30 segundos (Rápido)</option>
                    <option value="60s">60 segundos (Padrão)</option>
                    <option value="90s">90 segundos (Aprofundado)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">Estilo Visual das Imagens</Label>
                  <select
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    {VISUAL_STYLES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">Tipo de Final</Label>
                  <select
                    value={endingType}
                    onChange={(e) => setEndingType(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    {ENDING_TYPES.map((et) => (
                      <option key={et} value={et}>
                        {et}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={handleGenerateStory}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 text-white font-semibold py-6 shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Gerando História em Cenas com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar História em Cenas & Prompts
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* PAINEL DE RESULTADO EM CENAS COM PROMPTS */}
          <div className="lg:col-span-6 space-y-6">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Título & Botões de Exportação */}
                <Card className="p-6 bg-zinc-950/80 border-primary/40 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                        {result.category} • Episódio {result.episode_number}
                      </Badge>
                      <h2 className="text-lg font-bold text-white">{result.title}</h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(result.full_story, 'story')}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      {copiedKey === 'story' ? (
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1" />
                      )}
                      Copiar História
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportStory('txt')}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> Baixar .txt
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportStory('md')}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> Baixar .md
                    </Button>
                  </div>
                </Card>

                {/* Gancho Inicial */}
                <Card className="p-5 bg-zinc-950/70 border-primary/30 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    Gancho Inicial (Primeiros Segundos)
                  </h4>
                  <blockquote className="p-3 rounded-lg bg-black/60 border-l-2 border-amber-400 text-xs italic text-white">
                    {result.hook}
                  </blockquote>
                </Card>

                {/* Cenas com Prompts de Imagem e Vídeo */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    Cenas com Prompts de Imagem & Vídeo ({result.scenes.length} cenas)
                  </h4>

                  <div className="space-y-4">
                    {result.scenes.map((scene) => (
                      <Card
                        key={scene.scene_number}
                        className="p-5 bg-zinc-950/70 border-white/10 hover:border-white/20 transition space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                              {scene.scene_number}
                            </span>
                            <span className="text-xs font-medium text-white">
                              Cena {scene.scene_number} ({scene.duration})
                            </span>
                          </div>
                          {scene.characters_present && scene.characters_present.length > 0 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-zinc-400 border-white/15"
                            >
                              {scene.characters_present.join(', ')}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-xs">
                          <p className="text-zinc-300">
                            <strong className="text-white">Ação:</strong> {scene.visual_description}
                          </p>
                          <p className="text-zinc-300">
                            <strong className="text-white">Locução:</strong> {scene.voiceover}
                          </p>
                        </div>

                        {/* Prompt de Imagem */}
                        <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                              Prompt de Imagem (IA):
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                copyToClipboard(scene.image_prompt, `img_${scene.scene_number}`)
                              }
                              className="h-6 text-[11px] text-purple-300 hover:text-white"
                            >
                              {copiedKey === `img_${scene.scene_number}` ? (
                                <Check className="w-3 h-3 text-emerald-400 mr-1" />
                              ) : (
                                <Copy className="w-3 h-3 mr-1" />
                              )}
                              Copiar Prompt Imagem
                            </Button>
                          </div>
                          <p className="text-[11px] text-zinc-300 font-mono bg-black/60 p-2 rounded border border-white/5 leading-relaxed">
                            {scene.image_prompt}
                          </p>
                        </div>

                        {/* Prompt de Imagem para Vídeo */}
                        <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1.5">
                              <VideoIcon className="w-3.5 h-3.5 text-blue-400" />
                              Prompt de Imagem para Vídeo (Luma, Kling, Runway):
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                copyToClipboard(scene.video_prompt, `vid_${scene.scene_number}`)
                              }
                              className="h-6 text-[11px] text-blue-300 hover:text-white"
                            >
                              {copiedKey === `vid_${scene.scene_number}` ? (
                                <Check className="w-3 h-3 text-emerald-400 mr-1" />
                              ) : (
                                <Copy className="w-3 h-3 mr-1" />
                              )}
                              Copiar Prompt Vídeo
                            </Button>
                          </div>
                          <p className="text-[11px] text-zinc-300 font-mono bg-black/60 p-2 rounded border border-white/5 leading-relaxed">
                            {scene.video_prompt}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Fechamento & Cliffhanger */}
                <Card className="p-5 bg-zinc-950/70 border-white/10 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 block mb-1">
                      Chamada para Ação Final:
                    </span>
                    <p className="text-xs text-zinc-300">{result.cta}</p>
                  </div>
                  {result.next_episode_hook && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-xs font-semibold text-primary block mb-1">
                        Gancho para o Próximo Episódio:
                      </span>
                      <p className="text-xs text-white italic">{result.next_episode_hook}</p>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-zinc-950/30">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Sua História Cinematográfica Aparecerá Aqui
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Defina o tema, escolha se faz parte de uma série para manter os mesmos
                  personagens, e receba o roteiro completo cena a cena com prompts de imagem e
                  vídeo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </HypeonLayout>
  )
}
