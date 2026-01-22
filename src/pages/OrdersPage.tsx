import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Package, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading } from '@/components/ui'
import { useOrders, useProducts } from '@/hooks'
import { formatDate } from '@/utils'

export function OrdersPage() {
  const navigate = useNavigate()
  const { pendingOrders, receivedOrders, loading } = useOrders()
  const { products } = useProducts()

  // Productos con stock bajo
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.quantity <= p.alertLimit),
    [products]
  )

  if (loading) return <PageLayout title="Pedidos"><Loading /></PageLayout>

  return (
    <PageLayout title="📦 Pedidos">
      {/* Alerta de stock bajo */}
      {lowStockProducts.length > 0 && (
        <div className="stats-card warning mb-4">
          <p className="text-base font-bold">⚠️ {lowStockProducts.length} productos con stock bajo</p>
          <p className="text-sm text-secondary">Considera hacer un pedido</p>
        </div>
      )}

      <Button 
        fullWidth 
        size="large" 
        onClick={() => navigate('/orders/new')} 
        className="mb-6"
      >
        <Plus className="mr-2" size={24} />
        Nuevo Pedido
      </Button>

      {/* Pedidos Pendientes */}
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Clock size={20} className="text-orange" />
        Pendientes ({pendingOrders.length})
      </h2>

      {pendingOrders.length === 0 ? (
        <div className="text-center py-8 text-secondary mb-6">
          <Package size={48} className="mx-auto mb-2 opacity-30" />
          <p>No hay pedidos pendientes</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {pendingOrders.map((order) => (
            <div 
              key={order.id} 
              className="product-item cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="w-12 h-12 gradient-orange rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{order.items.length} productos</h3>
                <p className="text-sm text-secondary truncate">
                  {order.items.map(i => i.productName).join(', ')}
                </p>
                <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <ChevronRight size={24} className="text-secondary" />
            </div>
          ))}
        </div>
      )}

      {/* Pedidos Recibidos (últimos 10) */}
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <CheckCircle size={20} className="text-green" />
        Recibidos
      </h2>

      {receivedOrders.length === 0 ? (
        <div className="text-center py-8 text-secondary">
          <CheckCircle size={48} className="mx-auto mb-2 opacity-30" />
          <p>No hay historial de pedidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {receivedOrders.slice(0, 10).map((order) => (
            <div 
              key={order.id} 
              className="product-item cursor-pointer opacity-70"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="w-12 h-12 gradient-green rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{order.items.length} productos</h3>
                <p className="text-sm text-secondary truncate">
                  {order.items.map(i => i.productName).join(', ')}
                </p>
                <p className="text-xs text-muted">
                  Recibido: {order.receivedAt ? formatDate(order.receivedAt) : '-'}
                </p>
              </div>
              <ChevronRight size={24} className="text-secondary" />
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
