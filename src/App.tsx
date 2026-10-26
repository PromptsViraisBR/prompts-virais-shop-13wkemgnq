/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { toast } from '@/hooks/use-toast'
import Layout from './components/Layout'

// Pages
import Index from './pages/Index'
import { Login } from './pages/Login'
import { Plans } from './pages/Plans'
import { Library } from './pages/Library'
import { ViralVideos } from './pages/ViralVideos'
import { PromptDetail } from './pages/PromptDetail'
import { Generator } from './pages/Generator'
import { Profile } from './pages/Profile'
import { CheckoutSuccess } from './pages/CheckoutSuccess'
import { AdminDashboard } from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

const App = () => {
  // Listener global para capturar rejeições assíncronas não tratadas (unhandledrejection)
  // evitando telas brancas silenciosas e dando feedback visual amigável via toast
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('[GlobalAsyncSafeguard] Rejeição de Promise não tratada:', event.reason)
      const rawReason = event.reason
      const reasonMsg =
        typeof rawReason === 'string'
          ? rawReason
          : rawReason?.message || 'Falha temporária de comunicação ou processamento.'

      // Não exibe toast se for cancelamento intencional ou popup fechado
      if (reasonMsg.includes('popup_closed') || reasonMsg.includes('aborted')) {
        return
      }

      toast({
        title: 'Aviso de Conexão',
        description: 'Uma requisição não pôde ser completada agora. Tente novamente.',
        variant: 'destructive',
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/planos" element={<Plans />} />
                <Route path="/biblioteca" element={<Library />} />
                <Route path="/virais" element={<ViralVideos />} />
                <Route path="/prompt/:id" element={<PromptDetail />} />
                <Route path="/gerador" element={<Generator />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/checkout/sucesso" element={<CheckoutSuccess />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
