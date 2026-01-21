import { useState, useEffect } from 'react'
import { BottleLoan } from '@/types'
import { bottleLoanService } from '@/services'

export function useBottleLoans() {
  const [loans, setLoans] = useState<BottleLoan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = bottleLoanService.subscribe((data) => {
      setLoans(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const totalGuarantee = loans.reduce((sum, loan) => sum + loan.guaranteeAmount, 0)

  return { loans, loading, totalGuarantee }
}
