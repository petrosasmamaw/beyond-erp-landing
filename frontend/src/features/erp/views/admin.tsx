"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { ClipboardList, Lock, Mail, Shield, UserPlus, Users } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AuditLog, EmailLog, RegistrationRequest, User } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSectorDefinition, permissions } from "../config";
import { toggleValue } from "../helpers";
import { useTheme } from "@/contexts/ThemeContext";

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

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  OWNER:   { bg: "#fef3c7", color: "#92400e" },
  ADMIN:   { bg: "#ede9fe", color: "#5b21b6" },
  MANAGER: { bg: "#dbeafe", color: "#1e40af" },
  STAFF:   { bg: "#d1fae5", color: "#065f46" },
  VIEWER:  { bg: "#f1f5f9", color: "#475569" },
};

export function AdminView({
  currentUser,
  showToast,
}: {
  currentUser: User | null;
  showToast: (message: string) => void;
}) {
  const c = useColors();
  const [users, setUsers] = useState<User[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [registrationSearch, setRegistrationSearch] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [userFilters, setUserFilters] = useState({ role: "", status: "" });
  const [auditFilters, setAuditFilters] = useState({ actor: "", method: "", dateFrom: "", dateTo: "" });
  const [emailFilters, setEmailFilters] = useState({ to: "", status: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "Beyond@12345",
    role: "STAFF",
    permissions: ["View", "Edit"],
  });

  const canManageUsers =
    currentUser?.effectivePermissions.includes("*") ||
    currentUser?.effectivePermissions.includes("Users");

  const loadAdmin = useCallback(async () => {
    const tasks: Promise<unknown>[] = [];
    if (canManageUsers) {
      tasks.push(api.users({ q: userSearch, ...userFilters }).then((r) => setUsers(r.items)));
      tasks.push(
        api
          .registrationRequests({ q: registrationSearch, status: registrationStatus })
          .then((r) => setRegistrationRequests(r.items)),
      );
    }
    tasks.push(api.auditLogs(auditFilters).then((r) => setAuditLogs(r.items)));
    tasks.push(api.emailLogs(emailFilters).then((r) => setEmailLogs(r.items)));
    await Promise.all(tasks);
  }, [
    auditFilters,
    canManageUsers,
    emailFilters,
    registrationSearch,
    registrationStatus,
    userFilters,
    userSearch,
  ]);

  useEffect(() => {
    loadAdmin().catch((err) => showToast(err instanceof Error ? err.message : "Admin data failed to load"));
  }, [loadAdmin, showToast]);

  const createUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.createUser(userForm);
    setUserForm({ fullName: "", email: "", phone: "", password: "Beyond@12345", role: "STAFF", permissions: ["View", "Edit"] });
    showToast("User created");
    await loadAdmin();
  };

  const changeOwnPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.changePassword(passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    showToast("Password changed");
  };

  const toggleUserStatus = async (user: User) => {
    if (user.status === "ACTIVE") {
      await api.disableUser(user.id);
      showToast("User disabled");
    } else {
      await api.updateUser(user.id, { status: "ACTIVE" });
      showToast("User reactivated");
    }
    await loadAdmin();
  };

  const resetUserPassword = async (user: User) => {
    const newPassword = window.prompt(`Temporary password for ${user.fullName}`, "Beyond@12345");
    if (!newPassword) return;
    await api.resetUserPassword(user.id, newPassword);
    showToast("Password reset");
  };

  const markRegistrationPaid = async (request: RegistrationRequest) => {
    const ref = window.prompt(`Payment reference for ${request.companyName}`, request.paymentReference ?? "");
    await api.registrationAction(request.id, "mark-paid", { paymentReference: ref || undefined });
    showToast("Registration marked as paid");
    await loadAdmin();
  };

  const approveRegistration = async (request: RegistrationRequest) => {
    const tmpPwd = window.prompt(`Temporary password for ${request.fullName}`, "Beyond@12345");
    if (!tmpPwd) return;
    const result = await api.registrationAction(request.id, "approve", { temporaryPassword: tmpPwd });
    const pwd = "temporaryPassword" in result ? result.temporaryPassword : tmpPwd;
    showToast(`Approved. Temporary password: ${pwd}`);
    await loadAdmin();
  };

  const rejectRegistration = async (request: RegistrationRequest) => {
    const reason = window.prompt(`Reason for rejecting ${request.companyName}`, "");
    if (reason === null) return;
    await api.registrationAction(request.id, "reject", { rejectionReason: reason });
    showToast("Registration rejected");
    await loadAdmin();
  };

  const inp = {
    height: 42, width: "100%", borderRadius: 9,
    border: `1.5px solid ${c.inputBorder}`,
    background: c.inputBg, padding: "0 12px", color: c.ink, fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s",
  };
  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 5, fontSize: 12, fontWeight: 600 as const, color: c.muted };
  const card = {
    background: c.surface, border: `1px solid ${c.border}`,
    borderRadius: 16, padding: "20px 20px",
  };
  const cardHead = {
    display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const,
    marginBottom: 16,
  };
  const iconBadge = (bg: string) => ({
    width: 32, height: 32, borderRadius: 8, background: bg,
    display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
    flexShrink: 0 as const,
  });

  const pendingRegistrations = registrationRequests.filter((r) => r.status !== "APPROVED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { label: "Total Users", value: users.length, color: "#2563eb", bg: c.dark ? "#0c1a2e" : "#eff6ff" },
          { label: "Pending Regs", value: pendingRegistrations, color: "#d97706", bg: c.dark ? "#1c1200" : "#fffbeb" },
          { label: "Audit Events", value: auditLogs.length, color: "#7c3aed", bg: c.dark ? "#1a0d2e" : "#f5f3ff" },
          { label: "Email Logs", value: emailLogs.length, color: "#0891b2", bg: c.dark ? "#061520" : "#ecfeff" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ borderRadius: 14, border: `1px solid ${c.border}`, background: c.surface, padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 800, color }}>{value}</p>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: bg }}>
              <div style={{ height: "100%", borderRadius: 2, background: color, width: "100%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Change Password */}
      <div style={card}>
        <div style={cardHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={iconBadge(c.dark ? "#0c1a2e" : "#eff6ff")}>
              <Lock size={15} color="#2563eb" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Security</p>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.ink }}>Change Password</h3>
            </div>
          </div>
        </div>
        <form onSubmit={(e) => void changeOwnPassword(e)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={lbl}>
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              style={inp}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder="Current password"
              required
            />
          </label>
          <label style={lbl}>
            New Password
            <input
              type="password"
              value={passwordForm.newPassword}
              style={inp}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder="New password"
              required
            />
          </label>
          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              style={{
                height: 42, paddingInline: 20, borderRadius: 9, border: 0,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              }}
            >
              <Lock size={14} /> Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Registration Requests */}
      {canManageUsers && (
        <div style={card}>
          <div style={cardHead}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={iconBadge(c.dark ? "#1c1200" : "#fffbeb")}>
                <Shield size={15} color="#d97706" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Onboarding</p>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.ink }}>Registration Requests</h3>
              </div>
            </div>
            <span style={{ padding: "3px 10px", borderRadius: 20, background: c.dark ? "#1c1200" : "#fffbeb", color: "#d97706", fontSize: 12, fontWeight: 700 }}>
              {pendingRegistrations} open
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <input
              value={registrationSearch}
              style={inp}
              onChange={(e) => setRegistrationSearch(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder="Search company, contact, email"
            />
            <select
              value={registrationStatus}
              style={{ ...inp, appearance: "auto" as const }}
              onChange={(e) => setRegistrationStatus(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            >
              <option value="">All statuses</option>
              {["PENDING_PAYMENT", "PAID", "APPROVED", "REJECTED"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {registrationRequests.length === 0 ? (
              <EmptyState title="No registration requests yet" action="Share the landing page" />
            ) : (
              registrationRequests.map((request) => {
                const sector = getSectorDefinition(request.sectorId);
                const isPending = request.status !== "APPROVED" && request.status !== "REJECTED";
                const statusColor =
                  request.status === "APPROVED" ? { bg: c.dark ? "#032112" : "#d1fae5", color: "#059669" }
                  : request.status === "REJECTED" ? { bg: c.dark ? "#200a0a" : "#fee2e2", color: "#dc2626" }
                  : { bg: c.dark ? "#1c1200" : "#fffbeb", color: "#d97706" };
                return (
                  <div
                    key={request.id}
                    style={{
                      borderRadius: 12, border: `1px solid ${c.border}`,
                      background: c.alt, padding: "14px 16px",
                      display: "flex", flexDirection: "column", gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: c.ink }}>{request.companyName}</p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: c.muted }}>{request.fullName} · {request.email}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted }}>{sector.name} · {request.phone ?? "No phone"} · {formatDate(request.createdAt)}</p>
                        {request.notes && <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted, fontStyle: "italic" }}>{request.notes}</p>}
                      </div>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusColor.bg, color: statusColor.color, whiteSpace: "nowrap" as const }}>
                        {request.status.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                    {isPending && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => void markRegistrationPaid(request)}
                          style={{ flex: 1, height: 34, borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.ink, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => void approveRegistration(request)}
                          style={{ flex: 1, height: 34, borderRadius: 8, border: 0, background: "linear-gradient(135deg, #059669, #047857)", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => void rejectRegistration(request)}
                          style={{ flex: 1, height: 34, borderRadius: 8, border: 0, background: "#f43f5e", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* User Management */}
      {canManageUsers && (
        <div style={card}>
          <div style={cardHead}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={iconBadge(c.dark ? "#0c1828" : "#eff6ff")}>
                <Users size={15} color="#2563eb" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Access Control</p>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.ink }}>User Management</h3>
              </div>
            </div>
          </div>

          {/* Create User Form */}
          <div style={{ border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, marginBottom: 16, background: c.alt }}>
            <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>New User</p>
            <form onSubmit={(e) => void createUser(e)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={lbl}>
                  Full Name *
                  <input
                    value={userForm.fullName}
                    style={inp}
                    onChange={(e) => setUserForm((f) => ({ ...f, fullName: e.target.value }))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                    placeholder="Abebe Kebede"
                    required
                  />
                </label>
                <label style={lbl}>
                  Email *
                  <input
                    type="email"
                    value={userForm.email}
                    style={inp}
                    onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                    placeholder="user@company.com"
                    required
                  />
                </label>
                <label style={lbl}>
                  Role
                  <select
                    value={userForm.role}
                    style={{ ...inp, appearance: "auto" as const }}
                    onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                  >
                    {["OWNER", "ADMIN", "MANAGER", "STAFF", "VIEWER"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <label style={lbl}>
                  Temporary Password
                  <input
                    value={userForm.password}
                    style={inp}
                    onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                    placeholder="Beyond@12345"
                    required
                  />
                </label>
              </div>
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: c.muted }}>Permissions</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
                  {permissions.map((perm) => {
                    const checked = userForm.permissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                          borderRadius: 8, cursor: "pointer",
                          border: `1.5px solid ${checked ? "#7c3aed" : c.border}`,
                          background: checked ? (c.dark ? "#12082a" : "#f5f3ff") : c.surface,
                          transition: "all 0.14s",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setUserForm((f) => ({ ...f, permissions: toggleValue(f.permissions, perm) }))}
                          style={{ width: 14, height: 14, accentColor: "#7c3aed", cursor: "pointer" }}
                        />
                        <span style={{ fontSize: 12, fontWeight: 600, color: checked ? "#7c3aed" : c.ink }}>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                style={{
                  height: 42, paddingInline: 20, borderRadius: 9, border: 0, alignSelf: "flex-start" as const,
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 7,
                  boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                }}
              >
                <UserPlus size={14} /> Create User
              </button>
            </form>
          </div>

          {/* User Search & Filters */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <input
              value={userSearch}
              style={inp}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder="Search users..."
            />
            <select
              value={userFilters.role}
              style={{ ...inp, appearance: "auto" as const }}
              onChange={(e) => setUserFilters((f) => ({ ...f, role: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            >
              <option value="">All roles</option>
              {["OWNER", "ADMIN", "MANAGER", "STAFF", "VIEWER"].map((r) => <option key={r}>{r}</option>)}
            </select>
            <select
              value={userFilters.status}
              style={{ ...inp, appearance: "auto" as const }}
              onChange={(e) => setUserFilters((f) => ({ ...f, status: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            >
              <option value="">All statuses</option>
              {["ACTIVE", "DISABLED"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {users.map((user) => {
              const roleStyle = ROLE_COLORS[user.role] ?? ROLE_COLORS.VIEWER;
              const initials = user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div
                  key={user.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 11,
                    border: `1px solid ${c.border}`, background: c.alt,
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: c.dark ? "#1a2d3d" : "#dbeafe",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#2563eb",
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.fullName}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: c.muted }}>{user.email}</p>
                  </div>
                  <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: roleStyle.bg, color: roleStyle.color, whiteSpace: "nowrap" as const }}>
                    {user.role.toLowerCase()}
                  </span>
                  <span style={{
                    padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: user.status === "ACTIVE" ? (c.dark ? "#032112" : "#d1fae5") : (c.dark ? "#200a0a" : "#fee2e2"),
                    color: user.status === "ACTIVE" ? "#059669" : "#dc2626",
                    whiteSpace: "nowrap" as const,
                  }}>
                    {user.status.toLowerCase()}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => void resetUserPassword(user)}
                      style={{ height: 32, paddingInline: 10, borderRadius: 7, border: `1px solid ${c.border}`, background: "transparent", color: c.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => void toggleUserStatus(user)}
                      style={{
                        height: 32, paddingInline: 10, borderRadius: 7, border: 0,
                        background: user.status === "ACTIVE" ? "#f43f5e" : "#059669",
                        color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {user.status === "ACTIVE" ? "Disable" : "Reactivate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div style={card}>
        <div style={cardHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={iconBadge(c.dark ? "#1a0d2e" : "#f5f3ff")}>
              <ClipboardList size={15} color="#7c3aed" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>System</p>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.ink }}>Audit Logs</h3>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { value: auditFilters.actor, key: "actor", placeholder: "Filter by email", type: "text" },
          ].map(({ value, key, placeholder, type }) => (
            <input
              key={key}
              type={type}
              value={value}
              style={inp}
              onChange={(e) => setAuditFilters((f) => ({ ...f, [key]: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
              placeholder={placeholder}
            />
          ))}
          <select
            value={auditFilters.method}
            style={{ ...inp, appearance: "auto" as const }}
            onChange={(e) => setAuditFilters((f) => ({ ...f, method: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
          >
            <option value="">All methods</option>
            {["POST", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}
          </select>
          <input
            type="date"
            value={auditFilters.dateFrom}
            style={inp}
            onChange={(e) => setAuditFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
          />
          <input
            type="date"
            value={auditFilters.dateTo}
            style={inp}
            onChange={(e) => setAuditFilters((f) => ({ ...f, dateTo: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {auditLogs.map((log) => {
            const methodColor =
              log.method === "DELETE" ? { bg: c.dark ? "#200a0a" : "#fee2e2", color: "#dc2626" }
              : log.method === "POST" ? { bg: c.dark ? "#032112" : "#d1fae5", color: "#059669" }
              : { bg: c.dark ? "#061520" : "#ecfeff", color: "#0891b2" };
            return (
              <div
                key={log.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${c.border}`, background: c.alt,
                }}
              >
                <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800, background: methodColor.bg, color: methodColor.color, flexShrink: 0, fontVariantNumeric: "tabular-nums" as const }}>
                  {log.method}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{log.action}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: c.muted }}>{log.actorEmail ?? "system"} · {formatDate(log.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Logs */}
      <div style={card}>
        <div style={cardHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={iconBadge(c.dark ? "#061520" : "#ecfeff")}>
              <Mail size={15} color="#0891b2" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Nodemailer</p>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.ink }}>Email Logs</h3>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <input
            value={emailFilters.to}
            style={inp}
            onChange={(e) => setEmailFilters((f) => ({ ...f, to: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0891b2")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
            placeholder="Filter by recipient"
          />
          <select
            value={emailFilters.status}
            style={{ ...inp, appearance: "auto" as const }}
            onChange={(e) => setEmailFilters((f) => ({ ...f, status: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0891b2")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
          >
            <option value="">All statuses</option>
            {["SENT", "FAILED", "SKIPPED"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {emailLogs.map((log) => {
            const statusStyle =
              log.status === "SENT" ? { bg: c.dark ? "#032112" : "#d1fae5", color: "#059669" }
              : log.status === "FAILED" ? { bg: c.dark ? "#1c1200" : "#fffbeb", color: "#d97706" }
              : { bg: c.dark ? "#0d1828" : "#f1f5f9", color: "#64748b" };
            return (
              <div
                key={log.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${c.border}`, background: c.alt,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{log.subject}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: c.muted }}>{log.to} · {formatDate(log.createdAt)}</p>
                </div>
                <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, whiteSpace: "nowrap" as const }}>
                  {log.status.toLowerCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
