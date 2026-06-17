"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  LayoutDashboard, Users, CalendarDays, LogOut,
  Search, RefreshCw, Trash2, CheckCircle2, Clock, XCircle, AlertCircle,
  Wrench, Mail, Phone, Car, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const ADMIN_EMAIL = "test01samwheels@gmail.com";

type Booking = {
  id: string;
  name: string;
  phone: string;
  brand: string;
  model: string;
  service: string;
  date: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  userId: string;
  userEmail: string;
  createdAt: { seconds: number } | null;
};

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: { seconds: number } | null;
};

const STATUS_CONFIG = {
  pending:   { color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  icon: Clock,         label: "Pending"   },
  confirmed: { color: "#3B82F6", bg: "rgba(59,130,246,0.15)",  icon: CheckCircle2,  label: "Confirmed" },
  completed: { color: "#10B981", bg: "rgba(16,185,129,0.15)",  icon: CheckCircle2,  label: "Completed" },
  cancelled: { color: "#EF4444", bg: "rgba(239,68,68,0.15)",   icon: XCircle,       label: "Cancelled" },
};

const PIE_COLORS = ["#0066FF", "#00C896", "#F59E0B", "#8B5CF6", "#EC4899", "#E2001A"];

export default function AdminClient() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tab, setTab] = useState<"overview" | "bookings" | "users">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u && u.email === ADMIN_EMAIL) {
        setAuthed(true);
        loadData();
      } else {
        setAuthed(false);
      }
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    setDataError("");
    try {
      // Try with orderBy first, fall back without if index not ready
      let bSnap;
      try {
        bSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
      } catch {
        bSnap = await getDocs(collection(db, "bookings"));
      }
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));

      let uSnap;
      try {
        uSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      } catch {
        uSnap = await getDocs(collection(db, "users"));
      }
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserRecord)));
    } catch (e: unknown) {
      console.error("Firestore error:", e);
      const msg = e instanceof Error ? e.message : "Unknown error";
      if (msg.includes("Missing or insufficient permissions") || msg.includes("permission-denied")) {
        setDataError("PERMISSION_DENIED");
      } else {
        setDataError(msg);
      }
    }
    setDataLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setLoginError("Access denied. This account is not an admin.");
      } else {
        setAuthed(true);
        loadData();
      }
    } catch {
      setLoginError("Invalid email or password.");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAuthed(false);
    router.push("/");
  };

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setUpdatingId(id);
    await updateDoc(doc(db, "bookings", id), { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status } : null);
    setUpdatingId(null);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    await deleteDoc(doc(db, "bookings", id));
    setBookings(prev => prev.filter(b => b.id !== id));
    setSelectedBooking(null);
  };

  const filtered = bookings.filter(b => {
    const matchSearch = search === "" || [b.name, b.userEmail, b.service, b.brand, b.model, b.phone]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  // Analytics Data Prep
  const serviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      counts[b.service] = (counts[b.service] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [bookings]);

  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    }).reverse();
    
    const counts: Record<string, number> = {};
    last7Days.forEach(date => counts[date] = 0);

    bookings.forEach(b => {
      if (!b.createdAt) return;
      const d = new Date(b.createdAt.seconds * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      if (counts[d] !== undefined) counts[d]++;
    });

    return Object.entries(counts).map(([date, bookings]) => ({ date, bookings }));
  }, [bookings]);

  // ─── Login Screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", padding: 24, position: "relative", overflow: "hidden"
      }}>
        {/* Ambient Glows */}
        <div style={{ position: "absolute", top: "10%", left: "10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 60%)", filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(226,0,26,0.05) 0%, transparent 60%)", filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: "100%", maxWidth: 420,
            background: "rgba(15,17,21,0.6)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 32, padding: "48px 40px",
            position: "relative", zIndex: 10, boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "var(--bosch-red)", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              boxShadow: "0 0 30px var(--bosch-red-glow)",
            }}>
              <Wrench size={26} color="white" />
            </div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "white", marginBottom: 8 }}>
              Admin Access
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>SAM Wheels Protected Portal</p>
          </div>

          {loginError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 12, padding: "12px 16px", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 8, color: "#EF4444", fontSize: "0.85rem",
              }}>
              <AlertCircle size={16} /> {loginError}
            </motion.div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                style={{
                  width: "100%", padding: "16px 20px", borderRadius: 14,
                  background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(0,102,255,0.05)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(0,0,0,0.2)"; }}
              />
            </div>
            <div>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: "100%", padding: "16px 20px", borderRadius: 14,
                  background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(0,102,255,0.05)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(0,0,0,0.2)"; }}
              />
            </div>
            <motion.button
              type="submit" disabled={loginLoading}
              whileHover={!loginLoading ? { scale: 1.02 } : {}}
              whileTap={!loginLoading ? { scale: 0.98 } : {}}
              style={{
                marginTop: 12, padding: "16px", borderRadius: 14,
                background: loginLoading ? "rgba(226,0,26,0.5)" : "var(--bosch-red)",
                color: "white", border: "none", cursor: loginLoading ? "wait" : "pointer",
                fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.05rem",
                letterSpacing: "0.05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 12px 30px var(--bosch-red-glow)", transition: "all 0.2s"
              }}
            >
              {loginLoading ? "Authenticating..." : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      {/* Ambient Backgrounds */}
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: "80vw", height: "80vw", background: "radial-gradient(circle, rgba(0,102,255,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Top Navigation */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,5,5,0.7)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bosch-red)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px var(--bosch-red-glow)" }}>
              <Wrench size={16} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1rem", color: "white", lineHeight: 1.1 }}>ADMIN PANEL</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "bookings", label: "Bookings", icon: CalendarDays },
              { id: "users",    label: "Users",    icon: Users },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as typeof tab)}
                style={{
                  padding: "8px 16px", borderRadius: 100, border: "none",
                  background: tab === item.id ? "rgba(255,255,255,0.1)" : "transparent",
                  color: tab === item.id ? "white" : "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif", fontWeight: tab === item.id ? 600 : 500, fontSize: "0.9rem",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
                }}
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={loadData}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)", color: "white", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <RefreshCw size={16} className={dataLoading ? "animate-spin" : ""} />
          </button>
          <div style={{ height: 24, width: 1, background: "rgba(255,255,255,0.1)" }} />
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.1)", color: "#EF4444",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 32px" }}>

        {/* ── FIRESTORE RULES ERROR BANNER ── */}
        {dataError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 16, padding: "20px 24px", marginBottom: 28,
              display: "flex", alignItems: "flex-start", gap: 16,
            }}
          >
            <AlertCircle size={24} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              {dataError === "PERMISSION_DENIED" ? (
                <>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#EF4444", marginBottom: 8 }}>
                    Firestore Rules Not Published — Action Required
                  </div>
                  <p style={{ color: "rgba(255,200,200,0.9)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 12 }}>
                    Firebase is blocking all database reads. You must publish the security rules to see bookings and users.
                  </p>
                  <ol style={{ color: "rgba(255,200,200,0.9)", fontSize: "0.9rem", lineHeight: 2, paddingLeft: 20 }}>
                    <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: "#66A3FF", fontWeight: 600 }}>console.firebase.google.com</a> → sam-wheels project</li>
                    <li>Click <strong style={{ color: "white" }}>Firestore Database</strong> in the left sidebar</li>
                    <li>Click the <strong style={{ color: "white" }}>Rules</strong> tab at the top</li>
                    <li>Replace the entire content with the rules below and click <strong style={{ color: "white" }}>Publish</strong></li>
                  </ol>
                  <pre style={{ marginTop: 14, padding: "16px", background: "rgba(0,0,0,0.4)", borderRadius: 12, color: "#A8FF78", fontSize: "0.82rem", overflowX: "auto", lineHeight: 1.6, border: "1px solid rgba(255,255,255,0.08)" }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                  </pre>
                  <button onClick={loadData} style={{ marginTop: 14, padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.15)", color: "#EF4444", fontFamily: "Inter, sans-serif", fontWeight: 600, cursor: "pointer" }}>
                    ↻ Retry After Publishing
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#EF4444", marginBottom: 6 }}>Error Loading Data</div>
                  <p style={{ color: "rgba(255,200,200,0.9)", fontSize: "0.9rem" }}>{dataError}</p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
              {[
                { label: "Total Bookings",  value: stats.total,     color: "#0066FF" },
                { label: "Pending",         value: stats.pending,   color: "#F59E0B" },
                { label: "Confirmed",       value: stats.confirmed, color: "#3B82F6" },
                { label: "Completed",       value: stats.completed, color: "#10B981" },
              ].map(card => (
                <div key={card.label} style={{
                  background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "24px",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>{card.label}</div>
                  <div style={{ fontSize: "3rem", fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif", lineHeight: 1 }}>{dataLoading ? "—" : card.value}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 32 }}>
              {/* Trend Chart */}
              <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "28px" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: 24 }}>Booking Trends (Last 7 Days)</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white" }} />
                      <Bar dataKey="bookings" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service Breakdown */}
              <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "28px" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: 24 }}>Popular Services</h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={serviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white" }} itemStyle={{ color: "white" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 10 }}>
                  {serviceData.slice(0, 4).map((entry, index) => (
                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[index % PIE_COLORS.length] }} />
                      {entry.name.length > 15 ? entry.name.slice(0, 15) + "..." : entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "white" }}>Recent Bookings</h2>
                <button onClick={() => setTab("bookings")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>View All Directory →</button>
              </div>
              <BookingTable bookings={bookings.slice(0, 5)} onSelect={setSelectedBooking} onStatus={updateStatus} updatingId={updatingId} />
            </div>
          </motion.div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, service, phone or vehicle..."
                  style={{
                    width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
                    borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)",
                    color: "white", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none", transition: "all 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <select
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: "14px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(20,20,25,0.8)", color: "white", backdropFilter: "blur(10px)",
                  fontFamily: "Inter, sans-serif", fontSize: "0.95rem", cursor: "pointer", outline: "none",
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, overflow: "hidden" }}>
              <BookingTable bookings={filtered} onSelect={setSelectedBooking} onStatus={updateStatus} updatingId={updatingId} />
            </div>
          </motion.div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
                      {["Customer", "Email Address", "Role", "Joined Date"].map(h => (
                        <th key={h} style={{ padding: "18px 28px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <td style={{ padding: "18px 28px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,102,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "0.9rem", fontWeight: 700, border: "1px solid rgba(0,102,255,0.3)" }}>
                              {(u.name || "?")[0].toUpperCase()}
                            </div>
                            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "white", fontSize: "0.95rem" }}>{u.name || "—"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "18px 28px", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}>{u.email}</td>
                        <td style={{ padding: "18px 28px" }}>
                          <span style={{ padding: "6px 14px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, background: u.role === "admin" ? "rgba(226,0,26,0.15)" : "rgba(0,102,255,0.1)", border: `1px solid ${u.role === "admin" ? "rgba(226,0,26,0.3)" : "rgba(0,102,255,0.2)"}`, color: u.role === "admin" ? "#FF4D6A" : "#66A3FF", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            {u.role || "user"}
                          </span>
                        </td>
                        <td style={{ padding: "18px 28px", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}>
                          {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(15,17,21,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32,
                padding: 40, width: "100%", maxWidth: 560, position: "relative", overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--bosch-red), var(--accent))" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "white", marginBottom: 4 }}>{selectedBooking.name}</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}><Mail size={14}/> {selectedBooking.userEmail}</p>
                </div>
                <StatusBadge status={selectedBooking.status} size="lg" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: Phone,       label: "Phone",   value: selectedBooking.phone   },
                  { icon: Car,         label: "Vehicle", value: `${selectedBooking.brand} ${selectedBooking.model}` },
                  { icon: Wrench,      label: "Service", value: selectedBooking.service },
                  { icon: CalendarDays,label: "Date",    value: selectedBooking.date || "—" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      <item.icon size={13} /> {item.label}
                    </div>
                    <div style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{item.value || "—"}</div>
                  </div>
                ))}
              </div>

              {selectedBooking.message && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px", marginBottom: 32 }}>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Additional Message</div>
                  <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: 1.6 }}>{selectedBooking.message}</p>
                </div>
              )}

              {/* Status Actions */}
              <div style={{ marginBottom: 32 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>Update Status</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(["pending", "confirmed", "completed", "cancelled"] as Booking["status"][]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedBooking.id, s)}
                      disabled={selectedBooking.status === s || updatingId === selectedBooking.id}
                      style={{
                        padding: "10px 20px", borderRadius: 100, border: `1px solid ${selectedBooking.status === s ? STATUS_CONFIG[s].color : 'rgba(255,255,255,0.1)'}`,
                        background: selectedBooking.status === s ? STATUS_CONFIG[s].bg : "transparent",
                        color: selectedBooking.status === s ? STATUS_CONFIG[s].color : "var(--text-secondary)", fontFamily: "Inter, sans-serif",
                        fontWeight: 600, fontSize: "0.85rem", cursor: selectedBooking.status === s ? "default" : "pointer",
                        opacity: updatingId === selectedBooking.id ? 0.5 : 1, transition: "all 0.2s"
                      }}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
                <button
                  onClick={() => deleteBooking(selectedBooking.id)}
                  style={{
                    padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.1)", color: "#EF4444",
                    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  style={{
                    padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)", color: "white",
                    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status, size = "sm" }: { status: Booking["status"], size?: "sm" | "lg" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      padding: size === "lg" ? "6px 16px" : "4px 12px", borderRadius: 100,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`,
      fontSize: size === "lg" ? "0.85rem" : "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
      display: "inline-flex", alignItems: "center", gap: 6, textTransform: "uppercase"
    }}>
      <cfg.icon size={size === "lg" ? 14 : 12} /> {cfg.label}
    </span>
  );
}

function BookingTable({ bookings, onSelect, onStatus, updatingId }: {
  bookings: Booking[];
  onSelect: (b: Booking) => void;
  onStatus: (id: string, status: Booking["status"]) => void;
  updatingId: string | null;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
            {["Customer", "Vehicle", "Service", "Date", "Status", "Actions"].map(h => (
              <th key={h} style={{ padding: "16px 28px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s", cursor: "pointer" }}
              onClick={() => onSelect(b)}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <td style={{ padding: "16px 28px" }}>
                <div style={{ fontWeight: 600, color: "white", fontSize: "0.95rem", fontFamily: "Inter, sans-serif" }}>{b.name}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{b.phone}</div>
              </td>
              <td style={{ padding: "16px 28px", color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", fontFamily: "Inter, sans-serif" }}>{b.brand} {b.model}</td>
              <td style={{ padding: "16px 28px", color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", maxWidth: 180 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service}</div>
              </td>
              <td style={{ padding: "16px 28px", color: "var(--text-secondary)", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{b.date || "—"}</td>
              <td style={{ padding: "16px 28px" }}><StatusBadge status={b.status} /></td>
              <td style={{ padding: "16px 28px" }}>
                <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => onSelect(b)}
                    style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                    <Eye size={14} /> View
                  </button>
                  {b.status === "pending" && (
                    <button onClick={() => onStatus(b.id, "confirmed")} disabled={updatingId === b.id}
                      style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.15)", color: "#66A3FF", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(59,130,246,0.25)"} onMouseLeave={e => e.currentTarget.style.background="rgba(59,130,246,0.15)"}>
                      <CheckCircle2 size={14} /> Confirm
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
          {bookings.length === 0 && (
            <tr><td colSpan={6} style={{ padding: 60, textAlign: "center", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontSize: "1.1rem" }}>No bookings found matching your criteria.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
