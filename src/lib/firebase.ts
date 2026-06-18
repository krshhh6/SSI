import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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

// Initialize App Check to prevent generic DoS attacks
let appCheck;
if (typeof window !== "undefined") {
  // Ensure we only initialize App Check on the client side
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "YOUR_RECAPTCHA_V3_SITE_KEY"),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn("App Check failed to initialize:", err);
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { appCheck };
