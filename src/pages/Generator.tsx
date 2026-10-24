import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { saveGeneratedPrompt, getUserGenerations, buildPromptScript } from '@/services/generations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Wand2,
  Sparkles,
  Lock,
  Copy,
  Check,
  History,
  Video,
  ShoppingBag,
  ArrowRight,
  Crown,
  RefreshCw,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { GenerationRecord, NicheType, StyleType, PlatformType } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

export const Generator: React.FC = () => {
  const { user, isPaidPlan } = useAuth()
  const navigate = useNavigate()

  // Form State
  const [productName, setProductName] = useState('')
  const [niche, setNiche] = useState<NicheType>('moda_feminina')
  const [style, setStyle] = useState<StyleType>('pov')
  const [platform, setPlatform] = useState<PlatformType>('tiktok_shop')
  const [targetAudience, setTargetAudience] = useState('')
  const [details, setDetails] = useState('')

  // Results State
  const [generating, setGenerating] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [copied, setCopied] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  useEffect(() => {
    if (user && isPaidPlan) {
      loadHistory()
    }
  }, [user, isPaidPlan])

  const loadHistory = async () => {
    if (!user) return
    try {
      const records = await getUserGenerations(user.id)
      setHistory(records)
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: 'Faça login para gerar prompts',
        description: 'Crie sua conta para acessar o gerador personalizado.',
      })
      navigate('/login')
      return
    }

    if (!isPaidPlan) {
      toast({
        title: 'Recurso Exclusivo do Plano Pago',
        description:
          'O gerador personalizado para peças do seu catálogo está disponível nos planos Mensal e Anual.',
        variant: 'destructive',
      })
      navigate('/planos')
      return
    }

    if (!productName.trim()) {
      toast({
        title: 'Informe o nome do produto',
        description: 'Exemplo: Vestido Midi Canelado, Camiseta Oversized, etc.',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)
    try {
      // Salva no banco de dados através do serviço
      const record = await saveGeneratedPrompt({
        userId: user.id,
        productName,
        niche,
        style,
        platform,
        targetAudience,
        details,
      })

      setCurrentPrompt(record.generated_prompt)
      setHistory((prev) => [record, ...prev])

      toast({
        title: 'Roteiro Gerado com Sucesso! 🚀',
        description: 'Pronto para você gravar com a sua peça da vitrine.',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro ao gerar roteiro',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast({
      title: 'Prompt copiado com sucesso! 📋',
      description: 'Cole no seu bloco de notas ou teleprompter e grave seu vídeo.',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApplyPreset = (
    presetName: string,
    presetNiche: NicheType,
    presetStyle: StyleType,
    presetDetails: string,
  ) => {
    setProductName(presetName)
    setNiche(presetNiche)
    setStyle(presetStyle)
    setDetails(presetDetails)
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold uppercase"
          >
            Criador Sob Medida
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Gerador de Roteiros Personalizados
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Insira o nome da roupa ou acessório do seu catálogo e gere uma estrutura completa de
            roteiro com gancho, demonstração e CTA para a vitrine.
          </p>
        </div>

        {user && isPaidPlan && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(!historyOpen)}
            className="gap-2 font-medium"
          >
            <History className="w-4 h-4 text-pink-500" />
            {historyOpen ? 'Ocultar Histórico' : `Ver Histórico (${history.length})`}
          </Button>
        )}
      </div>

      {/* Alerta de bloqueio caso não seja plano pago */}
      {!isPaidPlan && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-lg">
              <Crown className="w-5 h-5 text-amber-500" />
              Recurso Exclusivo para Assinantes PRO
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              O gerador personalizado cria roteiros específicos para qualquer peça do seu estoque
              (vestidos, conjuntos, calças, tênis). Assine o plano Mensal ou Anual para gerar
              roteiros ilimitados.
            </p>
          </div>
          <Link to="/planos" className="shrink-0">
            <Button className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold shadow-md">
              Desbloquear Gerador PRO
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Grid: Formulário x Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-500" />
                Dados da Peça do Catálogo
              </CardTitle>
              <CardDescription>
                Especifique a peça para criar um roteiro com gatilhos de venda precisos.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleGenerate}>
              <CardContent className="space-y-4">
                {/* Sugestões rápidas de preenchimento */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Sugestões rápidas de nicho:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          'Vestido Canelado Gola Alta',
                          'moda_feminina',
                          'pov',
                          'Tecido encorpado que modela sem marcar nada na cintura',
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      👗 Vestido Midi
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          'Camiseta Oversized Gola Ribana',
                          'streetwear_casual',
                          'modelo',
                          'Algodão pesado 240g com gola de 3cm que não laceia',
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      👕 Camiseta Oversized
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          'Conjunto Fitness Sem Costura',
                          'fitness_academia',
                          'modelo',
                          'Cós alto de compressão e tecido zero transparência',
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      🏋️ Legging / Top
                    </button>
                  </div>
                </div>

                {/* Nome do Produto */}
                <div className="space-y-2">
                  <Label htmlFor="product-name" className="font-semibold">
                    Nome da Roupa / Produto <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="Ex: Vestido Chemise Linho com Cinto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                {/* Nicho & Estilo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="niche" className="font-semibold">
                      Nicho / Categoria
                    </Label>
                    <Select value={niche} onValueChange={(v) => setNiche(v as NicheType)}>
                      <SelectTrigger id="niche">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NICHE_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style" className="font-semibold">
                      Estilo de Gravação
                    </Label>
                    <Select value={style} onValueChange={(v) => setStyle(v as StyleType)}>
                      <SelectTrigger id="style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STYLE_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Plataforma */}
                <div className="space-y-2">
                  <Label htmlFor="platform" className="font-semibold">
                    Plataforma Principal de Venda
                  </Label>
                  <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformType)}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLATFORM_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Detalhes que vendem */}
                <div className="space-y-2">
                  <Label htmlFor="details" className="font-semibold">
                    Diferenciais e Benefícios da Peça
                  </Label>
                  <Input
                    id="details"
                    placeholder="Ex: Tecido duplo, forro interno, elástico na cintura, não amassa fácil"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    O roteiro destacará esses pontos na cena de quebra de objeções.
                  </p>
                </div>

                {/* Público Alvo */}
                <div className="space-y-2">
                  <Label htmlFor="target-audience" className="font-semibold">
                    Público-Alvo ou Ocasião de Uso (Opcional)
                  </Label>
                  <Input
                    id="target-audience"
                    placeholder="Ex: Mulheres elegantes para look de trabalho e dates"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold py-5 shadow-md"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Estruturando Cenas Virais...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Roteiro Viral Agora
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Resultado Gerado */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border shadow-md min-h-[520px] flex flex-col justify-between">
            <CardHeader className="bg-muted/40 border-b py-3.5 px-4 sm:px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Video className="w-4 h-4 text-pink-500" />
                Roteiro Personalizado Gerado
              </CardTitle>

              {currentPrompt && (
                <Button
                  size="sm"
                  onClick={() => handleCopy(currentPrompt)}
                  className="gap-1.5 font-semibold text-xs bg-gradient-to-r from-pink-600 to-amber-500 text-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Roteiro
                    </>
                  )}
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
              {currentPrompt ? (
                <div className="bg-muted/30 border rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground select-all h-full max-h-[500px] overflow-y-auto">
                  {currentPrompt}
                </div>
              ) : (
                <div className="text-center py-16 px-4 space-y-4 text-muted-foreground">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Sparkles className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <h3 className="font-bold text-foreground text-base">
                      Seu roteiro pronto aparecerá aqui
                    </h3>
                    <p className="text-xs">
                      Preencha os dados da sua roupa ao lado e clique em "Gerar Roteiro Viral" para
                      montar as cenas em segundos.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            {currentPrompt && (
              <CardFooter className="border-t bg-muted/20 py-3 px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
                <span>Roteiro salvo no seu histórico do banco de dados</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(currentPrompt)}
                  className="text-xs h-auto p-0 text-pink-600 dark:text-pink-400 font-semibold"
                >
                  Copiar novamente
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Histórico de Gerações Salvas no Banco */}
      {historyOpen && user && isPaidPlan && (
        <div className="border rounded-2xl p-6 bg-muted/20 space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-pink-500" />
              Seu Histórico de Gerações Salvas
            </h2>
            <span className="text-xs text-muted-foreground">
              {history.length} roteiro(s) criados
            </span>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Você ainda não gerou nenhum roteiro personalizado. Comece agora!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <Card key={item.id} className="border bg-background shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {NICHE_LABELS[item.niche]}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.created).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {item.product_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Estilo: {STYLE_LABELS[item.style]}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setCurrentPrompt(item.generated_prompt)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={() => handleCopy(item.generated_prompt)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
