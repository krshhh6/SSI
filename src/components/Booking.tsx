"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CalendarCheck, User, Phone, Car, Wrench, MessageSquare, LogIn, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const VEHICLE_BRANDS = [
  "Maruti Suzuki", "Hyundai", "Honda", "Toyota", "Tata",
  "Mahindra", "Kia", "Volkswagen", "Skoda", "Ford",
  "BMW", "Mercedes-Benz", "Audi", "Jeep", "Other",
];

const SERVICES = [
  "Periodic Maintenance", "Engine Diagnostics", "Dent & Paint",
  "AC Service & Repair", "Wheel Alignment", "Car Detailing",
  "Insurance Claim", "Genuine Parts", "Other",
];

export default function Booking() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", phone: "", brand: "", model: "",
    service: "", date: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill name and phone if user is signed in
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      let initialPhone = "";
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().phone) {
          initialPhone = userDoc.data().phone;
        }
      } catch (err) {
        // ignore
      }

      setForm((prev) => ({ 
        ...prev, 
        name: prev.name || user.displayName || "",
        phone: prev.phone || initialPhone
      }));
    }
    
    loadUserData();
  }, [user]);

  // Sanitize string: strip any HTML tags and trim whitespace
  const sanitize = (s: string) => s.replace(/<[^>]*>/g, "").trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Client-side validation ---
    const cleanName = sanitize(form.name);
    const cleanPhone = form.phone.replace(/\D/g, "");
    const cleanBrand = sanitize(form.brand);
    const cleanModel = sanitize(form.model);
    const cleanService = sanitize(form.service);
    const cleanMessage = sanitize(form.message);
    const cleanDate = form.date;

    if (cleanPhone.length !== 10) {
      alert("Please enter exactly 10 digits for your phone number.");
      return;
    }
    if (!cleanName || cleanName.length > 100) {
      alert("Please enter a valid name (max 100 characters).");
      return;
    }
    if (!cleanService) {
      alert("Please select a service.");
      return;
    }
    if (cleanMessage.length > 500) {
      alert("Message is too long (max 500 characters).");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        name: cleanName,
        phone: cleanPhone,
        brand: cleanBrand,
        model: cleanModel,
        service: cleanService,
        date: cleanDate,
        message: cleanMessage,
        userId: user!.uid,          // always use authenticated UID, never "guest"
        userEmail: user!.email || "",
        userName: user!.displayName || cleanName,
        status: "pending",          // always force pending — never trust the client
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Failed to submit booking. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setSubmitted(true);
  };


  const inputStyle = {
    width: "100%",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "13px 16px",
    color: "var(--text)",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <section
      id="booking"
      className="section-padding"
      style={{ background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient */}
      <div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 102, 255, 0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 100,
              border: "1px solid var(--border-hover)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Schedule Now
          </span>
          <h2 className="display-lg">
            BOOK YOUR{" "}
            <span className="gradient-text-blue">SERVICE</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "16px auto 0", fontSize: "1rem", lineHeight: 1.7 }}>
            Fill in the details and our team will confirm your appointment within 2 hours.
          </p>
        </motion.div>

        {/* Form Panel */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top border gradient */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 2,
              background: "linear-gradient(90deg, var(--bosch-red), var(--accent), var(--accent-secondary))",
            }}
          />

          {!user ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <div
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px", color: "var(--accent)",
                }}
              >
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", marginBottom: 12, fontFamily: "Outfit, sans-serif" }}>
                Sign In Required
              </h3>
              <p style={{ color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.6 }}>
                To secure your appointment and track its status in real-time, please sign in or create an account.
              </p>
              <motion.button
                onClick={() => router.push("/sign-in")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "14px 32px", borderRadius: 12, background: "var(--accent)", color: "white",
                  border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: "1rem", fontWeight: 700,
                  boxShadow: "0 8px 30px rgba(0,102,255,0.3)", display: "inline-flex", alignItems: "center", gap: 10,
                }}
              >
                <LogIn size={18} />
                Sign In / Sign Up
              </motion.button>
            </motion.div>
          ) : submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                style={{
                  width: 80, height: 80,
                  borderRadius: "50%",
                  background: "rgba(0, 200, 150, 0.15)",
                  border: "2px solid #00C896",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "2rem",
                }}
              >
                ✓
              </motion.div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>
                Booking Received!
              </h3>
              <p style={{ color: "var(--text-secondary)", maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.7 }}>
                We&apos;ll confirm your appointment at <strong style={{ color: "var(--text)" }}>+91 90283 84499</strong> within 2 hours.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                >
                  Book Another Service
                </button>
                <motion.button
                  onClick={() => router.push("/my-bookings")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "12px 24px", borderRadius: 10,
                    background: "var(--accent)", color: "white",
                    border: "none", cursor: "pointer",
                    fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <CalendarCheck size={16} />
                  View My Bookings
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
                className="form-grid"
              >
                {/* Name */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <User size={13} /> NAME
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={form.name}
                    maxLength={100}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Phone size={13} /> PHONE NUMBER
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm({ ...form, phone: val });
                    }}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Brand */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Car size={13} /> VEHICLE BRAND
                  </label>
                  <select
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  >
                    <option value="">Select Brand</option>
                    {VEHICLE_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Car size={13} /> VEHICLE MODEL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swift, Creta, i20"
                    value={form.model}
                    maxLength={100}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Service */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Wrench size={13} /> SERVICE REQUIRED
                  </label>
                  <select
                    required
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  >
                    <option value="">Select Service</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <CalendarCheck size={13} /> PREFERRED DATE
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    style={{ ...inputStyle }}
                    min={new Date().toISOString().split("T")[0]}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Message */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <MessageSquare size={13} /> ADDITIONAL MESSAGE
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any specific concerns or details about your vehicle..."
                    value={form.message}
                    maxLength={500}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 40px var(--accent-glow), 0 8px 30px rgba(0,102,255,0.3)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  marginTop: 28,
                  padding: "16px",
                  borderRadius: 10,
                  background: loading ? "rgba(0, 102, 255, 0.5)" : "var(--accent)",
                  color: "white",
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 0 20px var(--accent-glow)",
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ width: 18, height: 18, border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%" }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Schedule My Service
                  </>
                )}
              </motion.button>

              <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 16 }}>
                🔒 Your information is safe. We&apos;ll confirm via WhatsApp or call within 2 hours.
              </p>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
