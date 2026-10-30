import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import {
  getViralSavedReferences,
  removeViralSavedReference,
  updateViralSavedReference,
  listHypeonFolders,
  createHypeonFolder,
  updateHypeonFolder,
  deleteHypeonFolder,
  ViralSavedRecord,
  HypeonFolderRecord,
} from '@/services/hypeon'
import {
  listHypeonProjects,
  deleteHypeonProject,
  updateHypeonProject,
  duplicateHypeonProject,
  HypeonProjectRecord,
} from '@/services/hypeonAi'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Bookmark,
  ExternalLink,
  Trash2,
  Video,
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
  Radio,
  Folder,
  FolderPlus,
  FolderEdit,
  Search,
  Copy,
  Check,
  Edit3,
  Layers,
  FileText,
  Lightbulb,
  Film,
  Activity,
  Plus,
  Filter,
  MoveRight,
  MoreVertical,
  X,
  RefreshCw,
  FolderOpen,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

type LibraryTab = 'all' | 'projects' | 'references'
type ProjectTypeFilter = 'all' | 'clonador' | 'stories' | 'ideas' | 'cenas' | 'analisador'

export function HypeonBiblioteca() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State de dados
  const [references, setReferences] = useState<ViralSavedRecord[]>([])
  const [projects, setProjects] = useState<HypeonProjectRecord[]>([])
  const [folders, setFolders] = useState<HypeonFolderRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros e busca
  const [activeTab, setActiveTab] = useState<LibraryTab>('all')
  const [activeFolderId, setActiveFolderId] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [projectTypeFilter, setProjectTypeFilter] = useState<ProjectTypeFilter>('all')

  // Modais
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<HypeonFolderRecord | null>(null)
  const [folderName, setFolderName] = useState('')
  const [folderColor, setFolderColor] = useState('#8b5cf6')

  // Modal de edição de projeto
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<HypeonProjectRecord | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editFolder, setEditFolder] = useState('')

  // Modal de movimentação de pasta
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [itemToMove, setItemToMove] = useState<{
    id: string
    type: 'project' | 'reference'
  } | null>(null)
  const [targetFolder, setTargetFolder] = useState('')

  // Ações em andamento
  const [actionLoading, setActionLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Biblioteca Viral — HYPEON | Prompts Virais'
    if (user) {
      loadAll()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [refsRes, projsRes, foldersRes] = await Promise.all([
        getViralSavedReferences(1, 100),
        listHypeonProjects(),
        listHypeonFolders(),
      ])
      setReferences(refsRes.items || [])
      setProjects(projsRes || [])
      setFolders(foldersRes || [])
    } catch (err) {
      console.warn('[HypeonBiblioteca] Erro ao carregar biblioteca:', err)
    } finally {
      setLoading(false)
    }
  }

  // Cópia segura para área de transferência
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
        title: 'Copiado para a área de transferência! 🎉',
        description: 'Texto pronto para usar.',
      })
      setTimeout(() => setCopiedId(null), 2500)
    } catch (_) {
      toast({
        title: 'Não foi possível copiar',
        description: 'Tente selecionar o texto manualmente.',
        variant: 'destructive',
      })
    }
  }

  // Operações com Pastas
  const handleOpenCreateFolder = () => {
    setEditingFolder(null)
    setFolderName('')
    setFolderColor('#8b5cf6')
    setFolderModalOpen(true)
  }

  const handleOpenEditFolder = (f: HypeonFolderRecord, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingFolder(f)
    setFolderName(f.name)
    setFolderColor(f.color || '#8b5cf6')
    setFolderModalOpen(true)
  }

  const handleSaveFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: 'Nome da pasta obrigatório',
        description: 'Digite um nome para a pasta.',
        variant: 'destructive',
      })
      return
    }

    setActionLoading(true)
    try {
      if (editingFolder) {
        const updated = await updateHypeonFolder(editingFolder.id, {
          name: folderName.trim(),
          color: folderColor,
        })
        setFolders((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
        toast({ title: 'Pasta atualizada com sucesso!' })
      } else {
        const created = await createHypeonFolder(folderName.trim(), folderColor)
        setFolders((prev) => [...prev, created])
        toast({ title: 'Pasta criada com sucesso!' })
      }
      setFolderModalOpen(false)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar pasta',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (
      !confirm(
        'Deseja excluir esta pasta? Os itens não serão deletados, apenas movidos para a raiz.',
      )
    ) {
      return
    }

    try {
      await deleteHypeonFolder(folderId)
      setFolders((prev) => prev.filter((f) => f.id !== folderId))
      if (activeFolderId === folderId) setActiveFolderId('all')

      // Atualiza estado local removendo a pasta dos itens
      setProjects((prev) => prev.map((p) => (p.folder === folderId ? { ...p, folder: '' } : p)))
      setReferences((prev) => prev.map((r) => (r.folder === folderId ? { ...r, folder: '' } : r)))

      toast({ title: 'Pasta excluída com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir pasta',
        description: err?.message || 'Falha ao remover.',
        variant: 'destructive',
      })
    }
  }

  // Operações de Edição de Projeto
  const handleOpenEditProject = (p: HypeonProjectRecord) => {
    setEditingProject(p)
    setEditTitle(p.title)
    setEditNotes(p.notes || '')
    setEditFolder(p.folder || '')
    setEditProjectModalOpen(true)
  }

  const handleSaveProjectEdit = async () => {
    if (!editingProject) return
    setActionLoading(true)
    try {
      const updated = await updateHypeonProject(editingProject.id, {
        title: editTitle.trim() || editingProject.title,
        notes: editNotes.trim(),
        folder: editFolder,
      })
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditProjectModalOpen(false)
      toast({ title: 'Projeto atualizado com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar projeto',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Duplicação de Projeto
  const handleDuplicateProject = async (p: HypeonProjectRecord) => {
    try {
      const duplicated = await duplicateHypeonProject(p)
      setProjects((prev) => [duplicated, ...prev])
      toast({
        title: 'Projeto duplicado com sucesso! 📑',
        description: `Criada uma cópia de "${p.title}".`,
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao duplicar',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  // Exclusão de Projeto
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Deseja realmente excluir este projeto?')) return
    try {
      await deleteHypeonProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast({ title: 'Projeto excluído com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  // Exclusão de Referência Viral
  const handleDeleteReference = async (id: string) => {
    if (!confirm('Deseja remover esta referência da biblioteca?')) return
    try {
      await removeViralSavedReference(id)
      setReferences((prev) => prev.filter((r) => r.id !== id))
      toast({ title: 'Referência removida com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao remover',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  // Mover item para pasta
  const handleOpenMoveModal = (id: string, type: 'project' | 'reference') => {
    setItemToMove({ id, type })
    if (type === 'project') {
      const p = projects.find((x) => x.id === id)
      setTargetFolder(p?.folder || '')
    } else {
      const r = references.find((x) => x.id === id)
      setTargetFolder(r?.folder || '')
    }
    setMoveModalOpen(true)
  }

  const handleApplyMove = async () => {
    if (!itemToMove) return
    setActionLoading(true)
    try {
      if (itemToMove.type === 'project') {
        const updated = await updateHypeonProject(itemToMove.id, {
          folder: targetFolder,
        })
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      } else {
        const updated = await updateViralSavedReference(itemToMove.id, {
          folder: targetFolder,
        })
        setReferences((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      }
      setMoveModalOpen(false)
      toast({
        title: 'Item movido com sucesso! 📁',
        description: targetFolder
          ? `Movido para "${folders.find((f) => f.id === targetFolder)?.name || 'Pasta'}"`
          : 'Movido para a raiz (sem pasta).',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao mover item',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Extrair texto copiável do projeto
  const getProjectCopyableText = (p: HypeonProjectRecord) => {
    const payload = typeof p.payload === 'string' ? JSON.parse(p.payload) : p.payload
    if (!payload) return p.title

    if (payload.full_script) return `${p.title}\n\n${payload.full_script}`
    if (payload.full_story) return `${p.title}\n\n${payload.full_story}`
    if (payload.narration) return `${p.title}\n\n${payload.narration}`
    if (payload.scenes && Array.isArray(payload.scenes)) {
      return payload.scenes
        .map(
          (s: any) =>
            `Cena ${s.scene_number || ''} (${s.duration || ''}):\nVisual: ${s.visual_description || ''}\nPrompt Imagem: ${s.image_prompt || ''}\nPrompt Vídeo: ${s.video_prompt || ''}\nNarração: ${s.narration || s.voiceover || ''}`,
        )
        .join('\n\n')
    }
    if (payload.ideas && Array.isArray(payload.ideas)) {
      return payload.ideas
        .map((i: any) => `• ${i.title}\nGancho: ${i.hook}\n${i.summary}`)
        .join('\n\n')
    }
    return JSON.stringify(payload, null, 2)
  }

  // Enviar projeto para o Criador de Cenas
  const handleSendToCenas = (p: HypeonProjectRecord) => {
    const payload = typeof p.payload === 'string' ? JSON.parse(p.payload) : p.payload
    const script = payload?.full_script || payload?.full_story || payload?.narration || p.title
    navigate('/hypeon/cenas', {
      state: {
        prefillScript: script,
        prefillTitle: p.title,
      },
    })
  }

  // Enviar para gerador de imagens do site
  const handleSendToImagePrompt = (p: HypeonProjectRecord) => {
    const payload = typeof p.payload === 'string' ? JSON.parse(p.payload) : p.payload
    let firstImagePrompt = ''
    if (payload?.scenes && Array.isArray(payload.scenes) && payload.scenes[0]?.image_prompt) {
      firstImagePrompt = payload.scenes[0].image_prompt
    } else {
      firstImagePrompt = p.title
    }

    navigate('/virais', {
      state: {
        prefillPrompt: firstImagePrompt,
        tab: 'image_prompt',
      },
    })
  }

  // Filtragem unificada
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Filtro de pasta
      if (activeFolderId !== 'all') {
        if (activeFolderId === 'unorganized') {
          if (p.folder) return false
        } else if (p.folder !== activeFolderId) {
          return false
        }
      }

      // Filtro de tipo de ferramenta
      if (projectTypeFilter !== 'all' && p.tool_id !== projectTypeFilter) {
        return false
      }

      // Busca por palavra-chave
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchTitle = (p.title || '').toLowerCase().includes(query)
        const matchCategory = (p.category || '').toLowerCase().includes(query)
        const matchNotes = (p.notes || '').toLowerCase().includes(query)
        return matchTitle || matchCategory || matchNotes
      }

      return true
    })
  }, [projects, activeFolderId, projectTypeFilter, searchTerm])

  const filteredReferences = useMemo(() => {
    return references.filter((r) => {
      // Filtro de pasta
      if (activeFolderId !== 'all') {
        if (activeFolderId === 'unorganized') {
          if (r.folder) return false
        } else if (r.folder !== activeFolderId) {
          return false
        }
      }

      // Busca por palavra-chave
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchTitle = (r.title || '').toLowerCase().includes(query)
        const matchAuthor = (r.author_name || '').toLowerCase().includes(query)
        const matchNotes = (r.notes || '').toLowerCase().includes(query)
        return matchTitle || matchAuthor || matchNotes
      }

      return true
    })
  }, [references, activeFolderId, searchTerm])

  const formatNumber = (num?: number | null) => {
    if (num === null || num === undefined) return '-'
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return String(num)
  }

  const getToolBadgeInfo = (toolId: string) => {
    switch (toolId) {
      case 'clonador':
        return { label: 'Clonador Viral', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' }
      case 'stories':
        return { label: 'Stories', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
      case 'ideas':
        return { label: 'Ideas', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
      case 'cenas':
        return {
          label: 'Criador de Cenas',
          color: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
        }
      case 'analisador':
        return {
          label: 'Analisador',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        }
      default:
        return { label: toolId, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' }
    }
  }

  const activeFolderName =
    activeFolderId === 'all'
      ? 'Todos os Itens'
      : activeFolderId === 'unorganized'
        ? 'Sem Pasta (Raiz)'
        : folders.find((f) => f.id === activeFolderId)?.name || 'Pasta'

  return (
    <HypeonLayout
      title="Biblioteca Viral"
      description="Gerencie pastas personalizadas, projetos gerados, roteiros, ideias, cenas prontas e referências salvas."
      badge="Central de Ativos"
    >
      <div className="space-y-6">
        {/* Cabeçalho com ações principais */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Bookmark className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Biblioteca Viral Completa
              </h1>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {projects.length + references.length} itens salvos
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Pastas, projetos em andamento, roteiros originais, prompts de imagem/vídeo e vídeos de
              referência.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={handleOpenCreateFolder}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-xs gap-1.5 h-9"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Nova Pasta</span>
            </Button>

            <Link to="/hypeon/cenas">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs h-9 gap-1.5"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Criar Cenas</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de Busca e Abas Superiores */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Abas: Todos / Projetos / Referências */}
            <div className="inline-flex p-1 rounded-xl bg-black/60 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`py-1.5 px-3 rounded-lg font-medium transition ${
                  activeTab === 'all'
                    ? 'bg-primary text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todos ({projects.length + references.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`py-1.5 px-3 rounded-lg font-medium transition ${
                  activeTab === 'projects'
                    ? 'bg-primary text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Projetos & Roteiros ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('references')}
                className={`py-1.5 px-3 rounded-lg font-medium transition ${
                  activeTab === 'references'
                    ? 'bg-primary text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Vídeos de Referência ({references.length})
              </button>
            </div>

            {/* Input de Busca */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Pesquisar por título, nicho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 bg-black/60 border-white/15 text-white placeholder:text-zinc-500 text-xs h-9"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Barra de Pastas Personalizadas (Horizontal Scroll) */}
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-primary" />
                Suas Pastas ({folders.length}):
              </span>
              <button
                onClick={handleOpenCreateFolder}
                className="text-[11px] text-primary hover:underline font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Criar Pasta
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setActiveFolderId('all')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeFolderId === 'all'
                    ? 'border-primary bg-primary/20 text-white font-semibold'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Todas as Pastas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolderId('unorganized')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeFolderId === 'unorganized'
                    ? 'border-primary bg-primary/20 text-white font-semibold'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sem Pasta</span>
              </button>

              {folders.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setActiveFolderId(f.id)}
                  className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-2 cursor-pointer group ${
                    activeFolderId === f.id
                      ? 'border-primary bg-primary/20 text-white font-semibold'
                      : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: f.color || '#8b5cf6' }}
                  />
                  <span>{f.name}</span>
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditFolder(f, e)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white p-0.5 rounded"
                    title="Editar pasta"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteFolder(f.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-0.5 rounded"
                    title="Excluir pasta"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro por tipo de ferramenta quando na aba de projetos */}
          {activeTab !== 'references' && (
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-zinc-400 pt-1">
              <span className="shrink-0 font-medium text-zinc-500">Filtrar por tipo:</span>
              <button
                type="button"
                onClick={() => setProjectTypeFilter('all')}
                className={`px-2 py-0.5 rounded border ${
                  projectTypeFilter === 'all'
                    ? 'border-primary text-primary font-bold'
                    : 'border-white/10 hover:text-white'
                }`}
              >
                Todos os tipos
              </button>
              {(['clonador', 'cenas', 'stories', 'ideas', 'analisador'] as ProjectTypeFilter[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setProjectTypeFilter(t)}
                    className={`px-2 py-0.5 rounded border ${
                      projectTypeFilter === t
                        ? 'border-primary text-primary font-bold'
                        : 'border-white/10 hover:text-white'
                    }`}
                  >
                    {t === 'cenas' ? 'Criador de Cenas' : t.toUpperCase()}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">Carregando sua biblioteca...</p>
          </div>
        ) : !user ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-950/60 border border-white/10 space-y-4">
            <Bookmark className="w-10 h-10 text-primary mx-auto" />
            <h3 className="text-base font-bold text-white">Faça login para salvar seus projetos</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Crie pastas, organize roteiros, prompts de imagem e referências na nuvem.
            </p>
            <Link to="/login">
              <Button className="bg-primary text-white text-xs font-semibold">
                Entrar na Conta
              </Button>
            </Link>
          </div>
        ) : filteredProjects.length === 0 && filteredReferences.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-950/60 border border-white/10 space-y-4">
            <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Nenhum item encontrado</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {searchTerm
                ? `Nenhum resultado para "${searchTerm}" na pasta selecionada.`
                : 'Crie seu primeiro roteiro no Clonador ou no Criador de Cenas para começar seu acervo!'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Link to="/hypeon/cenas">
                <Button size="sm" className="bg-primary text-white text-xs font-semibold">
                  Criar Cenas com IA
                </Button>
              </Link>
              <Link to="/hypeon/radar">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/15 text-xs text-zinc-300"
                >
                  Explorar Radar
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* SEÇÃO 1: PROJETOS E ROTEIROS */}
            {(activeTab === 'all' || activeTab === 'projects') && filteredProjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Projetos & Roteiros ({filteredProjects.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((p) => {
                    const badgeInfo = getToolBadgeInfo(p.tool_id)
                    const copyText = getProjectCopyableText(p)
                    const folderObj = folders.find((f) => f.id === p.folder)

                    return (
                      <Card
                        key={p.id}
                        className="bg-zinc-950/80 border-white/10 hover:border-white/20 transition flex flex-col justify-between p-4 space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant="outline" className={`text-[10px] ${badgeInfo.color}`}>
                              {badgeInfo.label}
                            </Badge>
                            {folderObj && (
                              <Badge
                                variant="outline"
                                className="text-[10px] border-white/15 text-zinc-400 flex items-center gap-1"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: folderObj.color || '#8b5cf6' }}
                                />
                                {folderObj.name}
                              </Badge>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                            {p.title}
                          </h4>

                          {p.category && (
                            <p className="text-[11px] text-zinc-400 truncate">
                              Categoria: <span className="text-zinc-200">{p.category}</span>
                            </p>
                          )}

                          {p.notes && (
                            <p className="text-[11px] text-zinc-400 italic bg-black/40 p-2 rounded border border-white/5 line-clamp-2">
                              "{p.notes}"
                            </p>
                          )}

                          <span className="text-[10px] text-zinc-500 block">
                            Salvo em {p.created ? p.created.slice(0, 10) : ''}
                          </span>
                        </div>

                        {/* Botões de Ação */}
                        <div className="pt-2 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(copyText, p.id)}
                              className="h-7 text-[11px] text-zinc-400 hover:text-white px-2"
                              title="Copiar conteúdo"
                            >
                              {copiedId === p.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 mr-1" />
                              )}
                              Copiar
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicateProject(p)}
                              className="h-7 text-[11px] text-zinc-400 hover:text-white px-2"
                              title="Duplicar projeto"
                            >
                              <Copy className="w-3.5 h-3.5 mr-1" /> Duplicar
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenMoveModal(p.id, 'project')}
                              className="h-7 text-[11px] text-zinc-400 hover:text-white px-2"
                              title="Mover para pasta"
                            >
                              <Folder className="w-3.5 h-3.5 mr-1" /> Mover
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditProject(p)}
                              className="h-7 text-[11px] text-zinc-400 hover:text-white px-2"
                              title="Editar notas/título"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProject(p.id)}
                              className="h-7 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          {/* Atalhos para Ferramentas Existentes */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendToCenas(p)}
                              className="h-7 text-[10px] border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                            >
                              <Film className="w-3 h-3 mr-1" /> Gerar Cenas
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendToImagePrompt(p)}
                              className="h-7 text-[10px] border-pink-500/30 text-pink-300 hover:bg-pink-500/20"
                            >
                              <Sparkles className="w-3 h-3 mr-1" /> Gerar Prompts
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SEÇÃO 2: REFERÊNCIAS VIRAIS */}
            {(activeTab === 'all' || activeTab === 'references') &&
              filteredReferences.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400" />
                      Vídeos de Referência ({filteredReferences.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReferences.map((ref) => {
                      const folderObj = folders.find((f) => f.id === ref.folder)
                      return (
                        <Card
                          key={ref.id}
                          className="bg-zinc-950/80 border-white/10 hover:border-white/20 transition flex flex-col justify-between overflow-hidden"
                        >
                          <div className="relative aspect-video bg-black/60 overflow-hidden">
                            {ref.thumbnail_url ? (
                              <img
                                src={ref.thumbnail_url}
                                alt={ref.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                <Video className="w-10 h-10" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <Badge className="bg-black/80 text-white text-[10px] uppercase border-0">
                                {ref.platform}
                              </Badge>
                              {folderObj && (
                                <Badge
                                  variant="outline"
                                  className="bg-black/80 text-[10px] border-white/20 text-white flex items-center gap-1"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: folderObj.color || '#8b5cf6' }}
                                  />
                                  {folderObj.name}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <CardHeader className="p-4 space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400">
                              <span className="font-semibold text-purple-300 truncate max-w-[150px]">
                                {ref.author_name || 'Criador'}
                              </span>
                              <span>{ref.created ? ref.created.slice(0, 10) : ''}</span>
                            </div>
                            <CardTitle className="text-sm font-bold text-white line-clamp-2">
                              {ref.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-3 gap-1.5 p-2 rounded bg-black/40 border border-white/5 text-center text-[11px]">
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Views</span>
                                <strong className="text-white">
                                  {formatNumber(ref.views_count)}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Likes</span>
                                <strong className="text-white">
                                  {formatNumber(ref.likes_count)}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Coment.</span>
                                <strong className="text-white">
                                  {formatNumber(ref.comments_count)}
                                </strong>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-3 border-t border-white/10 flex items-center justify-between gap-1 bg-black/30">
                            <a
                              href={ref.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white"
                            >
                              <span>Original</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenMoveModal(ref.id, 'reference')}
                                className="h-7 text-[11px] text-zinc-400 hover:text-white px-2"
                                title="Mover para pasta"
                              >
                                <Folder className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteReference(ref.id)}
                                className="h-7 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2"
                                title="Remover"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* MODAL: CRIAR OU EDITAR PASTA */}
        <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-primary" />
                {editingFolder ? 'Editar Pasta' : 'Criar Nova Pasta'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Nome da Pasta *</Label>
                <Input
                  placeholder="Ex: Histórias de Terror, Comerciais TikTok, Ideias 2026..."
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="bg-black/60 border-white/15 text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Cor da Pasta</Label>
                <div className="flex items-center gap-2">
                  {['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFolderColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        folderColor === c
                          ? 'border-white scale-110'
                          : 'border-transparent opacity-80'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFolderModalOpen(false)}
                className="border-white/15 text-xs text-zinc-300"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveFolder}
                disabled={actionLoading}
                className="bg-primary text-white text-xs font-semibold"
              >
                {actionLoading ? 'Salvando...' : 'Salvar Pasta'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL: EDITAR PROJETO (Título, Notas e Pasta) */}
        <Dialog open={editProjectModalOpen} onOpenChange={setEditProjectModalOpen}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                Editar Projeto
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Título do Projeto</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-black/60 border-white/15 text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Pasta</Label>
                <select
                  value={editFolder}
                  onChange={(e) => setEditFolder(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="">-- Sem pasta (Raiz) --</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Anotações Pessoais</Label>
                <Textarea
                  placeholder="Observações, tags ou notas sobre a produção..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="bg-black/60 border-white/15 text-white text-xs resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditProjectModalOpen(false)}
                className="border-white/15 text-xs text-zinc-300"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProjectEdit}
                disabled={actionLoading}
                className="bg-primary text-white text-xs font-semibold"
              >
                {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL: MOVER ITEM PARA PASTA */}
        <Dialog open={moveModalOpen} onOpenChange={setMoveModalOpen}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Folder className="w-4 h-4 text-primary" />
                Mover para Pasta
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Label className="text-xs text-zinc-300">Escolha a pasta de destino:</Label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="">-- Sem pasta (Raiz) --</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMoveModalOpen(false)}
                className="border-white/15 text-xs text-zinc-300"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleApplyMove}
                disabled={actionLoading}
                className="bg-primary text-white text-xs font-semibold"
              >
                {actionLoading ? 'Movendo...' : 'Mover Agora'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </HypeonLayout>
  )
}

export default HypeonBiblioteca
