import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const TermsOfUse: React.FC = () => {
  return (
    <div className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Início
          </Button>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Termos & Condições de Assinatura</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Termos de Uso
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Última atualização: Junho de 2025 • Prompts Virais Shop
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">1. Objeto do Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            O <strong>Prompts Virais Shop</strong> fornece acesso a um acervo selecionado de
            roteiros cena a cena, ganchos visuais e narrativos nos primeiros 3 segundos, e geradores
            com auxílio de inteligência artificial voltados para vídeos de produtos físicos no
            TikTok Shop, Shopee Vídeo, Instagram Reels e YouTube Shorts.
          </p>
          <p>
            O usuário tem direito a utilizar os roteiros gerados para gravar e comercializar seus
            próprios produtos físicos ou atuar como criador/afiliado digital.
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            2. Garantia de 7 Dias & Direito de Arrependimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Em conformidade com o <strong>Artigo 49 do Código de Defesa do Consumidor (CDC)</strong>
            , garantimos a todos os compradores um prazo incondicional de{' '}
            <strong>7 (sete) dias corridos</strong> a partir da data da compra ou contratação
            inicial para solicitar o cancelamento com{' '}
            <strong>reembolso integral de 100% do valor pago</strong>.
          </p>
          <p>
            No caso de pagamentos realizados via Pix, ao ser confirmado o estorno, o valor retorna{' '}
            <strong>diretamente para a mesma conta bancária</strong> do comprador em instantes pelo
            Mercado Pago. No caso de cartão de crédito, o crédito é estornado na fatura conforme o
            prazo da operadora bancária.
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-pink-500" />
            3. Cobrança, Planos e Formas de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            As transações são processadas com criptografia de ponta a ponta pela instituição oficial{' '}
            <strong>Mercado Pago</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Plano Mensal PRO via Cartão de Crédito (R$ 19,90/mês):</strong> Cobrança
              recorrente mensal sem fidelidade.
            </li>
            <li>
              <strong>Plano Mensal PRO via Pix (R$ 19,90):</strong> Pagamento avulso válido por 30
              dias de acesso sem renovação automática involuntária. Três (3) dias antes do término,
              o assinante recebe um lembrete com opção de novo Pix ou cadastro de cartão.
            </li>
            <li>
              <strong>Plano Anual VIP (R$ 238,80/ano):</strong> Pagamento anual único (equivalente a
              R$ 19,90/mês com 12 meses de acesso garantido).
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-500" />
            4. Cancelamento a Qualquer Momento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            O usuário pode cancelar sua assinatura a qualquer momento com apenas 1 clique através da
            página <strong>Meu Perfil</strong> (/perfil) ou entrando em contato com o suporte.
          </p>
          <p>
            Não cobramos multas rescisórias. Após o cancelamento de uma assinatura recorrente, o
            usuário continua com acesso liberado a todos os recursos PRO contratados até o final
            exato do ciclo já pago.
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            5. Limitações de Responsabilidade e Uso de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Nossos prompts e roteiros foram calibrados e testados com base nas melhores práticas do
            algoritmo do TikTok e Shopee. Entretanto, as métricas finais de visualização e vendas
            dependem de fatores externos, como qualidade da gravação, iluminação, produto físico
            ofertado, preço e engajamento da conta do usuário. Não prometemos ganhos financeiros
            garantidos nem resultados idênticos para todas as vitrines.
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">6. Suporte e Contato Oficial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Dúvidas, pedidos de estorno ou solicitações de cancelamento podem ser encaminhados
            diretamente ao suporte oficial do site:
          </p>
          <p className="flex items-center gap-2 pt-1 text-foreground font-semibold">
            <Mail className="w-4 h-4 text-pink-600" />
            <span>E-mail do Administrador:</span>
            <a
              href="mailto:juniorrodriguesjr123.jr@gmail.com"
              className="text-pink-600 underline hover:text-pink-700"
            >
              juniorrodriguesjr123.jr@gmail.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TermsOfUse
