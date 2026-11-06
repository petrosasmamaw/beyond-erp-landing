"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { Suspense, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();
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
