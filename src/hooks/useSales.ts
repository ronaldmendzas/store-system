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

  // Ventas de hoy
  const todaySales = sales.filter((sale) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return sale.createdAt >= today
  })

  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  // Ventas de la semana (lunes a domingo)
  const getWeekStart = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    start.setHours(0, 0, 0, 0)
    return start
  }

  const weekSales = sales.filter((sale) => {
    return sale.createdAt >= getWeekStart()
  })

  const weekTotal = weekSales.reduce((sum, sale) => sum + sale.total, 0)

  return { sales, loading, todaySales, todayTotal, weekSales, weekTotal }
}
