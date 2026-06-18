"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc, Timestamp, addDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  LayoutDashboard, Users, CalendarDays, LogOut, Search, RefreshCw,
  Trash2, CheckCircle2, Clock, XCircle, AlertCircle, Wrench, Mail,
  Phone, Car, Eye, Download, Bell, TrendingUp, Filter, X,
  MessageSquare, ChevronDown, ChevronUp, Settings,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const ADMIN_EMAIL = "test01samwheels@gmail.com";
const PIE_COLORS = ["#0066FF", "#00C896", "#F59E0B", "#8B5CF6", "#EC4899", "#E2001A", "#06B6D4"];

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

const STATUS_CFG = {
  pending:   { color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.35)",  icon: Clock,         label: "Pending"   },
  confirmed: { color: "#3B82F6", bg: "rgba(59,130,246,0.15)",  border: "rgba(59,130,246,0.35)",   icon: CheckCircle2,  label: "Confirmed" },
  completed: { color: "#10B981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.35)",   icon: CheckCircle2,  label: "Completed" },
  cancelled: { color: "#EF4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.35)",    icon: XCircle,       label: "Cancelled" },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(seconds: number) {
  return new Date(seconds * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function exportCSV(bookings: Booking[]) {
  const rows = [
    ["Name","Phone","Vehicle","Service","Date","Status","Email","Booked On"],
    ...bookings.map(b => [
      b.name, b.phone, `${b.brand} ${b.model}`, b.service, b.date, b.status,
      b.userEmail, b.createdAt ? fmtDate(b.createdAt.seconds) : ""
    ])
  ];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, size = "sm" }: { status: Booking["status"], size?: "sm" | "lg" }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span style={{
      padding: size === "lg" ? "6px 14px" : "4px 10px", borderRadius: 100,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontSize: size === "lg" ? "0.85rem" : "0.72rem", fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: "0.03em",
      whiteSpace: "nowrap",
    }}>
      <c.icon size={size === "lg" ? 13 : 11} /> {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminClient() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [tab, setTab] = useState<"overview" | "bookings" | "users" | "analytics" | "advanced">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"createdAt" | "name" | "date">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [notifOpen, setNotifOpen] = useState(false);

  // Offline booking form state
  const [offlineForm, setOfflineForm] = useState({
    name: "", phone: "", brand: "", model: "", service: "", date: "", status: "completed" as Booking["status"]
  });
  const [offlineLoading, setOfflineLoading] = useState(false);
  const [offlineSuccess, setOfflineSuccess] = useState("");

  // Edit booking form state
  const [editBookingId, setEditBookingId] = useState("");
  const [editForm, setEditForm] = useState({
    name: "", phone: "", brand: "", model: "", service: "", date: "", status: "pending" as Booking["status"]
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");

  // Populate edit form when a booking is selected
  useEffect(() => {
    const b = bookings.find(x => x.id === editBookingId);
    if (b) {
      setEditForm({
        name: b.name || "", phone: b.phone || "", brand: b.brand || "", 
        model: b.model || "", service: b.service || "", date: b.date || "", 
        status: b.status || "pending"
      });
    } else {
      setEditForm({ name: "", phone: "", brand: "", model: "", service: "", date: "", status: "pending" });
    }
  }, [editBookingId, bookings]);

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (u?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) { setAuthed(true); loadData(); }
      else setAuthed(false);
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setDataLoading(true); setDataError("");
    try {
      let bSnap;
      try { bSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"))); }
      catch { bSnap = await getDocs(collection(db, "bookings")); }
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
      let uSnap;
      try { uSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"))); }
      catch { uSnap = await getDocs(collection(db, "users")); }
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserRecord)));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setDataError(msg.includes("permission") || msg.includes("denied") ? "PERMISSION_DENIED" : msg);
    }
    setDataLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError(""); setLoginLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      if (cred.user.email?.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) { await signOut(auth); setLoginError(`Access denied. Not an admin account. (${cred.user.email})`); }
      else { setAuthed(true); loadData(); }
    } catch { setLoginError("Invalid email or password."); }
    setLoginLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); setAuthed(false); router.push("/"); };

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setUpdatingId(id);
    await updateDoc(doc(db, "bookings", id), { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selectedBooking?.id === id) setSelectedBooking(p => p ? { ...p, status } : null);
    setUpdatingId(null);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Permanently delete this booking?")) return;
    await deleteDoc(doc(db, "bookings", id));
    setBookings(prev => prev.filter(b => b.id !== id));
    setSelectedBooking(null);
  };

  const submitOfflineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offlineForm.phone.length !== 10) {
      alert("Please enter exactly 10 digits for the phone number.");
      return;
    }
    setOfflineLoading(true);
    setOfflineSuccess("");
    try {
      // 1. Create a placeholder user if they don't exist
      const userRef = await addDoc(collection(db, "users"), {
        name: offlineForm.name,
        email: "offline_customer@local",
        role: "offline_user",
        createdAt: Timestamp.now()
      });
      // 2. Create the booking
      await addDoc(collection(db, "bookings"), {
        ...offlineForm,
        message: "Manually added by Admin",
        userId: userRef.id,
        userEmail: "offline_customer@local",
        createdAt: Timestamp.now()
      });
      setOfflineSuccess("Offline booking and customer successfully added!");
      setOfflineForm({ name: "", phone: "", brand: "", model: "", service: "", date: "", status: "completed" });
      loadData(); // Refresh everything
    } catch (err: unknown) {
      alert("Error adding offline booking: " + (err instanceof Error ? err.message : String(err)));
    }
    setOfflineLoading(false);
  };

  const submitEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookingId) return;
    if (editForm.phone.length !== 10) {
      alert("Please enter exactly 10 digits for the phone number.");
      return;
    }
    setEditLoading(true);
    setEditSuccess("");
    try {
      await updateDoc(doc(db, "bookings", editBookingId), editForm);
      setEditSuccess("Booking successfully updated!");
      loadData();
      setTimeout(() => setEditSuccess(""), 4000);
    } catch (err: unknown) {
      alert("Error updating booking: " + (err instanceof Error ? err.message : String(err)));
    }
    setEditLoading(false);
  };

  // Stats
  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    todayCount: bookings.filter(b => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt.seconds * 1000);
      const n = new Date();
      return d.toDateString() === n.toDateString();
    }).length,
    completionRate: bookings.length ? Math.round((bookings.filter(b => b.status === "completed").length / bookings.length) * 100) : 0,
  }), [bookings]);

  // Chart data
  const trendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }), date: d.toDateString() };
    });
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d.date] = 0);
    bookings.forEach(b => {
      if (!b.createdAt) return;
      const ds = new Date(b.createdAt.seconds * 1000).toDateString();
      if (counts[ds] !== undefined) counts[ds]++;
    });
    return days.map(d => ({ date: d.label, bookings: counts[d.date] }));
  }, [bookings]);

  const serviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => { counts[b.service] = (counts[b.service] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [bookings]);

  const brandData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => { if (b.brand) counts[b.brand] = (counts[b.brand] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [bookings]);

  const statusData = useMemo(() => [
    { name: "Pending",   value: stats.pending,   color: "#F59E0B" },
    { name: "Confirmed", value: stats.confirmed,  color: "#3B82F6" },
    { name: "Completed", value: stats.completed,  color: "#10B981" },
    { name: "Cancelled", value: stats.cancelled,  color: "#EF4444" },
  ].filter(d => d.value > 0), [stats]);

  // Filtered & sorted bookings
  const filtered = useMemo(() => {
    let list = [...bookings];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(b => [b.name, b.userEmail, b.service, b.brand, b.model, b.phone, b.date].some(v => v?.toLowerCase().includes(s)));
    }
    if (statusFilter !== "all") list = list.filter(b => b.status === statusFilter);
    if (dateFilter) list = list.filter(b => b.date === dateFilter);
    list.sort((a, b) => {
      if (sortField === "createdAt") {
        const av = a.createdAt?.seconds ?? 0, bv = b.createdAt?.seconds ?? 0;
        return sortDir === "desc" ? bv - av : av - bv;
      }
      if (sortField === "name") return sortDir === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      if (sortField === "date") return sortDir === "desc" ? (b.date ?? "").localeCompare(a.date ?? "") : (a.date ?? "").localeCompare(b.date ?? "");
      return 0;
    });
    return list;
  }, [bookings, search, statusFilter, dateFilter, sortField, sortDir]);

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const todayBookings = bookings.filter(b => {
    if (!b.date) return false;
    const today = new Date().toISOString().split("T")[0];
    return b.date === today;
  });

  // Toggle sort
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    sortField === field ? (sortDir === "desc" ? <ChevronDown size={12}/> : <ChevronUp size={12}/>) : null
  );

  // ─── LOGIN ───────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "5%", left: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,102,255,0.07) 0%, transparent 60%)", filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(226,0,26,0.05) 0%, transparent 60%)", filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none" }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 420, background: "var(--card)", backdropFilter: "blur(40px)", border: "1px solid var(--border)", borderRadius: 32, padding: "48px 40px", position: "relative", zIndex: 10, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #E2001A, #0066FF)", borderRadius: "32px 32px 0 0" }} />
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "var(--bosch-red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 32px rgba(226,0,26,0.4)" }}>
            <Wrench size={28} color="white" />
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.9rem", color: "var(--text)", marginBottom: 6 }}>Admin Portal</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>SAM Wheels · Bosch Car Service</p>
        </div>
        {loginError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 8, color: "#EF4444", fontSize: "0.85rem" }}>
            <AlertCircle size={15} />{loginError}
          </motion.div>
        )}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Admin Email Address"
            style={{ width: "100%", padding: "15px 18px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none" }}
            onFocus={e => { e.target.style.borderColor = "var(--accent)"; }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }} />
          <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="Password"
            style={{ width: "100%", padding: "15px 18px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none" }}
            onFocus={e => { e.target.style.borderColor = "var(--accent)"; }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }} />
          <motion.button type="submit" disabled={loginLoading} whileHover={!loginLoading ? { scale: 1.01 } : {}} whileTap={!loginLoading ? { scale: 0.99 } : {}}
            style={{ marginTop: 8, padding: "16px", borderRadius: 12, background: loginLoading ? "rgba(226,0,26,0.5)" : "#E2001A", color: "var(--text)", border: "none", cursor: loginLoading ? "wait" : "pointer", fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.06em", boxShadow: "0 8px 28px rgba(226,0,26,0.35)" }}>
            {loginLoading ? "Authenticating…" : "Sign In to Admin"}
          </motion.button>
        </form>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>🔒 Restricted access — authorized personnel only</p>
      </motion.div>
    </div>
  );

  // ─── DASHBOARD ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Background glows */}
      <div style={{ position: "fixed", top: "-10%", right: "-5%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(0,102,255,0.025) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(5,5,5,0.8)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E2001A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(226,0,26,0.4)" }}>
              <Wrench size={16} color="white" />
            </div>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", letterSpacing: "0.04em" }}>SAM WHEELS ADMIN</span>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {([
              { id: "overview",  label: "Overview",  icon: LayoutDashboard },
              { id: "bookings",  label: "Bookings",  icon: CalendarDays    },
              { id: "users",     label: "Users",     icon: Users           },
              { id: "analytics", label: "Analytics", icon: TrendingUp      },
              { id: "advanced",  label: "Advanced",  icon: Settings        },
            ] as const).map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: tab === item.id ? "rgba(255,255,255,0.1)" : "transparent", color: tab === item.id ? "white" : "rgba(255,255,255,0.45)", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s" }}>
                <item.icon size={15} />{item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Today badge */}
          {stats.todayCount > 0 && (
            <div style={{ padding: "5px 12px", borderRadius: 100, background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.25)", color: "#00C896", fontSize: "0.78rem", fontWeight: 700 }}>
              {stats.todayCount} today
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setNotifOpen(o => !o)}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Bell size={16} />
              {pendingBookings.length > 0 && (
                <span style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "#F59E0B", color: "var(--text)", fontSize: "0.6rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pendingBookings.length > 9 ? "9+" : pendingBookings.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  style={{ position: "absolute", right: 0, top: 46, width: 320, background: "var(--card)", backdropFilter: "blur(24px)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 200 }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>Pending Bookings</span>
                    <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}><X size={15} /></button>
                  </div>
                  {pendingBookings.length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "0.88rem" }}>All caught up! ✓</div>
                  ) : (
                    <div style={{ maxHeight: 280, overflowY: "auto" }}>
                      {pendingBookings.slice(0, 6).map(b => (
                        <div key={b.id} onClick={() => { setSelectedBooking(b); setNotifOpen(false); }} style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: 3 }}>{b.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{b.service} · {b.brand} {b.model}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)" }}>
                    <button onClick={() => { setTab("bookings"); setStatusFilter("pending"); setNotifOpen(false); }}
                      style={{ width: "100%", padding: "8px", borderRadius: 8, border: "none", background: "rgba(245,158,11,0.12)", color: "#F59E0B", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                      View All Pending →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={loadData} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <RefreshCw size={15} className={dataLoading ? "animate-spin" : ""} />
          </button>

          <div style={{ width: 1, height: 24, background: "var(--border)" }} />

          <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#EF4444", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            <LogOut size={14} />Sign Out
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 28px", position: "relative", zIndex: 1 }}>

        {/* Error Banner */}
        {dataError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <AlertCircle size={22} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              {dataError === "PERMISSION_DENIED" ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#EF4444", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>Firestore Rules Not Published</div>
                  <p style={{ color: "rgba(255,180,180,0.9)", fontSize: "0.88rem", marginBottom: 12 }}>Firebase is blocking all database reads. Go to Firebase Console → Firestore → Rules tab and replace the rules with:</p>
                  <pre style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: "14px 16px", color: "#A8FF78", fontSize: "0.8rem", overflowX: "auto", border: "1px solid var(--border)", marginBottom: 12 }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                  </pre>
                  <button onClick={loadData} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.12)", color: "#EF4444", fontFamily: "Inter, sans-serif", fontWeight: 600, cursor: "pointer" }}>↻ Retry</button>
                </>
              ) : (
                <><div style={{ fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>Error loading data</div><p style={{ color: "rgba(255,180,180,0.8)", fontSize: "0.88rem" }}>{dataError}</p></>
              )}
            </div>
          </motion.div>
        )}

        {/* ────────────────────── OVERVIEW ────────────────────── */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total",       value: stats.total,          color: "#0066FF", sub: `${stats.todayCount} today`     },
                { label: "Pending",     value: stats.pending,        color: "#F59E0B", sub: "Needs attention"                },
                { label: "Confirmed",   value: stats.confirmed,      color: "#3B82F6", sub: "In pipeline"                    },
                { label: "Completed",   value: stats.completed,      color: "#10B981", sub: `${stats.completionRate}% rate`  },
                { label: "Cancelled",   value: stats.cancelled,      color: "#EF4444", sub: "Lost bookings"                  },
              ].map(c => (
                <div key={c.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid var(--border)", borderRadius: 20, padding: "20px", position: "relative", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => { if (c.label !== "Total") { setTab("bookings"); setStatusFilter(c.label.toLowerCase()); } else setTab("bookings"); }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{c.label}</div>
                  <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--text)", lineHeight: 1, marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>{dataLoading ? "—" : c.value}</div>
                  <div style={{ fontSize: "0.75rem", color: c.color, fontWeight: 600 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
              <GlassCard title="Booking Trends — Last 7 Days">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                    <Line type="monotone" dataKey="bookings" stroke="#0066FF" strokeWidth={2.5} dot={{ fill: "#0066FF", r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard title="Status Breakdown">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {statusData.map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />{s.name}: <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Today's bookings + Recent */}
            {todayBookings.length > 0 && (
              <GlassCard title={`📅 Today's Appointments (${todayBookings.length})`} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {todayBookings.map(b => (
                    <div key={b.id} onClick={() => setSelectedBooking(b)}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,102,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Car size={18} color="#0066FF" /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>{b.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{b.service} · {b.brand} {b.model}</div>
                      </div>
                      <StatusBadge status={b.status} />
                      {b.status === "pending" && (
                        <button onClick={ev => { ev.stopPropagation(); updateStatus(b.id, "confirmed"); }}
                          style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.12)", color: "#3B82F6", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                          Confirm
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Recent bookings table */}
            <GlassCard title="Recent Bookings" action={<button onClick={() => setTab("bookings")} style={{ background: "none", border: "none", color: "#0066FF", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>View All →</button>}>
              <BookingTable bookings={bookings.slice(0, 6)} onSelect={setSelectedBooking} onStatus={updateStatus} updatingId={updatingId} sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
            </GlassCard>
          </motion.div>
        )}

        {/* ────────────────────── BOOKINGS ────────────────────── */}
        {tab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, vehicle, service…"
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 13, paddingBottom: 13, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,102,255,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: "13px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", cursor: "pointer", outline: "none", colorScheme: "inherit" }}>
                <option value="all" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>All Status</option>
                <option value="pending" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Pending</option>
                <option value="confirmed" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Confirmed</option>
                <option value="completed" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Completed</option>
                <option value="cancelled" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Cancelled</option>
              </select>
              <div style={{ position: "relative" }}>
                <Filter size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                  style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 13, paddingBottom: 13, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", cursor: "pointer", outline: "none", colorScheme: "inherit" }} />
              </div>
              {(search || statusFilter !== "all" || dateFilter) && (
                <button onClick={() => { setSearch(""); setStatusFilter("all"); setDateFilter(""); }}
                  style={{ padding: "13px 14px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  <X size={14} />Clear
                </button>
              )}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{filtered.length} results</span>
                <button onClick={() => exportCSV(filtered)}
                  style={{ padding: "11px 16px", borderRadius: 12, border: "1px solid rgba(0,200,150,0.25)", background: "rgba(0,200,150,0.08)", color: "#00C896", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                  <Download size={14} />Export CSV
                </button>
              </div>
            </div>

            <GlassCard>
              <BookingTable bookings={filtered} onSelect={setSelectedBooking} onStatus={updateStatus} updatingId={updatingId} sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
            </GlassCard>
          </motion.div>
        )}

        {/* ────────────────────── USERS ────────────────────── */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard title={`Registered Customers (${users.length})`}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Customer", "Email", "Bookings", "Role", "Joined"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => {
                      const uBookings = bookings.filter(b => b.userId === u.id);
                      return (
                        <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "15px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,102,255,0.12)", border: "1px solid rgba(0,102,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0066FF", fontWeight: 800, fontSize: "0.9rem" }}>
                                {(u.name || "?")[0].toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.92rem" }}>{u.name || "—"}</span>
                            </div>
                          </td>
                          <td style={{ padding: "15px 20px", color: "var(--text-secondary)", fontSize: "0.88rem" }}>{u.email}</td>
                          <td style={{ padding: "15px 20px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              {uBookings.length === 0 ? <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>No bookings</span> : (
                                <>
                                  <span style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(0,102,255,0.1)", color: "#0066FF", fontSize: "0.75rem", fontWeight: 700 }}>{uBookings.length} total</span>
                                  {uBookings.filter(b => b.status === "pending").length > 0 && <span style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(245,158,11,0.1)", color: "#F59E0B", fontSize: "0.75rem", fontWeight: 700 }}>{uBookings.filter(b => b.status === "pending").length} pending</span>}
                                </>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "15px 20px" }}>
                            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: u.role === "admin" ? "rgba(226,0,26,0.12)" : "rgba(0,102,255,0.08)", border: `1px solid ${u.role === "admin" ? "rgba(226,0,26,0.25)" : "rgba(0,102,255,0.2)"}`, color: u.role === "admin" ? "#FF4D6A" : "#66A3FF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {u.role || "user"}
                            </span>
                          </td>
                          <td style={{ padding: "15px 20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            {u.createdAt?.seconds ? fmtDate(u.createdAt.seconds) : "—"}
                          </td>
                        </motion.tr>
                      );
                    })}
                    {users.length === 0 && <tr><td colSpan={5} style={{ padding: 50, textAlign: "center", color: "var(--text-muted)" }}>No registered users yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ────────────────────── ANALYTICS ────────────────────── */}
        {tab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <GlassCard title="Bookings by Service">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={serviceData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} angle={-35} textAnchor="end" interval={0} />
                    <YAxis stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {serviceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard title="Popular Vehicle Brands">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={brandData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                    <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#0066FF" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard title="7-Day Booking Trend">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                    <Line type="monotone" dataKey="bookings" stroke="#00C896" strokeWidth={2.5} dot={{ fill: "#00C896", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard title="Service Status Breakdown">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                        {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 }}>
                  {statusData.map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      {s.name}: <strong style={{ color: s.color }}>{s.value}</strong>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Key Metrics */}
            <GlassCard title="Key Performance Metrics">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {[
                  { label: "Completion Rate",    value: `${stats.completionRate}%`,  color: "#10B981", desc: "Of all bookings" },
                  { label: "Total Bookings",     value: stats.total,                 color: "#0066FF", desc: "All time" },
                  { label: "Registered Users",   value: users.length,                color: "#8B5CF6", desc: "Accounts created" },
                  { label: "Services Offered",   value: serviceData.length,          color: "#F59E0B", desc: "Unique services booked" },
                ].map(m => (
                  <div key={m.label} style={{ background: "var(--bg-secondary)", borderRadius: 16, padding: "20px", border: "1px solid var(--border)", textAlign: "center" }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: m.color, fontFamily: "Outfit, sans-serif", marginBottom: 6 }}>{m.value}</div>
                    <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.9rem", marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ────────────────────── ADVANCED ────────────────────── */}
        {tab === "advanced" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              
              {/* Add Offline Booking */}
              <GlassCard title="➕ Record Offline Booking & Customer">
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20 }}>
                  Manually register walk-in or call-in customers. This automatically creates a customer profile and adds their appointment to the bookings list and analytics.
                </p>
                
                {offlineSuccess && (
                  <div style={{ padding: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
                    ✓ {offlineSuccess}
                  </div>
                )}

                <form onSubmit={submitOfflineBooking} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <input required placeholder="Customer Name" value={offlineForm.name} onChange={e => setOfflineForm({...offlineForm, name: e.target.value})}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                    <input required placeholder="Phone Number" value={offlineForm.phone} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setOfflineForm({...offlineForm, phone: val});
                      }}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <input required placeholder="Car Brand (e.g. BMW)" value={offlineForm.brand} onChange={e => setOfflineForm({...offlineForm, brand: e.target.value})}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                    <input required placeholder="Car Model (e.g. X5)" value={offlineForm.model} onChange={e => setOfflineForm({...offlineForm, model: e.target.value})}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                  </div>

                  <select required value={offlineForm.service} onChange={e => setOfflineForm({...offlineForm, service: e.target.value})}
                    style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", colorScheme: "dark" }}>
                    <option value="" disabled style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Select Service Type</option>
                    <option value="Periodic Maintenance" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Periodic Maintenance</option>
                    <option value="AC Service & Repair" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>AC Service & Repair</option>
                    <option value="Denting & Painting" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Denting & Painting</option>
                    <option value="Engine Diagnostics" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Engine Diagnostics</option>
                    <option value="Wheel Care" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Wheel Care</option>
                    <option value="Car Detailing" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Car Detailing</option>
                    <option value="Other / Custom Service" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Other / Custom Service</option>
                  </select>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <input type="date" required value={offlineForm.date} onChange={e => setOfflineForm({...offlineForm, date: e.target.value})}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem",  }} />
                    <select required value={offlineForm.status} onChange={e => setOfflineForm({...offlineForm, status: e.target.value as Booking["status"]})}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", colorScheme: "dark" }}>
                      <option value="pending" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Pending</option>
                      <option value="confirmed" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Confirmed</option>
                      <option value="completed" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Completed</option>
                    </select>
                  </div>

                  <button type="submit" disabled={offlineLoading}
                    style={{ padding: "14px", borderRadius: 10, background: "#0066FF", border: "none", color: "var(--text)", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: offlineLoading ? "wait" : "pointer", marginTop: 8 }}>
                    {offlineLoading ? "Adding..." : "Add Offline Booking"}
                  </button>
                </form>
              </GlassCard>

              {/* Edit Existing Booking */}
              <GlassCard title="✏️ Edit Existing Booking">
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20 }}>
                  Select an existing booking from the list to modify its details. All changes will be saved to the database instantly.
                </p>

                {editSuccess && (
                  <div style={{ padding: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
                    ✓ {editSuccess}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <select value={editBookingId} onChange={e => setEditBookingId(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, background: "#1a2035", border: "1px solid rgba(0,102,255,0.3)", color: "#fff", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", colorScheme: "dark" }}>
                    <option value="" style={{ background: "#1a2035", color: "#fff" }}>-- Select a Booking to Edit --</option>
                    {bookings.slice().sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map(b => (
                      <option key={b.id} value={b.id} style={{ background: "#1a2035", color: "#fff" }}>
                        {b.name} - {b.service} ({b.date || "No date"})
                      </option>
                    ))}
                  </select>
                </div>

                {editBookingId ? (
                  <form onSubmit={submitEditBooking} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <input required placeholder="Customer Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                        style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                      <input required placeholder="Phone Number" value={editForm.phone} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setEditForm({...editForm, phone: val});
                        }}
                        style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <input required placeholder="Car Brand (e.g. BMW)" value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})}
                        style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                      <input required placeholder="Car Model (e.g. X5)" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})}
                        style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }} />
                    </div>

                    <select required value={editForm.service} onChange={e => setEditForm({...editForm, service: e.target.value})}
                      style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", colorScheme: "dark" }}>
                      <option value="" disabled style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Select Service Type</option>
                      <option value="Periodic Maintenance" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Periodic Maintenance</option>
                      <option value="AC Service & Repair" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>AC Service & Repair</option>
                      <option value="Denting & Painting" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Denting & Painting</option>
                      <option value="Engine Diagnostics" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Engine Diagnostics</option>
                      <option value="Wheel Care" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Wheel Care</option>
                      <option value="Car Detailing" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Car Detailing</option>
                      <option value="Other / Custom Service" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Other / Custom Service</option>
                    </select>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <input type="date" required value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})}
                        style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem",  }} />
                      <select required value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as Booking["status"]})}
                        style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", colorScheme: "dark" }}>
                        <option value="pending" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Pending</option>
                        <option value="confirmed" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Confirmed</option>
                        <option value="completed" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Completed</option>
                        <option value="cancelled" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>Status: Cancelled</option>
                      </select>
                    </div>

                    <button type="submit" disabled={editLoading}
                      style={{ padding: "14px", borderRadius: 10, background: "#10B981", border: "none", color: "var(--text)", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: editLoading ? "wait" : "pointer", marginTop: 8 }}>
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                ) : (
                  <div style={{ padding: "40px 0", textAlign: "center", opacity: 0.5 }}>
                    <p style={{ fontSize: "0.85rem" }}>Select a booking above to edit its details.</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── BOOKING DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "rgba(12,14,18,0.95)", border: "1px solid var(--border)", borderRadius: 28, padding: "36px", width: "100%", maxWidth: 560, position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #E2001A, #0066FF)", borderRadius: "28px 28px 0 0" }} />

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: 6 }}>{selectedBooking.name}</h2>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.85rem", color: "var(--text-secondary)" }}><Mail size={13} />{selectedBooking.userEmail || "—"}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.85rem", color: "var(--text-secondary)" }}><Phone size={13} />{selectedBooking.phone}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <StatusBadge status={selectedBooking.status} size="lg" />
                  <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}><X size={18} /></button>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { icon: Car,         label: "Vehicle",     value: `${selectedBooking.brand} ${selectedBooking.model}` },
                  { icon: Wrench,      label: "Service",     value: selectedBooking.service },
                  { icon: CalendarDays,label: "Pref. Date",  value: selectedBooking.date || "Not specified" },
                  { icon: Clock,       label: "Booked On",   value: selectedBooking.createdAt ? `${fmtDate(selectedBooking.createdAt.seconds)} · ${fmtTime(selectedBooking.createdAt.seconds)}` : "—" },
                ].map(item => (
                  <div key={item.label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      <item.icon size={12} />{item.label}
                    </div>
                    <div style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.92rem", wordBreak: "break-word" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {selectedBooking.message && (
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}><MessageSquare size={12} />Additional Message</div>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.92rem", lineHeight: 1.6 }}>{selectedBooking.message}</p>
                </div>
              )}

              {/* Status update */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Update Status</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["pending", "confirmed", "completed", "cancelled"] as Booking["status"][]).map(s => {
                    const c = STATUS_CFG[s];
                    const active = selectedBooking.status === s;
                    return (
                      <button key={s} onClick={() => updateStatus(selectedBooking.id, s)} disabled={active || updatingId === selectedBooking.id}
                        style={{ padding: "10px 18px", borderRadius: 100, border: `1px solid ${active ? c.color : "rgba(255,255,255,0.12)"}`, background: active ? c.bg : "transparent", color: active ? c.color : "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: active ? "default" : "pointer", transition: "all 0.2s", opacity: updatingId === selectedBooking.id ? 0.5 : 1 }}>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => deleteBooking(selectedBooking.id)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#EF4444", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                  <Trash2 size={15} />Delete Booking
                </button>
                <button onClick={() => setSelectedBooking(null)}
                  style={{ marginLeft: "auto", padding: "11px 24px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        /* Force dark dropdown options in dark mode */
        [data-theme="dark"] .admin-select option,
        [data-theme="dark"] select option {
          background: #0f1624 !important;
          color: #ffffff !important;
        }
        [data-theme="dark"] select {
          color-scheme: dark;
        }
        [data-theme="light"] select {
          color-scheme: light;
        }
      `}</style>
    </div>
  );
}

// ─── GlassCard ───────────────────────────────────────────────────────────────
function GlassCard({ title, action, children, style }: { title?: string, action?: React.ReactNode, children: React.ReactNode, style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--bg-secondary)", backdropFilter: "blur(20px)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", ...style }}>
      {title && (
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", margin: 0 }}>{title}</h3>
          {action}
        </div>
      )}
      <div style={{ padding: title ? "20px 24px" : 0 }}>{children}</div>
    </div>
  );
}

// ─── BookingTable ─────────────────────────────────────────────────────────────
function BookingTable({ bookings, onSelect, onStatus, updatingId, sortField, sortDir, onSort, SortIcon }: {
  bookings: Booking[], onSelect: (b: Booking) => void, onStatus: (id: string, s: Booking["status"]) => void,
  updatingId: string | null, sortField: string, sortDir: string, onSort: (f: "createdAt"|"name"|"date") => void, SortIcon: React.FC<{field: "createdAt"|"name"|"date"}>
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {[
              { label: "Customer", field: "name" as const },
              { label: "Vehicle",  field: null },
              { label: "Service",  field: null },
              { label: "Date",     field: "date" as const },
              { label: "Booked",   field: "createdAt" as const },
              { label: "Status",   field: null },
              { label: "Actions",  field: null },
            ].map(h => (
              <th key={h.label} onClick={() => h.field && onSort(h.field)} style={{ padding: "13px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", cursor: h.field ? "pointer" : "default", userSelect: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{h.label} {h.field && <SortIcon field={h.field} />}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s", cursor: "pointer" }}
              onClick={() => onSelect(b)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--border-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ padding: "14px 20px" }}>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.92rem" }}>{b.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{b.phone}</div>
              </td>
              <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "0.88rem" }}>{b.brand} {b.model}</td>
              <td style={{ padding: "14px 20px", maxWidth: 160 }}>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service}</div>
              </td>
              <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{b.date || "—"}</td>
              <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                {b.createdAt ? new Date(b.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
              </td>
              <td style={{ padding: "14px 20px" }}><StatusBadge status={b.status} /></td>
              <td style={{ padding: "14px 20px" }}>
                <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => onSelect(b)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    <Eye size={13} />View
                  </button>
                  {b.status === "pending" && (
                    <button onClick={() => onStatus(b.id, "confirmed")} disabled={updatingId === b.id}
                      style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.12)", color: "#66A3FF", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", fontFamily: "Inter, sans-serif", fontWeight: 600, opacity: updatingId === b.id ? 0.5 : 1 }}>
                      <CheckCircle2 size={13} />Confirm
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
          {bookings.length === 0 && (
            <tr><td colSpan={7} style={{ padding: 60, textAlign: "center", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>No bookings match your filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Needed to avoid TypeScript "unused" warning on Timestamp import
const _t = Timestamp; void _t;
