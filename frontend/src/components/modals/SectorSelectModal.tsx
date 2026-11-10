"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, showToast } from "@/store/slices/uiSlice";
import { switchSector } from "@/store/slices/sectorsSlice";
import { loginAsDemo } from "@/store/slices/authSlice";
import { sectorDefinitions, getSectorDefinition } from "@/features/erp/config";
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
  const currentUser = useAppSelector((state) => state.auth.user);

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
    if (!q) return sectorDefinitions;
    return sectorDefinitions.filter(
      (sec) =>
        sec.name.toLowerCase().includes(q) ||
        sec.shortName.toLowerCase().includes(q) ||
        sec.description.toLowerCase().includes(q)
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

  const handleSelectSector = (sectorId: string, sectorName: string) => {
    // Preserve custom company name entered by user if present
    const existingCompany = currentUser?.companyName;
    const isCustomCompany =
      existingCompany &&
      !existingCompany.includes("Merkato Wholesale") &&
      !existingCompany.includes("Supermarket PLC") &&
      !existingCompany.includes("Hawassa Industrial") &&
      !existingCompany.includes("Rift Valley Coffee") &&
      !existingCompany.includes("Abyssinia Civil") &&
      !existingCompany.includes("Selam General Hospital") &&
      !existingCompany.includes("Horizon International") &&
      !existingCompany.includes("Kuriftu Lakeside") &&
      !existingCompany.includes("Ethio-Djibouti Corridor") &&
      !existingCompany.includes("Oromia Savings") &&
      !existingCompany.includes("Noah Commercial") &&
      !existingCompany.includes("Hope for Children") &&
      !existingCompany.includes("Addis Ababa Sub-City");

    const def = getSectorDefinition(sectorId);
    const companyName = isCustomCompany
      ? existingCompany
      : `${sectorName} Enterprise`;

    dispatch(switchSector(sectorId));
    dispatch(
      loginAsDemo({
        sectorId,
        companyName,
        fullName: currentUser?.fullName || undefined,
        email: currentUser?.email || undefined,
        phone: currentUser?.phone || undefined,
        tinNumber: currentUser?.companyTinNumber || undefined,
      })
    );
    setMockProfile(sectorId, companyName, {
      fullName: currentUser?.fullName || undefined,
      email: currentUser?.email || undefined,
      phone: currentUser?.phone || undefined,
      tinNumber: currentUser?.companyTinNumber || undefined,
    });

    if (authContext?.loginDemo) {
      authContext.loginDemo(sectorId, companyName);
    }

    dispatch(showToast(`Switched to ${sectorName} sector`));

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
        .sector-modal-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 640px) {
          .sector-modal-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 900px) {
          .sector-modal-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 1120px) {
          .sector-modal-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
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
            maxWidth: "1040px",
            maxHeight: "90vh",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-line)",
            borderRadius: "14px",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.18)",
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
              padding: "18px 24px 14px",
              borderBottom: "1px solid var(--border-line)",
              backgroundColor: "var(--bg-surface)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Choose your operating model
              </p>
              <h2
                id="sector-modal-title"
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: "24px",
                }}
              >
                Select the sector for your company
              </h2>
              <span
                style={{
                  display: "block",
                  margin: "4px 0 0",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  lineHeight: "18px",
                }}
              >
                Choose your sector to preview module workflows or continue to company registration and workspace activation.
              </span>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="icon-button"
              type="button"
            >
              <X size={18} />
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
                placeholder="Search sectors, e.g. Retail, Manufacturing, Agriculture, Construction, Healthcare..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: 38,
                  padding: "0 12px 0 36px",
                  fontSize: "13px",
                  borderRadius: "8px",
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

          {/* Sector Selection Grid (exact matching register page) */}
          <div
            style={{
              padding: "20px 24px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {filteredSectors.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 16px",
                  color: "var(--text-muted)",
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600 }}>
                  No matching sectors found for &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    color: "var(--accent-blue)",
                    background: "none",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Clear filter and show all sectors
                </button>
              </div>
            ) : (
              <div className="sector-modal-grid">
                {filteredSectors.map((sector) => {
                  const selected = activeSectorId === sector.id;
                  return (
                    <button
                      type="button"
                      key={sector.id}
                      className={selected ? "selected" : ""}
                      onClick={() => handleSelectSector(sector.id, sector.name)}
                      aria-pressed={selected}
                      style={{
                        minHeight: 160,
                        display: "grid",
                        alignContent: "start",
                        gap: 10,
                        borderRadius: 16,
                        border: selected
                          ? "2px solid var(--accent-blue)"
                          : "1.5px solid var(--border-line)",
                        backgroundColor: selected
                          ? (dark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.05)")
                          : "var(--bg-surface)",
                        padding: 16,
                        textAlign: "left",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        transition: "border-color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) {
                          e.currentTarget.style.borderColor = "var(--accent-blue)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selected) {
                          e.currentTarget.style.borderColor = "var(--border-line)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span
                          className="sector-pick-icon"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: dark ? `${sector.color}22` : sector.tint,
                            color: sector.color,
                            fontSize: 18,
                          }}
                        >
                          <i className={sector.icon} />
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: 4,
                              background: sector.id === "retail-trading"
                                ? (dark ? "rgba(37,99,235,0.25)" : "#dbeafe")
                                : (dark ? "rgba(148,163,184,0.14)" : "#f1f5f9"),
                              color: sector.id === "retail-trading"
                                ? (dark ? "#93c5fd" : "#1d4ed8")
                                : (dark ? "#cbd5e1" : "#475569"),
                            }}
                          >
                            {sector.id === "retail-trading" ? "36,500 ETB / yr (100/day)" : "Ask"}
                          </span>
                          {selected && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                color: "var(--accent-blue)",
                                background: "var(--accent-blue-subtle)",
                                padding: "2px 8px",
                                borderRadius: 12,
                                border: "1px solid var(--accent-blue)",
                              }}
                            >
                              <Check size={12} /> Active
                            </span>
                          )}
                        </div>
                      </div>
                      <strong style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                        {sector.name}
                      </strong>
                      <small style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.45 }}>
                        {sector.description}
                      </small>
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
            <span>
              Click any sector to switch your workspace modules and operational workflow instantly.
            </span>
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
