"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Check, ArrowRight, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, showToast } from "@/store/slices/uiSlice";
import { switchSector } from "@/store/slices/sectorsSlice";
import { loginAsDemo } from "@/store/slices/authSlice";
import { SECTORS_CATALOG, INITIAL_USER } from "@/store/initialData";
import type { SectorMeta } from "@/types/erp";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
  const dark = theme === "dark";

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

  // Dynamic Theme Colors
  const colors = {
    overlayBg: dark ? "rgba(3, 7, 18, 0.78)" : "rgba(15, 23, 42, 0.48)",
    modalBg: dark ? "#0c1527" : "#ffffff",
    modalBorder: dark ? "#1a2a42" : "#e2e8f0",
    modalShadow: dark
      ? "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
      : "0 20px 50px -10px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04)",
    ink: dark ? "#f8fafc" : "#0f172a",
    muted: dark ? "#94a3b8" : "#64748b",
    headerBg: dark ? "#0a1222" : "#ffffff",
    searchAreaBg: dark ? "#070d18" : "#f8fafc",
    inputBg: dark ? "#0f192b" : "#ffffff",
    inputBorder: dark ? "#1e2e46" : "#cbd5e1",
    cardBg: dark ? "#101c30" : "#ffffff",
    cardBorder: dark ? "#1a2a40" : "#e2e8f0",
    cardHoverBg: dark ? "#13233c" : "#f8fafc",
    cardShadow: dark ? "0 4px 14px rgba(0,0,0,0.3)" : "0 2px 8px rgba(15,23,42,0.04)",
    pillBg: dark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9",
    pillBorder: dark ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
    pillText: dark ? "#cbd5e1" : "#475569",
    footerBg: dark ? "#080e1a" : "#f8fafc",
    footerBorder: dark ? "#1a2a42" : "#e2e8f0",
    closeBtnBg: dark ? "#162236" : "#f1f5f9",
    closeBtnBorder: dark ? "#223552" : "#cbd5e1",
    closeBtnText: dark ? "#f8fafc" : "#1e293b",
  };

  return (
    <>
      <style>{`
        @keyframes sectorModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sectorModalZoomIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sector-modal-overlay {
          animation: sectorModalFadeIn 0.18s ease-out forwards;
        }
        .sector-modal-window {
          animation: sectorModalZoomIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .sector-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 620px) {
          .sector-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }
        @media (min-width: 940px) {
          .sector-cards-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
        }
        @media (max-width: 600px) {
          .sector-modal-header {
            padding: 14px 16px 12px !important;
          }
          .sector-modal-search {
            padding: 10px 16px !important;
          }
          .sector-modal-body {
            padding: 12px 16px !important;
          }
          .sector-modal-footer {
            padding: 10px 16px !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .sector-modal-footer button {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
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
          padding: "12px",
          backgroundColor: colors.overlayBg,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        onClick={handleClose}
      >
        <div
          className="sector-modal-window"
          style={{
            width: "100%",
            maxWidth: "920px",
            maxHeight: "92vh",
            backgroundColor: colors.modalBg,
            border: `1px solid ${colors.modalBorder}`,
            borderRadius: "18px",
            boxShadow: colors.modalShadow,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: colors.ink,
            transition: "background-color 0.2s ease, border-color 0.2s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="sector-modal-header"
            style={{
              padding: "18px 24px 14px",
              borderBottom: `1px solid ${colors.modalBorder}`,
              backgroundColor: colors.headerBg,
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
                  fontWeight: 700,
                  color: "#2563eb",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}
              >
                <Sparkles size={13} style={{ color: "#3b82f6" }} />
                <span>Beyond ERP • 12 Ethiopian Sectors</span>
              </div>
              <h2
                id="sector-modal-title"
                style={{
                  margin: 0,
                  fontSize: "clamp(17px, 2.8vw, 21px)",
                  fontWeight: 800,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.25,
                }}
              >
                Choose Your Industry Sector Demo
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12.5px",
                  color: colors.muted,
                  lineHeight: 1.4,
                }}
              >
                Select an authentic Ethiopian enterprise sector to launch its pre-configured modules, tax rules, and domain records.
              </p>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close modal"
              style={{
                background: "transparent",
                border: `1px solid ${colors.modalBorder}`,
                color: colors.muted,
                cursor: "pointer",
                padding: "6px",
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = dark ? "rgba(255,255,255,0.08)" : "#f1f5f9";
                e.currentTarget.style.color = colors.ink;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.muted;
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Bar Area */}
          <div
            className="sector-modal-search"
            style={{
              padding: "11px 24px",
              borderBottom: `1px solid ${colors.modalBorder}`,
              backgroundColor: colors.searchAreaBg,
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
                  color: colors.muted,
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
                  fontWeight: 500,
                  borderRadius: "10px",
                  border: `1px solid ${colors.inputBorder}`,
                  backgroundColor: colors.inputBg,
                  color: colors.ink,
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.18)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.inputBorder;
                  e.currentTarget.style.boxShadow = "none";
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
                    color: colors.muted,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
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
            className="sector-modal-body"
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
                  color: colors.muted,
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 600 }}>
                  No matching sectors found for &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    color: "#2563eb",
                    background: "none",
                    border: "none",
                    fontWeight: 700,
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
                        padding: "13px 14px",
                        borderRadius: "14px",
                        border: isCurrent
                          ? `1.5px solid ${sec.color}`
                          : `1px solid ${colors.cardBorder}`,
                        backgroundColor: isCurrent
                          ? (dark ? `${sec.color}15` : `${sec.color}0a`)
                          : colors.cardBg,
                        boxShadow: isCurrent
                          ? `0 0 0 1px ${sec.color}, ${colors.cardShadow}`
                          : colors.cardShadow,
                        cursor: "pointer",
                        transition: "all 0.16s ease",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "10px",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = sec.color;
                        e.currentTarget.style.backgroundColor = isCurrent
                          ? (dark ? `${sec.color}20` : `${sec.color}12`)
                          : colors.cardHoverBg;
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = `0 8px 20px -4px ${sec.color}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = isCurrent
                          ? sec.color
                          : colors.cardBorder;
                        e.currentTarget.style.backgroundColor = isCurrent
                          ? (dark ? `${sec.color}15` : `${sec.color}0a`)
                          : colors.cardBg;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = isCurrent
                          ? `0 0 0 1px ${sec.color}, ${colors.cardShadow}`
                          : colors.cardShadow;
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
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "9px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: `${sec.color}1c`,
                              color: sec.color,
                              fontSize: "15px",
                            }}
                          >
                            <i className={sec.icon} />
                          </div>

                          {isCurrent ? (
                            <span
                              style={{
                                fontSize: "10.5px",
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
                              <Check size={11} /> Current
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: colors.muted,
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
                            fontSize: "14px",
                            fontWeight: 700,
                            color: colors.ink,
                            lineHeight: 1.25,
                          }}
                        >
                          {sec.name}
                        </h3>

                        {/* Default Company Name */}
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: sec.color,
                            marginBottom: "5px",
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
                            fontSize: "11.5px",
                            lineHeight: "1.4",
                            color: colors.muted,
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
                          marginTop: "6px",
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
                              backgroundColor: colors.pillBg,
                              border: `1px solid ${colors.pillBorder}`,
                              color: colors.pillText,
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
                              backgroundColor: colors.pillBg,
                              border: `1px solid ${colors.pillBorder}`,
                              color: colors.muted,
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
            )}
          </div>

          {/* Footer Area */}
          <div
            className="sector-modal-footer"
            style={{
              padding: "11px 24px",
              borderTop: `1px solid ${colors.footerBorder}`,
              backgroundColor: colors.footerBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: colors.muted,
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
              style={{
                padding: "6px 16px",
                borderRadius: "8px",
                border: `1px solid ${colors.closeBtnBorder}`,
                backgroundColor: colors.closeBtnBg,
                color: colors.closeBtnText,
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = dark ? "#223552" : "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.closeBtnBg;
              }}
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
