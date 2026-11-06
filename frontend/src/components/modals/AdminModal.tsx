"use client";

import { type FormEvent, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { permissions } from "@/features/erp/config";
import { toggleValue } from "@/features/erp/helpers";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

export function AdminModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
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
    <Modal title="Add Administrator" isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <label style={lbl}>
          Full Name *
          <input
            value={form.fullName}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            placeholder="+251 911 234 567"
            required
          />
        </label>

        {/* Permissions */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
            Permissions
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {permissions.map((p) => {
              const checked = form.permissions.includes(p);
              return (
                <label
                  key={p}
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
                    onChange={() => setForm((f) => ({ ...f, permissions: toggleValue(f.permissions, p) }))}
                    style={{ width: 16, height: 16, accentColor: "var(--accent-blue)", cursor: "pointer", borderRadius: 4 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: checked ? 600 : 500, color: checked ? "var(--accent-blue)" : "var(--text-primary)" }}>
                    {p}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

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
            <ShieldCheck size={14} />
            Add Administrator
          </button>
        </div>
      </form>
    </Modal>
  );
}
