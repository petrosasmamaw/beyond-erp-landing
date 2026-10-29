"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Pager } from "@/components/ui/Pager";
import { paginate } from "@/features/erp/helpers";
import { mockPatients, STATUS_COLORS, type Patient, type PatientStatus } from "../data";
import { useTheme } from "@/contexts/ThemeContext";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: dark ? "#111827" : "#ffffff",
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
  };
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const DOCTORS = ["Dr. Tigist Alemu", "Dr. Yonas Bekele", "Dr. Hiwot Haile", "Dr. Biruk Desta"];

export function Patients() {
  const c = useColors();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "">("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: "", age: "", gender: "Male" as "Male" | "Female", phone: "", bloodType: "O+", doctor: DOCTORS[0], diagnosis: "" });

  const today = new Date().toISOString().slice(0, 10);

  const filtered = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      (!term || p.fullName.toLowerCase().includes(term) || p.mrn.toLowerCase().includes(term) || p.phone.includes(term)) &&
      (!statusFilter || p.status === statusFilter)
    );
  });

  const paged = paginate(filtered, page);

  const stats = {
    total:        patients.length,
    active:       patients.filter((p) => p.status === "Active").length,
    critical:     patients.filter((p) => p.status === "Critical").length,
    newThisMonth: patients.filter((p) => p.lastVisit.startsWith("2026-05")).length,
  };

  const kpis = [
    { label: "Total Patients",     value: String(stats.total),        color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-hospital-user" },
    { label: "Active",             value: String(stats.active),       color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-circle-check" },
    { label: "Critical",           value: String(stats.critical),     color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-heart-pulse" },
    { label: "Visited This Month", value: String(stats.newThisMonth), color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-calendar-check" },
  ];

  const handleAdd = () => {
    if (!form.fullName || !form.age || !form.phone) return;
    const next: Patient = {
      id: `p-${Date.now()}`,
      mrn: `MRN-${String(Math.floor(10000 + Math.random() * 90000))}`,
      fullName: form.fullName,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone,
      bloodType: form.bloodType,
      doctor: form.doctor,
      diagnosis: form.diagnosis || "Pending Assessment",
      status: "Active",
      lastVisit: today,
    };
    setPatients((prev) => [next, ...prev]);
    setForm({ fullName: "", age: "", gender: "Male", phone: "", bloodType: "O+", doctor: DOCTORS[0], diagnosis: "" });
    setShowModal(false);
  };

  const inp = {
    height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`,
    background: c.alt, padding: "0 10px", color: c.ink, fontSize: 13,
    outline: "none", boxSizing: "border-box" as const,
  };
  const sel = { ...inp, height: 36 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Healthcare</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Patients</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> Register Patient
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }} className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} style={{ padding: "13px 15px", borderRadius: 10, border: `1px solid ${k.bdr}`, background: k.bg }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</span>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${k.color}18`, color: k.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                <i className={k.icon} />
              </div>
            </div>
            <div style={{ fontSize: "clamp(13px,1.8vw,17px)", fontWeight: 800, color: c.ink }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, MRN, phone…"
            style={{ ...inp, paddingLeft: 30 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as PatientStatus | ""); setPage(1); }} style={sel}>
          <option value="">All statuses</option>
          {(["Active", "Critical", "Discharged", "Referred"] as PatientStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setSearch(""); setStatusFilter(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
      </div>

      {/* Patient list */}
      {paged.items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: c.muted, fontSize: 13 }}>No patients match your search.</div>
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {paged.items.map((p, i) => {
            const isLast = i === paged.items.length - 1;
            const statusColor = STATUS_COLORS[p.status] as string;
            return (
              <div
                key={p.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, transition: "background 0.12s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: 9, background: p.gender === "Female" ? (c.dark ? "#1e0f20" : "#fdf2f8") : (c.dark ? "#08121e" : "#eff6ff"), color: p.gender === "Female" ? "#ec4899" : "#2563eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                  <i className="fa-solid fa-user" style={{ fontSize: 11 }} />
                  <span style={{ fontSize: 9, marginTop: 1 }}>{p.bloodType}</span>
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{p.fullName}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{p.mrn}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: `${statusColor}18`, color: statusColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{p.age}y · {p.gender} · {p.phone}</div>
                  <div style={{ fontSize: 12, color: c.ink, marginTop: 1 }}>{p.diagnosis}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{p.doctor} · Last visit: {p.lastVisit}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pager page={paged.page} totalPages={paged.totalPages} total={filtered.length} onPage={setPage} />

      <Modal title="Register New Patient" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={labelStyle(c)}>Full Name *<input style={inp} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="Patient full name" /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={labelStyle(c)}>Age *<input type="number" min="0" max="120" style={inp} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} placeholder="Age" /></label>
            <label style={labelStyle(c)}>Gender<select style={sel} value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "Male" | "Female" }))}><option>Male</option><option>Female</option></select></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={labelStyle(c)}>Phone *<input style={inp} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+251…" /></label>
            <label style={labelStyle(c)}>Blood Type<select style={sel} value={form.bloodType} onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))}>{BLOOD_TYPES.map((b) => <option key={b}>{b}</option>)}</select></label>
          </div>
          <label style={labelStyle(c)}>Assigned Doctor<select style={sel} value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>{DOCTORS.map((d) => <option key={d}>{d}</option>)}</select></label>
          <label style={labelStyle(c)}>Initial Diagnosis / Chief Complaint<input style={inp} value={form.diagnosis} onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))} placeholder="e.g. Hypertension follow-up" /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={() => setShowModal(false)} style={secBtn(c)}>Cancel</button>
            <button type="button" onClick={handleAdd} style={priBtn}>Register Patient</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function labelStyle(c: ReturnType<typeof useColors>) {
  return { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 600, color: c.muted };
}
function secBtn(c: ReturnType<typeof useColors>) {
  return { height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" };
}
const priBtn = { height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" };
