"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const sanitize = (s: string) => s.replace(/<[^>]*>/g, "").trim();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = sanitize(name);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (cleanName) {
          await updateProfile(userCred.user, { displayName: cleanName });
        }
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      const e = err as { message?: string };
      const msg = e.message || "Authentication failed.";
      if (msg.includes("email-already-in-use")) setError("This email is registered. Please sign in.");
      else if (msg.includes("wrong-password") || msg.includes("invalid-credential")) setError("Invalid email or password.");
      else if (msg.includes("weak-password")) setError("Password should be at least 6 characters.");
      else setError("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError("");
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 440,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.4)",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* Top Gradient accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #E2001A, #0066FF)",
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <X size={18} />
          </button>

          {/* Logo Badge */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg, #0066FF, #E2001A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(0,102,255,0.25)",
              color: "white",
            }}
          >
            <Sparkles size={26} />
          </div>

          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--text)",
              textAlign: "center",
              margin: "0 0 6px 0",
            }}
          >
            {isSignUp ? "Create an Account" : "Sign In to Continue"}
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              textAlign: "center",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              margin: "0 0 24px 0",
            }}
          >
            {isSignUp
              ? "Sign up to track your car service bookings & quotes."
              : "Access instant service quotes and manage your bookings."}
          </p>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                background: "rgba(226, 0, 26, 0.1)",
                border: "1px solid rgba(226, 0, 26, 0.25)",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#ff4d4d",
                fontSize: "0.85rem",
                marginBottom: 18,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {isSignUp && (
              <div style={{ position: "relative" }}>
                <UserIcon size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    borderRadius: 12,
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            )}

            <div style={{ position: "relative" }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: 12,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
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
                minLength={6}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: 12,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                background: "var(--accent)",
                color: "white",
                border: "none",
                cursor: loading ? "wait" : "pointer",
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.95rem",
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(0,102,255,0.3)",
                marginTop: 4,
              }}
            >
              {loading ? "Authenticating..." : isSignUp ? "Sign Up" : "Sign In"}
            </motion.button>
          </form>

          {/* Toggle mode */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                marginLeft: 6,
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Google Button */}
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 12,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
