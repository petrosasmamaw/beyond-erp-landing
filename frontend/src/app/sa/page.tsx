"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Building2, Clock, DollarSign, TrendingUp,
  Users, Shield, Eye, EyeOff, LogOut, RefreshCw, CheckCircle,
  XCircle, AlertTriangle, Ban, BadgeCheck, Search, Bell,
  ArrowUpRight, ArrowDownRight, ChevronRight, Activity,
  CreditCard, BarChart2, Settings, Filter, Download,
} from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import type { RegistrationStatus } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const SA_PASSWORD = process.env.NEXT_PUBLIC_SA_PASSWORD ?? "beyond@sa2026";
const SESSION_KEY = "beyond_sa_v1";

// ─── Types ────────────────────────────────────────────────────────────────────

type Company = {
  id: string; companyName: string; tinNumber: string; sectorId: string;
  ownerName: string; ownerEmail: string; ownerPhone: string;
  plan: "Starter" | "Growth" | "Enterprise"; monthlyFee: number;
  status: "Active" | "Suspended" | "Trial"; createdAt: string;
  lastLogin: string; userCount: number;
};
type Request = {
  id: string; companyName: string; tinNumber: string; sectorId: string;
  fullName: string; email: string; phone: string; notes: string;
  paymentReference: string; status: RegistrationStatus;
  createdAt: string; updatedAt: string;
};
type Payment = {
  id: string; companyName: string; amount: number; method: string;
  reference: string; plan: string; period: string;
  status: "Confirmed" | "Pending" | "Failed"; date: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockCompanies: Company[] = [
  { id: "c1", companyName: "Addis Bloom Hotel", tinNumber: "0012345678", sectorId: "hospitality", ownerName: "Kedir Mulugeta", ownerEmail: "kedir@addisbloom.et", ownerPhone: "+251911001001", plan: "Growth", monthlyFee: 2500, status: "Active", createdAt: "2026-02-14", lastLogin: "2026-05-25", userCount: 12 },
  { id: "c2", companyName: "Horizon Academy", tinNumber: "0023456789", sectorId: "education", ownerName: "Tigist Bekele", ownerEmail: "tigist@horizon.edu.et", ownerPhone: "+251922002002", plan: "Growth", monthlyFee: 2500, status: "Active", createdAt: "2026-01-08", lastLogin: "2026-05-26", userCount: 34 },
  { id: "c3", companyName: "Selam General Hospital", tinNumber: "0034567890", sectorId: "healthcare", ownerName: "Dr. Yonas Fekadu", ownerEmail: "yonas@selamhospital.et", ownerPhone: "+251933003003", plan: "Enterprise", monthlyFee: 6500, status: "Active", createdAt: "2025-11-22", lastLogin: "2026-05-26", userCount: 87 },
  { id: "c4", companyName: "Habesha Mart PLC", tinNumber: "0045678901", sectorId: "retail-trading", ownerName: "Solomon Haile", ownerEmail: "sol@habeshamart.et", ownerPhone: "+251944004004", plan: "Starter", monthlyFee: 950, status: "Active", createdAt: "2026-03-30", lastLogin: "2026-05-24", userCount: 5 },
  { id: "c5", companyName: "BlueSky Logistics", tinNumber: "0056789012", sectorId: "transport-logistics", ownerName: "Hanna Girma", ownerEmail: "hanna@bluesky.et", ownerPhone: "+251955005005", plan: "Growth", monthlyFee: 2500, status: "Active", createdAt: "2026-02-01", lastLogin: "2026-05-23", userCount: 18 },
  { id: "c6", companyName: "Green Valley Farms", tinNumber: "0067890123", sectorId: "agriculture", ownerName: "Abebe Desta", ownerEmail: "abebe@greenvalley.et", ownerPhone: "+251966006006", plan: "Starter", monthlyFee: 950, status: "Trial", createdAt: "2026-05-10", lastLogin: "2026-05-22", userCount: 3 },
  { id: "c7", companyName: "Nile Construction Group", tinNumber: "0078901234", sectorId: "construction", ownerName: "Meron Tesfaye", ownerEmail: "meron@nilecg.et", ownerPhone: "+251977007007", plan: "Enterprise", monthlyFee: 6500, status: "Active", createdAt: "2025-09-15", lastLogin: "2026-05-26", userCount: 41 },
  { id: "c8", companyName: "Sunrise Real Estate", tinNumber: "0089012345", sectorId: "real-estate", ownerName: "Dawit Lema", ownerEmail: "dawit@sunrise.et", ownerPhone: "+251988008008", plan: "Growth", monthlyFee: 2500, status: "Suspended", createdAt: "2026-01-20", lastLogin: "2026-04-10", userCount: 9 },
  { id: "c9", companyName: "Atlas Manufacturing", tinNumber: "0090123456", sectorId: "manufacturing", ownerName: "Sara Mekonnen", ownerEmail: "sara@atlas.et", ownerPhone: "+251999009009", plan: "Enterprise", monthlyFee: 6500, status: "Active", createdAt: "2025-12-01", lastLogin: "2026-05-25", userCount: 56 },
  { id: "c10", companyName: "Hope NGO Ethiopia", tinNumber: "0001234567", sectorId: "ngo-development", ownerName: "Biruk Alemu", ownerEmail: "biruk@hopeet.org", ownerPhone: "+251900010010", plan: "Starter", monthlyFee: 950, status: "Active", createdAt: "2026-04-05", lastLogin: "2026-05-20", userCount: 7 },
];

const mockRequests: Request[] = [
  { id: "r1", companyName: "Ethio Cloud Finance", tinNumber: "0011223344", sectorId: "finance-banking", fullName: "Lemma Tadesse", email: "lemma@ethiocloud.et", phone: "+251911111111", notes: "We serve 3 branches in Addis", paymentReference: "TXN-2026-8821", status: "PAID", createdAt: "2026-05-24", updatedAt: "2026-05-25" },
  { id: "r2", companyName: "Abyssinia Health Center", tinNumber: "0022334455", sectorId: "healthcare", fullName: "Dr. Almaz Worku", email: "almaz@abyssiniahc.et", phone: "+251922222222", notes: "50-bed facility, need full module", paymentReference: "TXN-2026-8834", status: "PAID", createdAt: "2026-05-23", updatedAt: "2026-05-24" },
  { id: "r3", companyName: "Rift Valley Tours", tinNumber: "0033445566", sectorId: "hospitality", fullName: "Robel Kebede", email: "robel@rvtours.et", phone: "+251933333333", notes: "", paymentReference: "", status: "PENDING_PAYMENT", createdAt: "2026-05-25", updatedAt: "2026-05-25" },
  { id: "r4", companyName: "Tana School Complex", tinNumber: "0044556677", sectorId: "education", fullName: "Hiwot Assefa", email: "hiwot@tanaschool.et", phone: "+251944444444", notes: "500 students, 3 campuses", paymentReference: "TXN-2026-8856", status: "PAID", createdAt: "2026-05-22", updatedAt: "2026-05-23" },
  { id: "r5", companyName: "Federal Roads Authority", tinNumber: "0055667788", sectorId: "government-services", fullName: "Col. Tesfaye Getu", email: "tesfaye@roads.gov.et", phone: "+251955555555", notes: "Pilot project for 2 woredas", paymentReference: "", status: "PENDING_PAYMENT", createdAt: "2026-05-26", updatedAt: "2026-05-26" },
  { id: "r6", companyName: "Harar Coffee Export", tinNumber: "0066778899", sectorId: "agriculture", fullName: "Amina Hassan", email: "amina@hararcoffee.et", phone: "+251966666666", notes: "", paymentReference: "TXN-2026-8871", status: "PAID", createdAt: "2026-05-21", updatedAt: "2026-05-22" },
  { id: "r7", companyName: "Dire Dawa Cement", tinNumber: "0077889900", sectorId: "manufacturing", fullName: "Omar Yusuf", email: "omar@ddcement.et", phone: "+251977777777", notes: "2 production plants", paymentReference: "TXN-2026-8879", status: "APPROVED", createdAt: "2026-05-18", updatedAt: "2026-05-20" },
  { id: "r8", companyName: "Bole Medical Supplies", tinNumber: "0088990011", sectorId: "retail-trading", fullName: "Selamawit Girma", email: "sela@bolemed.et", phone: "+251988888888", notes: "", paymentReference: "", status: "REJECTED", createdAt: "2026-05-15", updatedAt: "2026-05-17" },
];

const mockPayments: Payment[] = [
  { id: "py1", companyName: "Selam General Hospital", amount: 6500, method: "Bank Transfer", reference: "TXN-2026-8800", plan: "Enterprise", period: "May 2026", status: "Confirmed", date: "2026-05-01" },
  { id: "py2", companyName: "Nile Construction Group", amount: 6500, method: "Telebirr", reference: "TXN-2026-8801", plan: "Enterprise", period: "May 2026", status: "Confirmed", date: "2026-05-02" },
  { id: "py3", companyName: "Atlas Manufacturing", amount: 6500, method: "CBE Birr", reference: "TXN-2026-8802", plan: "Enterprise", period: "May 2026", status: "Confirmed", date: "2026-05-03" },
  { id: "py4", companyName: "Horizon Academy", amount: 2500, method: "Telebirr", reference: "TXN-2026-8810", plan: "Growth", period: "May 2026", status: "Confirmed", date: "2026-05-05" },
  { id: "py5", companyName: "Addis Bloom Hotel", amount: 2500, method: "Bank Transfer", reference: "TXN-2026-8811", plan: "Growth", period: "May 2026", status: "Confirmed", date: "2026-05-05" },
  { id: "py6", companyName: "BlueSky Logistics", amount: 2500, method: "Telebirr", reference: "TXN-2026-8812", plan: "Growth", period: "May 2026", status: "Confirmed", date: "2026-05-06" },
  { id: "py7", companyName: "Habesha Mart PLC", amount: 950, method: "Telebirr", reference: "TXN-2026-8820", plan: "Starter", period: "May 2026", status: "Confirmed", date: "2026-05-08" },
  { id: "py8", companyName: "Hope NGO Ethiopia", amount: 950, method: "CBE Birr", reference: "TXN-2026-8822", plan: "Starter", period: "May 2026", status: "Confirmed", date: "2026-05-09" },
  { id: "py9", companyName: "Ethio Cloud Finance", amount: 2500, method: "Telebirr", reference: "TXN-2026-8821", plan: "Growth", period: "Onboarding", status: "Confirmed", date: "2026-05-25" },
  { id: "py10", companyName: "Tana School Complex", amount: 2500, method: "Bank Transfer", reference: "TXN-2026-8856", plan: "Growth", period: "Onboarding", status: "Confirmed", date: "2026-05-23" },
  { id: "py11", companyName: "Harar Coffee Export", amount: 950, method: "Telebirr", reference: "TXN-2026-8871", plan: "Starter", period: "Onboarding", status: "Confirmed", date: "2026-05-22" },
  { id: "py12", companyName: "Sunrise Real Estate", amount: 2500, method: "Bank Transfer", reference: "TXN-2026-8790", plan: "Growth", period: "Apr 2026", status: "Failed", date: "2026-05-01" },
];

const MRR_TREND = [18400, 21900, 24400, 26900, 28900, 31400, 33900, 35400, 37900, 40400, 42900, 44400];
const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

// ─── Colours & helpers ────────────────────────────────────────────────────────

const PLAN_COLOR: Record<string, string> = { Starter: "#64748b", Growth: "#3b82f6", Enterprise: "#8b5cf6" };
const STATUS_COLOR: Record<string, string> = {
  Active: "#10b981", Trial: "#f59e0b", Suspended: "#ef4444",
  PAID: "#3b82f6", PENDING_PAYMENT: "#f59e0b", APPROVED: "#10b981", REJECTED: "#ef4444",
  Confirmed: "#10b981", Pending: "#f59e0b", Failed: "#ef4444",
};

function Pill({ label, color }: { label: string; color?: string }) {
  const c = color ?? STATUS_COLOR[label] ?? "#64748b";
  return (
    <span style={{ background: c + "20", color: c, padding: "3px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", border: `1px solid ${c}30` }}>
      {label}
    </span>
  );
}

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = name.charCodeAt(0) * 37 % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: size / 3, background: `hsl(${hue},55%,18%)`, border: `1px solid hsl(${hue},55%,28%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: `hsl(${hue},70%,65%)`, fontSize: size * 0.35, fontWeight: 800 }}>
      {initials}
    </div>
  );
}

// ─── Layout primitives ────────────────────────────────────────────────────────

const DARK_S = {
  bg: "#0a0f1a", surface: "#111827", card: "#161f2e",
  border: "#1e2d42", borderLight: "#243447",
  muted: "#4a5568", sub: "#6b7fa3", text: "#e2e8f0", white: "#f8fafc",
} as const;

const LIGHT_S = {
  bg: "#f0f4ff", surface: "#ffffff", card: "#f8fafc",
  border: "#e2e8f0", borderLight: "#cbd5e1",
  muted: "#94a3b8", sub: "#64748b", text: "#0f172a", white: "#0f172a",
} as const;

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const S = theme === "dark" ? DARK_S : LIGHT_S;
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const attempt = () => {
    if (password === SA_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: S.bg }}>
      <div style={{ width: 380, background: S.surface, borderRadius: 20, padding: "40px 36px", border: `1px solid ${S.border}`, boxShadow: "0 40px 80px rgba(0,0,0,0.3)", position: "relative" }}>
        <button type="button" onClick={toggleTheme} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "transparent", border: `1px solid ${S.border}`, color: S.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#2563eb,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(37,99,235,0.35)" }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Beyond ERP</p>
            <strong style={{ color: S.white, fontSize: 18 }}>Admin Console</strong>
          </div>
        </div>

        <p style={{ margin: "0 0 24px", fontSize: 13, color: S.sub, lineHeight: 1.6 }}>
          Restricted access. Enter your administrator credentials to continue.
        </p>

        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
        <div style={{ position: "relative", marginBottom: error ? 8 : 20 }}>
          <input
            type={showPw ? "text" : "password"}
            value={password}
            autoFocus
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            placeholder="••••••••••••"
            style={{ width: "100%", background: S.bg, border: `1.5px solid ${error ? "#ef4444" : S.borderLight}`, borderRadius: 10, padding: "12px 44px 12px 14px", color: S.white, fontSize: 14, boxSizing: "border-box", outline: "none", transition: "border-color 0.15s" }}
          />
          <button type="button" onClick={() => setShowPw((v) => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: S.muted, cursor: "pointer", padding: 0 }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p style={{ margin: "0 0 16px", color: "#f87171", fontSize: 12 }}>{error}</p>}

        <button type="button" onClick={attempt} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#2563eb,#4f46e5)", color: "white", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 8px 20px rgba(37,99,235,0.3)" }}>
          Unlock Dashboard
        </button>
      </div>
    </main>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "overview" | "requests" | "companies" | "payments" | "analytics";

const NAV: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { key: "requests", label: "Requests", icon: <Clock size={16} /> },
  { key: "companies", label: "Companies", icon: <Building2 size={16} /> },
  { key: "payments", label: "Payments", icon: <CreditCard size={16} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
];

export default function SuperAdminPage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const S = theme === "dark" ? DARK_S : LIGHT_S;
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [rejectModal, setRejectModal] = useState<Request | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [search, setSearch] = useState("");
  const [reqFilter, setReqFilter] = useState<RegistrationStatus | "">("");
  const [coFilter, setCoFilter] = useState<"" | "Active" | "Suspended" | "Trial">("");
  const [expandedReq, setExpandedReq] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);
  }, []);

  const handleLock = () => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false); };

  // Derived stats
  const activeCompanies = companies.filter((c) => c.status === "Active").length;
  const mrr = companies.filter((c) => c.status === "Active").reduce((s, c) => s + c.monthlyFee, 0);
  const arr = mrr * 12;
  const pendingReqs = requests.filter((r) => r.status === "PAID").length;
  const totalUsers = companies.reduce((s, c) => s + c.userCount, 0);
  const totalCollected = mockPayments.filter((p) => p.status === "Confirmed").reduce((s, p) => s + p.amount, 0);

  const approveRequest = (req: Request) => {
    setRequests((p) => p.map((r) => r.id === req.id ? { ...r, status: "APPROVED" as RegistrationStatus, updatedAt: new Date().toISOString().slice(0, 10) } : r));
    setCompanies((p) => [{
      id: `c-${Date.now()}`, companyName: req.companyName, tinNumber: req.tinNumber,
      sectorId: req.sectorId, ownerName: req.fullName, ownerEmail: req.email,
      ownerPhone: req.phone, plan: "Growth", monthlyFee: 2500, status: "Active",
      createdAt: new Date().toISOString().slice(0, 10), lastLogin: "—", userCount: 1,
    }, ...p]);
  };

  const rejectRequest = () => {
    if (!rejectModal) return;
    setRequests((p) => p.map((r) => r.id === rejectModal.id ? { ...r, status: "REJECTED" as RegistrationStatus, updatedAt: new Date().toISOString().slice(0, 10) } : r));
    setRejectModal(null); setRejectReason("");
  };

  const toggleStatus = (id: string) =>
    setCompanies((p) => p.map((c) => c.id === id ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" } : c));

  const filteredRequests = useMemo(() =>
    requests.filter((r) => (!reqFilter || r.status === reqFilter) && (!search || r.companyName.toLowerCase().includes(search.toLowerCase()) || r.fullName.toLowerCase().includes(search.toLowerCase()))),
    [requests, reqFilter, search]);

  const filteredCompanies = useMemo(() =>
    companies.filter((c) => (!coFilter || c.status === coFilter) && (!search || c.companyName.toLowerCase().includes(search.toLowerCase()) || c.ownerName.toLowerCase().includes(search.toLowerCase()))),
    [companies, coFilter, search]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const maxMrr = Math.max(...MRR_TREND);

  // Sector breakdown
  const sectorCount = companies.reduce<Record<string, number>>((acc, c) => {
    acc[c.sectorId] = (acc[c.sectorId] ?? 0) + 1;
    return acc;
  }, {});
  const topSectors = Object.entries(sectorCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <main style={{ minHeight: "100vh", background: S.bg, color: S.text, display: "flex", fontFamily: "inherit" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${S.border}`, background: S.surface, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        {/* Brand */}
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${S.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} color="white" />
            </div>
            <div>
              <strong style={{ display: "block", fontSize: 14, color: S.white, lineHeight: 1.2 }}>Beyond ERP</strong>
              <span style={{ fontSize: 10, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Console</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ margin: "8px 10px 6px", fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Navigation</p>
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => { setTab(n.key); setSearch(""); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: tab === n.key ? "#2563eb18" : "transparent",
                color: tab === n.key ? "#60a5fa" : S.sub,
                transition: "all 0.14s",
                borderLeft: tab === n.key ? "2px solid #3b82f6" : "2px solid transparent",
              }}
            >
              {n.icon}
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.key === "requests" && pendingReqs > 0 && (
                <span style={{ background: "#ef4444", color: "white", borderRadius: 99, fontSize: 10, fontWeight: 800, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>{pendingReqs}</span>
              )}
            </button>
          ))}

          <div style={{ margin: "12px 0 6px", borderTop: `1px solid ${S.border}` }} />
          <p style={{ margin: "4px 10px 6px", fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>System</p>
          <button type="button" onClick={() => window.location.reload()} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "transparent", color: S.sub, transition: "all 0.14s", borderLeft: "2px solid transparent" }}>
            <RefreshCw size={16} /><span>Refresh Data</span>
          </button>
          <button type="button" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "transparent", color: S.sub, borderLeft: "2px solid transparent" }}>
            <Settings size={16} /><span>Settings</span>
          </button>
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${S.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#93c5fd" }}>SA</div>
            <div>
              <strong style={{ display: "block", fontSize: 12, color: S.text }}>System Admin</strong>
              <span style={{ fontSize: 10, color: S.muted }}>Full access</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={toggleTheme} style={{ width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${S.border}`, borderRadius: 8, color: S.muted, cursor: "pointer" }}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button type="button" onClick={handleLock} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", background: "#7f1d1d22", border: "1px solid #7f1d1d44", borderRadius: 8, color: "#f87171", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              <LogOut size={13} /> Lock Session
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <header style={{ padding: "16px 28px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 14, background: S.surface, position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: S.muted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, requests..."
              style={{ width: "100%", maxWidth: 380, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 9, padding: "9px 12px 9px 34px", color: S.text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button type="button" style={{ position: "relative", width: 36, height: 36, borderRadius: 9, background: S.bg, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: S.sub }}>
            <Bell size={15} />
            {pendingReqs > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 99, background: "#ef4444", border: `2px solid ${S.surface}` }} />}
          </button>
          <button type="button" onClick={toggleTheme} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} style={{ width: 36, height: 36, borderRadius: 9, background: S.bg, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: S.sub, flexShrink: 0 }}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div style={{ height: 22, width: 1, background: S.border }} />
          <div style={{ fontSize: 12, color: S.muted }}>
            <span style={{ color: "#4ade80", fontWeight: 700 }}>● </span>Live
          </div>
        </header>

        <div style={{ flex: 1, padding: "28px 28px 40px", overflowY: "auto" }}>

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h1 style={{ margin: "0 0 4px", fontSize: 22, color: S.white, fontWeight: 800 }}>Dashboard Overview</h1>
                <p style={{ margin: 0, fontSize: 13, color: S.muted }}>May 2026 · All figures in ETB</p>
              </div>

              {/* KPI row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[
                  { label: "Monthly Recurring Rev.", value: `ETB ${mrr.toLocaleString()}`, sub: "+12% vs last month", trend: "up", icon: <TrendingUp size={18} />, accent: "#3b82f6" },
                  { label: "Annual Run Rate", value: `ETB ${(arr / 1000).toFixed(0)}K`, sub: `${activeCompanies} active tenants`, trend: "up", icon: <BarChart2 size={18} />, accent: "#8b5cf6" },
                  { label: "Active Companies", value: activeCompanies, sub: `${companies.filter(c => c.status === "Trial").length} in trial`, trend: "up", icon: <Building2 size={18} />, accent: "#10b981" },
                  { label: "Pending Approvals", value: pendingReqs, sub: "Paid, awaiting review", trend: pendingReqs > 0 ? "warn" : "up", icon: <Clock size={18} />, accent: pendingReqs > 0 ? "#f59e0b" : "#10b981" },
                ].map((s) => (
                  <div key={s.label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 14px 0 80px", background: s.accent + "10" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <p style={{ margin: 0, fontSize: 11, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                      <div style={{ color: s.accent, opacity: 0.7 }}>{s.icon}</div>
                    </div>
                    <strong style={{ display: "block", fontSize: 24, color: S.white, lineHeight: 1.1, marginBottom: 6 }}>{s.value}</strong>
                    <span style={{ fontSize: 12, color: s.trend === "warn" ? "#f59e0b" : "#4ade80", display: "flex", alignItems: "center", gap: 3 }}>
                      {s.trend === "up" ? <ArrowUpRight size={12} /> : <AlertTriangle size={12} />}
                      {s.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Second row: MRR chart + Plan breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                {/* MRR chart */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "22px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Revenue Trend</p>
                      <strong style={{ fontSize: 18, color: S.white }}>ETB {mrr.toLocaleString()} <span style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>↑ 12%</span></strong>
                    </div>
                    <Pill label="12 Months" color="#3b82f6" />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
                    {MRR_TREND.map((v, i) => {
                      const pct = (v / maxMrr) * 100;
                      const isLast = i === MRR_TREND.length - 1;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: "100%", borderRadius: "4px 4px 2px 2px", background: isLast ? "#3b82f6" : "#1e3a5f", height: `${pct}%`, minHeight: 4, transition: "height 0.3s" }} />
                          <span style={{ fontSize: 9, color: S.muted, fontWeight: 700 }}>{MONTHS[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Plan breakdown */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "22px 24px" }}>
                  <p style={{ margin: "0 0 20px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Plan Mix</p>
                  {(["Enterprise", "Growth", "Starter"] as const).map((plan) => {
                    const count = companies.filter((c) => c.plan === plan && c.status === "Active").length;
                    const rev = companies.filter((c) => c.plan === plan && c.status === "Active").reduce((s, c) => s + c.monthlyFee, 0);
                    const pct = mrr > 0 ? Math.round((rev / mrr) * 100) : 0;
                    return (
                      <div key={plan} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: PLAN_COLOR[plan], display: "block" }} />
                            <span style={{ fontSize: 13, color: S.text, fontWeight: 600 }}>{plan}</span>
                          </div>
                          <span style={{ fontSize: 12, color: S.muted }}>{count} co · {pct}%</span>
                        </div>
                        <div style={{ height: 5, background: S.border, borderRadius: 99 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: PLAN_COLOR[plan], borderRadius: 99, transition: "width 0.4s" }} />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 14, marginTop: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: S.muted }}>Total MRR</span>
                      <strong style={{ fontSize: 14, color: "#4ade80" }}>ETB {mrr.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third row: Recent requests + Top companies + Quick stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {/* Recent requests */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Requests</p>
                    <button type="button" onClick={() => setTab("requests")} style={{ fontSize: 11, color: "#60a5fa", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>View all <ChevronRight size={11} /></button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {requests.slice(0, 5).map((r) => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={r.fullName} size={30} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 12, color: S.white, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.companyName}</p>
                          <p style={{ margin: 0, fontSize: 11, color: S.muted }}>{r.createdAt}</p>
                        </div>
                        <Pill label={r.status === "PENDING_PAYMENT" ? "Pending" : r.status === "PAID" ? "Paid" : r.status.toLowerCase()} color={STATUS_COLOR[r.status]} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top companies by users */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top by Users</p>
                    <button type="button" onClick={() => setTab("companies")} style={{ fontSize: 11, color: "#60a5fa", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>View all <ChevronRight size={11} /></button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[...companies].sort((a, b) => b.userCount - a.userCount).slice(0, 5).map((c) => {
                      const sector = sectorDefinitions.find((s) => s.id === c.sectorId);
                      return (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 7, background: (sector?.color ?? "#3b82f6") + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <i className={sector?.icon ?? "fa-solid fa-building"} style={{ color: sector?.color ?? "#64748b", fontSize: 13 }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, color: S.white, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.companyName}</p>
                            <div style={{ height: 3, background: S.border, borderRadius: 99, marginTop: 4, width: `${(c.userCount / 87) * 100}%`, minWidth: 8, transition: "width 0.3s", backgroundColor: sector?.color ?? "#3b82f6" }} />
                          </div>
                          <span style={{ fontSize: 12, color: S.sub, fontWeight: 700, flexShrink: 0 }}>{c.userCount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sector distribution */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "20px 22px" }}>
                  <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sector Distribution</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {topSectors.map(([sectorId, count]) => {
                      const sector = sectorDefinitions.find((s) => s.id === sectorId);
                      return (
                        <div key={sectorId} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 22, height: 22, borderRadius: 5, background: (sector?.color ?? "#3b82f6") + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <i className={sector?.icon ?? "fa-solid fa-building"} style={{ color: sector?.color ?? "#64748b", fontSize: 10 }} />
                          </div>
                          <span style={{ fontSize: 12, color: S.sub, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sector?.name ?? sectorId}</span>
                          <span style={{ fontSize: 12, color: S.text, fontWeight: 700 }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 12, marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: S.muted }}>Total users</span>
                      <strong style={{ fontSize: 13, color: S.text }}>{totalUsers}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[
                  { label: "Total Collected", value: `ETB ${(totalCollected / 1000).toFixed(0)}K`, color: "#4ade80" },
                  { label: "Enterprise Clients", value: companies.filter(c => c.plan === "Enterprise").length, color: "#a78bfa" },
                  { label: "Growth Clients", value: companies.filter(c => c.plan === "Growth").length, color: "#60a5fa" },
                  { label: "Starter Clients", value: companies.filter(c => c.plan === "Starter").length, color: "#94a3b8" },
                  { label: "Suspended", value: companies.filter(c => c.status === "Suspended").length, color: "#f87171" },
                ].map((s) => (
                  <div key={s.label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                    <strong style={{ fontSize: 20, color: s.color }}>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ REQUESTS ══ */}
          {tab === "requests" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h1 style={{ margin: "0 0 4px", fontSize: 22, color: S.white, fontWeight: 800 }}>Registration Requests</h1>
                  <p style={{ margin: 0, fontSize: 13, color: S.muted }}>{filteredRequests.length} requests · {pendingReqs} awaiting approval</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Filter size={13} color={S.muted} />
                    <select value={reqFilter} onChange={(e) => setReqFilter(e.target.value as RegistrationStatus | "")} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 12, cursor: "pointer", outline: "none" }}>
                      <option value="">All statuses</option>
                      <option value="PENDING_PAYMENT">Pending Payment</option>
                      <option value="PAID">Paid — Awaiting Approval</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { label: "Needs Review", value: pendingReqs, color: "#3b82f6" },
                  { label: "Pending Payment", value: requests.filter(r => r.status === "PENDING_PAYMENT").length, color: "#f59e0b" },
                  { label: "Approved", value: requests.filter(r => r.status === "APPROVED").length, color: "#10b981" },
                  { label: "Rejected", value: requests.filter(r => r.status === "REJECTED").length, color: "#ef4444" },
                ].map((s) => (
                  <div key={s.label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: S.muted, fontWeight: 700 }}>{s.label}</span>
                    <strong style={{ fontSize: 20, color: s.color }}>{s.value}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredRequests.map((r) => {
                  const sector = sectorDefinitions.find((s) => s.id === r.sectorId);
                  const isExpanded = expandedReq === r.id;
                  return (
                    <div key={r.id} style={{ background: S.card, border: `1px solid ${r.status === "PAID" ? "#2563eb44" : S.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.15s" }}>
                      <div
                        onClick={() => setExpandedReq(isExpanded ? null : r.id)}
                        style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                      >
                        <Avatar name={r.fullName} size={40} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                            <strong style={{ color: S.white, fontSize: 14 }}>{r.companyName}</strong>
                            <Pill label={sector?.shortName ?? r.sectorId} color={sector?.color} />
                            <Pill label={r.status === "PENDING_PAYMENT" ? "Pending Payment" : r.status === "PAID" ? "Paid" : r.status.toLowerCase()} color={STATUS_COLOR[r.status]} />
                          </div>
                          <p style={{ margin: 0, fontSize: 12, color: S.muted }}>{r.fullName} · {r.email} · Applied {r.createdAt}</p>
                        </div>
                        {r.status === "PAID" && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button type="button" onClick={(e) => { e.stopPropagation(); approveRequest(r); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#10b981", border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setRejectModal(r); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid #ef4444", borderRadius: 8, color: "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        )}
                        {r.status === "PENDING_PAYMENT" && (
                          <span style={{ fontSize: 12, color: "#f59e0b", display: "flex", alignItems: "center", gap: 4 }}>
                            <AlertTriangle size={13} /> Awaiting payment
                          </span>
                        )}
                        <ChevronRight size={14} color={S.muted} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                      </div>

                      {isExpanded && (
                        <div style={{ borderTop: `1px solid ${S.border}`, padding: "14px 20px", background: S.surface, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                          {[
                            { label: "TIN Number", value: r.tinNumber || "—" },
                            { label: "Phone", value: r.phone },
                            { label: "Sector", value: sector?.name ?? r.sectorId },
                            { label: "Payment Reference", value: r.paymentReference || "Not submitted" },
                            { label: "Applied", value: r.createdAt },
                            { label: "Last Updated", value: r.updatedAt },
                          ].map((f) => (
                            <div key={f.label}>
                              <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</p>
                              <p style={{ margin: 0, fontSize: 13, color: S.text }}>{f.value}</p>
                            </div>
                          ))}
                          {r.notes && (
                            <div style={{ gridColumn: "1/-1" }}>
                              <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</p>
                              <p style={{ margin: 0, fontSize: 13, color: S.sub, fontStyle: "italic" }}>"{r.notes}"</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredRequests.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: S.muted, background: S.card, border: `1px solid ${S.border}`, borderRadius: 14 }}>
                    <Clock size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: 14 }}>No requests match this filter</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ COMPANIES ══ */}
          {tab === "companies" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h1 style={{ margin: "0 0 4px", fontSize: 22, color: S.white, fontWeight: 800 }}>Companies</h1>
                  <p style={{ margin: 0, fontSize: 13, color: S.muted }}>{filteredCompanies.length} tenants · ETB {mrr.toLocaleString()} MRR</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select value={coFilter} onChange={(e) => setCoFilter(e.target.value as typeof coFilter)} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 12, cursor: "pointer", outline: "none" }}>
                    <option value="">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Trial">Trial</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <button type="button" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, color: S.sub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <Download size={13} /> Export
                  </button>
                </div>
              </div>

              {/* Plan summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {(["Enterprise", "Growth", "Starter"] as const).map((plan) => {
                  const cos = companies.filter((c) => c.plan === plan && c.status === "Active");
                  const rev = cos.reduce((s, c) => s + c.monthlyFee, 0);
                  return (
                    <div key={plan} style={{ background: S.card, border: `1px solid ${S.border}`, borderLeft: `3px solid ${PLAN_COLOR[plan]}`, borderRadius: "0 12px 12px 0", padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <strong style={{ fontSize: 15, color: PLAN_COLOR[plan] }}>{plan}</strong>
                        <span style={{ fontSize: 12, color: S.muted }}>{cos.length} active</span>
                      </div>
                      <p style={{ margin: "0 0 2px", fontSize: 20, color: S.white, fontWeight: 800 }}>ETB {rev.toLocaleString()}</p>
                      <p style={{ margin: 0, fontSize: 11, color: S.muted }}>per month</p>
                    </div>
                  );
                })}
              </div>

              {/* Company table */}
              <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ borderBottom: `1px solid ${S.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: S.surface }}>
                        {["Company", "Sector", "Owner", "Plan", "MRR", "Users", "Status", "Last Login", "Actions"].map((h) => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompanies.map((c, i) => {
                        const sector = sectorDefinitions.find((s) => s.id === c.sectorId);
                        return (
                          <tr key={c.id} style={{ borderTop: `1px solid ${S.border}`, background: i % 2 === 0 ? "transparent" : S.bg + "44", transition: "background 0.12s" }}>
                            <td style={{ padding: "13px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Avatar name={c.companyName} size={30} />
                                <div>
                                  <p style={{ margin: 0, fontSize: 13, color: S.white, fontWeight: 600 }}>{c.companyName}</p>
                                  <p style={{ margin: 0, fontSize: 10, color: S.muted }}>TIN {c.tinNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <i className={sector?.icon ?? "fa-solid fa-building"} style={{ color: sector?.color ?? "#64748b", fontSize: 12 }} />
                                <span style={{ fontSize: 12, color: S.sub }}>{sector?.shortName ?? c.sectorId}</span>
                              </div>
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <p style={{ margin: 0, fontSize: 12, color: S.text }}>{c.ownerName}</p>
                              <p style={{ margin: 0, fontSize: 11, color: S.muted }}>{c.ownerEmail}</p>
                            </td>
                            <td style={{ padding: "13px 16px" }}><Pill label={c.plan} color={PLAN_COLOR[c.plan]} /></td>
                            <td style={{ padding: "13px 16px" }}>
                              <span style={{ fontSize: 13, color: "#4ade80", fontWeight: 700 }}>ETB {c.monthlyFee.toLocaleString()}</span>
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <Users size={12} color={S.muted} />
                                <span style={{ fontSize: 13, color: S.text }}>{c.userCount}</span>
                              </div>
                            </td>
                            <td style={{ padding: "13px 16px" }}><Pill label={c.status} color={STATUS_COLOR[c.status]} /></td>
                            <td style={{ padding: "13px 16px", fontSize: 12, color: S.muted }}>{c.lastLogin}</td>
                            <td style={{ padding: "13px 16px" }}>
                              <button type="button" onClick={() => toggleStatus(c.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "transparent", border: `1px solid ${c.status === "Active" ? "#ef444440" : "#10b98140"}`, borderRadius: 7, color: c.status === "Active" ? "#f87171" : "#4ade80", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                                {c.status === "Active" ? <><Ban size={11} /> Suspend</> : <><BadgeCheck size={11} /> Activate</>}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {tab === "payments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h1 style={{ margin: "0 0 4px", fontSize: 22, color: S.white, fontWeight: 800 }}>Payments</h1>
                <p style={{ margin: 0, fontSize: 13, color: S.muted }}>{mockPayments.length} records · ETB {totalCollected.toLocaleString()} total collected</p>
              </div>

              {/* Payment summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  { label: "Total Collected", value: `ETB ${totalCollected.toLocaleString()}`, color: "#4ade80" },
                  { label: "Confirmed", value: mockPayments.filter(p => p.status === "Confirmed").length, color: "#10b981" },
                  { label: "Pending", value: mockPayments.filter(p => p.status === "Pending").length, color: "#f59e0b" },
                  { label: "Failed", value: mockPayments.filter(p => p.status === "Failed").length, color: "#ef4444" },
                ].map((s) => (
                  <div key={s.label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 11, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                    <strong style={{ fontSize: 20, color: s.color }}>{s.value}</strong>
                  </div>
                ))}
              </div>

              {/* Method breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: 13, color: S.white }}>All Payment Records</strong>
                    <button type="button" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: S.muted, background: "none", border: "none", cursor: "pointer" }}>
                      <Download size={12} /> Export CSV
                    </button>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: S.surface }}>
                        {["Company", "Plan", "Amount", "Method", "Period", "Date", "Status"].map((h) => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockPayments.map((p, i) => (
                        <tr key={p.id} style={{ borderTop: `1px solid ${S.border}`, background: i % 2 === 1 ? S.bg + "44" : "transparent" }}>
                          <td style={{ padding: "11px 14px", color: S.white, fontWeight: 600 }}>{p.companyName}</td>
                          <td style={{ padding: "11px 14px" }}><Pill label={p.plan} color={PLAN_COLOR[p.plan]} /></td>
                          <td style={{ padding: "11px 14px", color: "#4ade80", fontWeight: 700 }}>ETB {p.amount.toLocaleString()}</td>
                          <td style={{ padding: "11px 14px", color: S.sub }}>{p.method}</td>
                          <td style={{ padding: "11px 14px", color: S.muted }}>{p.period}</td>
                          <td style={{ padding: "11px 14px", color: S.muted }}>{p.date}</td>
                          <td style={{ padding: "11px 14px" }}><Pill label={p.status} color={STATUS_COLOR[p.status]} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "20px" }}>
                    <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>By Method</p>
                    {["Telebirr", "Bank Transfer", "CBE Birr"].map((method) => {
                      const total = mockPayments.filter(p => p.method === method && p.status === "Confirmed").reduce((s, p) => s + p.amount, 0);
                      const pct = totalCollected > 0 ? Math.round((total / totalCollected) * 100) : 0;
                      return (
                        <div key={method} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: S.text }}>{method}</span>
                            <span style={{ fontSize: 12, color: S.muted }}>{pct}%</span>
                          </div>
                          <div style={{ height: 5, background: S.border, borderRadius: 99 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6", borderRadius: 99 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "20px" }}>
                    <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Revenue by Plan</p>
                    {(["Enterprise", "Growth", "Starter"] as const).map((plan) => {
                      const total = mockPayments.filter(p => p.plan === plan && p.status === "Confirmed").reduce((s, p) => s + p.amount, 0);
                      return (
                        <div key={plan} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: PLAN_COLOR[plan], display: "block" }} />
                            <span style={{ fontSize: 13, color: S.sub }}>{plan}</span>
                          </div>
                          <strong style={{ fontSize: 13, color: S.text }}>ETB {total.toLocaleString()}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ ANALYTICS ══ */}
          {tab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h1 style={{ margin: "0 0 4px", fontSize: 22, color: S.white, fontWeight: 800 }}>Analytics</h1>
                <p style={{ margin: 0, fontSize: 13, color: S.muted }}>Growth metrics and trends</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* MRR growth chart - full */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "24px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>MRR Growth</p>
                  <p style={{ margin: "0 0 24px", fontSize: 22, color: S.white, fontWeight: 800 }}>ETB {mrr.toLocaleString()} <span style={{ fontSize: 14, color: "#4ade80" }}>+141% YoY</span></p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
                    {MRR_TREND.map((v, i) => {
                      const pct = (v / maxMrr) * 100;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 9, color: S.muted, fontWeight: 700 }}>
                            {i === MRR_TREND.length - 1 ? `${(v / 1000).toFixed(0)}k` : ""}
                          </span>
                          <div style={{ width: "100%", borderRadius: "4px 4px 2px 2px", background: i === MRR_TREND.length - 1 ? "#3b82f6" : "#1e3a5f", height: `${pct}%`, minHeight: 4 }} />
                          <span style={{ fontSize: 9, color: S.muted, fontWeight: 700 }}>{MONTHS[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cumulative companies */}
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "24px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tenant Growth</p>
                  <p style={{ margin: "0 0 24px", fontSize: 22, color: S.white, fontWeight: 800 }}>{companies.length} total <span style={{ fontSize: 14, color: "#4ade80" }}>+{companies.length} since launch</span></p>
                  {[2, 4, 6, 7, 9, 10, 10, 10, 10, 10, 10, 10].map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: S.muted, width: 28, textAlign: "right", fontWeight: 700 }}>{MONTHS[i]}</span>
                      <div style={{ flex: 1, height: 12, background: S.border, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(v / 10) * 100}%`, background: i === 11 ? "#3b82f6" : "#1e3a5f", borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 6 }}>
                          <span style={{ fontSize: 9, color: "white", fontWeight: 800 }}>{v}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "22px" }}>
                  <p style={{ margin: "0 0 18px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Revenue per Tenant</p>
                  {(["Enterprise", "Growth", "Starter"] as const).map((plan) => {
                    const cos = companies.filter(c => c.plan === plan && c.status === "Active");
                    const rev = cos.reduce((s, c) => s + c.monthlyFee, 0);
                    return (
                      <div key={plan} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${S.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: 3, background: PLAN_COLOR[plan], display: "block" }} />
                          <span style={{ fontSize: 13, color: S.text }}>{plan}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontSize: 13, color: S.white, fontWeight: 700 }}>ETB {cos.length > 0 ? Math.round(rev / cos.length).toLocaleString() : 0}</p>
                          <p style={{ margin: 0, fontSize: 10, color: S.muted }}>avg / tenant</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "22px" }}>
                  <p style={{ margin: "0 0 18px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sector Revenue</p>
                  {topSectors.slice(0, 5).map(([sectorId]) => {
                    const cos = companies.filter(c => c.sectorId === sectorId && c.status === "Active");
                    const rev = cos.reduce((s, c) => s + c.monthlyFee, 0);
                    const sector = sectorDefinitions.find(s => s.id === sectorId);
                    return (
                      <div key={sectorId} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${S.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <i className={sector?.icon ?? "fa-solid fa-building"} style={{ color: sector?.color ?? "#64748b", fontSize: 11 }} />
                          <span style={{ fontSize: 12, color: S.sub }}>{sector?.shortName ?? sectorId}</span>
                        </div>
                        <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 700 }}>ETB {rev.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "22px" }}>
                  <p style={{ margin: "0 0 18px", fontSize: 12, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Platform Health</p>
                  {[
                    { label: "Uptime", value: "99.9%", good: true },
                    { label: "Active Companies", value: `${activeCompanies} / ${companies.length}`, good: true },
                    { label: "Suspended", value: companies.filter(c => c.status === "Suspended").length, good: companies.filter(c => c.status === "Suspended").length === 0 },
                    { label: "Pending Approvals", value: pendingReqs, good: pendingReqs === 0 },
                    { label: "Failed Payments", value: mockPayments.filter(p => p.status === "Failed").length, good: false },
                    { label: "Conversion Rate", value: `${Math.round((companies.length / (companies.length + requests.filter(r => r.status === "REJECTED").length)) * 100)}%`, good: true },
                  ].map((m) => (
                    <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${S.border}` }}>
                      <span style={{ fontSize: 12, color: S.sub }}>{m.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 99, background: m.good ? "#10b981" : "#ef4444", display: "block" }} />
                        <strong style={{ fontSize: 13, color: m.good ? "#4ade80" : "#f87171" }}>{m.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Reject Modal ── */}
      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 18, padding: 32, width: 440, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#7f1d1d33", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XCircle size={20} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: S.white, fontSize: 16 }}>Reject Request</h3>
                <p style={{ margin: 0, fontSize: 12, color: S.muted }}>This action will notify the applicant</p>
              </div>
            </div>
            <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: S.white, fontWeight: 600 }}>{rejectModal.companyName}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: S.muted }}>{rejectModal.fullName} · {rejectModal.email}</p>
            </div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Reason (optional)</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="e.g. Incomplete documentation..." style={{ width: "100%", background: S.bg, border: `1px solid ${S.borderLight}`, borderRadius: 9, padding: "10px 12px", color: S.white, fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button type="button" onClick={() => setRejectModal(null)} style={{ flex: 1, padding: "11px", background: "transparent", border: `1px solid ${S.border}`, borderRadius: 9, color: S.sub, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button type="button" onClick={rejectRequest} style={{ flex: 1, padding: "11px", background: "#ef4444", border: "none", borderRadius: 9, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
