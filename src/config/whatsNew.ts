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
export const CURRENT_VERSION = 'v0.0.86'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-05-16',
  tagline: 'PROMPTS VIRAIS — Inteligência para criar conteúdos que conquistam a internet.',
  headline: 'v0.0.86 — FASE 4 HYPEON: Criador de Cenas & Biblioteca Viral Completa! 🎬📁',
  highlights: [
    {
      icon: 'film',
      badge: 'NOVA FERRAMENTA',
      title: 'Criador de Cenas (/hypeon/cenas)',
      description:
        'Transforme qualquer roteiro em cenas completas com IA: enquadramento, iluminação, câmera, ação, narração, e prompts individuais de imagem (9:16) e vídeo prontos para Midjourney, Runway e Kling.',
    },
    {
      icon: 'sparkles',
      badge: '7 ESTILOS VISUAIS',
      title: 'Direção Visual Customizada',
      description:
        'Escolha entre Realista Cinematográfico, Animação 3D, Cartoon, Anime, Documentário, Terror Cinematográfico ou Estilo Viral de Redes Sociais.',
    },
    {
      icon: 'bookmark',
      badge: 'ORGANIZAÇÃO TOTAL',
      title: 'Biblioteca Viral com Pastas Personalizadas',
      description:
        'Crie pastas com cores, busque por palavra-chave, edite notas, duplique projetos, mova itens entre pastas e copie conteúdos com 1 clique.',
    },
    {
      icon: 'zap',
      badge: 'INTEGRAÇÃO TOTAL',
      title: 'Conexão Direta com Geradores do Site',
      description:
        'Envie qualquer cena ou roteiro direto para os geradores de prompts existentes do site e salve todo o progresso na sua biblioteca na nuvem.',
    },
  ],
  ctaText: 'Experimentar o Criador de Cenas',
  ctaLink: '/hypeon/cenas',
}
