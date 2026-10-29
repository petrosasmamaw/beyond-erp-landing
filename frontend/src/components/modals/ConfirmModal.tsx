"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";

export function ConfirmModal() {
  const { modal, closeModal } = useApp();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const isOpen = modal?.type === "confirm";
  if (!isOpen) return null;

  const surface = dark ? "#111827" : "#ffffff";
  const border  = dark ? "#1a2d3d" : "#e8edf5";
  const ink     = dark ? "#e2e8f0" : "#0f172a";
  const muted   = dark ? "#566070" : "#64748b";

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(4px)",
        animation: "fade-in 0.16s ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <section style={{
        width: "100%", maxWidth: 380, borderRadius: 16,
        background: surface, border: `1px solid ${border}`,
        boxShadow: dark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 24px 64px rgba(15,23,42,0.18)",
        animation: "modal-in 0.2s cubic-bezier(0.2,0,0,1)",
        padding: "20px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: dark ? "#1c0a10" : "#fff1f2", border: `1px solid ${dark ? "#3a1520" : "#fecdd3"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle size={16} style={{ color: "#f43f5e" }} />
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: ink }}>Confirm Action</h2>
          </div>
          <button
            onClick={closeModal}
            style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${border}`, background: "transparent", color: muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Message */}
        <p style={{ margin: "0 0 20px", fontSize: 13.5, color: muted, lineHeight: 1.6 }}>{modal.message}</p>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={async () => { await modal.onConfirm(); closeModal(); }}
            style={{
              height: 42, borderRadius: 9, border: 0,
              background: "#f43f5e", color: "#fff",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Trash2 size={14} /> Confirm
          </button>
          <button
            onClick={closeModal}
            style={{
              height: 42, borderRadius: 9,
              border: `1px solid ${border}`, background: "transparent", color: ink,
              fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
