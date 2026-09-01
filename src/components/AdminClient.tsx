"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  MessageSquare, ChevronDown, ChevronUp, Settings, Globe, ChevronRight,
  Plus, Menu, ArrowUpRight, BarChart2, UserCheck, Shield, Sparkles, Layers
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useDebounce } from "@/hooks/useDebounce";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const ADMIN_EMAIL = "test01samwheels@gmail.com";
const PIE_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#6366F1"];

type Booking = {
  id: string;
  name: string;
  phone: string;
  brand: string;
  model: string;
  service: string;
  date: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "on_track";
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
  pending:   { color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  icon: Clock,        label: "Pending"   },
  confirmed: { color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",  icon: CheckCircle2, label: "Confirmed" },
  on_track:  { color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)",  icon: TrendingUp,   label: "On Track"  },
  completed: { color: "#10B981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  icon: CheckCircle2, label: "Completed" },
  cancelled: { color: "#EF4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   icon: XCircle,      label: "Cancelled" },
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
  const a = document.createElement("a"); a.href = url; a.download = "bookings_report.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── StatusBadge Component ──────────────────────────────────────────────────
function StatusBadge({ status, size = "sm" }: { status: Booking["status"], size?: "sm" | "lg" }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span style={{
      padding: size === "lg" ? "6px 14px" : "4px 10px",
      borderRadius: 100,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontSize: size === "lg" ? "0.82rem" : "0.72rem",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>
      <c.icon size={size === "lg" ? 13 : 11} /> {c.label}
    </span>
  );
}

export default function AdminClient() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Navigation tab state
  type NavTab = "overview" | "bookings" | "users" | "feedback" | "analytics" | "advanced";
  const [tab, setTab] = useState<NavTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  
  // Filter & Search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
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
  const [editSearch, setEditSearch] = useState("");

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

  // Firebase Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (u?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
        setAuthed(true);
        loadData();
      } else {
        setAuthed(false);
      }
    });
    return unsub;
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    setDataError("");
    try {
      let bSnap;
      try { bSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"))); }
      catch { bSnap = await getDocs(collection(db, "bookings")); }
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));

      let uSnap;
      try { uSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"))); }
      catch { uSnap = await getDocs(collection(db, "users")); }
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserRecord)));

      let fSnap;
      try { fSnap = await getDocs(query(collection(db, "feedback"), orderBy("createdAt", "desc"))); }
      catch { fSnap = await getDocs(collection(db, "feedback")); }
      setFeedbackData(fSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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
      if (cred.user.email?.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
        await signOut(auth);
        setLoginError(`Access denied. Not an admin account. (${cred.user.email})`);
      } else {
        setAuthed(true); loadData();
      }
    } catch { setLoginError("Invalid email or password."); }
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
      const userRef = await addDoc(collection(db, "users"), {
        name: offlineForm.name,
        email: "offline_customer@local",
        role: "offline_user",
        createdAt: Timestamp.now()
      });
      await addDoc(collection(db, "bookings"), {
        ...offlineForm,
        message: "Manually added by Admin",
        userId: userRef.id,
        userEmail: "offline_customer@local",
        createdAt: Timestamp.now()
      });
      setOfflineSuccess("Offline booking and customer successfully added!");
      setOfflineForm({ name: "", phone: "", brand: "", model: "", service: "", date: "", status: "completed" });
      loadData();
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

  const deleteFeedback = async (id: string) => {
    if (!confirm("Permanently delete this feedback?")) return;
    await deleteDoc(doc(db, "feedback", id));
    loadData();
  };

  // Stats calculation
  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    on_track:  bookings.filter(b => b.status === "on_track").length,
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

  // Chart computations
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

  // Filtered & sorted list
  const filtered = useMemo(() => {
    let list = [...bookings];
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
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
  }, [bookings, debouncedSearch, statusFilter, dateFilter, sortField, sortDir]);

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const todayBookings = bookings.filter(b => {
    if (!b.date) return false;
    const today = new Date().toISOString().split("T")[0];
    return b.date === today;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    sortField === field ? (sortDir === "desc" ? <ChevronDown size={12}/> : <ChevronUp size={12}/>) : null
  );

  // Formatted date string for top header like screenshot (MONDAY · APRIL 27 · 2026)
  const todayDateFormatted = useMemo(() => {
    const d = new Date();
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const monthName = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    const dayNum = d.getDate();
    const year = d.getFullYear();
    return `${dayName} • ${monthName} ${dayNum} • ${year}`;
  }, []);

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 24, position: "relative" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 420, background: "var(--card)", backdropFilter: "blur(30px)", border: "1px solid var(--border)", borderRadius: 24, padding: "44px 36px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--bosch-red)", borderRadius: "24px 24px 0 0" }} />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--bosch-red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(226,0,26,0.3)" }}>
            <Wrench size={26} color="white" />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: 4 }}>Admin Portal</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>SAM Wheels · Bosch Car Service</p>
        </div>
        {loginError && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8, color: "#EF4444", fontSize: "0.85rem" }}>
            <AlertCircle size={15} />{loginError}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Admin Email Address"
            style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", outline: "none" }} />
          <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="Password"
            style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", outline: "none" }} />
          <motion.button type="submit" disabled={loginLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            style={{ marginTop: 6, padding: "14px", borderRadius: 10, background: "var(--bosch-red)", color: "#ffffff", border: "none", cursor: loginLoading ? "wait" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.04em", boxShadow: "0 6px 20px rgba(226,0,26,0.3)" }}>
            {loginLoading ? "Authenticating…" : "Sign In to Admin"}
          </motion.button>
        </form>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.78rem", color: "var(--text-muted)" }}>🔒 Restricted access — authorized personnel only</p>
      </motion.div>
    </div>
  );

  // ─── DASHBOARD APP FRAMEWORK ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ────────────────── 1. LEFT SIDEBAR ────────────────── */}
      <aside style={{
        width: sidebarOpen ? 260 : 72,
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "var(--card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 90,
        flexShrink: 0,
        overflowX: "hidden"
      }}>
        {/* Sidebar Header */}
        <div style={{ height: 70, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", borderBottom: "1px solid var(--border)" }}>
          {sidebarOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bosch-red)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(226,0,26,0.3)" }}>
                <Wrench size={18} color="white" />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)", letterSpacing: "0.03em" }}>SAM WHEELS</span>
            </div>
          ) : (
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bosch-red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wrench size={18} color="white" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }} title="Toggle Sidebar">
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Section: WORKSPACE */}
          <div>
            {sidebarOpen && (
              <div style={{ padding: "0 12px 8px", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                WORKSPACE
              </div>
            )}
            <NavItem active={tab === "overview"} icon={LayoutDashboard} label="Dashboard" badge="" sidebarOpen={sidebarOpen} onClick={() => setTab("overview")} />
            <NavItem active={false} icon={Sparkles} label="Go Pro" badge="PRO" badgeColor="#0066FF" sidebarOpen={sidebarOpen} onClick={() => alert("You are on SAM Wheels Admin Pro v2.5")} />
          </div>

          {/* Section: COMMUNICATIONS */}
          <div>
            {sidebarOpen && (
              <div style={{ padding: "0 12px 8px", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                COMMUNICATIONS
              </div>
            )}
            <NavItem active={tab === "bookings"} icon={CalendarDays} label="Bookings" badge={pendingBookings.length ? String(pendingBookings.length) : ""} badgeColor="#F59E0B" sidebarOpen={sidebarOpen} onClick={() => setTab("bookings")} />
            <NavItem active={tab === "feedback"} icon={MessageSquare} label="Feedback" badge={feedbackData.length ? String(feedbackData.length) : ""} sidebarOpen={sidebarOpen} onClick={() => setTab("feedback")} />
          </div>

          {/* Section: MANAGEMENT & ANALYTICS */}
          <div>
            {sidebarOpen && (
              <div style={{ padding: "0 12px 8px", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                MANAGEMENT
              </div>
            )}
            <NavItem active={tab === "analytics"} icon={TrendingUp} label="Analytics" badge="NEW" badgeColor="#10B981" sidebarOpen={sidebarOpen} onClick={() => setTab("analytics")} />
            <NavItem active={tab === "users"} icon={Users} label="Customers" badge={users.length ? String(users.length) : ""} sidebarOpen={sidebarOpen} onClick={() => setTab("users")} />
            <NavItem active={tab === "advanced"} icon={Settings} label="Advanced" sidebarOpen={sidebarOpen} onClick={() => setTab("advanced")} />
          </div>
        </div>

        {/* Sidebar Footer User Profile */}
        <div style={{ padding: 14, borderTop: "1px solid var(--border)", background: "var(--bg-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#2563EB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>
            SW
          </div>
          {sidebarOpen && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>John Doe</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>admin</div>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", padding: 6 }} title="Sign Out">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ────────────────── 2. MAIN CONTENT WRAPPER ────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        
        {/* Top Header Bar */}
        <header style={{
          height: 70,
          padding: "0 32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 80
        }}>
          {/* Header Search */}
          <div style={{ position: "relative", width: 320 }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search appointments, customers, services..."
              style={{
                width: "100%",
                paddingLeft: 38,
                paddingRight: 14,
                paddingTop: 9,
                paddingBottom: 9,
                borderRadius: 100,
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text)",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
          </div>

          {/* Right Header Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            
            {/* Quick Export Button */}
            <button onClick={() => exportCSV(bookings)} style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <Download size={14} /> Export CSV
            </button>

            {/* Quick Add Offline Booking Button */}
            <button onClick={() => setTab("advanced")} style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "none",
              background: "#2563EB",
              color: "white",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)"
            }}>
              <Plus size={15} /> New Booking
            </button>

            <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 4px" }} />

            {/* Notifications Dropdown */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(o => !o)} style={{
                width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative"
              }}>
                <Bell size={16} />
                {pendingBookings.length > 0 && (
                  <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#F59E0B", color: "white", fontSize: "0.6rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {pendingBookings.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} style={{
                    position: "absolute", right: 0, top: 48, width: 320, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.15)", zIndex: 100
                  }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Notifications</span>
                      <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={15} /></button>
                    </div>
                    <div style={{ maxHeight: 260, overflowY: "auto" }}>
                      {pendingBookings.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>All caught up! ✓</div>
                      ) : (
                        pendingBookings.map(b => (
                          <div key={b.id} onClick={() => { setSelectedBooking(b); setNotifOpen(false); }} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{b.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{b.service} · {b.brand} {b.model}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Refresh Button */}
            <button onClick={loadData} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={15} className={dataLoading ? "animate-spin" : ""} />
            </button>

            {/* Theme Switcher */}
            <ThemeToggle />
          </div>
        </header>

        {/* Main Workspace Scrollable Container */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>

          {/* Firestore Perm Error Warning Banner */}
          {dataError && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 700, color: "#EF4444", marginBottom: 4 }}>Firestore Access Notice</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{dataError}</p>
                <button onClick={loadData} style={{ marginTop: 10, padding: "6px 14px", borderRadius: 8, background: "#EF4444", color: "white", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Retry Data Sync</button>
              </div>
            </div>
          )}

          {/* ────────────────── OVERVIEW DASHBOARD VIEW ────────────────── */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              
              {/* Top Greeting & Date Banner (Centered with Plus Jakarta Sans) */}
              <div style={{ textAlign: "center", marginBottom: 36, padding: "10px 0" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {todayDateFormatted}
                </div>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "2.4rem", color: "var(--text)", margin: "0 auto", lineHeight: 1.15, letterSpacing: "-0.035em" }}>
                  Welcome back, <span style={{ color: "#2563EB" }}>John</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: 10, maxWidth: 680, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Total visits are <span style={{ color: "#10B981", fontWeight: 700 }}>+10%</span> week over week, unique visitors steady, and bounce rate holding at <span style={{ fontWeight: 700 }}>33%</span>. {pendingBookings.length > 0 ? `${pendingBookings.length} new bookings require review today.` : "All appointments on track."}
                </p>

                {/* Centered Action Pills */}
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18 }}>
                  <button onClick={() => exportCSV(bookings)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Download size={15} /> Export CSV
                  </button>
                  <button onClick={() => setTab("advanced")} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#2563EB", color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,99,235,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Plus size={15} /> New Report
                  </button>
                </div>
              </div>

              {/* ──────────────── 4 EXECUTIVE KPI CARDS (MATCHED TO SCREENSHOT) ──────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
                
                {/* Card 1: Total visits */}
                <KpiCard
                  icon={<Eye size={18} color="#10B981" />}
                  iconBg="rgba(16,185,129,0.12)"
                  badge="+10%"
                  badgeColor="#10B981"
                  badgeBg="rgba(16,185,129,0.1)"
                  metric="1.24M"
                  label="Total visits"
                  subtext="up from 1.12M last week"
                  trend="up"
                  onClick={() => setTab("bookings")}
                />

                {/* Card 2: Page views */}
                <KpiCard
                  icon={<BarChart2 size={18} color="#EF4444" />}
                  iconBg="rgba(239,68,68,0.12)"
                  badge="- 7%"
                  badgeColor="#EF4444"
                  badgeBg="rgba(239,68,68,0.1)"
                  metric="4.08M"
                  label="Page views"
                  subtext="down from 4.39M last week"
                  trend="down"
                  onClick={() => setTab("bookings")}
                />

                {/* Card 3: Unique visitors */}
                <KpiCard
                  icon={<Users size={18} color="#8B5CF6" />}
                  iconBg="rgba(139,92,246,0.12)"
                  badge="- 12%"
                  badgeColor="#8B5CF6"
                  badgeBg="rgba(139,92,246,0.1)"
                  metric="842K"
                  label="Unique visitors"
                  subtext="holding around 835K last week"
                  trend="steady"
                  onClick={() => setTab("users")}
                />

                {/* Card 4: Bounce rate */}
                <KpiCard
                  icon={<TrendingUp size={18} color="#2563EB" />}
                  iconBg="rgba(37,99,235,0.12)"
                  badge="- steady"
                  badgeColor="#2563EB"
                  badgeBg="rgba(37,99,235,0.1)"
                  metric="33%"
                  label="Bounce rate"
                  subtext="matching 33% last week"
                  trend="steady"
                  onClick={() => setTab("analytics")}
                />
              </div>

              {/* ──────────────── GEOGRAPHY / SITE VISITS SECTION (MATCHED TO SCREENSHOT) ──────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                
                {/* Regional Distribution Box */}
                <CardBox title="GEOGRAPHY" subtitle="Site visits" action={<button onClick={() => setTab("analytics")} style={{ background: "none", border: "none", color: "#2563EB", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>View report →</button>}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 10 }}>
                    <ProgressRow country="United States" value="100K" percent={50} color="#8B5CF6" />
                    <ProgressRow country="Europe" value="1M" percent={80} color="#10B981" />
                    <ProgressRow country="Australia" value="450K" percent={40} color="#3B82F6" />
                    <ProgressRow country="India" value="1B" percent={90} color="#1E293B" />
                  </div>
                </CardBox>

                {/* Status Breakdown Donut Chart */}
                <CardBox title="SERVICE APPOINTMENTS" subtitle="Real-time Status">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: 220, height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                            {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ flex: 1, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                      {statusData.map(s => (
                        <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.88rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                            <span style={{ color: "var(--text-secondary)" }}>{s.name}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: "var(--text)" }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBox>
              </div>

              {/* ──────────────── RECENT APPOINTMENTS & TRENDS ──────────────── */}
              <CardBox title="RECENT APPOINTMENTS" subtitle="All Bookings">
                <div style={{ marginBottom: 16 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter bookings by customer name, service or vehicle..." style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)" }} />
                </div>
                <BookingTable bookings={filtered.slice(0, 8)} onSelect={setSelectedBooking} onStatus={updateStatus} updatingId={updatingId} onSort={toggleSort} SortIcon={SortIcon} />
              </CardBox>

            </motion.div>
          )}

          {/* ────────────────── BOOKINGS TABLE VIEW ────────────────── */}
          {tab === "bookings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                  <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, vehicle, service…"
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: "0.9rem", cursor: "pointer", outline: "none" }}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="on_track">On Track</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                  style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: "0.9rem", cursor: "pointer" }} />
                {(search || statusFilter !== "all" || dateFilter) && (
                  <button onClick={() => { setSearch(""); setStatusFilter("all"); setDateFilter(""); }}
                    style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                    <X size={14} /> Clear
                  </button>
                )}
              </div>

              <CardBox title={`All Bookings (${filtered.length})`}>
                <BookingTable bookings={filtered} onSelect={setSelectedBooking} onStatus={updateStatus} updatingId={updatingId} onSort={toggleSort} SortIcon={SortIcon} />
              </CardBox>
            </motion.div>
          )}

          {/* ────────────────── USERS VIEW ────────────────── */}
          {tab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CardBox title={`Registered Customers (${users.length})`}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Customer", "Email", "Bookings", "Role", "Joined", "Contact"].map((h, i) => (
                          <th key={h} style={{ padding: "14px 20px", textAlign: i === 5 ? "right" : "left", fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const uBookings = bookings.filter(b => b.userId === u.id);
                        return (
                          <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "15px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(37,99,235,0.15)", color: "#2563EB", fontWeight: 800, fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {(u.name || "?")[0].toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>{u.name || "—"}</span>
                              </div>
                            </td>
                            <td style={{ padding: "15px 20px", color: "var(--text-secondary)", fontSize: "0.88rem" }}>{u.email}</td>
                            <td style={{ padding: "15px 20px" }}>
                              <span style={{ padding: "4px 10px", borderRadius: 100, background: "rgba(37,99,235,0.1)", color: "#2563EB", fontSize: "0.75rem", fontWeight: 700 }}>
                                {uBookings.length} total
                              </span>
                            </td>
                            <td style={{ padding: "15px 20px" }}>
                              <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: u.role === "admin" ? "rgba(0,142,207,0.12)" : "rgba(37,99,235,0.08)", color: u.role === "admin" ? "#008ECF" : "#2563EB", textTransform: "uppercase" }}>
                                {u.role || "user"}
                              </span>
                            </td>
                            <td style={{ padding: "15px 20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                              {u.createdAt?.seconds ? fmtDate(u.createdAt.seconds) : "—"}
                            </td>
                            <td style={{ padding: "15px 20px", textAlign: "right" }}>
                              <a href={`mailto:${u.email}`} style={{ padding: "6px 12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                                Email
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                      {users.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No registered users found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </CardBox>
            </motion.div>
          )}

          {/* ────────────────── FEEDBACK VIEW ────────────────── */}
          {tab === "feedback" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CardBox title={`User Feedback (${feedbackData.length})`}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {feedbackData.map(f => (
                    <div key={f.id} style={{ padding: "18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-secondary)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, color: "var(--text)" }}>{f.userName || "Customer"}</span>
                          <span style={{ color: "#F59E0B", fontSize: "0.85rem" }}>{"★".repeat(f.rating || 5)}</span>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 10px 0" }}>&ldquo;{f.text}&rdquo;</p>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: 14 }}>
                          <span>Vehicle: {f.brand} {f.model}</span>
                          <span>Service: {f.service}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteFeedback(f.id)} style={{ padding: 6, background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, cursor: "pointer" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {feedbackData.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No customer feedback records.</div>}
                </div>
              </CardBox>
            </motion.div>
          )}

          {/* ────────────────── ANALYTICS VIEW ────────────────── */}
          {tab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <CardBox title="Bookings by Service Type">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={serviceData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} angle={-35} textAnchor="end" interval={0} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                      <RechartsTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {serviceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardBox>

                <CardBox title="Popular Vehicle Brands">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={brandData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={11} width={80} />
                      <RechartsTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardBox>
              </div>

              <CardBox title="7-Day Appointment Trend">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBox>
            </motion.div>
          )}

          {/* ────────────────── ADVANCED VIEW (OFFLINE & EDIT FORMS) ────────────────── */}
          {tab === "advanced" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                
                {/* Offline Booking Form */}
                <CardBox title="➕ Record Offline Booking">
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 18 }}>
                    Register walk-in or phone bookings manually.
                  </p>
                  {offlineSuccess && (
                    <div style={{ padding: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
                      ✓ {offlineSuccess}
                    </div>
                  )}
                  <form onSubmit={submitOfflineBooking} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <input required placeholder="Customer Name" value={offlineForm.name} onChange={e => setOfflineForm({...offlineForm, name: e.target.value})}
                        style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                      <input required placeholder="10-digit Phone" value={offlineForm.phone} 
                        onChange={e => setOfflineForm({...offlineForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10)})}
                        style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <input required placeholder="Car Brand" value={offlineForm.brand} onChange={e => setOfflineForm({...offlineForm, brand: e.target.value})}
                        style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                      <input required placeholder="Car Model" value={offlineForm.model} onChange={e => setOfflineForm({...offlineForm, model: e.target.value})}
                        style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                    </div>
                    <select required value={offlineForm.service} onChange={e => setOfflineForm({...offlineForm, service: e.target.value})}
                      style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}>
                      <option value="" disabled>Select Service Type</option>
                      <option value="Periodic Maintenance">Periodic Maintenance</option>
                      <option value="AC Service & Repair">AC Service & Repair</option>
                      <option value="Denting & Painting">Denting & Painting</option>
                      <option value="Engine Diagnostics">Engine Diagnostics</option>
                      <option value="Wheel Care">Wheel Care</option>
                      <option value="Car Detailing">Car Detailing</option>
                    </select>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <input type="date" required value={offlineForm.date} onChange={e => setOfflineForm({...offlineForm, date: e.target.value})}
                        style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                      <select required value={offlineForm.status} onChange={e => setOfflineForm({...offlineForm, status: e.target.value as Booking["status"]})}
                        style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <button type="submit" disabled={offlineLoading} style={{ padding: "12px", borderRadius: 8, background: "#2563EB", border: "none", color: "white", fontWeight: 700, cursor: "pointer", marginTop: 6 }}>
                      {offlineLoading ? "Saving..." : "Add Booking"}
                    </button>
                  </form>
                </CardBox>

                {/* Edit Existing Booking Form */}
                <CardBox title="✏️ Edit Existing Booking">
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 18 }}>
                    Select an appointment to update parameters.
                  </p>
                  {editSuccess && (
                    <div style={{ padding: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
                      ✓ {editSuccess}
                    </div>
                  )}
                  <select value={editBookingId} onChange={e => setEditBookingId(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", marginBottom: 16 }}>
                    <option value="">-- Select Booking --</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>{b.name} - {b.service} ({b.date})</option>
                    ))}
                  </select>

                  {editBookingId && (
                    <form onSubmit={submitEditBooking} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <input required placeholder="Customer Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                        style={{ padding: "12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                      <input required placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10)})}
                        style={{ padding: "12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <input type="date" required value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})}
                          style={{ padding: "12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }} />
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as Booking["status"]})}
                          style={{ padding: "12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <button type="submit" disabled={editLoading} style={{ padding: "12px", borderRadius: 8, background: "#10B981", border: "none", color: "white", fontWeight: 700, cursor: "pointer" }}>
                        {editLoading ? "Updating..." : "Save Changes"}
                      </button>
                    </form>
                  )}
                </CardBox>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* ────────────────── BOOKING DETAIL MODAL ────────────────── */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={e => e.stopPropagation()}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 540, boxShadow: "0 24px 60px rgba(0,0,0,0.2)", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.4rem", margin: 0 }}>{selectedBooking.name}</h2>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>{selectedBooking.phone} · {selectedBooking.userEmail || "No Email"}</div>
                </div>
                <StatusBadge status={selectedBooking.status} size="lg" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div style={{ padding: 14, background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>VEHICLE</div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginTop: 2 }}>{selectedBooking.brand} {selectedBooking.model}</div>
                </div>
                <div style={{ padding: 14, background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>SERVICE</div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginTop: 2 }}>{selectedBooking.service}</div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800, marginBottom: 10 }}>UPDATE STATUS</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["pending", "confirmed", "on_track", "completed", "cancelled"] as Booking["status"][]).map(s => (
                    <button key={s} onClick={() => updateStatus(selectedBooking.id, s)} disabled={selectedBooking.status === s}
                      style={{ padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: selectedBooking.status === s ? "#2563EB" : "var(--bg-secondary)", color: selectedBooking.status === s ? "white" : "var(--text)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                <button onClick={() => deleteBooking(selectedBooking.id)} style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                  Delete Booking
                </button>
                <button onClick={() => setSelectedBooking(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
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
      `}</style>
    </div>
  );
}

// ─── SIDEBAR ITEM COMPONENT ──────────────────────────────────────────────────
function NavItem({ active, icon: Icon, label, badge, badgeColor = "#2563EB", sidebarOpen, onClick }: {
  active: boolean, icon: React.FC<{ size?: number, color?: string }>, label: string, badge?: string, badgeColor?: string, sidebarOpen: boolean, onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      width: "100%",
      padding: sidebarOpen ? "10px 14px" : "10px 0",
      borderRadius: 10,
      border: "none",
      background: active ? "#2563EB" : "transparent",
      color: active ? "#FFFFFF" : "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: sidebarOpen ? "flex-start" : "center",
      gap: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: active ? 700 : 600,
      fontSize: "0.88rem",
      cursor: "pointer",
      transition: "all 0.15s ease",
      marginBottom: 3
    }}>
      <Icon size={18} color={active ? "#FFFFFF" : "inherit"} />
      {sidebarOpen && <span style={{ flex: 1, textAlign: "left" }}>{label}</span>}
      {sidebarOpen && badge && (
        <span style={{
          padding: "2px 8px",
          borderRadius: 100,
          background: active ? "rgba(255,255,255,0.25)" : badgeColor,
          color: "white",
          fontSize: "0.68rem",
          fontWeight: 800
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── KPI CARD COMPONENT (MATCHED TO SCREENSHOT) ─────────────────────────────
function KpiCard({ icon, iconBg, badge, badgeColor, badgeBg, metric, label, subtext, trend, onClick }: {
  icon: React.ReactNode, iconBg: string, badge: string, badgeColor: string, badgeBg: string, metric: string, label: string, subtext: string, trend: "up" | "down" | "steady", onClick: () => void
}) {
  return (
    <div onClick={onClick} style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "22px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      
      {/* Top row: Icon on left, Badge on right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ padding: "4px 10px", borderRadius: 100, background: badgeBg, color: badgeColor, fontSize: "0.72rem", fontWeight: 800 }}>
          {badge}
        </span>
      </div>

      {/* Label and Big Metric Number */}
      <div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</div>
        <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text)", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
          {metric}
        </div>
      </div>

      {/* Subtext with trend indicator arrow */}
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <span style={{ color: trend === "up" ? "#10B981" : trend === "down" ? "#EF4444" : "var(--text-muted)", fontWeight: 800 }}>
          {trend === "up" ? "↗" : trend === "down" ? "↘" : "—"}
        </span>
        {subtext}
      </div>
    </div>
  );
}

// ─── PROGRESS ROW COMPONENT (GEOGRAPHY SITE VISITS MATCHED TO SCREENSHOT) ───
function ProgressRow({ country, value, percent, color }: { country: string, value: string, percent: number, color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: "0.85rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <span style={{ fontWeight: 600, color: "var(--text)" }}>{country}</span>
        <div>
          <span style={{ fontWeight: 800, color: "var(--text)", marginRight: 6 }}>{value}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{percent}%</span>
        </div>
      </div>
      <div style={{ height: 6, width: "100%", background: "var(--bg-secondary)", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${percent}%`, background: color, borderRadius: 100, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ─── CARD BOX CONTAINER ─────────────────────────────────────────────────────
function CardBox({ title, subtitle, action, children }: { title: string, subtitle?: string, action?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</div>
          {subtitle && <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em", marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── BOOKINGS TABLE COMPONENT ────────────────────────────────────────────────
function BookingTable({ bookings, onSelect, onStatus, updatingId, onSort, SortIcon }: {
  bookings: Booking[], onSelect: (b: Booking) => void, onStatus: (id: string, s: Booking["status"]) => void,
  updatingId: string | null, onSort: (f: "createdAt"|"name"|"date") => void, SortIcon: React.FC<{field: "createdAt"|"name"|"date"}>
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
              <th key={h.label} onClick={() => h.field && onSort(h.field)} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", cursor: h.field ? "pointer" : "default" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{h.label} {h.field && <SortIcon field={h.field} />}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} onClick={() => onSelect(b)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }}>
              <td style={{ padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.9rem" }}>{b.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{b.phone}</div>
              </td>
              <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "0.88rem" }}>{b.brand} {b.model}</td>
              <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "0.88rem" }}>{b.service}</td>
              <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>{b.date || "—"}</td>
              <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                {b.createdAt ? new Date(b.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
              </td>
              <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status} /></td>
              <td style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                  {b.phone && (
                    <a href={`https://wa.me/91${b.phone}?text=Hi%20${encodeURIComponent(b.name)},%20regarding%20your%20booking...`} target="_blank" rel="noreferrer"
                      style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(37,211,102,0.1)", color: "#25D366", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                      WhatsApp
                    </a>
                  )}
                  <button onClick={() => onSelect(b)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No bookings found matching filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

