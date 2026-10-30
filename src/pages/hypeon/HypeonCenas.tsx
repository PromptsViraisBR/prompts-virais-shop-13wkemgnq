import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  generateScenes,
  getHypeonUserLimit,
  listHypeonProjects,
  saveHypeonProject,
  VisualStyle,
  GenerateScenesResult,
  SceneItem,
  HypeonProjectRecord,
} from '@/services/hypeonAi'
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  ShieldAlert,
  ArrowRight,
  Film,
  Zap,
  Volume2,
  Tv,
  Layers,
  Camera,
  Sun,
  Move,
  Smile,
  FolderPlus,
  PlaySquare,
  Wand2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const VISUAL_STYLES: {
  id: VisualStyle
  title: string
  badge: string
  desc: string
  icon: string
}[] = [
  {
    id: 'Realista cinematográfico',
    title: 'Realista Cinematográfico',
    badge: 'Mais Popular',
    desc: 'Fotografia 8K, iluminação volumétrica, profundidade de campo rasa e estética de cinema hollywoodiano.',
    icon: '🎬',
  },
  {
    id: 'Animação 3D',
    title: 'Animação 3D',
    badge: 'Estilo Pixar/Disney',
    desc: 'Renderização 3D rica em texturas, iluminação suave, personagens expressivos e cores vibrantes.',
    icon: '✨',
  },
  {
    id: 'Cartoon',
    title: 'Cartoon Moderno',
    badge: 'Dinâmico',
    desc: 'Ilustração estilizada de alto contraste, traços expressivos e paleta chamativa para retenção rápida.',
    icon: '🎨',
  },
  {
    id: 'Anime',
    title: 'Anime Shonen / Makoto',
    badge: 'Visual Japonês',
    desc: 'Estética clássica de anime, céus dramáticos, luzes com flares luminosos e traço de mangá refinado.',
    icon: '⚡',
  },
  {
    id: 'Documentário',
    title: 'Documentário Real',
    badge: 'Neutro e Factual',
    desc: 'Câmera na mão orgânica, luz natural, texturas autênticas e tom jornalístico premium.',
    icon: '📹',
  },
  {
    id: 'Terror cinematográfico',
    title: 'Terror Cinematográfico',
    badge: 'Suspense e Dark',
    desc: 'Penumbra, sombras profundas, contraste chiaroscuro, névoa e atmosfera imersiva de suspense.',
    icon: '🕯️',
  },
  {
    id: 'Estilo viral de redes sociais',
    title: 'Estilo Viral de Redes',
    badge: 'Ultra Retenção',
    desc: 'Cores saturadas, cortes no ritmo, enquadramentos POV e estética moderna de TikTok e Reels.',
    icon: '🔥',
  },
]

export function HypeonCenas() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Inputs
  const [script, setScript] = useState('')
  const [title, setTitle] = useState('')
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Realista cinematográfico')
  const [scenesCount, setScenesCount] = useState<number>(3)
  const [batchIndex, setBatchIndex] = useState<number>(1)

  // Saved projects selector
  const [savedProjects, setSavedProjects] = useState<HypeonProjectRecord[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [loadingProjects, setLoadingProjects] = useState(false)

  // Execution states
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateScenesResult | null>(null)
  const [accumulatedScenes, setAccumulatedScenes] = useState<SceneItem[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isSavedInLibrary, setIsSavedInLibrary] = useState(false)

  // Limits
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
    const lim = await getHypeonUserLimit('cenas')
    setLimits({
      dailyLimit: lim.daily_limit,
      usedToday: lim.used_today,
      remaining: lim.remaining,
      isPro: lim.is_pro || lim.is_admin,
    })
  }

  // Carregar projetos do Clonador e Stories para preencher rápido
  const loadSavedProjects = async () => {
    if (!user) return
    setLoadingProjects(true)
    try {
      const clonadorList = await listHypeonProjects('clonador')
      const storiesList = await listHypeonProjects('stories')
      setSavedProjects([...clonadorList, ...storiesList])
    } catch {
      /* intentionally ignored */
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchLimits()
    loadSavedProjects()
  }, [user])

  // Receber roteiro passado via location.state se existir
  useEffect(() => {
    const state = location.state as any
    if (state?.prefillScript) {
      setScript(state.prefillScript)
      if (state.prefillTitle) setTitle(state.prefillTitle)
      if (state.visualStyle) setVisualStyle(state.visualStyle)
      toast({
        title: 'Roteiro carregado!',
        description: 'Seu roteiro foi preenchido. Escolha o estilo visual e clique em gerar.',
      })
    }
  }, [location.state])

  // Tratar seleção de projeto salvo
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    if (!projectId) return

    const proj = savedProjects.find((p) => p.id === projectId)
    if (!proj) return

    setTitle(proj.title)
    const payload = typeof proj.payload === 'string' ? JSON.parse(proj.payload) : proj.payload
    if (payload?.full_script) {
      setScript(payload.full_script)
    } else if (payload?.full_story) {
      setScript(payload.full_story)
    } else if (payload?.narration) {
      setScript(payload.narration)
    } else if (payload?.scenes && Array.isArray(payload.scenes)) {
      const scriptFromScenes = payload.scenes
        .map(
          (s: any) => `Cena ${s.scene_number || ''}: ${s.visual_description || s.voiceover || ''}`,
        )
        .join('\n\n')
      setScript(scriptFromScenes)
    }

    toast({
      title: 'Projeto carregado com sucesso!',
      description: `Roteiro importado de "${proj.title}".`,
    })
  }

  // Cópia segura com feedback "Copiado!"
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
        title: 'Copiado para a área de transferência! 🎉',
        description: 'Pronto para colar nas ferramentas de IA.',
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

  // Gerar cenas
  const handleGenerate = async (isNextBatch = false) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para usar o Criador de Cenas.',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    if (!script.trim()) {
      toast({
        title: 'Roteiro vazio',
        description: 'Cole seu roteiro ou selecione um projeto salvo do Clonador/Stories.',
        variant: 'destructive',
      })
      return
    }

    const currentBatch = isNextBatch ? batchIndex + 1 : 1
    setLoading(true)

    try {
      const res = await generateScenes({
        script: script.trim(),
        visual_style: visualStyle,
        title: title.trim() || undefined,
        batch_index: currentBatch,
        scenes_count: scenesCount,
      })

      if (!res.success) {
        toast({
          title: res.is_limit_reached ? 'Limite Diário Atingido' : 'Erro ao processar',
          description: res.error || 'Não foi possível gerar as cenas.',
          variant: 'destructive',
        })
        return
      }

      setResult(res.data)
      setIsSavedInLibrary(false)
      setBatchIndex(currentBatch)

      if (isNextBatch) {
        // Re-enumerar cenas acumuladas
        const newBatchScenes = (res.data.scenes || []).map((sc, idx) => ({
          ...sc,
          scene_number: accumulatedScenes.length + idx + 1,
        }))
        setAccumulatedScenes((prev) => [...prev, ...newBatchScenes])
      } else {
        setAccumulatedScenes(res.data.scenes || [])
      }

      setLimits((prev) => ({
        ...prev,
        usedToday: res.usage.used_today,
        remaining: res.usage.remaining,
      }))

      toast({
        title: isNextBatch ? 'Mais cenas adicionadas!' : 'Cenas geradas com sucesso! 🎬✨',
        description: `${res.data.scenes?.length || 0} cenas prontas no estilo ${visualStyle}.`,
      })
    } catch (err: any) {
      toast({
        title: 'Erro na geração de cenas',
        description: err?.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Salvar na Biblioteca Viral
  const handleSaveToLibrary = async () => {
    if (!accumulatedScenes.length) return
    try {
      await saveHypeonProject({
        tool_id: 'cenas',
        title: title.trim() || `Produção de Cenas - ${visualStyle}`,
        category: visualStyle,
        mode: 'cenas_prontas',
        source_type: 'script_text',
        source_reference: script.slice(0, 80),
        content_type: 'scenes',
        payload: {
          title: title.trim() || 'Produção de Cenas',
          visual_style: visualStyle,
          script: script.trim(),
          scenes: accumulatedScenes,
        },
      })
      setIsSavedInLibrary(true)
      toast({
        title: 'Salvo na Biblioteca Viral! 📁',
        description: 'Você pode acessar ou mover este projeto para pastas a qualquer momento.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  // Copiar todas as cenas juntas
  const handleCopyAll = () => {
    if (!accumulatedScenes.length) return
    const allText = accumulatedScenes
      .map(
        (s) => `CENA ${s.scene_number} (${s.duration}):
- Visual: ${s.visual_description}
- Personagens: ${s.characters || '—'}
- Cenário: ${s.setting || '—'}
- Câmera: ${s.framing || '—'} | Movimento: ${s.camera_movement || '—'}
- Iluminação: ${s.lighting || '—'}
- Ação e Expressão: ${s.action || '—'} (${s.expressions || '—'})
- PROMPT DE IMAGEM (9:16): ${s.image_prompt}
- PROMPT DE VÍDEO: ${s.video_prompt}
- Narração: ${s.narration}
`,
      )
      .join('\n-----------------------------------------\n\n')

    copyToClipboard(allText, 'copy_all')
  }

  // Atalhos para geradores existentes do site
  const handleSendToImageGenerator = (scene: SceneItem) => {
    navigate('/virais', {
      state: {
        prefillPrompt: scene.image_prompt,
        tab: 'image_prompt',
      },
    })
    toast({
      title: 'Redirecionando para o Gerador de Prompts de Imagem 🎨',
      description: 'O prompt da cena já está pronto para visualização.',
    })
  }

  const handleSendToSalesGenerator = (scene: SceneItem) => {
    navigate('/gerador', {
      state: {
        prefillPrompt: `${title ? `${title}: ` : ''}${scene.visual_description}`,
        visualDetails: scene.image_prompt,
      },
    })
    toast({
      title: 'Redirecionando para o Gerador de Vendas 🎬',
      description: 'Cena carregada no fluxo de gravação.',
    })
  }

  return (
    <HypeonLayout
      title="Criador de Cenas"
      description="Transforme roteiros completos em cenas prontas para IA com prompts de imagem, prompts de vídeo, enquadramento e narração."
      badge="Fase 4 HYPEON"
    >
      <div className="space-y-8">
        {/* Aviso de Performance e Boas Práticas */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-xs text-purple-200/90 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-purple-300">
              Diretriz de Alta Performance & Cenas por Lote:
            </span>
            <p>
              Para garantir respostas ultra-rápidas sem estourar o tempo do servidor, geramos de 3 a
              4 cenas hiper-detalhadas por chamada. Se o seu roteiro for longo, use o botão "Gerar
              Próximo Lote de Cenas" para continuar acumulando cenas no mesmo projeto.
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

        {/* Formulário Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna da Esquerda: Entradas */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  1. Roteiro ou Projeto de Referência
                </h3>
              </div>

              {/* Seletor de Projetos Salvos */}
              {savedProjects.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-primary" />
                    Puxar de um Projeto Salvo (Clonador / Stories):
                  </Label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">-- Selecione para importar automaticamente --</option>
                    {savedProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.tool_id.toUpperCase()}] {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Título opcional */}
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Título do Projeto (Opcional):</Label>
                <Input
                  placeholder="Ex: Comercial Épico do Produto, Curiosidade Histórica, etc."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/60 border-white/15 text-white placeholder:text-zinc-600 focus:border-primary text-xs"
                />
              </div>

              {/* Roteiro */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-zinc-300">Cole o Roteiro Completo:</Label>
                  <span className="text-[11px] text-zinc-500">{script.length} caracteres</span>
                </div>
                <Textarea
                  placeholder="Cole aqui seu roteiro ou história. Pode ser um texto narrado, divisão em falas ou anotações..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={8}
                  className="bg-black/60 border-white/15 text-white placeholder:text-zinc-600 resize-none text-xs leading-relaxed"
                />
              </div>
            </Card>

            {/* Escolha do Estilo Visual (7 Estilos) */}
            <Card className="p-6 bg-zinc-950/70 border-white/10 space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                2. Escolha o Estilo Visual das Cenas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VISUAL_STYLES.map((st) => {
                  const isSelected = visualStyle === st.id
                  return (
                    <div
                      key={st.id}
                      onClick={() => setVisualStyle(st.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <span>{st.icon}</span>
                            <span>{st.title}</span>
                          </span>
                          <Badge
                            variant={isSelected ? 'default' : 'outline'}
                            className="text-[9px] px-1.5 py-0"
                          >
                            {st.badge}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{st.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Botão Principal de Gerar Cenas */}
              <Button
                onClick={() => handleGenerate(false)}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-semibold py-6 shadow-xl shadow-purple-500/20 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Gerando Cenas e Prompts no Servidor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Transformar Roteiro em Cenas Prontas 🎬
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Coluna da Direita: Cenas Geradas com Detalhamento Completo */}
          <div className="lg:col-span-6 space-y-6">
            {accumulatedScenes.length > 0 ? (
              <div className="space-y-6 animate-fade-in">
                {/* Barra de Ações Rápidas */}
                <Card className="p-5 bg-zinc-950/80 border-primary/40 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 mb-1.5">
                        {visualStyle} • {accumulatedScenes.length} cenas prontas
                      </Badge>
                      <h2 className="text-lg font-bold text-white">
                        {title || result?.title || 'Produção de Cenas'}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyAll}
                      className="border-white/15 text-xs text-zinc-300 hover:text-white"
                    >
                      {copiedKey === 'copy_all' ? (
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1" />
                      )}
                      Copiar Tudo
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
                      onClick={() => handleGenerate(true)}
                      disabled={loading}
                      className="border-purple-500/40 text-xs text-purple-300 hover:bg-purple-500/20 col-span-2 sm:col-span-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />+ Gerar Próximo Lote (3-4 cenas)
                    </Button>
                  </div>
                </Card>

                {/* Lista de Cenas Individuais */}
                <div className="space-y-4">
                  {accumulatedScenes.map((scene, idx) => (
                    <Card
                      key={`scene_${idx}`}
                      className="p-5 bg-zinc-950/70 border-white/10 hover:border-white/20 transition space-y-4"
                    >
                      {/* Topo da Cena */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                            #{scene.scene_number}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            Cena {scene.scene_number}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] text-zinc-400 border-white/15"
                          >
                            ⏱️ {scene.duration}
                          </Badge>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              `Cena ${scene.scene_number} (${scene.duration})\nVisual: ${scene.visual_description}\nPersonagens: ${scene.characters || ''}\nCenário: ${scene.setting || ''}\nPrompt Imagem: ${scene.image_prompt}\nPrompt Vídeo: ${scene.video_prompt}\nNarração: ${scene.narration}`,
                              `scene_all_${scene.scene_number}`,
                            )
                          }
                          className="h-7 text-xs text-zinc-400 hover:text-white"
                        >
                          {copiedKey === `scene_all_${scene.scene_number}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 mr-1" />
                          )}
                          Copiar Cena
                        </Button>
                      </div>

                      {/* Descrição Visual e Enquadramento */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <span className="text-zinc-500 font-semibold text-[10px] uppercase tracking-wider block">
                            Descrição Visual da Cena:
                          </span>
                          <p className="text-zinc-200 leading-relaxed">
                            {scene.visual_description}
                          </p>
                        </div>

                        {/* Grade de Detalhes Técnicos de Fotografia */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2.5 rounded bg-black/30 border border-white/5">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Camera className="w-3 h-3 text-primary" /> Enquadramento:
                            </span>
                            <span className="text-zinc-200 block font-medium mt-0.5">
                              {scene.framing || 'Plano Médio'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded bg-black/30 border border-white/5">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Sun className="w-3 h-3 text-amber-400" /> Iluminação:
                            </span>
                            <span className="text-zinc-200 block font-medium mt-0.5">
                              {scene.lighting || 'Cinematográfica'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded bg-black/30 border border-white/5">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Move className="w-3 h-3 text-blue-400" /> Câmera:
                            </span>
                            <span className="text-zinc-200 block font-medium mt-0.5">
                              {scene.camera_movement || 'Suave'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded bg-black/30 border border-white/5">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Smile className="w-3 h-3 text-emerald-400" /> Expressão / Ação:
                            </span>
                            <span className="text-zinc-200 block font-medium mt-0.5">
                              {scene.expressions || scene.action || 'Foco'}
                            </span>
                          </div>
                        </div>

                        {/* Personagens & Cenário */}
                        {(scene.characters || scene.setting) && (
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {scene.characters && (
                              <div className="p-2 rounded bg-black/20 border border-white/5">
                                <span className="text-zinc-500">Personagens:</span>
                                <p className="text-zinc-300 font-medium truncate">
                                  {scene.characters}
                                </p>
                              </div>
                            )}
                            {scene.setting && (
                              <div className="p-2 rounded bg-black/20 border border-white/5">
                                <span className="text-zinc-500">Cenário:</span>
                                <p className="text-zinc-300 font-medium truncate">
                                  {scene.setting}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* PROMPT DE IMAGEM com botão individual de cópia */}
                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/25 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              Prompt de Imagem (Formato 9:16)
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
                              Copiar Prompt
                            </Button>
                          </div>
                          <p className="text-xs text-purple-100 font-mono bg-black/50 p-2.5 rounded border border-purple-500/20 leading-relaxed select-all">
                            {scene.image_prompt}
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSendToImageGenerator(scene)}
                              className="h-6 text-[10px] text-purple-400 hover:text-purple-200"
                            >
                              Abrir no Gerador de Prompts de Imagem →
                            </Button>
                          </div>
                        </div>

                        {/* PROMPT DE VÍDEO com botão individual de cópia */}
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/25 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                              <PlaySquare className="w-3.5 h-3.5 text-blue-400" />
                              Prompt de Vídeo (Movimento de Câmera & Dinâmica)
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
                              Copiar Prompt
                            </Button>
                          </div>
                          <p className="text-xs text-blue-100 font-mono bg-black/50 p-2.5 rounded border border-blue-500/20 leading-relaxed select-all">
                            {scene.video_prompt}
                          </p>
                        </div>

                        {/* Narração / Voz em Off */}
                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 font-semibold text-[10px] uppercase flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-primary" /> Narração da Cena:
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                copyToClipboard(scene.narration, `narr_${scene.scene_number}`)
                              }
                              className="h-5 text-[10px] text-zinc-400 hover:text-white p-1"
                            >
                              {copiedKey === `narr_${scene.scene_number}` ? (
                                <Check className="w-3 h-3 text-emerald-400 mr-1" />
                              ) : (
                                <Copy className="w-3 h-3 mr-1" />
                              )}
                              Copiar
                            </Button>
                          </div>
                          <p className="text-white text-xs font-medium italic">{scene.narration}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-zinc-950/30">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Film className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Suas Cenas Prontas Aparecerão Aqui
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Cole seu roteiro ao lado e escolha o estilo visual desejado. O sistema entregará
                  cada cena com prompts individuais de imagem e vídeo prontos para produção.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </HypeonLayout>
  )
}

export default HypeonCenas
