"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FileText, Plus, Receipt, TrendingUp, Users, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { ChartAccount, Employee, ExpenseApproval, FinanceSummary, Invoice, PayrollRun, Sector } from "@/lib/types";
import { queueOperation } from "../offline";
import { useTheme } from "@/contexts/ThemeContext";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: "var(--bg-surface)",
    alt:     "var(--bg-subtle)",
    border:  "var(--border-line)",
    ink:     "var(--text-primary)",
    muted:   "var(--text-muted)",
  };
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
    setInvoiceForm({ customerName: "", customerPhone: "", sectorId: "", description: "Professional services", quantity: 1, unitPrice: 0 });
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
    { label: "P&L Revenue",  value: formatCurrency(summary?.profitLoss.revenue ?? 0),  color: "var(--text-primary)", icon: TrendingUp },
    { label: "P&L Expenses", value: formatCurrency(summary?.profitLoss.expenses ?? 0), color: "var(--text-primary)", icon: Receipt },
    { label: "Net Cash",     value: formatCurrency(summary?.cashFlow.netCash ?? 0),    color: "var(--text-primary)", icon: Wallet },
    { label: "Invoiced",     value: formatCurrency(summary?.profitLoss.invoiced ?? 0), color: "var(--text-primary)", icon: FileText },
  ];

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({ height: 36, width: "100%", borderRadius: 6, border: `1px solid ${c.border}`, background: "var(--bg-surface)", padding: "0 12px", color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box", ...extra });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Business</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: c.ink, lineHeight: "28px", letterSpacing: "-0.01em" }}>Finance &amp; Treasury</h2>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setShowInvoiceForm((v) => !v)} className="btn-primary">
            <FileText size={14} /> New Invoice
          </button>
          <button onClick={() => setShowApprovalForm((v) => !v)} className="btn-secondary">
            <Plus size={14} /> Request Approval
          </button>
          <button onClick={() => void runPayroll()} className="btn-secondary">
            <Users size={14} /> Run Payroll
          </button>
        </div>
      </div>

      {/* KPIs (Single-Surface 4-Cell Pattern) */}
      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        {kpis.map((k) => {
          const IconComp = k.icon;
          return (
            <div
              key={k.label}
              className="kpi-cell"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {k.label}
                </span>
                <span style={{ color: c.muted, display: "flex", alignItems: "center" }}>
                  <IconComp size={16} />
                </span>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: k.color,
                  lineHeight: "28px",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.01em",
                }}
              >
                {k.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline forms */}
      {showInvoiceForm && (
        <form onSubmit={createInvoice} className="ui-surface" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <strong style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>Create Invoice</strong>
            <button type="button" onClick={() => setShowInvoiceForm(false)} className="btn-icon" style={{ width: 28, height: 28 }}>×</button>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Customer Name *</label>
            <input value={invoiceForm.customerName} onChange={(e) => setInvoiceForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="Customer name *" required style={inp()} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Line Item Description *</label>
              <input value={invoiceForm.description} onChange={(e) => setInvoiceForm((f) => ({ ...f, description: e.target.value }))} placeholder="Line item" required style={inp()} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Unit Price (ETB) *</label>
              <input type="number" min="1" value={invoiceForm.unitPrice || ""} onChange={(e) => setInvoiceForm((f) => ({ ...f, unitPrice: Number(e.target.value) }))} placeholder="Unit price" required style={inp()} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Sector Assignment</label>
            <select value={invoiceForm.sectorId} onChange={(e) => setInvoiceForm((f) => ({ ...f, sectorId: e.target.value }))} style={inp()}>
              <option value="">No sector</option>
              {sectors.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button type="submit" className="btn-primary"><FileText size={14} /> Create Invoice</button>
          </div>
        </form>
      )}

      {showApprovalForm && (
        <form onSubmit={createApproval} className="ui-surface" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <strong style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>Request Expense Approval</strong>
            <button type="button" onClick={() => setShowApprovalForm(false)} className="btn-icon" style={{ width: 28, height: 28 }}>×</button>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Expense Title *</label>
            <input value={approvalForm.title} onChange={(e) => setApprovalForm((f) => ({ ...f, title: e.target.value }))} placeholder="Expense title *" required style={inp()} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Category *</label>
              <input value={approvalForm.category} onChange={(e) => setApprovalForm((f) => ({ ...f, category: e.target.value }))} placeholder="Category *" required style={inp()} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Amount (ETB) *</label>
              <input type="number" min="1" value={approvalForm.amount || ""} onChange={(e) => setApprovalForm((f) => ({ ...f, amount: Number(e.target.value) }))} placeholder="Amount *" required style={inp()} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button type="submit" className="btn-primary">Submit Approval</button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="seg-control">
        {(["invoices", "approvals", "payroll", "accounts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`seg-button ${tab === t ? "active" : ""}`}
            style={{ textTransform: "capitalize" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="ui-surface" style={{ overflow: "hidden" }}>
        {tab === "invoices" && (
          invoices.length === 0
            ? <div style={{ padding: "32px 16px", textAlign: "center", color: c.muted, fontSize: 13 }}>No invoices recorded yet</div>
            : invoices.map((inv, i) => (
              <div key={inv.id} style={row(c, i === invoices.length - 1)}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>{inv.invoiceNumber}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{inv.customerName}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(inv.total)}</div>
                <StatusBadge status={inv.status} />
              </div>
            ))
        )}
        {tab === "approvals" && (
          approvals.length === 0
            ? <div style={{ padding: "32px 16px", textAlign: "center", color: c.muted, fontSize: 13 }}>No approvals pending</div>
            : approvals.map((a, i) => (
              <div key={a.id} style={{ ...row(c, i === approvals.length - 1), gridTemplateColumns: "1fr auto auto auto auto" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{a.category}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(a.amount)}</div>
                <StatusBadge status={a.status} />
                {a.status === "REQUESTED" && <>
                  <button onClick={() => void approvalAction(a, "approve")} className="btn-secondary btn-small" style={{ color: "var(--positive)" }}>
                    Approve
                  </button>
                  <button onClick={() => void approvalAction(a, "reject")} className="btn-secondary btn-small" style={{ color: "var(--negative)" }}>
                    Reject
                  </button>
                </>}
                {a.status === "APPROVED" && (
                  <button onClick={() => void approvalAction(a, "pay")} className="btn-primary btn-small">
                    Pay
                  </button>
                )}
              </div>
            ))
        )}
        {tab === "payroll" && (
          payrollRuns.length === 0
            ? <div style={{ padding: "32px 16px", textAlign: "center", color: c.muted, fontSize: 13 }}>No payroll runs processed</div>
            : payrollRuns.map((p, i) => (
              <div key={p.id} style={row(c, i === payrollRuns.length - 1)}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>{p.period}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{p.items.length} employees</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(p.netPay)}</div>
                <StatusBadge status={p.status} />
              </div>
            ))
        )}
        {tab === "accounts" && (
          accounts.length === 0
            ? <div style={{ padding: "32px 16px", textAlign: "center", color: c.muted, fontSize: 13 }}>No chart accounts configured</div>
            : accounts.map((acc, i) => (
              <div key={acc.id} style={row(c, i === accounts.length - 1)}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>{acc.code} — {acc.name}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{acc.type.toLowerCase()}</div>
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
  return { display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12, minHeight: 52, padding: "0 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}` };
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  let dotClass = "muted";
  if (s === "PAID" || s === "APPROVED" || s === "ACTIVE") dotClass = "positive";
  else if (s === "REQUESTED" || s === "PENDING" || s === "DRAFT" || s === "SENT") dotClass = "warning";
  else if (s === "OVERDUE" || s === "REJECTED" || s === "LOST") dotClass = "negative";

  return (
    <div className="status-indicator">
      <span className={`status-dot ${dotClass}`} />
      <span>{status.toLowerCase()}</span>
    </div>
  );
}

