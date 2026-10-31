"use client";

import { type CSSProperties, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Landmark,
  Loader2,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { getSectorDefinition } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface RegistrationDraft {
  companyName: string;
  tinNumber?: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  sectorId?: string;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const sectorIdParam = searchParams.get("sectorId") ?? "";
  const [draft, setDraft] = useState<RegistrationDraft | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"CBE" | "TELEBIRR">("CBE");
  const [copied, setCopied] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("beyond_reg_draft");
      if (stored) {
        setDraft(JSON.parse(stored) as RegistrationDraft);
      }
    } catch {
      // ignore
    }
  }, []);

  const sectorId = draft?.sectorId || sectorIdParam;
  const companySector = getSectorDefinition(sectorId);

  const cbeDetails = {
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountName: "Beyond Solution PLC",
    accountNumber: "1000598712345",
    branch: "Addis Ababa Main Branch"
  };

  const telebirrDetails = {
    serviceName: "Telebirr (Ethio Telecom)",
    accountName: "Beyond Solution / Nehemiah",
    phoneNumber: "0911000001",
    shortCode: "*127# or Telebirr App"
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(label);
      showToast(`Copied ${label} to clipboard`);
      setTimeout(() => setCopied(null), 2500);
    }
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/Nehemiah00", "_blank", "noopener,noreferrer");
  };

  const handleDone = async () => {
    setError("");

    if (!draft || !draft.companyName || !draft.email) {
      // Fallback: If draft was cleared, redirect back to details
      showToast("Please enter your company details first");
      router.push(sectorId ? `/register/details?sectorId=${sectorId}` : "/register");
      return;
    }

    setSubmitting(true);
    try {
      const paymentNote = `[Payment: ${selectedMethod}${reference ? ` | Ref: ${reference.trim()}` : " | Screenshot via Telegram"}]`;
      const combinedNotes = draft.notes ? `${paymentNote} ${draft.notes}` : paymentNote;

      await api.createRegistrationRequest({
        companyName: draft.companyName,
        tinNumber: draft.tinNumber || undefined,
        sectorId: sectorId || "general",
        fullName: draft.fullName,
        email: draft.email,
        phone: draft.phone,
        notes: combinedNotes,
        paymentMethod: selectedMethod,
        paymentReference: reference.trim() || "Sent via Telegram @Nehemiah00",
        isPaid: true
      });

      // Save to confirmed reg storage for the congratulations page
      sessionStorage.setItem(
        "beyond_reg",
        JSON.stringify({
          ...draft,
          sectorId,
          paymentMethod: selectedMethod,
          paymentRef: reference || "Sent via Telegram @Nehemiah00"
        })
      );

      showToast("Payment confirmation & request submitted!");
      router.push("/submitted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit request";
      if (msg.includes("already exists") || msg.includes("already completed")) {
        showToast("Account already exists - please sign in");
        router.push("/login");
      } else {
        setError(msg);
        showToast(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Color tokens
  const bg = dark ? "#080e19" : "#f5f8ff";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = dark ? "#8b9ab0" : "#64748b";
  const inputBg = dark ? "#0a1220" : "#ffffff";
  const sectorColor = companySector.color || "#2563eb";
  const sectorTint = dark ? "rgba(37,99,235,0.14)" : companySector.tint || "#eff6ff";

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: bg }}>
      {/* ================= LEFT BRAND PANEL (RESPONSIVE BLUE/WHITE WITH BLACK/BLUE TEXT) ================= */}
      <div
        style={{
          width: "42%",
          minHeight: "100vh",
          background: dark
            ? "linear-gradient(160deg, #0b1528 0%, #0d1a33 60%, #070c18 100%)"
            : "linear-gradient(160deg, #ffffff 0%, #f8fafc 55%, #eff6ff 100%)",
          borderRight: `1px solid ${border}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 48px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0
        }}
        className="login-brand-panel"
      >
        {/* Atmospheric orbs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(191,219,254,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)" : "radial-gradient(circle, rgba(219,234,254,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

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
              <span style={{ color: dark ? "#ffffff" : "#0f172a", transition: "color 0.15s ease" }}>Beyond</span>{" "}
              <span style={{ color: dark ? "#60a5fa" : "#2563eb" }}>ERP</span>
            </span>
          </div>

          <p style={{ margin: "0 0 18px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: dark ? "rgba(191,219,254,0.75)" : "#2563eb" }}>
            Step 3 of 3 • Workspace Activation
          </p>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: "clamp(34px, 3.5vw, 54px)", lineHeight: 1.02, color: dark ? "#ffffff" : "#0f172a", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Activate your<br />company<br />
            <span style={{ fontStyle: "italic", color: dark ? "#93c5fd" : "#2563eb" }}>workspace.</span>
          </h1>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {([
              { icon: <Zap size={14} />, label: "Instant CBE & Telebirr direct transfer" },
              { icon: <Send size={14} />, label: "Fast Telegram receipt verification (@Nehemiah00)" },
              { icon: <ShieldCheck size={14} />, label: "Isolated company database provisioned" },
            ] as const).map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: dark ? "#cbd5e1" : "#334155", fontSize: 14 }}>
                <span style={{ color: dark ? "#60a5fa" : "#2563eb", flexShrink: 0, display: "flex" }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ margin: 0, fontSize: 11, color: dark ? "rgba(148,163,184,0.6)" : "#64748b", position: "relative" }}>
          &copy; {new Date().getFullYear()} Beyond ERP Ethiopia • Addis Ababa
        </p>
      </div>

      {/* ================= RIGHT INTERACTIVE PAYMENT PANEL ================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar with mobile logo & theme toggle */}
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
            {/* Header info */}
            <div className="reg-heading" style={{ marginBottom: 22 }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#2563eb"
                }}
              >
                Step 3 of 3 • Payment &amp; Activation
              </p>
              <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: ink, lineHeight: 1.15 }}>
                Choose payment method
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: muted, lineHeight: 1.5 }}>
                Select CBE or Telebirr below to view transfer details. After sending the payment, share your receipt on Telegram for fast workspace setup.
              </p>
            </div>

            {/* Selected company overview badge */}
            <div
              className="pay-company-badge"
              style={{
                marginBottom: 20,
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: dark ? "#0a1220" : "#f8fafc",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: sectorTint,
                    color: sectorColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {companySector.icon ? <i className={`${companySector.icon} text-lg`} /> : <Briefcase size={18} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: ink, overflowWrap: "anywhere" }}>
                    {draft?.companyName || "Your Company Workspace"}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: muted }}>
                    Sector: <strong>{companySector.name}</strong> • {draft?.fullName || "Company Admin"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(sectorId ? `/register/details?sectorId=${sectorId}` : "/register")}
                style={{
                  minHeight: 34,
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                  background: surface,
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "0 10px",
                  flexShrink: 0
                }}
              >
                Edit Details
              </button>
            </div>

            {/* Payment Method Selector (CBE vs Telebirr) */}
            <div className="pay-method-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {/* Option 1: CBE */}
              <button
                type="button"
                className="pay-method-btn"
                onClick={() => setSelectedMethod("CBE")}
                style={{
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: `2px solid ${selectedMethod === "CBE" ? "#2563eb" : border}`,
                  background: selectedMethod === "CBE" ? (dark ? "rgba(37,99,235,0.14)" : "#eff6ff") : surface,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: selectedMethod === "CBE" ? "0 4px 14px rgba(37,99,235,0.18)" : "none"
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "none",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                  }}
                >
                  <img
                    src="/cbe-logo.jpg"
                    alt="Commercial Bank of Ethiopia (CBE)"
                    width={44}
                    height={44}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaaqYdrTfGtVcFbG4v6-X7a_bJbNSuIPQytPGc42OBCw&s=10";
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: ink }}>CBE</p>
                    {selectedMethod === "CBE" && (
                      <span style={{ color: "#2563eb", display: "flex" }}>
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: muted }}>Bank Transfer</p>
                </div>
              </button>

              {/* Option 2: Telebirr */}
              <button
                type="button"
                className="pay-method-btn"
                onClick={() => setSelectedMethod("TELEBIRR")}
                style={{
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: `2px solid ${selectedMethod === "TELEBIRR" ? "#2563eb" : border}`,
                  background: selectedMethod === "TELEBIRR" ? (dark ? "rgba(37,99,235,0.14)" : "#eff6ff") : surface,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: selectedMethod === "TELEBIRR" ? "0 4px 14px rgba(37,99,235,0.18)" : "none"
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "none",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                  }}
                >
                  <img
                    src="/telebirr-logo.jpg"
                    alt="Telebirr"
                    width={44}
                    height={44}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7isY9He26by7PMZVtCHoL_M4LkGQcSUoQiB3OgAa-A&s=10";
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: ink }}>Telebirr</p>
                    {selectedMethod === "TELEBIRR" && (
                      <span style={{ color: "#2563eb", display: "flex" }}>
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: muted }}>Mobile Money</p>
                </div>
              </button>
            </div>

            {/* Account Details Box */}
            <div
              className="pay-account-box"
              style={{
                borderRadius: 12,
                border: `1.5px solid ${border}`,
                background: surface,
                padding: "20px 22px",
                marginBottom: 18,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
              }}
            >
              {selectedMethod === "CBE" ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "none", flexShrink: 0, background: "#ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                        <img src="/cbe-logo.jpg" alt="CBE" width={32} height={32} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2563eb" }}>
                          CBE Account Details
                        </span>
                        <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 700, color: ink }}>
                          {cbeDetails.bankName}
                        </h3>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: muted }}>{cbeDetails.branch}</span>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {/* Account Number with Copy */}
                    <div
                      className="pay-account-row"
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: inputBg,
                        border: `1px solid ${border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase" }}>
                          Account Number
                        </p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: ink, letterSpacing: "0.05em" }}>
                          {cbeDetails.accountNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cbeDetails.accountNumber, "Account Number")}
                        style={{
                          height: 36,
                          padding: "0 14px",
                          borderRadius: 8,
                          border: "1px solid #2563eb",
                          background: copied === "Account Number" ? "#16a34a" : "#2563eb",
                          color: "#ffffff",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        {copied === "Account Number" ? <Check size={14} /> : <Copy size={14} />}
                        {copied === "Account Number" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    {/* Account Name */}
                    <div
                      className="pay-account-row"
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: inputBg,
                        border: `1px solid ${border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase" }}>
                          Account Name
                        </p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: ink }}>
                          {cbeDetails.accountName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cbeDetails.accountName, "Account Name")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <Copy size={13} />
                        Copy Name
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "none", flexShrink: 0, background: "#ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                        <img src="/telebirr-logo.jpg" alt="Telebirr" width={32} height={32} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2563eb" }}>
                          Telebirr Transfer Details
                        </span>
                        <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 700, color: ink }}>
                          {telebirrDetails.serviceName}
                        </h3>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: muted }}>{telebirrDetails.shortCode}</span>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {/* Phone Number with Copy */}
                    <div
                      className="pay-account-row"
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: inputBg,
                        border: `1px solid ${border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase" }}>
                          Telebirr Phone Number
                        </p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: ink, letterSpacing: "0.05em" }}>
                          {telebirrDetails.phoneNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(telebirrDetails.phoneNumber, "Telebirr Phone")}
                        style={{
                          height: 36,
                          padding: "0 14px",
                          borderRadius: 8,
                          border: "1px solid #2563eb",
                          background: copied === "Telebirr Phone" ? "#16a34a" : "#2563eb",
                          color: "#ffffff",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        {copied === "Telebirr Phone" ? <Check size={14} /> : <Copy size={14} />}
                        {copied === "Telebirr Phone" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    {/* Receiver Name */}
                    <div
                      className="pay-account-row"
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: inputBg,
                        border: `1px solid ${border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase" }}>
                          Receiver Name
                        </p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: ink }}>
                          {telebirrDetails.accountName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(telebirrDetails.accountName, "Receiver Name")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <Copy size={13} />
                        Copy Name
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction callout & Telegram Action */}
            <div
              style={{
                borderRadius: 12,
                border: "1.5px solid rgba(34, 158, 217, 0.35)",
                background: dark ? "rgba(34, 158, 217, 0.08)" : "#f0f9ff",
                padding: "16px 18px",
                marginBottom: 20
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <span style={{ color: "#0284c7", flexShrink: 0, marginTop: 2 }}>
                  <HelpCircle size={18} />
                </span>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: ink }}>
                    Receipt Screenshot Verification
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: muted, lineHeight: 1.45 }}>
                    After you send the money, please take a screenshot of your transfer confirmation and send it to our Telegram support account. Our team will verify it immediately and send your workspace access.
                  </p>
                </div>
              </div>

              {/* Telegram Submit Button */}
              <button
                type="button"
                onClick={handleTelegramClick}
                style={{
                  width: "100%",
                  height: 46,
                  borderRadius: 10,
                  border: 0,
                  background: "linear-gradient(135deg, #229ED9 0%, #0088cc 100%)",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(34, 158, 217, 0.35)",
                  transition: "opacity 0.15s, transform 0.15s"
                }}
              >
                <Send size={16} />
                Submit Receipt on Telegram (@Nehemiah00)
                <ExternalLink size={14} style={{ opacity: 0.8 }} />
              </button>
            </div>

            {/* Optional Reference Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                Transaction Reference / Sender Phone <span style={{ color: muted, fontWeight: 500 }}>(optional)</span>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. CBE reference FT... or your Telebirr phone number"
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: `1.5px solid ${border}`,
                    background: inputBg,
                    padding: "0 14px",
                    color: ink,
                    fontSize: 14,
                    outline: "none"
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                />
              </label>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: muted }}>
                Entering your transaction reference helps our finance team match your payment faster.
              </p>
            </div>

            {error && (
              <p style={{ margin: "0 0 16px", color: "#e11d48", fontSize: 13, fontWeight: 600 }}>
                {error}
              </p>
            )}

            {/* Primary Action Button: Done */}
            <div style={{ display: "grid", gap: 10 }}>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDone}
                style={{
                  height: 48,
                  borderRadius: 10,
                  border: 0,
                  background: submitting ? "#3b82f6" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 4px 16px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.15s"
                }}
              >
                {submitting ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
                {submitting ? "Confirming Registration..." : "Done — I Have Sent the Payment"}
              </button>

              <button
                type="button"
                onClick={() => router.push(sectorId ? `/register/details?sectorId=${sectorId}` : "/register")}
                style={{
                  height: 44,
                  borderRadius: 10,
                  border: `1.5px solid ${border}`,
                  background: surface,
                  color: ink,
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                <ArrowLeft size={16} />
                Back to Company Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}

export default function RegisterPaymentPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f8ff" }}>
          <Loader2 className="spin" style={{ color: "#2563eb" }} size={36} />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
