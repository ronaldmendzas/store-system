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
    } catch (error) {
      alert('Error al subir la imagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-bold text-gray-700 mb-2">
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
        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl
          flex flex-col items-center justify-center gap-2
          hover:border-blue-500 transition-colors overflow-hidden"
      >
        {loading ? (
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        ) : value ? (
          <img src={value} alt="Producto" className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera className="w-12 h-12 text-gray-400" />
            <span className="text-lg text-gray-500">Tocar para agregar foto</span>
          </>
        )}
      </button>
    </div>
  )
}
