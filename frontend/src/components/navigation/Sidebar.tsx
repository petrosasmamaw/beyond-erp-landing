"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  ArrowLeftRight,
  Users,
  Landmark,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Receipt,
  Boxes,
  Tag,
  Truck,
  TrendingUp,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  Sprout,
  HardHat,
  Key,
  Barcode,
  Banknote,
  Coins,
  Scale,
  HeartHandshake,
  Workflow,
  Layers,
  ShoppingBag,
  Wrench,
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { t, type LangKey, type SectorDefinition } from "@/features/erp/config";
import { getSectorConfig } from "@/features/sectors";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openModal } from "@/store/slices/uiSlice";

function renderNavIcon(icon: LucideIcon | string, size = 15) {
  if (typeof icon !== "string") {
    const IconComp = icon;
    return <IconComp size={size} />;
  }

  const normalized = icon.toLowerCase();
  if (normalized.includes("cash-register")) return <Receipt size={size} />;
  if (normalized.includes("boxes-stacked") || normalized.includes("box") || normalized.includes("cubes")) return <Boxes size={size} />;
  if (normalized.includes("tags") || normalized.includes("tag")) return <Tag size={size} />;
  if (normalized.includes("users") || normalized.includes("people")) return <Users size={size} />;
  if (normalized.includes("truck")) return <Truck size={size} />;
  if (normalized.includes("chart")) return <BarChart3 size={size} />;
  if (normalized.includes("store")) return <ShoppingBag size={size} />;
  if (normalized.includes("industry") || normalized.includes("building") || normalized.includes("landmark")) return <Building2 size={size} />;
  if (normalized.includes("diagram") || normalized.includes("network")) return <Workflow size={size} />;
  if (normalized.includes("clipboard-check") || normalized.includes("circle-check")) return <CheckCircle2 size={size} />;
  if (normalized.includes("clipboard") || normalized.includes("file") || normalized.includes("folder")) return <FileText size={size} />;
  if (normalized.includes("clock")) return <Clock size={size} />;
  if (normalized.includes("seedling") || normalized.includes("leaf") || normalized.includes("wheat")) return <Sprout size={size} />;
  if (normalized.includes("helmet")) return <HardHat size={size} />;
  if (normalized.includes("key")) return <Key size={size} />;
  if (normalized.includes("barcode")) return <Barcode size={size} />;
  if (normalized.includes("money") || normalized.includes("bill") || normalized.includes("check-dollar")) return <Banknote size={size} />;
  if (normalized.includes("coin") || normalized.includes("sack")) return <Coins size={size} />;
  if (normalized.includes("scale")) return <Scale size={size} />;
  if (normalized.includes("shield")) return <ShieldCheck size={size} />;
  if (normalized.includes("briefcase")) return <Briefcase size={size} />;
  if (normalized.includes("hand-holding") || normalized.includes("hands")) return <HeartHandshake size={size} />;
  if (normalized.includes("wrench") || normalized.includes("gear")) return <Wrench size={size} />;
  if (normalized.includes("steth") || normalized.includes("hospital")) return <Stethoscope size={size} />;
  if (normalized.includes("graduation") || normalized.includes("school")) return <GraduationCap size={size} />;
  if (normalized.includes("utensil") || normalized.includes("hotel")) return <UtensilsCrossed size={size} />;

  return <Layers size={size} />;
}

const UNIVERSAL_TOP: { path: string; labelKey: LangKey; icon: LucideIcon }[] = [
  { path: "/dashboard", labelKey: "home", icon: LayoutDashboard },
  { path: "/crm", labelKey: "crm", icon: Briefcase },
  { path: "/transactions", labelKey: "money", icon: ArrowLeftRight },
  { path: "/employees", labelKey: "team", icon: Users },
];

const UNIVERSAL_BOTTOM: { path: string; labelKey: LangKey; icon: LucideIcon }[] = [
  { path: "/finance", labelKey: "finance", icon: Landmark },
  { path: "/reports", labelKey: "reports", icon: BarChart3 },
  { path: "/admin", labelKey: "admin", icon: ShieldCheck },
  { path: "/settings", labelKey: "setup", icon: Settings },
];

export function Sidebar({
  language,
  sector,
  companyName,
  pendingCount,
  collapsed,
  onToggle,
}: {
  language?: string;
  sector: SectorDefinition;
  companyName: string;
  pendingCount: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeUser = useAppSelector((state) => state.auth.user);
  const companyInitial = companyName ? companyName.trim().charAt(0).toUpperCase() : "B";
  const { theme } = useTheme();
  const dark = theme === "dark";
  const sectorConfig = getSectorConfig(sector.id);

  const bg = dark ? "var(--bg-canvas)" : "var(--bg-surface)";
  const surface = dark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)";
  const border = "var(--border-line)";
  const text = dark ? "var(--text-primary)" : "#1e293b";
  const muted = "var(--text-muted)";

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const groupedSectorItems = useMemo(() => {
    const groups: { name: string; items: NonNullable<typeof sectorConfig>["navItems"] }[] = [];
    for (const item of sectorConfig?.navItems ?? []) {
      const name = item.group ?? "Modules";
      const existing = groups.find((group) => group.name === name);
      if (existing) existing.items.push(item);
      else groups.push({ name, items: [item] });
    }
    return groups;
  }, [sectorConfig]);

  const hasSectorGroups = !!sectorConfig?.navItems.some((item) => item.group);
  const activeSectorGroup = useMemo(
    () => groupedSectorItems.find((group) => group.items.some((item) => isActive(`/m/${item.key}`)))?.name,
    [groupedSectorItems, pathname]
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!groupedSectorItems.length) return;
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const group of groupedSectorItems) {
        if (next[group.name] === undefined) {
          next[group.name] = group.name === activeSectorGroup || group.name === groupedSectorItems[0]?.name;
        }
      }
      if (activeSectorGroup) next[activeSectorGroup] = true;
      return next;
    });
  }, [activeSectorGroup, groupedSectorItems]);

  function NavItem({
    path,
    icon,
    label,
    badge,
  }: {
    path: string;
    icon: LucideIcon | string;
    label: string;
    badge?: number;
  }) {
    const active = isActive(path);
    return (
      <button
        key={path}
        onClick={() => router.push(path)}
        title={collapsed ? label : undefined}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          padding: "0 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          minHeight: 38,
          border: 0,
          borderRadius: 8,
          background: active
            ? dark ? "rgba(37, 99, 235, 0.16)" : "rgba(37, 99, 235, 0.08)"
            : "transparent",
          color: active
            ? dark ? "#93c5fd" : "#2563eb"
            : text,
          fontWeight: active ? 600 : 500,
          fontSize: 13,
          cursor: "pointer",
          position: "relative",
          transition: "background 0.14s ease, color 0.14s ease",
          textAlign: "left",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.background = surface;
        }}
        onMouseLeave={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            color: active ? (dark ? "#60a5fa" : "#2563eb") : muted,
            flexShrink: 0,
          }}
        >
          {renderNavIcon(icon, 16)}
        </span>
        {!collapsed && (
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {label}
          </span>
        )}
        {!collapsed && badge && badge > 0 ? (
          <em
            style={{
              minWidth: 18,
              height: 18,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 99,
              background: active ? "rgba(37, 99, 235, 0.2)" : border,
              color: active ? (dark ? "#93c5fd" : "#2563eb") : muted,
              fontSize: 10,
              fontWeight: 700,
              fontStyle: "normal",
              marginLeft: "auto",
            }}
          >
            {badge}
          </em>
        ) : null}
      </button>
    );
  }

  return (
    <aside
      className="desktop-sidebar"
      style={{
        width: collapsed ? 60 : 234,
        display: "flex",
        flexDirection: "column",
        background: bg,
        borderRight: `1px solid ${border}`,
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 0.22s cubic-bezier(0.2,0,0,1)",
      }}
      aria-label="Main navigation"
    >
      {/* Brand header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
          padding: "16px 12px",
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: sector?.color ? `linear-gradient(135deg, ${sector.color}, #1d4ed8)` : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 14,
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
              title={companyName}
            >
              {companyInitial}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: text,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                title={companyName}
              >
                {companyName}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: muted,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: 136,
                  marginTop: 2,
                }}
              >
                {activeUser?.phone || (activeUser?.companyTinNumber ? `TIN: ${activeUser.companyTinNumber}` : sector.name)}
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: sector?.color ? `linear-gradient(135deg, ${sector.color}, #1d4ed8)` : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
            title={companyName}
          >
            {companyInitial}
          </div>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "none", border: "none", color: muted, cursor: "pointer",
            padding: 4, borderRadius: 5, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Sector badge */}
      <div
        style={{
          padding: collapsed ? "8px 0" : "8px 10px",
          borderBottom: `1px solid ${border}`,
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={() => dispatch(openModal({ type: "sector-select" }))}
            title={`Switch Sector (Current: ${sector.shortName})`}
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              background: `${sector.color}22`,
              color: sector.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {renderNavIcon(sector.icon, 14)}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => dispatch(openModal({ type: "sector-select" }))}
            title="Click to switch industry sector workspace"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "100%",
              padding: "7px 9px",
              borderRadius: 8,
              background: surface,
              border: `1px solid ${border}`,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = sector.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                flexShrink: 0,
                background: `${sector.color}22`,
                color: sector.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              {renderNavIcon(sector.icon, 14)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9.5, color: muted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Sector</div>
              <div style={{ fontSize: 12, color: text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sector.shortName}</div>
            </div>
            <span style={{ fontSize: 10, color: muted, padding: "2px 5px", borderRadius: 4, background: "rgba(255,255,255,0.06)" }}>Switch ▾</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="sidebar-nav-scroll"
        style={{
          flex: 1,
          padding: "6px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {UNIVERSAL_TOP.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={t(item.labelKey, language)}
            badge={item.path === "/dashboard" ? pendingCount : undefined}
          />
        ))}

        {sectorConfig && sectorConfig.navItems.length > 0 && (
          <>
            {!collapsed ? (
              <div
                style={{
                  padding: "8px 10px 3px",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  color: muted,
                }}
              >
                {sector.shortName} Modules
              </div>
            ) : (
              <div style={{ height: 1, background: border, margin: "4px 6px" }} />
            )}
            {hasSectorGroups && !collapsed ? (
              groupedSectorItems.map((group) => {
                const open = openGroups[group.name] ?? false;
                const active = group.name === activeSectorGroup;
                return (
                  <div key={group.name} style={{ display: "grid", gap: 1, marginBottom: 2 }}>
                    <button
                      type="button"
                      onClick={() => setOpenGroups((prev) => ({ ...prev, [group.name]: !(prev[group.name] ?? false) }))}
                      style={{
                        width: "100%",
                        minHeight: 30,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: 0,
                        borderRadius: 8,
                        background: active ? surface : "transparent",
                        color: active ? text : muted,
                        padding: "0 9px",
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                      aria-expanded={open}
                    >
                      <ChevronDown
                        size={13}
                        style={{
                          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
                          transition: "transform 0.14s ease",
                          flexShrink: 0
                        }}
                      />
                      <span style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{group.name}</span>
                      <span
                        style={{
                          minWidth: 18,
                          height: 18,
                          borderRadius: 99,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: active ? "#2563eb" : border,
                          color: active ? "#fff" : muted,
                          fontSize: 10,
                          letterSpacing: 0
                        }}
                      >
                        {group.items.length}
                      </span>
                    </button>
                    {open ? (
                      <div style={{ display: "grid", gap: 1, paddingLeft: 8 }}>
                        {group.items.map((item) => (
                          <NavItem key={item.key} path={`/m/${item.key}`} icon={item.icon} label={item.label} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              groupedSectorItems.map((group, groupIndex) => (
                <div key={group.name} style={{ display: "grid", gap: 1 }}>
                  {collapsed && hasSectorGroups && groupIndex > 0 ? (
                    <div style={{ height: 1, background: border, margin: "4px 8px" }} />
                  ) : null}
                  {group.items.map((item) => (
                    <NavItem key={item.key} path={`/m/${item.key}`} icon={item.icon} label={item.label} />
                  ))}
                </div>
              ))
            )}
          </>
        )}

        <div style={{ height: 1, background: border, margin: "4px 6px" }} />
        {UNIVERSAL_BOTTOM.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={t(item.labelKey, language)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${border}`,
          padding: collapsed ? "10px 0" : "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: muted, fontSize: 11 }}>
            <Wifi size={13} style={{ color: "var(--accent-blue)" }} />
            <span>Offline-first</span>
          </div>
        )}
        <ThemeToggle />
      </div>
    </aside>
  );
}
