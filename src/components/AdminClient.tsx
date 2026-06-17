"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  LayoutDashboard, Users, CalendarDays, LogOut, ChevronDown,
  Search, RefreshCw, Trash2, CheckCircle2, Clock, XCircle, AlertCircle,
  Wrench, Mail, Phone, Car, TrendingUp, Eye,
} from "lucide-react";

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
  pending:   { color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  icon: Clock,         label: "Pending"   },
  confirmed: { color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  icon: CheckCircle2,  label: "Confirmed" },
  completed: { color: "#10B981", bg: "rgba(16,185,129,0.12)",  icon: CheckCircle2,  label: "Completed" },
  cancelled: { color: "#EF4444", bg: "rgba(239,68,68,0.12)",   icon: XCircle,       label: "Cancelled" },
};

export default function AdminClient() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tab, setTab] = useState<"dashboard" | "bookings" | "users">("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check if already signed in as admin
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
    try {
      const bSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));

      const uSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserRecord)));
    } catch (e) {
      console.error(e);
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

  // ─── Login Screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: "100%", maxWidth: 420,
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 24, padding: 48, position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, var(--bosch-red), var(--accent))",
          }} />
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14,
              background: "var(--bosch-red)", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              boxShadow: "0 0 24px var(--bosch-red-glow)",
            }}>
              <Wrench size={28} color="white" />
            </div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--text)", marginBottom: 6 }}>
              Admin Portal
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>SAM Wheels – Bosch Car Service</p>
          </div>

          {loginError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 8, color: "#EF4444", fontSize: "0.85rem",
              }}>
              <AlertCircle size={16} /> {loginError}
            </motion.div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Mail size={12} /> EMAIL ADDRESS
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@samwheels.com"
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 10,
                  background: "var(--bg)", border: "1px solid var(--border)",
                  color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Wrench size={12} /> PASSWORD
              </label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 10,
                  background: "var(--bg)", border: "1px solid var(--border)",
                  color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", outline: "none",
                }}
              />
            </div>
            <motion.button
              type="submit" disabled={loginLoading}
              whileHover={!loginLoading ? { scale: 1.01 } : {}}
              whileTap={!loginLoading ? { scale: 0.99 } : {}}
              style={{
                marginTop: 8, padding: "14px", borderRadius: 10,
                background: loginLoading ? "rgba(226,0,26,0.5)" : "var(--bosch-red)",
                color: "white", border: "none", cursor: loginLoading ? "wait" : "pointer",
                fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem",
                letterSpacing: "0.05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 24px var(--bosch-red-glow)",
              }}
            >
              {loginLoading ? "Signing In..." : "Sign In to Admin"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}>
      {/* Sidebar */}
      <div style={{
        width: 240, flexShrink: 0, background: "var(--card)",
        borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column",
        padding: "24px 0", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: "var(--bosch-red)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px var(--bosch-red-glow)",
            }}>
              <Wrench size={16} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "var(--text)" }}>ADMIN PANEL</div>
              <div style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em" }}>SAM WHEELS</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
            { id: "bookings",  label: "Bookings",   icon: CalendarDays    },
            { id: "users",     label: "Users",       icon: Users           },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as typeof tab)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                background: tab === item.id ? "rgba(0,102,255,0.12)" : "transparent",
                color: tab === item.id ? "var(--accent)" : "var(--text-secondary)",
                fontFamily: "Inter, sans-serif", fontWeight: tab === item.id ? 600 : 500,
                fontSize: "0.88rem", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
                ...(tab === item.id ? { borderLeft: "3px solid var(--accent)" } : { borderLeft: "3px solid transparent" }),
              }}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}>
          <div style={{ padding: "8px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 2 }}>Signed in as</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text)", fontWeight: 600, wordBreak: "break-all" }}>{ADMIN_EMAIL}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
              background: "rgba(239,68,68,0.08)", color: "#EF4444",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.88rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 240, flex: 1, padding: "32px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--text)", marginBottom: 4 }}>
              {tab === "dashboard" ? "Dashboard" : tab === "bookings" ? "Bookings" : "Users"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {tab === "dashboard" ? "Overview of your service operations" : tab === "bookings" ? "Manage all customer appointments" : "Registered customer accounts"}
            </p>
          </div>
          <motion.button
            onClick={loadData} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
              borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)",
              color: "var(--text)", fontFamily: "Inter, sans-serif", fontWeight: 600,
              fontSize: "0.85rem", cursor: "pointer",
            }}
          >
            <RefreshCw size={15} className={dataLoading ? "animate-spin" : ""} />
            Refresh
          </motion.button>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Bookings",  value: stats.total,     color: "var(--accent)",  icon: CalendarDays  },
                { label: "Pending",         value: stats.pending,   color: "#F59E0B",        icon: Clock         },
                { label: "Confirmed",       value: stats.confirmed, color: "#3B82F6",        icon: CheckCircle2  },
                { label: "Completed",       value: stats.completed, color: "#10B981",        icon: TrendingUp    },
              ].map(card => (
                <motion.div
                  key={card.label}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: 16, padding: "24px 20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>{card.label}</span>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${card.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                      <card.icon size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: "2.2rem", fontWeight: 800, color: card.color, fontFamily: "Outfit, sans-serif" }}>
                    {dataLoading ? "—" : card.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>Recent Bookings</h2>
                <button onClick={() => setTab("bookings")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>View All →</button>
              </div>
              <BookingTable bookings={bookings.slice(0, 5)} onSelect={setSelectedBooking} onStatus={updateStatus} onDelete={deleteBooking} updatingId={updatingId} />
            </div>
          </motion.div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, service, phone…"
                  style={{
                    width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                    borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)",
                    color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.88rem", outline: "none",
                  }}
                />
              </div>
              <select
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: "11px 16px", borderRadius: 10, border: "1px solid var(--border)",
                  background: "var(--card)", color: "var(--text)",
                  fontFamily: "Inter, sans-serif", fontSize: "0.88rem", cursor: "pointer", outline: "none",
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem" }}>
                {filtered.length} results
              </div>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
              <BookingTable bookings={filtered} onSelect={setSelectedBooking} onStatus={updateStatus} onDelete={deleteBooking} updatingId={updatingId} />
            </div>
          </motion.div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Name", "Email", "Role", "Joined"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,102,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 700 }}>
                              {(u.name || "?")[0].toUpperCase()}
                            </div>
                            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>{u.name || "—"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", fontSize: "0.88rem" }}>{u.email}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, background: u.role === "admin" ? "rgba(226,0,26,0.12)" : "rgba(0,102,255,0.1)", color: u.role === "admin" ? "var(--bosch-red)" : "var(--accent)" }}>
                            {u.role || "user"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem" }}>
                          {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24,
                padding: 32, width: "100%", maxWidth: 520, position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--bosch-red), var(--accent))", borderRadius: "24px 24px 0 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", marginBottom: 4 }}>{selectedBooking.name}</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{selectedBooking.userEmail}</p>
                </div>
                <StatusBadge status={selectedBooking.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                {[
                  { icon: Phone,       label: "Phone",   value: selectedBooking.phone   },
                  { icon: Car,         label: "Vehicle", value: `${selectedBooking.brand} ${selectedBooking.model}` },
                  { icon: Wrench,      label: "Service", value: selectedBooking.service },
                  { icon: CalendarDays,label: "Date",    value: selectedBooking.date || "—" },
                ].map(item => (
                  <div key={item.label} style={{ background: "var(--bg)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                      <item.icon size={12} /> {item.label.toUpperCase()}
                    </div>
                    <div style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>{item.value || "—"}</div>
                  </div>
                ))}
              </div>

              {selectedBooking.message && (
                <div style={{ background: "var(--bg)", borderRadius: 12, padding: "12px 14px", marginBottom: 24 }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>MESSAGE</div>
                  <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.6 }}>{selectedBooking.message}</p>
                </div>
              )}

              {/* Status Actions */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>UPDATE STATUS</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["pending", "confirmed", "completed", "cancelled"] as Booking["status"][]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedBooking.id, s)}
                      disabled={selectedBooking.status === s || updatingId === selectedBooking.id}
                      style={{
                        padding: "8px 16px", borderRadius: 100, border: `1px solid ${STATUS_CONFIG[s].color}`,
                        background: selectedBooking.status === s ? STATUS_CONFIG[s].bg : "transparent",
                        color: STATUS_CONFIG[s].color, fontFamily: "Inter, sans-serif",
                        fontWeight: 600, fontSize: "0.8rem", cursor: selectedBooking.status === s ? "default" : "pointer",
                        opacity: updatingId === selectedBooking.id ? 0.5 : 1,
                      }}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => deleteBooking(selectedBooking.id)}
                  style={{
                    padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.08)", color: "#EF4444",
                    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border)",
                    background: "var(--bg)", color: "var(--text)",
                    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      padding: "5px 12px", borderRadius: 100,
      background: cfg.bg, color: cfg.color,
      fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em",
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <cfg.icon size={12} /> {cfg.label}
    </span>
  );
}

function BookingTable({ bookings, onSelect, onStatus, onDelete, updatingId }: {
  bookings: Booking[];
  onSelect: (b: Booking) => void;
  onStatus: (id: string, status: Booking["status"]) => void;
  onDelete: (id: string) => void;
  updatingId: string | null;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Customer", "Vehicle", "Service", "Date", "Status", "Actions"].map(h => (
              <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <td style={{ padding: "14px 20px" }}>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9rem", fontFamily: "Inter, sans-serif" }}>{b.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{b.phone}</div>
              </td>
              <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "0.88rem", fontFamily: "Inter, sans-serif" }}>{b.brand} {b.model}</td>
              <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", maxWidth: 160 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service}</div>
              </td>
              <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{b.date || "—"}</td>
              <td style={{ padding: "14px 20px" }}><StatusBadge status={b.status} /></td>
              <td style={{ padding: "14px 20px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => onSelect(b)}
                    style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem" }}>
                    <Eye size={13} /> View
                  </button>
                  {b.status === "pending" && (
                    <button onClick={() => onStatus(b.id, "confirmed")} disabled={updatingId === b.id}
                      style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.1)", color: "#3B82F6", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem" }}>
                      <CheckCircle2 size={13} /> Confirm
                    </button>
                  )}
                  <button onClick={() => onDelete(b.id)}
                    style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>No bookings found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Needed to avoid "defined but not used" lint error
const _unused = ChevronDown;
void _unused;
