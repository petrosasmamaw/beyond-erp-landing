"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

const PRIORITY_CONFIG = {
  LOW:    { label: "Low" },
  MEDIUM: { label: "Medium" },
  HIGH:   { label: "High" },
  URGENT: { label: "Urgent" },
};

export function WorkItemModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const isOpen = modal?.type === "work-item";
  const sector = isOpen ? modal.sector : null;

  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM" });

  useEffect(() => {
    if (isOpen) setForm({ title: "", description: "", priority: "MEDIUM" });
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sector) return;
    const payload = {
      sectorId: sector.id,
      title: form.title,
      description: form.description || "Created from sector workspace",
      priority: form.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      status: "TODO" as const,
    };
    if (!navigator.onLine) {
      const count = queueOperation({ action: "CREATE_WORK_ITEM", label: "Workflow task", payload });
      setPendingCount(readQueue().length + count);
      closeModal();
      showToast("Task queued offline");
      return;
    }
    try {
      await api.createWorkItem(payload);
      closeModal();
      showToast("Task created");
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
    <Modal title={`New Task${sector ? ` — ${sector.name}` : ""}`} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <label style={lbl}>
          Task Title *
          <input
            value={form.title}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            placeholder="e.g. Complete stock count for main branch"
            required
            autoFocus
          />
        </label>

        <label style={lbl}>
          Description
          <input
            value={form.description}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            placeholder="Optional details"
          />
        </label>

        {/* Priority selector */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
            Priority
          </div>
          <div className="seg-control" style={{ width: "100%", height: 36 }}>
            {(Object.entries(PRIORITY_CONFIG) as [string, { label: string }][]).map(([key, cfg]) => {
              const active = form.priority === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: key }))}
                  className={`seg-button ${active ? "active" : ""}`}
                  style={{
                    color: active ? "var(--accent-blue)" : "var(--text-secondary)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {cfg.label}
                </button>
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
            <Save size={14} />
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
