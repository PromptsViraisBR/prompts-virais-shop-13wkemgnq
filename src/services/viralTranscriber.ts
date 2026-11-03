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

export class TranscriberAuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'TranscriberAuthError'
    this.status = status
  }
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
 * Transporte autenticado para os endpoints /backend/v1 (mesma política do servidor:
 * cabeçalho Authorization com o token cru — sem prefixo Bearer).
 * Tenta restaurar a sessão de forma transparente se o token local estiver ausente
 * (por exemplo, limpo por um auto-refresh falho) e devolve um erro de autenticação
 * tipado quando o gateway responde 401, para a UI abrir o modal de login.
 */
async function callAuthenticatedBackend<T>(
  path: string,
  init: { method: 'POST'; body: string },
  signal?: AbortSignal,
): Promise<T> {
  const baseUrl = (import.meta.env.VITE_POCKETBASE_URL || pb.baseUrl || '').replace(/\/$/, '')

  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    const token = pb.authStore.token
    if (token) {
      headers.Authorization = token
    }
    return headers
  }

  // 1ª tentativa: token atual (se existir)
  if (pb.authStore.token) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: buildHeaders(),
        signal,
      })
      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>

      if (response.ok) {
        return data as T
      }

      if (response.status === 401 || response.status === 403) {
        // Token inválido/expirado: limpa a sessão local corrompida antes de falhar
        try {
          pb.authStore.clear()
        } catch {
          /* ignore */
        }
        throw new TranscriberAuthError(
          'Sua sessão expirou. Entre novamente na sua conta para transcrever.',
          response.status,
        )
      }

      if (!data || !(data as any).error) {
        // 401 silencioso do gateway (sem corpo): sessão não chegou ao servidor
        throw new TranscriberAuthError(
          'Sua sessão expirou. Entre novamente na sua conta para transcrever.',
          response.status,
        )
      }
      throw new Error(
        (data && (data.error as string)) ||
          `Não foi possível transcrever agora (HTTP ${response.status}).`,
      )
    } catch (err: any) {
      if (err instanceof TranscriberAuthError) throw err
      if (err?.name === 'AbortError') throw err
      // Falha de rede/transporte na 1ª token-based attempt: cai para a 2ª abaixo
    }
  }

  // 2ª tentativa: restabelece a sessão a partir do armazenamento local e reenvia
  try {
    await pb.collection('users').authRefresh()
  } catch {
    // Sem sessão válida possível — se houve token, o erro de auth já foi lançado acima
    if (pb.authStore.token) {
      try {
        pb.authStore.clear()
      } catch {
        /* ignore */
      }
      throw new TranscriberAuthError(
        'Sua sessão expirou. Entre novamente na sua conta para transcrever.',
        401,
      )
    }
    throw new TranscriberAuthError(
      'Você precisa estar logado para usar o Transcritor. Faça login ou crie sua conta gratuita.',
      401,
    )
  }

  try {
    const retry = await fetch(`${baseUrl}${path}`, { ...init, headers: buildHeaders(), signal })
    const data = (await retry.json().catch(() => ({}))) as Record<string, unknown>

    if (retry.ok) {
      return data as T
    }

    if (retry.status === 401 || retry.status === 403) {
      throw new TranscriberAuthError(
        'Sua sessão expirou. Entre novamente na sua conta para transcrever.',
        retry.status,
      )
    }

    throw new Error(
      (data && (data.error as string)) ||
        `Não foi possível transcrever agora (HTTP ${retry.status}).`,
    )
  } catch (err: any) {
    if (err instanceof TranscriberAuthError || err?.name === 'AbortError') throw err
    throw new Error(
      'Falha de conexão com o servidor de transcrição. Verifique sua internet e tente novamente.',
    )
  }
}

/**
 * Envia o arquivo de áudio ou vídeo para transcrição e tradução no backend.
 * Lança TranscriberAuthError quando a sessão está ausente ou expirada.
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

  return callAuthenticatedBackend<TranscribeMediaResponse>('/backend/v1/viral-tools/transcribe', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
