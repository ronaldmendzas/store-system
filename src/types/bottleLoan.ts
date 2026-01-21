export interface BottleLoan {
  id: string
  debtorName: string
  bottleType: string
  guaranteeAmount: number
  createdAt: Date
}

export interface BottleLoanFormData {
  debtorName: string
  bottleType: string
  guaranteeAmount: number
}
