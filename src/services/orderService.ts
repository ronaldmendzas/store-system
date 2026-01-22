import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Order, OrderFormData, OrderItem } from '@/types'
import { productService } from './productService'

const COLLECTION_NAME = 'orders'

export const orderService = {
  subscribe(callback: (orders: Order[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        receivedAt: doc.data().receivedAt?.toDate() || undefined
      })) as Order[]
      callback(orders)
    })
  },

  async create(data: OrderFormData): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      items: data.items,
      notes: data.notes,
      status: 'pending',
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async markAsReceived(orderId: string, items: OrderItem[]): Promise<void> {
    // Actualizar stock de cada producto
    for (const item of items) {
      await productService.updateQuantity(item.productId, item.quantity)
    }
    
    // Marcar pedido como recibido
    await updateDoc(doc(db, COLLECTION_NAME, orderId), {
      status: 'received',
      receivedAt: Timestamp.now()
    })
  },

  async getPendingOrders(): Promise<Order[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Order[]
  }
}
