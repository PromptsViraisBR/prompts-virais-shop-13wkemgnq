/**
 * Serviço de processamento de vídeo no navegador do usuário
 *
 * Utiliza Canvas / MediaRecorder / WebCodecs / VideoElement para processar
 * vídeos do usuário com privacidade total, sem APIs pagas e sem envio pesado para servidores.
 *
 * Suporta:
 * 1. Desfoque / Máscara suave na região selecionada pelo usuário (tarja de desfoque/cor sobre a legenda)
 * 2. Recorte inteligente (crop) eliminando a área com legenda
 * 3. Preservação de proporção original e taxa de quadros
 * 4. Preservação de áudio sincronizado via AudioContext / MediaStreamDestination
 */

export interface VideoRegion {
  x: number // porcentagem 0-100
  y: number // porcentagem 0-100
  width: number // porcentagem 0-100
  height: number // porcentagem 0-100
}

export interface VideoMetadata {
  duration: number
  width: number
  height: number
  aspectRatio: string
  fileSize: number
  mimeType: string
}

export type ProcessingMode = 'blur' | 'cover' | 'crop'

export interface ProcessVideoOptions {
  videoFile: File
  region: VideoRegion
  mode: ProcessingMode
  onProgress?: (progress: number, statusText: string) => void
}

/**
 * Extrai metadados do vídeo no navegador sem fazer upload.
 */
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 720
      const height = video.videoHeight || 1280
      const duration = video.duration || 0
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
      const divisor = gcd(Math.round(width), Math.round(height))
      const aspectW = Math.round(width / divisor)
      const aspectH = Math.round(height / divisor)

      URL.revokeObjectURL(objectUrl)
      resolve({
        duration,
        width,
        height,
        aspectRatio: `${aspectW}:${aspectH}`,
        fileSize: file.size,
        mimeType: file.type || 'video/mp4',
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível ler as dimensões do vídeo.'))
    }
  })
}

/**
 * Processa o vídeo aplicando a remoção/máscara na área selecionada
 * e preservando o áudio através de MediaStream e MediaRecorder.
 */
export function processVideoCleaning(
  options: ProcessVideoOptions,
): Promise<{ outputBlob: Blob; outputUrl: string; fileName: string }> {
  const { videoFile, region, mode, onProgress } = options

  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        onProgress?.(5, 'Carregando vídeo para processamento local...')

        const video = document.createElement('video')
        video.muted = false
        video.crossOrigin = 'anonymous'
        video.playsInline = true
        const videoUrl = URL.createObjectURL(videoFile)
        video.src = videoUrl

        await new Promise<void>((res, rej) => {
          video.onloadedmetadata = () => res()
          video.onerror = (e) => rej(new Error('Falha ao decodificar mídia.'))
        })

        const origWidth = video.videoWidth || 720
        const origHeight = video.videoHeight || 1280
        const duration = video.duration || 1

        // Configuração do Canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        if (!ctx) {
          throw new Error('Canvas 2D não suportado neste navegador.')
        }

        // Dimensões do canvas dependendo do modo
        let targetWidth = origWidth
        let targetHeight = origHeight
        let cropY = 0

        if (mode === 'crop') {
          // Se a legenda estiver embaixo (y > 50%), corta a parte inferior
          if (region.y > 40) {
            targetHeight = Math.round(origHeight * (region.y / 100))
          } else {
            // Se a legenda estiver no topo, corta a parte superior
            cropY = Math.round(origHeight * ((region.y + region.height) / 100))
            targetHeight = origHeight - cropY
          }
        }

        canvas.width = targetWidth
        canvas.height = targetHeight

        onProgress?.(15, 'Configurando faixas de áudio e vídeo...')

        // Captura da faixa de áudio original
        let audioTrack: MediaStreamTrack | null = null
        let audioCtx: AudioContext | null = null
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
          if (AudioContextClass) {
            audioCtx = new AudioContextClass()
            const sourceNode = audioCtx.createMediaElementSource(video)
            const destNode = audioCtx.createMediaStreamDestination()
            sourceNode.connect(destNode)
            // Também conecta ao destination do audioCtx para manter o fluxo
            sourceNode.connect(audioCtx.destination)
            audioTrack = destNode.stream.getAudioTracks()[0] || null
          }
        } catch (audioErr) {
          console.warn('[VideoCleaner] Áudio não pôde ser roteado via AudioContext:', audioErr)
        }

        // Stream a partir do canvas (30 fps)
        const canvasStream = canvas.captureStream(30)
        const tracks: MediaStreamTrack[] = [canvasStream.getVideoTracks()[0]]
        if (audioTrack) {
          tracks.push(audioTrack)
        }

        const combinedStream = new MediaStream(tracks)

        // Escolha do mimeType com melhor suporte nativo
        let recorderMime = 'video/mp4'
        if (!MediaRecorder.isTypeSupported('video/mp4')) {
          if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
            recorderMime = 'video/webm;codecs=h264'
          } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            recorderMime = 'video/webm;codecs=vp9'
          } else {
            recorderMime = 'video/webm'
          }
        }

        const recorder = new MediaRecorder(combinedStream, {
          mimeType: recorderMime,
          videoBitsPerSecond: 4_500_000, // 4.5 Mbps para alta fidelidade
        })

        const chunks: Blob[] = []
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data)
          }
        }

        recorder.onstop = () => {
          try {
            if (audioCtx && audioCtx.state !== 'closed') {
              audioCtx.close()
            }
          } catch {
            /* intentionally ignored */
          }
          URL.revokeObjectURL(videoUrl)

          const outputBlob = new Blob(chunks, { type: recorderMime })
          const outputUrl = URL.createObjectURL(outputBlob)
          const baseName = videoFile.name.replace(/\.[^/.]+$/, '')
          const extension = recorderMime.includes('mp4') ? 'mp4' : 'webm'
          const fileName = `${baseName}_limpo.${extension}`

          onProgress?.(100, 'Processamento finalizado!')
          resolve({ outputBlob, outputUrl, fileName })
        }

        recorder.onerror = (e) => {
          URL.revokeObjectURL(videoUrl)
          reject(new Error('Erro no gravador de vídeo do navegador.'))
        }

        // Região convertida para pixels absolutos
        const rx = Math.round((region.x / 100) * origWidth)
        const ry = Math.round((region.y / 100) * origHeight)
        const rw = Math.round((region.width / 100) * origWidth)
        const rh = Math.round((region.height / 100) * origHeight)

        recorder.start(100)
        video.currentTime = 0

        // Garante que o AudioContext esteja despausado após gesto do usuário
        if (audioCtx && audioCtx.state === 'suspended') {
          await audioCtx.resume()
        }

        await video.play()

        let animationFrameId: number

        const renderLoop = () => {
          if (video.ended || video.paused) {
            if (recorder.state === 'recording') {
              recorder.stop()
            }
            return
          }

          // Desenha o frame atual
          if (mode === 'crop') {
            // No modo crop, desenha recortando a área indesejada
            ctx.drawImage(video, 0, cropY, origWidth, targetHeight, 0, 0, targetWidth, targetHeight)
          } else {
            // Desenha frame completo
            ctx.drawImage(video, 0, 0, origWidth, origHeight)

            if (mode === 'blur') {
              // Efeito de desfoque inteligente na região da legenda:
              // 1. Salva estado do contexto
              ctx.save()
              // 2. Define região de recorte
              ctx.beginPath()
              ctx.roundRect(rx, ry, rw, rh, 12)
              ctx.clip()

              // 3. Aplica filtro de desfoque proporcional
              ctx.filter = 'blur(14px) brightness(0.95)'
              ctx.drawImage(video, 0, 0, origWidth, origHeight)

              // 4. Suavização sutil de borda
              ctx.restore()
              ctx.save()
              ctx.strokeStyle = 'rgba(0,0,0,0.1)'
              ctx.lineWidth = 1
              ctx.strokeRect(rx, ry, rw, rh)
              ctx.restore()
            } else if (mode === 'cover') {
              // Efeito de caixa de cobertura suave (cor neutra semitransparente)
              ctx.save()
              ctx.fillStyle = 'rgba(15, 23, 42, 0.92)' // slate-900 elegante
              ctx.beginPath()
              ctx.roundRect(rx, ry, rw, rh, 8)
              ctx.fill()
              ctx.restore()
            }
          }

          // Atualização de progresso
          const currentProgress = Math.min(95, Math.round(15 + (video.currentTime / duration) * 80))
          onProgress?.(
            currentProgress,
            `Removendo legenda e codificando MP4 (${Math.round(video.currentTime)}s / ${Math.round(duration)}s)...`,
          )

          animationFrameId = requestAnimationFrame(renderLoop)
        }

        renderLoop()

        video.onended = () => {
          cancelAnimationFrame(animationFrameId)
          if (recorder.state === 'recording') {
            recorder.stop()
          }
        }
      } catch (err) {
        reject(err)
      }
    })()
  })
}
