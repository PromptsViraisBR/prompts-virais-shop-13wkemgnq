/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
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

const App = () => (
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
)

export default App
