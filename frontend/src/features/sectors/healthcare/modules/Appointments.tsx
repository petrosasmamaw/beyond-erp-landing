"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Pager } from "@/components/ui/Pager";
import { paginate } from "@/features/erp/helpers";
import { mockAppointments, STATUS_COLORS, type Appointment, type AppointmentStatus, type AppointmentType } from "../data";
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

const DOCTORS = ["Dr. Tigist Alemu", "Dr. Yonas Bekele", "Dr. Hiwot Haile", "Dr. Biruk Desta"];
const DEPARTMENTS = ["Internal Medicine", "Cardiology", "OB/GYN", "Pulmonology", "Endocrinology", "Surgery", "ICU", "Orthopedics", "Nephrology", "Oncology", "Pediatrics"];
const TODAY = new Date().toISOString().slice(0, 10);

export function Appointments() {
  const c = useColors();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [dateFilter, setDateFilter] = useState<"today" | "all">("today");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: "", mrn: "", doctor: DOCTORS[0], department: DEPARTMENTS[0], date: TODAY, time: "09:00", type: "Consultation" as AppointmentType, notes: "" });

  const filtered = appointments.filter((a) => {
    return (
      (dateFilter === "all" || a.date === TODAY) &&
      (!statusFilter || a.status === statusFilter)
    );
  });

  const paged = paginate(filtered, page);

  const todayAppts = appointments.filter((a) => a.date === TODAY);
  const stats = {
    todayTotal: todayAppts.length,
    confirmed:  todayAppts.filter((a) => a.status === "Confirmed" || a.status === "In Progress").length,
    completed:  todayAppts.filter((a) => a.status === "Completed").length,
    noShows:    appointments.filter((a) => a.status === "No-Show").length,
  };

  const kpis = [
    { label: "Today's Total", value: String(stats.todayTotal), color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-calendar-day" },
    { label: "Active Now",    value: String(stats.confirmed),  color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-stethoscope" },
    { label: "Completed",     value: String(stats.completed),  color: "#64748b", bg: c.dark ? "#0d1828" : "#f8fafc", bdr: c.dark ? "#1a2d3d" : "#e2e8f0", icon: "fa-solid fa-circle-check" },
    { label: "No-Shows",      value: String(stats.noShows),    color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-user-xmark" },
  ];

  const handleAdd = () => {
    if (!form.patientName || !form.date || !form.time) return;
    const next: Appointment = {
      id: `a-${Date.now()}`,
      ...form,
      status: "Scheduled",
    };
    setAppointments((prev) => [next, ...prev]);
    setForm({ patientName: "", mrn: "", doctor: DOCTORS[0], department: DEPARTMENTS[0], date: TODAY, time: "09:00", type: "Consultation", notes: "" });
    setShowModal(false);
  };

  const inp = {
    height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`,
    background: c.alt, padding: "0 10px", color: c.ink, fontSize: 13,
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Healthcare</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Appointments</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> Book Appointment
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
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {(["today", "all"] as const).map((f) => (
          <button key={f} onClick={() => { setDateFilter(f); setPage(1); }} style={{
            padding: "5px 13px", borderRadius: 6, border: `1px solid ${dateFilter === f ? "#2563eb" : c.border}`,
            background: dateFilter === f ? "#2563eb18" : c.surface, color: dateFilter === f ? "#2563eb" : c.muted,
            fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "capitalize",
          }}>
            {f === "today" ? "Today" : "All"}
          </button>
        ))}
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as AppointmentStatus | ""); setPage(1); }} style={{ ...inp, width: "auto", minWidth: 140 }}>
          <option value="">All statuses</option>
          {(["Scheduled", "Confirmed", "In Progress", "Completed", "No-Show", "Cancelled"] as AppointmentStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setDateFilter("today"); setStatusFilter(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
      </div>

      {/* List */}
      {paged.items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: c.muted, fontSize: 13 }}>No appointments for this view.</div>
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {paged.items.map((a, i) => {
            const isLast = i === paged.items.length - 1;
            const statusColor = STATUS_COLORS[a.status] as string;
            return (
              <div
                key={a.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, transition: "background 0.12s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Time badge */}
                <div style={{ width: 46, height: 36, borderRadius: 8, background: c.dark ? "#08121e" : "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                  {a.time}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{a.patientName}</span>
                    {a.mrn && <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{a.mrn}</span>}
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: `${statusColor}18`, color: statusColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{a.doctor} · {a.department}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{a.type}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{a.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pager page={paged.page} totalPages={paged.totalPages} total={filtered.length} onPage={setPage} />

      <Modal title="Book Appointment" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Patient Name *<input style={inp} value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} placeholder="Full name" /></label>
            <label style={lbl(c)}>MRN<input style={inp} value={form.mrn} onChange={(e) => setForm((f) => ({ ...f, mrn: e.target.value }))} placeholder="MRN-XXXXX" /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Doctor<select style={inp} value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>{DOCTORS.map((d) => <option key={d}>{d}</option>)}</select></label>
            <label style={lbl(c)}>Department<select style={inp} value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Date *<input type="date" style={inp} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></label>
            <label style={lbl(c)}>Time *<input type="time" style={inp} value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} /></label>
          </div>
          <label style={lbl(c)}>Type<select style={inp} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AppointmentType }))}>{(["Consultation", "Follow-up", "Emergency", "Procedure"] as AppointmentType[]).map((t) => <option key={t}>{t}</option>)}</select></label>
          <label style={lbl(c)}>Notes<input style={inp} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="button" onClick={handleAdd} style={{ height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Book Appointment</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function lbl(c: ReturnType<typeof useColors>) {
  return { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 600, color: c.muted };
}
