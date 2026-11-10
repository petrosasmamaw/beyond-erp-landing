"use client";

import { type CSSProperties, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Check,
  Copy,
  Loader2,
  Receipt,
  Send,
  ShieldCheck,
  X,
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

type PlanTier = "BASIC" | "STANDARD" | "CUSTOM";

interface PlanConfig {
  id: PlanTier;
  title: string;
  badge: string;
  totalDisplay: string;
  numericTotal: number | null;
  subtotal: string;
  discount: string;
  taxableBase: string;
  vat15: string;
  subtext: string;
  description: string;
}

const PLANS: Record<PlanTier, PlanConfig> = {
  BASIC: {
    id: "BASIC",
    title: "Retail & Trading",
    badge: "100 ETB / Day • VAT Included",
    totalDisplay: "36,500",
    numericTotal: 36500,
    subtotal: "31,739.13 ETB",
    discount: "0.00 ETB",
    taxableBase: "31,739.13 ETB",
    vat15: "+ 4,760.87 ETB (15%)",
    subtext: "Annual 365 Days • 100 ETB/Day • Net 36,500 ETB (15% VAT Included)",
    description: "POS checkout, barcode inventory, stock ledger & VAT 15% receipts. 100 ETB per day."
  },
  STANDARD: {
    id: "STANDARD",
    title: "Enterprise Custom",
    badge: "Ask for Pricing",
    totalDisplay: "Ask",
    numericTotal: null,
    subtotal: "Separate Pricing Upon Request",
    discount: "—",
    taxableBase: "—",
    vat15: "Quoted upon request",
    subtext: "Separate Pricing Upon Request • Tailored Enterprise Scope",
    description: "Industry-specialized workflows, multi-branch & comprehensive ledger. Quoted separately upon request."
  },
  CUSTOM: {
    id: "CUSTOM",
    title: "Custom Quote",
    badge: "Ask for Pricing",
    totalDisplay: "Ask",
    numericTotal: null,
    subtotal: "Separate Pricing Upon Request",
    discount: "—",
    taxableBase: "—",
    vat15: "Quoted upon request",
    subtext: "Separate Pricing Upon Request • Tailored Enterprise Scope",
    description: "Pricing tailored to your branch network, transaction volume, and operational modules. We provide a separate custom price upon request."
  }
};

/**
 * Sector Pricing Rule:
 * - Only "Retail & Trading" has fixed standard pricing: 36,500 ETB net (100 ETB/day, 15% VAT included)
 * - ALL OTHER SECTORS are "Ask" (Separate custom pricing upon request)
 */
function getSectorPlan(sectorId?: string | null): PlanTier {
  if (!sectorId) return "CUSTOM";
  const s = sectorId.toLowerCase().trim();
  if (s === "retail-trading" || s === "retail" || s === "retail-sector") {
    return "BASIC";
  }
  return "CUSTOM";
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
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("beyond_reg_draft");
      if (stored) {
        const parsed = JSON.parse(stored) as RegistrationDraft;
        setDraft(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const sectorId = draft?.sectorId || sectorIdParam;
  const companySector = getSectorDefinition(sectorId);
  const selectedPlan = getSectorPlan(sectorId);
  const currentPlan = PLANS[selectedPlan];
  const isCustomSector = selectedPlan === "CUSTOM";

  const payText = dark ? "#eef1f8" : "#10131c";
  const payMuted = dark ? "#98a1b8" : "#5d6577";
  const payLine = dark ? "#1d2538" : "#e1e4ee";
  const payAccent = dark ? "#3b6cf4" : "#2457e6";
  const payField = dark ? "#131a2b" : "#eceff7";
  const paySuccess = dark ? "#3ccf8a" : "#17a05d";
  const payBg = dark ? "#0f1a2e" : "#ffffff";

  const cbeDetails = {
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountName: "Beyond Solution PLC",
    accountNumber: "1000761869799",
    branch: "Addis Ababa Main Branch"
  };

  const telebirrDetails = {
    serviceName: "Telebirr (Ethio Telecom)",
    accountName: "Beyond Solution / Telebirr",
    phoneNumber: "0928151599",
    shortCode: "*127# or Telebirr App"
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(label);
      showToast(`Copied ${label} to clipboard`);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/beyond_et", "_blank", "noopener,noreferrer");
  };

  const handleDone = async () => {
    setError("");

    if (!draft || !draft.companyName || !draft.email) {
      showToast("Please enter your company details first");
      router.push(sectorId ? `/register/details?sectorId=${sectorId}` : "/register");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      showToast("Please agree to the Terms of Service & Privacy Policy");
      return;
    }

    setSubmitting(true);
    try {
      const paymentMethodVal = isCustomSector ? "AGREEMENT" : selectedMethod;
      const paymentRefVal = isCustomSector
        ? "Separate Pricing Upon Request - Contact Admin"
        : "Receipt via Telegram @beyond_et";

      const paymentNote = isCustomSector
        ? `[Tier: ASK / CUSTOM | Separate Pricing Upon Request | Sector: ${companySector.name} | Contact via Telegram @beyond_et | Terms & Policy Confirmed]`
        : `[Tier: BASIC (36,500 ETB) | 100 ETB/Day Net | Sector: Retail & Trading | Payment: ${selectedMethod} | Receipt submitted via Telegram @beyond_et | Terms & Policy Confirmed]`;

      const combinedNotes = draft.notes ? `${paymentNote} ${draft.notes}` : paymentNote;

      await api.createRegistrationRequest({
        companyName: draft.companyName,
        tinNumber: draft.tinNumber || undefined,
        sectorId: sectorId || (isCustomSector ? "request-custom" : "general"),
        fullName: draft.fullName,
        email: draft.email,
        phone: draft.phone,
        notes: combinedNotes,
        paymentMethod: paymentMethodVal,
        paymentReference: paymentRefVal,
        isPaid: !isCustomSector
      });

      // Save to confirmed reg storage for the congratulations page
      sessionStorage.setItem(
        "beyond_reg",
        JSON.stringify({
          ...draft,
          sectorId,
          planTier: selectedPlan,
          paymentMethod: paymentMethodVal,
          paymentRef: paymentRefVal
        })
      );

      showToast(isCustomSector ? "Enterprise request submitted successfully!" : "Payment confirmation & request submitted!");
      router.push("/submitted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit request";
      if (msg.includes("already exists") || msg.includes("already completed")) {
        showToast("Request already received - our team will contact you");
        router.push("/submitted");
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
  const inputBg = dark ? "#0a1220" : "#f8fafc";
  const sectorColor = companySector.color || "#2563eb";
  const sectorTint = dark ? "rgba(37,99,235,0.14)" : companySector.tint || "#eff6ff";

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: bg }}>
      {/* ================= LEFT BRAND PANEL (BLUE GRADIENT SAME AS DETAIL FORM PAGE) ================= */}
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
          flexShrink: 0
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
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", color: "#ffffff" }}>
              Beyond ERP
            </span>
          </div>

          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(191,219,254,0.75)" }}>
            Step 3 of 3 • Workspace Activation
          </p>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: "clamp(34px, 3.5vw, 54px)", lineHeight: 1.02, color: "white", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Activate your<br />company<br />
            <span style={{ fontStyle: "italic", color: "#bfdbfe" }}>workspace.</span>
          </h1>

          {/* 3 Brand Value Bullets */}
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            {(isCustomSector
              ? [
                  { icon: <Building2 size={14} />, label: "Custom enterprise multi-branch architecture" },
                  { icon: <ShieldCheck size={14} />, label: "Dedicated infrastructure & bespoke integrations" },
                  { icon: <Send size={14} />, label: "Direct administrative contact & priority setup" },
                ]
              : [
                  { icon: <Zap size={14} />, label: "Instant CBE & Telebirr direct transfer" },
                  { icon: <Send size={14} />, label: "Fast Telegram receipt verification (@beyond_et)" },
                  { icon: <ShieldCheck size={14} />, label: "Isolated company database provisioned" },
                ]
            ).map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(219,234,254,0.9)", fontSize: 13.5 }}>
                <span style={{ color: "#93c5fd", flexShrink: 0, display: "flex" }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* ================= REAL CHECKOUT SUMMARY CARD ================= */}
          <div
            style={{
              marginTop: 24,
              width: "100%",
              maxWidth: 420,
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 14,
              padding: "16px 18px",
              color: "#ffffff",
              boxSizing: "border-box"
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Receipt size={14} style={{ color: "#93c5fd" }} />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#ffffff" }}>
                  Checkout Summary
                </span>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.18)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.25)"
                }}
              >
                {currentPlan.title} Tier
              </span>
            </div>

            {/* Price Breakdown Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              {/* Subtotal */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>Subtotal</span>
                <span style={{ fontWeight: 700, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                  {currentPlan.subtotal}
                </span>
              </div>

              {/* Discount */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>Discount</span>
                <span style={{ fontWeight: 700, color: isCustomSector ? "rgba(255, 255, 255, 0.7)" : "#4ade80", fontVariantNumeric: "tabular-nums" }}>
                  {currentPlan.discount}
                </span>
              </div>

              {/* Net Taxable Amount */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(219, 234, 254, 0.75)", fontSize: 12 }}>Net Taxable Base</span>
                <span style={{ fontWeight: 600, color: "rgba(219, 234, 254, 0.9)", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                  {currentPlan.taxableBase}
                </span>
              </div>

              {/* VAT 15% */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>VAT (15%)</span>
                <span style={{ fontWeight: 700, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                  {currentPlan.vat15}
                </span>
              </div>
            </div>

            {/* Total Divider */}
            <div style={{ borderTop: "1px dashed rgba(255, 255, 255, 0.25)", margin: "12px 0 10px" }} />

            {/* Total Payable Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#bfdbfe" }}>
                  {isCustomSector ? "Pricing" : "Total Payable"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(219, 234, 254, 0.7)", marginTop: 2 }}>
                  {isCustomSector ? "Separate quote upon request" : "Official VAT invoice provided"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {isCustomSector ? (
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                    Ask
                  </div>
                ) : (
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {currentPlan.totalDisplay} <span style={{ fontSize: 13, fontWeight: 700, color: "#93c5fd" }}>ETB</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ margin: 0, fontSize: 11, color: "rgba(148,163,184,0.5)", position: "relative" }}>
          &copy; {new Date().getFullYear()} Beyond ERP Ethiopia • Addis Ababa
        </p>
      </div>

      {/* ================= RIGHT INTERACTIVE PAYMENT PANEL ================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
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
              <span style={{ color: dark ? "#ffffff" : "#0f172a", transition: "color 0.15s ease" }}>Beyond ERP</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        <style>{`
          .pay-panel-wrap {
            width: 100%;
            max-width: 520px;
            margin: 0 auto;
            padding: 56px 24px 64px;
            box-sizing: border-box;
          }
          .pay-h1 {
            font-size: 15px;
            font-weight: 600;
            color: ${payMuted};
            margin: 0 0 6px;
            line-height: 1.4;
          }
          .pay-amount {
            font-size: 44px;
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.1;
            color: ${payText};
            margin: 0;
            display: flex;
            align-items: baseline;
          }
          .pay-amount small {
            font-size: 18px;
            font-weight: 600;
            color: ${payMuted};
            margin-left: 6px;
            letter-spacing: 0;
          }
          .pay-meta {
            color: ${payMuted};
            margin: 8px 0 0;
            font-size: 14px;
            line-height: 1.5;
          }
          .pay-company {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin: 28px 0 0;
            padding: 14px 0;
            border-top: 1px solid ${payLine};
            border-bottom: 1px solid ${payLine};
            font-size: 14px;
          }
          .pay-company b {
            font-weight: 700;
            color: ${payText};
          }
          .pay-company span {
            color: ${payMuted};
          }
          .pay-link {
            background: none;
            border: 0;
            color: ${payAccent};
            font-weight: 600;
            font-size: 14px;
            padding: 4px 0;
            cursor: pointer;
            flex-shrink: 0;
          }
          .pay-h2 {
            font-size: 15px;
            font-weight: 700;
            color: ${payText};
            margin: 36px 0 12px;
            line-height: 1.4;
          }
          .pay-seg {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            padding: 4px;
            background: ${payField};
            border-radius: 12px;
            box-sizing: border-box;
          }
          .pay-seg button {
            border: 0;
            background: transparent;
            color: ${payMuted};
            padding: 11px;
            border-radius: 9px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s, color 0.15s;
          }
          .pay-seg button[aria-pressed="true"] {
            background: ${payBg} !important;
            color: ${payText} !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
          }
          .pay-dl {
            margin: 8px 0 0;
            padding: 0;
          }
          .pay-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 14px 0;
            border-bottom: 1px solid ${payLine};
            font-size: 14px;
          }
          .pay-row dt {
            color: ${payMuted};
            flex-shrink: 0;
          }
          .pay-row dd {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
            color: ${payText};
            text-align: right;
            min-width: 0;
            justify-content: flex-end;
          }
          .pay-num {
            font-size: 18px;
            letter-spacing: 0.02em;
            font-variant-numeric: tabular-nums;
          }
          .pay-copy {
            border: 1px solid ${payLine};
            background: transparent;
            color: ${payAccent};
            font-weight: 600;
            font-size: 13px;
            padding: 5px 12px;
            border-radius: 8px;
            min-width: 64px;
            min-height: 32px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: color 0.15s, border-color 0.15s;
          }
          .pay-copy.done {
            color: ${paySuccess} !important;
            border-color: ${paySuccess} !important;
          }
          .pay-after {
            color: ${payMuted};
            margin: 0 0 14px;
            max-width: 46ch;
            font-size: 14px;
            line-height: 1.5;
          }
          .pay-tg {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
            color: ${payText};
            border: 1px solid ${payLine};
            border-radius: 12px;
            padding: 13px;
            font-weight: 600;
            font-size: 14px;
            min-height: 44px;
            box-sizing: border-box;
            width: 100%;
            background: transparent;
            transition: border-color 0.15s;
          }
          .pay-tg:hover {
            border-color: ${payAccent};
          }
          .pay-agree {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            margin: 32px 0 20px;
            color: ${payMuted};
            cursor: pointer;
            font-size: 14px;
            line-height: 1.45;
          }
          .pay-agree input {
            width: 20px;
            height: 20px;
            margin: 1px 0 0;
            accent-color: ${payAccent};
            flex: none;
            cursor: pointer;
          }
          .pay-agree a {
            color: ${payText};
            text-decoration: underline;
            cursor: pointer;
          }
          .pay-go {
            width: 100%;
            border: 0;
            background: ${payAccent};
            color: #ffffff;
            font-weight: 700;
            font-size: 16px;
            padding: 16px;
            border-radius: 12px;
            min-height: 52px;
            cursor: pointer;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.15s;
          }
          .pay-go:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          .pay-hint {
            color: ${payMuted};
            font-size: 13px;
            text-align: center;
            margin: 10px 0 0;
            min-height: 20px;
          }
          .pay-back {
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 12px;
            padding: 10px;
            color: ${payMuted};
            font-weight: 600;
            font-size: 14px;
            background: none;
            border: 0;
            cursor: pointer;
            min-height: 44px;
          }
          .pay-panel-wrap :focus-visible {
            outline: 2px solid ${payAccent};
            outline-offset: 3px;
            border-radius: 6px;
          }
          @media (max-width: 640px) {
            .pay-panel-wrap {
              padding: 32px 20px 48px;
            }
          }
          @media (max-width: 380px) {
            .pay-amount {
              font-size: 38px;
            }
            .pay-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 6px;
            }
            .pay-row dd {
              width: 100%;
              justify-content: space-between;
            }
          }
        `}</style>

        <main className="pay-panel-wrap">
          {/* 1. Small heading */}
          <h1 className="pay-h1">Pay for your workspace</h1>

          {/* 2. Big amount */}
          <p className="pay-amount">
            {currentPlan.totalDisplay}
            {currentPlan.numericTotal ? <small>ETB</small> : null}
          </p>

          {/* 3. Meta line */}
          <p className="pay-meta">
            {currentPlan.title} Tier, {companySector.name} · 365 days · 15% VAT included
          </p>

          {/* 4. Company row */}
          <div className="pay-company">
            <div>
              <b>{draft?.companyName || "Your Company Workspace"}</b>{" "}
              <span>· {draft?.fullName || "Company Admin"}</span>
            </div>
            <button
              className="pay-link"
              type="button"
              onClick={() => router.push(sectorId ? `/register/details?sectorId=${sectorId}` : "/register")}
            >
              Edit
            </button>
          </div>

          {/* 5. Section heading */}
          <h2 className="pay-h2">Pay with</h2>

          {/* 6. Method switch */}
          <div className="pay-seg" role="group" aria-label="Payment method">
            <button
              type="button"
              aria-pressed={selectedMethod === "CBE"}
              onClick={() => setSelectedMethod("CBE")}
            >
              CBE bank transfer
            </button>
            <button
              type="button"
              aria-pressed={selectedMethod === "TELEBIRR"}
              onClick={() => setSelectedMethod("TELEBIRR")}
            >
              Telebirr
            </button>
          </div>

          {/* 7. Details list */}
          <dl className="pay-dl">
            {selectedMethod === "CBE" ? (
              <>
                <div className="pay-row">
                  <dt>Bank</dt>
                  <dd>{cbeDetails.bankName}, {cbeDetails.branch}</dd>
                </div>
                <div className="pay-row">
                  <dt>Account number</dt>
                  <dd>
                    <span className="pay-num">{cbeDetails.accountNumber}</span>
                    <button
                      className={`pay-copy ${copied === "Account Number" ? "done" : ""}`}
                      type="button"
                      onClick={() => handleCopy(cbeDetails.accountNumber, "Account Number")}
                    >
                      {copied === "Account Number" ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
                <div className="pay-row">
                  <dt>Account name</dt>
                  <dd>
                    <span>{cbeDetails.accountName}</span>
                    <button
                      className={`pay-copy ${copied === "Account Name" ? "done" : ""}`}
                      type="button"
                      onClick={() => handleCopy(cbeDetails.accountName, "Account Name")}
                    >
                      {copied === "Account Name" ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
                <div className="pay-row">
                  <dt>Amount</dt>
                  <dd>
                    <span className="pay-num">{currentPlan.totalDisplay}</span>
                    <button
                      className={`pay-copy ${copied === "Amount" ? "done" : ""}`}
                      type="button"
                      onClick={() => handleCopy(String(currentPlan.numericTotal || currentPlan.totalDisplay), "Amount")}
                    >
                      {copied === "Amount" ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
              </>
            ) : (
              <>
                <div className="pay-row">
                  <dt>Service</dt>
                  <dd>Telebirr mobile money</dd>
                </div>
                <div className="pay-row">
                  <dt>Phone number</dt>
                  <dd>
                    <span className="pay-num">{telebirrDetails.phoneNumber}</span>
                    <button
                      className={`pay-copy ${copied === "Phone Number" ? "done" : ""}`}
                      type="button"
                      onClick={() => handleCopy(telebirrDetails.phoneNumber, "Phone Number")}
                    >
                      {copied === "Phone Number" ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
                <div className="pay-row">
                  <dt>Account name</dt>
                  <dd>
                    <span>{telebirrDetails.accountName}</span>
                    <button
                      className={`pay-copy ${copied === "Telebirr Account" ? "done" : ""}`}
                      type="button"
                      onClick={() => handleCopy(telebirrDetails.accountName, "Telebirr Account")}
                    >
                      {copied === "Telebirr Account" ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
                <div className="pay-row">
                  <dt>Amount</dt>
                  <dd>
                    <span className="pay-num">{currentPlan.totalDisplay}</span>
                    <button
                      className={`pay-copy ${copied === "Amount" ? "done" : ""}`}
                      type="button"
                      onClick={() => handleCopy(String(currentPlan.numericTotal || currentPlan.totalDisplay), "Amount")}
                    >
                      {copied === "Amount" ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
              </>
            )}
          </dl>

          {/* 8 & 9. Then send your receipt */}
          <h2 className="pay-h2">Then send your receipt</h2>
          <p className="pay-after">
            Take a screenshot of the transfer confirmation and send it on Telegram. We verify it and send your login details.
          </p>

          {/* 10. Telegram button */}
          <a
            className="pay-tg"
            href="https://t.me/beyond_et"
            target="_blank"
            rel="noopener noreferrer"
          >
            Send receipt to @beyond_et
          </a>

          {/* 11. Terms */}
          <label className="pay-agree">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (error) setError("");
              }}
            />
            <span>
              I agree to the{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
              >
                Privacy Policy
              </a>
              , and confirm my company details are correct.
            </span>
          </label>

          {/* 12. Main button */}
          <button
            className="pay-go"
            type="button"
            disabled={!agreedToTerms || submitting}
            onClick={handleDone}
          >
            {submitting ? "Submitting..." : "I’ve sent the payment"}
          </button>

          {/* 13. Status hint */}
          <p className="pay-hint" role="status" style={{ color: error ? "#f43f5e" : payMuted }}>
            {error || ""}
          </p>

          {/* 14. Back button */}
          <button
            className="pay-back"
            type="button"
            onClick={() => router.push(sectorId ? `/register/details?sectorId=${sectorId}` : "/register")}
          >
            Back to company details
          </button>
        </main>
      </div>

      {/* Terms of Service & Privacy Policy Modal */}
      {showTermsModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowTermsModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 580,
              maxHeight: "85vh",
              overflowY: "auto",
              background: surface,
              borderRadius: 16,
              border: `1px solid ${border}`,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              padding: "26px 28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: dark ? "rgba(37,99,235,0.2)" : "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: ink }}>Terms of Service & Privacy Policy</h3>
                  <span style={{ fontSize: 11.5, color: muted }}>Beyond ERP Ethiopia • Enterprise Customer Agreement</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: muted,
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: ink, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <strong style={{ color: dark ? "#93c5fd" : "#1d4ed8" }}>1. Scope of Enterprise ERP Service</strong>
                <p style={{ margin: "4px 0 0", color: muted, fontSize: 12.5 }}>
                  Beyond ERP delivers cloud-native and offline-first enterprise management including general ledgers, Point of Sale, Ethiopian ERCA 15% VAT calculation, inventory control, and CRM workflows across Basic, Standard, and Custom tiers.
                </p>
              </div>

              <div>
                <strong style={{ color: dark ? "#93c5fd" : "#1d4ed8" }}>2. Confidentiality & Data Protection</strong>
                <p style={{ margin: "4px 0 0", color: muted, fontSize: 12.5 }}>
                  All financial records, TIN numbers, staff payroll, and client records are strictly protected under your organization tenant. Data is never disclosed to unauthorized parties or used outside workspace operations.
                </p>
              </div>

              <div>
                <strong style={{ color: dark ? "#93c5fd" : "#1d4ed8" }}>3. Verification, Payment & Agreement Policy</strong>
                <p style={{ margin: "4px 0 0", color: muted, fontSize: 12.5 }}>
                  For Basic and Standard tiers, workspace credentials are provisioned upon payment confirmation via CBE or Telebirr receipt submission on Telegram (@beyond_et). For Custom Enterprise tiers, payment and deployment scope are concluded by direct agreement with our administrative leadership.
                </p>
              </div>

              <div>
                <strong style={{ color: dark ? "#93c5fd" : "#1d4ed8" }}>4. Support Operations SLA</strong>
                <p style={{ margin: "4px 0 0", color: muted, fontSize: 12.5 }}>
                  Subscribers receive dedicated onboarding assistance, regulatory Ethiopian fiscal calendar updates, and technical support through our Addis Ababa support center (Phone: +251 939 048 523 / Email: beyondsolutionsupport@gmail.com).
                </p>
              </div>
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                style={{
                  height: 40,
                  padding: "0 22px",
                  borderRadius: 8,
                  border: 0,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

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
