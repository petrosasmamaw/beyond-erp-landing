"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FileText, Plus, Users } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { ChartAccount, Employee, ExpenseApproval, FinanceSummary, Invoice, PayrollRun, Sector } from "@/lib/types";
import { queueOperation } from "../offline";
import { useTheme } from "@/contexts/ThemeContext";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return { dark, surface: dark ? "#111827" : "#ffffff", alt: dark ? "#0d1828" : "#f8fafc", border: dark ? "#1a2d3d" : "#e8edf5", ink: dark ? "#e2e8f0" : "#0f172a", muted: dark ? "#566070" : "#64748b" };
}

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "#94a3b8", SENT: "#2563eb", PAID: "#10b981", OVERDUE: "#f43f5e", CANCELLED: "#64748b",
  REQUESTED: "#f59e0b", APPROVED: "#10b981", REJECTED: "#f43f5e",
};

export function FinanceView({ sectors, employees, showToast }: { sectors: Sector[]; employees: Employee[]; showToast: (m: string) => void }) {
  const c = useColors();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [approvals, setApprovals] = useState<ExpenseApproval[]>([]);
  const [accounts, setAccounts] = useState<ChartAccount[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [tab, setTab] = useState<"invoices" | "approvals" | "payroll" | "accounts">("invoices");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ customerName: "", customerPhone: "", sectorId: "", description: "Professional services", quantity: 1, unitPrice: 0 });
  const [approvalForm, setApprovalForm] = useState({ title: "", amount: 0, category: "", sectorId: "", notes: "" });

  const load = useCallback(async () => {
    const [s, inv, apr, acc, pay] = await Promise.all([api.financeSummary(), api.invoices(), api.expenseApprovals(), api.chartAccounts(), api.payrollRuns()]);
    setSummary(s); setInvoices(inv.items); setApprovals(apr.items); setAccounts(acc); setPayrollRuns(pay.items);
  }, []);

  useEffect(() => { load().catch((e) => showToast(e instanceof Error ? e.message : "Finance failed")); }, [load, showToast]);

  const createInvoice = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { customerName: invoiceForm.customerName, customerPhone: invoiceForm.customerPhone, sectorId: invoiceForm.sectorId || null, items: [{ description: invoiceForm.description, quantity: Number(invoiceForm.quantity), unitPrice: Number(invoiceForm.unitPrice) }], status: "SENT" };
    if (!navigator.onLine) { queueOperation({ action: "CREATE_INVOICE", label: "Invoice", payload }); showToast("Invoice queued offline"); return; }
    await api.createInvoice(payload);
    setInvoiceForm((f) => ({ ...f, customerName: "", customerPhone: "", unitPrice: 0 }));
    setShowInvoiceForm(false); showToast("Invoice created"); await load();
  };

  const createApproval = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { title: approvalForm.title, amount: Number(approvalForm.amount), category: approvalForm.category, sectorId: approvalForm.sectorId || null, notes: approvalForm.notes };
    if (!navigator.onLine) { queueOperation({ action: "CREATE_EXPENSE_APPROVAL", label: "Expense approval", payload }); showToast("Approval queued offline"); return; }
    await api.createExpenseApproval(payload);
    setApprovalForm({ title: "", amount: 0, category: "", sectorId: "", notes: "" });
    setShowApprovalForm(false); showToast("Approval requested"); await load();
  };

  const runPayroll = async () => {
    if (employees.length === 0) { showToast("Add employees first"); return; }
    const period = new Date().toISOString().slice(0, 7);
    await api.createPayrollRun({ period, status: "APPROVED", items: employees.map((emp) => ({ employeeId: emp.id, employeeName: emp.fullName, grossPay: emp.salary, deductions: Math.round(emp.salary * 0.075) })) });
    showToast("Payroll run created"); await load();
  };

  const approvalAction = async (a: ExpenseApproval, action: "approve" | "reject" | "pay") => {
    await api.approvalAction(a.id, action); showToast(`Approval ${action}d`); await load();
  };

  const kpis = [
    { label: "P&L Revenue",  value: formatCurrency(summary?.profitLoss.revenue ?? 0),  color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-arrow-trend-up" },
    { label: "P&L Expenses", value: formatCurrency(summary?.profitLoss.expenses ?? 0), color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-receipt" },
    { label: "Net Cash",     value: formatCurrency(summary?.cashFlow.netCash ?? 0),    color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-wallet" },
    { label: "Invoiced",     value: formatCurrency(summary?.profitLoss.invoiced ?? 0), color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-file-invoice" },
  ];

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({ height: 38, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`, background: c.alt, padding: "0 12px", color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box", ...extra });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Business</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Finance</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowInvoiceForm((v) => !v)} style={btn("#2563eb")}>
            <FileText size={13} /> New Invoice
          </button>
          <button onClick={() => setShowApprovalForm((v) => !v)} style={btn(c.dark ? "#1e3a5f" : "#eff6ff", c.dark ? "#60a5fa" : "#2563eb", true, c)}>
            <Plus size={13} /> Request Approval
          </button>
          <button onClick={() => void runPayroll()} style={btn(c.dark ? "#1a3a28" : "#f0fdf4", "#10b981", true, c)}>
            <Users size={13} /> Run Payroll
          </button>
        </div>
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

      {/* Inline forms */}
      {showInvoiceForm && (
        <form onSubmit={createInvoice} style={{ padding: "18px 20px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong style={{ fontSize: 15, color: c.ink }}>Create Invoice</strong>
            <button type="button" onClick={() => setShowInvoiceForm(false)} style={{ background: "none", border: "none", color: c.muted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
          <input value={invoiceForm.customerName} onChange={(e) => setInvoiceForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="Customer name *" required style={inp()} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={invoiceForm.description} onChange={(e) => setInvoiceForm((f) => ({ ...f, description: e.target.value }))} placeholder="Line item" required style={inp()} />
            <input type="number" min="1" value={invoiceForm.unitPrice || ""} onChange={(e) => setInvoiceForm((f) => ({ ...f, unitPrice: Number(e.target.value) }))} placeholder="Unit price" required style={inp()} />
          </div>
          <select value={invoiceForm.sectorId} onChange={(e) => setInvoiceForm((f) => ({ ...f, sectorId: e.target.value }))} style={inp()}>
            <option value="">No sector</option>
            {sectors.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
          </select>
          <button type="submit" style={btn("#2563eb")}><FileText size={13} /> Create Invoice</button>
        </form>
      )}

      {showApprovalForm && (
        <form onSubmit={createApproval} style={{ padding: "18px 20px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong style={{ fontSize: 15, color: c.ink }}>Request Expense Approval</strong>
            <button type="button" onClick={() => setShowApprovalForm(false)} style={{ background: "none", border: "none", color: c.muted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
          <input value={approvalForm.title} onChange={(e) => setApprovalForm((f) => ({ ...f, title: e.target.value }))} placeholder="Expense title *" required style={inp()} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={approvalForm.category} onChange={(e) => setApprovalForm((f) => ({ ...f, category: e.target.value }))} placeholder="Category *" required style={inp()} />
            <input type="number" min="1" value={approvalForm.amount || ""} onChange={(e) => setApprovalForm((f) => ({ ...f, amount: Number(e.target.value) }))} placeholder="Amount *" required style={inp()} />
          </div>
          <button type="submit" style={btn("#7c3aed")}>Submit Approval</button>
        </form>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {(["invoices", "approvals", "payroll", "accounts"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 13px", borderRadius: 6, border: `1px solid ${tab === t ? "#2563eb" : c.border}`, background: tab === t ? "#2563eb18" : c.surface, color: tab === t ? "#2563eb" : c.muted, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
        {tab === "invoices" && (
          invoices.length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: c.muted, fontSize: 13 }}>No invoices yet</div>
            : invoices.map((inv, i) => (
              <div key={inv.id} style={row(c, i === invoices.length - 1)}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{inv.invoiceNumber}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{inv.customerName}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{formatCurrency(inv.total)}</div>
                <StatusBadge status={inv.status} />
              </div>
            ))
        )}
        {tab === "approvals" && (
          approvals.length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: c.muted, fontSize: 13 }}>No approvals yet</div>
            : approvals.map((a, i) => (
              <div key={a.id} style={{ ...row(c, i === approvals.length - 1), gridTemplateColumns: "1fr auto auto auto auto" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{a.category}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{formatCurrency(a.amount)}</div>
                <StatusBadge status={a.status} />
                {a.status === "REQUESTED" && <>
                  <SmallBtn label="Approve" color="#10b981" onClick={() => void approvalAction(a, "approve")} />
                  <SmallBtn label="Reject" color="#f43f5e" onClick={() => void approvalAction(a, "reject")} />
                </>}
                {a.status === "APPROVED" && <SmallBtn label="Pay" color="#2563eb" onClick={() => void approvalAction(a, "pay")} />}
              </div>
            ))
        )}
        {tab === "payroll" && (
          payrollRuns.length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: c.muted, fontSize: 13 }}>No payroll runs yet</div>
            : payrollRuns.map((p, i) => (
              <div key={p.id} style={row(c, i === payrollRuns.length - 1)}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{p.period}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{p.items.length} employees</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{formatCurrency(p.netPay)}</div>
                <StatusBadge status={p.status} />
              </div>
            ))
        )}
        {tab === "accounts" && (
          accounts.length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: c.muted, fontSize: 13 }}>No chart accounts</div>
            : accounts.map((acc, i) => (
              <div key={acc.id} style={row(c, i === accounts.length - 1)}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{acc.code} — {acc.name}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{acc.type.toLowerCase()}</div>
                </div>
                <StatusBadge status={acc.active ? "ACTIVE" : "INACTIVE"} />
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function row(c: ReturnType<typeof useColors>, isLast: boolean): React.CSSProperties {
  return { display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: isLast ? "none" : `1px solid ${c.border}` };
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? "#94a3b8";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 7px", borderRadius: 5, background: `${color}18`, color, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {status.toLowerCase()}
    </span>
  );
}

function SmallBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${color}30`, background: `${color}14`, color, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
      {label}
    </button>
  );
}

function btn(bg: string, textColor = "#fff", outline = false, c?: ReturnType<typeof useColors>): React.CSSProperties {
  void c;
  return { display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 8, border: outline ? `1px solid ${bg}` : 0, background: outline ? "transparent" : bg, color: outline ? bg : textColor, fontWeight: 700, fontSize: 13, cursor: "pointer" };
}
