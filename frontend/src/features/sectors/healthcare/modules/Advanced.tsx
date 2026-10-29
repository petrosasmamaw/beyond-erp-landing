"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Link2,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Truck,
  Users,
  Wrench
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/contexts/ThemeContext";

type Tone = "blue" | "green" | "amber" | "red" | "purple" | "slate" | "teal";

type StatDef = {
  label: string;
  value: string;
  tone: Tone;
};

type HealthRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  owner?: string;
  date?: string;
  value?: string;
  priority?: string;
  category?: string;
  tags?: string[];
  details?: string[];
};

type PanelDef = {
  title: string;
  items: string[];
  tone?: Tone;
};

type ChartPoint = {
  label: string;
  value: number;
  color?: string;
};

type ModuleDef = {
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof HeartPulse;
  color: string;
  addLabel: string;
  recordNoun: string;
  stats: StatDef[];
  records: HealthRecord[];
  tabs?: string[];
  workflow?: string[];
  panels?: PanelDef[];
  chart?: ChartPoint[];
};

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: dark ? "#111827" : "#ffffff",
    alt: dark ? "#0d1828" : "#f8fafc",
    border: dark ? "#1a2d3d" : "#e8edf5",
    ink: dark ? "#e2e8f0" : "#0f172a",
    muted: dark ? "#7b8798" : "#64748b",
    softText: dark ? "#a8b3c7" : "#475569"
  };
}

const toneMap: Record<Tone, { color: string; bg: string; darkBg: string; border: string; darkBorder: string }> = {
  blue: { color: "#2563eb", bg: "#eff6ff", darkBg: "#08121e", border: "#bfdbfe", darkBorder: "#142338" },
  green: { color: "#10b981", bg: "#f0fdf4", darkBg: "#071812", border: "#bbf7d0", darkBorder: "#0f2e1e" },
  amber: { color: "#f59e0b", bg: "#fffbeb", darkBg: "#150f02", border: "#fde68a", darkBorder: "#2e2008" },
  red: { color: "#ef4444", bg: "#fff1f2", darkBg: "#1c0a10", border: "#fecdd3", darkBorder: "#3a1520" },
  purple: { color: "#8b5cf6", bg: "#f5f3ff", darkBg: "#110b24", border: "#ddd6fe", darkBorder: "#241852" },
  slate: { color: "#64748b", bg: "#f8fafc", darkBg: "#0d1828", border: "#e2e8f0", darkBorder: "#1a2d3d" },
  teal: { color: "#0f766e", bg: "#f0fdfa", darkBg: "#071918", border: "#99f6e4", darkBorder: "#123632" }
};

function toneStyle(tone: Tone, dark: boolean) {
  const t = toneMap[tone];
  return {
    color: t.color,
    background: dark ? t.darkBg : t.bg,
    borderColor: dark ? t.darkBorder : t.border
  };
}

function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (s.includes("critical") || s.includes("overdue") || s.includes("failed") || s.includes("stat")) return "red";
  if (s.includes("pending") || s.includes("waiting") || s.includes("draft") || s.includes("scheduled")) return "amber";
  if (s.includes("active") || s.includes("ready") || s.includes("paid") || s.includes("approved") || s.includes("available")) return "green";
  if (s.includes("insurance") || s.includes("sync") || s.includes("export")) return "blue";
  if (s.includes("review") || s.includes("processing") || s.includes("in progress")) return "purple";
  return "slate";
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function HealthcareMockModule({ definition }: { definition: ModuleDef }) {
  const c = useColors();
  const [records, setRecords] = useState(definition.records);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    owner: "",
    status: definition.records[0]?.status ?? "Active",
    value: "",
    note: ""
  });

  const Icon = definition.icon;
  const tabOptions = useMemo(() => {
    const recordTabs = unique(records.flatMap((r) => [r.status, r.category ?? ""].filter(Boolean)));
    return unique(["All", ...(definition.tabs ?? recordTabs)]);
  }, [definition.tabs, records]);

  const statusOptions = useMemo(() => unique(records.map((r) => r.status)), [records]);

  const filtered = records.filter((record) => {
    const term = search.trim().toLowerCase();
    const haystack = [
      record.title,
      record.subtitle,
      record.owner,
      record.status,
      record.category,
      record.value,
      ...(record.tags ?? []),
      ...(record.details ?? [])
    ].join(" ").toLowerCase();
    const tabMatch =
      activeTab === "All" ||
      record.status === activeTab ||
      record.category === activeTab ||
      record.tags?.includes(activeTab);
    return tabMatch && (!term || haystack.includes(term));
  });

  const inputStyle: CSSProperties = {
    height: 36,
    width: "100%",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.alt,
    padding: "0 10px",
    color: c.ink,
    fontSize: 13,
    outline: "none"
  };

  const addRecord = () => {
    if (!form.title.trim()) return;
    const next: HealthRecord = {
      id: `mock-${Date.now()}`,
      title: form.title.trim(),
      subtitle: form.note.trim() || `New mock ${definition.recordNoun.toLowerCase()} record`,
      status: form.status,
      owner: form.owner.trim() || "Unassigned",
      date: new Date().toISOString().slice(0, 10),
      value: form.value.trim() || undefined,
      priority: form.status.toLowerCase().includes("critical") ? "High" : "Normal",
      tags: ["Mock", definition.recordNoun]
    };
    setRecords((prev) => [next, ...prev]);
    setForm({ title: "", owner: "", status: statusOptions[0] ?? "Active", value: "", note: "" });
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: `${definition.color}18`,
              color: definition.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Icon size={21} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: c.muted, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.07em" }}>
              {definition.eyebrow}
            </p>
            <h2 style={{ margin: "3px 0 0", fontSize: 21, color: c.ink, lineHeight: 1.12 }}>{definition.title}</h2>
            <p style={{ margin: "4px 0 0", color: c.muted, fontSize: 12.5, lineHeight: 1.45, maxWidth: 760 }}>
              {definition.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            minHeight: 34,
            padding: "0 13px",
            borderRadius: 8,
            border: 0,
            background: "#2563eb",
            color: "#fff",
            fontSize: 13,
            fontWeight: 800
          }}
        >
          <Plus size={14} />
          {definition.addLabel}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {definition.stats.map((stat) => {
          const tone = toneStyle(stat.tone, c.dark);
          return (
            <div key={stat.label} style={{ minHeight: 86, borderRadius: 10, border: `1px solid ${tone.borderColor}`, background: tone.background, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <span style={{ color: c.muted, fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
                <span style={{ width: 22, height: 22, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `${tone.color}18`, color: tone.color }}>
                  <BarChart3 size={12} />
                </span>
              </div>
              <strong style={{ display: "block", color: c.ink, fontSize: "clamp(15px, 2vw, 19px)", marginTop: 8 }}>{stat.value}</strong>
            </div>
          );
        })}
      </div>

      {definition.workflow?.length ? (
        <div style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9, color: c.ink, fontSize: 13, fontWeight: 800 }}>
            <Activity size={15} />
            Workflow
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {definition.workflow.map((step, index) => (
              <span
                key={`${index}-${step}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  minHeight: 26,
                  borderRadius: 7,
                  border: `1px solid ${c.border}`,
                  background: c.alt,
                  padding: "0 9px",
                  color: c.softText,
                  fontSize: 11,
                  fontWeight: 700
                }}
              >
                <strong style={{ color: definition.color }}>{index + 1}</strong>
                {step}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 240px", minWidth: 0, position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${definition.recordNoun.toLowerCase()} records...`}
            style={{ ...inputStyle, paddingLeft: 30 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 1 }}>
          {tabOptions.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                minHeight: 34,
                padding: "0 11px",
                borderRadius: 7,
                border: `1px solid ${activeTab === tab ? "#2563eb" : c.border}`,
                background: activeTab === tab ? "#2563eb" : c.surface,
                color: activeTab === tab ? "#fff" : c.muted,
                fontSize: 12,
                fontWeight: 800,
                whiteSpace: "nowrap"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {filtered.length ? filtered.map((record) => {
            const tone = toneStyle(statusTone(record.status), c.dark);
            return (
              <article key={record.id} style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, padding: 13, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                      <strong style={{ color: c.ink, fontSize: 13.5, lineHeight: 1.25 }}>{record.title}</strong>
                      <span style={{ borderRadius: 5, background: tone.background, color: tone.color, border: `1px solid ${tone.borderColor}`, padding: "1px 6px", fontSize: 9.5, fontWeight: 900, textTransform: "uppercase" }}>
                        {record.status}
                      </span>
                      {record.priority ? (
                        <span style={{ borderRadius: 5, background: c.alt, color: c.muted, border: `1px solid ${c.border}`, padding: "1px 6px", fontSize: 9.5, fontWeight: 800 }}>
                          {record.priority}
                        </span>
                      ) : null}
                    </div>
                    <p style={{ margin: "4px 0 0", color: c.muted, fontSize: 12, lineHeight: 1.45 }}>{record.subtitle}</p>
                  </div>
                  {record.value ? <strong style={{ color: definition.color, fontSize: 12, whiteSpace: "nowrap" }}>{record.value}</strong> : null}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: c.muted, fontSize: 11 }}>
                  {record.owner ? <span><strong style={{ color: c.softText }}>Owner:</strong> {record.owner}</span> : null}
                  {record.date ? <span><strong style={{ color: c.softText }}>Date:</strong> {record.date}</span> : null}
                  {record.category ? <span><strong style={{ color: c.softText }}>Type:</strong> {record.category}</span> : null}
                </div>
                {record.details?.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {record.details.map((detail, index) => (
                      <span key={`${record.id}-${index}-${detail}`} style={{ borderRadius: 5, background: c.alt, border: `1px solid ${c.border}`, color: c.softText, padding: "3px 7px", fontSize: 10.5, fontWeight: 700 }}>
                        {detail}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          }) : (
            <div style={{ borderRadius: 10, border: `1px dashed ${c.border}`, color: c.muted, background: c.surface, padding: 30, textAlign: "center", fontSize: 13 }}>
              No mock records match this view.
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {definition.chart?.length ? <ChartPanel chart={definition.chart} color={definition.color} /> : null}
          {definition.panels?.map((panel) => (
            <SidePanel key={panel.title} panel={panel} />
          ))}
        </div>
      </div>

      <Modal title={`Add ${definition.recordNoun}`} isOpen={showModal} onClose={() => setShowModal(false)} maxWidth={520}>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle(c)}>
            Title *
            <input style={inputStyle} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={`${definition.recordNoun} name`} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            <label style={labelStyle(c)}>
              Owner
              <input style={inputStyle} value={form.owner} onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))} placeholder="Responsible person" />
            </label>
            <label style={labelStyle(c)}>
              Status
              <select style={inputStyle} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {statusOptions.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <label style={labelStyle(c)}>
            Value / Metric
            <input style={inputStyle} value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="ETB amount, count, bed, ward, or score" />
          </label>
          <label style={labelStyle(c)}>
            Note
            <input style={inputStyle} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Short mock note" />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 2 }}>
            <button type="button" onClick={() => setShowModal(false)} style={secondaryButton(c)}>Cancel</button>
            <button type="button" onClick={addRecord} style={primaryButton}>Save Mock Record</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SidePanel({ panel }: { panel: PanelDef }) {
  const c = useColors();
  const tone = toneStyle(panel.tone ?? "blue", c.dark);
  return (
    <section style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, padding: 13 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
        <span style={{ width: 22, height: 22, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", background: tone.background, color: tone.color, border: `1px solid ${tone.borderColor}` }}>
          <ClipboardCheck size={12} />
        </span>
        <strong style={{ color: c.ink, fontSize: 13 }}>{panel.title}</strong>
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {panel.items.map((item, index) => (
          <div key={`${panel.title}-${index}`} style={{ display: "flex", alignItems: "flex-start", gap: 7, color: c.muted, fontSize: 12, lineHeight: 1.4 }}>
            <span style={{ marginTop: 5, width: 5, height: 5, borderRadius: 99, background: tone.color, flexShrink: 0 }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChartPanel({ chart, color }: { chart: ChartPoint[]; color: string }) {
  const c = useColors();
  const max = Math.max(...chart.map((p) => p.value), 1);
  return (
    <section style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, padding: 13 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, color: c.ink, fontSize: 13, fontWeight: 800 }}>
        <BarChart3 size={14} />
        Analytics Snapshot
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {chart.map((point, index) => (
          <div key={`${index}-${point.label}`} style={{ display: "grid", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11, color: c.muted, fontWeight: 700 }}>
              <span>{point.label}</span>
              <span>{point.value}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: c.alt, overflow: "hidden" }}>
              <span style={{ display: "block", height: "100%", width: `${Math.max(5, (point.value / max) * 100)}%`, borderRadius: 99, background: point.color ?? color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function labelStyle(c: ReturnType<typeof useColors>): CSSProperties {
  return { display: "grid", gap: 5, color: c.muted, fontSize: 12, fontWeight: 800 };
}

function secondaryButton(c: ReturnType<typeof useColors>): CSSProperties {
  return {
    height: 36,
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.surface,
    color: c.ink,
    fontSize: 13,
    fontWeight: 800
  };
}

const primaryButton: CSSProperties = {
  height: 36,
  borderRadius: 8,
  border: 0,
  background: "#2563eb",
  color: "#fff",
  fontSize: 13,
  fontWeight: 800
};

const modules: Record<string, ModuleDef> = {
  overview: {
    title: "Health ERP Command Center",
    eyebrow: "Healthcare",
    description: "Mock operating view for the complete hospital ERP: clinical care, finance, stock, compliance, public-health reporting, and integrations.",
    icon: HeartPulse,
    color: "#ef4444",
    addLabel: "Add Work Item",
    recordNoun: "Command Item",
    stats: [
      { label: "Patients Today", value: "86", tone: "blue" },
      { label: "Beds Occupied", value: "41 / 58", tone: "green" },
      { label: "Critical Alerts", value: "7", tone: "red" },
      { label: "Revenue Today", value: "ETB 128k", tone: "amber" }
    ],
    workflow: ["Register", "Triage", "Consult", "Orders", "Dispense or Report", "Bill", "Report"],
    tabs: ["All", "Clinical", "Finance", "Operations", "Compliance"],
    chart: [
      { label: "OPD completion", value: 82, color: "#2563eb" },
      { label: "Lab turnaround", value: 74, color: "#06b6d4" },
      { label: "Stock readiness", value: 91, color: "#10b981" },
      { label: "Claims clean rate", value: 68, color: "#8b5cf6" }
    ],
    panels: [
      {
        title: "Feature Coverage",
        tone: "green",
        items: [
          "Patient, appointment, pharmacy, prescription, lab, and billing modules remain as detailed mock screens.",
          "New mock modules cover OPD, IPD, EMR, staff, claims, procurement, reporting, compliance, portal, and integrations.",
          "Designed to stay frontend-only until backend entities are ready."
        ]
      },
      {
        title: "Branch View",
        tone: "blue",
        items: [
          "Main Hospital: 63 active visits, 28 occupied beds.",
          "Bole Clinic: 17 appointments, 4 lab samples.",
          "Remote outreach: 6 referrals awaiting review."
        ]
      }
    ],
    records: [
      { id: "cmd-1", title: "Morning clinical huddle", subtitle: "Critical patients, STAT labs, theatre schedule, and pharmacy stock risk reviewed.", status: "Clinical", owner: "Medical Director", date: "2026-05-27", priority: "High", category: "Clinical", details: ["ICU", "STAT labs", "Theatre"] },
      { id: "cmd-2", title: "Insurance claim cleanup", subtitle: "Rejected claims require diagnosis code and attachment review before resubmission.", status: "Finance", owner: "Claims Officer", date: "2026-05-27", value: "ETB 42k", category: "Finance", details: ["Claims", "Attachments"] },
      { id: "cmd-3", title: "EHMIS weekly export draft", subtitle: "Routine service indicators are staged for data quality check and DHIS2/eHMIS export.", status: "Compliance", owner: "HIS Officer", date: "2026-05-26", category: "Compliance", details: ["DHIS2", "HMIS", "Validation"] }
    ]
  },
  records: {
    title: "EMR / EHR Records",
    eyebrow: "Clinical documentation",
    description: "Visit history, allergies, vitals, diagnoses, notes, clinical forms, uploaded reports, and coding-ready medical records.",
    icon: FileText,
    color: "#dc2626",
    addLabel: "Add Encounter",
    recordNoun: "Encounter",
    stats: [
      { label: "Open Encounters", value: "34", tone: "blue" },
      { label: "Allergy Alerts", value: "9", tone: "red" },
      { label: "Unsigned Notes", value: "12", tone: "amber" },
      { label: "Files Uploaded", value: "147", tone: "green" }
    ],
    workflow: ["Open visit", "Capture vitals", "Document notes", "Code diagnosis", "Attach files", "Sign encounter"],
    tabs: ["All", "Unsigned", "Allergy Alert", "Chronic Care", "Documents"],
    panels: [
      {
        title: "Clinical Forms",
        tone: "purple",
        items: [
          "General consultation, emergency, surgery, delivery, gynaecology, NCD, TB/HIV, MCH/ANC, and custom forms.",
          "Structured vitals and observations for trend views.",
          "Diagnosis coding planned for ICD/SNOMED CT style lookup."
        ]
      },
      {
        title: "File Uploads",
        tone: "teal",
        items: [
          "Lab PDFs, radiology reports, consent forms, discharge summaries, referral letters, and scanned insurance cards.",
          "Mock upload queue is represented here. Backend storage can come later."
        ]
      }
    ],
    records: [
      { id: "ehr-1", title: "MRN-00124 - Diabetes follow-up", subtitle: "HbA1c reviewed, medication adjusted, foot exam documented.", status: "Signed", owner: "Dr. Tigist Alemu", date: "2026-05-27", category: "Chronic Care", details: ["Allergies: None", "Vitals captured", "2 documents"] },
      { id: "ehr-2", title: "MRN-00126 - Acute MI inpatient note", subtitle: "Cardiology round note needs consultant signature before discharge summary.", status: "Unsigned", owner: "Dr. Hiwot Haile", date: "2026-05-27", priority: "High", details: ["Penicillin allergy", "ICU", "Troponin linked"] },
      { id: "ehr-3", title: "MRN-00130 - COPD emergency encounter", subtitle: "Nebulization response documented with ABG result and nursing observations.", status: "Allergy Alert", owner: "Nurse Lensa", date: "2026-05-27", category: "Documents", details: ["Oxygen chart", "ABG result", "Steroid order"] }
    ]
  },
  queueOpd: {
    title: "Queue, Triage & OPD",
    eyebrow: "Outpatient workflow",
    description: "Walk-ins, online bookings, queue tokens, triage, doctor consultation, orders, checkout, and follow-up routing.",
    icon: Stethoscope,
    color: "#2563eb",
    addLabel: "Add Queue Token",
    recordNoun: "Queue Token",
    stats: [
      { label: "Waiting", value: "18", tone: "amber" },
      { label: "In Consultation", value: "9", tone: "purple" },
      { label: "Completed", value: "44", tone: "green" },
      { label: "Avg Wait", value: "26 min", tone: "blue" }
    ],
    workflow: ["Reception", "Triage", "Queue", "Consultation", "Orders", "Billing", "Follow-up"],
    tabs: ["All", "Waiting", "Triage", "In Consultation", "Completed"],
    chart: [
      { label: "Registration", value: 95 },
      { label: "Triage", value: 78 },
      { label: "Consultation", value: 66 },
      { label: "Checkout", value: 84 }
    ],
    panels: [
      {
        title: "Queue Rules",
        tone: "blue",
        items: [
          "Emergency and STAT patients are promoted automatically in the mock queue.",
          "Walk-in patients can be registered without a prior appointment.",
          "SMS/email reminders are represented in the portal and notification module."
        ]
      }
    ],
    records: [
      { id: "opd-1", title: "Q-018 - Meron Hailu", subtitle: "Walk-in OB/GYN triage completed, waiting for consultation.", status: "Waiting", owner: "Reception", date: "10:20", priority: "Normal", category: "Triage", details: ["BP 118/74", "Pulse 82", "OB/GYN"] },
      { id: "opd-2", title: "Q-011 - Solomon Kebede", subtitle: "Emergency COPD review in consultation room 2.", status: "In Consultation", owner: "Dr. Hiwot Haile", date: "09:45", priority: "STAT", details: ["O2 sat 88%", "Nebulization", "ABG ordered"] },
      { id: "opd-3", title: "Q-006 - Selam Tadesse", subtitle: "Consultation complete, lab and medication orders sent to billing.", status: "Completed", owner: "Dr. Yonas Bekele", date: "09:10", details: ["Lipid profile", "Amlodipine"] }
    ]
  },
  inpatient: {
    title: "IPD, Beds & Discharge",
    eyebrow: "Inpatient management",
    description: "Admissions, bed allocation, ward occupancy, transfers, nursing care plans, discharge workflow, and inpatient billing handoff.",
    icon: Building2,
    color: "#0f766e",
    addLabel: "Admit Patient",
    recordNoun: "Admission",
    stats: [
      { label: "Admissions", value: "41", tone: "blue" },
      { label: "Beds Free", value: "17", tone: "green" },
      { label: "Transfers", value: "5", tone: "amber" },
      { label: "Discharge Ready", value: "8", tone: "purple" }
    ],
    workflow: ["Admission", "Bed assign", "Care plan", "Transfer", "Discharge summary", "Final bill"],
    tabs: ["All", "Admitted", "Transfer", "Discharge Ready", "Critical"],
    panels: [
      {
        title: "Wards",
        tone: "teal",
        items: [
          "Medical ward: 18 of 24 occupied.",
          "Maternity: 7 of 10 occupied.",
          "ICU: 6 of 8 occupied.",
          "Surgery: 10 of 16 occupied."
        ]
      },
      {
        title: "Nursing Care",
        tone: "green",
        items: [
          "Vitals charting, intake-output, medication administration, fall risk, wound care, and shift handover notes.",
          "Discharge checklist includes physician signoff, pharmacy clearance, and final bill."
        ]
      }
    ],
    records: [
      { id: "ipd-1", title: "Dawit Mekonnen - ICU Bed 3", subtitle: "Post-surgery cardiac monitoring, transfer to medical ward under review.", status: "Critical", owner: "ICU Team", date: "2026-05-25", value: "ICU-3", details: ["Cardiac monitor", "Transfer request", "Insurance case"] },
      { id: "ipd-2", title: "Tesfaye Worku - Surgery Bed 12", subtitle: "Appendectomy recovery, discharge summary and final billing pending.", status: "Discharge Ready", owner: "Surgery Ward", date: "2026-05-24", value: "S-12", details: ["Pharmacy clearance", "Final bill"] },
      { id: "ipd-3", title: "Almaz Tesfaye - Medical Ward 8", subtitle: "Observation admission after fall, physiotherapy consult requested.", status: "Admitted", owner: "Ward Nurse", date: "2026-05-26", value: "MW-8", details: ["Fall risk", "X-ray linked"] }
    ]
  },
  staff: {
    title: "Doctors, Staff & Shifts",
    eyebrow: "Workforce",
    description: "Clinician profiles, departments, HR/payroll hooks, attendance, rota planning, role-based access, and staff performance.",
    icon: Users,
    color: "#8b5cf6",
    addLabel: "Add Staff Profile",
    recordNoun: "Staff Profile",
    stats: [
      { label: "Clinical Staff", value: "74", tone: "blue" },
      { label: "On Shift", value: "31", tone: "green" },
      { label: "Late Check-ins", value: "4", tone: "amber" },
      { label: "Open Roles", value: "6", tone: "purple" }
    ],
    workflow: ["Profile", "Credential", "Department", "Shift", "Attendance", "Payroll"],
    tabs: ["All", "Doctor", "Nurse", "Pharmacy", "Lab", "Admin"],
    panels: [
      {
        title: "User Roles",
        tone: "purple",
        items: [
          "Super Admin, Hospital Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician, Accountant, and Patient.",
          "Permissions can be scoped by branch, department, module, and patient data type.",
          "Privilege changes should be written to audit logs."
        ]
      },
      {
        title: "Departments",
        tone: "blue",
        items: [
          "Internal Medicine, Cardiology, OB/GYN, ICU, Surgery, Pharmacy, Laboratory, Radiology, Finance, and Administration.",
          "Shift templates include day, evening, night, on-call, and weekend coverage."
        ]
      }
    ],
    records: [
      { id: "stf-1", title: "Dr. Tigist Alemu", subtitle: "Internal Medicine consultant, chronic care clinic lead.", status: "Doctor", owner: "Medical", date: "Day shift", category: "Doctor", details: ["OPD", "NCD clinic", "Approver"] },
      { id: "stf-2", title: "Nurse Lensa Bekele", subtitle: "ICU nurse assigned to high dependency beds.", status: "Nurse", owner: "Nursing", date: "Night shift", category: "Nurse", details: ["ICU", "Medication admin"] },
      { id: "stf-3", title: "Birhanu Teka", subtitle: "Pharmacist with dispensing and controlled medicine permissions.", status: "Pharmacy", owner: "Pharmacy", date: "Evening shift", category: "Pharmacy", details: ["Dispensing", "Stock adjustment"] },
      { id: "stf-4", title: "Sara Dagne", subtitle: "Lab technician covering sample collection and biochemistry bench.", status: "Lab", owner: "Laboratory", date: "Day shift", category: "Lab", details: ["Samples", "Result entry"] }
    ]
  },
  diagnostics: {
    title: "Radiology, PACS & Diagnostics",
    eyebrow: "Imaging",
    description: "Radiology orders, modality queues, imaging reports, accession numbers, PACS links, and DiagnosticReport-ready results.",
    icon: Activity,
    color: "#06b6d4",
    addLabel: "Add Imaging Order",
    recordNoun: "Imaging Order",
    stats: [
      { label: "Imaging Orders", value: "27", tone: "blue" },
      { label: "Awaiting Report", value: "8", tone: "amber" },
      { label: "Final Reports", value: "16", tone: "green" },
      { label: "PACS Links", value: "21", tone: "purple" }
    ],
    workflow: ["Order", "Schedule", "Capture image", "Read", "Attach report", "Notify clinician"],
    tabs: ["All", "Scheduled", "Captured", "Reported", "STAT"],
    panels: [
      {
        title: "Interoperability Shape",
        tone: "teal",
        items: [
          "DiagnosticReport references Observations, ImagingStudy, performers, specimen when relevant, and attached PDFs/images.",
          "PACS integration is represented as accession links for now.",
          "LOINC/SNOMED style coding can be mapped later."
        ]
      }
    ],
    records: [
      { id: "rad-1", title: "XR-2026-0098 - Left Knee X-ray", subtitle: "Almaz Tesfaye, orthopedics request with final report attached.", status: "Reported", owner: "Radiology", date: "2026-05-24", category: "X-Ray", details: ["Accession RAD-0098", "PACS linked"] },
      { id: "rad-2", title: "US-2026-0032 - Obstetric ultrasound", subtitle: "Meron Hailu scheduled for OB/GYN scan.", status: "Scheduled", owner: "Sonographer", date: "2026-05-27", category: "Ultrasound", details: ["Pregnancy", "Report pending"] },
      { id: "rad-3", title: "CT-2026-0017 - Head CT", subtitle: "Emergency head trauma case, STAT reading requested.", status: "STAT", owner: "Radiologist", date: "2026-05-27", priority: "STAT", category: "CT", details: ["Emergency", "Critical alert"] }
    ]
  },
  insurance: {
    title: "Insurance Claims",
    eyebrow: "Revenue cycle",
    description: "Eligibility, pre-authorization, claim package, attachments, payer submission, rejection handling, and claim aging.",
    icon: ShieldCheck,
    color: "#2563eb",
    addLabel: "Create Claim",
    recordNoun: "Insurance Claim",
    stats: [
      { label: "Open Claims", value: "36", tone: "blue" },
      { label: "Preauth Pending", value: "7", tone: "amber" },
      { label: "Rejected", value: "5", tone: "red" },
      { label: "Clean Claim Rate", value: "84%", tone: "green" }
    ],
    workflow: ["Eligibility", "Preauth", "Clinical docs", "Claim submit", "Payer review", "Payment post"],
    tabs: ["All", "Preauth", "Submitted", "Rejected", "Paid"],
    chart: [
      { label: "Submitted", value: 76 },
      { label: "Approved", value: 64, color: "#10b981" },
      { label: "Rejected", value: 12, color: "#ef4444" },
      { label: "Paid", value: 58, color: "#2563eb" }
    ],
    panels: [
      {
        title: "Claim Package",
        tone: "blue",
        items: [
          "Patient demographics, diagnosis codes, services, medication, lab and radiology attachments.",
          "Tracks payer, member ID, approval number, submission date, and denial reason.",
          "Can later connect to national or private payer APIs."
        ]
      }
    ],
    records: [
      { id: "clm-1", title: "CLM-2026-0443 - Dawit Mekonnen", subtitle: "ICU admission claim pending payer review with cardiology notes attached.", status: "Submitted", owner: "Ethio-Life Health", date: "2026-05-26", value: "ETB 4,200", details: ["Preauth PA-1772", "Clinical attachment"] },
      { id: "clm-2", title: "CLM-2026-0447 - Solomon Kebede", subtitle: "Emergency COPD claim requires ABG result attachment before resubmission.", status: "Rejected", owner: "CBE Health Insurance", date: "2026-05-27", value: "ETB 2,800", priority: "High", details: ["Missing result", "Resubmit"] },
      { id: "clm-3", title: "CLM-2026-0421 - Maternity package", subtitle: "Preauthorization requested for planned procedure package.", status: "Preauth", owner: "Awash Insurance", date: "2026-05-28", value: "ETB 8,600", details: ["OB/GYN", "Awaiting payer"] }
    ]
  },
  inventory: {
    title: "Inventory & Procurement",
    eyebrow: "Supplies and assets",
    description: "Medical supplies, purchase orders, vendors, stock movement logs, assets, equipment, reorder points, and branch transfers.",
    icon: Boxes,
    color: "#f97316",
    addLabel: "Add Purchase Request",
    recordNoun: "Procurement Record",
    stats: [
      { label: "Stock Items", value: "438", tone: "blue" },
      { label: "POs Open", value: "18", tone: "amber" },
      { label: "Low Stock", value: "23", tone: "red" },
      { label: "Suppliers", value: "31", tone: "green" }
    ],
    workflow: ["Requisition", "Approval", "Purchase order", "Receive", "QC", "Stock issue", "Asset tag"],
    tabs: ["All", "Purchase Order", "Low Stock", "Received", "Asset"],
    panels: [
      {
        title: "Procurement Controls",
        tone: "amber",
        items: [
          "Vendor management, quotations, approvals, receiving notes, returns, and stock adjustments.",
          "Batch, lot, serial, warranty, and expiry controls are included in mock record details.",
          "Medical equipment can be converted to fixed assets after receipt."
        ]
      }
    ],
    records: [
      { id: "inv-1", title: "PO-2026-0081 - Lab reagents", subtitle: "Biochemistry reagents ordered from Medico Ethiopia.", status: "Purchase Order", owner: "Procurement", date: "2026-05-25", value: "ETB 86,000", details: ["Vendor: Medico", "Expected 2026-05-30"] },
      { id: "inv-2", title: "Surgical gloves - size M", subtitle: "Below reorder level in surgery store and emergency room.", status: "Low Stock", owner: "Main Store", date: "2026-05-27", value: "72 boxes", priority: "High", details: ["Reorder at 150", "2 branches"] },
      { id: "inv-3", title: "Patient monitor PM-17", subtitle: "Received and tagged for ICU asset register.", status: "Asset", owner: "Biomedical", date: "2026-05-24", value: "ETB 210,000", details: ["Serial PM17-889", "Warranty 24 months"] }
    ]
  },
  emergencyTheatre: {
    title: "Emergency & Surgery",
    eyebrow: "Acute care",
    description: "Emergency department cases, acuity, theatre scheduling, operation notes, anesthesia checklist, consent, and post-op handoff.",
    icon: HeartPulse,
    color: "#ef4444",
    addLabel: "Add Acute Case",
    recordNoun: "Acute Care Case",
    stats: [
      { label: "ER Cases Today", value: "22", tone: "red" },
      { label: "In Resus", value: "3", tone: "amber" },
      { label: "Theatre Cases", value: "9", tone: "blue" },
      { label: "Post-op", value: "6", tone: "green" }
    ],
    workflow: ["Triage", "Resus", "Orders", "Consent", "Theatre", "Recovery", "Ward handoff"],
    tabs: ["All", "Emergency", "Surgery", "Recovery", "Critical"],
    panels: [
      {
        title: "Safety Checklist",
        tone: "red",
        items: [
          "Consent, allergy check, surgical site, anesthesia review, blood availability, and equipment readiness.",
          "Emergency cases can bypass appointment queue and create STAT lab/radiology orders."
        ]
      }
    ],
    records: [
      { id: "er-1", title: "ER-2026-017 - Head trauma", subtitle: "Resuscitation bay 1, CT head and CBC ordered.", status: "Critical", owner: "ER Team", date: "2026-05-27 11:05", priority: "STAT", category: "Emergency", details: ["GCS 12", "CT ordered", "Family contacted"] },
      { id: "er-2", title: "OT-2026-024 - Appendectomy", subtitle: "Scheduled surgery with anesthesia checklist complete.", status: "Surgery", owner: "Dr. Yonas Bekele", date: "2026-05-27 14:00", category: "Surgery", details: ["Consent signed", "Theatre 2"] },
      { id: "er-3", title: "PACU-2026-011 - Post-op recovery", subtitle: "Stable in recovery, transfer to surgery ward planned.", status: "Recovery", owner: "PACU Nurse", date: "2026-05-27", category: "Recovery", details: ["Pain score 3", "Vitals stable"] }
    ]
  },
  bloodBank: {
    title: "Blood Bank",
    eyebrow: "Transfusion services",
    description: "Donor database, blood bag inventory, screening, component tracking, cross-match, transfusion requests, and expiry control.",
    icon: Activity,
    color: "#dc2626",
    addLabel: "Add Blood Unit",
    recordNoun: "Blood Bank Record",
    stats: [
      { label: "Units Available", value: "126", tone: "green" },
      { label: "Cross-matches", value: "11", tone: "blue" },
      { label: "Expiring Soon", value: "14", tone: "amber" },
      { label: "Critical Type", value: "O-", tone: "red" }
    ],
    workflow: ["Donor", "Screen", "Collect", "Component", "Cross-match", "Issue", "Transfusion note"],
    tabs: ["All", "Available", "Cross-match", "Reserved", "Expiring"],
    panels: [
      {
        title: "Traceability",
        tone: "red",
        items: [
          "Every unit tracks donor, blood group, component, screening status, storage location, recipient, and issue time.",
          "Cross-match links to admission, theatre, emergency, and billing records."
        ]
      }
    ],
    records: [
      { id: "bb-1", title: "BB-Aplus-2091 - Packed RBC", subtitle: "A+ unit available in blood bank refrigerator 2.", status: "Available", owner: "Blood Bank", date: "Exp 2026-06-04", value: "A+", details: ["Screened", "Packed RBC"] },
      { id: "bb-2", title: "Cross-match - Dawit Mekonnen", subtitle: "Two O+ units reserved for cardiac procedure support.", status: "Reserved", owner: "Theatre", date: "2026-05-27", value: "2 units", details: ["O+", "Procedure"] },
      { id: "bb-3", title: "Platelets PLT-044", subtitle: "Platelet unit near expiry and flagged for prioritized use.", status: "Expiring", owner: "Blood Bank", date: "Exp 2026-05-28", value: "AB+", priority: "High", details: ["Component", "Expiry alert"] }
    ]
  },
  referrals: {
    title: "Referrals & Ambulance",
    eyebrow: "Care coordination",
    description: "Internal and external referrals, ambulance dispatch, transfer notes, receiving facility communication, and follow-up tracking.",
    icon: Truck,
    color: "#0f766e",
    addLabel: "Create Referral",
    recordNoun: "Referral",
    stats: [
      { label: "Open Referrals", value: "13", tone: "blue" },
      { label: "Ambulances Out", value: "2", tone: "amber" },
      { label: "Accepted", value: "9", tone: "green" },
      { label: "Delayed", value: "3", tone: "red" }
    ],
    workflow: ["Referral note", "Accept facility", "Ambulance", "Transfer docs", "Receive", "Follow-up"],
    tabs: ["All", "Internal", "External", "Ambulance", "Accepted"],
    panels: [
      {
        title: "Transfer Pack",
        tone: "teal",
        items: [
          "Referral reason, diagnosis, vitals, treatment given, lab/radiology reports, medication list, and contact details.",
          "Ambulance log tracks driver, vehicle, dispatch time, destination, oxygen, and escort nurse."
        ]
      }
    ],
    records: [
      { id: "ref-1", title: "REF-2026-031 - Oncology referral", subtitle: "Bereket Assefa referred to oncology center with CBC and smear attached.", status: "External", owner: "Dr. Yonas Bekele", date: "2026-05-26", category: "External", details: ["Receiving: Black Lion", "Reports attached"] },
      { id: "ref-2", title: "AMB-02 - ICU transfer", subtitle: "Ambulance dispatched for ICU referral, oxygen and monitor required.", status: "Ambulance", owner: "Dispatch", date: "2026-05-27 10:40", priority: "High", details: ["Vehicle A-02", "Nurse escort"] },
      { id: "ref-3", title: "Internal referral - Nephrology", subtitle: "Sara Mulugeta referred from OPD to nephrology clinic.", status: "Accepted", owner: "Nephrology", date: "2026-05-27", category: "Internal", details: ["CKD follow-up", "Appointment booked"] }
    ]
  },
  equipment: {
    title: "Equipment & Maintenance",
    eyebrow: "Biomedical assets",
    description: "Medical equipment registry, calibration schedules, preventive maintenance, breakdown tickets, spare parts, and service contracts.",
    icon: Wrench,
    color: "#64748b",
    addLabel: "Add Service Ticket",
    recordNoun: "Maintenance Ticket",
    stats: [
      { label: "Assets", value: "214", tone: "blue" },
      { label: "Due Calibration", value: "16", tone: "amber" },
      { label: "Down", value: "5", tone: "red" },
      { label: "PM Complete", value: "92%", tone: "green" }
    ],
    workflow: ["Asset tag", "Location", "Calibration", "Preventive maintenance", "Breakdown", "Service report"],
    tabs: ["All", "Preventive", "Calibration", "Breakdown", "Operational"],
    panels: [
      {
        title: "Asset Controls",
        tone: "slate",
        items: [
          "Serial number, model, ward, warranty, service vendor, calibration date, and risk class.",
          "High-risk equipment like ventilators, monitors, analyzers, and autoclaves have tighter schedules."
        ]
      }
    ],
    records: [
      { id: "eq-1", title: "Ventilator VNT-04", subtitle: "Preventive maintenance completed, next calibration due in 30 days.", status: "Operational", owner: "Biomedical", date: "2026-05-22", category: "Preventive", details: ["ICU", "High risk"] },
      { id: "eq-2", title: "Chemistry analyzer CA-02", subtitle: "Reagent probe fault reported by lab team.", status: "Breakdown", owner: "Lab", date: "2026-05-27", priority: "High", details: ["Vendor called", "Ticket open"] },
      { id: "eq-3", title: "Autoclave AC-01", subtitle: "Calibration due this week before theatre sterilization audit.", status: "Calibration", owner: "CSSD", date: "2026-05-29", details: ["CSSD", "Audit item"] }
    ]
  },
  reports: {
    title: "Reports, Analytics & EHMIS",
    eyebrow: "Reporting",
    description: "Revenue, patient statistics, appointment analytics, inventory reports, staff performance, clinical indicators, and EHMIS/DHIS2 export.",
    icon: BarChart3,
    color: "#f59e0b",
    addLabel: "Create Report",
    recordNoun: "Report",
    stats: [
      { label: "Dashboards", value: "14", tone: "blue" },
      { label: "Exports Ready", value: "6", tone: "green" },
      { label: "Data Quality Flags", value: "11", tone: "amber" },
      { label: "Late Reports", value: "2", tone: "red" }
    ],
    workflow: ["Collect", "Validate", "Aggregate", "Review", "Export", "Submit"],
    tabs: ["All", "Finance", "Clinical", "Inventory", "EHMIS"],
    chart: [
      { label: "Revenue target", value: 88, color: "#2563eb" },
      { label: "OPD volume", value: 73, color: "#10b981" },
      { label: "Inventory accuracy", value: 91, color: "#f97316" },
      { label: "Report completeness", value: 96, color: "#8b5cf6" }
    ],
    panels: [
      {
        title: "EHMIS / DHIS2 Pack",
        tone: "amber",
        items: [
          "Routine service reports, disease surveillance, maternal health, lab reception, custom data set reports, and import/export queue.",
          "Mock validation checks completeness, timeliness, duplicate MRNs, missing diagnosis, and branch totals.",
          "Supports facility, branch, department, and period filters."
        ]
      },
      {
        title: "Analytics",
        tone: "blue",
        items: [
          "Revenue dashboard, patient statistics, appointment no-show rate, bed occupancy, pharmacy stock risk, lab turnaround, and staff performance.",
          "Clinical outcome dashboards can be added by program: NCD, MCH/ANC, HIV, TB, malaria, emergency, surgery."
        ]
      }
    ],
    records: [
      { id: "rep-1", title: "Daily revenue dashboard", subtitle: "Billing, pharmacy, lab, consultation, and insurance balances by branch.", status: "Finance", owner: "Accountant", date: "2026-05-27", value: "ETB 128k", category: "Finance", details: ["Revenue", "Collections", "Outstanding"] },
      { id: "rep-2", title: "EHMIS weekly service report", subtitle: "Routine indicators staged for HIS officer review before export.", status: "EHMIS", owner: "HIS Officer", date: "2026-W22", category: "EHMIS", details: ["Completeness 96%", "DHIS2 export"] },
      { id: "rep-3", title: "Pharmacy expiry risk report", subtitle: "Medicine batches expiring in 60 days with stock value exposure.", status: "Inventory", owner: "Pharmacist", date: "2026-05-27", value: "ETB 34k", category: "Inventory", details: ["Batch", "Expiry", "Supplier"] }
    ]
  },
  compliance: {
    title: "Security & Compliance",
    eyebrow: "Trust and controls",
    description: "Authentication, authorization, role-based permissions, patient-level audit logs, encryption status, consent, backups, recovery, and tamper-evident audit design.",
    icon: LockKeyhole,
    color: "#334155",
    addLabel: "Add Control",
    recordNoun: "Control",
    stats: [
      { label: "Audit Events", value: "1,284", tone: "blue" },
      { label: "High Risk Access", value: "4", tone: "red" },
      { label: "Backups Healthy", value: "99.9%", tone: "green" },
      { label: "Open Controls", value: "8", tone: "amber" }
    ],
    workflow: ["Identify user", "Authorize role", "Access PHI", "Record audit", "Monitor risk", "Backup and recover"],
    tabs: ["All", "Access", "Audit", "Backup", "Privacy"],
    panels: [
      {
        title: "Baseline Safeguards",
        tone: "slate",
        items: [
          "Unique user accounts, role-based access, emergency access procedure, automatic logoff, encryption status, and transmission security.",
          "Audit controls should record patient record access, privilege changes, exports, deletions, and failed logins.",
          "Tamper resistance can use append-only records and hash checks when backend storage arrives."
        ]
      },
      {
        title: "Privacy Operations",
        tone: "purple",
        items: [
          "Consent tracking, release of information, minimum necessary access, patient portal access history, and breach review workflow.",
          "Backup and recovery status is surfaced as mock operational evidence."
        ]
      }
    ],
    records: [
      { id: "sec-1", title: "Patient chart access audit", subtitle: "Drilldown for who viewed MRN-00126 medication list and ICU notes.", status: "Audit", owner: "Compliance Officer", date: "2026-05-27", category: "Audit", details: ["Patient-level log", "Exportable"] },
      { id: "sec-2", title: "Privilege change review", subtitle: "New pharmacist dispensing permission requires manager approval.", status: "Access", owner: "Hospital Admin", date: "2026-05-26", priority: "Medium", category: "Access", details: ["RBAC", "Approval"] },
      { id: "sec-3", title: "Nightly encrypted backup", subtitle: "Backup completed and recovery test scheduled for the weekend.", status: "Backup", owner: "IT Admin", date: "2026-05-27 02:00", category: "Backup", details: ["Encrypted", "Recovery test"] }
    ]
  },
  portalNotifications: {
    title: "Patient Portal & Notifications",
    eyebrow: "Patient access",
    description: "Online booking, appointment reminders, lab/radiology result notifications, invoices, bill payments, secure messages, and patient record access.",
    icon: Bell,
    color: "#ec4899",
    addLabel: "Add Message",
    recordNoun: "Notification",
    stats: [
      { label: "Portal Users", value: "1,240", tone: "blue" },
      { label: "Reminders Sent", value: "312", tone: "green" },
      { label: "Unread Results", value: "19", tone: "amber" },
      { label: "Failed SMS", value: "6", tone: "red" }
    ],
    workflow: ["Patient account", "Book", "Remind", "Publish result", "Pay bill", "Secure message"],
    tabs: ["All", "SMS", "Email", "Portal", "Failed"],
    panels: [
      {
        title: "Patient Role",
        tone: "blue",
        items: [
          "Patients can view appointments, visit summaries, prescriptions, lab reports, invoices, and payment history.",
          "Secure access history should be logged in the compliance module.",
          "Supports SMS, email, WhatsApp/Telegram style channels as mock settings."
        ]
      }
    ],
    records: [
      { id: "msg-1", title: "Appointment reminder - Selam Tadesse", subtitle: "Cardiology follow-up reminder scheduled for 24 hours before visit.", status: "SMS", owner: "Notification Service", date: "2026-05-28", category: "SMS", details: ["Appointment", "Cardiology"] },
      { id: "msg-2", title: "Lab result ready - Sara Mulugeta", subtitle: "Portal notification queued after clinician review.", status: "Portal", owner: "Lab", date: "2026-05-27", category: "Portal", details: ["Result Ready", "Nephrology"] },
      { id: "msg-3", title: "Invoice payment link failed", subtitle: "Telebirr payment link SMS failed and needs retry.", status: "Failed", owner: "Billing", date: "2026-05-27", priority: "Medium", category: "Failed", details: ["Telebirr", "Retry"] }
    ]
  },
  integrations: {
    title: "Integrations & Technical Readiness",
    eyebrow: "Platform",
    description: "Mock readiness board for FHIR/HL7, DHIS2/eHMIS, PACS, file uploads, WebSockets, Swagger, Docker, REST APIs, JWT, and multi-branch support.",
    icon: Link2,
    color: "#2563eb",
    addLabel: "Add Integration",
    recordNoun: "Integration",
    stats: [
      { label: "Mock APIs", value: "38", tone: "blue" },
      { label: "FHIR Mappings", value: "12", tone: "green" },
      { label: "External Feeds", value: "7", tone: "purple" },
      { label: "Blocked", value: "3", tone: "amber" }
    ],
    workflow: ["Map entity", "Validate payload", "Queue sync", "Transmit", "Audit", "Reconcile"],
    tabs: ["All", "FHIR", "EHMIS", "PACS", "System"],
    panels: [
      {
        title: "FHIR / HL7 Objects",
        tone: "blue",
        items: [
          "Patient, Practitioner, Encounter, Appointment, Observation, MedicationRequest, MedicationDispense, DiagnosticReport, ImagingStudy, Claim, DocumentReference, AuditEvent, and Provenance.",
          "HL7 v2 style lab/radiology messages can be mapped later for equipment and LIS/RIS integration."
        ]
      },
      {
        title: "Technical Requirements",
        tone: "green",
        items: [
          "Frontend: Next.js, TypeScript, responsive admin dashboard, dark/light mode, accessible controls.",
          "Backend target: Node.js with Express or NestJS, PostgreSQL, REST API, JWT, modular architecture.",
          "Operational add-ons: multi-branch, multi-user, notifications, file upload, WebSockets, Docker, Swagger API docs."
        ]
      },
      {
        title: "Suggested Entities",
        tone: "purple",
        items: [
          "Users, Patients, Doctors, Appointments, Admissions, Encounters, Prescriptions, Medicines, MedicineBatches, LabTests, LabSamples, DiagnosticReports.",
          "Invoices, Payments, InsuranceClaims, Departments, Beds, InventoryItems, StockMovements, Suppliers, AuditEvents, Documents, Branches."
        ]
      }
    ],
    records: [
      { id: "int-1", title: "FHIR MedicationRequest mapping", subtitle: "Prescription lines mapped to medication request, dispense, and administration concepts.", status: "FHIR", owner: "Interoperability", date: "Mock ready", category: "FHIR", details: ["MedicationRequest", "MedicationDispense"] },
      { id: "int-2", title: "DHIS2/eHMIS routine report export", subtitle: "Aggregate indicators staged from clinical and billing mock records.", status: "EHMIS", owner: "HIS Officer", date: "Mock ready", category: "EHMIS", details: ["Routine data", "Validation"] },
      { id: "int-3", title: "PACS accession link", subtitle: "Radiology mock records hold accession IDs and image-study references.", status: "PACS", owner: "Radiology", date: "Mock ready", category: "PACS", details: ["ImagingStudy", "DiagnosticReport"] },
      { id: "int-4", title: "Swagger and Docker readiness", subtitle: "Tracked here as implementation checklist until backend routes exist.", status: "System", owner: "Engineering", date: "Planned", category: "System", details: ["Swagger", "Docker", "REST"] }
    ]
  }
};

export function HealthcareOverview() {
  return <HealthcareMockModule definition={modules.overview} />;
}

export function ClinicalRecords() {
  return <HealthcareMockModule definition={modules.records} />;
}

export function QueueOpd() {
  return <HealthcareMockModule definition={modules.queueOpd} />;
}

export function Inpatient() {
  return <HealthcareMockModule definition={modules.inpatient} />;
}

export function DoctorsStaff() {
  return <HealthcareMockModule definition={modules.staff} />;
}

export function Diagnostics() {
  return <HealthcareMockModule definition={modules.diagnostics} />;
}

export function InsuranceClaims() {
  return <HealthcareMockModule definition={modules.insurance} />;
}

export function InventoryProcurement() {
  return <HealthcareMockModule definition={modules.inventory} />;
}

export function EmergencyTheatre() {
  return <HealthcareMockModule definition={modules.emergencyTheatre} />;
}

export function BloodBank() {
  return <HealthcareMockModule definition={modules.bloodBank} />;
}

export function ReferralsAmbulance() {
  return <HealthcareMockModule definition={modules.referrals} />;
}

export function EquipmentMaintenance() {
  return <HealthcareMockModule definition={modules.equipment} />;
}

export function ReportsEHMIS() {
  return <HealthcareMockModule definition={modules.reports} />;
}

export function SecurityCompliance() {
  return <HealthcareMockModule definition={modules.compliance} />;
}

export function PatientPortalNotifications() {
  return <HealthcareMockModule definition={modules.portalNotifications} />;
}

export function IntegrationsReadiness() {
  return <HealthcareMockModule definition={modules.integrations} />;
}
