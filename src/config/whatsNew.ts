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
export const CURRENT_VERSION = 'v0.0.80'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-11',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'Radar Viral com Vídeos Reais do YouTube & Player Embutido! ⚡🎬',
  highlights: [
    {
      icon: 'radar',
      badge: 'DADOS REAIS',
      title: 'Radar Viral com vídeos reais do YouTube rodando dentro do site',
      description:
        'A integração com a YouTube Data API v3 está ativa! Agora o Radar exibe Shorts populares reais do Brasil com visualizações, curtidas e comentários verdadeiros.',
    },
    {
      icon: 'zap',
      badge: 'PLAYER EMBUTIDO',
      title: 'Player oficial YouTube para assistir sem sair da página',
      description:
        'Toque em qualquer card para reproduzir o vídeo em alta qualidade embutido no site, com crédito oficial ao criador e link para abrir no YouTube.',
    },
    {
      icon: 'layers',
      badge: '16 NICHOS',
      title: 'Filtros avançados por 16 nichos, período e ordenação',
      description:
        'Navegue por Histórias, Terror, Comédia, Curiosidades, IA, Animais e mais, com filtros de 24h, 7d, 30d e ordenação por mais visualizados, engajamento ou recentes.',
    },
    {
      icon: 'bookmark',
      badge: 'BIBLIOTECA',
      title: 'Salvar referências virais com 1 clique',
      description:
        'Guarde qualquer vídeo de sucesso diretamente na sua Biblioteca Viral (/hypeon/biblioteca) para inspirar seus roteiros e prompts.',
    },
    {
      icon: 'sliders',
      badge: 'PERFORMANCE',
      title: 'Cache inteligente para carregamento instantâneo',
      description:
        'Respostas em cache no backend para economizar cota e carregar tendências rapidamente sem travar sua navegação.',
    },
  ],
  ctaText: 'Abrir Radar Viral Agora',
  ctaLink: '/hypeon/radar',
}
