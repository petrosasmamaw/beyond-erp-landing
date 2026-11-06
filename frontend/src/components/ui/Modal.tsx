import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = 520,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}) {
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
        background: "rgba(9, 13, 22, 0.5)",
        animation: "fade-in 0.16s ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <section
        style={{
          width: "min(520px, 92vw)",
          maxWidth,
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          borderRadius: 8,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-line)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          animation: "modal-in 0.2s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-line)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: "20px",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="icon-button"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          {children}
        </div>
      </section>
    </div>
  );
}
