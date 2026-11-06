"use client";

import { Coins, Download, FileSpreadsheet, Percent, Printer, Receipt, ShieldCheck, Smartphone } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Dashboard } from "@/lib/types";
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
    { label: "Taxable Revenue",     value: formatCurrency(tax.taxableRevenue),    color: "#2563eb", icon: Coins },
    { label: "VAT 15%",             value: formatCurrency(tax.vat),               color: "#f59e0b", icon: Percent },
    { label: "Withholding 2%",      value: formatCurrency(tax.withholding),       color: "#0284c7", icon: ShieldCheck },
    { label: "Total Tax Liability", value: formatCurrency(tax.totalTaxLiability), color: "#f43f5e", icon: FileSpreadsheet },
  ];

  const topAmount = Math.max(...dashboard.sectorBreakdown.map((s) => s.amount), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Compliance</p>
          <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: c.ink, lineHeight: 1.2 }}>Reports &amp; Tax Filings</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCsv} style={btn(c, false)}>
            <Download size={14} /> CSV
          </button>
          <button onClick={onPrint} style={btn(c, false)}>
            <Printer size={14} /> Print
          </button>
          <button onClick={onShare} style={btn(c, true)}>
            <Smartphone size={14} /> Share
          </button>
        </div>
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
                <span style={{ fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</span>
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

      {/* Tax summary table */}
      <div style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${c.border}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tax Summary</p>
          <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: c.ink }}>Period Liability Ledger</h3>
        </div>
        {[
          { label: "Taxable Revenue",     value: tax.taxableRevenue,    strong: false },
          { label: "VAT (15%)",           value: tax.vat,               strong: false },
          { label: "Withholding Tax (2%)", value: tax.withholding,       strong: false },
          { label: "Total Tax Liability", value: tax.totalTaxLiability, strong: true  },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : "none",
              background: row.strong ? c.alt : "transparent",
            }}
          >
            <span style={{ fontSize: 13, color: row.strong ? c.ink : c.muted, fontWeight: row.strong ? 700 : 500 }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: row.strong ? 800 : 600, color: row.strong ? "#f43f5e" : c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>

      {/* Sector breakdown */}
      <div style={{ borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${c.border}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sector Distribution</p>
          <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: c.ink }}>Volume by Business Activity</h3>
        </div>
        {dashboard.sectorBreakdown.length === 0 ? (
          <div style={{ padding: "36px 18px", textAlign: "center", color: c.muted, fontSize: 13 }}>No sector transactions recorded yet</div>
        ) : (
          dashboard.sectorBreakdown.map((item, i) => {
            const pct = Math.round((item.amount / topAmount) * 100);
            const isLast = i === dashboard.sectorBreakdown.length - 1;
            return (
              <div key={item.sector} style={{ padding: "12px 18px", borderBottom: isLast ? "none" : `1px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{item.sector}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(item.amount)}</span>
                    <span style={{ fontSize: 11, color: c.muted, marginLeft: 8 }}>{item.percentage}%</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: c.alt, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: "#2563eb", transition: "width 0.3s ease" }} />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

function btn(c: ReturnType<typeof useColors>, primary: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 8,
    border: primary ? 0 : `1px solid ${c.border}`,
    background: primary ? "#2563eb" : c.surface,
    color: primary ? "#fff" : c.ink,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.14s ease",
  };
}
