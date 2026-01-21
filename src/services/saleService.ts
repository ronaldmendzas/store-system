import {
  collection,
  addDoc,
  deleteDoc,
  doc,
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

  // Cancelar última venta de un producto (devuelve stock)
  async cancelLastSale(productId: string): Promise<boolean> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Query simple sin índice compuesto - solo por productId
    const q = query(
      collection(db, COLLECTION_NAME),
      where('productId', '==', productId)
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return false
    }
    
    // Filtrar las de hoy y ordenar manualmente
    const todaySales = snapshot.docs
      .map(docSnap => ({
        docSnap,
        createdAt: docSnap.data().createdAt?.toDate() || new Date(0)
      }))
      .filter(item => item.createdAt >= today)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    if (todaySales.length === 0) {
      return false // No hay ventas de este producto hoy
    }
    
    const { docSnap: saleDoc } = todaySales[0]
    const saleData = saleDoc.data()
    
    // Devolver el stock
    await productService.updateQuantity(productId, saleData.quantity)
    
    // Eliminar la venta
    await deleteDoc(doc(db, COLLECTION_NAME, saleDoc.id))
    
    return true
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
