export interface WhatsNewItem {
  icon?: string
  badge?: string
  title: string
  description: string
}

export interface VersionRelease {
  version: string
  releaseDate: string
  tagline: string
  headline: string
  highlights: WhatsNewItem[]
  ctaText?: string
  ctaLink?: string
}

/**
 * CONFIGURAÇÃO CENTRAL DE NOVIDADES DA VERSÃO
 * Edite este arquivo para atualizar o modal/banner de novidades que os usuários
 * veem automaticamente quando a versão sobe.
 * Salva no localStorage sob a chave 'pv_last_seen_version'.
 */
export const CURRENT_VERSION = 'v0.0.95'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-11-04',
  tagline: 'PROMPTS VIRAIS — Suas ferramentas práticas para acelerar conteúdos virais.',
  headline: 'v0.0.95 — Transcritor Corrigido com Modelo de IA Atualizado! 🎙️⚡',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'IA ATUALIZADA',
      title: 'Transcritor 100% Operacional',
      description:
        'O Transcritor e Tradutor Viral foi atualizado para os novos modelos de IA multimodal de alta velocidade (família Gemini 3.x), restaurando a transcrição de áudios e vídeos com máxima fidelidade e zero erros de modelo desativado.',
    },
    {
      icon: 'languages',
      badge: 'DUPLA SAÍDA',
      title: 'Transcrição Original e Tradução Natural',
      description:
        'Envie seus vídeos ou áudios em qualquer idioma e receba a transcrição fiel na íntegra acompanhada da tradução coloquial para Português, ideal para gravar uma nova narração de alta conversão.',
    },
    {
      icon: 'shield',
      badge: 'DIAGNÓSTICOS CLAROS',
      title: 'Mensagens de Status Específicas',
      description:
        'Avisos de processamento agora detalham exatamente se houve tempo esgotado, alta demanda ou formato incompatível, eliminando mensagens genéricas e oferecendo total transparência.',
    },
    {
      icon: 'zap',
      badge: 'COMPATIBILIDADE',
      title: 'Compatível com MP3, WAV, MP4 e WebM',
      description:
        'Suporte direto a arquivos da galeria ou downloads de até 25MB, com cópia em 1 clique e exportação de relatório completo em arquivo .TXT.',
    },
  ],
  ctaText: 'Testar Transcritor Agora',
  ctaLink: '/ferramentas/transcritor',
}
