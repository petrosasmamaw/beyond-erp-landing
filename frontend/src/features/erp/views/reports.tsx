"use client";

import { Download, Printer, Smartphone } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Dashboard } from "@/lib/types";
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

export function ReportsView({
  dashboard,
  onCsv,
  onPrint,
  onShare,
}: {
  dashboard: Dashboard;
  onCsv: () => void;
  onPrint: () => void;
  onShare: () => void;
}) {
  const c = useColors();

  const tax = dashboard.taxSummary;
  const kpis = [
    { label: "Taxable Revenue",    value: formatCurrency(tax.taxableRevenue),     color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-coins" },
    { label: "VAT 15%",            value: formatCurrency(tax.vat),                color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-percent" },
    { label: "Withholding 2%",     value: formatCurrency(tax.withholding),        color: "#8b5cf6", bg: c.dark ? "#110b24" : "#f5f3ff", bdr: c.dark ? "#241852" : "#ddd6fe", icon: "fa-solid fa-hand-holding-dollar" },
    { label: "Total Tax Liability",value: formatCurrency(tax.totalTaxLiability),  color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-file-invoice-dollar" },
  ];

  const topAmount = Math.max(...dashboard.sectorBreakdown.map((s) => s.amount), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Finance</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Reports</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCsv} style={btn(c, false)}>
            <Download size={13} /> CSV
          </button>
          <button onClick={onPrint} style={btn(c, false)}>
            <Printer size={13} /> Print
          </button>
          <button onClick={onShare} style={btn(c, true)}>
            <Smartphone size={13} /> Share
          </button>
        </div>
      </div>

      {/* KPI strip */}
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

      {/* Tax summary table */}
      <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${c.border}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Tax</p>
          <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: c.ink }}>Period summary</h3>
        </div>
        {[
          { label: "Taxable Revenue",    value: tax.taxableRevenue,    strong: false },
          { label: "VAT 15%",            value: tax.vat,               strong: false },
          { label: "Withholding 2%",     value: tax.withholding,       strong: false },
          { label: "Total Tax Liability",value: tax.totalTaxLiability, strong: true  },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : "none",
              background: row.strong ? (c.dark ? "#0d1828" : "#f8fafc") : "transparent",
            }}
          >
            <span style={{ fontSize: 13, color: row.strong ? c.ink : c.muted, fontWeight: row.strong ? 700 : 500 }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: row.strong ? 800 : 600, color: row.strong ? "#f43f5e" : c.ink }}>{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>

      {/* Sector breakdown */}
      <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${c.border}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Breakdown</p>
          <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: c.ink }}>By transaction value</h3>
        </div>
        {dashboard.sectorBreakdown.length === 0 ? (
          <div style={{ padding: "32px 18px", textAlign: "center", color: c.muted, fontSize: 13 }}>No sector data yet</div>
        ) : (
          dashboard.sectorBreakdown.map((item, i) => {
            const pct = Math.round((item.amount / topAmount) * 100);
            const isLast = i === dashboard.sectorBreakdown.length - 1;
            return (
              <div key={item.sector} style={{ padding: "12px 18px", borderBottom: isLast ? "none" : `1px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{item.sector}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{formatCurrency(item.amount)}</span>
                    <span style={{ fontSize: 11, color: c.muted, marginLeft: 6 }}>{item.percentage}%</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: c.dark ? "#1a2d3d" : "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: "#2563eb", transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

function btn(c: ReturnType<typeof useColors>, primary: boolean) {
  return {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 6,
    padding: "7px 14px",
    borderRadius: 8,
    border: primary ? 0 : `1px solid ${c.border}`,
    background: primary ? "#2563eb" : c.surface,
    color: primary ? "#fff" : c.ink,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  };
}
