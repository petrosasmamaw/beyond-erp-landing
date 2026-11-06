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

  const kpis = [
    { label: "Total Income",   value: formatCurrency(income),          color: "#10b981", icon: TrendingUp },
    { label: "Total Expenses", value: formatCurrency(expense),         color: "#f43f5e", icon: Receipt },
    { label: "Net",            value: formatCurrency(income - expense), color: (income - expense) >= 0 ? "#2563eb" : "#f43f5e", icon: Wallet },
    { label: "Showing",        value: `${transactions.length} / ${total}`, color: "#f59e0b", icon: ListFilter },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Finance</p>
          <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: c.ink, lineHeight: 1.2 }}>Transactions</h2>
        </div>
        <button
          onClick={onAddTransaction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 14px",
            borderRadius: 8,
            border: 0,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          <Plus size={14} /> Add Transaction
        </button>
      </div>

      {/* KPI strip (De-boxed Flat) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }} className="kpi-grid">
        {kpis.map((k) => {
          const IconComp = k.icon;
          return (
            <div
              key={k.label}
              style={{
                padding: "15px 16px",
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: c.surface,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {k.label}
                </span>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: c.dark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)",
                    color: k.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComp size={14} />
                </div>
              </div>
              <div
                style={{
                  fontSize: "clamp(14px,1.6vw,18px)",
                  fontWeight: 700,
                  color: c.ink,
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

      {/* Type filter pills + search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {(["ALL", "INCOME", "EXPENSE"] as const).map((item) => {
          const active = filter === item;
          const accent = item === "INCOME" ? "#10b981" : item === "EXPENSE" ? "#f43f5e" : "#2563eb";
          return (
            <button
              key={item}
              onClick={() => onFilter(item)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                border: `1px solid ${active ? accent : c.border}`,
                background: active
                  ? (c.dark ? `${accent}22` : `${accent}12`)
                  : c.surface,
                color: active ? accent : c.muted,
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.14s ease",
              }}
            >
              {item.toLowerCase()}
            </button>
          );
        })}
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search transactions…"
            style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, paddingLeft: 32, paddingRight: 12, color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
          />
        </div>
      </div>

      {/* Advanced filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr)) auto auto auto", gap: 8, alignItems: "end" }}>
        <select value={advanced.sectorId} onChange={(e) => onAdvanced({ sectorId: e.target.value })} style={selStyle(c)}>
          <option value="">All sectors</option>
          {sectors.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
        </select>
        <select value={advanced.status} onChange={(e) => onAdvanced({ status: e.target.value })} style={selStyle(c)}>
          <option value="">All statuses</option>
          {["COMPLETED", "PENDING", "DRAFT"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={advanced.paymentMethod} onChange={(e) => onAdvanced({ paymentMethod: e.target.value })} style={selStyle(c)}>
          <option value="">All payments</option>
          {paymentMethods.map((m) => <option key={m}>{m}</option>)}
        </select>
        <input type="date" value={advanced.dateFrom} onChange={(e) => onAdvanced({ dateFrom: e.target.value })} style={{ ...inputStyle(c), width: "auto" }} />
        <input type="date" value={advanced.dateTo} onChange={(e) => onAdvanced({ dateTo: e.target.value })} style={{ ...inputStyle(c), width: "auto" }} />
        <button
          onClick={() => onAdvanced({ sectorId: "", status: "", paymentMethod: "", dateFrom: "", dateTo: "" })}
          style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <TransactionCards transactions={transactions} onEdit={onEditTransaction} onDelete={onDeleteTransaction} />

      <Pager page={page} totalPages={totalPages} total={total} onPage={onPage} />
    </div>
  );
}

export function TransactionCards({
  transactions, compact = false, onEdit, onDelete,
}: {
  transactions: Transaction[];
  compact?: boolean;
  onEdit?: (t: Transaction) => void;
  onDelete?: (t: Transaction) => void;
}) {
  const c = useColors();

  if (transactions.length === 0) {
    return <EmptyState title="No transactions yet" action="Add one from the plus button" />;
  }

  return (
    <div style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
      {!compact && (
        <div style={{ display: "grid", gridTemplateColumns: "8px 1fr auto auto auto", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${c.border}` }}>
          <div />
          <span style={{ fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount</span>
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
              gridTemplateColumns: compact ? "8px 1fr" : "8px 1fr auto auto auto",
              alignItems: "center",
              gap: 12,
              padding: compact ? "9px 14px" : "11px 16px",
              borderBottom: isLast ? "none" : `1px solid ${c.border}`,
              transition: "background 0.12s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isIncome ? "#10b981" : "#f43f5e", flexShrink: 0, alignSelf: "center" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {tx.description || tx.category}
              </div>
              <div style={{ fontSize: 11, color: c.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {tx.category}
                </span>
                <span>·</span>
                <span>{tx.paymentMethod}</span>
                <span>·</span>
                <span>{formatDate(tx.occurredAt)}</span>
                {!tx.synced && <><span>·</span><span style={{ color: "#f59e0b", fontWeight: 600 }}>offline</span></>}
                {tx.vatAmount > 0 && <><span>·</span><span style={{ color: "#10b981", fontWeight: 600 }}>VAT</span></>}
              </div>
            </div>
            {!compact && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: isIncome ? "#10b981" : c.ink, fontVariantNumeric: "tabular-nums" }}>
                  {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                </div>
                <div style={{ fontSize: 10, color: c.muted, marginTop: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>{tx.status.toLowerCase()}</div>
              </div>
            )}
            {!compact && onEdit && (
              <button onClick={() => onEdit(tx)} aria-label="Edit" style={actionBtnStyle(c)}>
                <Pencil size={13} />
              </button>
            )}
            {!compact && onDelete && (
              <button onClick={() => onDelete(tx)} aria-label="Delete" style={{ ...actionBtnStyle(c), color: "#f43f5e" }}>
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
function inputStyle(c: ReturnType<typeof useColors>) {
  return {
    height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`,
    background: c.surface, padding: "0 10px", color: c.ink, fontSize: 13, outline: "none",
    boxSizing: "border-box" as const,
  };
}
function selStyle(c: ReturnType<typeof useColors>) {
  return inputStyle(c);
}
function actionBtnStyle(c: ReturnType<typeof useColors>) {
  return {
    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 6, border: `1px solid ${c.border}`, background: c.surface,
    color: c.muted, cursor: "pointer", flexShrink: 0,
  };
}
