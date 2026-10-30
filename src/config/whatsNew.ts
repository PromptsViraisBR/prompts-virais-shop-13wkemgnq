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
export const CURRENT_VERSION = 'v0.0.81'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-12',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'Curadoria Fina do Radar Viral: 100% Conteúdo de Entretenimento! 🎭✨',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'CURADORIA FINA',
      title: 'Foco exclusivo em referências de entretenimento para criadores',
      description:
        'O Radar Viral agora isola formatos autênticos de criação: curiosidades ("você sabia"), tutoriais ("como fazer"), historinhas animadas (incluindo frutas e personagens humanoides ou pessoas reais narrando), experimentos caseiros e humor criativo.',
    },
    {
      icon: 'shield',
      badge: 'ANTI-NOTÍCIAS',
      title: 'Filtro rígido contra notícias, política e acontecimentos do dia',
      description:
        'Descarte automático de reportagens jornalísticas, debates políticos, tragédias e agenda esportiva. Seu feed é 100% limpo, inspirador e voltado para roteiros virais.',
    },
    {
      icon: 'zap',
      badge: 'SCORE VIRAL',
      title: 'Score de formato de entretenimento com ordenação inteligente',
      description:
        'Algoritmo server-side que pontua e prioriza vídeos com formatos comprovados de retenção e narrativa, garantindo que o topo do feed traga o melhor repertório.',
    },
    {
      icon: 'radar',
      badge: 'PLAYER & SALVAR',
      title: 'Player embutido e salvar na Biblioteca Viral intactos',
      description:
        'Assista a qualquer Short com 1 clique diretamente na página sem anúncios e guarde suas referências prediletas na Biblioteca Viral (/hypeon/biblioteca).',
    },
    {
      icon: 'layers',
      badge: '16 NICHOS',
      title: 'Busca inteligente com fallback automático por tema',
      description:
        'Se o filtro eliminar vídeos fora do padrão, o backend busca automaticamente termos complementares para entregar sempre uma vitrine completa.',
    },
  ],
  ctaText: 'Explorar Radar Curado',
  ctaLink: '/hypeon/radar',
}
