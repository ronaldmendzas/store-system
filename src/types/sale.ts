export interface Sale {
  id: string
  productId: string
  productName: string
  categoryId: string
  quantity: number
  unitPrice: number
  total: number
  createdAt: Date
}

export interface SaleFormData {
  productId: string
  quantity: number
}
