import pb from '@/lib/pocketbase/client'

export interface TranscribeMediaParams {
  mediaBase64: string
  mimeType: string
  sourceLang?: string
  targetLang?: string
  mediaName?: string
}

export interface TranscribeMediaResponse {
  success: boolean
  model_used: string
  detected_language: string
  language_code: string
  original_transcription: string
  translated_transcription: string
  duration_estimation?: string
  notes?: string
  target_lang: string
  media_name: string
}

export const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', label: 'Português Brasileiro' },
  { code: 'en-US', label: 'Inglês' },
  { code: 'es-ES', label: 'Espanhol' },
  { code: 'de-DE', label: 'Alemão' },
  { code: 'fr-FR', label: 'Francês' },
  { code: 'it-IT', label: 'Italiano' },
  { code: 'ja-JP', label: 'Japonês' },
  { code: 'zh-CN', label: 'Chinês Mandarim' },
  { code: 'ru-RU', label: 'Russo' },
]

export const SOURCE_LANGUAGES = [
  { code: 'auto', label: 'Detecção Automática (Recomendado)' },
  { code: 'en', label: 'Inglês' },
  { code: 'es', label: 'Espanhol' },
  { code: 'de', label: 'Alemão' },
  { code: 'fr', label: 'Francês' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: 'Japonês' },
  { code: 'zh', label: 'Chinês' },
  { code: 'pt', label: 'Português' },
]

/**
 * Envia o arquivo de áudio ou vídeo para transcrição e tradução no backend.
 */
export async function transcribeAndTranslateMedia(
  params: TranscribeMediaParams,
): Promise<TranscribeMediaResponse> {
  const payload = {
    media_base64: params.mediaBase64,
    mime_type: params.mimeType,
    source_lang: params.sourceLang || 'auto',
    target_lang: params.targetLang || 'Português Brasileiro',
    media_name: params.mediaName || 'arquivo',
  }

  const response = await pb.send<TranscribeMediaResponse>('/backend/v1/viral-tools/transcribe', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}
