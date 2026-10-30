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
export const CURRENT_VERSION = 'v0.0.83'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-13',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'v0.0.83 — Clonador Otimizado, Nichos Responsivos, Copiar Link & Painel HYPEON! 🚀⚡',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'CLONADOR CORRIGIDO',
      title: 'Clonador Viral: Geração Estável sem Falha de Conexão',
      description:
        'Timeout ampliado para 120s no frontend, prompts enxutos de alta velocidade e tratamento específico de erros sem falhas genéricas.',
    },
    {
      icon: 'layers',
      badge: 'TODOS OS NICHOS VISÍVEIS',
      title: 'Barra de Nichos Completa a partir de 320px',
      description:
        'No Radar Viral e Tendências, todos os 16 nichos ficam sempre visíveis e selecionáveis em qualquer tamanho de tela sem cortes.',
    },
    {
      icon: 'zap',
      badge: 'RADAR VIRAL',
      title: 'Botão Copiar Link Direto do YouTube com Feedback',
      description:
        'Copie instantaneamente a URL do vídeo de referência com um clique e confirmação visual de "Copiado!" na hora.',
    },
    {
      icon: 'shield',
      badge: 'FASE 5 ADMIN',
      title: 'Painel HYPEON com Consumo Real e Status da Fonte YouTube',
      description:
        'Consumo real por ferramenta (Clonador, Stories, Ideas, Analisador e Radar), ranking de top usuários, status da API do YouTube e limites editáveis incluindo upload.',
    },
  ],
  ctaText: 'Ver Novidades no Radar',
  ctaLink: '/hypeon/radar',
}
