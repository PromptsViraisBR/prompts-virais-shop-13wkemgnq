import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '@/components/Navigation'
import { ReferralBanner } from '@/components/ReferralBanner'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-pink-500/20 selection:text-pink-600">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <ReferralBanner />
      <Footer />
    </div>
  )
}
