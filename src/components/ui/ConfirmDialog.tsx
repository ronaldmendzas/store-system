import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-primary rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle size={40} className="text-warning" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-base text-secondary mb-6">{message}</p>
        <div className="flex gap-4">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm}>
            Sí, confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}
