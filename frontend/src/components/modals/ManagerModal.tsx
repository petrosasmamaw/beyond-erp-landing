"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { api } from "@/lib/api";
import { toggleValue } from "@/features/erp/helpers";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

export function ManagerModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
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

  const inp: React.CSSProperties = {
    height: 36,
    width: "100%",
    borderRadius: 6,
    border: "1px solid var(--border-line)",
    background: "var(--bg-surface)",
    padding: "0 12px",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  const lbl: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 11,
    fontWeight: 500,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <Modal title="Add Manager" isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Full Name *
            <input
              value={form.fullName}
              style={inp}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
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
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              placeholder="Sales Manager"
              required
            />
          </label>
        </div>

        {/* Feature access */}
        {(sector?.features ?? []).length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
              Feature Access
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {(sector?.features ?? []).map((feature) => {
                const checked = form.assignedFeatures.includes(feature);
                return (
                  <label
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      border: `1px solid ${checked ? "var(--accent-blue)" : "var(--border-line)"}`,
                      background: checked ? "var(--accent-blue-subtle)" : "var(--bg-surface)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setForm((f) => ({ ...f, assignedFeatures: toggleValue(f.assignedFeatures, feature) }))}
                      style={{ width: 16, height: 16, accentColor: "var(--accent-blue)", cursor: "pointer", borderRadius: 4 }}
                    />
                    <span style={{ fontSize: 13, fontWeight: checked ? 600 : 500, color: checked ? "var(--accent-blue)" : "var(--text-primary)" }}>
                      {feature}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            paddingTop: 12,
            borderTop: "1px solid var(--border-line)",
          }}
        >
          <button
            type="button"
            className="secondary-button"
            onClick={closeModal}
            style={{ height: 36, padding: "0 16px" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            style={{ height: 36, padding: "0 16px" }}
          >
            <Users size={14} />
            Add Manager
          </button>
        </div>
      </form>
    </Modal>
  );
}
