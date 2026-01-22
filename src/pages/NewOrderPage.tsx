import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Minus, AlertTriangle, Package, ShoppingCart, Trash2 } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Input, Loading } from '@/components/ui'
import { useProducts } from '@/hooks'
import { orderService } from '@/services'
import { OrderItem, OrderFormData } from '@/types'

export function NewOrderPage() {
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const [selectedItems, setSelectedItems] = useState<Map<string, OrderItem>>(new Map())
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // Separar productos con stock bajo
  const { lowStockProducts, otherProducts } = useMemo(() => {
    const low = products.filter((p) => p.quantity <= p.alertLimit)
    const other = products.filter((p) => p.quantity > p.alertLimit)
    return { lowStockProducts: low, otherProducts: other }
  }, [products])

  const displayProducts = showAll ? [...lowStockProducts, ...otherProducts] : lowStockProducts

  const addItem = (productId: string, productName: string, currentStock: number) => {
    const newMap = new Map(selectedItems)
    const existing = newMap.get(productId)
    if (existing) {
      newMap.set(productId, { ...existing, quantity: existing.quantity + 1 })
    } else {
      newMap.set(productId, { productId, productName, quantity: 1, currentStock })
    }
    setSelectedItems(newMap)
  }

  const removeItem = (productId: string) => {
    const newMap = new Map(selectedItems)
    const existing = newMap.get(productId)
    if (existing && existing.quantity > 1) {
      newMap.set(productId, { ...existing, quantity: existing.quantity - 1 })
    } else {
      newMap.delete(productId)
    }
    setSelectedItems(newMap)
  }

  const deleteItem = (productId: string) => {
    const newMap = new Map(selectedItems)
    newMap.delete(productId)
    setSelectedItems(newMap)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      deleteItem(productId)
      return
    }
    const newMap = new Map(selectedItems)
    const existing = newMap.get(productId)
    if (existing) {
      newMap.set(productId, { ...existing, quantity })
    }
    setSelectedItems(newMap)
  }

  const handleSubmit = async () => {
    if (selectedItems.size === 0) {
      alert('Agrega al menos un producto')
      return
    }

    setSaving(true)
    try {
      const formData: OrderFormData = {
        items: Array.from(selectedItems.values()),
        notes: notes.trim(),
      }
      await orderService.create(formData)
      alert('Pedido creado')
      navigate('/orders', { replace: true })
    } catch (error) {
      alert('Error al crear pedido')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLayout title="Nuevo Pedido"><Loading /></PageLayout>

  return (
    <PageLayout title="📋 Nuevo Pedido">
      {/* Productos seleccionados */}
      {selectedItems.size > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <ShoppingCart size={20} />
            Productos a pedir ({selectedItems.size})
          </h2>
          <div className="space-y-2">
            {Array.from(selectedItems.values()).map((item) => (
              <div key={item.productId} className="product-item">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold truncate">{item.productName}</h3>
                  <p className="text-sm text-secondary">Stock actual: {item.currentStock}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-card-secondary flex items-center justify-center"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    className="w-16 h-10 text-center rounded-xl bg-card-secondary font-bold border-0"
                    value={item.quantity || ''}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                    min={0}
                  />
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-card-secondary flex items-center justify-center"
                    onClick={() => addItem(item.productId, item.productName, item.currentStock)}
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center"
                    onClick={() => deleteItem(item.productId)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notas */}
      <div className="mb-6">
        <Input
          label="Notas (opcional)"
          placeholder="Ej: Proveedor Juan, teléfono..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Botón crear */}
      <Button 
        fullWidth 
        size="large" 
        onClick={handleSubmit} 
        disabled={saving || selectedItems.size === 0}
        className="mb-6"
      >
        {saving ? 'Guardando...' : `Crear Pedido (${selectedItems.size} productos)`}
      </Button>

      {/* Lista de productos para agregar */}
      <div className="border-t border-border pt-6">
        {lowStockProducts.length > 0 && (
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange" />
            Stock Bajo
          </h2>
        )}

        {!showAll && otherProducts.length > 0 && (
          <button
            type="button"
            className="text-primary mb-4 text-sm underline"
            onClick={() => setShowAll(true)}
          >
            + Ver todos los productos ({otherProducts.length} más)
          </button>
        )}

        {displayProducts.length === 0 ? (
          <div className="text-center py-8 text-secondary">
            <Package size={48} className="mx-auto mb-2 opacity-30" />
            <p>No hay productos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayProducts.map((product) => {
              const isLowStock = product.quantity <= product.alertLimit
              const isSelected = selectedItems.has(product.id)
              
              return (
                <div 
                  key={product.id} 
                  className={`product-item cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => {
                    if (!isSelected) {
                      addItem(product.id, product.name, product.quantity)
                    }
                  }}
                >
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isLowStock ? 'gradient-orange' : 'bg-card-secondary'}`}>
                      <Package size={24} className={isLowStock ? 'text-white' : 'text-secondary'} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold truncate">{product.name}</h3>
                    <p className={`text-sm ${isLowStock ? 'text-orange font-semibold' : 'text-secondary'}`}>
                      Stock: {product.quantity} {isLowStock && '⚠️'}
                    </p>
                  </div>
                  {isSelected ? (
                    <span className="text-primary font-bold">✓ Agregado</span>
                  ) : (
                    <Plus size={24} className="text-primary" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
