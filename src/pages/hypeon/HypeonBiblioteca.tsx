import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { HypeonLayout } from '@/components/hypeon/HypeonLayout'
import {
  getViralSavedReferences,
  removeViralSavedReference,
  ViralSavedRecord,
} from '@/services/hypeon'
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
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const HypeonBiblioteca: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<ViralSavedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Biblioteca Viral — HYPEON | Prompts Virais'
    if (!user) {
      setLoading(false)
      return
    }

    loadSaved()
  }, [user])

  const loadSaved = async () => {
    setLoading(true)
    try {
      const res = await getViralSavedReferences()
      setItems(res.items || [])
    } catch (err: any) {
      console.warn('Erro ao carregar referências salvas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await removeViralSavedReference(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast({
        title: 'Referência removida',
        description: 'O vídeo foi retirado da sua biblioteca viral.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao remover',
        description: err?.message || 'Falha ao remover referência.',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatNumber = (num?: number | null) => {
    if (num === null || num === undefined) return '-'
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return String(num)
  }

  return (
    <HypeonLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bookmark className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Biblioteca Viral</h1>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px] font-mono"
              >
                {items.length} Salvo(s)
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Suas referências de vídeos salvas no Radar Viral para inspiração e novos roteiros.
            </p>
          </div>

          <Link to="/hypeon/radar">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Explorar Radar Viral</span>
            </Button>
          </Link>
        </div>

        {!user ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <Bookmark className="w-10 h-10 text-purple-400 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Faça login para salvar referências
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Ao entrar na sua conta, você pode favoritar qualquer vídeo do Radar e montar seu
              acervo pessoal na nuvem.
            </p>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs h-10 px-5 rounded-xl">
                Entrar na Conta
              </Button>
            </Link>
          </div>
        ) : items.length === 0 && !loading ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Nenhum vídeo salvo ainda</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Vá ao Radar Viral e clique em "Salvar Ref" em qualquer vídeo para começar a montar sua
              biblioteca de inspirações.
            </p>
            <Link to="/hypeon/radar">
              <Button
                variant="outline"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs font-semibold h-10 px-4 rounded-xl"
              >
                Abrir Radar Viral
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden rounded-2xl bg-slate-900/90 border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Video className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <Badge className="bg-slate-950/80 backdrop-blur-md text-white border-0 text-[10px] font-bold uppercase">
                      {item.platform}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-4 space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-purple-300">{item.author_name}</span>
                    <span>{item.created ? item.created.slice(0, 10) : ''}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-white line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Views</span>
                      <strong className="text-white text-xs">
                        {formatNumber(item.views_count)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Likes</span>
                      <strong className="text-white text-xs">
                        {formatNumber(item.likes_count)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Coment.</span>
                      <strong className="text-white text-xs">
                        {formatNumber(item.comments_count)}
                      </strong>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 bg-slate-950/40">
                  <a
                    href={item.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium"
                  >
                    <span>Ver Original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 px-2.5 rounded-lg gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </HypeonLayout>
  )
}
export default HypeonBiblioteca
