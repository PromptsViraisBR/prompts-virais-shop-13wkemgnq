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
export const CURRENT_VERSION = 'v0.0.97'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-11-05',
  tagline: 'PROMPTS VIRAIS — Suas ferramentas práticas para acelerar conteúdos virais.',
  headline: 'v0.0.97 — Site Conectado ao Seu Próprio Hub de IA! 🔌🤖',
  highlights: [
    {
      icon: 'plug',
      badge: 'INTEGRAÇÃO',
      title: 'Prompts agora passam pelo seu hub de IA (jrl-ai-hub)',
      description:
        'As gerações de TEXTO do site — roteiros virais, cenas, variações e prompts de imagem — agora consultam primeiro o seu próprio hub de IA (jrl-ai-hub), com a chave guardada em segredo no servidor. Nada de chaves no navegador: tudo acontece no backend.',
    },
    {
      icon: 'shield',
      badge: 'ZERO DOWNTIME',
      title: 'Fallback automático: se o hub falhar, a IA atual assume',
      description:
        'Se o hub estiver fora do ar, lento ou retornar erro, cada geração cai automaticamente para o caminho de IA atual do Skip Cloud (e depois para o gerador dinâmico interno). Gerador, transcritor, bibliotecas, login, Pix do Mercado Pago e indicações seguem funcionando normalmente.',
    },
    {
      icon: 'mic',
      badge: 'TRANSCRITOR',
      title: 'Transcrição continua no Gemini (o hub ainda não recebe áudio)',
      description:
        'O hub ainda não expõe entrada de áudio, então o Transcritor segue no Gemini (gemini-3.5-flash), que está estável desde a v0.0.95. Quando o hub passar a aceitar áudio, a migração é automática pelo servidor — sem nova versão do site.',
    },
  ],
  ctaText: 'Gerar um Prompt Agora',
  ctaLink: '/gerador',
}
