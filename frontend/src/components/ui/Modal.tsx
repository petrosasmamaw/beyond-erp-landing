import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = 480,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  if (!isOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(4px)",
        animation: "fade-in 0.16s ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <section
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          borderRadius: 16,
          background: dark ? "#111827" : "#ffffff",
          border: `1px solid ${dark ? "#1a2d3d" : "#e8edf5"}`,
          boxShadow: dark
            ? "0 24px 64px rgba(0,0,0,0.6)"
            : "0 24px 64px rgba(15,23,42,0.18)",
          animation: "modal-in 0.2s cubic-bezier(0.2,0,0,1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "18px 20px 0",
        }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: dark ? "#e2e8f0" : "#0f172a", letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 30, height: 30,
              borderRadius: 8,
              border: `1px solid ${dark ? "#1a2d3d" : "#e8edf5"}`,
              background: "transparent",
              color: dark ? "#566070" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "16px 20px 20px" }}>
          {children}
        </div>
      </section>
    </div>
  );
}
