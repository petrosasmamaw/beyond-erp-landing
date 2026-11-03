"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Check, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, showToast } from "@/store/slices/uiSlice";
import { switchSector } from "@/store/slices/sectorsSlice";
import { loginAsDemo } from "@/store/slices/authSlice";
import { SECTORS_CATALOG } from "@/store/initialData";
import type { SectorMeta } from "@/types/erp";
import { useApp } from "@/contexts/AppContext";

export function SectorSelectModal({
  isOpenExternal,
  onCloseExternal,
}: {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const reduxActiveModal = useAppSelector((state) => state.ui.activeModal);
  const activeSectorId = useAppSelector((state) => state.sectors.activeSectorId);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  let appContext: ReturnType<typeof useApp> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    appContext = useApp();
  } catch {
    // Rendered outside AppContext (e.g., on login page)
  }

  const isOpen =
    isOpenExternal ??
    (reduxActiveModal === "sector-select" ||
      (appContext?.modal && (appContext.modal as { type: string }).type === "sector-select"));

  const [query, setQuery] = useState("");

  const filteredSectors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTORS_CATALOG;
    return (SECTORS_CATALOG as SectorMeta[]).filter(
      (sec: SectorMeta) =>
        sec.name.toLowerCase().includes(q) ||
        sec.defaultCompanyName.toLowerCase().includes(q) ||
        sec.description.toLowerCase().includes(q) ||
        sec.keyModules.some((m: string) => m.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onCloseExternal) {
      onCloseExternal();
    }
    dispatch(closeModal());
    if (appContext?.closeModal) {
      appContext.closeModal();
    }
  };

  const handleSelectSector = (sectorId: string, companyName: string, sectorName: string) => {
    dispatch(switchSector(sectorId));
    dispatch(loginAsDemo({ sectorId, companyName }));
    dispatch(showToast(`Switched to ${sectorName} workspace (${companyName})`));

    handleClose();

    // If on auth page or landing page, navigate into app dashboard
    if (!pathname || pathname.startsWith("/login") || pathname === "/" || pathname.startsWith("/register")) {
      router.push("/dashboard");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(5, 10, 20, 0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "90vh",
          backgroundColor: "var(--card-surface, #0f1a2e)",
          border: "1px solid var(--border-color, #1e2d3d)",
          borderRadius: "18px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border-color, #1e2d3d)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "4px",
              }}
            >
              <span>⚡ Beyond ERP 12-Sector Catalog</span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--ink, #ffffff)",
                lineHeight: 1.25,
              }}
            >
              Choose Your Industry Sector Demo
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "var(--muted, #94a3b8)",
              }}
            >
              Select an Ethiopian enterprise sector to explore pre-configured modules, tax rules, and workflows.
            </p>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted, #94a3b8)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--muted, #94a3b8)";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid var(--border-color, #1e2d3d)",
            backgroundColor: "rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                color: "var(--muted, #94a3b8)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search sectors, e.g. Retail, Coffee, Hospital, Construction, Logistics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                fontSize: "13px",
                borderRadius: "10px",
                border: "1px solid var(--border-color, #1e2d3d)",
                backgroundColor: "var(--bg-subtle, rgba(255,255,255,0.04))",
                color: "var(--ink, #ffffff)",
                outline: "none",
              }}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "var(--muted, #94a3b8)",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 12 Sectors Grid */}
        <div
          style={{
            padding: "18px 24px",
            overflowY: "auto",
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "12px",
          }}
        >
          {filteredSectors.map((sec) => {
            const isCurrent = activeSectorId === sec.id && isAuthenticated;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelectSector(sec.id, sec.defaultCompanyName, sec.name)}
                style={{
                  textAlign: "left",
                  padding: "14px",
                  borderRadius: "14px",
                  border: isCurrent
                    ? `1.5px solid ${sec.color}`
                    : "1px solid var(--border-color, #1e2d3d)",
                  backgroundColor: isCurrent
                    ? `${sec.color}10`
                    : "var(--bg-subtle, rgba(255,255,255,0.02))",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "10px",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = sec.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 6px 16px -4px ${sec.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isCurrent
                    ? sec.color
                    : "var(--border-color, #1e2d3d)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Sector Header */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: `${sec.color}20`,
                        color: sec.color,
                        fontSize: "15px",
                      }}
                    >
                      <i className={sec.icon} />
                    </div>

                    {isCurrent ? (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          backgroundColor: `${sec.color}25`,
                          color: sec.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Check size={10} /> Active
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--muted, #64748b)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        Launch <ArrowRight size={12} />
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 2px",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--ink, #ffffff)",
                    }}
                  >
                    {sec.name}
                  </h3>

                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: sec.color,
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sec.defaultCompanyName}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "11.5px",
                      lineHeight: "1.4",
                      color: "var(--muted, #94a3b8)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {sec.description}
                  </p>
                </div>

                {/* Key Modules Pills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginTop: "4px",
                  }}
                >
                  {sec.keyModules.slice(0, 3).map((mod: string) => (
                    <span
                      key={mod}
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "5px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "var(--muted, #94a3b8)",
                      }}
                    >
                      {mod}
                    </span>
                  ))}
                  {sec.keyModules.length > 3 && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 5px",
                        borderRadius: "5px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "var(--muted, #64748b)",
                      }}
                    >
                      +{sec.keyModules.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info note */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid var(--border-color, #1e2d3d)",
            backgroundColor: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--muted, #94a3b8)",
          }}
        >
          <span>
            💡 <strong>Instant In-Memory Demo:</strong> All modules, staff, transactions &amp; tax configurations load dynamically. No database required.
          </span>
          <button
            onClick={handleClose}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, #1e2d3d)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "var(--ink, #ffffff)",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SectorSelectModal;

