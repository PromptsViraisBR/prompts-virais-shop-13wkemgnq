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
export const CURRENT_VERSION = 'v0.0.78'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-10',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'Nasceu o HYPEON — O Núcleo de Inteligência Viral! ⚡✨',
  highlights: [
    {
      icon: 'zap',
      badge: 'NOVA DIVISÃO',
      title: 'HYPEON: O Próximo Viral Começa Aqui',
      description:
        'A plataforma evoluiu para uma central de inteligência com 8 módulos estratégicos pensados para criadores, afiliados e marcas.',
    },
    {
      icon: 'radar',
      badge: 'FASE 2 ATIVA',
      title: 'Radar Viral com Arquitetura de Dados Reais',
      description:
        'Monitore vídeos de alta retenção no TikTok, Instagram Reels e YouTube Shorts com filtros de nichos, ordenação e período — transparência total, sem métricas falsas.',
    },
    {
      icon: 'layers',
      badge: 'ORGANIZAÇÃO',
      title: 'Painel Central HYPEON (/hypeon)',
      description:
        'Acesso direto com identidade visual dark premium (grafite, roxo neon e azul elétrico), navegação lateral no desktop e menu adaptado no mobile.',
    },
    {
      icon: 'sliders',
      badge: 'ADMIN',
      title: 'Gestão de Limites e Fontes de Tendências',
      description:
        'Administradores agora configuram limites diários por ferramenta e monitoram conexões oficiais de APIs com total controle.',
    },
    {
      icon: 'bookmark',
      badge: 'SALVOS',
      title: 'Biblioteca de Referências Virais',
      description:
        'Salve referências do Radar com 1 clique para alimentar futuros roteiros e gerações.',
    },
  ],
  ctaText: 'Explorar o HYPEON Agora',
  ctaLink: '/hypeon',
}
