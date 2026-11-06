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

  const kpis = [
    {
      label: "Revenue",
      value: formatCurrency(dashboard.stats.revenue),
      icon: TrendingUp,
      accent: "#10b981",
      trend: "+12%",
      up: true,
    },
    {
      label: "Expenses",
      value: formatCurrency(dashboard.stats.expenses),
      icon: Receipt,
      accent: "#f43f5e",
      trend: "+3%",
      up: false,
    },
    {
      label: "Net Profit",
      value: formatCurrency(Math.abs(dashboard.stats.netProfit)),
      icon: Wallet,
      accent: dashboard.stats.netProfit >= 0 ? "#2563eb" : "#f43f5e",
      trend: dashboard.stats.netProfit >= 0 ? "+8%" : "-8%",
      up: dashboard.stats.netProfit >= 0,
    },
    {
      label: "Pending Sync",
      value: String(dashboard.stats.pendingSync),
      icon: RefreshCw,
      accent: "#f59e0b",
      trend: null,
      up: true,
    },
  ];

  const topChart = Math.max(...revenueChart, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Overview
          </p>
          <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: ink, lineHeight: 1.2 }}>
            Good to see you, {firstName}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Sector Chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 11px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: surface,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: dark ? "rgba(37, 99, 235, 0.16)" : "rgba(37, 99, 235, 0.08)",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderFeatureIcon(sector.icon, 13)}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: ink }}>{sector.shortName}</span>
          </div>

          <button
            onClick={() => openTransactionModal()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
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
            <Plus size={14} /> {t("addTransaction", language)}
          </button>

          <button
            onClick={openTelebirrModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: surface,
              color: ink,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Smartphone size={14} style={{ color: "#2563eb" }} /> Telebirr
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards (De-boxed, Senior Flat Styling) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }} className="kpi-grid">
        {kpis.map((k) => {
          const IconComp = k.icon;
          return (
            <div
              key={k.label}
              style={{
                padding: "16px 18px",
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: surface,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {k.label}
                </span>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)",
                    color: k.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComp size={15} />
                </div>
              </div>

              <div
                style={{
                  fontSize: "clamp(16px, 1.8vw, 21px)",
                  fontWeight: 700,
                  color: ink,
                  lineHeight: 1.1,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                {k.value}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                {k.trend ? (
                  <>
                    {k.up ? (
                      <ArrowUpRight size={13} style={{ color: "#10b981" }} />
                    ) : (
                      <ArrowDownRight size={13} style={{ color: "#f43f5e" }} />
                    )}
                    <span style={{ color: k.up ? "#10b981" : "#f43f5e", fontWeight: 600 }}>{k.trend}</span>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12 }} className="chart-tools-grid">

        {/* 12-Month Revenue Overview */}
        <div style={{ padding: "18px 20px", borderRadius: 10, border: `1px solid ${border}`, background: surface }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Revenue Performance
              </p>
              <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: ink }}>
                12-Month Rolling Ledger
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                borderRadius: 6,
                background: dark ? "rgba(37, 99, 235, 0.16)" : "rgba(37, 99, 235, 0.08)",
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <TrendingUp size={12} /> ETB
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 108 }}>
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
                        borderRadius: "3px 3px 0 0",
                        background: (isLast || isMax)
                          ? "linear-gradient(180deg, #3b82f6, #2563eb)"
                          : dark ? "#1e293b" : "#cbd5e1",
                        transition: "height 0.25s ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 9, color: muted, fontWeight: 600 }}>{MONTHS[i]?.[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Quick Modules (De-boxed Clean List) */}
        <div
          style={{
            padding: "16px",
            borderRadius: 10,
            border: `1px solid ${border}`,
            background: surface,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
                    gap: 10,
                    padding: "8px 6px",
                    borderRadius: 6,
                    borderBottom: isLast ? "none" : `1px solid ${border}`,
                    cursor: "pointer",
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = subtle)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {renderFeatureIcon(f.icon, 13)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {f.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Activity Ledger (De-boxed Clean Rows) ── */}
      <div style={{ borderRadius: 10, border: `1px solid ${border}`, background: surface, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Transactions
            </p>
            <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: ink }}>
              {isLoading ? "Loading activity…" : `${dashboard.recentTransactions.length} Recent Transactions`}
            </h3>
          </div>
        </div>

        {dashboard.recentTransactions.length === 0 && !isLoading ? (
          <div style={{ padding: "36px 18px", textAlign: "center", color: muted, fontSize: 13 }}>
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
                  gridTemplateColumns: "32px 1fr auto",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 18px",
                  borderBottom: isLast ? "none" : `1px solid ${border}`,
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = subtle)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Transaction Type Indicator */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: isIncome
                      ? (dark ? "rgba(16, 185, 129, 0.16)" : "rgba(16, 185, 129, 0.1)")
                      : (dark ? "rgba(244, 63, 94, 0.16)" : "rgba(244, 63, 94, 0.1)"),
                    color: isIncome ? "#10b981" : "#f43f5e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isIncome ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                </div>

                {/* Description + Metadata */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ink, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {tx.description || tx.category}
                  </div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: 18,
                        padding: "0 6px",
                        borderRadius: 4,
                        background: subtle,
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: muted,
                      }}
                    >
                      {tx.category}
                    </span>
                    <span>·</span>
                    <span>{label}</span>
                    {!tx.synced && (
                      <>
                        <span>·</span>
                        <span style={{ color: "#f59e0b", fontWeight: 600 }}>offline</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isIncome ? "#10b981" : ink,
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
