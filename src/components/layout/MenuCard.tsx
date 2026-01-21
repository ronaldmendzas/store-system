import { useNavigate } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface MenuCardProps {
  title: string
  description: string
  icon: LucideIcon
  to: string
  gradient: string
  alert?: number
}

export function MenuCard({ title, description, icon: Icon, to, gradient, alert }: MenuCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className={`menu-card ${gradient}`}
    >
      {alert !== undefined && alert > 0 && (
        <div className="badge">{alert}</div>
      )}
      <div className="icon">
        <Icon size={28} />
      </div>
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-base opacity-80">{description}</p>
    </button>
  )
}
