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

  return (
    <Modal title="Telebirr Payment" isOpen={isOpen} onClose={closeModal}>
      <div className="telebirr-mark">
        <Smartphone size={26} />
        <div>
          <strong>Telebirr ready UI</strong>
          <span>API requires Ethio Telecom merchant approval.</span>
        </div>
      </div>
      <div className="stack">
        <label>
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+251 911 234 567"
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            min="1"
            value={form.amount || ""}
            onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
          />
        </label>
        <label>
          Purpose
          <input
            value={form.purpose}
            onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
            placeholder="Customer payment"
          />
        </label>
        <div className="form-grid">
          <button className="primary-button" type="button" onClick={() => handleSend("EXPENSE")}>
            Send Money
          </button>
          <button className="secondary-button" type="button" onClick={() => handleSend("INCOME")}>
            Receive Money
          </button>
        </div>
      </div>
    </Modal>
  );
}
