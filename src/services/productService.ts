import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  increment
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Product, ProductFormData } from '@/types'

const COLLECTION_NAME = 'products'

export const productService = {
  subscribe(callback: (products: Product[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Product[]
      callback(products)
    })
  },

  async create(data: ProductFormData): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<void> {
    await updateDoc(doc(db, COLLECTION_NAME, id), data)
  },

  async updateQuantity(id: string, amount: number): Promise<void> {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      quantity: increment(amount)
    })
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  }
}
