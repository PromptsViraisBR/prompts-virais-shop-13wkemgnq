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
export const CURRENT_VERSION = 'v0.0.90'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-11-02',
  tagline: 'PROMPTS VIRAIS — Suas ferramentas práticas para acelerar conteúdos virais.',
  headline: 'v0.0.90 — Chegaram as Ferramentas Virais: Transcritor e Limpador de Vídeos! 🛠️✨',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'NOVA SEÇÃO',
      title: 'Ferramentas Virais no Ar',
      description:
        'Substituímos o antigo HYPEON por uma nova seção prática e direta: Ferramentas Virais, acessível diretamente no menu superior e mobile, focada em utilitários que resolvem a rotina do criador.',
    },
    {
      icon: 'zap',
      badge: 'FERRAMENTA 1',
      title: 'Transcritor & Tradutor de Vídeos',
      description:
        'Envie qualquer áudio ou vídeo (MP4, MP3, WAV...) e obtenha a narração completa em texto na ordem exata das falas, com tradução natural e pronta para uma nova gravação em Português ou em múltiplos idiomas.',
    },
    {
      icon: 'film',
      badge: 'FERRAMENTA 2',
      title: 'Baixar & Limpar Vídeos (Remover Legendas)',
      description:
        'Importe seus vídeos, marque a área da legenda na tela e processe diretamente no navegador com desfoque suave ou recorte, preservando a resolução, o áudio original e o formato MP4.',
    },
    {
      icon: 'bookmark',
      badge: 'ESTABILIDADE',
      title: 'Correções dos Geradores & Fidelidade Total',
      description:
        'Incorporamos todas as melhorias recentes de fidelidade dos geradores de prompts, post escrito com marcadores "# " e suporte a imagens reais da vitrine, mantendo o sistema 100% rápido e estável.',
    },
  ],
  ctaText: 'Conhecer as Novas Ferramentas',
  ctaLink: '/ferramentas',
}
