"use client";

import { type CSSProperties, type FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle2, Languages, Loader2, ShieldCheck, Wifi } from "lucide-react";
import { getSectorDefinition } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch } from "@/store/hooks";
import { switchSector } from "@/store/slices/sectorsSlice";
import { loginAsDemo } from "@/store/slices/authSlice";
import { setMockProfile } from "@/lib/mock";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

function validateEthiopianPhone(phone: string): { isValid: boolean; formatted: string; error?: string } {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, formatted: "", error: "Phone number is required" };
  }
  // Strip spaces, dashes, dots, parentheses
  const cleaned = trimmed.replace(/[\s\-\.\(\)]/g, "");
  // Check matching: +251 9/7..., 251 9/7..., 09/07..., or 9/7... (Ethiopian mobile standards)
  const match = cleaned.match(/^(?:\+?251|0)?([79]\d{8})$/);
  if (!match) {
    return {
      isValid: false,
      formatted: trimmed,
      error: "Enter a valid Ethiopian phone number"
    };
  }
  const digits = match[1];
  const formatted = `+251 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return { isValid: true, formatted };
}

function RegisterDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();
  const { loginDemo } = useAuth();
  const dispatch = useAppDispatch();
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

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem("beyond_reg_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure company name remains completely empty unless user explicitly filled a custom company name previously for this exact sector
        const isSectorMatch = parsed.sectorId === sectorId;
        const isDefaultSectorName =
          !parsed.companyName ||
          parsed.companyName.includes("Demo Co") ||
          parsed.companyName.includes("Workspace") ||
          parsed.companyName.includes("PLC Demo") ||
          parsed.companyName.toLowerCase().includes("supermarket plc") ||
          parsed.companyName.toLowerCase().includes("trading plc") ||
          parsed.companyName === companySector.name;

        const effectiveCompany = isSectorMatch && !isDefaultSectorName ? parsed.companyName : "";

        setForm((f) => ({
          ...f,
          companyName: effectiveCompany,
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
  }, [sectorId, companySector.name]);

  // Validation rules
  const trimmedCompany = form.companyName.trim();
  const isCompanyNameValid = trimmedCompany.length >= 3 && /[a-zA-Z\u1200-\u137F]/.test(trimmedCompany);
  const companyError = touched.companyName && !isCompanyNameValid
    ? "Company name must be at least 3 letters"
    : "";

  const trimmedFullName = form.fullName.trim();
  const isFullNameValid = trimmedFullName.length >= 3 && /[a-zA-Z\u1200-\u137F]/.test(trimmedFullName);
  const fullNameError = touched.fullName && !isFullNameValid
    ? "Please enter your full contact name (at least 3 characters)"
    : "";

  const trimmedEmail = form.email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(trimmedEmail);
  const emailError = touched.email && !isEmailValid
    ? "Enter a valid business email address"
    : "";

  const phoneResult = validateEthiopianPhone(form.phone);
  const isPhoneValid = phoneResult.isValid;
  const phoneError = touched.phone && !isPhoneValid ? (phoneResult.error || "Invalid phone number") : "";

  const trimmedTin = form.tinNumber.trim().replace(/[\s\-]/g, "");
  const isTinValid = !trimmedTin || /^\d{10}$/.test(trimmedTin);
  const tinError = touched.tinNumber && !isTinValid
    ? "TIN number must be exactly 10 digits"
    : "";

  const isSectorValid = Boolean(sectorId);
  const canContinue = isCompanyNameValid && isFullNameValid && isEmailValid && isPhoneValid && isTinValid && isSectorValid;

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      companyName: true,
      fullName: true,
      email: true,
      phone: true,
      tinNumber: true,
    });

    if (!canContinue) {
      if (!isSectorValid) {
        showToast("Please choose your company sector first");
        router.push("/register");
        return;
      }
      showToast("Please fill all required fields in the proper format");
      return;
    }

    setLoading(true);
    try {
      const normalizedPhone = phoneResult.formatted || form.phone.trim();
      const draftData = {
        ...form,
        companyName: form.companyName.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: normalizedPhone,
        tinNumber: trimmedTin || undefined,
        sectorId,
      };

      sessionStorage.setItem("beyond_reg_draft", JSON.stringify(draftData));
      // Sync mock profile & Redux so their company name and contact info are active everywhere
      setMockProfile(sectorId, draftData.companyName, {
        fullName: draftData.fullName,
        email: draftData.email,
        phone: draftData.phone,
        tinNumber: draftData.tinNumber,
      });
      showToast("Company profile saved");
      router.push(`/register/payment?sectorId=${encodeURIComponent(sectorId)}`);
    } catch {
      router.push(`/register/payment?sectorId=${encodeURIComponent(sectorId)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = () => {
    if (!canContinue) {
      setTouched({
        companyName: true,
        fullName: true,
        email: true,
        phone: true,
        tinNumber: true,
      });
      showToast("First fill out details");
      return;
    }

    const effectiveSectorId = sectorId || "retail-trading";
    const effectiveCompany = form.companyName.trim();
    const normalizedPhone = phoneResult.formatted || form.phone.trim();

    // 1. Redux demo session setup with full custom company profile
    dispatch(switchSector(effectiveSectorId));
    dispatch(
      loginAsDemo({
        sectorId: effectiveSectorId,
        companyName: effectiveCompany,
        fullName: form.fullName.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: normalizedPhone || undefined,
        tinNumber: trimmedTin || undefined,
      })
    );

    // 2. Mock profile sync
    setMockProfile(effectiveSectorId, effectiveCompany, {
      fullName: form.fullName.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: normalizedPhone || undefined,
      tinNumber: trimmedTin || undefined,
    });

    // 3. Save draft in sessionStorage
    try {
      const draftData = {
        ...form,
        companyName: effectiveCompany,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: normalizedPhone,
        tinNumber: trimmedTin || undefined,
        sectorId: effectiveSectorId,
      };
      sessionStorage.setItem("beyond_reg_draft", JSON.stringify(draftData));
    } catch {
      // ignore
    }

    // 4. AuthContext demo session
    if (loginDemo) {
      loginDemo(effectiveSectorId, effectiveCompany, {
        fullName: form.fullName.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: normalizedPhone || undefined,
        companyTinNumber: trimmedTin || undefined,
      });
    }

    showToast(`Launching demo workspace as ${effectiveCompany}...`);
    router.push("/dashboard");
  };

  const bg = dark ? "#080e19" : "#f5f8ff";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = dark ? "#8b9ab0" : "#64748b";
  const inputBg = dark ? "#0a1220" : "#f8fafc";
  const errorBorder = "#f43f5e";
  const errorText = "#f43f5e";
  const successBorder = "#10b981";
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

  const fieldStyle = (hasError = false, isValid = false): CSSProperties => ({
    height: 44,
    width: "100%",
    borderRadius: 10,
    border: `1.5px solid ${hasError ? errorBorder : isValid ? successBorder : border}`,
    background: inputBg,
    padding: "0 14px",
    color: ink,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  });

  const notesStyle: CSSProperties = {
    minHeight: 84,
    width: "100%",
    borderRadius: 10,
    border: `1.5px solid ${border}`,
    background: inputBg,
    padding: "12px 14px",
    color: ink,
    fontSize: 14,
    lineHeight: 1.45,
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  const errorStyle: CSSProperties = {
    margin: "4px 0 0",
    color: errorText,
    fontSize: 12,
    fontWeight: 600,
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: bg }}>
      {/* Left Brand Panel */}
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
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
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
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", color: "#ffffff" }}>
              Beyond ERP
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

      {/* Right Form Panel */}
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
              <span style={{ color: dark ? "#ffffff" : "#0f172a", transition: "color 0.15s ease" }}>Beyond ERP</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        <div className="reg-right-panel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px 48px" }}>
          <div className="reg-form-wrap" style={{ width: "100%", maxWidth: 620 }}>
            <div className="reg-heading" style={{ marginBottom: 24 }}>
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2563eb" }}>
                Step 2 of 3 • Company Information
              </p>
              <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: ink, lineHeight: 1.15 }}>
                Company &amp; contact details
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: muted, lineHeight: 1.5 }}>
                Provide your official enterprise details below. Ensure your phone and email are valid to receive your workspace activation link.
              </p>
            </div>

            {/* Selected Sector Overview Badge */}
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

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              {/* Row 1: Company Name & TIN */}
              <div style={gridStyle}>
                <label style={labelStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Company Name <span style={{ color: "#ef4444" }}>*</span></span>
                    {touched.companyName && isCompanyNameValid && (
                      <span style={{ color: "#10b981", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    value={form.companyName}
                    onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    onBlur={() => handleBlur("companyName")}
                    required
                    autoFocus
                    placeholder="Company name"
                    style={fieldStyle(Boolean(companyError), touched.companyName && isCompanyNameValid)}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    aria-invalid={Boolean(companyError)}
                  />
                  {companyError ? <p style={errorStyle}>{companyError}</p> : null}
                </label>

                <label style={labelStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>TIN Number <span style={{ color: muted, fontWeight: 500 }}>(optional)</span></span>
                    {form.tinNumber.trim() && isTinValid && (
                      <span style={{ color: "#10b981", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <CheckCircle2 size={12} /> 10 Digits
                      </span>
                    )}
                  </div>
                  <input
                    value={form.tinNumber}
                    onChange={(e) => setForm((f) => ({ ...f, tinNumber: e.target.value }))}
                    onBlur={() => handleBlur("tinNumber")}
                    maxLength={10}
                    placeholder="10-digit TIN"
                    style={fieldStyle(Boolean(tinError), Boolean(form.tinNumber.trim() && isTinValid))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  />
                  {tinError ? <p style={errorStyle}>{tinError}</p> : null}
                </label>
              </div>

              {/* Row 2: Full Name & Email */}
              <div style={gridStyle}>
                <label style={labelStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Contact Full Name <span style={{ color: "#ef4444" }}>*</span></span>
                    {touched.fullName && isFullNameValid && (
                      <span style={{ color: "#10b981", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    onBlur={() => handleBlur("fullName")}
                    required
                    placeholder="Full name"
                    style={fieldStyle(Boolean(fullNameError), touched.fullName && isFullNameValid)}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    aria-invalid={Boolean(fullNameError)}
                  />
                  {fullNameError ? <p style={errorStyle}>{fullNameError}</p> : null}
                </label>

                <label style={labelStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Business Email <span style={{ color: "#ef4444" }}>*</span></span>
                    {touched.email && isEmailValid && (
                      <span style={{ color: "#10b981", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    onBlur={() => handleBlur("email")}
                    required
                    placeholder="name@company.com"
                    style={fieldStyle(Boolean(emailError), touched.email && isEmailValid)}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    aria-invalid={Boolean(emailError)}
                  />
                  {emailError ? <p style={errorStyle}>{emailError}</p> : null}
                </label>
              </div>

              {/* Row 3: Phone & Notes */}
              <div style={gridStyle}>
                <label style={labelStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Phone Number <span style={{ color: "#ef4444" }}>*</span></span>
                    {touched.phone && isPhoneValid && (
                      <span style={{ color: "#10b981", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <CheckCircle2 size={12} /> Ethiopian Format
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    onBlur={() => handleBlur("phone")}
                    required
                    placeholder="09XX XXX XXX or +251 9XX XXX XXX"
                    style={fieldStyle(Boolean(phoneError), touched.phone && isPhoneValid)}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    aria-invalid={Boolean(phoneError)}
                  />
                  {phoneError ? <p style={errorStyle}>{phoneError}</p> : null}
                </label>

                <label style={labelStyle}>
                  <span>Additional Notes <span style={{ color: muted, fontWeight: 500 }}>(optional)</span></span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Custom module requests or deployment notes"
                    style={notesStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                </label>
              </div>

              {/* Submit Button — ONLY CAN CONTINUE IF FORMAT IS FULLY VALID */}
              <div style={{ marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={!canContinue || loading}
                  style={{
                    height: 48,
                    width: "100%",
                    borderRadius: 10,
                    border: 0,
                    background: !canContinue
                      ? (dark ? "rgba(255,255,255,0.06)" : "#e2e8f0")
                      : loading
                      ? "#3b82f6"
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: !canContinue ? (dark ? "#64748b" : "#94a3b8") : "#ffffff",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: !canContinue || loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: !canContinue || loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                    transition: "all 0.15s ease",
                    opacity: !canContinue ? 0.65 : 1,
                  }}
                >
                  {loading && <Loader2 className="spin" size={17} />}
                  {loading ? "Processing..." : "Continue to Payment"}
                  {!loading && <ArrowRight size={16} />}
                </button>

                {/* Instant Demo Button — Inactive before form is filled; alerts to fill details if clicked while inactive */}
                <button
                  type="button"
                  onClick={handleInstantDemo}
                  title={!canContinue ? "First fill out company details" : "Launch Instant Demo"}
                  style={{
                    height: 44,
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 10,
                    border: !canContinue
                      ? `1.5px solid ${dark ? "#1a2a40" : "#e2e8f0"}`
                      : `1.5px solid ${dark ? "rgba(37,99,235,0.45)" : "rgba(37,99,235,0.3)"}`,
                    background: !canContinue
                      ? (dark ? "rgba(255,255,255,0.02)" : "#f8fafc")
                      : (dark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.06)"),
                    color: !canContinue
                      ? (dark ? "#64748b" : "#94a3b8")
                      : (dark ? "#93c5fd" : "#2563eb"),
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: !canContinue ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s ease",
                    opacity: !canContinue ? 0.65 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (canContinue) {
                      e.currentTarget.style.background = dark ? "rgba(37,99,235,0.24)" : "rgba(37,99,235,0.14)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canContinue) {
                      e.currentTarget.style.background = dark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.06)";
                    }
                  }}
                >
                  Instant Demo
                </button>

                {!canContinue && (
                  <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: 12, color: muted }}>
                    Complete all required fields in the proper format above to proceed to payment.
                  </p>
                )}
              </div>
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
