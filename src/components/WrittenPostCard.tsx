import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Share2, Sparkles, Hash } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export interface WrittenPostCardProps {
  postText: string
  nicheLabel?: string
  title?: string
  className?: string
  compact?: boolean
}

export const WrittenPostCard: React.FC<WrittenPostCardProps> = ({
  postText,
  nicheLabel,
  title = 'Post Escrito (Legenda Pronta)',
  className = '',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!postText) return
    navigator.clipboard.writeText(postText)
    setCopied(true)
    toast({
      title: 'Post Escrito Copiado! 📋✨',
      description:
        'Legenda pronta copiada para a área de transferência. Basta colar com o vídeo e preencher as hashtags!',
    })
    setTimeout(() => setCopied(false), 2500)
  }

  if (!postText) return null

  return (
    <Card
      className={`border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent rounded-3xl overflow-hidden shadow-xs ${className}`}
    >
      <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 py-3 px-4 sm:px-5 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <CardTitle className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                {title}
              </CardTitle>
              {nicheLabel && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-background text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-semibold"
                >
                  {nicheLabel}
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Legenda pronta para colar junto com o vídeo nas redes
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 gap-1.5 shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copiar Post</span>
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        {/* Bloco de instrução sobre os marcadores de hashtag */}
        <div className="p-2.5 rounded-xl bg-background/80 border border-emerald-500/20 text-[11px] text-muted-foreground flex items-center gap-2">
          <Hash className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Marcadores "# ":</strong> As hashtags vêm em branco (com espaço na frente) para
            você preencher apenas com as que preferir!
          </span>
        </div>

        {/* Texto do Post formatado */}
        <div className="bg-background/90 border rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed text-foreground font-sans whitespace-pre-wrap select-all max-h-56 overflow-y-auto">
          {postText}
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Linguagem e gancho calibrados no nicho
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-6 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 p-1"
          >
            {copied ? '✓ Copiado!' : 'Copiar legenda completa →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WrittenPostCard
