"use client";

import {
  ListFilter,
  Pencil,
  Plus,
  Receipt,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Sector, Transaction, TransactionType } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { useTheme } from "@/contexts/ThemeContext";
import { paymentMethods } from "../config";

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

export function TransactionsView({
  filter, onFilter, search, onSearch, advanced, onAdvanced,
  sectors, transactions, total, page, totalPages, onPage,
  onAddTransaction, onEditTransaction, onDeleteTransaction, language: _lang,
}: {
  filter: "ALL" | TransactionType;
  onFilter: (f: "ALL" | TransactionType) => void;
  search: string;
  onSearch: (v: string) => void;
  advanced: { sectorId: string; status: string; paymentMethod: string; dateFrom: string; dateTo: string };
  onAdvanced: (p: Partial<typeof advanced>) => void;
  sectors: Sector[];
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  onAddTransaction: () => void;
  onEditTransaction: (t: Transaction) => void;
  onDeleteTransaction: (t: Transaction) => void;
  language?: string;
}) {
  void _lang;
  const c = useColors();

  const income = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const net = income - expense;
  const isNetNegative = net < 0;

  const kpis = [
    { label: "Total Income",   value: formatCurrency(income),          color: "var(--text-primary)", icon: TrendingUp },
    { label: "Total Expenses", value: formatCurrency(expense),         color: "var(--text-primary)", icon: Receipt },
    { label: "Net",            value: formatCurrency(Math.abs(net)),   color: isNetNegative ? "var(--negative)" : "var(--text-primary)", icon: Wallet },
    { label: "Showing",        value: `${transactions.length} / ${total}`, color: "var(--text-primary)", icon: ListFilter },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Finance</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", lineHeight: "28px", letterSpacing: "-0.01em" }}>Transactions</h2>
        </div>
        <button
          onClick={onAddTransaction}
          className="btn-primary"
        >
          <Plus size={14} /> Add Transaction
        </button>
      </div>

      {/* KPI strip (Single-Surface 4-Cell Pattern) */}
      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        {kpis.map((k) => {
          const IconComp = k.icon;
          return (
            <div
              key={k.label}
              className="kpi-cell"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {k.label}
                </span>
                <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
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

      {/* Type filter segmented control + search */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="seg-control">
          {(["ALL", "INCOME", "EXPENSE"] as const).map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                onClick={() => onFilter(item)}
                className={`seg-button ${active ? "active" : ""}`}
                style={{ textTransform: "capitalize" }}
              >
                {item.toLowerCase()}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, position: "relative", minWidth: 220 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search transactions…"
            style={{ width: "100%", height: 36, borderRadius: 6, border: "1px solid var(--border-line)", background: "var(--bg-surface)", paddingLeft: 36, paddingRight: 12, color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={() => onAdvanced({ sectorId: "", status: "", paymentMethod: "", dateFrom: "", dateTo: "" })}
          className="btn-secondary"
          style={{ height: 36, whiteSpace: "nowrap" }}
        >
          Clear
        </button>
      </div>

      {/* Advanced filters on canvas */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={advanced.sectorId} onChange={(e) => onAdvanced({ sectorId: e.target.value })} style={selStyle()}>
          <option value="">All sectors</option>
          {sectors.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
        </select>
        <select value={advanced.status} onChange={(e) => onAdvanced({ status: e.target.value })} style={selStyle()}>
          <option value="">All statuses</option>
          {["COMPLETED", "PENDING", "DRAFT"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={advanced.paymentMethod} onChange={(e) => onAdvanced({ paymentMethod: e.target.value })} style={selStyle()}>
          <option value="">All payments</option>
          {paymentMethods.map((m) => <option key={m}>{m}</option>)}
        </select>
        <input type="date" value={advanced.dateFrom} onChange={(e) => onAdvanced({ dateFrom: e.target.value })} style={{ ...inputStyle(), width: "auto" }} />
        <input type="date" value={advanced.dateTo} onChange={(e) => onAdvanced({ dateTo: e.target.value })} style={{ ...inputStyle(), width: "auto" }} />
      </div>

      {/* Table Surface with Embedded Pager */}
      <div className="ui-surface" style={{ overflow: "hidden" }}>
        <TransactionCards transactions={transactions} onEdit={onEditTransaction} onDelete={onDeleteTransaction} embedded />
        <Pager page={page} totalPages={totalPages} total={total} onPage={onPage} />
      </div>
    </div>
  );
}

export function TransactionCards({
  transactions, compact = false, embedded = false, onEdit, onDelete,
}: {
  transactions: Transaction[];
  compact?: boolean;
  embedded?: boolean;
  onEdit?: (t: Transaction) => void;
  onDelete?: (t: Transaction) => void;
}) {
  const c = useColors();

  if (transactions.length === 0) {
    return <EmptyState title="No transactions yet" action="Add one from the plus button" />;
  }

  function getStatusClass(status: string) {
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "PAID") return "positive";
    if (s === "PENDING" || s === "DRAFT") return "warning";
    return "muted";
  }

  return (
    <div style={embedded ? { background: "var(--bg-surface)" } : { borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
      {!compact && (
        <div style={{ display: "grid", gridTemplateColumns: "16px 1fr auto auto auto", gap: 12, padding: "0 16px", height: 40, alignItems: "center", borderBottom: `1px solid ${c.border}` }}>
          <div />
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Amount</span>
          <span style={{ width: 28 }} />
          <span style={{ width: 28 }} />
        </div>
      )}
      {transactions.map((tx, i) => {
        const isIncome = tx.type === "INCOME";
        const isLast = i === transactions.length - 1;
        return (
          <div
            key={tx.id}
            style={{
              display: "grid",
              gridTemplateColumns: compact ? "16px 1fr" : "16px 1fr auto auto auto",
              alignItems: "center",
              gap: 12,
              minHeight: 52,
              padding: "0 16px",
              borderBottom: (isLast && embedded) ? "none" : (isLast ? "none" : `1px solid ${c.border}`),
              transition: "background-color 0.12s ease-out",
              cursor: "default",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isIncome ? "var(--positive)" : "var(--negative)", flexShrink: 0, alignSelf: "center" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {tx.description || tx.category}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span className="chip">
                  {tx.category}
                </span>
                <span>·</span>
                <span>{tx.paymentMethod}</span>
                <span>·</span>
                <span>{formatDate(tx.occurredAt)}</span>
                {!tx.synced && <><span>·</span><span className="chip" style={{ color: "var(--warning)" }}>offline</span></>}
                {tx.vatAmount > 0 && <><span>·</span><span className="chip">VAT</span></>}
              </div>
            </div>
            {!compact && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isIncome ? "var(--positive)" : "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                  {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                </div>
                <div className="status-indicator" style={{ justifyContent: "flex-end", marginTop: 2 }}>
                  <span className={`status-dot ${getStatusClass(tx.status)}`} />
                  <span>{tx.status.toLowerCase()}</span>
                </div>
              </div>
            )}
            {!compact && onEdit && (
              <button onClick={() => onEdit(tx)} aria-label="Edit" style={actionBtnStyle(c)}>
                <Pencil size={13} />
              </button>
            )}
            {!compact && onDelete && (
              <button onClick={() => onDelete(tx)} aria-label="Delete" style={{ ...actionBtnStyle(c), color: "var(--negative)" }}>
                <Trash2 size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Shared input style helpers ── */
function inputStyle() {
  return {
    height: 36, borderRadius: 6, border: "1px solid var(--border-line)",
    background: "var(--bg-surface)", padding: "0 12px", color: "var(--text-primary)", fontSize: 13, outline: "none",
    boxSizing: "border-box" as const,
  };
}
function selStyle() {
  return inputStyle();
}
function actionBtnStyle(c: ReturnType<typeof useColors>) {
  void c;
  return {
    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 6, border: "1px solid var(--border-line)", background: "transparent",
    color: "var(--text-muted)", cursor: "pointer", flexShrink: 0,
  };
}
