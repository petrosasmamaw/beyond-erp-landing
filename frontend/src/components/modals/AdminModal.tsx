"use client";

import { type FormEvent, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { permissions } from "@/features/erp/config";
import { toggleValue } from "@/features/erp/helpers";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: dark ? "#111827" : "#ffffff",
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
    inputBg: dark ? "#0f172a" : "#f8fafc",
    inputBorder: dark ? "#1e2d3d" : "#dbe3ee",
  };
}

export function AdminModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const c = useColors();
  const isOpen = modal?.type === "admin";
  const sector = isOpen ? modal.sector : null;

  const [form, setForm] = useState({ fullName: "", contact: "", permissions: ["View", "Reports"] });

  useEffect(() => {
    if (isOpen) setForm({ fullName: "", contact: "", permissions: ["View", "Reports"] });
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sector) return;
    if (!navigator.onLine) {
      const count = queueOperation({ action: "CREATE_ADMIN", label: "Administrator", payload: { sectorId: sector.id, input: form } });
      setPendingCount(readQueue().length + count);
      closeModal();
      showToast("Administrator queued offline");
      return;
    }
    try {
      await api.createAdmin(sector.id, form);
      closeModal();
      showToast("Administrator added");
      triggerRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    }
  };

  const inp = {
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
  };
  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };

  return (
    <Modal title="Add Administrator" isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <label style={lbl}>
          Full Name *
          <input
            value={form.fullName}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            placeholder="Abebe Kebede"
            required
          />
        </label>

        <label style={lbl}>
          Phone or Email *
          <input
            value={form.contact}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            placeholder="+251 911 234 567"
            required
          />
        </label>

        {/* Permissions */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 8 }}>Permissions</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 7 }}>
            {permissions.map((p) => {
              const checked = form.permissions.includes(p);
              return (
                <label
                  key={p}
                  style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
                    borderRadius: 8, cursor: "pointer",
                    border: `1.5px solid ${checked ? "#8b5cf6" : c.border}`,
                    background: checked ? (c.dark ? "#110b24" : "#f5f3ff") : c.alt,
                    transition: "all 0.14s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setForm((f) => ({ ...f, permissions: toggleValue(f.permissions, p) }))}
                    style={{ width: 15, height: 15, accentColor: "#8b5cf6", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: checked ? "#8b5cf6" : c.ink }}>{p}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          style={{
            height: 46, borderRadius: 10, border: 0, marginTop: 2,
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(109,40,217,0.3)",
          }}
        >
          <ShieldCheck size={16} />
          Add Administrator
        </button>
      </form>
    </Modal>
  );
}
