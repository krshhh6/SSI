"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, orderBy, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { CalendarCheck, Car, Wrench, Clock, LogOut, User, RefreshCw, Phone, Save, ShieldCheck } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  phone: string;
  brand: string;
  model: string;
  service: string;
  date: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: { toDate: () => Date };
}

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "#FF8800", bg: "rgba(255,136,0,0.12)",   dot: "#FF8800" },
  confirmed: { label: "Confirmed", color: "#0066FF", bg: "rgba(0,102,255,0.12)",   dot: "#0066FF" },
  completed: { label: "Completed", color: "#00C896", bg: "rgba(0,200,150,0.12)",   dot: "#00C896" },
  cancelled: { label: "Cancelled", color: "#E2001A", bg: "rgba(226,0,26,0.12)",    dot: "#E2001A" },
};

export default function MyBookingsClient() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"bookings" | "profile">("bookings");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)));
    } catch {
      // If index not ready yet, fallback without orderBy
      try {
        const q2 = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q2);
        setBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)));
      } catch {
        setBookings([]);
      }
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().phone) {
        setPhoneNumber(userDoc.data().phone);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (phoneNumber && phoneNumber.length !== 10) {
      alert("Please enter exactly 10 digits for your phone number.");
      return;
    }
    setProfileLoading(true);
    setProfileSuccess("");
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "User",
        email: user.email || "",
        phone: phoneNumber,
        role: "user"
      }, { merge: true });
      setProfileSuccess("Profile successfully updated!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      alert("Failed to save profile. Please try again.");
    }
    setProfileLoading(false);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTop: "3px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <section style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
      {/* Ambient */}
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,255,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            {/* User info */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.displayName || "User"} style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={28} color="white" />
                </div>
              )}
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Welcome back</p>
                <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                  {user?.displayName?.split(" ")[0]}&apos;s Bookings
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button
                onClick={handleRefresh}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", fontFamily: "Inter, sans-serif",
                }}
              >
                <RefreshCw size={15} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
                Refresh
              </motion.button>

              <motion.button
                onClick={() => router.push("/booking")}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(0,102,255,0.3)" }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 10,
                  background: "var(--accent)", border: "none",
                  color: "white", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, fontFamily: "Inter, sans-serif",
                  boxShadow: "0 4px 20px rgba(0,102,255,0.25)",
                }}
              >
                <CalendarCheck size={15} />
                New Booking
              </motion.button>

              <motion.button
                onClick={async () => { await logout(); router.push("/"); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 16px", borderRadius: 10,
                  background: "rgba(226,0,26,0.08)",
                  border: "1px solid rgba(226,0,26,0.20)",
                  color: "#E2001A", cursor: "pointer", fontSize: "0.85rem", fontFamily: "Inter, sans-serif",
                }}
              >
                <LogOut size={15} />
                Sign Out
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 32, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
            <button onClick={() => setTab("bookings")}
              style={{ padding: "10px 20px", borderRadius: 10, background: tab === "bookings" ? "rgba(0,102,255,0.15)" : "transparent", border: tab === "bookings" ? "1px solid rgba(0,102,255,0.3)" : "1px solid transparent", color: tab === "bookings" ? "var(--accent)" : "var(--text-secondary)", fontWeight: 700, fontSize: "0.95rem", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
              <CalendarCheck size={16} /> My Bookings
            </button>
            <button onClick={() => setTab("profile")}
              style={{ padding: "10px 20px", borderRadius: 10, background: tab === "profile" ? "rgba(0,102,255,0.15)" : "transparent", border: tab === "profile" ? "1px solid rgba(0,102,255,0.3)" : "1px solid transparent", color: tab === "profile" ? "var(--accent)" : "var(--text-secondary)", fontWeight: 700, fontSize: "0.95rem", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
              <User size={16} /> My Profile
            </button>
          </div>
        </motion.div>

        {/* Tab Content: Bookings */}
        {tab === "bookings" && (
          <>
            {/* Stats bar */}
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
            {[
              { label: "Total Bookings", value: bookings.length, color: "#0066FF" },
              { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "#FF8800" },
              { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "#0066FF" },
              { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "#00C896" },
            ].map((stat) => (
              <div key={stat.label} style={{
                flex: "1 1 140px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "16px 20px",
              }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}>{stat.label}</div>
              </div>
            ))}
            </div>

            {/* Bookings List */}
        {loadingBookings ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTop: "3px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}>Loading your bookings…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center", padding: "80px 24px",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: 20 }}>🚗</div>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>No Bookings Yet</h3>
            <p style={{ color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", maxWidth: 320, margin: "0 auto 28px", lineHeight: 1.6 }}>
              You haven&apos;t made any service bookings yet. Schedule your first one now!
            </p>
            <motion.button
              onClick={() => router.push("/booking")}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(0,102,255,0.3)" }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "13px 28px", borderRadius: 10, background: "var(--accent)",
                border: "none", color: "white", cursor: "pointer",
                fontWeight: 700, fontSize: "0.95rem", fontFamily: "Inter, sans-serif",
              }}
            >
              Book a Service
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bookings.map((booking, i) => {
                const st = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const dateStr = booking.date ? new Date(booking.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—";
                const createdStr = booking.createdAt?.toDate?.().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) || "—";
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 18,
                      padding: "24px 28px",
                      display: "flex",
                      gap: 24,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      transition: "box-shadow 0.2s ease",
                    }}
                    whileHover={{ boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}
                  >
                    {/* Icon */}
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(0,102,255,0.12)", border: "1px solid rgba(0,102,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Car size={24} color="var(--accent)" />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                          {booking.brand} {booking.model}
                        </h3>
                        {/* Status badge */}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 100, background: st.bg, border: `1px solid ${st.color}33`, fontSize: "0.72rem", fontWeight: 600, color: st.color, fontFamily: "Inter, sans-serif", letterSpacing: "0.06em" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                          {st.label}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
                          <Wrench size={13} />
                          {booking.service}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
                          <CalendarCheck size={13} />
                          {dateStr}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>
                          <Clock size={12} />
                          Booked on {createdStr}
                        </div>
                      </div>

                      {booking.message && (
                        <p style={{ marginTop: 10, fontSize: "0.82rem", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", lineHeight: 1.5, padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                          💬 {booking.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
          </>
        )}

        {/* Tab Content: Profile */}
        {tab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ 
              maxWidth: 600, 
              background: "rgba(255,255,255,0.02)", 
              backdropFilter: "blur(24px)", 
              border: "1px solid rgba(255,255,255,0.08)", 
              borderRadius: 24, 
              padding: "32px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)" 
            }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.6rem", fontWeight: 800, margin: "0 0 8px 0" }}>Profile Details</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 32 }}>
                Manage your account information and contact details. Saving your phone number will automatically pre-fill it when making new bookings.
              </p>

              {profileSuccess && (
                <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 10, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <ShieldCheck size={18} /> {profileSuccess}
                </div>
              )}

              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Name (Read-only) */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>Full Name</label>
                  <input type="text" readOnly value={user?.displayName || "N/A"} 
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none", cursor: "not-allowed" }} />
                </div>
                
                {/* Email (Read-only) */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>Email Address</label>
                  <input type="email" readOnly value={user?.email || "N/A"} 
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none", cursor: "not-allowed" }} />
                </div>

                {/* Phone (Editable) */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>Mobile Number</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                      <Phone size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. 9876543210" 
                      value={phoneNumber} 
                      onChange={e => {
                        // Only allow numbers and max 10 digits
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(val);
                      }}
                      style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none", transition: "border 0.2s" }} 
                      onFocus={e => e.target.style.borderColor = "var(--accent)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 6 }}>10 digit mobile number without country code.</p>
                </div>

                <motion.button 
                  type="submit"
                  disabled={profileLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: "14px", borderRadius: 12, background: "var(--accent)", border: "none", color: "white", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: profileLoading ? "wait" : "pointer", marginTop: 8 }}
                >
                  {profileLoading ? (
                     <RefreshCw size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                  ) : (
                    <Save size={18} />
                  )}
                  {profileLoading ? "Saving..." : "Save Profile"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .container { padding: 0 16px !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
