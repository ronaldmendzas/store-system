import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Package, Edit, ArrowLeft } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading } from '@/components/ui'
import { useProducts, useCategories } from '@/hooks'
import { formatCurrency } from '@/utils'

export function CategoryProductsPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { products, loading: loadingProducts } = useProducts()
  const { categories, loading: loadingCategories } = useCategories()

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  )

  const categoryProducts = useMemo(
    () => products.filter((p) => p.categoryId === categoryId),
    [products, categoryId]
  )

  const handleAddProduct = () => {
    navigate(`/products/new?category=${categoryId}`)
  }

  const handleEditProduct = (productId: string) => {
    navigate(`/products/${productId}`)
  }

  const handleBack = () => {
    navigate('/categories', { replace: true })
  }

  if (loadingProducts || loadingCategories) {
    return <PageLayout title="Cargando..."><Loading /></PageLayout>
  }

  if (!category) {
    return (
      <PageLayout title="Categoría no encontrada">
        <p className="text-center text-secondary">Esta categoría no existe</p>
        <Button fullWidth onClick={handleBack} className="mt-4">
          Volver a Categorías
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title={`📦 ${category.name}`}
      customBackAction={handleBack}
    >
      <Button fullWidth size="large" onClick={handleAddProduct} className="mb-6">
        <Plus className="mr-2" size={24} />
        Agregar Producto a {category.name}
      </Button>

      {categoryProducts.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <Package size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No hay productos</p>
          <p className="text-base">Agrega productos a esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryProducts.map((product) => (
            <div key={product.id} className="product-item">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="w-16 h-16 bg-tertiary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={28} className="text-secondary" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold truncate">{product.name}</h3>
                <p className="text-lg font-bold text-blue">{formatCurrency(product.price)}</p>
                <p className={`text-sm ${product.quantity <= product.alertLimit ? 'text-red font-bold' : 'text-secondary'}`}>
                  Stock: {product.quantity}
                </p>
              </div>
              <button
                onClick={() => handleEditProduct(product.id)}
                className="btn-circle edit"
                style={{ width: '48px', height: '48px' }}
                title="Editar producto"
              >
                <Edit size={22} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button variant="secondary" fullWidth onClick={handleBack}>
          <ArrowLeft className="mr-2" size={20} />
          Volver a Categorías
        </Button>
      </div>
    </PageLayout>
  )
}
