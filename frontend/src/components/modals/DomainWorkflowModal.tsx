"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
    inputBg: dark ? "#0f172a" : "#f8fafc",
    inputBorder: dark ? "#1e2d3d" : "#dbe3ee",
  };
}

export function DomainWorkflowModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const { user } = useAuth();
  const c = useColors();
  const isOpen = modal?.type === "domain-workflow";
  const sector = isOpen ? modal.sector : null;
  const workflow = isOpen ? modal.workflow : null;

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && workflow) {
      const initial: Record<string, string> = {};
      for (const field of workflow.fields) {
        initial[field.name] = field.type === "date" ? new Date().toISOString().slice(0, 10) : "";
      }
      setValues(initial);
    }
  }, [isOpen, workflow]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sector || !workflow) return;

    const result: Record<string, string | number | boolean | null> = {};
    for (const field of workflow.fields) {
      const raw = values[field.name] ?? "";
      if (field.required && !raw) { showToast(`${field.label} is required`); return; }
      result[field.name] = field.type === "number" ? Number(raw || 0) : raw;
    }

    const input = { values: result, ownerName: user?.fullName ?? "", status: "ACTIVE" };

    if (!navigator.onLine) {
      const count = queueOperation({
        action: "CREATE_DOMAIN_WORKFLOW",
        label: workflow.recordType,
        payload: { sectorId: sector.id, workflowKey: workflow.key, input },
      });
      setPendingCount(readQueue().length + count);
      closeModal();
      showToast(`${workflow.recordType} queued offline`);
      return;
    }
    try {
      await api.createDomainWorkflow(sector.id, workflow.key, input);
      closeModal();
      showToast(`${workflow.recordType} created`);
      triggerRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    }
  };

  const inp = (type?: string) => ({
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
    ...(type === "number" ? { fontVariantNumeric: "tabular-nums" } : {}),
  });
  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };

  const isGrid = workflow && workflow.fields.length >= 4;
  const fields = workflow?.fields ?? [];
  const pairs: (typeof fields)[] = [];
  if (isGrid) {
    for (let i = 0; i < fields.length; i += 2) pairs.push(fields.slice(i, i + 2));
  }

  return (
    <Modal title={workflow?.title ?? "New Entry"} isOpen={isOpen} onClose={closeModal} maxWidth={520}>
      {workflow && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {workflow.description && (
            <p style={{ margin: 0, fontSize: 13, color: c.muted, lineHeight: 1.6, paddingBottom: 4, borderBottom: `1px solid ${c.border}` }}>
              {workflow.description}
            </p>
          )}

          {isGrid ? (
            pairs.map((pair, pi) => (
              <div key={pi} style={{ display: "grid", gridTemplateColumns: pair.length === 2 ? "1fr 1fr" : "1fr", gap: 12 }}>
                {pair.map((field) => (
                  <label key={field.name} style={lbl}>
                    {field.label}{field.required ? " *" : ""}
                    <input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      required={field.required}
                      min={field.type === "number" ? "0" : undefined}
                      step={field.type === "number" ? "any" : undefined}
                      value={values[field.name] ?? ""}
                      style={inp(field.type)}
                      onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                      placeholder={field.type === "number" ? "0" : `Enter ${field.label.toLowerCase()}`}
                    />
                  </label>
                ))}
              </div>
            ))
          ) : (
            fields.map((field) => (
              <label key={field.name} style={lbl}>
                {field.label}{field.required ? " *" : ""}
                <input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  required={field.required}
                  min={field.type === "number" ? "0" : undefined}
                  step={field.type === "number" ? "any" : undefined}
                  value={values[field.name] ?? ""}
                  style={inp(field.type)}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                  placeholder={field.type === "number" ? "0" : `Enter ${field.label.toLowerCase()}`}
                />
              </label>
            ))
          )}

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
            Save {workflow.recordType}
          </button>
        </form>
      )}
    </Modal>
  );
}
