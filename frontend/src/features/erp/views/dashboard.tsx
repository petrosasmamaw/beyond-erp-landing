"use client";

import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Barcode,
  Boxes,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  HardHat,
  HeartHandshake,
  Key,
  Layers,
  Plus,
  Receipt,
  RefreshCw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sprout,
  Tag,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Workflow,
  Wrench,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Dashboard, Transaction } from "@/lib/types";
import { t, type SectorDefinition } from "../config";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function renderFeatureIcon(icon: string, size = 14) {
  const n = (icon || "").toLowerCase();
  if (n.includes("cash-register") || n.includes("receipt")) return <Receipt size={size} />;
  if (n.includes("box") || n.includes("cube")) return <Boxes size={size} />;
  if (n.includes("tag")) return <Tag size={size} />;
  if (n.includes("user") || n.includes("people")) return <Users size={size} />;
  if (n.includes("truck")) return <Truck size={size} />;
  if (n.includes("chart")) return <BarChart3 size={size} />;
  if (n.includes("store")) return <ShoppingBag size={size} />;
  if (n.includes("industry") || n.includes("building") || n.includes("landmark")) return <Building2 size={size} />;
  if (n.includes("diagram") || n.includes("network")) return <Workflow size={size} />;
  if (n.includes("check")) return <CheckCircle2 size={size} />;
  if (n.includes("clip") || n.includes("file") || n.includes("folder")) return <FileText size={size} />;
  if (n.includes("clock")) return <Clock size={size} />;
  if (n.includes("seed") || n.includes("leaf") || n.includes("wheat")) return <Sprout size={size} />;
  if (n.includes("helmet")) return <HardHat size={size} />;
  if (n.includes("key")) return <Key size={size} />;
  if (n.includes("barcode")) return <Barcode size={size} />;
  if (n.includes("money") || n.includes("bill")) return <Banknote size={size} />;
  if (n.includes("coin") || n.includes("sack")) return <Coins size={size} />;
  if (n.includes("scale")) return <Scale size={size} />;
  if (n.includes("shield")) return <ShieldCheck size={size} />;
  if (n.includes("briefcase")) return <Briefcase size={size} />;
  if (n.includes("hand")) return <HeartHandshake size={size} />;
  if (n.includes("wrench") || n.includes("gear")) return <Wrench size={size} />;
  return <Layers size={size} />;
}

export function DashboardView({
  dashboard,
  sector,
  isLoading,
  revenueChart,
  maxChart,
  language = "English",
}: {
  dashboard: Dashboard;
  sector: SectorDefinition;
  isLoading: boolean;
  revenueChart: number[];
  maxChart: number;
  language?: string;
}) {
  const { openTransactionModal, openTelebirrModal } = useApp();
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const surface = "var(--bg-surface)";
  const border = "var(--border-line)";
  const ink = "var(--text-primary)";
  const muted = "var(--text-muted)";
  const subtle = "var(--bg-subtle)";

  const isNetNegative = dashboard.stats.netProfit < 0;

  const kpis = [
    {
      label: "Revenue",
      value: formatCurrency(dashboard.stats.revenue),
      icon: TrendingUp,
      color: "var(--text-primary)",
      trend: "+12%",
      up: true,
    },
    {
      label: "Expenses",
      value: formatCurrency(dashboard.stats.expenses),
      icon: Receipt,
      color: "var(--text-primary)",
      trend: "+3%",
      up: false,
    },
    {
      label: "Net Profit",
      value: formatCurrency(Math.abs(dashboard.stats.netProfit)),
      icon: Wallet,
      color: isNetNegative ? "var(--negative)" : "var(--text-primary)",
      trend: isNetNegative ? "-8%" : "+8%",
      up: !isNetNegative,
    },
    {
      label: "Pending Sync",
      value: String(dashboard.stats.pendingSync),
      icon: RefreshCw,
      color: "var(--text-primary)",
      trend: null,
      up: true,
    },
  ];

  const topChart = Math.max(...revenueChart, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Overview
          </p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: ink, lineHeight: "28px", letterSpacing: "-0.01em" }}>
            Good to see you, {firstName}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Sector inline text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: muted,
              fontSize: 13,
              fontWeight: 500,
              padding: "0 4px",
            }}
          >
            {renderFeatureIcon(sector.icon, 16)}
            <span>{sector.shortName}</span>
          </div>

          <button
            onClick={() => openTransactionModal()}
            className="btn-primary"
          >
            <Plus size={14} /> {t("addTransaction", language)}
          </button>

          <button
            onClick={openTelebirrModal}
            className="btn-secondary"
          >
            <Smartphone size={14} style={{ color: muted }} /> Telebirr
          </button>
        </div>
      </div>

      {/* ── KPI Strip (Single-Surface 4-Cell Pattern) ── */}
      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        {kpis.map((k) => {
          const IconComp = k.icon;
          return (
            <div key={k.label} className="kpi-cell">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {k.label}
                </span>
                <span style={{ color: muted, display: "flex", alignItems: "center" }}>
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

              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, lineHeight: "16px" }}>
                {k.trend ? (
                  <>
                    {k.up ? (
                      <ArrowUpRight size={13} style={{ color: "var(--positive)" }} />
                    ) : (
                      <ArrowDownRight size={13} style={{ color: "var(--negative)" }} />
                    )}
                    <span style={{ color: k.up ? "var(--positive)" : "var(--negative)", fontWeight: 500 }}>{k.trend}</span>
                    <span style={{ color: muted }}>vs last month</span>
                  </>
                ) : (
                  <span style={{ color: muted }}>All changes saved offline</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Chart + Sector Modules ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: 24 }} className="chart-tools-grid">

        {/* 12-Month Revenue Overview */}
        <div className="ui-surface" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Revenue Performance
              </p>
              <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: ink, lineHeight: "20px" }}>
                12-Month Rolling Ledger
              </h3>
            </div>
            <div className="chip">
              <TrendingUp size={12} style={{ marginRight: 4 }} /> ETB
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 108, borderBottom: `1px solid ${border}` }}>
            {revenueChart.map((v, i) => {
              const pct = (v / topChart) * 100;
              const isLast = i === revenueChart.length - 1;
              const isMax = v === Math.max(...revenueChart);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div
                      title={`${MONTHS[i]}: ${formatCurrency(v)}`}
                      style={{
                        width: "100%",
                        height: `${Math.max(pct, 5)}%`,
                        borderRadius: "4px 4px 0 0",
                        background: (isLast || isMax)
                          ? "var(--accent-blue)"
                          : "var(--border-strong)",
                        transition: "height 0.25s ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: muted, fontWeight: 400, textAlign: "center" }}>{MONTHS[i]?.[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Quick Modules (Single Surface Flat List) */}
        <div
          className="ui-surface"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {sector.shortName} Modules
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {sector.features.slice(0, 5).map((f, idx) => {
              const isLast = idx === Math.min(sector.features.length, 5) - 1;
              return (
                <div
                  key={f.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: isLast ? "none" : `1px solid ${border}`,
                    cursor: "pointer",
                    transition: "background-color 0.12s ease-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = subtle)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: muted, display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {renderFeatureIcon(f.icon, 16)}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 12, color: muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {f.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Activity Ledger (Single Surface Table) ── */}
      <div className="ui-surface" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Transactions
            </p>
            <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: ink, lineHeight: "20px" }}>
              {isLoading ? "Loading activity…" : `${dashboard.recentTransactions.length} Recent Transactions`}
            </h3>
          </div>
        </div>

        {dashboard.recentTransactions.length === 0 && !isLoading ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: muted, fontSize: 13 }}>
            No transactions recorded in this workspace session yet.
          </div>
        ) : (
          dashboard.recentTransactions.slice(0, 8).map((tx: Transaction, i: number) => {
            const isIncome = tx.type === "INCOME";
            const date = new Date(tx.occurredAt);
            const label = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
            const isLast = i === Math.min(dashboard.recentTransactions.length, 8) - 1;

            return (
              <div
                key={tx.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr auto",
                  alignItems: "center",
                  gap: 12,
                  minHeight: 52,
                  padding: "0 16px",
                  borderBottom: isLast ? "none" : `1px solid ${border}`,
                  transition: "background-color 0.12s ease-out",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = subtle)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Transaction Type Indicator (bare 16px icon per spec) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isIncome ? (
                    <ArrowDownLeft size={16} style={{ color: "var(--positive)" }} />
                  ) : (
                    <ArrowUpRight size={16} style={{ color: "var(--negative)" }} />
                  )}
                </div>

                {/* Description + Metadata */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: ink, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {tx.description || tx.category}
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="chip">
                      {tx.category}
                    </span>
                    <span>·</span>
                    <span>{label}</span>
                    {!tx.synced && (
                      <>
                        <span>·</span>
                        <span className="chip" style={{ color: "var(--warning)" }}>offline</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isIncome ? "var(--positive)" : ink,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                  </div>
                  <div style={{ fontSize: 10, color: muted, marginTop: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {tx.paymentMethod}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

