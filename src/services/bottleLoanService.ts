import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { BottleLoan, BottleLoanFormData } from '@/types'

const COLLECTION_NAME = 'bottleLoans'

export const bottleLoanService = {
  subscribe(callback: (loans: BottleLoan[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const loans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as BottleLoan[]
      callback(loans)
    })
  },

  async create(data: BottleLoanFormData): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async markAsReturned(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  }
}
