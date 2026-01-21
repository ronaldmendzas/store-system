import { useState, useEffect } from 'react'
import { Category } from '@/types'
import { categoryService } from '@/services'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = categoryService.subscribe((data) => {
      setCategories(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { categories, loading }
}
