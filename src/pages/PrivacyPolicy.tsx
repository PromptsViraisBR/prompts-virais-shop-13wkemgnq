import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const PrivacyPolicy: React.FC = () => {
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
          <span>Privacidade & Dados</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Última atualização: Junho de 2025 • Prompts Virais Shop
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">1. Compromisso com sua Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            No <strong>Prompts Virais Shop</strong> (disponível em{' '}
            <a href="https://promptsviraisbr.goskip.app" className="text-pink-600 underline">
              promptsviraisbr.goskip.app
            </a>
            ), respeitamos integralmente a sua privacidade e a proteção dos seus dados pessoais, em
            total conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
          <p>
            Esta página descreve de forma clara, transparente e honesta como coletamos, utilizamos e
            protegemos as informações fornecidas por você ao utilizar nossa plataforma de roteiros e
            prompts para vídeos virais de e-commerce e afiliados.
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">2. Informações que Coletamos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Coletamos apenas o estritamente necessário para prestar o serviço:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Dados de Cadastro e Autenticação:</strong> Nome, endereço de e-mail e senha
              criptografada (ou autenticação segura através da sua conta Google OAuth).
            </li>
            <li>
              <strong>Uso da Plataforma:</strong> Prompts favoritados, histórico de roteiros
              gerados, preferências de nicho e estilo de vídeo.
            </li>
            <li>
              <strong>Imagens enviadas no Gerador:</strong> Fotos que você envia voluntariamente
              para inspirar ou adaptar o roteiro do seu produto físico. Não utilizamos suas fotos
              para fins publicitários externos.
            </li>
            <li>
              <strong>Dados Financeiros e de Pagamento:</strong> Nós <strong>NÃO</strong> temos
              acesso e <strong>NÃO</strong> armazenamos número de cartão de crédito, CVV ou senhas
              bancárias. Toda a transação e cobrança é operada diretamente no ambiente seguro e
              certificado do <strong>Mercado Pago</strong> (via Pix oficial ou cartão de crédito).
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">3. Finalidade do Tratamento dos Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Seus dados são utilizados exclusivamente para:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Liberar o acesso à biblioteca de prompts virais e aos geradores com IA;</li>
            <li>
              Confirmar status de pagamentos, ativação de planos PRO e emissão de recibos oficiais
              do Mercado Pago;
            </li>
            <li>
              Enviar e-mails transacionais importantes (boas-vindas, confirmação de ativação, aviso
              de expiração e lembrete Pix 3 dias antes do vencimento);
            </li>
            <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            4. Compartilhamento de Dados com Terceiros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Não comercializamos nem compartilhamos seus dados com empresas de marketing. Os dados
            podem ser compartilhados unicamente com prestadores de infraestrutura essenciais para a
            operação da plataforma:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Mercado Pago:</strong> Processamento seguro de pagamentos via Pix e cartão;
            </li>
            <li>
              <strong>Servidor Skip Cloud / PocketBase:</strong> Armazenamento seguro de banco de
              dados;
            </li>
            <li>
              <strong>Servidor de E-mail (SMTP Brevo / Mailer):</strong> Envio exclusivo de e-mails
              transacionais da sua conta.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            5. Seus Direitos (LGPD) e Contato do Encarregado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Você pode solicitar a qualquer momento a confirmação de existência de tratamento,
            acesso, correção de dados incompletos ou a exclusão definitiva da sua conta e de todos
            os seus dados pessoais armazenados.
          </p>
          <p className="flex items-center gap-2 pt-2 text-foreground font-semibold">
            <Mail className="w-4 h-4 text-pink-600" />
            <span>Canal Direto de Contato e Suporte:</span>
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

export default PrivacyPolicy
