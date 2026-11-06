"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Check, ArrowRight, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, showToast } from "@/store/slices/uiSlice";
import { switchSector } from "@/store/slices/sectorsSlice";
import { loginAsDemo } from "@/store/slices/authSlice";
import { SECTORS_CATALOG } from "@/store/initialData";
import type { SectorMeta } from "@/types/erp";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { setMockProfile } from "@/lib/mock";

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

  let authContext: ReturnType<typeof useAuth> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authContext = useAuth();
  } catch {
    // Rendered outside AuthContext
  }

  const isOpen =
    isOpenExternal ??
    (reduxActiveModal === "sector-select" ||
      (appContext?.modal && (appContext.modal as { type: string }).type === "sector-select"));

  const [query, setQuery] = useState("");

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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
    setMockProfile(sectorId, companyName);

    if (authContext?.loginDemo) {
      authContext.loginDemo(sectorId, companyName);
    }

    dispatch(showToast(`Switched to ${sectorName} workspace (${companyName})`));

    handleClose();

    // If on auth page or landing page, navigate into app dashboard
    if (!pathname || pathname.startsWith("/login") || pathname === "/" || pathname.startsWith("/register")) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <style>{`
        @keyframes sectorModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sectorModalZoomIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .sector-modal-overlay {
          animation: sectorModalFadeIn 0.16s ease-out forwards;
        }
        .sector-modal-window {
          animation: sectorModalZoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .sector-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 680px) {
          .sector-cards-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sector-modal-title"
        className="sector-modal-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          backgroundColor: "rgba(9, 13, 22, 0.5)",
        }}
        onClick={handleClose}
      >
        <div
          className="sector-modal-window"
          style={{
            width: "100%",
            maxWidth: "920px",
            maxHeight: "90vh",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-line)",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: "var(--text-primary)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--border-line)",
              backgroundColor: "var(--bg-surface)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "4px",
                }}
              >
                <Sparkles size={12} style={{ color: "var(--accent-blue)" }} />
                <span>Beyond ERP • 12 Ethiopian Sectors</span>
              </div>
              <h2
                id="sector-modal-title"
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: "24px",
                }}
              >
                Choose Your Industry Sector Demo
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  lineHeight: "18px",
                }}
              >
                Select an authentic Ethiopian enterprise sector to launch its pre-configured modules, tax rules, and domain records.
              </p>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="icon-button"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search Bar Area */}
          <div
            style={{
              padding: "10px 24px",
              borderBottom: "1px solid var(--border-line)",
              backgroundColor: "var(--bg-canvas)",
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
                size={15}
                style={{
                  position: "absolute",
                  left: "12px",
                  color: "var(--text-muted)",
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
                  height: 36,
                  padding: "0 12px 0 36px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-line)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    padding: "4px 6px",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 12 Sectors Responsive Grid */}
          <div
            style={{
              padding: "16px 24px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {filteredSectors.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 16px",
                  color: "var(--text-muted)",
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 500 }}>
                  No matching sectors found for &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    color: "var(--accent-blue)",
                    background: "none",
                    border: "none",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Clear filter and show all 12 sectors
                </button>
              </div>
            ) : (
              <div className="sector-cards-grid">
                {filteredSectors.map((sec: SectorMeta) => {
                  const isCurrent = activeSectorId === sec.id && isAuthenticated;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleSelectSector(sec.id, sec.defaultCompanyName, sec.name)}
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        borderRadius: "8px",
                        border: isCurrent
                          ? "1px solid var(--accent-blue)"
                          : "1px solid var(--border-line)",
                        backgroundColor: isCurrent
                          ? "var(--accent-blue-subtle)"
                          : "var(--bg-surface)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "10px",
                        position: "relative",
                        outline: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                        }
                      }}
                    >
                      {/* Top icon and active/launch badge */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: isCurrent ? "var(--accent-blue)" : "var(--text-muted)",
                              fontSize: "16px",
                              lineHeight: 1,
                            }}
                          >
                            <i className={sec.icon} />
                          </span>

                          {isCurrent ? (
                            <span
                              className="chip"
                              style={{
                                color: "var(--accent-blue)",
                                borderColor: "var(--accent-blue)",
                                backgroundColor: "var(--accent-blue-subtle)",
                              }}
                            >
                              <Check size={10} /> Current
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 500,
                                color: "var(--text-muted)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              Launch <ArrowRight size={11} />
                            </span>
                          )}
                        </div>

                        {/* Sector Name */}
                        <h3
                          style={{
                            margin: "0 0 2px",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            lineHeight: "18px",
                          }}
                        >
                          {sec.name}
                        </h3>

                        {/* Default Company Name */}
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                            marginBottom: "6px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sec.defaultCompanyName}
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            lineHeight: "16px",
                            color: "var(--text-muted)",
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
                          <span key={mod} className="chip">
                            {mod}
                          </span>
                        ))}
                        {sec.keyModules.length > 3 && (
                          <span className="chip">
                            +{sec.keyModules.length - 3}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div
            style={{
              padding: "12px 24px",
              borderTop: "1px solid var(--border-line)",
              backgroundColor: "var(--bg-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>💡</span>
              <span>
                <strong>Zero Backend &amp; Zero DB:</strong> 100% in-memory Redux Toolkit. Resets cleanly on refresh.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="secondary-button"
              style={{ height: 36, padding: "0 16px" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SectorSelectModal;
