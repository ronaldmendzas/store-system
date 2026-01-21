import { useState } from 'react'
import { Search, ShoppingCart, Minus, Check } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Loading } from '@/components/ui'
import { useProducts } from '@/hooks'
import { saleService } from '@/services'
import { formatCurrency } from '@/utils'

export function SellPage() {
  const { products, loading } = useProducts()
  const [search, setSearch] = useState('')
  const [sellingId, setSellingId] = useState<string | null>(null)
  const [soldId, setSoldId] = useState<string | null>(null)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.quantity > 0
  )

  // Venta instantánea: -1 y listo
  const handleQuickSell = async (product: typeof products[0]) => {
    if (sellingId) return // Evitar doble clic
    
    setSellingId(product.id)
    try {
      await saleService.create(
        product.id,
        product.name,
        product.categoryId,
        1, // Siempre -1
        product.price
      )
      // Mostrar check verde por 1 segundo
      setSoldId(product.id)
      setTimeout(() => setSoldId(null), 1000)
    } catch {
      alert('Error al vender')
    } finally {
      setSellingId(null)
    }
  }

  if (loading) return <PageLayout title="Vender"><Loading /></PageLayout>

  return (
    <PageLayout title="🛒 Vender">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 pl-14 pr-4 text-xl border-2 border-gray-300 rounded-xl
              focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        </div>
      </div>

      <p className="text-lg text-green-600 mb-4 text-center font-bold">
        👆 Toca = -1 vendido
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const isSelling = sellingId === product.id
            const justSold = soldId === product.id

            return (
              <button
                key={product.id}
                onClick={() => handleQuickSell(product)}
                disabled={isSelling}
                className={`rounded-2xl p-3 shadow-sm text-left transition-all relative
                  ${justSold 
                    ? 'bg-green-500 scale-95' 
                    : 'bg-white active:scale-95 active:bg-green-100'
                  }
                  ${isSelling ? 'opacity-50' : ''}
                `}
              >
                {justSold && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-2xl">
                    <Check size={60} className="text-white" />
                  </div>
                )}
                <img
                  src={product.imageUrl || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-28 object-cover rounded-xl mb-2"
                />
                <h3 className="font-bold text-lg truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 font-bold text-lg">{formatCurrency(product.price)}</p>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Minus size={14} /> 1
                  </span>
                </div>
                <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
              </button>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}
