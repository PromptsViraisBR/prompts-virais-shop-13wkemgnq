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
export const CURRENT_VERSION = 'v0.0.91'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-11-03',
  tagline: 'PROMPTS VIRAIS — Suas ferramentas práticas para acelerar conteúdos virais.',
  headline:
    'v0.0.91 — Importar vídeos ficou mais fácil: guia oficial para TikTok, Instagram e Facebook! 📲🎬',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'NOVO GUIA',
      title: 'Passo a Passo Oficial para Salvar Seus Vídeos',
      description:
        'Ao colar um link no Transcritor ou no Limpar Vídeos, você recebe o passo a passo oficial de como salvar o próprio vídeo pelo app do TikTok, Instagram e Facebook com qualidade máxima e links para as centrais oficiais de ajuda.',
    },
    {
      icon: 'zap',
      badge: 'FLUXO ÁGIL',
      title: 'Botão Direto "ENVIAR MEU VÍDEO"',
      description:
        'Após salvar seu vídeo pelo app oficial ou pelo seu downloader favorito, um único clique no botão de destaque foca e abre o seletor de arquivos da página para você transcrever ou limpar imediatamente.',
    },
    {
      icon: 'shield',
      badge: 'TRANSPARÊNCIA',
      title: 'Segurança & Sem Custos de APIs Pagas',
      description:
        'O PV não faz raspagem de links de terceiros nem usa APIs cobradas em dólar: você salva seus próprios arquivos com privacidade e autonomia total no seu aparelho e processa gratuitamente no PV.',
    },
    {
      icon: 'film',
      badge: 'FERRAMENTAS',
      title: 'Transcritor & Limpador de Vídeos Sempre Ativos',
      description:
        'Ambas as ferramentas operam de forma rápida no desktop e celular, aceitando MP4, WebM e faixas de áudio diretamente da sua galeria ou downloads.',
    },
  ],
  ctaText: 'Testar Ferramentas Virais',
  ctaLink: '/ferramentas',
}
