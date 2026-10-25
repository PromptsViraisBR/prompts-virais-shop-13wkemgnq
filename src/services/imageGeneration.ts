import pb from '@/lib/pocketbase/client'
import type { ImageEngineMeta, ImageEngineType, GenerationRecord, NicheType } from '@/types'

export interface GenerateImageInput {
  userId: string
  prompt: string
  engine?: ImageEngineType
  referenceFiles?: File[]
  niche?: NicheType
  saveToHistory?: boolean
}

export interface GenerateImageResponse {
  success: boolean
  image_url: string
  engine: ImageEngineType
  source?: string
  prompt?: string
  notice?: string
  generationId?: string
  error?: string
  code?: string
}

export interface ImageEnginesResponse {
  success: boolean
  engines: ImageEngineMeta[]
}

/**
 * Converte File em Data URL (base64)
 */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

/**
 * Consulta os motores de imagem disponíveis no backend
 */
export async function getImageEngines(): Promise<ImageEngineMeta[]> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/image-engines`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
        },
      },
    )

    if (response.ok) {
      const data = (await response.json()) as ImageEnginesResponse
      if (data.success && Array.isArray(data.engines)) {
        return data.engines
      }
    }
  } catch (err) {
    console.warn('Erro ao consultar motores de imagem:', err)
  }

  // Fallback padrão seguro
  return [
    {
      id: 'nano_banana',
      name: 'Nano Banana (Gemini)',
      provider: 'google',
      description: 'Fidelidade facial e preservação estrita de traços e produtos.',
      is_available: true,
      has_key: true,
      badge: 'Recomendado',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT (OpenAI)',
      provider: 'openai',
      description: 'Estética cinematográfica fotorrealista e iluminação apurada.',
      is_available: true,
      has_key: false,
      badge: 'Novo',
    },
  ]
}

/**
 * Chama o backend para gerar imagem via IA exclusiva do Plano PRO
 */
export async function generateViralImage(
  input: GenerateImageInput,
): Promise<GenerateImageResponse> {
  const engine = input.engine || 'nano_banana'

  // Prepara imagens em base64 se houver
  let base64Images: string[] = []
  if (input.referenceFiles && input.referenceFiles.length > 0) {
    try {
      base64Images = await Promise.all(
        input.referenceFiles.slice(0, 3).map((f) => fileToDataUrl(f)),
      )
    } catch (err) {
      console.warn('Erro ao processar imagens para envio:', err)
    }
  }

  const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
    },
    body: JSON.stringify({
      prompt: input.prompt,
      description: input.prompt,
      engine,
      images: base64Images,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMsg = data.error || `Erro ${response.status} ao gerar imagem.`
    return {
      success: false,
      image_url: '',
      engine,
      error: errorMsg,
      code: data.code,
    }
  }

  const imageUrl = data.image_url || ''
  let createdGenId: string | undefined

  // Salvar no histórico (coleção generations)
  if (input.saveToHistory !== false && input.userId && imageUrl) {
    try {
      const niche = input.niche || 'historinhas_frutas'
      if (input.referenceFiles && input.referenceFiles.length > 0) {
        const formData = new FormData()
        formData.append('user', input.userId)
        formData.append('product_name', input.prompt.slice(0, 80))
        formData.append('niche', niche)
        formData.append('style', 'pov')
        formData.append('platform', 'ambos')
        formData.append('target_audience', 'Vídeo Viral Criadores')
        formData.append(
          'generated_prompt',
          `[IMAGEM VIRAL PRO GERADA]\nMotor: ${engine}\nIdeia/Prompt: ${input.prompt}`,
        )
        formData.append('generated_image_url', imageUrl)
        formData.append('image_prompt_description', input.prompt)
        formData.append('video_engine', engine)
        formData.append('engine_mode', 'image_generation_pro')

        input.referenceFiles.slice(0, 3).forEach((file) => {
          formData.append('reference_images', file)
        })

        const rec = await pb.collection('generations').create<GenerationRecord>(formData)
        createdGenId = rec.id
      } else {
        const rec = await pb.collection('generations').create<GenerationRecord>({
          user: input.userId,
          product_name: input.prompt.slice(0, 80),
          niche,
          style: 'pov',
          platform: 'ambos',
          target_audience: 'Vídeo Viral Criadores',
          generated_prompt: `[IMAGEM VIRAL PRO GERADA]\nMotor: ${engine}\nIdeia/Prompt: ${input.prompt}`,
          generated_image_url: imageUrl,
          image_prompt_description: input.prompt,
          video_engine: engine,
          engine_mode: 'image_generation_pro',
        })
        createdGenId = rec.id
      }
    } catch (saveErr) {
      console.warn('Erro ao salvar imagem no histórico de gerações:', saveErr)
    }
  }

  return {
    success: true,
    image_url: imageUrl,
    engine,
    source: data.source,
    prompt: input.prompt,
    notice: data.notice,
    generationId: createdGenId,
  }
}
