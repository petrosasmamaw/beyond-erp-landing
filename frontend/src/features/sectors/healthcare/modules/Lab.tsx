"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Pager } from "@/components/ui/Pager";
import { paginate } from "@/features/erp/helpers";
import { mockLabRequests, STATUS_COLORS, type LabRequest, type LabStatus, type LabPriority } from "../data";
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
const TEST_CATEGORIES = ["Biochemistry", "Hematology", "Microbiology", "Cardiac Markers", "Endocrinology", "Renal Function", "Radiology", "Pulmonology", "Point-of-Care", "Cardiology", "Oncology"];
const COMMON_TESTS: Record<string, string[]> = {
  Biochemistry: ["Fasting Blood Sugar", "HbA1c", "Lipid Profile", "Liver Function Test", "Blood Urea Nitrogen"],
  Hematology: ["CBC", "CBC + Peripheral Smear", "ESR", "Coagulation Profile"],
  Microbiology: ["Urine R/E + Culture", "Blood Culture", "Sputum Culture", "Stool R/E"],
  "Cardiac Markers": ["Troponin I", "BNP", "CK-MB", "D-Dimer"],
  Endocrinology: ["TSH + Free T4", "Cortisol", "HbA1c", "Prolactin"],
  "Renal Function": ["Creatinine + eGFR", "Uric Acid", "Electrolytes", "24h Urine Protein"],
  Radiology: ["X-Ray Chest", "X-Ray Left Knee", "Ultrasound Abdomen", "CT Scan Head", "MRI Spine"],
  Pulmonology: ["Peak Flow / Spirometry", "ABG", "Sputum AFB"],
  "Point-of-Care": ["ABG (Arterial Blood Gas)", "Blood Glucose (POC)", "Malaria RDT"],
  Cardiology: ["Echocardiogram", "ECG", "Holter Monitor"],
  Oncology: ["PSA", "AFP", "CA-125", "CEA", "Bone Marrow Biopsy"],
};
const TODAY = new Date().toISOString().slice(0, 10);

const ADVANCE_LABEL: Record<LabStatus, string> = {
  "Pending": "Collect Sample",
  "Sample Collected": "Start Processing",
  "Processing": "Enter Result",
  "Result Ready": "Mark Reported",
  "Reported": "",
};

export function Lab() {
  const c = useColors();
  const [requests, setRequests] = useState<LabRequest[]>(mockLabRequests);
  const [statusFilter, setStatusFilter] = useState<LabStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<LabPriority | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(TEST_CATEGORIES[0]);
  const [form, setForm] = useState({ patientName: "", mrn: "", testName: COMMON_TESTS[TEST_CATEGORIES[0]][0], requestedBy: DOCTORS[0], priority: "Normal" as LabPriority, cost: "" });

  const filtered = requests.filter((r) => {
    const term = search.toLowerCase();
    return (
      (!statusFilter || r.status === statusFilter) &&
      (!priorityFilter || r.priority === priorityFilter) &&
      (!term || r.patientName.toLowerCase().includes(term) || r.reqNumber.toLowerCase().includes(term) || r.testName.toLowerCase().includes(term))
    );
  });

  const paged = paginate(filtered, page);

  const stats = {
    pending:     requests.filter((r) => r.status === "Pending" || r.status === "Sample Collected").length,
    processing:  requests.filter((r) => r.status === "Processing").length,
    resultReady: requests.filter((r) => r.status === "Result Ready").length,
    stat:        requests.filter((r) => r.priority === "STAT").length,
  };

  const kpis = [
    { label: "Awaiting",       value: String(stats.pending),     color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-hourglass-half" },
    { label: "Processing",     value: String(stats.processing),  color: "#8b5cf6", bg: c.dark ? "#110b24" : "#f5f3ff", bdr: c.dark ? "#241852" : "#ddd6fe", icon: "fa-solid fa-microscope" },
    { label: "Results Ready",  value: String(stats.resultReady), color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-flask-vial" },
    { label: "STAT Requests",  value: String(stats.stat),        color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-bolt" },
  ];

  const advanceStatus = (id: string) => {
    const progression: Record<LabStatus, LabStatus> = {
      "Pending": "Sample Collected",
      "Sample Collected": "Processing",
      "Processing": "Result Ready",
      "Result Ready": "Reported",
      "Reported": "Reported",
    };
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: progression[r.status] } : r));
  };

  const handleAdd = () => {
    if (!form.patientName || !form.testName) return;
    const next: LabRequest = {
      id: `l-${Date.now()}`,
      reqNumber: `LAB-2026-${String(Math.floor(213 + Math.random() * 100)).padStart(4, "0")}`,
      patientName: form.patientName,
      mrn: form.mrn,
      testName: form.testName,
      category: selectedCategory,
      requestedBy: form.requestedBy,
      date: TODAY,
      priority: form.priority,
      status: "Pending",
      cost: Number(form.cost) || 100,
    };
    setRequests((prev) => [next, ...prev]);
    setForm({ patientName: "", mrn: "", testName: COMMON_TESTS[TEST_CATEGORIES[0]][0], requestedBy: DOCTORS[0], priority: "Normal", cost: "" });
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
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Lab Requests</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> New Request
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
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search patient, test, Req#…"
            style={{ ...inp, paddingLeft: 30 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as LabStatus | ""); setPage(1); }} style={{ ...inp, width: "auto", minWidth: 140 }}>
          <option value="">All statuses</option>
          {(["Pending", "Sample Collected", "Processing", "Result Ready", "Reported"] as LabStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value as LabPriority | ""); setPage(1); }} style={{ ...inp, width: "auto", minWidth: 120 }}>
          <option value="">All priorities</option>
          {(["Normal", "Urgent", "STAT"] as LabPriority[]).map((p) => <option key={p}>{p}</option>)}
        </select>
        <button onClick={() => { setSearch(""); setStatusFilter(""); setPriorityFilter(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
      </div>

      {/* List */}
      {paged.items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: c.muted, fontSize: 13 }}>No lab requests found.</div>
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {paged.items.map((r, i) => {
            const isLast = i === paged.items.length - 1;
            const priorityColor = STATUS_COLORS[r.priority] as string;
            const statusColor = STATUS_COLORS[r.status] as string;
            return (
              <div
                key={r.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, transition: "background 0.12s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{r.reqNumber}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{r.patientName}</span>
                    {r.mrn && <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{r.mrn}</span>}
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: `${priorityColor}18`, color: priorityColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>{r.priority}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: `${statusColor}18`, color: statusColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginTop: 3 }}>{r.testName} <span style={{ fontSize: 11, fontWeight: 400, color: c.muted }}>· {r.category}</span></div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{r.requestedBy} · {r.date} · ETB {r.cost}</div>
                  {r.result && (
                    <div style={{ marginTop: 5, fontSize: 12, color: "#059669", background: c.dark ? "#071812" : "#f0fdf4", padding: "3px 8px", borderRadius: 6, display: "inline-block" }}>
                      Result: {r.result}
                    </div>
                  )}
                </div>
                {r.status !== "Reported" && (
                  <button type="button" onClick={() => advanceStatus(r.id)} style={{ height: 30, padding: "0 11px", borderRadius: 7, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                    {ADVANCE_LABEL[r.status]}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pager page={paged.page} totalPages={paged.totalPages} total={filtered.length} onPage={setPage} />

      <Modal title="New Lab Request" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Patient Name *<input style={inp} value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} placeholder="Full name" /></label>
            <label style={lbl(c)}>MRN<input style={inp} value={form.mrn} onChange={(e) => setForm((f) => ({ ...f, mrn: e.target.value }))} placeholder="MRN-XXXXX" /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Test Category
              <select style={inp} value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setForm((f) => ({ ...f, testName: COMMON_TESTS[e.target.value][0] })); }}>
                {TEST_CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </label>
            <label style={lbl(c)}>Test Name
              <select style={inp} value={form.testName} onChange={(e) => setForm((f) => ({ ...f, testName: e.target.value }))}>
                {(COMMON_TESTS[selectedCategory] ?? []).map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Requested By<select style={inp} value={form.requestedBy} onChange={(e) => setForm((f) => ({ ...f, requestedBy: e.target.value }))}>{DOCTORS.map((d) => <option key={d}>{d}</option>)}</select></label>
            <label style={lbl(c)}>Priority<select style={inp} value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as LabPriority }))}><option>Normal</option><option>Urgent</option><option>STAT</option></select></label>
          </div>
          <label style={lbl(c)}>Cost (ETB)<input type="number" min="0" style={inp} value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} placeholder="e.g. 180" /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="button" onClick={handleAdd} style={{ height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Submit Request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function lbl(c: ReturnType<typeof useColors>) {
  return { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 600, color: c.muted };
}
