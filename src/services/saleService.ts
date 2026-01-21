import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Sale } from '@/types'
import { productService } from './productService'

const COLLECTION_NAME = 'sales'

export const saleService = {
  subscribe(callback: (sales: Sale[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const sales = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Sale[]
      callback(sales)
    })
  },

  async create(
    productId: string,
    productName: string,
    categoryId: string,
    quantity: number,
    unitPrice: number
  ): Promise<string> {
    await productService.updateQuantity(productId, -quantity)
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      productId,
      productName,
      categoryId,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async getTodaySales(): Promise<Sale[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('createdAt', '>=', Timestamp.fromDate(today)),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Sale[]
  }
}
