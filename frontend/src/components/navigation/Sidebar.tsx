"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { t, type LangKey, type SectorDefinition } from "@/features/erp/config";
import { getSectorConfig } from "@/features/sectors";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const UNIVERSAL_TOP: { path: string; labelKey: LangKey; icon: string }[] = [
  { path: "/dashboard", labelKey: "home", icon: "fa-solid fa-chart-pie" },
  { path: "/transactions", labelKey: "money", icon: "fa-solid fa-money-bill-transfer" },
  { path: "/employees", labelKey: "team", icon: "fa-solid fa-users" },
];

const UNIVERSAL_BOTTOM: { path: string; labelKey: LangKey; icon: string }[] = [
  { path: "/finance", labelKey: "finance", icon: "fa-solid fa-file-invoice-dollar" },
  { path: "/reports", labelKey: "reports", icon: "fa-solid fa-chart-column" },
  { path: "/admin", labelKey: "admin", icon: "fa-solid fa-shield-halved" },
  { path: "/settings", labelKey: "setup", icon: "fa-solid fa-gear" },
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
  const { theme } = useTheme();
  const dark = theme === "dark";
  const sectorConfig = getSectorConfig(sector.id);

  const bg = dark ? "#070c16" : "#0f172a";
  const surface = dark ? "#0f1826" : "#1e293b";
  const border = dark ? "#14243a" : "#1e3a5f";
  const text = "#dde5f0";
  const muted = "#556070";

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
    icon: string;
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
          minHeight: 40,
          border: 0,
          borderRadius: 9,
          background: active ? "#2563eb" : "transparent",
          color: active ? "#fff" : text,
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          position: "relative",
          transition: "background 0.14s, color 0.14s",
          opacity: active ? 1 : 0.78,
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
        <i
          className={icon}
          style={{ fontSize: 13, flexShrink: 0, width: 17, textAlign: "center" }}
        />
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
              background: active ? "rgba(255,255,255,0.28)" : "#2563eb",
              color: "white",
              fontSize: 10,
              fontWeight: 900,
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
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "Georgia, serif", fontSize: 14, fontStyle: "italic", color: "white", lineHeight: 1 }}>ß</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: text, lineHeight: 1.2 }}>Beyond ERP</div>
              <div style={{ fontSize: 11, color: muted, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 134 }}>
                {companyName}
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            style={{
              width: 28, height: 28, borderRadius: 7, background: "#2563eb",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "Georgia, serif", fontSize: 14, fontStyle: "italic", color: "white", lineHeight: 1 }}>ß</span>
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
          <div
            title={sector.shortName}
            style={{
              width: 30, height: 30, borderRadius: 7,
              background: `${sector.color}22`, color: sector.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}
          >
            <i className={sector.icon} />
          </div>
        ) : (
          <div
            style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "7px 9px", borderRadius: 8, background: surface, border: `1px solid ${border}`,
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: `${sector.color}22`, color: sector.color,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}
            >
              <i className={sector.icon} />
            </div>
            <div>
              <div style={{ fontSize: 9.5, color: muted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Sector</div>
              <div style={{ fontSize: 12, color: text, fontWeight: 600 }}>{sector.shortName}</div>
            </div>
          </div>
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
            <i className="fa-solid fa-wifi" style={{ fontSize: 12 }} />
            <span>Offline-first</span>
          </div>
        )}
        <ThemeToggle />
      </div>
    </aside>
  );
}
