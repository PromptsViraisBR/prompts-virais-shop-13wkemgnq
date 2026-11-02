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
export const CURRENT_VERSION = 'v0.0.92'
export const STORAGE_KEY_WHATS_NEW = 'pv_last_seen_version'

export const CURRENT_RELEASE: VersionRelease = {
  version: CURRENT_VERSION,
  releaseDate: '2025-11-03',
  tagline: 'PROMPTS VIRAIS — Suas ferramentas práticas para acelerar conteúdos virais.',
  headline: 'v0.0.92 — Opção de sites externos para baixar vídeos de TikTok e Facebook! 🎬🔗',
  highlights: [
    {
      icon: 'sparkles',
      badge: 'NOVA OPÇÃO',
      title: 'Opção de Links Externos no Card de Orientação',
      description:
        'No Transcritor e no Limpar Vídeos, o card agora oferece atalhos diretos para sites externos: ssstik.io para TikTok e fdownloader.net para Facebook. Para o Instagram, segue a orientação oficial via app.',
    },
    {
      icon: 'shield',
      badge: 'TRANSPARÊNCIA',
      title: 'Aviso Honesto & Sem Afiliação',
      description:
        'Mantemos total transparência: esses sites são serviços de terceiros sem vínculo com o PV. Você avalia, salva o vídeo no seu aparelho e volta ao PV para transcrever ou limpar com total liberdade.',
    },
    {
      icon: 'zap',
      badge: 'FLUXO ÁGIL',
      title: 'Botão Direto "ENVIAR MEU VÍDEO"',
      description:
        'Após baixar seu vídeo pelo site externo ou pelo app oficial da rede, um único clique no botão de destaque foca e abre o seletor de arquivos para iniciar o processamento na hora.',
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
