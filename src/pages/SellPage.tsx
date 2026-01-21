import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading } from '@/components/ui'
import { useProducts, useCategories } from '@/hooks'
import { saleService } from '@/services'
import { formatCurrency } from '@/utils'
import { Product } from '@/types'

export function SellPage() {
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selling, setSelling] = useState(false)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.quantity > 0
  )

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Sin categoría'
  }

  const handleSell = async () => {
    if (!selectedProduct || quantity <= 0) return
    if (quantity > selectedProduct.quantity) {
      alert('No hay suficiente stock')
      return
    }

    setSelling(true)
    try {
      await saleService.create(
        selectedProduct.id,
        selectedProduct.name,
        selectedProduct.categoryId,
        quantity,
        selectedProduct.price
      )
      navigate('/sales', { state: { success: true } })
    } catch {
      alert('Error al registrar la venta')
    } finally {
      setSelling(false)
    }
  }

  if (loading) return <PageLayout title="Vender"><Loading /></PageLayout>

  if (selectedProduct) {
    const total = selectedProduct.price * quantity
    const maxQuantity = selectedProduct.quantity

    return (
      <PageLayout title="🛒 Confirmar Venta">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <img
            src={selectedProduct.imageUrl || '/placeholder.svg'}
            alt={selectedProduct.name}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
          <p className="text-lg text-gray-500 mb-2">{getCategoryName(selectedProduct.categoryId)}</p>
          <p className="text-xl text-blue-600 font-bold">{formatCurrency(selectedProduct.price)} c/u</p>
          <p className="text-lg text-gray-500">Disponible: {selectedProduct.quantity}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <label className="block text-xl font-bold text-gray-700 mb-4 text-center">
            ¿Cuántos vendes?
          </label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-20 h-20 bg-red-500 text-white rounded-2xl text-4xl
                flex items-center justify-center active:scale-95"
            >
              <Minus size={40} />
            </button>
            <span className="text-5xl font-bold w-24 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              className="w-20 h-20 bg-green-500 text-white rounded-2xl text-4xl
                flex items-center justify-center active:scale-95"
            >
              <Plus size={40} />
            </button>
          </div>
        </div>

        <div className="bg-green-100 rounded-2xl p-6 mb-6">
          <p className="text-xl text-center text-green-800">Total a cobrar:</p>
          <p className="text-4xl font-bold text-center text-green-600">{formatCurrency(total)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            size="large"
            onClick={() => setSelectedProduct(null)}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            size="large"
            onClick={handleSell}
            disabled={selling}
          >
            <Check className="inline mr-2" size={28} />
            {selling ? 'Vendiendo...' : 'Vender'}
          </Button>
        </div>
      </PageLayout>
    )
  }

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

      <p className="text-lg text-gray-500 mb-4 text-center">
        Toca un producto para venderlo
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                setSelectedProduct(product)
                setQuantity(1)
              }}
              className="bg-white rounded-2xl p-3 shadow-sm text-left active:scale-95 transition-transform"
            >
              <img
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-28 object-cover rounded-xl mb-2"
              />
              <h3 className="font-bold text-lg truncate">{product.name}</h3>
              <p className="text-blue-600 font-bold text-lg">{formatCurrency(product.price)}</p>
              <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
            </button>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
