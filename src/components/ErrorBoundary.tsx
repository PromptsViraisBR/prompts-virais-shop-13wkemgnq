import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage?: string
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'Ocorreu um erro inesperado de renderização.',
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Capturado erro na árvore de componentes:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, errorMessage: undefined })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-purple-500/10 p-6 sm:p-8 text-center space-y-5 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Ops! Algo deu errado ao exibir esta tela
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Não se preocupe: seus dados e sua conta continuam seguros. Você pode tentar
                recarregar a página ou voltar para a tela inicial do Prompts Virais Shop.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1 font-bold text-xs border-pink-500/40 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 h-10 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar novamente</span>
              </Button>

              <Button
                onClick={this.handleGoHome}
                className="flex-1 font-bold text-xs bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:opacity-95 h-10 gap-1.5 shadow-md"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Ir para o Início</span>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
