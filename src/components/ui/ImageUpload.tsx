import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { imageService } from '@/services'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => inputRef.current?.click()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const url = await imageService.upload(file)
      onChange(url)
    } catch {
      alert('Error al subir la imagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-base font-bold mb-2">
        Imagen del Producto
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full h-40 border-2 border-dashed rounded-xl
          flex flex-col items-center justify-center gap-2
          bg-secondary border-color hover:border-accent
          transition-colors overflow-hidden"
      >
        {loading ? (
          <Loader2 size={40} className="text-accent animate-spin" />
        ) : value ? (
          <img src={value} alt="Producto" className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera size={40} className="text-secondary" />
            <span className="text-base text-secondary">Tocar para agregar foto</span>
          </>
        )}
      </button>
    </div>
  )
}
