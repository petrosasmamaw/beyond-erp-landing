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
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "OWNER" ||
    Boolean(currentUser?.effectivePermissions?.includes("*")) ||
    Boolean(currentUser?.effectivePermissions?.includes("Users"));

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

  const markRegistrationUnpaid = async (request: RegistrationRequest) => {
    await api.registrationAction(request.id, "mark-unpaid");
    showToast("Registration marked as unpaid");
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
    height: 36, width: "100%", borderRadius: 6,
    border: `1px solid ${c.border}`,
    background: "var(--bg-surface)", padding: "0 12px", color: c.ink, fontSize: 13,
    outline: "none", boxSizing: "border-box" as const,
  };
  const lbl = { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 500 as const, color: "var(--text-secondary)" };

  const pendingRegistrations = registrationRequests.filter((r) => r.status !== "APPROVED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 32 }}>

      {/* Header */}
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Administration</p>
        <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 600, color: c.ink, lineHeight: "28px", letterSpacing: "-0.01em" }}>System Governance &amp; Audit</h2>
      </div>

      {/* KPI Strip (Single-Surface 4-Cell Pattern) */}
      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        {[
          { label: "Total Users", value: users.length, icon: Users },
          { label: "Pending Regs", value: pendingRegistrations, icon: Shield },
          { label: "Audit Events", value: auditLogs.length, icon: ClipboardList },
          { label: "Email Logs", value: emailLogs.length, icon: Mail },
        ].map(({ label, value, icon: IconComp }) => (
          <div key={label} className="kpi-cell">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
              <span style={{ color: c.muted, display: "flex", alignItems: "center" }}>
                <IconComp size={16} />
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: c.ink, lineHeight: "28px", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Change Password */}
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: c.ink }}>Change Master Password</h3>
        <div className="ui-surface" style={{ padding: 16 }}>
          <form onSubmit={(e) => void changeOwnPassword(e)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={lbl}>
              Current Password
              <input
                type="password"
                value={passwordForm.currentPassword}
                style={inp}
                onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
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
                placeholder="New password"
                required
              />
            </label>
            <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
              <button
                type="submit"
                className="btn-primary"
              >
                <Lock size={14} /> Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Registration Requests */}
      {canManageUsers && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: c.ink }}>Pending Registration Requests</h3>
            <span className="chip" style={{ color: "var(--warning)" }}>
              {pendingRegistrations} open
            </span>
          </div>
          <div className="ui-surface" style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <input
                value={registrationSearch}
                style={inp}
                onChange={(e) => setRegistrationSearch(e.target.value)}
                placeholder="Search company, contact, email"
              />
              <select
                value={registrationStatus}
                style={inp}
                onChange={(e) => setRegistrationStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                {["PENDING_PAYMENT", "PAID", "APPROVED", "REJECTED"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {registrationRequests.length === 0 ? (
                <EmptyState title="No registration requests yet" action="Share the landing page" />
              ) : (
                registrationRequests.map((request, i) => {
                  const sector = getSectorDefinition(request.sectorId);
                  const isPending = request.status !== "APPROVED" && request.status !== "REJECTED";
                  const isLast = i === registrationRequests.length - 1;
                  return (
                    <div
                      key={request.id}
                      style={{
                        padding: "12px 0",
                        borderBottom: isLast ? "none" : `1px solid ${c.border}`,
                        display: "flex", flexDirection: "column", gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: c.ink }}>{request.companyName}</p>
                            {request.isPaid ? (
                              <span className="chip" style={{ color: "var(--positive)" }}>
                                ✓ Payment Done
                              </span>
                            ) : (
                              <span className="chip" style={{ color: "var(--warning)" }}>
                                Payment Pending
                              </span>
                            )}
                          </div>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted }}>{request.fullName} · {request.email}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted }}>
                            {sector.name} · {request.phone ?? "No phone"} · {formatDate(request.createdAt)}
                          </p>
                          {request.paymentMethod && (
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--accent-blue)", fontWeight: 500 }}>
                              Payment Method: {request.paymentMethod} {request.paymentReference ? `· Ref: ${request.paymentReference}` : ""}
                            </p>
                          )}
                          {request.notes && <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted, fontStyle: "italic" }}>{request.notes}</p>}
                        </div>
                        <div className="status-indicator">
                          <span className={`status-dot ${request.status === "APPROVED" ? "positive" : request.status === "REJECTED" ? "negative" : "warning"}`} />
                          <span>{request.status.toLowerCase().replace("_", " ")}</span>
                        </div>
                      </div>
                      {isPending && (
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          {request.isPaid ? (
                            <button
                              onClick={() => void markRegistrationUnpaid(request)}
                              className="btn-secondary btn-small"
                            >
                              Mark Unpaid
                            </button>
                          ) : (
                            <button
                              onClick={() => void markRegistrationPaid(request)}
                              className="btn-secondary btn-small"
                              style={{ color: "var(--positive)" }}
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => void approveRegistration(request)}
                            className="btn-secondary btn-small"
                            style={{ color: "var(--positive)" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => void rejectRegistration(request)}
                            className="btn-secondary btn-small"
                            style={{ color: "var(--negative)" }}
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
        </div>
      )}

      {/* User Management */}
      {canManageUsers && (
        <div>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: c.ink }}>User Management &amp; RBAC Roles</h3>
          <div className="ui-surface" style={{ padding: 16 }}>
            {/* Create User Form */}
            <div style={{ borderBottom: `1px solid ${c.border}`, paddingBottom: 16, marginBottom: 16 }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 500, color: c.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>New User</p>
              <form onSubmit={(e) => void createUser(e)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label style={lbl}>
                    Full Name *
                    <input
                      value={userForm.fullName}
                      style={inp}
                      onChange={(e) => setUserForm((f) => ({ ...f, fullName: e.target.value }))}
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
                      placeholder="user@company.com"
                      required
                    />
                  </label>
                  <label style={lbl}>
                    Role
                    <select
                      value={userForm.role}
                      style={inp}
                      onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))}
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
                      placeholder="Beyond@12345"
                      required
                    />
                  </label>
                </div>
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>Permissions</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {permissions.map((perm) => {
                      const checked = userForm.permissions.includes(perm);
                      return (
                        <label
                          key={perm}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                            borderRadius: 6, cursor: "pointer",
                            border: `1px solid ${c.border}`,
                            background: checked ? "var(--bg-subtle)" : "transparent",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setUserForm((f) => ({ ...f, permissions: toggleValue(f.permissions, perm) }))}
                            style={{ width: 16, height: 16, accentColor: "var(--accent-blue)", cursor: "pointer", borderRadius: 4 }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 400, color: checked ? "var(--accent-blue)" : c.ink }}>{perm}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginTop: 4 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <UserPlus size={14} /> Create User
                  </button>
                </div>
              </form>
            </div>

            {/* User Search & Filters */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <input
                value={userSearch}
                style={inp}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
              />
              <select
                value={userFilters.role}
                style={inp}
                onChange={(e) => setUserFilters((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="">All roles</option>
                {["OWNER", "ADMIN", "MANAGER", "STAFF", "VIEWER"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <select
                value={userFilters.status}
                style={inp}
                onChange={(e) => setUserFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="">All statuses</option>
                {["ACTIVE", "DISABLED"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {users.map((user, i) => {
                const initials = user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                const isLast = i === users.length - 1;
                return (
                  <div
                    key={user.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      minHeight: 52, padding: "0 4px",
                      borderBottom: isLast ? "none" : `1px solid ${c.border}`,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                      background: "var(--bg-subtle)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                    }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.fullName}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted }}>{user.email}</p>
                    </div>
                    <span className="chip">
                      {user.role.toLowerCase()}
                    </span>
                    <div className="status-indicator">
                      <span className={`status-dot ${user.status === "ACTIVE" ? "positive" : "muted"}`} />
                      <span>{user.status.toLowerCase()}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => void resetUserPassword(user)}
                        className="btn-secondary btn-small"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => void toggleUserStatus(user)}
                        className="btn-secondary btn-small"
                        style={{ color: user.status === "ACTIVE" ? "var(--negative)" : "var(--positive)" }}
                      >
                        {user.status === "ACTIVE" ? "Disable" : "Reactivate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: c.ink }}>Immutable Audit Logs Ledger</h3>
        <div className="ui-surface" style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              value={auditFilters.actor}
              style={inp}
              onChange={(e) => setAuditFilters((f) => ({ ...f, actor: e.target.value }))}
              placeholder="Filter by email"
            />
            <select
              value={auditFilters.method}
              style={inp}
              onChange={(e) => setAuditFilters((f) => ({ ...f, method: e.target.value }))}
            >
              <option value="">All methods</option>
              {["POST", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}
            </select>
            <input
              type="date"
              value={auditFilters.dateFrom}
              style={inp}
              onChange={(e) => setAuditFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            />
            <input
              type="date"
              value={auditFilters.dateTo}
              style={inp}
              onChange={(e) => setAuditFilters((f) => ({ ...f, dateTo: e.target.value }))}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {auditLogs.map((log, i) => {
              const isLast = i === auditLogs.length - 1;
              return (
                <div
                  key={log.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    minHeight: 44, padding: "0 4px",
                    borderBottom: isLast ? "none" : `1px solid ${c.border}`,
                  }}
                >
                  <span className="chip" style={{ fontWeight: 600 }}>
                    {log.method}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{log.action}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted }}>{log.actorEmail ?? "system"} · {formatDate(log.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Email Logs */}
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: c.ink }}>Email Notification Logs</h3>
        <div className="ui-surface" style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <input
              value={emailFilters.to}
              style={inp}
              onChange={(e) => setEmailFilters((f) => ({ ...f, to: e.target.value }))}
              placeholder="Filter by recipient"
            />
            <select
              value={emailFilters.status}
              style={inp}
              onChange={(e) => setEmailFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">All statuses</option>
              {["SENT", "FAILED", "SKIPPED"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {emailLogs.map((log, i) => {
              const isLast = i === emailLogs.length - 1;
              return (
                <div
                  key={log.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    minHeight: 44, padding: "0 4px",
                    borderBottom: isLast ? "none" : `1px solid ${c.border}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{log.subject}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: c.muted }}>{log.to} · {formatDate(log.createdAt)}</p>
                  </div>
                  <div className="status-indicator">
                    <span className={`status-dot ${log.status === "SENT" ? "positive" : "warning"}`} />
                    <span>{log.status.toLowerCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

