"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
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

const PRIORITY_CONFIG = {
  LOW:    { color: "#64748b", label: "Low" },
  MEDIUM: { color: "#2563eb", label: "Medium" },
  HIGH:   { color: "#f59e0b", label: "High" },
  URGENT: { color: "#f43f5e", label: "Urgent" },
};

export function WorkItemModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const c = useColors();
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

  const inp = {
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
  };
  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };

  return (
    <Modal title={`New Task${sector ? ` — ${sector.name}` : ""}`} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <label style={lbl}>
          Task Title *
          <input
            value={form.title}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            placeholder="Optional details"
          />
        </label>

        {/* Priority selector */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 8 }}>Priority</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
            {(Object.entries(PRIORITY_CONFIG) as [string, { color: string; label: string }][]).map(([key, cfg]) => {
              const active = form.priority === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: key }))}
                  style={{
                    height: 38, borderRadius: 8, fontWeight: 700, fontSize: 11, cursor: "pointer",
                    border: `1.5px solid ${active ? cfg.color : c.border}`,
                    background: active ? `${cfg.color}18` : c.alt,
                    color: active ? cfg.color : c.muted,
                    transition: "all 0.14s",
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          style={{
            height: 46, borderRadius: 10, border: 0, marginTop: 2,
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
          }}
        >
          <Save size={16} />
          Create Task
        </button>
      </form>
    </Modal>
  );
}
