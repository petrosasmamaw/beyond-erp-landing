"use client";

import { type FormEvent, useEffect, useState } from "react";
import { DollarSign, Save } from "lucide-react";
import { api } from "@/lib/api";
import type { NewTransactionInput, Transaction } from "@/lib/types";
import { paymentMethodsWithIcons } from "@/features/erp/config";
import { defaultTransaction } from "@/features/erp/helpers";
import { readQueue, writeQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: dark ? "#111827" : "#ffffff",
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
    inputBg: dark ? "#0f172a" : "#f8fafc",
    inputBorder: dark ? "#1e2d3d" : "#dbe3ee",
  };
}

export function TransactionModal() {
  const { modal, closeModal, showToast, triggerRefresh, sectors, setPendingCount } = useApp();
  const c = useColors();
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

  const inp = (hasErr?: boolean) => ({
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${hasErr ? "#f43f5e" : c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
  });

  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };

  return (
    <Modal title={editing ? "Edit Transaction" : "New Transaction"} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Income / Expense toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(["INCOME", "EXPENSE"] as const).map((type) => {
            const active = form.type === type;
            const accent = type === "INCOME" ? "#10b981" : "#f43f5e";
            return (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type }))}
                style={{
                  height: 42, borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer",
                  border: `1.5px solid ${active ? accent : c.border}`,
                  background: active ? `${accent}18` : c.alt,
                  color: active ? accent : c.muted,
                  transition: "all 0.14s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800 }}>{type === "INCOME" ? "+" : "−"}</span>
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
              <DollarSign size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
              <input
                type="number"
                min="1"
                value={form.amount || ""}
                style={{ ...inp(!!errors.amount), paddingLeft: 32 }}
                onChange={(e) => {
                  const amount = Number(e.target.value);
                  setErrors((er) => { const n = { ...er }; delete n.amount; return n; });
                  setForm((f) => ({ ...f, amount, vatAmount: f.vatAmount > 0 ? amount * 0.15 : 0 }));
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.amount ? "#f43f5e" : c.inputBorder)}
                placeholder="0"
              />
            </div>
            {errors.amount && <span style={{ color: "#f43f5e", fontSize: 11 }}>{errors.amount}</span>}
          </label>

          <label style={lbl}>
            Date
            <input
              type="date"
              value={form.occurredAt.slice(0, 10)}
              max={new Date().toISOString().slice(0, 10)}
              style={inp()}
              onChange={(e) => setForm((f) => ({ ...f, occurredAt: new Date(e.target.value).toISOString() }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.description ? "#f43f5e" : c.inputBorder)}
            placeholder="Weekly branch sales…"
          />
          {errors.description && <span style={{ color: "#f43f5e", fontSize: 11 }}>{errors.description}</span>}
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
          <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 8 }}>Payment Method</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
            {paymentMethodsWithIcons.map(({ method, icon }) => {
              const active = form.paymentMethod === method;
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: method }))}
                  style={{
                    height: 46, borderRadius: 9, cursor: "pointer", transition: "all 0.14s",
                    border: `1.5px solid ${active ? "#2563eb" : c.border}`,
                    background: active ? (c.dark ? "#08121e" : "#eff6ff") : c.alt,
                    color: active ? "#2563eb" : c.muted,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{method}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VAT checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", borderRadius: 9, border: `1px solid ${c.border}`, background: c.alt }}>
          <input
            type="checkbox"
            checked={form.vatAmount > 0}
            style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
            onChange={(e) => setForm((f) => ({ ...f, vatAmount: e.target.checked ? Number(f.amount) * 0.15 : 0 }))}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>Include VAT 15%</div>
            {form.vatAmount > 0 && (
              <div style={{ fontSize: 11, color: "#10b981", marginTop: 1 }}>ETB {form.vatAmount.toFixed(2)} will be added</div>
            )}
          </div>
        </label>

        {/* Submit */}
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
          {editing ? "Update Transaction" : "Save Transaction"}
        </button>
      </form>
    </Modal>
  );
}
