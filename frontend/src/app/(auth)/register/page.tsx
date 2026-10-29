"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { Suspense, useState } from "react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();

  const [selectedId, setSelectedId] = useState(searchParams.get("sectorId") ?? "");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selectedId) {
      setError("Choose a sector to continue");
      showToast("Choose your company sector first");
      return;
    }
    router.push(`/register/details?sectorId=${selectedId}`);
  };

  return (
    <main className="marketing-shell">
      <section className="sector-select-page">
        <div className="auth-topbar">
          <button type="button" className="secondary-button compact" onClick={() => router.push("/")}>
            <ArrowLeft size={16} />
            Back
          </button>
          <span>Step 1 of 2</span>
        </div>
        <div className="sector-select-header">
          <p className="eyebrow">Choose your operating model</p>
          <h1>Select the sector for your company</h1>
          <span>
            This sector is sent with your registration request. After payment approval, your ERP login opens
            with these modules first.
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
        <div className="sector-select-actions">
          <button type="button" className="primary-button" onClick={handleContinue}>
            Continue Registration
            <ChevronRight size={18} />
          </button>
          <button type="button" className="secondary-button" onClick={() => router.push("/")}>
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
