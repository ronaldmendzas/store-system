import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { productService } from '@/services'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = productService.subscribe((data) => {
      setProducts(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.alertLimit
  )

  return { products, loading, lowStockProducts }
}
