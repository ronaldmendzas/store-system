import { useState, useEffect } from 'react'
import { Order } from '@/types'
import { orderService } from '@/services'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = orderService.subscribe((data) => {
      setOrders(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const receivedOrders = orders.filter((o) => o.status === 'received')
  const pendingCount = pendingOrders.length

  return { orders, pendingOrders, receivedOrders, pendingCount, loading }
}
