"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Modal } from "@/components/ui/Modal";

export function DomainWorkflowModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const { user } = useAuth();
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

  const inp = (type?: string): React.CSSProperties => ({
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
    ...(type === "number" ? { fontVariantNumeric: "tabular-nums" } : {}),
  });

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

  const isGrid = workflow && workflow.fields.length >= 4;
  const fields = workflow?.fields ?? [];
  const pairs: (typeof fields)[] = [];
  if (isGrid) {
    for (let i = 0; i < fields.length; i += 2) pairs.push(fields.slice(i, i + 2));
  }

  return (
    <Modal title={workflow?.title ?? "New Entry"} isOpen={isOpen} onClose={closeModal} maxWidth={520}>
      {workflow && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {workflow.description && (
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: "18px", paddingBottom: 8, borderBottom: "1px solid var(--border-line)" }}>
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
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
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
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
                  placeholder={field.type === "number" ? "0" : `Enter ${field.label.toLowerCase()}`}
                />
              </label>
            ))
          )}

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
              Save {workflow.recordType}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
