import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2eLCseebh9Fa1KfwN18HOcTeFLi-Xlj8",
  authDomain: "loja-roupas-c9e57.firebaseapp.com",
  projectId: "loja-roupas-c9e57",
  storageBucket: "loja-roupas-c9e57.firebasestorage.app",
  messagingSenderId: "43106560088",
  appId: "1:43106560088:web:9e6df1ad98951d1d50422d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);