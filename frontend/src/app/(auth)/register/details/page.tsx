"use client";

import { type CSSProperties, type FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, Languages, Loader2, ShieldCheck, Wifi } from "lucide-react";
import { api } from "@/lib/api";
import { getSectorDefinition } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

function RegisterDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const sectorId = searchParams.get("sectorId") ?? "";
  const companySector = getSectorDefinition(sectorId);

  const [form, setForm] = useState({
    companyName: "",
    tinNumber: "",
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem("beyond_reg_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((f) => ({
          ...f,
          companyName: parsed.companyName || f.companyName,
          tinNumber: parsed.tinNumber || f.tinNumber,
          fullName: parsed.fullName || f.fullName,
          email: parsed.email || f.email,
          phone: parsed.phone || f.phone,
          notes: parsed.notes || f.notes,
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!sectorId) errs.sectorId = "No sector selected. Please choose a sector.";
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (!form.fullName.trim()) errs.fullName = "Your full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      sessionStorage.setItem("beyond_reg_draft", JSON.stringify({ ...form, sectorId }));
      router.push(`/register/payment?sectorId=${encodeURIComponent(sectorId)}`);
    } catch {
      router.push(`/register/payment?sectorId=${encodeURIComponent(sectorId)}`);
    }
  };

  const bg = dark ? "#080e19" : "#f5f8ff";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = "#64748b";
  const inputBg = dark ? "#0a1220" : "#f8fafc";
  const errorBorder = "#fda4af";
  const errorText = "#e11d48";
  const sectorColor = companySector.color || "#2563eb";
  const sectorTint = dark ? "rgba(37,99,235,0.14)" : companySector.tint || "#eff6ff";
  const backToSectorHref = sectorId ? `/register?sectorId=${sectorId}` : "/register";

  const labelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: ink,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
    gap: 14,
  };

  const fieldStyle = (hasError = false): CSSProperties => ({
    height: 44,
    width: "100%",
    borderRadius: 10,
    border: `1.5px solid ${hasError ? errorBorder : border}`,
    background: inputBg,
    padding: "0 14px",
    color: ink,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  });

  const notesStyle = (hasError = false): CSSProperties => ({
    minHeight: 84,
    width: "100%",
    borderRadius: 10,
    border: `1.5px solid ${hasError ? errorBorder : border}`,
    background: inputBg,
    padding: "12px 14px",
    color: ink,
    fontSize: 14,
    lineHeight: 1.45,
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  });

  const errorStyle: CSSProperties = {
    margin: "2px 0 0",
    color: errorText,
    fontSize: 12,
    fontWeight: 600,
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: bg }}>
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

        {/* Left Brand Content — Logo and Brand at top of contents, starting from left */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Logo & Brand Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 30,
              cursor: "pointer",
              width: "fit-content"
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
                flexShrink: 0
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
                  display: "block"
                }}
              />
            </div>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em" }}>
              <span style={{ color: "#ffffff" }}>Beyond</span>{" "}
              <span style={{ color: "#93c5fd" }}>ERP</span>
            </span>
          </div>

          <p style={{ margin: "0 0 18px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(191,219,254,0.75)" }}>
            Step 2 of 3 • Workspace onboarding
          </p>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: "clamp(34px, 3.5vw, 54px)", lineHeight: 1.02, color: "white", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Request access<br />for your<br />
            <span style={{ fontStyle: "italic", color: "#bfdbfe" }}>company workspace.</span>
          </h1>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {([
              { icon: <ShieldCheck size={14} />, label: "Admin-reviewed setup after payment" },
              { icon: <Wifi size={14} />, label: "Offline-first workflows from day one" },
              { icon: <Languages size={14} />, label: "Amharic, English, and Afan Oromo ready" },
            ] as const).map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(219,234,254,0.85)", fontSize: 14 }}>
                <span style={{ color: "#93c5fd", flexShrink: 0 }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: "rgba(148,163,184,0.5)", position: "relative" }}>
          &copy; {new Date().getFullYear()} Beyond ERP Ethiopia
        </p>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="reg-topbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px" }}>
          <div className="login-mobile-logo" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img
                src="/logo.png"
                alt="Beyond ERP"
                width={36}
                height={36}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
              <span style={{ color: dark ? "#ffffff" : "#2563eb", transition: "color 0.15s ease" }}>Beyond</span>{" "}
              <span style={{ color: "#2563eb" }}>ERP</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        <div className="reg-right-panel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px 48px" }}>
          <div className="reg-form-wrap" style={{ width: "100%", maxWidth: 620 }}>
            <div className="reg-heading" style={{ marginBottom: 24 }}>
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2563eb" }}>
                Step 2 of 3
              </p>
              <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: ink, lineHeight: 1.15 }}>
                Company &amp; contact details
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: muted, lineHeight: 1.5 }}>
                Enter your company profile. On the next step, you will choose CBE or Telebirr to complete payment and activate your workspace.
              </p>
            </div>

            <div className="reg-sector-badge" style={{ marginBottom: 20, borderRadius: 10, border: `1px solid ${border}`, background: dark ? "#0a1220" : "#f8fafc", padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${border}`, background: sectorTint, color: sectorColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {companySector.icon ? <i className={`${companySector.icon} text-xl`} /> : <Briefcase size={20} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>
                    Selected sector
                  </p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: ink, overflowWrap: "anywhere" }}>
                    {companySector.name || "None selected"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(backToSectorHref)}
                style={{ minHeight: 36, borderRadius: 8, border: `1px solid ${border}`, background: surface, color: "#2563eb", fontSize: 13, fontWeight: 700, padding: "0 12px", flexShrink: 0 }}
              >
                Change
              </button>
            </div>
            {errors.sectorId ? <p style={{ ...errorStyle, marginTop: -12, marginBottom: 16 }}>{errors.sectorId}</p> : null}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              <div style={gridStyle}>
                <label style={labelStyle}>
                  Company name
                  <input
                    value={form.companyName}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, companyName: e.target.value }));
                      setErrors((er) => ({ ...er, companyName: "" }));
                    }}
                    required
                    autoFocus
                    placeholder="Selam Trading PLC"
                    style={fieldStyle(Boolean(errors.companyName))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.companyName ? errorBorder : border)}
                    aria-invalid={Boolean(errors.companyName)}
                  />
                  {errors.companyName ? <p style={errorStyle}>{errors.companyName}</p> : null}
                </label>

                <label style={labelStyle}>
                  TIN number <span style={{ color: muted, fontWeight: 500 }}>(optional)</span>
                  <input
                    value={form.tinNumber}
                    onChange={(e) => setForm((f) => ({ ...f, tinNumber: e.target.value }))}
                    placeholder="0012345678"
                    style={fieldStyle()}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                </label>
              </div>

              <div style={gridStyle}>
                <label style={labelStyle}>
                  Your full name
                  <input
                    value={form.fullName}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, fullName: e.target.value }));
                      setErrors((er) => ({ ...er, fullName: "" }));
                    }}
                    required
                    placeholder="Abebe Kebede"
                    style={fieldStyle(Boolean(errors.fullName))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.fullName ? errorBorder : border)}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName ? <p style={errorStyle}>{errors.fullName}</p> : null}
                </label>

                <label style={labelStyle}>
                  Email address
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      setErrors((er) => ({ ...er, email: "" }));
                    }}
                    required
                    placeholder="owner@company.com"
                    style={fieldStyle(Boolean(errors.email))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? errorBorder : border)}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? <p style={errorStyle}>{errors.email}</p> : null}
                </label>
              </div>

              <div style={gridStyle}>
                <label style={labelStyle}>
                  Phone number
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      setErrors((er) => ({ ...er, phone: "" }));
                    }}
                    required
                    placeholder="+251 911 234 567"
                    style={fieldStyle(Boolean(errors.phone))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? errorBorder : border)}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone ? <p style={errorStyle}>{errors.phone}</p> : null}
                </label>

                <label style={labelStyle}>
                  Notes <span style={{ color: muted, fontWeight: 500 }}>(optional)</span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Payment ref, modules, or setup notes"
                    style={notesStyle()}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 48,
                  borderRadius: 10,
                  border: 0,
                  marginTop: 6,
                  background: loading ? "#3b82f6" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                  transition: "opacity 0.15s, transform 0.15s",
                }}
              >
                {loading && <Loader2 className="spin" size={17} />}
                {loading ? "Processing..." : "Continue to Payment"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: border }} />
              <span style={{ fontSize: 12, color: muted }}>or</span>
              <div style={{ flex: 1, height: 1, background: border }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => router.push(backToSectorHref)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 13, fontWeight: 600, padding: "6px 0", display: "flex", alignItems: "center", gap: 6 }}
              >
                <ArrowLeft size={14} />
                Back to sectors
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 13, padding: "6px 0" }}
              >
                Already approved? Sign in
              </button>
            </div>

          </div>
        </div>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}

export default function RegisterDetailsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f8ff" }}>
          <Loader2 className="spin" style={{ color: "#2563eb" }} size={36} />
        </div>
      }
    >
      <RegisterDetailsContent />
    </Suspense>
  );
}
