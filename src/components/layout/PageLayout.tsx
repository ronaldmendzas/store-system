import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks'

interface PageLayoutProps {
  title: string
  children: ReactNode
  showBack?: boolean
  customBackAction?: () => void
}

export function PageLayout({ title, children, showBack = true, customBackAction }: PageLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const isHome = location.pathname === '/'

  const handleBack = () => {
    if (customBackAction) {
      customBackAction()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <header className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && !isHome && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center
                  hover:bg-white/30 transition-all"
                title="Volver"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-xl font-bold truncate">{title}</h1>
          </div>
          
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center
              hover:bg-white/30 transition-all"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>
      <main className="p-4 pb-safe animate-fadeIn">{children}</main>
    </div>
  )
}
