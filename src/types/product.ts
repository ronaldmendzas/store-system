export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  quantity: number
  categoryId: string
  alertLimit: number
  createdAt: Date
}

export interface ProductFormData {
  name: string
  price: number
  description: string
  imageUrl: string
  quantity: number
  categoryId: string
  alertLimit: number
}
