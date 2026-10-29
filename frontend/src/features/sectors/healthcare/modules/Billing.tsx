"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Pager } from "@/components/ui/Pager";
import { paginate } from "@/features/erp/helpers";
import { mockBills, STATUS_COLORS, type HealthBill, type BillStatus } from "../data";
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

const PAYMENT_METHODS = ["Cash", "Telebirr", "CBE Birr", "Bank Transfer", "Amole"];
const INSURANCE_PROVIDERS = ["Ethio-Life Health", "CBE Health Insurance", "Nyala Insurance", "Awash Insurance", "EIC Health"];
const COMMON_SERVICES = ["Consultation", "OB/GYN Consultation", "Emergency Consultation", "Lab (HbA1c)", "Lab (CBC)", "Lab (Lipid Panel)", "Ultrasound", "X-Ray", "ECG", "ICU Admission", "Pharmacy - Medication", "Nebulization", "Dressing / Wound Care", "IV Therapy"];

export function Billing() {
  const c = useColors();
  const [bills, setBills] = useState<HealthBill[]>(mockBills);
  const [statusFilter, setStatusFilter] = useState<BillStatus | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [payModal, setPayModal] = useState<HealthBill | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0]);
  const [form, setForm] = useState({ patientName: "", mrn: "", services: [] as string[], isInsurance: false, insuranceProvider: INSURANCE_PROVIDERS[0], totalAmount: "" });

  const filtered = bills.filter((b) => {
    const term = search.toLowerCase();
    return (
      (!statusFilter || b.status === statusFilter) &&
      (!term || b.patientName.toLowerCase().includes(term) || b.billNumber.toLowerCase().includes(term))
    );
  });

  const paged = paginate(filtered, page);

  const totalBilled     = bills.reduce((s, b) => s + b.totalAmount, 0);
  const totalCollected  = bills.reduce((s, b) => s + b.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const insurancePending = bills.filter((b) => b.status === "Insurance").reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);

  const kpis = [
    { label: "Total Billed",       value: `ETB ${totalBilled.toLocaleString()}`,       color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-file-invoice" },
    { label: "Collected",          value: `ETB ${totalCollected.toLocaleString()}`,     color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-circle-check" },
    { label: "Outstanding",        value: `ETB ${totalOutstanding.toLocaleString()}`,   color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-clock" },
    { label: "Insurance Pending",  value: `ETB ${insurancePending.toLocaleString()}`,   color: "#8b5cf6", bg: c.dark ? "#110b24" : "#f5f3ff", bdr: c.dark ? "#241852" : "#ddd6fe", icon: "fa-solid fa-shield-halved" },
  ];

  const handlePay = () => {
    if (!payModal || !payAmount) return;
    const amount = Number(payAmount);
    setBills((prev) => prev.map((b) => {
      if (b.id !== payModal.id) return b;
      const newPaid = Math.min(b.paidAmount + amount, b.totalAmount);
      return { ...b, paidAmount: newPaid, paymentMethod: payMethod, status: newPaid >= b.totalAmount ? "Paid" : "Partial" };
    }));
    setPayModal(null);
    setPayAmount("");
  };

  const handleAdd = () => {
    if (!form.patientName || form.services.length === 0 || !form.totalAmount) return;
    const next: HealthBill = {
      id: `b-${Date.now()}`,
      billNumber: `BILL-2026-${String(Math.floor(451 + Math.random() * 100)).padStart(4, "0")}`,
      patientName: form.patientName,
      mrn: form.mrn,
      date: new Date().toISOString().slice(0, 10),
      services: form.services,
      totalAmount: Number(form.totalAmount),
      paidAmount: 0,
      status: form.isInsurance ? "Insurance" : "Pending",
      insuranceProvider: form.isInsurance ? form.insuranceProvider : undefined,
    };
    setBills((prev) => [next, ...prev]);
    setForm({ patientName: "", mrn: "", services: [], isInsurance: false, insuranceProvider: INSURANCE_PROVIDERS[0], totalAmount: "" });
    setShowModal(false);
  };

  const toggleService = (s: string) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
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
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Billing</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> Create Bill
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
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search patient, bill number…"
            style={{ ...inp, paddingLeft: 30 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as BillStatus | ""); setPage(1); }} style={{ ...inp, width: "auto", minWidth: 140 }}>
          <option value="">All statuses</option>
          {(["Pending", "Partial", "Paid", "Insurance", "Waived"] as BillStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setSearch(""); setStatusFilter(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
      </div>

      {/* Bill list */}
      {paged.items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: c.muted, fontSize: 13 }}>No bills found.</div>
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {paged.items.map((b, i) => {
            const isLast = i === paged.items.length - 1;
            const balance = b.totalAmount - b.paidAmount;
            const statusColor = STATUS_COLORS[b.status] as string;
            return (
              <div
                key={b.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, transition: "background 0.12s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{b.billNumber}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{b.patientName}</span>
                    {b.mrn && <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{b.mrn}</span>}
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: `${statusColor}18`, color: statusColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>{b.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{b.services.join(" · ")} · {b.date}</div>
                  {b.insuranceProvider && <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>Insurance: {b.insuranceProvider}</div>}
                  <div style={{ display: "flex", gap: 14, marginTop: 5, fontSize: 12 }}>
                    <span style={{ color: c.ink }}>Total: <strong>ETB {b.totalAmount.toLocaleString()}</strong></span>
                    <span style={{ color: "#10b981" }}>Paid: ETB {b.paidAmount.toLocaleString()}</span>
                    {balance > 0 && <span style={{ color: "#f43f5e" }}>Balance: ETB {balance.toLocaleString()}</span>}
                  </div>
                </div>
                {b.status !== "Paid" && b.status !== "Waived" && b.status !== "Insurance" && (
                  <button type="button" onClick={() => { setPayModal(b); setPayAmount(String(b.totalAmount - b.paidAmount)); }} style={{ height: 30, padding: "0 11px", borderRadius: 7, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                    Record Payment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pager page={paged.page} totalPages={paged.totalPages} total={filtered.length} onPage={setPage} />

      {/* Payment modal */}
      <Modal title="Record Payment" isOpen={!!payModal} onClose={() => setPayModal(null)}>
        {payModal && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: c.alt, border: `1px solid ${c.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{payModal.billNumber} — {payModal.patientName}</div>
              <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>Outstanding: ETB {(payModal.totalAmount - payModal.paidAmount).toLocaleString()}</div>
            </div>
            <label style={lbl(c)}>Amount Received (ETB) *<input type="number" min="0" style={{ height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`, background: c.alt, padding: "0 10px", color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} /></label>
            <label style={lbl(c)}>Payment Method<select style={{ height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`, background: c.alt, padding: "0 10px", color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>{PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={() => setPayModal(null)} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button type="button" onClick={handlePay} style={{ height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Confirm Payment</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create bill modal */}
      <Modal title="Create Bill" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Patient Name *<input style={inp} value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} placeholder="Full name" /></label>
            <label style={lbl(c)}>MRN<input style={inp} value={form.mrn} onChange={(e) => setForm((f) => ({ ...f, mrn: e.target.value }))} placeholder="MRN-XXXXX" /></label>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 8 }}>Services (select all that apply)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {COMMON_SERVICES.map((s) => {
                const selected = form.services.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleService(s)} style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    border: `1px solid ${selected ? "#2563eb" : c.border}`,
                    background: selected ? "#2563eb" : c.surface,
                    color: selected ? "#fff" : c.muted,
                  }}>{s}</button>
                );
              })}
            </div>
          </div>
          <label style={lbl(c)}>Total Amount (ETB) *<input type="number" min="0" style={inp} value={form.totalAmount} onChange={(e) => setForm((f) => ({ ...f, totalAmount: e.target.value }))} /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: c.ink, cursor: "pointer" }}>
            <input type="checkbox" checked={form.isInsurance} onChange={(e) => setForm((f) => ({ ...f, isInsurance: e.target.checked }))} />
            Insurance Claim
          </label>
          {form.isInsurance && (
            <label style={lbl(c)}>Insurance Provider<select style={inp} value={form.insuranceProvider} onChange={(e) => setForm((f) => ({ ...f, insuranceProvider: e.target.value }))}>{INSURANCE_PROVIDERS.map((p) => <option key={p}>{p}</option>)}</select></label>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="button" onClick={handleAdd} style={{ height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Create Bill</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function lbl(c: ReturnType<typeof useColors>) {
  return { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 600, color: c.muted };
}
