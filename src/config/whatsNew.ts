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
export const CURRENT_VERSION = 'v0.0.85'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-15',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'v0.0.85 — Clonador Viral Otimizado & Geração Ultrarrápida em Segundos! ⚡🎬',
  highlights: [
    {
      icon: 'zap',
      badge: 'CAUSA RAIZ CORRIGIDA',
      title: 'Clonador Viral: Geração Ágil sem Timeout',
      description:
        'Eliminamos os atrasos de processamento que excediam o limite de tempo. Roteiros estruturados cena a cena agora respondem de forma ágil e estável.',
    },
    {
      icon: 'sparkles',
      badge: 'RESILIÊNCIA TOTAL',
      title: 'Recuperação Inteligente de Conexão',
      description:
        'Se o gateway de IA tiver qualquer instabilidade momentânea, o sistema adapta a resposta de imediato para você nunca ficar na mão.',
    },
    {
      icon: 'film',
      badge: 'ROTEIROS EM 14 BLOCOS',
      title: 'YouTube e Descrição Manual 100% Funcionais',
      description:
        'Cole links do YouTube Shorts ou descreva a ideia manualmente para obter gancho inicial, locução, 3 a 4 cenas estruturadas, SFX e CTA.',
    },
    {
      icon: 'shield',
      badge: 'SUÍTE HYPEON COMPLETA',
      title: 'Stories, Ideas, Analisador e Radar 100% Ativos',
      description:
        'Toda a suíte HYPEON funcionando com cotas por plano, limites diários e integração contínua sem interrupções.',
    },
  ],
  ctaText: 'Testar o Clonador Viral',
  ctaLink: '/hypeon/clonador',
}
