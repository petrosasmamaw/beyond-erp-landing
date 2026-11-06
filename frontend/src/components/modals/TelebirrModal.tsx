"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";
import { validateEthiopianPhone } from "@/lib/format";
import { defaultTransaction } from "@/features/erp/helpers";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";
import type { Transaction } from "@/lib/types";

export function TelebirrModal() {
  const { modal, closeModal, showToast, sectors, openTransactionModal } = useApp();
  const isOpen = modal?.type === "telebirr";

  const [form, setForm] = useState({ phone: "", amount: 0, purpose: "" });

  const handleSend = (direction: "INCOME" | "EXPENSE") => {
    if (!validateEthiopianPhone(form.phone) || form.amount <= 0) {
      showToast("Add a valid phone and amount");
      return;
    }
    closeModal();
    const base = defaultTransaction(sectors);
    const seed: Transaction = {
      id: `telebirr-${Date.now()}`,
      type: direction,
      amount: Number(form.amount),
      vatAmount: Number(form.amount) * 0.15,
      paymentMethod: "Telebirr",
      description: form.purpose || `Telebirr ${direction === "INCOME" ? "receipt" : "payment"}`,
      sectorId: base.sectorId ?? null,
      status: "COMPLETED",
      synced: true,
      occurredAt: new Date().toISOString(),
      category: base.category,
      createdAt: new Date().toISOString()
    };
    openTransactionModal(seed);
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
    <Modal title="Telebirr Payment" isOpen={isOpen} onClose={closeModal}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 6,
            border: "1px solid var(--border-line)",
            background: "var(--bg-canvas)",
          }}
        >
          <Smartphone size={20} style={{ color: "var(--accent-blue)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
              Telebirr ready UI
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
              API requires Ethio Telecom merchant approval.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={lbl}>
            Phone
            <input
              style={inp}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              placeholder="+251 911 234 567"
            />
          </label>
          <label style={lbl}>
            Amount
            <input
              type="number"
              min="1"
              style={inp}
              value={form.amount || ""}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            />
          </label>
          <label style={lbl}>
            Purpose
            <input
              style={inp}
              value={form.purpose}
              onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              placeholder="Customer payment"
            />
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            paddingTop: 8,
            borderTop: "1px solid var(--border-line)",
          }}
        >
          <button
            className="primary-button"
            type="button"
            style={{ height: 36 }}
            onClick={() => handleSend("EXPENSE")}
          >
            Send Money
          </button>
          <button
            className="secondary-button"
            type="button"
            style={{ height: 36 }}
            onClick={() => handleSend("INCOME")}
          >
            Receive Money
          </button>
        </div>
      </div>
    </Modal>
  );
}
