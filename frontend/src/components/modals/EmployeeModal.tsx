"use client";

import { type FormEvent, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import type { NewEmployeeInput } from "@/lib/types";
import { validateEthiopianPhone } from "@/lib/format";
import { defaultEmployee } from "@/features/erp/helpers";
import { queueOperation, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

export function EmployeeModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const isOpen = modal?.type === "employee";
  const editing = isOpen ? modal.employee : undefined;

  const [form, setForm] = useState<NewEmployeeInput>(defaultEmployee());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setForm({
        fullName: editing.fullName,
        position: editing.position,
        department: editing.department,
        phone: editing.phone,
        email: editing.email ?? "",
        salary: editing.salary,
        status: editing.status,
        hiredDate: editing.hiredDate.slice(0, 10),
      });
    } else {
      setForm(defaultEmployee());
    }
    setErrors({});
  }, [isOpen, editing]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.position.trim()) errs.position = "Position is required";
    if (!form.department.trim()) errs.department = "Department is required";
    if (!validateEthiopianPhone(form.phone)) errs.phone = "Use format: +251 9XX XXX XXX";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const payload = { ...form, salary: Number(form.salary), hiredDate: new Date(form.hiredDate).toISOString() };

    if (!navigator.onLine && !editing) {
      const count = queueOperation({ action: "CREATE_EMPLOYEE", label: "Employee", payload });
      setPendingCount(readQueue().length + count);
      closeModal();
      showToast("Employee queued offline");
      return;
    }

    try {
      if (editing) {
        await api.updateEmployee(editing.id, payload);
        showToast("Employee updated");
      } else {
        await api.createEmployee(payload);
        showToast("Employee added");
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

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = "var(--accent-blue)");
  const blur = (key: string) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = errors[key] ? "var(--negative)" : "var(--border-line)");

  return (
    <Modal title={editing ? "Edit Employee" : "Add Employee"} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Full name */}
        <label style={lbl}>
          Full Name *
          <input
            value={form.fullName}
            style={inp(!!errors.fullName)}
            onChange={(e) => { setForm((f) => ({ ...f, fullName: e.target.value })); setErrors((er) => ({ ...er, fullName: "" })); }}
            onFocus={focus} onBlur={blur("fullName")}
            placeholder="Abebe Kebede"
          />
          {errors.fullName && <span style={{ color: "var(--negative)", fontSize: 11, textTransform: "none" }}>{errors.fullName}</span>}
        </label>

        {/* Position + Department */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Position *
            <input
              value={form.position}
              style={inp(!!errors.position)}
              onChange={(e) => { setForm((f) => ({ ...f, position: e.target.value })); setErrors((er) => ({ ...er, position: "" })); }}
              onFocus={focus} onBlur={blur("position")}
              placeholder="Sales Manager"
            />
            {errors.position && <span style={{ color: "var(--negative)", fontSize: 11, textTransform: "none" }}>{errors.position}</span>}
          </label>
          <label style={lbl}>
            Department *
            <input
              value={form.department}
              style={inp(!!errors.department)}
              onChange={(e) => { setForm((f) => ({ ...f, department: e.target.value })); setErrors((er) => ({ ...er, department: "" })); }}
              onFocus={focus} onBlur={blur("department")}
              placeholder="Retail"
            />
            {errors.department && <span style={{ color: "var(--negative)", fontSize: 11, textTransform: "none" }}>{errors.department}</span>}
          </label>
        </div>

        {/* Phone + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Phone *
            <input
              value={form.phone}
              style={inp(!!errors.phone)}
              onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors((er) => ({ ...er, phone: "" })); }}
              onFocus={focus} onBlur={blur("phone")}
              placeholder="+251 911 234 567"
            />
            {errors.phone && <span style={{ color: "var(--negative)", fontSize: 11, textTransform: "none" }}>{errors.phone}</span>}
          </label>
          <label style={lbl}>
            Email
            <input
              type="email"
              value={form.email ?? ""}
              style={inp()}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              onFocus={focus} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              placeholder="name@company.et"
            />
          </label>
        </div>

        {/* Salary + Hire Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Monthly Salary (ETB)
            <input
              type="number"
              min="1"
              value={form.salary || ""}
              style={inp()}
              onChange={(e) => setForm((f) => ({ ...f, salary: Number(e.target.value) }))}
              onFocus={focus} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              placeholder="15000"
            />
          </label>
          <label style={lbl}>
            Hire Date
            <input
              type="date"
              value={form.hiredDate.slice(0, 10)}
              style={inp()}
              onChange={(e) => setForm((f) => ({ ...f, hiredDate: e.target.value }))}
              onFocus={focus} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            />
          </label>
        </div>

        {/* Status */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
            Status
          </div>
          <div className="seg-control" style={{ width: "100%", height: 36 }}>
            {(["ACTIVE", "INACTIVE"] as const).map((s) => {
              const active = form.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`seg-button ${active ? "active" : ""}`}
                  style={{
                    color: active
                      ? s === "ACTIVE" ? "var(--positive)" : "var(--negative)"
                      : "var(--text-secondary)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {s === "ACTIVE" ? "Active" : "Inactive"}
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
            <UserPlus size={14} />
            {editing ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
