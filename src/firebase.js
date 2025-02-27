import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBRGkPoJsxXEXQ9CQKvg9hV-g-8fOXPc6M",
  authDomain: "taskify-demo.firebaseapp.com",
  projectId: "taskify-demo",
  storageBucket: "taskify-demo.appspot.com",
  messagingSenderId: "958198551782",
  appId: "1:958198551782:web:a6963cb4c565798ab41727",
  measurementId: "G-G1FYYE3B7V"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const db = getFirestore();
export default db;