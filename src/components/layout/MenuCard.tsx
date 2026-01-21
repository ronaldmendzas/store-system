import { useNavigate } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface MenuCardProps {
  title: string
  description: string
  icon: LucideIcon
  to: string
  color: string
  alert?: number
}

export function MenuCard({ title, description, icon: Icon, to, color, alert }: MenuCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className={`
        w-full p-6 rounded-2xl text-white text-left
        transition-all duration-200 active:scale-95 relative
        ${color}
      `}
    >
      {alert !== undefined && alert > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white
          w-8 h-8 rounded-full flex items-center justify-center
          text-lg font-bold animate-pulse">
          {alert}
        </div>
      )}
      <Icon size={48} className="mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-lg opacity-90">{description}</p>
    </button>
  )
}
