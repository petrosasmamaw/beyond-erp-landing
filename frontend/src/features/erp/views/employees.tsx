"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
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
    surface: dark ? "#111827" : "#ffffff",
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
  };
}

const AVATAR_COLORS = ["#2563eb","#7c3aed","#0d9488","#d97706","#dc2626","#059669","#0891b2","#9333ea"];
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
    { label: "Total Staff",    value: String(employees.length), color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-users" },
    { label: "Active",         value: String(active),           color: "#10b981", bg: c.dark ? "#071812" : "#f0fdf4", bdr: c.dark ? "#0f2e1e" : "#bbf7d0", icon: "fa-solid fa-circle-check" },
    { label: "Inactive",       value: String(inactive),         color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-circle-xmark" },
    { label: "Monthly Payroll",value: formatCurrency(totalSalary), color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-money-bill-wave" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>People</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Team</h2>
        </div>
        <button onClick={onAddEmployee} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> Add employee
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

      {/* Search + Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search employees…"
            style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, paddingLeft: 30, paddingRight: 12, color: c.ink, fontSize: 13, outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
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
        <button onClick={() => onAdvanced({ status: "", department: "" })} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          Clear
        </button>
      </div>

      {/* Employee table */}
      {employees.length === 0 ? (
        <EmptyState title="No employees yet" action="Add Employee" onAction={onAddEmployee} />
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 120px 100px 28px 28px", gap: 12, padding: "9px 16px", borderBottom: `1px solid ${c.border}`, alignItems: "center" }}>
            {["", "Employee", "Department", "Salary / Status", "", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
            ))}
          </div>
          {filteredEmployees.map((emp, i) => {
            const isActive = emp.status === "ACTIVE";
            const isLast = i === filteredEmployees.length - 1;
            const color = avatarColor(emp.fullName);
            return (
              <div
                key={emp.id}
                style={{ display: "grid", gridTemplateColumns: "32px 1fr 120px 100px 28px 28px", gap: 12, padding: "10px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, alignItems: "center", transition: "background 0.12s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Avatar */}
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                  {getInitials(emp.fullName)}
                </div>
                {/* Name + contact */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{emp.fullName}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{emp.position} · {emp.phone}</div>
                </div>
                {/* Department */}
                <div style={{ fontSize: 12, color: c.muted, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{emp.department}</div>
                {/* Salary + status */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{formatCurrency(emp.salary)}</div>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: isActive ? (c.dark ? "#0f2e1e" : "#dcfce7") : c.alt, color: isActive ? "#10b981" : c.muted, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
                    {emp.status.toLowerCase()}
                  </span>
                </div>
                {/* Edit */}
                <button onClick={() => onEditEmployee(emp)} aria-label="Edit" style={act(c)}>
                  <Pencil size={12} />
                </button>
                {/* Delete */}
                <button onClick={() => onDeleteEmployee(emp)} aria-label="Remove" style={{ ...act(c), color: "#f43f5e" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Pager page={page} totalPages={totalPages} total={total} onPage={onPage} />
    </div>
  );
}

function sel(c: ReturnType<typeof useColors>) {
  return { height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, padding: "0 10px", color: c.ink, fontSize: 13, outline: "none" };
}
function act(c: ReturnType<typeof useColors>) {
  return { width: 28, height: 28, display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.muted, cursor: "pointer" };
}
