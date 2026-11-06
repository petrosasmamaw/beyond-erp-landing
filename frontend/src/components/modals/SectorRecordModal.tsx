"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Modal } from "@/components/ui/Modal";

export function SectorRecordModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const { user } = useAuth();
  const isOpen = modal?.type === "sector-record";
  const sector = isOpen ? modal.sector : null;
  const template = isOpen ? modal.template : undefined;

  const [form, setForm] = useState({ title: "", recordType: "", value: 0 });

  useEffect(() => {
    if (isOpen && sector) {
      setForm({
        title: template?.title ?? "",
        recordType: template?.recordType ?? sector.features[0] ?? "Operational Record",
        value: 0,
      });
    }
  }, [isOpen, sector, template]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sector) return;
    const payload = {
      sectorId: sector.id,
      recordType: form.recordType,
      title: form.title,
      ownerName: user?.fullName ?? "",
      status: "ACTIVE",
      value: Number(form.value) || 0,
      metadata: template?.metadata ?? { source: "mobile-ui" },
    };
    if (!navigator.onLine) {
      const count = queueOperation({ action: "CREATE_SECTOR_RECORD", label: "Sector record", payload });
      setPendingCount(readQueue().length + count);
      closeModal();
      showToast("Record queued offline");
      return;
    }
    try {
      await api.createSectorRecord(payload);
      closeModal();
      showToast("Record created");
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
    <Modal title={`New Record${sector ? ` — ${sector.name}` : ""}`} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <label style={lbl}>
          Record Type
          <select
            value={form.recordType}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, recordType: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
          >
            {sector?.features.map((feat) => <option key={feat}>{feat}</option>)}
          </select>
        </label>

        <label style={lbl}>
          Title *
          <input
            value={form.title}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            placeholder="Record description"
            required
            autoFocus={!template}
          />
        </label>

        <label style={lbl}>
          Value (ETB)
          <input
            type="number"
            min="0"
            value={form.value || ""}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            placeholder="0"
          />
        </label>

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
            Save Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
