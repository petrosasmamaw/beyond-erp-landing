"use client";

import {
  Banknote,
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { formatCurrency, getInitials } from "@/lib/format";
import type { Employee } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
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

const AVATAR_COLORS = ["#2563eb", "#0284c7", "#0d9488", "#d97706", "#dc2626", "#059669", "#0891b2", "#475569"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function EmployeesView({
  employees, filteredEmployees, search, onSearch, advanced, onAdvanced,
  departments, total, page, totalPages, onPage,
  onAddEmployee, onEditEmployee, onDeleteEmployee,
}: {
  employees: Employee[];
  filteredEmployees: Employee[];
  search: string;
  onSearch: (v: string) => void;
  advanced: { status: string; department: string };
  onAdvanced: (p: Partial<{ status: string; department: string }>) => void;
  departments: string[];
  total: number;
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  onAddEmployee: () => void;
  onEditEmployee: (e: Employee) => void;
  onDeleteEmployee: (e: Employee) => void;
}) {
  const c = useColors();
  const active = employees.filter((e) => e.status === "ACTIVE").length;
  const inactive = employees.filter((e) => e.status === "INACTIVE").length;
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);

  const kpis = [
    { label: "Total Staff",     value: String(employees.length),       color: "var(--text-primary)", icon: Users },
    { label: "Active",          value: String(active),                 color: "var(--text-primary)", icon: CheckCircle2 },
    { label: "Inactive",        value: String(inactive),               color: "var(--text-primary)", icon: XCircle },
    { label: "Monthly Payroll", value: formatCurrency(totalSalary),    color: "var(--text-primary)", icon: Banknote },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>People</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: c.ink, lineHeight: "28px", letterSpacing: "-0.01em" }}>Team &amp; Personnel</h2>
        </div>
        <button
          onClick={onAddEmployee}
          className="btn-primary"
        >
          <Plus size={14} /> Add Employee
        </button>
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

      {/* Search + Filters on canvas */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 220 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search employees…"
            style={{ width: "100%", height: 36, borderRadius: 6, border: `1px solid ${c.border}`, background: c.surface, paddingLeft: 36, paddingRight: 12, color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select value={advanced.status} onChange={(e) => onAdvanced({ status: e.target.value })} style={sel(c)}>
          <option value="">All statuses</option>
          <option>ACTIVE</option>
          <option>INACTIVE</option>
        </select>
        <select value={advanced.department} onChange={(e) => onAdvanced({ department: e.target.value })} style={sel(c)}>
          <option value="">All departments</option>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <button
          onClick={() => onAdvanced({ status: "", department: "" })}
          className="btn-secondary"
          style={{ height: 36 }}
        >
          Clear
        </button>
      </div>

      {/* Employee table */}
      {employees.length === 0 ? (
        <EmptyState title="No employees yet" action="Add Employee" onAction={onAddEmployee} />
      ) : (
        <div className="ui-surface" style={{ overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 140px 120px 28px 28px", gap: 12, padding: "0 16px", height: 40, borderBottom: `1px solid ${c.border}`, alignItems: "center" }}>
            {["", "Employee", "Department", "Salary / Status", "", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</span>
            ))}
          </div>
          {filteredEmployees.map((emp, i) => {
            const isActive = emp.status === "ACTIVE";
            const isLast = i === filteredEmployees.length - 1;
            return (
              <div
                key={emp.id}
                style={{ display: "grid", gridTemplateColumns: "32px 1fr 140px 120px 28px 28px", gap: 12, minHeight: 52, padding: "0 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, alignItems: "center", transition: "background-color 0.12s ease-out" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Neutral Avatar per spec */}
                <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--bg-subtle)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {getInitials(emp.fullName)}
                </div>
                {/* Name + contact */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.ink, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{emp.fullName}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 1 }}>{emp.position} · {emp.phone}</div>
                </div>
                {/* Department */}
                <div style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{emp.department}</div>
                {/* Salary + status */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(emp.salary)}</div>
                  <div className="status-indicator" style={{ marginTop: 2 }}>
                    <span className={`status-dot ${isActive ? "positive" : "muted"}`} />
                    <span>{emp.status.toLowerCase()}</span>
                  </div>
                </div>
                {/* Edit */}
                <button onClick={() => onEditEmployee(emp)} aria-label="Edit" style={act(c)}>
                  <Pencil size={13} />
                </button>
                {/* Delete */}
                <button onClick={() => onDeleteEmployee(emp)} aria-label="Remove" style={{ ...act(c), color: "var(--negative)" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
          <Pager page={page} totalPages={totalPages} total={total} onPage={onPage} />
        </div>
      )}
    </div>
  );
}

function sel(c: ReturnType<typeof useColors>) {
  return { height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, padding: "0 10px", color: c.ink, fontSize: 13, outline: "none" };
}
function act(c: ReturnType<typeof useColors>) {
  return { width: 28, height: 28, display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.muted, cursor: "pointer" };
}
