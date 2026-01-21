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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <p className="text-xl text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={onConfirm}
          >
            Sí, eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
