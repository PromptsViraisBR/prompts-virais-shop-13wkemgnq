/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { toast } from '@/hooks/use-toast'
import Layout from './components/Layout'

import { lazy, Suspense } from 'react'

// Code-splitting via React.lazy para reduzir o bundle inicial e acelerar o carregamento
const Index = lazy(() => import('./pages/Index'))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const Plans = lazy(() => import('./pages/Plans').then((m) => ({ default: m.Plans })))
const Library = lazy(() => import('./pages/Library').then((m) => ({ default: m.Library })))
const ViralVideos = lazy(() =>
  import('./pages/ViralVideos').then((m) => ({ default: m.ViralVideos })),
)
const AcervoNiches = lazy(() =>
  import('./pages/AcervoNiches').then((m) => ({ default: m.AcervoNiches })),
)
const PromptDetail = lazy(() =>
  import('./pages/PromptDetail').then((m) => ({ default: m.PromptDetail })),
)
const Generator = lazy(() => import('./pages/Generator').then((m) => ({ default: m.Generator })))
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))
const CheckoutSuccess = lazy(() =>
  import('./pages/CheckoutSuccess').then((m) => ({ default: m.CheckoutSuccess })),
)
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
)
const ViralToolsHub = lazy(() =>
  import('./pages/ViralToolsHub').then((m) => ({ default: m.ViralToolsHub })),
)
const VideoTranscriber = lazy(() =>
  import('./pages/VideoTranscriber').then((m) => ({ default: m.VideoTranscriber })),
)
const VideoCleaner = lazy(() =>
  import('./pages/VideoCleaner').then((m) => ({ default: m.VideoCleaner })),
)
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="py-24 text-center space-y-3 min-h-[50vh] flex flex-col items-center justify-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
      <p className="text-xs text-muted-foreground font-medium animate-pulse">Carregando...</p>
    </div>
  )
}

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
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Login />} />
                  <Route path="/planos" element={<Plans />} />
                  <Route path="/biblioteca" element={<Library />} />
                  <Route path="/virais" element={<ViralVideos />} />
                  <Route path="/nichos" element={<AcervoNiches />} />
                  <Route path="/prompt/:id" element={<PromptDetail />} />
                  <Route path="/gerador" element={<Generator />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/checkout/sucesso" element={<CheckoutSuccess />} />
                  <Route path="/admin" element={<AdminDashboard />} />

                  {/* NOVAS FERRAMENTAS VIRAIS */}
                  <Route path="/ferramentas" element={<ViralToolsHub />} />
                  <Route path="/ferramentas/transcritor" element={<VideoTranscriber />} />
                  <Route path="/ferramentas/limpar-videos" element={<VideoCleaner />} />

                  {/* REDIRECIONAMENTOS SUAVES DE ROTAS ANTIGAS DO HYPEON (sem 404 para links salvos) */}
                  <Route path="/hypeon" element={<Navigate to="/ferramentas" replace />} />
                  <Route path="/hypeon/radar" element={<Navigate to="/virais" replace />} />
                  <Route
                    path="/hypeon/biblioteca"
                    element={<Navigate to="/biblioteca" replace />}
                  />
                  <Route path="/hypeon/tendencias" element={<Navigate to="/nichos" replace />} />
                  <Route path="/hypeon/clonador" element={<Navigate to="/gerador" replace />} />
                  <Route path="/hypeon/stories" element={<Navigate to="/gerador" replace />} />
                  <Route path="/hypeon/ideas" element={<Navigate to="/gerador" replace />} />
                  <Route
                    path="/hypeon/analisador"
                    element={<Navigate to="/ferramentas/transcritor" replace />}
                  />
                  <Route path="/hypeon/cenas" element={<Navigate to="/virais" replace />} />
                  <Route path="/hypeon/*" element={<Navigate to="/ferramentas" replace />} />

                  <Route path="/privacidade" element={<PrivacyPolicy />} />
                  <Route path="/termos" element={<TermsOfUse />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
