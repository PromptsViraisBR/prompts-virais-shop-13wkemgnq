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
export const CURRENT_VERSION = 'v0.0.87'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-16',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'v0.0.87 — Núcleo HYPEON Organizado no Fluxo Real de Uso! ⚡🚀',
  highlights: [
    {
      icon: 'zap',
      badge: 'FLUXO DE PRODUTO',
      title: 'Sequência Natural: Descobrir → Analisar → Roteirizar → Salvar',
      description:
        'O núcleo do HYPEON agora guia sua produção no passo a passo lógico: comece descobrindo referências e termine salvando na sua biblioteca.',
    },
    {
      icon: 'film',
      badge: 'PASSO 1: DESCOBRIR',
      title: '1. Radar Viral & 2. Tendências por Nicho em Primeiro Lugar',
      description:
        'O Radar Viral agora encabeça o painel e os menus para você ver de imediato os Shorts e tendências com métricas 100% reais do Brasil.',
    },
    {
      icon: 'sparkles',
      badge: 'PASSOS 3 A 7: PRODUÇÃO',
      title: 'Analisador → Clonador → Stories → Ideas → Cenas',
      description:
        'Avalie o gancho no Analisador, desmonte a estrutura no Clonador, gere narrativas ou ideias e converta tudo em cenas prontas com prompts visuais.',
    },
    {
      icon: 'bookmark',
      badge: 'PASSO 8: ARQUIVAMENTO',
      title: '8. Biblioteca Viral como Destino Final',
      description:
        'Organize todo o material gerado em pastas na nuvem com 1 clique, fechando o ciclo de criação sem perder nenhum detalhe.',
    },
  ],
  ctaText: 'Ver Novo Fluxo do HYPEON',
  ctaLink: '/hypeon',
}
