export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  currentStock: number
}

export interface Order {
  id: string
  items: OrderItem[]
  notes: string
  status: 'pending' | 'received'
  createdAt: Date
  receivedAt?: Date
}

export interface OrderFormData {
  items: OrderItem[]
  notes: string
}
