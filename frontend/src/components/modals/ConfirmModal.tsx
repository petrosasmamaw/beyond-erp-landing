"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function ConfirmModal() {
  const { modal, closeModal } = useApp();

  const isOpen = modal?.type === "confirm";
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
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 8,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-line)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          animation: "modal-in 0.2s cubic-bezier(0.2, 0, 0, 1)",
          padding: "20px 24px 24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} style={{ color: "var(--negative)" }} />
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: "20px" }}>
              Confirm Action
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="icon-button"
            type="button"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message */}
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-muted)", lineHeight: "20px" }}>
          {modal.message}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={closeModal}
            className="secondary-button"
            style={{ height: 36, padding: "0 16px" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => { await modal.onConfirm(); closeModal(); }}
            className="danger-button"
            style={{ height: 36, padding: "0 16px" }}
          >
            <Trash2 size={14} /> Confirm
          </button>
        </div>
      </section>
    </div>
  );
}
