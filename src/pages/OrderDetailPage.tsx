import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading } from '@/components/ui'
import { orderService } from '@/services'
import { Order } from '@/types'
import { formatDate } from '@/utils'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [receiving, setReceiving] = useState(false)

  useEffect(() => {
    if (!id) return
    
    const unsubscribe = orderService.subscribe((orders) => {
      const found = orders.find((o) => o.id === id)
      setOrder(found || null)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id])

  const handleReceive = async () => {
    if (!order) return

    setReceiving(true)
    try {
      await orderService.markAsReceived(order.id, order.items)
      alert('¡Pedido recibido! Stock actualizado')
      navigate('/orders', { replace: true })
    } catch (error) {
      alert('Error al procesar pedido')
      console.error(error)
    } finally {
      setReceiving(false)
    }
  }

  if (loading) return <PageLayout title="Detalle"><Loading /></PageLayout>

  if (!order) {
    return (
      <PageLayout title="Pedido">
        <div className="text-center py-12">
          <AlertCircle size={64} className="mx-auto mb-4 text-secondary" />
          <p className="text-lg text-secondary">Pedido no encontrado</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">
            Volver
          </Button>
        </div>
      </PageLayout>
    )
  }

  const isPending = order.status === 'pending'

  return (
    <PageLayout title={isPending ? '📦 Pedido Pendiente' : '✅ Pedido Recibido'}>
      {/* Estado */}
      <div className={`stats-card ${isPending ? 'warning' : ''} mb-6`}>
        <div className="flex items-center gap-3">
          {isPending ? (
            <Clock size={32} className="text-orange" />
          ) : (
            <CheckCircle size={32} className="text-green" />
          )}
          <div>
            <p className="text-lg font-bold">{isPending ? 'Esperando llegada' : 'Recibido'}</p>
            <p className="text-sm text-secondary">
              Creado: {formatDate(order.createdAt)}
            </p>
            {order.receivedAt && (
              <p className="text-sm text-secondary">
                Recibido: {formatDate(order.receivedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notas */}
      {order.notes && (
        <div className="bg-card-secondary rounded-2xl p-4 mb-6">
          <p className="text-sm text-secondary mb-1">📝 Notas:</p>
          <p className="font-medium">{order.notes}</p>
        </div>
      )}

      {/* Lista de productos */}
      <h2 className="text-lg font-bold mb-3">
        Productos ({order.items.length})
      </h2>

      <div className="space-y-3 mb-6">
        {order.items.map((item, index) => (
          <div key={index} className="product-item">
            <div className="w-12 h-12 bg-card-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={24} className="text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold truncate">{item.productName}</h3>
              <p className="text-sm text-secondary">
                Stock al crear: {item.currentStock}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">+{item.quantity}</p>
              <p className="text-xs text-secondary">unidades</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de marcar recibido */}
      {isPending && (
        <Button
          fullWidth
          size="large"
          onClick={handleReceive}
          disabled={receiving}
          className="gradient-green"
        >
          {receiving ? (
            'Procesando...'
          ) : (
            <>
              <CheckCircle className="mr-2" size={24} />
              Marcar como Recibido
            </>
          )}
        </Button>
      )}

      {isPending && (
        <p className="text-center text-sm text-secondary mt-3">
          Al marcar como recibido, el stock de cada producto se actualizará automáticamente
        </p>
      )}
    </PageLayout>
  )
}
