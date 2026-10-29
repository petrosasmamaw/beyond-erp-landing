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
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
    inputBg: dark ? "#0f172a" : "#f8fafc",
    inputBorder: dark ? "#1e2d3d" : "#dbe3ee",
  };
}

export function SectorRecordModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const { user } = useAuth();
  const c = useColors();
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

  const inp = {
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
  };
  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };

  return (
    <Modal title={`New Record${sector ? ` — ${sector.name}` : ""}`} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <label style={lbl}>
          Record Type
          <select
            value={form.recordType}
            style={inp}
            onChange={(e) => setForm((f) => ({ ...f, recordType: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            placeholder="0"
          />
        </label>

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
          Save Record
        </button>
      </form>
    </Modal>
  );
}
