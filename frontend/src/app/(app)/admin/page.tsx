"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login as reduxLogin } from "@/store/slices/authSlice";
import { AdminView } from "@/features/erp/views/admin";
import { api } from "@/lib/api";
import type { User as ApiUser } from "@/lib/types";

export default function AdminPage() {
  const { user, login: contextLogin } = useAuth();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const activeUser = user ?? (reduxUser ? (reduxUser as unknown as ApiUser) : null);
  const { showToast } = useApp();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [form, setForm] = useState({ email: "admin@gmail.com", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const isAdmin =
    activeUser?.role === "ADMIN" ||
    activeUser?.role === "OWNER" ||
    Boolean(activeUser?.effectivePermissions?.includes("*")) ||
    Boolean(activeUser?.effectivePermissions?.includes("Users"));

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.login(form);
      if (result.user.role !== "ADMIN" && result.user.role !== "OWNER") {
        throw new Error("This account does not have enterprise administrator privileges.");
      }
      contextLogin(result.token, result.user);
      dispatch(
        reduxLogin({
          ...result.user,
          companyName: result.user.companyName ?? undefined,
          companySectorId: result.user.companySectorId ?? undefined,
          companyTinNumber: result.user.companyTinNumber ?? undefined,
        })
      );
      showToast(`Welcome back, ${result.user.fullName}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="screen-wrapper">
        <AdminView currentUser={activeUser} showToast={showToast} />
      </div>
    );
  }

  // Self-contained Admin Sign-in Card for authorized administrators
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const bg = dark ? "#0a1220" : "#ffffff";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = dark ? "#8b9ab0" : "#64748b";
  const inputBg = dark ? "#0f1a2e" : "#f8fafc";

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(37,99,235,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: ink, lineHeight: 1.2 }}>
              Enterprise Admin Portal
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: muted }}>
              Administrator credentials required
            </p>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 600, color: ink }}>
            Admin Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              autoFocus
              placeholder="admin@gmail.com"
              style={{
                height: 42,
                borderRadius: 9,
                border: `1.5px solid ${border}`,
                background: inputBg,
                padding: "0 12px",
                color: ink,
                fontSize: 13.5,
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 600, color: ink }}>
            Password
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                placeholder="••••••••"
                style={{
                  height: 42,
                  width: "100%",
                  borderRadius: 9,
                  border: `1.5px solid ${border}`,
                  background: inputBg,
                  padding: "0 38px 0 12px",
                  color: ink,
                  fontSize: 13.5,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: muted,
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 44,
              borderRadius: 10,
              border: 0,
              marginTop: 4,
              background: loading ? "#3b82f6" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            {loading ? <Loader2 className="spin" size={16} /> : <Lock size={15} />}
            {loading ? "Verifying..." : "Sign In to Admin"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              color: muted,
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            &larr; Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
}
