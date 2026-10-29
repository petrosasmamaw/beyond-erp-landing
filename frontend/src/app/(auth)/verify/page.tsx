"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";

function getStoredReg() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(sessionStorage.getItem("beyond_reg") ?? "null") as {
      companyName: string; tinNumber: string; sectorId: string;
      fullName: string; email: string; password?: string;
    } | null;
  } catch { return null; }
}

export default function VerifyPage() {
  const { login } = useAuth();
  const { toast, showToast } = useApp();
  const router = useRouter();

  const reg = getStoredReg();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) { showToast("Enter the 6-digit code from your email"); return; }
    if (!reg) { showToast("Registration data missing — please restart"); return; }

    setLoading(true);
    try {
      const result = await api.setup({
        companyName: reg.companyName,
        tinNumber: reg.tinNumber || undefined,
        sectorId: reg.sectorId,
        fullName: reg.fullName,
        email: reg.email,
        password: reg.password ?? "",
        otp
      });
      sessionStorage.removeItem("beyond_reg");
      login(result.token, result.user);
      showToast(`Welcome, ${result.user.fullName}! Your workspace is ready.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!reg) return;
    setLoading(true);
    try {
      await api.setupSendOtp({ companyName: reg.companyName, tinNumber: reg.tinNumber || undefined, sectorId: reg.sectorId, fullName: reg.fullName, email: reg.email, password: reg.password ?? "" });
      showToast("New code sent");
    } catch { showToast("Failed to resend"); } finally { setLoading(false); }
  };

  return (
    <main className="app-shell">
      <section className="phone-frame auth-frame">
        <div className="login-panel">
          <div className="login-brand">
            <div className="empty-icon"><Mail size={26} /></div>
            <p className="eyebrow">Beyond ERP System</p>
            <h1>Check your email</h1>
            <span>
              We sent a 6-digit code to <strong>{reg?.email ?? "your email"}</strong>. Enter it below to finish setup.
            </span>
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
            <button className="primary-button" type="submit" disabled={loading || otp.length !== 6}>
              {loading ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
              Verify &amp; Create Workspace
            </button>
          </form>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
            <button type="button" disabled={loading} onClick={resend} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: 13 }}>
              Resend code
            </button>
            <button type="button" onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13 }}>
              ← Back to form
            </button>
          </div>
        </div>
      </section>
      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
