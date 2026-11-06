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
    { label: "Taxable Revenue",     value: formatCurrency(tax.taxableRevenue),    color: "var(--text-primary)", icon: Coins },
    { label: "VAT 15%",             value: formatCurrency(tax.vat),               color: "var(--text-primary)", icon: Percent },
    { label: "Withholding 2%",      value: formatCurrency(tax.withholding),       color: "var(--text-primary)", icon: ShieldCheck },
    { label: "Total Tax Liability", value: formatCurrency(tax.totalTaxLiability), color: "var(--text-primary)", icon: FileSpreadsheet },
  ];

  const topAmount = Math.max(...dashboard.sectorBreakdown.map((s) => s.amount), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Compliance</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: c.ink, lineHeight: "28px", letterSpacing: "-0.01em" }}>Reports &amp; Tax Filings</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCsv} className="btn-secondary">
            <Download size={16} /> CSV
          </button>
          <button onClick={onPrint} className="btn-secondary">
            <Printer size={16} /> Print
          </button>
          <button onClick={onShare} className="btn-secondary">
            <Smartphone size={16} /> Share
          </button>
        </div>
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
                <span style={{ fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</span>
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

      {/* Tax summary table (Liability ledger) */}
      <div className="ui-surface" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tax Summary</p>
          <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: c.ink, lineHeight: "20px" }}>Period Liability Ledger</h3>
        </div>
        {[
          { label: "Taxable Revenue",      value: tax.taxableRevenue,    strong: false },
          { label: "VAT (15%)",            value: tax.vat,               strong: false },
          { label: "Withholding Tax (2%)", value: tax.withholding,       strong: false },
          { label: "Total Tax Liability",  value: tax.totalTaxLiability, strong: true  },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 44,
              padding: "0 16px",
              borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : "none",
              borderTop: row.strong ? `1px solid ${c.border}` : "none",
              background: "transparent",
            }}
          >
            <span style={{ fontSize: 13, color: row.strong ? c.ink : c.muted, fontWeight: row.strong ? 600 : 500 }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: row.strong ? "var(--negative)" : c.ink, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>

      {/* Sector breakdown */}
      <div className="ui-surface" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Sector Distribution</p>
          <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: c.ink, lineHeight: "20px" }}>Volume by Business Activity</h3>
        </div>
        {dashboard.sectorBreakdown.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: c.muted, fontSize: 13 }}>No sector transactions recorded yet</div>
        ) : (
          dashboard.sectorBreakdown.map((item, i) => {
            const pct = Math.round((item.amount / topAmount) * 100);
            const isLast = i === dashboard.sectorBreakdown.length - 1;
            return (
              <div key={item.sector} style={{ padding: "12px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>{item.sector}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: c.muted, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(item.amount)}</span>
                    <span style={{ fontSize: 12, color: c.muted, marginLeft: 8 }}>{item.percentage}%</span>
                  </div>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
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
