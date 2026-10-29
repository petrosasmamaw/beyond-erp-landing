"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/contexts/AppContext";

function getStoredEmail() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("beyond_reset_email") ?? "";
}

export default function ResetPasswordPage() {
  const { toast, showToast } = useApp();
  const router = useRouter();

  const email = getStoredEmail();
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) { showToast("Enter the 6-digit code from your email"); return; }
    if (form.newPassword.length < 8) { showToast("Password must be at least 8 characters"); return; }
    if (form.newPassword !== form.confirmPassword) { showToast("Passwords do not match"); return; }
    setLoading(true);
    try {
      const result = await api.resetPassword({ email, otp, newPassword: form.newPassword });
      showToast(result.message);
      sessionStorage.removeItem("beyond_reset_email");
      router.push("/login");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await api.forgotPassword(email);
      showToast("New code sent");
    } catch { showToast("Failed to resend"); } finally { setLoading(false); }
  };

  return (
    <main className="app-shell">
      <section className="phone-frame auth-frame">
        <div className="login-panel">
          <div className="login-brand">
            <div className="empty-icon"><ShieldCheck size={26} /></div>
            <p className="eyebrow">Beyond ERP System</p>
            <h1>Reset password</h1>
            <span>Enter the 6-digit code sent to <strong>{email || "your email"}</strong> and choose a new password.</span>
          </div>
          <form className="stack" onSubmit={handleSubmit}>
            <label>
              Verification Code
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                style={{ letterSpacing: "8px", fontSize: 24, textAlign: "center" }}
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                placeholder="Min. 8 characters"
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Repeat new password"
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading || otp.length !== 6}>
              {loading ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
              Reset Password
            </button>
          </form>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
            <button type="button" disabled={loading} onClick={resend} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: 13 }}>
              Resend code
            </button>
            <button type="button" onClick={() => router.push("/forgot-password")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13 }}>
              ← Change email
            </button>
          </div>
        </div>
      </section>
      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
