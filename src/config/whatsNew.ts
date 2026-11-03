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
export const CURRENT_VERSION = 'v0.0.96'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-11-04',
  tagline: 'PROMPTS VIRAIS — Suas ferramentas práticas para acelerar conteúdos virais.',
  headline: 'v0.0.96 — Login no Transcritor Corrigido! 🔐🎙️',
  highlights: [
    {
      icon: 'shield',
      badge: 'BUG CORRIGIDO',
      title: 'Transcritor volta a funcionar para quem está logado',
      description:
        'Corrigimos o erro que pedia autenticação mesmo com você já logado na hora de transcrever. O envio do vídeo/áudio agora leva sua sessão correta até a IA — logado, a transcrição rola direto, sem pedir login de novo.',
    },
    {
      icon: 'lock',
      badge: 'EXPERIÊNCIA CLARA',
      title: 'Sessão expirou? Avisamos com modal de login — nunca erro genérico',
      description:
        'Se a sessão expirar ou não existir, o Transcritor agora abre um convite claro para entrar na sua conta (com botões de criar conta e fazer login), em vez de mostrar mensagens genéricas de rede.',
    },
    {
      icon: 'sparkles',
      badge: 'SANIDADE GERAL',
      title: 'Varredura completa do site',
      description:
        'Passamos por login/cadastro, assinatura PRO com Pix do Mercado Pago, indicações, gerador de prompts, bibliotecas e Limpador de Vídeos corrigindo inconsistências encontradas — sem mudar preços, planos ou regras.',
    },
    {
      icon: 'zap',
      badge: 'CONTINUIDADE',
      title: 'Transcrição segue com IA atualizada',
      description:
        'Mantemos a transcrição fiel + tradução natural em Português com os modelos rápidos da família Gemini, suporte a MP3, WAV, MP4 e WebM até 25MB e diagnóstico específico para cada falha.',
    },
  ],
  ctaText: 'Testar Transcritor Agora',
  ctaLink: '/ferramentas/transcritor',
}
