import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 size={48} className="text-accent animate-spin" />
    </div>
  )
}
