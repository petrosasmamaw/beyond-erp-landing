"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { api } from "@/lib/api";
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
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
    inputBg: dark ? "#0f172a" : "#f8fafc",
    inputBorder: dark ? "#1e2d3d" : "#dbe3ee",
  };
}

export function ManagerModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const c = useColors();
  const isOpen = modal?.type === "manager";
  const sector = isOpen ? modal.sector : null;

  const [form, setForm] = useState({ fullName: "", department: "", assignedFeatures: [] as string[] });

  useEffect(() => {
    if (isOpen && sector) {
      setForm({ fullName: "", department: "", assignedFeatures: sector.features.slice(0, 2) });
    }
  }, [isOpen, sector]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sector) return;
    if (!navigator.onLine) {
      const count = queueOperation({ action: "CREATE_MANAGER", label: "Manager", payload: { sectorId: sector.id, input: form } });
      setPendingCount(readQueue().length + count);
      closeModal();
      showToast("Manager queued offline");
      return;
    }
    try {
      await api.createManager(sector.id, form);
      closeModal();
      showToast("Manager added");
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
    <Modal title="Add Manager" isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Full Name *
            <input
              value={form.fullName}
              style={inp}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder="Hana Tesfaye"
              required
            />
          </label>
          <label style={lbl}>
            Department / Role *
            <input
              value={form.department}
              style={inp}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder="Sales Manager"
              required
            />
          </label>
        </div>

        {/* Feature access */}
        {(sector?.features ?? []).length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 8 }}>Feature Access</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 7 }}>
              {(sector?.features ?? []).map((feature) => {
                const checked = form.assignedFeatures.includes(feature);
                return (
                  <label
                    key={feature}
                    style={{
                      display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
                      borderRadius: 8, cursor: "pointer",
                      border: `1.5px solid ${checked ? "#2563eb" : c.border}`,
                      background: checked ? (c.dark ? "#08121e" : "#eff6ff") : c.alt,
                      transition: "all 0.14s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setForm((f) => ({ ...f, assignedFeatures: toggleValue(f.assignedFeatures, feature) }))}
                      style={{ width: 15, height: 15, accentColor: "#2563eb", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color: checked ? "#2563eb" : c.ink }}>{feature}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          style={{
            height: 46, borderRadius: 10, border: 0, marginTop: 2,
            background: "linear-gradient(135deg, #0891b2, #0e7490)",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(8,145,178,0.3)",
          }}
        >
          <Users size={16} />
          Add Manager
        </button>
      </form>
    </Modal>
  );
}
