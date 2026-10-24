import React, { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Video, Sparkles, Play, Image as ImageIcon } from 'lucide-react'
import type { PromptRecord } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

interface PromptAnimatedMediaProps {
  prompt: PromptRecord
  isHovered: boolean
  isFav: boolean
  onToggleFavorite: (e: React.MouseEvent) => void
  aspectClassName?: string
  priority?: boolean
  showBadgeOverlays?: boolean
}

export const PromptAnimatedMedia: React.FC<PromptAnimatedMediaProps> = ({
  prompt,
  isHovered,
  isFav,
  onToggleFavorite,
  aspectClassName = 'aspect-[16/10] sm:aspect-[16/11]',
  priority = false,
  showBadgeOverlays = true,
}) => {
  const [videoError, setVideoError] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // IntersectionObserver para lazy loading inteligente do vídeo e imagem
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px' },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const hasVideo = Boolean(prompt.reference_video_url && !videoError)
  const hasImage = Boolean(prompt.reference_image_url && !imageError)

  // Controlar reprodução do vídeo: toca no hover (ou sempre se em detalhe)
  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasVideo) return

    if (isHovered) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay pode ter sido bloqueado pelo navegador
        })
      }
    } else {
      video.pause()
      // Opcional: rebobina suavemente
      try {
        video.currentTime = 0
      } catch {
        /* intentionally ignored */
      }
    }
  }, [isHovered, hasVideo])

  const fallbackColor =
    prompt.niche === 'moda_feminina'
      ? 'from-pink-500/20 via-rose-500/10 to-transparent'
      : prompt.niche === 'fitness_academia'
        ? 'from-purple-500/20 via-indigo-500/10 to-transparent'
        : prompt.niche === 'moda_praia'
          ? 'from-cyan-500/20 via-teal-500/10 to-transparent'
          : 'from-amber-500/20 via-orange-500/10 to-transparent'

  return (
    <div
      ref={containerRef}
      className={`relative ${aspectClassName} w-full overflow-hidden bg-muted/40 border-b select-none`}
    >
      {/* 1. Camada de Vídeo (se existir) */}
      {hasVideo && isInView && (
        <video
          ref={videoRef}
          src={prompt.reference_video_url}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 pointer-events-none ${
            isHovered && videoLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      )}

      {/* 2. Camada de Imagem Estática (com Ken Burns animation no hover caso não haja vídeo tocando) */}
      {hasImage ? (
        <img
          src={prompt.reference_image_url}
          alt={prompt.title}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out will-change-transform ${
            isHovered ? 'ken-burns-active scale-110' : 'scale-100'
          }`}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${fallbackColor} flex flex-col items-center justify-center p-4 text-center space-y-2`}
        >
          <div className="w-10 h-10 rounded-full bg-background/80 shadow-xs flex items-center justify-center text-pink-500">
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground line-clamp-1">
            Cena de Referência Visual
          </span>
        </div>
      )}

      {/* 3. Indicador animado de "Preview em Movimento" quando em hover */}
      <div
        className={`absolute top-2.5 right-12 z-20 pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
      >
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-600/90 text-white shadow-xs backdrop-blur-xs animate-pulse">
          <Sparkles className="w-2.5 h-2.5" />
          {hasVideo && isHovered ? 'Clip Ativo' : 'Preview Animado'}
        </span>
      </div>

      {/* 4. Gradiente de proteção para textos e badges */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-black/30 pointer-events-none" />

      {/* 5. Badges e ações superiores (se habilitado) */}
      {showBadgeOverlays && (
        <>
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-20">
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold backdrop-blur-md bg-background/80 shadow-xs"
            >
              {NICHE_LABELS[prompt.niche] || prompt.niche}
            </Badge>

            <div className="flex items-center gap-1">
              {prompt.is_free ? (
                <Badge className="bg-emerald-500/90 hover:bg-emerald-600 text-white border-0 text-[10px] font-bold shadow-xs">
                  Gratuito
                </Badge>
              ) : (
                <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white border-0 text-[10px] font-bold shadow-xs">
                  PRO
                </Badge>
              )}

              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full backdrop-blur-md bg-background/80 shadow-xs hover:bg-background"
                onClick={onToggleFavorite}
                aria-label="Favoritar"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    isFav ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Badges inferiores */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/95 font-medium drop-shadow-sm z-20">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs">
              <Video className="w-3 h-3 text-pink-400" />
              {STYLE_LABELS[prompt.style] || prompt.style}
            </span>
            {prompt.platform && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs">
                {PLATFORM_LABELS[prompt.platform]}
              </span>
            )}
          </div>
        </>
      )}

      {/* Dica visual discreta de hover na barra inferior */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-500 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
