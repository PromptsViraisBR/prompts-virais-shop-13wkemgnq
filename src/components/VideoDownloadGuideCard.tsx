import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  UploadCloud,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Info,
  ArrowDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export interface VideoDownloadGuideCardProps {
  detectedPlatform?: 'tiktok' | 'instagram' | 'facebook' | 'generic'
  onUploadClick: () => void
  toolName?: string
}

interface PlatformGuide {
  id: 'tiktok' | 'instagram' | 'facebook'
  name: string
  badge: string
  accentColor: string
  summary: string
  steps: string[]
  helpUrl: string
  helpLabel: string
  externalDownloaderUrl?: string
  externalDownloaderName?: string
}

const PLATFORMS: PlatformGuide[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    badge: 'App TikTok',
    accentColor: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
    summary: 'Salvar o próprio vídeo sem marca-d’água diretamente no app:',
    steps: [
      'Abra o TikTok e acesse o seu Perfil.',
      'Toque no vídeo desejado e depois no ícone "⋯" (ou botão de compartilhar).',
      'Selecione a opção "Salvar vídeo" no seu rolo de câmera.',
    ],
    helpUrl: 'https://support.tiktok.com/pt-BR/using-tiktok/creating-videos/downloading-videos',
    helpLabel: 'Central de Ajuda oficial do TikTok: Baixar vídeos',
    externalDownloaderUrl: 'https://ssstik.io/pt',
    externalDownloaderName: 'ssstik.io',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    badge: 'App Instagram',
    accentColor: 'from-amber-500/20 to-pink-500/20 text-amber-400 border-amber-500/30',
    summary: 'Baixar seus próprios Reels ou solicitar seus dados originais:',
    steps: [
      'Abra o seu Reel no app do Instagram e toque no ícone "⋯" (três pontinhos).',
      'Toque em "Salvar no rolo da câmera" / "Baixar".',
      'Para baixar o acervo completo de postagens em alta definição: acesse Perfil → Configurações → Central de Contas → "Suas informações e permissões" → "Baixar suas informações".',
    ],
    helpUrl: 'https://help.instagram.com/270447560766967',
    helpLabel: 'Central de Ajuda oficial do Instagram: Salvar Reels no dispositivo',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    badge: 'App / Web Facebook',
    accentColor: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    summary: 'Baixar seus vídeos publicados ou exportar seus dados:',
    steps: [
      'No seu vídeo próprio, clique nos três pontinhos "⋯" no canto superior da publicação.',
      'Selecione "Baixar vídeo" para salvar o arquivo MP4 diretamente no seu aparelho.',
      'Para exportar vários vídeos de uma só vez: Configurações e Privacidade → Configurações → "Suas informações do Facebook" → "Baixar informações do perfil".',
    ],
    helpUrl: 'https://www.facebook.com/help/212802592072244',
    helpLabel: 'Central de Ajuda oficial do Facebook: Baixar suas informações e vídeos',
    externalDownloaderUrl: 'https://fdownloader.net/pt',
    externalDownloaderName: 'fdownloader.net',
  },
]

export const VideoDownloadGuideCard: React.FC<VideoDownloadGuideCardProps> = ({
  detectedPlatform = 'generic',
  onUploadClick,
  toolName = 'Prompts Virais',
}) => {
  return (
    <Card className="border-2 border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-950/20 text-foreground rounded-3xl shadow-2xl overflow-hidden animate-in fade-in-50 duration-300">
      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Cabeçalho do Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-black uppercase tracking-wider">
                Orientação Oficial
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">
                Importação segura e sem custos
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <span>Como obter seu vídeo para usar no {toolName}</span>
            </h3>
          </div>

          <Button
            type="button"
            onClick={onUploadClick}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-extrabold text-xs sm:text-sm h-11 px-5 rounded-2xl shadow-lg shadow-amber-500/25 gap-2 shrink-0 transition-all active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>ENVIAR MEU VÍDEO</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Declaração de transparência e postura honesta */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-amber-100">
              <p className="font-extrabold text-amber-300 text-xs sm:text-sm">
                O PV não baixa vídeos de terceiros por link.
              </p>
              <p className="leading-relaxed text-muted-foreground text-foreground/90">
                Para vídeos de outras pessoas, use somente conteúdo autorizado e os meios oficiais
                de cada plataforma. As redes sociais bloqueiam a raspagem automatizada sem planos
                corporativos pagos. Ao salvar o arquivo no seu aparelho, você mantém qualidade
                máxima, sem custos adicionais e sem expor seus dados.
              </p>
            </div>
          </div>
        </div>

        {/* Passo a passo por plataforma oficial */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-extrabold text-foreground uppercase tracking-wider">
              Passo a Passo Oficial para Salvar Seu Vídeo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {PLATFORMS.map((platform) => {
              const isHighlight = detectedPlatform === platform.id || detectedPlatform === 'generic'

              return (
                <div
                  key={platform.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isHighlight
                      ? 'bg-muted/40 border-amber-500/30 shadow-sm'
                      : 'bg-muted/15 border-border/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-foreground">{platform.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${platform.accentColor}`}
                      >
                        {platform.badge}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {platform.summary}
                    </p>

                    <ol className="space-y-1.5 text-xs text-foreground/90 list-decimal list-inside leading-relaxed">
                      {platform.steps.map((step, idx) => (
                        <li key={idx} className="text-[11px] leading-snug">
                          <span className="text-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-2 border-t border-border/50 space-y-2">
                    {platform.externalDownloaderUrl ? (
                      <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
                            Opção site externo:
                          </span>
                          <span className="text-[9px] text-muted-foreground font-semibold">
                            (serviço de terceiros)
                          </span>
                        </div>
                        <a
                          href={platform.externalDownloaderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-[11px] shadow-sm transition-all text-center"
                        >
                          <span>Abrir {platform.externalDownloaderName}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-muted/40 border border-border/50 text-[10px] text-muted-foreground leading-tight">
                        <span className="font-semibold text-foreground/80">
                          Sem site externo recomendado:
                        </span>{' '}
                        siga o passo a passo oficial acima para salvar seu Reel pelo próprio app.
                      </div>
                    )}

                    <a
                      href={platform.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors pt-1"
                      title={platform.helpLabel}
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">Central de Ajuda ({platform.name})</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Downloader próprio do usuário / sites de terceiros (aviso transparente & postura honesta) */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-foreground">
                Aviso sobre sites de terceiros & downloaders externos:
              </p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Os links externos sugeridos acima (ssstik.io para TikTok e fdownloader.net para
                Facebook) são serviços de terceiros independentes, sem qualquer afiliação ou vínculo
                com o Prompts Virais (PV). Cada usuário avalia e utiliza por sua própria conta e
                risco. Para o Instagram, não há site externo sugerido — utilize o método oficial de
                salvar direto pelo app.
              </p>
              <p className="text-foreground/90 font-medium text-[11px] leading-relaxed">
                Após salvar o vídeo no seu celular ou computador (seja pelo app oficial ou pelo site
                de sua preferência),{' '}
                <strong className="text-amber-400">volte aqui e clique em ENVIAR MEU VÍDEO</strong>{' '}
                para processá-lo normalmente.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUploadClick}
            className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 font-bold text-xs h-10 rounded-xl shrink-0 gap-1.5 self-start sm:self-center"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Voltar e enviar arquivo</span>
          </Button>
        </div>

        {/* Rodapé com atalho de ação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Depois de salvar no celular ou PC, basta clicar em "ENVIAR MEU VÍDEO".</span>
          </span>
          <button
            type="button"
            onClick={onUploadClick}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Rolar até o campo de envio de arquivo ↑
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoDownloadGuideCard
