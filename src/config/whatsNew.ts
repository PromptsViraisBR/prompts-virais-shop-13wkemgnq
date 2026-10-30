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
export const CURRENT_VERSION = 'v0.0.88'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-17',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'v0.0.88 — Opção de Post Escrito Pronto para Copiar e Postar! 📋✨',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'NOVIDADE',
      title: 'Post Escrito Pronto no Gerador de Vídeos Virais',
      description:
        'Sempre que você gerar um roteiro de vídeo (qualquer duração: 10s, 30s, 60s...), agora aparece também uma legenda escrita de acordo com o nicho para copiar e postar junto com o vídeo nas redes!',
    },
    {
      icon: 'zap',
      badge: 'HASHTAGS LIVRES',
      title: 'Marcadores "# " para Suas Hashtags',
      description:
        'O post escrito vem sem hashtags pré-preenchidas — ele inclui apenas os marcadores "# " (cerilha com espaço na frente) para você preencher livremente com as hashtags da sua escolha.',
    },
    {
      icon: 'film',
      badge: 'GERADOR GERAL',
      title: 'Disponível Também no Gerador Geral (TikTok Shop / Vendas)',
      description:
        'No gerador geral e na personalização com fotos reais da vitrine, a legenda escrita correspondente já vem montada com botão de copiar em 1 clique e feedback de "Copiado!".',
    },
    {
      icon: 'bookmark',
      badge: 'PRATICIDADE',
      title: 'Cópia Instantânea & Formatação Pronta',
      description:
        'Ganhe agilidade: o vídeo sai pronto cena a cena e o post escrito sai pronto para a área de transferência. Basta colar na legenda da postagem.',
    },
  ],
  ctaText: 'Testar Novo Post Escrito',
  ctaLink: '/videos-virais',
}
