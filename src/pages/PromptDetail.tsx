import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPromptById } from '@/services/prompts'
import { toggleFavorite, isPromptFavorited } from '@/services/favorites'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Copy,
  Check,
  Heart,
  ArrowLeft,
  Lock,
  Sparkles,
  Video,
  ShoppingBag,
  Share2,
  Crown,
  CheckCircle2,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

export const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState<PromptRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (!id) return

    loadPrompt(id)
  }, [id, user])

  const loadPrompt = async (promptId: string) => {
    setLoading(true)
    try {
      const data = await getPromptById(promptId)
      setPrompt(data)

      if (user) {
        const fav = await isPromptFavorited(user.id, promptId)
        setIsFav(fav)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Prompt não encontrado',
        description: 'O roteiro solicitado não existe ou foi removido.',
        variant: 'destructive',
      })
      navigate('/biblioteca')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!prompt) return

    if (!prompt.is_free && !isPaidPlan) {
      toast({
        title: 'Conteúdo Exclusivo do Plano Pago',
        description: 'Faça upgrade para o plano Mensal ou Anual para copiar este roteiro completo.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    navigator.clipboard.writeText(prompt.prompt_text)
    setCopied(true)
    toast({
      title: 'Prompt copiado com sucesso! 📋',
      description: 'Pronto para você gravar ou ajustar com as peças do seu catálogo.',
    })

    setTimeout(() => setCopied(false), 2500)
  }

  const handleToggleFav = async () => {
    if (!prompt) return
    if (!user) {
      toast({
        title: 'Faça login para favoritar',
        description: 'Salve seus roteiros preferidos na sua conta.',
      })
      navigate('/login')
      return
    }

    try {
      const result = await toggleFavorite(user.id, prompt.id)
      setIsFav(result)
      toast({
        title: result ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      })
    } catch (err) {
      toast({
        title: 'Erro ao favoritar',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando roteiro...</p>
      </div>
    )
  }

  if (!prompt) {
    return null
  }

  const isLocked = !prompt.is_free && !isPaidPlan

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Botão voltar */}
      <div className="flex items-center justify-between">
        <Link to="/biblioteca">
          <Button variant="ghost" size="sm" className="gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Biblioteca
          </Button>
        </Link>

        <Button variant="outline" size="sm" onClick={handleToggleFav} className="gap-2">
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          {isFav ? 'Favoritado' : 'Favoritar'}
        </Button>
      </div>

      {/* Header do Prompt */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-semibold text-xs">
            {NICHE_LABELS[prompt.niche] || prompt.niche}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Video className="w-3 h-3 text-pink-500" />
            {STYLE_LABELS[prompt.style] || prompt.style}
          </Badge>
          {prompt.platform && (
            <Badge variant="outline" className="text-xs">
              {PLATFORM_LABELS[prompt.platform]}
            </Badge>
          )}
          {prompt.is_free ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold">
              Gratuito
            </Badge>
          ) : (
            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-bold">
              Premium PRO
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {prompt.title}
        </h1>

        {prompt.description && (
          <p className="text-base text-muted-foreground leading-relaxed">{prompt.description}</p>
        )}
      </div>

      {/* Destaques: Gancho e Chamada de Ação */}
      {(prompt.hook || prompt.call_to_action) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prompt.hook && (
            <div className="p-4 rounded-xl border bg-pink-500/5 border-pink-500/20 space-y-1.5">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gancho Viral (Hook 0-3s)
              </span>
              <p className="text-sm font-medium italic text-foreground">"{prompt.hook}"</p>
            </div>
          )}

          {prompt.call_to_action && (
            <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20 space-y-1.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Call To Action (Conversão no Carrinho)
              </span>
              <p className="text-sm font-medium italic text-foreground">
                "{prompt.call_to_action}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Caixa do Prompt Completo */}
      <Card className="border shadow-lg relative overflow-hidden">
        <CardHeader className="bg-muted/40 border-b flex flex-row items-center justify-between py-3.5 px-4 sm:px-6">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Roteiro Completo para Gravação
          </CardTitle>

          <Button
            size="sm"
            onClick={handleCopy}
            className={`gap-1.5 font-semibold text-xs ${
              isLocked
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gradient-to-r from-pink-600 to-amber-500 text-white'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Desbloquear no PRO
              </>
            ) : copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Roteiro Completo
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 relative">
          {isLocked ? (
            <div className="space-y-4">
              {/* Blur preview */}
              <div className="filter blur-sm select-none opacity-40 font-mono text-xs sm:text-sm space-y-2 pointer-events-none">
                <p>[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]</p>
                <p>
                  🎬 CENA 1 (0-3s) - O GANCHO VISUAL (HOOK): Câmera em primeira pessoa se
                  arrumando...
                </p>
                <p>
                  🎬 CENA 2 (3-9s) - DETALHES DE TECIDO E COSTURA REFORÇADA: Close na cintura
                  modelada...
                </p>
                <p>
                  🎬 CENA 3 (9-14s) - VERSATILIDADE E PROVA SOCIAL: Borrifando perfume e calçado...
                </p>
                <p>🎬 CENA 4 (14-18s) - CALL TO ACTION: Apontando para o carrinho amarelo...</p>
              </div>

              {/* Overlay de bloqueio */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="font-extrabold text-lg text-foreground">
                    Este roteiro é exclusivo para assinantes PRO
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Assine o plano Mensal ou Anual para desbloquear todos os roteiros da biblioteca
                    e o gerador personalizado para as roupas da sua loja.
                  </p>
                </div>
                <Link to="/planos">
                  <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold">
                    <Crown className="w-4 h-4 mr-2" />
                    Ver Planos e Assinar
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 border rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground select-all">
              {prompt.prompt_text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dicas de Execução para Criadores */}
      <div className="border rounded-2xl p-6 bg-muted/20 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Como executar esse roteiro com sucesso:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Iluminação frontal:</strong> Use luz natural de frente para a janela ou ring
              light na altura dos olhos.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Primeiros 3 segundos:</strong> Não dê "oi galera", comece direto com o gancho
              visual e texto grande.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Música em alta:</strong> Adicione uma música viral com volume em 10% de fundo
              para reter o público.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-pink-600">•</span>
            <span>
              <strong>Vincule o produto:</strong> Adicione o link direto da vitrine/sacola antes de
              publicar.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
