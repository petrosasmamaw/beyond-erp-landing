"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
  const { toast, showToast } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      sessionStorage.setItem("beyond_reset_email", email.trim());
      showToast("Reset code sent to your email");
      router.push("/reset-password");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 20, right: 24, zIndex: 10 }}>
        <ThemeToggle />
      </div>
      <section className="phone-frame auth-frame">
        <div className="login-panel">
          <div className="login-brand">
            <div className="empty-icon"><Mail size={26} /></div>
            <p className="eyebrow">Beyond ERP System</p>
            <h1>Forgot password?</h1>
            <span>Enter your account email and we will send you a 6-digit reset code.</span>
          </div>
          <form className="stack" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@yourcompany.com"
                autoFocus
                required
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : <Mail size={18} />}
              Send Reset Code
            </button>
          </form>
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13 }}
          >
            ← Back to Home
          </button>
        </div>
      </section>
      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
