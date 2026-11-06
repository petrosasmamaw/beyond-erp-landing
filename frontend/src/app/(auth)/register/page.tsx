"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Zap } from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch } from "@/store/hooks";
import { switchSector } from "@/store/slices/sectorsSlice";
import { loginAsDemo } from "@/store/slices/authSlice";
import { setMockProfile } from "@/lib/mock";
import { Suspense, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();
  const { loginDemo } = useAuth();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [selectedId, setSelectedId] = useState(searchParams.get("sectorId") ?? "");
  const [error, setError] = useState("");

  const selectedSector = sectorDefinitions.find((s) => s.id === selectedId);

  const handleContinue = () => {
    if (!selectedId) {
      setError("Choose a sector to continue");
      showToast("Choose your company sector first");
      return;
    }
    router.push(`/register/details?sectorId=${encodeURIComponent(selectedId)}`);
  };

  const handleInstantDemo = () => {
    if (!selectedId || !selectedSector) {
      setError("Please select a sector above to experience the instant demo");
      showToast("Select a sector first for instant demo");
      return;
    }

    let companyName = `${selectedSector.name} Demo Co.`;
    let fullName: string | undefined;
    let email: string | undefined;
    let phone: string | undefined;
    let tinNumber: string | undefined;

    try {
      const saved = sessionStorage.getItem("beyond_reg_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companyName) companyName = parsed.companyName;
        if (parsed.fullName) fullName = parsed.fullName;
        if (parsed.email) email = parsed.email;
        if (parsed.phone) phone = parsed.phone;
        if (parsed.tinNumber) tinNumber = parsed.tinNumber;
      }
    } catch {
      // ignore
    }

    // 1. Redux demo session setup
    dispatch(switchSector(selectedId));
    dispatch(
      loginAsDemo({
        sectorId: selectedId,
        companyName,
        fullName,
        email,
        phone,
        tinNumber,
      })
    );

    // 2. Mock profile sync
    setMockProfile(selectedId, companyName, { fullName, email, phone, tinNumber });

    // 3. AuthContext demo cookie & local storage
    if (loginDemo) {
      loginDemo(selectedId, companyName, {
        fullName,
        email,
        phone,
        companyTinNumber: tinNumber,
      });
    }

    showToast(`Launching ${companyName} interactive workspace...`);
    router.push("/dashboard");
  };

  const border = dark ? "#1a2d42" : "#e2e8f0";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = dark ? "#8b9ab0" : "#64748b";

  return (
    <main className="marketing-shell">
      <section className="sector-select-page">
        <div className="auth-topbar">
          <button type="button" className="secondary-button compact" onClick={() => router.push("/")}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>Step 1 of 3</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Brand Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 4,
            marginBottom: 8,
            cursor: "pointer",
            width: "fit-content"
          }}
          onClick={() => router.push("/")}
        >
          <div
            style={{
              width: 46,
              height: 46,
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
              width={46}
              height={46}
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
            <span style={{ color: dark ? "#ffffff" : "#0f172a", transition: "color 0.15s ease" }}>Beyond ERP</span>
          </span>
        </div>

        <div className="sector-select-header">
          <p className="eyebrow">Choose your operating model</p>
          <h1>Select the sector for your company</h1>
          <span>
            Choose your sector to preview module workflows or continue to company registration and workspace activation.
          </span>
        </div>

        <div className="sector-select-grid">
          {sectorDefinitions.map((sector) => {
            const selected = selectedId === sector.id;
            return (
              <button
                type="button"
                key={sector.id}
                className={selected ? "selected" : ""}
                onClick={() => { setSelectedId(sector.id); setError(""); }}
                aria-pressed={selected}
              >
                <span className="sector-pick-icon" style={{ background: sector.tint, color: sector.color }}>
                  <i className={sector.icon} />
                </span>
                <strong>{sector.name}</strong>
                <small>{sector.description}</small>
              </button>
            );
          })}
        </div>

        {error ? <span className="field-error">{error}</span> : null}

        {/* Action Buttons: Continue, Instant Demo, Back */}
        <div
          className="sector-select-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            maxWidth: 520,
            margin: "24px auto 0"
          }}
        >
          {/* Primary Continue Button */}
          <button
            type="button"
            className="primary-button"
            onClick={handleContinue}
            style={{ width: "100%", height: 48, fontSize: 15 }}
          >
            Continue to Workspace Details
            <ChevronRight size={18} />
          </button>

          {/* Instant Demo Button — Inactive before sector selection, active once sector is picked */}
          <button
            type="button"
            disabled={!selectedId}
            onClick={handleInstantDemo}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: !selectedId
                ? `1.5px solid ${dark ? "#1a2a40" : "#e2e8f0"}`
                : `1.5px solid ${dark ? "#3b82f6" : "#2563eb"}`,
              background: !selectedId
                ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)")
                : (dark ? "rgba(37,99,235,0.18)" : "#eff6ff"),
              color: !selectedId
                ? (dark ? "#64748b" : "#94a3b8")
                : (dark ? "#93c5fd" : "#1d4ed8"),
              fontSize: 14.5,
              fontWeight: 700,
              cursor: !selectedId ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              transition: "all 0.2s ease",
              boxShadow: !selectedId ? "none" : "0 4px 14px rgba(37, 99, 235, 0.2)",
              opacity: !selectedId ? 0.65 : 1,
            }}
          >
            <Zap
              size={17}
              style={{
                color: !selectedId ? "currentColor" : "#2563eb",
                filter: selectedId ? "drop-shadow(0 1px 2px rgba(37,99,235,0.3))" : "none"
              }}
            />
            {selectedSector ? (
              <span>
                Instant Demo: Explore <strong>{selectedSector.name}</strong> Workspace
              </span>
            ) : (
              <span>Instant Demo (Select a Sector First)</span>
            )}
          </button>

          {/* Back to landing */}
          <button
            type="button"
            className="secondary-button"
            onClick={() => router.push("/")}
            style={{ width: "100%", height: 42, fontSize: 13.5 }}
          >
            Back to landing
          </button>
        </div>
      </section>
      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
