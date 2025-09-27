import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAjcCgHqKlWrSuEYAVkvpB_AJ1C8qMOkR4',
  authDomain: 'wheelboard-c1952.firebaseapp.com',
  projectId: 'wheelboard-c1952',
  storageBucket: 'wheelboard-c1952.firebasestorage.app',
  messagingSenderId: '1018003092155',
  appId: '1:1018003092155:web:8c8fa5603f222e4d6d6f9e',
  measurementId: 'G-R2YV94R8LZ',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
