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
export const CURRENT_VERSION = 'v0.0.82'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-13',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'Fase 3 HYPEON — Clonador Viral, Stories, Ideas e Analisador com IA! 🚀✨',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'CLONADOR VIRAL',
      title: 'Clonador Viral: Engenharia Reversa em 14 Blocos Originais',
      description:
        'Cole um link do YouTube Shorts ou descreva o vídeo para recriar o formato. 4 modos: Recriar Formato, Melhorar Original, Nova Versão e Versão Curta com divisão cena a cena.',
    },
    {
      icon: 'layers',
      badge: 'HYPEON STORIES',
      title: 'HYPEON Stories com Séries e Continuidade de Personagens',
      description:
        'Narrativas em 11 categorias (Terror, Mistério, Ficção, Drama...) com prompts de imagem e vídeo por cena e banco de personagens contínuos em múltiplos episódios.',
    },
    {
      icon: 'zap',
      badge: 'HYPEON IDEAS',
      title: 'HYPEON Ideas: Banco Infinito com Estimativa de Retenção',
      description:
        'Gere 5, 10 ou 20 ideias com score estimado de engajamento da IA e transforme qualquer ideia em roteiro completo com um único clique.',
    },
    {
      icon: 'shield',
      badge: 'ANALISADOR',
      title: 'Analisador de Vídeos: Notas 0 a 100 e Riscos de Abandono',
      description:
        'Diagnóstico cirúrgico em 8 critérios cruciais, detecção de drop-off e plano imediato de reescrita de gancho e ritmo.',
    },
    {
      icon: 'radar',
      badge: 'LIMITES NO SERVIDOR',
      title: 'Controle de Utilização por Plano no Servidor & Painel Admin',
      description:
        'Limites diários server-side para planos Grátis e PRO, configuráveis pelo administrador e com estatísticas de consumo das ferramentas.',
    },
  ],
  ctaText: 'Explorar o Clonador Viral',
  ctaLink: '/hypeon/clonador',
}
