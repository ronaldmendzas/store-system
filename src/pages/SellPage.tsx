import { useState, useMemo } from 'react'
import { Search, ShoppingCart, Minus, Plus } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Loading } from '@/components/ui'
import { useProducts } from '@/hooks'
import { saleService } from '@/services'
import { formatCurrency } from '@/utils'

export function SellPage() {
  const { products, loading } = useProducts()
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ id: string; type: 'sold' | 'cancelled' } | null>(null)

  // Optimizado: useMemo para evitar re-renders innecesarios
  const filteredProducts = useMemo(() => 
    products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ), [products, search])

  const showFeedback = (id: string, type: 'sold' | 'cancelled') => {
    setFeedback({ id, type })
    setTimeout(() => setFeedback(null), 600)
  }

  const handleSell = async (product: typeof products[0]) => {
    if (processingId || product.quantity <= 0) return
    
    setProcessingId(product.id)
    try {
      await saleService.create(product.id, product.name, product.categoryId, 1, product.price)
      showFeedback(product.id, 'sold')
    } catch {
      alert('Error al vender')
    } finally {
      setProcessingId(null)
    }
  }

  const handleCancelSale = async (product: typeof products[0]) => {
    if (processingId) return
    
    setProcessingId(product.id)
    try {
      const cancelled = await saleService.cancelLastSale(product.id)
      if (cancelled) {
        showFeedback(product.id, 'cancelled')
      } else {
        alert('No hay ventas de hoy para cancelar')
      }
    } catch {
      alert('Error al cancelar')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <PageLayout title="Vender"><Loading /></PageLayout>

  return (
    <PageLayout title="🛒 Vender">
      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '48px' }}
        />
      </div>

      {/* Instrucciones */}
      <div className="stats-card info mb-4">
        <p className="text-base">
          <span className="text-red font-bold">−</span> Vender &nbsp;•&nbsp; 
          <span className="text-green font-bold">+</span> Cancelar venta
        </p>
      </div>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No hay productos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const isProcessing = processingId === product.id
            const soldFeedback = feedback?.id === product.id && feedback.type === 'sold'
            const cancelledFeedback = feedback?.id === product.id && feedback.type === 'cancelled'
            const noStock = product.quantity <= 0

            return (
              <div
                key={product.id}
                className={`product-item ${soldFeedback ? 'feedback-sold' : ''} ${cancelledFeedback ? 'feedback-cancelled' : ''} ${isProcessing ? 'opacity-50' : ''}`}
              >
                <img
                  src={product.imageUrl || '/placeholder.svg'}
                  alt={product.name}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{product.name}</h3>
                  <p className="text-blue font-bold">{formatCurrency(product.price)}</p>
                  <p className={`text-sm ${noStock ? 'text-red font-bold' : 'text-secondary'}`}>
                    Stock: {product.quantity}
                  </p>
                </div>

                {/* Feedback visual */}
                {soldFeedback && (
                  <span className="text-red font-bold text-lg">−1 ✓</span>
                )}
                {cancelledFeedback && (
                  <span className="text-green font-bold text-lg">+1 ✓</span>
                )}

                {/* Botones */}
                {!soldFeedback && !cancelledFeedback && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSell(product)}
                      disabled={isProcessing || noStock}
                      className={`btn-circle ${noStock ? 'disabled' : 'sell'}`}
                      title="Vender"
                    >
                      <Minus size={26} strokeWidth={2.5} />
                    </button>
                    
                    <button
                      onClick={() => handleCancelSale(product)}
                      disabled={isProcessing}
                      className="btn-circle add"
                      title="Cancelar venta"
                    >
                      <Plus size={26} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}
