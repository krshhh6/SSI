"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Mail, Lock, AlertCircle, User as UserIcon } from "lucide-react";

export default function SignInClient() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.push("/my-bookings");
    }
  }, [user, loading, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Router push happens in useEffect when user changes
    } catch (err: any) {
      console.error(err);
      // Clean up Firebase error messages
      const msg = err.message || "Authentication failed.";
      if (msg.includes("email-already-in-use")) setError("This email is already registered. Please sign in.");
      else if (msg.includes("wrong-password") || msg.includes("invalid-credential")) setError("Invalid email or password.");
      else if (msg.includes("weak-password")) setError("Password should be at least 6 characters.");
      else setError("Authentication failed. Please check your details.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError("");
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === "auth/unauthorized-domain") {
        setError("Domain not authorized. Please add this URL to Firebase > Auth > Settings > Authorized domains.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Google Sign-In is not enabled. Please enable it in Firebase Console.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing.");
      } else {
        setError("Google Sign-In failed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTop: "3px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "13px 16px 13px 44px",
    color: "var(--text)",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: 40 }}>
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(226,0,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 440,
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 24,
            padding: "40px 40px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top gradient bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #E2001A, #0066FF)" }} />

          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            style={{
              width: 60, height: 60, borderRadius: 16,
              background: "linear-gradient(135deg, #E2001A, #A0000F)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 40px rgba(226,0,26,0.35)",
              fontSize: "1.75rem",
            }}
          >
            🔧
          </motion.div>

          {/* Heading */}
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", textAlign: "center", marginBottom: 8, lineHeight: 1.2 }}>
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "var(--text-secondary)", textAlign: "center", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 28 }}>
            {isSignUp ? "Sign up to track and manage your bookings." : "Sign in to view your car service bookings."}
          </p>

          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ background: "rgba(226,0,26,0.1)", border: "1px solid rgba(226,0,26,0.2)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10, color: "#ff4d4d", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isSignUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ position: "relative" }}>
                <UserIcon size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(0,102,255,0.03)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                />
              </motion.div>
            )}

            <div style={{ position: "relative" }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(0,102,255,0.03)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                required
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                minLength={6}
                onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(0,102,255,0.03)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={authLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: "var(--accent)", color: "white", border: "none",
                cursor: authLoading ? "wait" : "pointer",
                fontFamily: "Outfit, sans-serif", fontSize: "1rem", fontWeight: 700,
                boxShadow: "0 4px 20px rgba(0,102,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 8,
              }}
            >
              {authLoading ? (
                <div style={{ width: 18, height: 18, border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              ) : (
                isSignUp ? "Sign Up" : "Sign In"
              )}
            </motion.button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginLeft: 6, padding: 0 }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Google sign in button */}
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "13px 24px", borderRadius: 12, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.14)", color: "var(--text)", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 600, transition: "background 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.704H24.48v8.888h12.94c-.564 2.948-2.236 5.444-4.76 7.124v5.92h7.7c4.508-4.152 7.172-10.276 7.172-17.228z" fill="#4285F4"/>
              <path d="M24.48 48c6.48 0 11.924-2.148 15.9-5.82l-7.7-5.92c-2.148 1.44-4.904 2.292-8.2 2.292-6.308 0-11.652-4.26-13.572-9.996H2.96v6.116C6.932 42.788 15.12 48 24.48 48z" fill="#34A853"/>
              <path d="M10.908 28.556A14.573 14.573 0 0 1 10.16 24c0-1.58.268-3.116.748-4.556V13.328H2.96A23.972 23.972 0 0 0 .48 24c0 3.852.92 7.5 2.48 10.672l7.948-6.116z" fill="#FBBC05"/>
              <path d="M24.48 9.548c3.552 0 6.736 1.22 9.244 3.624l6.924-6.924C36.4 2.384 30.96 0 24.48 0 15.12 0 6.932 5.212 2.96 13.328l7.948 6.116C12.828 13.808 18.172 9.548 24.48 9.548z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
