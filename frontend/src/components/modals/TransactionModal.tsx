"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import type { NewTransactionInput } from "@/lib/types";
import { paymentMethodsWithIcons } from "@/features/erp/config";
import { defaultTransaction } from "@/features/erp/helpers";
import { readQueue, writeQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

export function TransactionModal() {
  const { modal, closeModal, showToast, triggerRefresh, sectors, setPendingCount } = useApp();
  const isOpen = modal?.type === "transaction";
  const editing = isOpen ? modal.transaction : undefined;

  const [form, setForm] = useState<NewTransactionInput>(defaultTransaction(sectors));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setForm({
        type: editing.type,
        amount: editing.amount,
        description: editing.description,
        category: editing.category,
        sectorId: editing.sectorId ?? null,
        paymentMethod: editing.paymentMethod,
        vatAmount: editing.vatAmount,
        status: editing.status,
        synced: editing.synced,
        occurredAt: editing.occurredAt,
      });
    } else {
      setForm(defaultTransaction(sectors));
    }
    setErrors({});
  }, [isOpen, editing, sectors]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.amount || form.amount <= 0) errs.amount = "Enter an amount greater than 0";
    if (form.description.trim().length < 2) errs.description = "At least 2 characters required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const payload: NewTransactionInput = {
      ...form,
      amount: Number(form.amount),
      vatAmount: Number(form.vatAmount),
      occurredAt: new Date(form.occurredAt).toISOString(),
      synced: navigator.onLine,
    };

    if (!navigator.onLine && !editing) {
      const queue = readQueue();
      writeQueue([...queue, { ...payload, localId: crypto.randomUUID(), synced: false }]);
      setPendingCount(queue.length + 1);
      closeModal();
      showToast("Saved offline. Will sync later.");
      return;
    }

    try {
      if (editing) {
        await api.updateTransaction(editing.id, payload);
        showToast("Transaction updated");
      } else {
        await api.createTransaction(payload);
        showToast("Transaction saved");
      }
      closeModal();
      triggerRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    }
  };

  const inp = (hasErr?: boolean): React.CSSProperties => ({
    height: 36,
    width: "100%",
    borderRadius: 6,
    border: `1px solid ${hasErr ? "var(--negative)" : "var(--border-line)"}`,
    background: "var(--bg-surface)",
    padding: "0 12px",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
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

  return (
    <Modal title={editing ? "Edit Transaction" : "New Transaction"} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Income / Expense toggle using segmented control */}
        <div className="seg-control" style={{ width: "100%", height: 36 }}>
          {(["INCOME", "EXPENSE"] as const).map((type) => {
            const active = form.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type }))}
                className={`seg-button ${active ? "active" : ""}`}
                style={{
                  color: active
                    ? type === "INCOME" ? "var(--positive)" : "var(--negative)"
                    : "var(--text-secondary)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span style={{ fontSize: 14, marginRight: 4 }}>{type === "INCOME" ? "+" : "−"}</span>
                {type === "INCOME" ? "Income" : "Expense"}
              </button>
            );
          })}
        </div>

        {/* Amount + Date side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Amount (ETB) *
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  pointerEvents: "none",
                }}
              >
                ETB
              </span>
              <input
                type="number"
                min="1"
                value={form.amount || ""}
                style={{ ...inp(!!errors.amount), paddingLeft: 42 }}
                onChange={(e) => {
                  const amount = Number(e.target.value);
                  setErrors((er) => { const n = { ...er }; delete n.amount; return n; });
                  setForm((f) => ({ ...f, amount, vatAmount: f.vatAmount > 0 ? amount * 0.15 : 0 }));
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.amount ? "var(--negative)" : "var(--border-line)")}
                placeholder="0"
              />
            </div>
            {errors.amount && <span style={{ color: "var(--negative)", fontSize: 11, textTransform: "none" }}>{errors.amount}</span>}
          </label>

          <label style={lbl}>
            Date
            <input
              type="date"
              value={form.occurredAt.slice(0, 10)}
              max={new Date().toISOString().slice(0, 10)}
              style={inp()}
              onChange={(e) => setForm((f) => ({ ...f, occurredAt: new Date(e.target.value).toISOString() }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            />
          </label>
        </div>

        {/* Description */}
        <label style={lbl}>
          Description *
          <input
            value={form.description}
            style={inp(!!errors.description)}
            onChange={(e) => {
              setErrors((er) => { const n = { ...er }; delete n.description; return n; });
              setForm((f) => ({ ...f, description: e.target.value }));
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.description ? "var(--negative)" : "var(--border-line)")}
            placeholder="Weekly branch sales…"
          />
          {errors.description && <span style={{ color: "var(--negative)", fontSize: 11, textTransform: "none" }}>{errors.description}</span>}
        </label>

        {/* Sector / Category */}
        <label style={lbl}>
          Category
          <select
            value={form.sectorId ?? ""}
            style={inp()}
            onChange={(e) => {
              const sector = sectors.find((s) => s.id === e.target.value);
              setForm((f) => ({ ...f, sectorId: sector?.id ?? null, category: sector?.name ?? f.category }));
            }}
          >
            {sectors.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
          </select>
        </label>

        {/* Payment method */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
            Payment Method
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {paymentMethodsWithIcons.map(({ method, icon }) => {
              const active = form.paymentMethod === method;
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: method }))}
                  style={{
                    height: 40,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: `1px solid ${active ? "var(--accent-blue)" : "var(--border-line)"}`,
                    background: active ? "var(--accent-blue-subtle)" : "var(--bg-surface)",
                    color: active ? "var(--accent-blue)" : "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{method}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VAT checkbox */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid var(--border-line)",
            background: "var(--bg-canvas)",
          }}
        >
          <input
            type="checkbox"
            checked={form.vatAmount > 0}
            style={{ width: 16, height: 16, accentColor: "var(--accent-blue)", cursor: "pointer", borderRadius: 4 }}
            onChange={(e) => setForm((f) => ({ ...f, vatAmount: e.target.checked ? Number(f.amount) * 0.15 : 0 }))}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Include VAT 15%</div>
            {form.vatAmount > 0 && (
              <div style={{ fontSize: 11, color: "var(--positive)", marginTop: 2 }}>ETB {form.vatAmount.toFixed(2)} will be added</div>
            )}
          </div>
        </label>

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
            {editing ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
