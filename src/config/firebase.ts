import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAz_VzqXncqm5JCiANW5fufJH-oxs3-tpU",
  authDomain: "store-system-a16c7.firebaseapp.com",
  projectId: "store-system-a16c7",
  storageBucket: "store-system-a16c7.firebasestorage.app",
  messagingSenderId: "652728158348",
  appId: "1:652728158348:web:406ed4557cfb4543c953a9"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
