import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PageLayoutProps {
  title: string
  children: ReactNode
  showBack?: boolean
}

export function PageLayout({ title, children, showBack = true }: PageLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          {showBack && !isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-blue-600 active:scale-95"
            >
              <ArrowLeft size={28} />
            </button>
          )}
          <h1 className="text-2xl font-bold truncate">{title}</h1>
        </div>
      </header>
      <main className="p-4 pb-24">{children}</main>
    </div>
  )
}
