"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  ChevronRight,
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
import { t, type SectorDefinition, type SectorFeature } from "../config";
import { getSectorConfig } from "@/features/sectors";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { StockAlertsModal } from "@/components/modals/StockAlertsModal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * 0.18;
    const cp1y = p1.y + (p2.y - p0.y) * 0.18;
    const cp2x = p2.x - (p3.x - p1.x) * 0.18;
    const cp2y = p2.y - (p3.y - p1.y) * 0.18;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return d;
}

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
  const router = useRouter();
  const { openTransactionModal, openTelebirrModal, openBarcodeModal } = useApp();
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [showStockAlerts, setShowStockAlerts] = useState(false);

  const handleFeatureClick = (f: SectorFeature) => {
    const titleLower = f.title.toLowerCase();

    // 1. Barcode scanner
    if (titleLower.includes("barcode")) {
      openBarcodeModal();
      return;
    }

    // 2. Stock alerts
    if (titleLower.includes("alert") || titleLower.includes("stock alert")) {
      setShowStockAlerts(true);
      return;
    }

    // 3. Match against sector navItems / modules
    const sectorCfg = getSectorConfig(sector.id) || getSectorConfig("retail-trading");
    const match = sectorCfg?.navItems.find(
      (item) =>
        item.label.toLowerCase() === titleLower ||
        titleLower.includes(item.key.toLowerCase()) ||
        item.key.toLowerCase().includes(titleLower.replace(/\s+/g, "-")) ||
        item.label.toLowerCase().includes(titleLower) ||
        titleLower.includes(item.label.toLowerCase())
    );

    if (match) {
      router.push(`/m/${match.key}`);
      return;
    }

    // Specific retail fallbacks
    if (titleLower.includes("pos") || titleLower.includes("checkout")) {
      router.push("/m/pos");
      return;
    }
    if (titleLower.includes("inventory") || titleLower.includes("stock")) {
      router.push("/m/inventory");
      return;
    }
    if (titleLower.includes("product")) {
      router.push("/m/products");
      return;
    }

    // Fallback module navigation
    const slug = titleLower.replace(/[^a-z0-9]+/g, "-");
    router.push(`/m/${slug}`);
  };

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

  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  const chartData = revenueChart && revenueChart.length ? revenueChart : [38000, 52000, 47000, 61000, 55000, 68000, 71000, 64000, 82000, 75000, 88000, 93000];
  const chartLength = chartData.length;
  const svgWidth = 520;
  const svgHeight = 146;
  const padX = 22;
  const plotTop = 16;
  const plotBottom = 114;
  const plotHeight = plotBottom - plotTop;
  const stepX = (svgWidth - padX * 2) / Math.max(chartLength - 1, 1);

  const maxVal = Math.max(...chartData, 1) * 1.08;
  const minVal = Math.min(...chartData, 0);
  const valRange = Math.max(maxVal - minVal, 1);

  const primaryPoints = chartData.map((v, i) => {
    const x = padX + i * stepX;
    const y = plotBottom - ((v - minVal) / valRange) * plotHeight;
    return { x, y, v };
  });

  const secondaryPoints = chartData.map((v, i) => {
    const phase = (i / Math.max(chartLength - 1, 1)) * Math.PI * 2;
    const wave = Math.sin(phase - 0.4) * (maxVal * 0.14);
    const baseline = chartData[(i + 7) % chartLength] * 0.35 + v * 0.42 + maxVal * 0.18 + wave;
    const clamped = Math.max(minVal + maxVal * 0.1, Math.min(maxVal * 0.92, baseline));
    const x = padX + i * stepX;
    const y = plotBottom - ((clamped - minVal) / valRange) * plotHeight;
    return { x, y };
  });

  const primaryPath = getCurvedPath(primaryPoints);
  const secondaryPath = getCurvedPath(secondaryPoints);
  const lastPt = primaryPoints[chartLength - 1];
  const firstPt = primaryPoints[0];
  const areaPath = primaryPoints.length >= 2
    ? `${primaryPath} L ${lastPt.x.toFixed(1)},${plotBottom + 6} L ${firstPt.x.toFixed(1)},${plotBottom + 6} Z`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Page Header ── */}
      <div className="dashboard-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Overview
          </p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: ink, lineHeight: "28px", letterSpacing: "-0.01em" }}>
            Good to see you, {firstName}
          </h2>
        </div>
        <div className="dashboard-action-buttons" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Sector inline chip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: muted,
              fontSize: 12,
              fontWeight: 500,
              padding: "4px 8px",
              borderRadius: 6,
              background: subtle,
              border: `1px solid ${border}`,
            }}
          >
            {renderFeatureIcon(sector.icon, 14)}
            <span>{sector.shortName}</span>
          </div>

          <button
            type="button"
            onClick={() => openTransactionModal()}
            className="action-btn-primary"
            style={{
              height: 32,
              padding: "0 12px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 6,
              border: "1px solid var(--accent-blue)",
              background: "var(--accent-blue)",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Plus size={14} /> <span>{t("addTransaction", language)}</span>
          </button>

          <button
            type="button"
            onClick={openTelebirrModal}
            className="action-btn-secondary"
            style={{
              height: 32,
              padding: "0 12px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 6,
              border: `1px solid ${border}`,
              background: surface,
              color: ink,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <Smartphone size={14} style={{ color: muted }} /> <span>Telebirr</span>
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
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Revenue Performance
              </p>
              <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: ink, lineHeight: "20px" }}>
                {hoveredMonthIdx !== null && primaryPoints[hoveredMonthIdx]
                  ? `${MONTHS[hoveredMonthIdx]}: ${formatCurrency(primaryPoints[hoveredMonthIdx].v)}`
                  : "12-Month Rolling Ledger"}
              </h3>
            </div>
            <div className="chip">
              <TrendingUp size={12} style={{ marginRight: 4 }} /> ETB
            </div>
          </div>

          <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
              onMouseLeave={() => setHoveredMonthIdx(null)}
            >
              <defs>
                <linearGradient id="revenueAreaLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={dark ? 0.35 : 0.22} />
                  <stop offset="55%" stopColor="var(--accent-blue)" stopOpacity={dark ? 0.08 : 0.04} />
                  <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Area fill under primary curve */}
              {areaPath && (
                <path d={areaPath} fill="url(#revenueAreaLineGrad)" />
              )}

              {/* Baseline divider */}
              <line
                x1={padX - 6}
                y1={plotBottom + 6}
                x2={svgWidth - padX + 6}
                y2={plotBottom + 6}
                stroke={border}
                strokeWidth={1}
              />

              {/* Secondary dotted smooth curve */}
              {secondaryPath && (
                <path
                  d={secondaryPath}
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth={1.8}
                  strokeDasharray="3 4"
                  strokeLinecap="round"
                  opacity={dark ? 0.6 : 0.75}
                />
              )}

              {/* Primary smooth curved line */}
              {primaryPath && (
                <path
                  d={primaryPath}
                  fill="none"
                  stroke="var(--accent-blue)"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Hover guide line */}
              {hoveredMonthIdx !== null && primaryPoints[hoveredMonthIdx] && (
                <line
                  x1={primaryPoints[hoveredMonthIdx].x}
                  y1={plotTop - 4}
                  x2={primaryPoints[hoveredMonthIdx].x}
                  y2={plotBottom + 6}
                  stroke="var(--accent-blue)"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  opacity={0.65}
                />
              )}

              {/* Circle nodes along curve */}
              {primaryPoints.map((p, i) => {
                const isLast = i === chartLength - 1;
                const isHovered = hoveredMonthIdx === i;

                if (isHovered) {
                  return (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={11} fill="var(--accent-blue)" opacity={dark ? 0.35 : 0.22} />
                      <circle cx={p.x} cy={p.y} r={5.5} fill="var(--accent-blue)" stroke={surface} strokeWidth={2} />
                    </g>
                  );
                }

                if (isLast) {
                  return (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={8} fill="var(--accent-blue)" opacity={dark ? 0.28 : 0.18} />
                      <circle cx={p.x} cy={p.y} r={4.5} fill="var(--accent-blue)" />
                    </g>
                  );
                }

                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3.75}
                    fill={surface}
                    stroke="var(--accent-blue)"
                    strokeWidth={2}
                  />
                );
              })}

              {/* Invisible interactive hit columns for flawless mouse/touch detection */}
              {primaryPoints.map((p, i) => (
                <rect
                  key={i}
                  x={p.x - stepX / 2}
                  y={0}
                  width={stepX}
                  height={svgHeight}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredMonthIdx(i)}
                  onTouchStart={() => setHoveredMonthIdx(i)}
                >
                  <title>{`${MONTHS[i]}: ${formatCurrency(p.v)}`}</title>
                </rect>
              ))}

              {/* Month X-Axis Labels */}
              {primaryPoints.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={plotBottom + 22}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={hoveredMonthIdx === i ? 600 : 400}
                  fill={hoveredMonthIdx === i ? "var(--text-primary)" : muted}
                  style={{ transition: "fill 0.15s ease", userSelect: "none" }}
                >
                  {MONTHS[i]?.[0]}
                </text>
              ))}
            </svg>
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
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {sector.shortName} Modules
            </p>
            <span style={{ fontSize: 11, color: "var(--accent-blue)", fontWeight: 500 }}>
              Quick Action
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {sector.features.slice(0, 5).map((f, idx) => {
              const isLast = idx === Math.min(sector.features.length, 5) - 1;
              return (
                <button
                  key={f.title}
                  type="button"
                  onClick={() => handleFeatureClick(f)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    border: "none",
                    borderBottom: isLast ? "none" : `1px solid ${border}`,
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    minHeight: 50,
                    transition: "background-color 0.12s ease-out, transform 0.08s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = subtle)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  title={`Open ${f.title}`}
                >
                  <span
                    style={{
                      color: f.color || "var(--accent-blue)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: subtle,
                      flexShrink: 0,
                    }}
                  >
                    {renderFeatureIcon(f.icon, 16)}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 12, color: muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {f.description}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: muted, flexShrink: 0, opacity: 0.6 }} />
                </button>
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

      <StockAlertsModal
        isOpen={showStockAlerts}
        onClose={() => setShowStockAlerts(false)}
      />
    </div>
  );
}

