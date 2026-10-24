import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '@/components/Navigation'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-pink-500/20 selection:text-pink-600">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
