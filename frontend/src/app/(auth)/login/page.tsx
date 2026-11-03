"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Languages, Loader2, ShieldCheck, Wifi } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch } from "@/store/hooks";
import { loginAsDemo } from "@/store/slices/authSlice";
import { openModal } from "@/store/slices/uiSlice";
import { INITIAL_USER } from "@/store/initialData";
import { SectorSelectModal } from "@/components/modals/SectorSelectModal";

export default function LoginPage() {
  const { user, login } = useAuth();
  const { toast, showToast } = useApp();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleTryDemo = (sectorId: string = "healthcare") => {
    dispatch(loginAsDemo({ sectorId }));
    const companyName =
      sectorId === "retail-trading"
        ? "Merkato Wholesale PLC"
        : "Selam Medical & Trading PLC";
    login("demo-jwt-token-beyond-erp-demo", {
      ...INITIAL_USER,
      companySectorId: sectorId,
      companyName,
    });
    showToast("Logged in as Demo Owner (Yohannes Getachew)");
    router.push("/dashboard");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.login(form);
      login(result.token, result.user);
      showToast(`Welcome, ${result.user.fullName}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const bg = dark ? "#080e19" : "#f5f8ff";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = dark ? "#8b9ab0" : "#64748b";
  const inputBg = dark ? "#0a1220" : "#f8fafc";

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: bg }}>

      {/* Left brand panel — blue gradient identical to detail & payment pages */}
      <div
        style={{
          width: "42%",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 60%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
        className="login-brand-panel"
      >
        {/* Atmospheric orbs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Left Brand Content — Logo and Brand at top of contents, starting from top left */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Logo & Brand Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 30,
              cursor: "pointer",
              width: "fit-content",
            }}
            onClick={() => router.push("/")}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                overflow: "hidden",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.png"
                alt="Beyond ERP"
                width={48}
                height={48}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", color: "#ffffff" }}>
              Beyond ERP
            </span>
          </div>

          <p style={{ margin: "0 0 18px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(191,219,254,0.75)" }}>
            Welcome back • Workspace Access
          </p>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: "clamp(34px, 3.5vw, 54px)", lineHeight: 1.02, color: "white", fontWeight: 400, letterSpacing: "-0.01em" }}>
            The operating<br />system for<br />
            <span style={{ fontStyle: "italic", color: "#bfdbfe" }}>your company.</span>
          </h1>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {([
              { icon: <ShieldCheck size={14} />, label: "Audit ready · 15% VAT built in" },
              { icon: <Wifi size={14} />, label: "Offline-first — no dropped sales" },
              { icon: <Languages size={14} />, label: "Amharic · English · Afan Oromo" },
            ] as const).map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(219,234,254,0.85)", fontSize: 14 }}>
                <span style={{ color: "#93c5fd", flexShrink: 0, display: "flex" }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: "rgba(148,163,184,0.5)", position: "relative" }}>
          © {new Date().getFullYear()} Beyond ERP Ethiopia
        </p>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top row: mobile logo + theme toggle */}
        <div className="reg-topbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px" }}>
          {/* Mobile-only brand */}
          <div className="login-mobile-logo" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/logo.png" alt="Beyond ERP" width={36} height={36} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
              <span style={{ color: dark ? "#ffffff" : "#0f172a", transition: "color 0.15s ease" }}>Beyond ERP</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Centered form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px 48px" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            <div style={{ marginBottom: 30 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: ink, lineHeight: 1.15 }}>
                Sign in
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: muted, lineHeight: 1.5 }}>
                Access your Beyond ERP workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                Email address
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  autoFocus
                  placeholder="you@company.com"
                  style={{
                    height: 44, width: "100%", borderRadius: 10, border: `1.5px solid ${border}`,
                    background: inputBg, padding: "0 14px", color: ink, fontSize: 14,
                    outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                Password
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    placeholder="••••••••"
                    style={{
                      height: 44, width: "100%", borderRadius: 10, border: `1.5px solid ${border}`,
                      background: inputBg, padding: "0 44px 0 14px", color: ink, fontSize: 14,
                      outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: muted, cursor: "pointer",
                      display: "flex", padding: 4,
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
                  height: 46, borderRadius: 10, border: 0, marginTop: 4,
                  background: loading ? "#3b82f6" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white", fontWeight: 700, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                  transition: "opacity 0.15s",
                }}
              >
                {loading && <Loader2 className="spin" size={17} />}
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <ArrowRight size={16} />}
              </button>

              {/* Instant Demo Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 2px" }}>
                <div style={{ flex: 1, height: 1, background: border }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>
                  Or Experience Instantly
                </span>
                <div style={{ flex: 1, height: 1, background: border }} />
              </div>

              {/* TRY DEMO BUTTON */}
              <button
                type="button"
                onClick={() => dispatch(openModal({ type: "sector-select" }))}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 10,
                  border: "1.5px solid rgba(37, 99, 235, 0.4)",
                  background: dark ? "rgba(37, 99, 235, 0.14)" : "rgba(37, 99, 235, 0.08)",
                  color: dark ? "#93c5fd" : "#2563eb",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.15s ease",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.15)",
                }}
              >
                <span style={{ fontSize: 16 }}>⚡</span>
                <span>Try Interactive Demo — Choose Sector</span>
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: border }} />
              <span style={{ fontSize: 12, color: muted }}>or</span>
              <div style={{ flex: 1, height: 1, background: border }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 13, fontWeight: 600, padding: "6px 0" }}
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 13, padding: "6px 0" }}
              >
                ← Back to home
              </button>
            </div>

            {/* Sign-up nudge */}
            <div style={{ marginTop: 28, padding: "14px 16px", borderRadius: 10, border: `1px solid ${border}`, background: dark ? "#0a1220" : "#f8fafc", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: muted }}>
                New to Beyond ERP?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontWeight: 700, fontSize: 13 }}
                >
                  Create a workspace →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
      <SectorSelectModal />
    </main>
  );
}
