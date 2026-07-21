"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Domain restriction: Only @gmail.com is allowed
        if (u.email && !u.email.toLowerCase().endsWith("@gmail.com")) {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          // Ensure user document exists in Firestore 'users' collection
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: u.displayName || u.email?.split("@")[0] || "User",
              email: u.email,
              role: "user",
              createdAt: new Date(),
            });
          }
        } catch (err) {
          console.error("Error creating user document:", err);
        }
      }
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user && result.user.email) {
      const email = result.user.email.toLowerCase();
      if (!email.endsWith("@gmail.com")) {
        await signOut(auth);
        throw { 
          code: "auth/custom-domain-restricted", 
          message: "Only Gmail email addresses are allowed." 
        };
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
