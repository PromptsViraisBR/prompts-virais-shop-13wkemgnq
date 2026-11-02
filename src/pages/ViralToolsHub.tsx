import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Wrench,
  Languages,
  Eraser,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Video,
  Scissors,
  CheckCircle2,
} from 'lucide-react'

export const ViralToolsHub: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Header com identidade PV */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5" />
          <span>Ferramentas Virais Prompts Virais</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          Ferramentas Práticas para{' '}
          <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Criadores de Vídeo
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Sem enrolação, sem simulações. Transcreva qualquer vídeo com tradução natural para
          Português ou limpe textos sobrepostos de vídeos autorizados diretamente no seu
          dispositivo.
        </p>
      </div>

      {/* Grid com as duas novas ferramentas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FERRAMENTA 1: TRANSCRITOR E TRADUTOR */}
        <Card className="flex flex-col justify-between border-2 border-pink-500/30 hover:border-pink-500/60 transition-all rounded-3xl bg-card shadow-lg hover:shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/15 via-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                <Languages className="w-6 h-6" />
              </div>
              <Badge className="bg-pink-500/15 text-pink-600 dark:text-pink-300 border-pink-500/30 font-bold text-xs uppercase tracking-wider">
                Ferramenta 1
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-foreground">
              Transcritor & Tradutor de Vídeos
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Obtenha toda a narração falada de um vídeo em formato de texto editável, mesmo quando
              o vídeo estiver em outro idioma (Inglês, Alemão, Espanhol, Chinês e mais), com
              tradução natural e pronta para uma nova narração em PT-BR.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2 flex-1">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Upload de vídeo ou áudio do dispositivo (MP4, MP3, WAV, M4A...)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Detecção automática do idioma original falado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tradução coloquial para o idioma escolhido (sem tradução robótica)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Exportação completa em TXT e cópia rápida em 1 clique</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border text-[11px] text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-500 shrink-0" />
              <span>
                Transcreve a narração integral na ordem exata das falas, não apenas legendas
                picadas.
              </span>
            </div>

            <div className="pt-2">
              <Link to="/ferramentas/transcritor" className="w-full block">
                <Button className="w-full min-h-[48px] h-12 bg-gradient-to-r from-pink-600 to-rose-500 hover:opacity-95 text-white font-bold rounded-2xl shadow-md gap-2">
                  <span>Abrir Transcritor & Tradutor</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FERRAMENTA 2: BAIXAR E LIMPAR VÍDEOS */}
        <Card className="flex flex-col justify-between border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all rounded-3xl bg-card shadow-lg hover:shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/15 via-teal-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Eraser className="w-6 h-6" />
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 font-bold text-xs uppercase tracking-wider">
                Ferramenta 2
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-foreground">
              Baixar & Limpar Vídeos
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Envie vídeos do seu dispositivo ou cole o link do seu vídeo publicado. Marque a região
              com textos sobrepostos/legendas e processe a limpeza (com desfoque inteligente ou
              recorte) preservando o áudio e a qualidade original em MP4.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2 flex-1">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Upload direto com pré-visualização instantânea e player integrado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Seletor visual de área: marque onde está a legenda para remoção</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Preserva resolução, proporção 9:16 e áudio original intactos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Aviso legal transparente: respeito às regras das plataformas e marcas</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Processamento 100% no seu navegador: privacidade total e sem APIs pagas.</span>
            </div>

            <div className="pt-2">
              <Link to="/ferramentas/limpar-videos" className="w-full block">
                <Button className="w-full min-h-[48px] h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-md gap-2">
                  <span>Abrir Baixar & Limpar Vídeos</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diretrizes Transparentes */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-muted/20 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Compromisso Prompts Virais: Honestidade & Confiabilidade</span>
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Em conformidade com as diretrizes do PV, não utilizamos dados fictícios, processamentos
          simulados ou botões que prometem recursos impossíveis. A importação por link em
          plataformas com bloqueio restrito (TikTok/Instagram) exibe aviso claro de
          incompatibilidade e permite o envio manual do arquivo em poucos segundos.
        </p>
      </div>
    </div>
  )
}
export default ViralToolsHub
