import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Category, CategoryFormData } from '@/types'

const COLLECTION_NAME = 'categories'

export const categoryService = {
  subscribe(callback: (categories: Category[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Category[]
      callback(categories)
    })
  },

  async getAll(): Promise<Category[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Category[]
  },

  async create(data: CategoryFormData): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async update(id: string, data: Partial<CategoryFormData>): Promise<void> {
    await updateDoc(doc(db, COLLECTION_NAME, id), data)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  }
}
