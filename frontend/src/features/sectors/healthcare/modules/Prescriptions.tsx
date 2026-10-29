"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Pager } from "@/components/ui/Pager";
import { paginate } from "@/features/erp/helpers";
import { mockPrescriptions, STATUS_COLORS, type Prescription, type PrescriptionStatus } from "../data";
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
const COMMON_DRUGS = ["Metformin 500mg", "Amlodipine 5mg", "Amoxicillin 250mg", "Paracetamol 500mg", "Atorvastatin 20mg", "Salbutamol Inhaler", "Omeprazole 20mg", "Furosemide 40mg", "Ceftriaxone 1g", "Insulin Glargine", "Diazepam 5mg", "Hydrocortisone 100mg"];
const TODAY = new Date().toISOString().slice(0, 10);

type DrugLine = { name: string; dosage: string; frequency: string; duration: string };

export function Prescriptions() {
  const c = useColors();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: "", mrn: "", doctor: DOCTORS[0], notes: "" });
  const [drugLines, setDrugLines] = useState<DrugLine[]>([{ name: COMMON_DRUGS[0], dosage: "", frequency: "Once daily", duration: "7 days" }]);

  const filtered = prescriptions.filter((p) => {
    const term = search.toLowerCase();
    return (
      (!statusFilter || p.status === statusFilter) &&
      (!term || p.patientName.toLowerCase().includes(term) || p.rxNumber.toLowerCase().includes(term))
    );
  });

  const paged = paginate(filtered, page);

  const stats = {
    active:    prescriptions.filter((p) => p.status === "Active").length,
    dispensed: prescriptions.filter((p) => p.status === "Dispensed").length,
    cancelled: prescriptions.filter((p) => p.status === "Cancelled").length,
    total:     prescriptions.length,
  };

  const kpis = [
    { label: "Total",     value: String(stats.total),     color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-file-prescription" },
    { label: "Active",    value: String(stats.active),    color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-circle-check" },
    { label: "Dispensed", value: String(stats.dispensed), color: "#64748b", bg: c.dark ? "#0d1828" : "#f8fafc", bdr: c.dark ? "#1a2d3d" : "#e2e8f0", icon: "fa-solid fa-bottle-droplet" },
    { label: "Cancelled", value: String(stats.cancelled), color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-circle-xmark" },
  ];

  const addDrugLine = () => setDrugLines((l) => [...l, { name: COMMON_DRUGS[0], dosage: "", frequency: "Once daily", duration: "7 days" }]);
  const removeDrugLine = (i: number) => setDrugLines((l) => l.filter((_, idx) => idx !== i));
  const updateDrugLine = (i: number, patch: Partial<DrugLine>) => setDrugLines((l) => l.map((line, idx) => idx === i ? { ...line, ...patch } : line));

  const handleAdd = () => {
    if (!form.patientName || drugLines.length === 0) return;
    const next: Prescription = {
      id: `rx-${Date.now()}`,
      rxNumber: `RX-2026-${String(Math.floor(90 + Math.random() * 900)).padStart(4, "0")}`,
      patientName: form.patientName,
      mrn: form.mrn,
      doctor: form.doctor,
      date: TODAY,
      status: "Active",
      drugs: drugLines.filter((d) => d.name),
      notes: form.notes,
    };
    setPrescriptions((prev) => [next, ...prev]);
    setForm({ patientName: "", mrn: "", doctor: DOCTORS[0], notes: "" });
    setDrugLines([{ name: COMMON_DRUGS[0], dosage: "", frequency: "Once daily", duration: "7 days" }]);
    setShowModal(false);
  };

  const dispense = (id: string) => {
    setPrescriptions((prev) => prev.map((p) => p.id === id ? { ...p, status: "Dispensed" } : p));
  };

  const inp = {
    height: 34, width: "100%", borderRadius: 7, border: `1px solid ${c.border}`,
    background: c.alt, padding: "0 9px", color: c.ink, fontSize: 12,
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Healthcare</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Prescriptions</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> New Prescription
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
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search patient, Rx number…"
            style={{ height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, paddingLeft: 30, paddingRight: 12, color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box" as const }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as PrescriptionStatus | ""); setPage(1); }} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, padding: "0 10px", color: c.ink, fontSize: 13, outline: "none" }}>
          <option value="">All statuses</option>
          {(["Active", "Dispensed", "Cancelled", "Expired"] as PrescriptionStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* List */}
      {paged.items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: c.muted, fontSize: 13 }}>No prescriptions found.</div>
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {paged.items.map((p, i) => {
            const isLast = i === paged.items.length - 1;
            const isExpanded = expanded === p.id;
            const statusColor = STATUS_COLORS[p.status] as string;
            return (
              <div key={p.id} style={{ borderBottom: isLast ? "none" : `1px solid ${c.border}` }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", transition: "background 0.12s", cursor: "default" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <button type="button" onClick={() => setExpanded(isExpanded ? null : p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 5, border: `1px solid ${c.border}`, background: "transparent", color: c.muted, cursor: "pointer", flexShrink: 0 }}>
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted, flexShrink: 0 }}>{p.rxNumber}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{p.patientName}</span>
                  {p.mrn && <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{p.mrn}</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: `${statusColor}18`, color: statusColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>{p.status}</span>
                  {p.status === "Active" && (
                    <button type="button" onClick={() => dispense(p.id)} style={{ marginLeft: "auto", height: 26, padding: "0 10px", borderRadius: 6, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                      Mark Dispensed
                    </button>
                  )}
                </div>
                <div style={{ paddingLeft: 48, paddingRight: 16, paddingBottom: 8, marginTop: -4 }}>
                  <span style={{ fontSize: 11, color: c.muted }}>{p.doctor} · {p.date} · {p.drugs.length} drug{p.drugs.length !== 1 ? "s" : ""}</span>
                </div>
                {isExpanded && (
                  <div style={{ margin: "0 16px 12px 48px", borderLeft: `2px solid ${c.border}`, paddingLeft: 12 }}>
                    {p.drugs.map((d, di) => (
                      <div key={di} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{d.dosage} · {d.frequency} · {d.duration}</div>
                      </div>
                    ))}
                    {p.notes && <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>Notes: {p.notes}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pager page={paged.page} totalPages={paged.totalPages} total={filtered.length} onPage={setPage} />

      <Modal title="Create Prescription" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Patient Name *<input style={inp} value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} placeholder="Full name" /></label>
            <label style={lbl(c)}>MRN<input style={inp} value={form.mrn} onChange={(e) => setForm((f) => ({ ...f, mrn: e.target.value }))} placeholder="MRN-XXXXX" /></label>
          </div>
          <label style={lbl(c)}>Prescribing Doctor<select style={inp} value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>{DOCTORS.map((d) => <option key={d}>{d}</option>)}</select></label>

          <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.ink }}>Drugs</span>
              <button type="button" onClick={addDrugLine} style={{ height: 28, padding: "0 10px", borderRadius: 6, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Add Drug</button>
            </div>
            {drugLines.map((line, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 0.8fr 1fr 0.8fr 24px", gap: 5, marginBottom: 6, alignItems: "end" }}>
                <select style={inp} value={line.name} onChange={(e) => updateDrugLine(i, { name: e.target.value })}>{COMMON_DRUGS.map((d) => <option key={d}>{d}</option>)}</select>
                <input style={inp} value={line.dosage} onChange={(e) => updateDrugLine(i, { dosage: e.target.value })} placeholder="Dose" />
                <input style={inp} value={line.frequency} onChange={(e) => updateDrugLine(i, { frequency: e.target.value })} placeholder="Frequency" />
                <input style={inp} value={line.duration} onChange={(e) => updateDrugLine(i, { duration: e.target.value })} placeholder="Duration" />
                <button type="button" onClick={() => removeDrugLine(i)} disabled={drugLines.length === 1} style={{ height: 34, width: 24, borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: "#f43f5e", fontSize: 14, fontWeight: 700, cursor: drugLines.length === 1 ? "not-allowed" : "pointer", opacity: drugLines.length === 1 ? 0.4 : 1 }}>×</button>
              </div>
            ))}
          </div>

          <label style={lbl(c)}>Notes<input style={inp} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Additional instructions" /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="button" onClick={handleAdd} style={{ height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Issue Prescription</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function lbl(c: ReturnType<typeof useColors>) {
  return { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 600, color: c.muted };
}
