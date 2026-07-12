import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase not configured. Please set environment variables.');
}

export { db };

export const saveResponse = async (response) => {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'responses'), {
      response,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
    return docRef.id;
  } catch (e) {
    console.error('Firebase error:', e);
    return null;
  }
};
