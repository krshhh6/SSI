import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRa3IGlQgbL5gwAMXgHIFUUSa-uPw76xA",
  authDomain: "sam-wheels.firebaseapp.com",
  projectId: "sam-wheels",
  storageBucket: "sam-wheels.firebasestorage.app",
  messagingSenderId: "1059618056171",
  appId: "1:1059618056171:web:488077b16688026a249bae",
};

// Prevent re-initialization in Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
