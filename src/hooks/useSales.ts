import { useState, useEffect } from 'react'
import { Sale } from '@/types'
import { saleService } from '@/services'

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = saleService.subscribe((data) => {
      setSales(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const todaySales = sales.filter((sale) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return sale.createdAt >= today
  })

  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  return { sales, loading, todaySales, todayTotal }
}
