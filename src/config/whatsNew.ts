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
export const CURRENT_VERSION = 'v0.0.84'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-14',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline:
    'v0.0.84 — Radar Viral com Muito Mais Vídeos de Referência & Varredura Geral do Site! 📡⚡',
  highlights: [
    {
      icon: 'zap',
      badge: 'MUITO MAIS VÍDEOS',
      title: 'Radar Viral: 2 a 3 Buscas por Nicho & maxResults 50',
      description:
        'Volume abundante de vídeos reais por nicho, com consultas paralelas combinadas e remoção automática de duplicatas por ID.',
    },
    {
      icon: 'sparkles',
      badge: 'REFORÇO AMPLIADO',
      title: 'Reforço Automático com Disparo Abaixo de 20 Vídeos',
      description:
        'Sempre que a curadoria estrita de entretenimento resultar em menos de 20 vídeos, buscas adicionais com termos alternativos preenchem a lista.',
    },
    {
      icon: 'layers',
      badge: 'PERÍODO PADRÃO 30 DIAS',
      title: 'Filtro Inicial de 30 Dias para Ampla Cobertura',
      description:
        'O Radar Viral agora abre por padrão nos últimos 30 dias para garantir dezenas de referências ativas em todos os nichos.',
    },
    {
      icon: 'shield',
      badge: 'ESTABILIDADE GERAL',
      title: 'Varredura Completa do Site e Zero Quebras',
      description:
        'Revisão em todas as páginas, HYPEON, pagamentos Pix, indicações, geradores e painel de administração com build limpo e estável.',
    },
  ],
  ctaText: 'Explorar Vídeos do Radar',
  ctaLink: '/hypeon/radar',
}
