"use client";

import { type FormEvent, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import type { NewEmployeeInput } from "@/lib/types";
import { validateEthiopianPhone } from "@/lib/format";
import { defaultEmployee } from "@/features/erp/helpers";
import { queueOperation, readQueue } from "@/features/erp/offline";
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

export function EmployeeModal() {
  const { modal, closeModal, showToast, triggerRefresh, setPendingCount } = useApp();
  const c = useColors();
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

  const inp = (hasErr?: boolean) => ({
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${hasErr ? "#f43f5e" : c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
  });

  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = "#2563eb");
  const blur = (key: string) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = errors[key] ? "#f43f5e" : c.inputBorder);

  return (
    <Modal title={editing ? "Edit Employee" : "Add Employee"} isOpen={isOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

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
          {errors.fullName && <span style={{ color: "#f43f5e", fontSize: 11 }}>{errors.fullName}</span>}
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
            {errors.position && <span style={{ color: "#f43f5e", fontSize: 11 }}>{errors.position}</span>}
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
            {errors.department && <span style={{ color: "#f43f5e", fontSize: 11 }}>{errors.department}</span>}
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
            {errors.phone && <span style={{ color: "#f43f5e", fontSize: 11 }}>{errors.phone}</span>}
          </label>
          <label style={lbl}>
            Email
            <input
              type="email"
              value={form.email ?? ""}
              style={inp()}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              onFocus={focus} onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
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
              onFocus={focus} onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
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
              onFocus={focus} onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </label>
        </div>

        {/* Status */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 8 }}>Status</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(["ACTIVE", "INACTIVE"] as const).map((s) => {
              const active = form.status === s;
              const accent = s === "ACTIVE" ? "#10b981" : "#f43f5e";
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  style={{
                    height: 40, borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: "pointer",
                    border: `1.5px solid ${active ? accent : c.border}`,
                    background: active ? `${accent}18` : c.alt,
                    color: active ? accent : c.muted,
                    transition: "all 0.14s",
                  }}
                >
                  {s === "ACTIVE" ? "Active" : "Inactive"}
                </button>
              );
            })}
          </div>
        </div>

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
          <UserPlus size={16} />
          {editing ? "Update Employee" : "Add Employee"}
        </button>
      </form>
    </Modal>
  );
}
