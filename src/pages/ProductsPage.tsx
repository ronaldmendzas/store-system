import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading, ConfirmDialog } from '@/components/ui'
import { useProducts, useCategories } from '@/hooks'
import { productService } from '@/services'
import { formatCurrency } from '@/utils'
import { Product } from '@/types'

export function ProductsPage() {
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Sin categoría'
  }

  const isLowStock = (product: Product) => product.quantity <= product.alertLimit

  const handleDelete = async () => {
    if (deleteProduct) {
      await productService.delete(deleteProduct.id)
      setDeleteProduct(null)
    }
  }

  if (loading) return <PageLayout title="Productos"><Loading /></PageLayout>

  return (
    <PageLayout title="📦 Productos">
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
          />
        </div>
      </div>

      <Button
        fullWidth
        size="large"
        onClick={() => navigate('/products/new')}
        className="mb-6"
      >
        <Plus className="inline mr-2" size={28} />
        Agregar Producto
      </Button>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay productos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl p-4 shadow-sm flex gap-4
                ${isLowStock(product) ? 'ring-2 ring-red-500' : ''}`}
            >
              <img
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold truncate">{product.name}</h3>
                  {isLowStock(product) && (
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-gray-500">{getCategoryName(product.categoryId)}</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
                <p className={`text-lg font-bold ${isLowStock(product) ? 'text-red-600' : 'text-green-600'}`}>
                  Stock: {product.quantity}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="p-3 bg-blue-100 rounded-xl hover:bg-blue-200"
                >
                  <Edit size={24} className="text-blue-600" />
                </button>
                <button
                  onClick={() => setDeleteProduct(product)}
                  className="p-3 bg-red-100 rounded-xl hover:bg-red-200"
                >
                  <Trash2 size={24} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteProduct}
        title="Eliminar Producto"
        message={`¿Seguro que quieres eliminar "${deleteProduct?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteProduct(null)}
      />
    </PageLayout>
  )
}
