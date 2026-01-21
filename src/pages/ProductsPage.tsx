import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from 'lucide-react'
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

  const filteredProducts = useMemo(() => 
    products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
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

      <Button fullWidth size="large" onClick={() => navigate('/products/new')} className="mb-6">
        <Plus className="mr-2" size={24} />
        Agregar Producto
      </Button>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <Package size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No hay productos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-item ${isLowStock(product) ? 'feedback-sold' : ''}`}
            >
              <img
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold truncate">{product.name}</h3>
                  {isLowStock(product) && (
                    <AlertTriangle size={18} className="text-red flex-shrink-0" />
                  )}
                </div>
                <p className="text-secondary text-sm">{getCategoryName(product.categoryId)}</p>
                <p className="text-blue font-bold text-lg">{formatCurrency(product.price)}</p>
                <p className={`text-sm font-bold ${isLowStock(product) ? 'text-red' : 'text-green'}`}>
                  Stock: {product.quantity}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="btn-circle edit"
                  style={{ width: '44px', height: '44px' }}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => setDeleteProduct(product)}
                  className="btn-circle delete"
                  style={{ width: '44px', height: '44px' }}
                >
                  <Trash2 size={20} />
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
