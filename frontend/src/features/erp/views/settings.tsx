"use client";

import { useState } from "react";
import { Banknote, Clock, HeartPulse, Mail, RefreshCcw, Save, Smartphone } from "lucide-react";
import { api } from "@/lib/api";
import { getEthiopianFiscalYear } from "@/lib/format";
import type { Settings } from "@/lib/types";
import { t } from "../config";
import { getStorageUsage } from "../helpers";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`switch-control ${checked ? "on" : ""}`}
    >
      <span className="switch-knob" />
    </button>
  );
}

function ToggleCard({
  icon,
  title,
  detail,
  checked,
  onChange,
  isLast = false,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: isLast ? "none" : "1px solid var(--border-line)",
      }}
    >
      <div style={{ color: "var(--text-muted)", flexShrink: 0, display: "flex", alignItems: "center" }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: "20px" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: "16px" }}>{detail}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCss: React.CSSProperties = {
  height: 36,
  borderRadius: 6,
  border: "1px solid var(--border-line)",
  background: "var(--bg-surface)",
  padding: "0 12px",
  color: "var(--text-primary)",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "var(--font-sans)",
};

export function SettingsView({
  settings,
  language = "English",
  onSave,
}: {
  settings: Settings | null;
  language?: string;
  onSave: (patch: Partial<Settings>) => Promise<void>;
}) {
  const [emailTest, setEmailTest] = useState({
    to: "owner@beyonderp.local",
    subject: "Beyond ERP email test",
    message: "Your Nodemailer adapter is connected.",
  });
  const [emailStatus, setEmailStatus] = useState("");
  const storage = getStorageUsage();

  if (!settings) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Loading settings…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Configuration</p>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: "28px" }}>Settings</h2>
      </div>

      {/* Business info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Business</h3>
        <div className="ui-surface" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label={t("companyName", language)}>
            <input
              style={inputCss}
              value={settings.companyName}
              onChange={(e) => void onSave({ companyName: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            />
          </Field>
          <Field label={t("tinNumber", language)}>
            <input
              style={inputCss}
              value={settings.tinNumber}
              onChange={(e) => void onSave({ tinNumber: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Business Type">
              <select
                style={{ ...inputCss, cursor: "pointer" }}
                value={settings.businessType}
                onChange={(e) => void onSave({ businessType: e.target.value })}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              >
                {["PLC", "Sole Proprietorship", "Partnership", "Cooperative"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label={t("language", language)}>
              <select
                style={{ ...inputCss, cursor: "pointer" }}
                value={settings.language}
                onChange={(e) => void onSave({ language: e.target.value })}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
              >
                {["English", "Amharic", "Afaan Oromo", "Tigrinya"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
            {[
              { label: `Currency ${settings.currency}` },
              { label: `VAT ${settings.taxRate}%` },
              { label: `Fiscal Year ${getEthiopianFiscalYear()} E.C.` },
            ].map((badge) => (
              <span key={badge.label} className="chip">
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Integrations</h3>
        <div className="ui-surface" style={{ display: "flex", flexDirection: "column" }}>
          <ToggleCard icon={<Smartphone size={16} />} title="Telebirr" detail="Ethio Telecom mobile money" checked={settings.telebirrEnabled} onChange={(telebirrEnabled) => void onSave({ telebirrEnabled })} />
          <ToggleCard icon={<Banknote size={16} />} title="CBE Bank" detail="Commercial Bank of Ethiopia" checked={settings.cbeEnabled} onChange={(cbeEnabled) => void onSave({ cbeEnabled })} />
          <ToggleCard icon={<HeartPulse size={16} />} title="EHMIS" detail="Ethiopian Health MIS" checked={settings.ehmisEnabled} onChange={(ehmisEnabled) => void onSave({ ehmisEnabled })} />
          <ToggleCard icon={<Mail size={16} />} title="Email" detail="Nodemailer SMTP adapter" checked={settings.emailEnabled} onChange={(emailEnabled) => void onSave({ emailEnabled })} isLast={!settings.emailEnabled} />
          {settings.emailEnabled && (
            <form
              style={{ padding: 16, borderTop: "1px solid var(--border-line)", display: "flex", flexDirection: "column", gap: 12 }}
              onSubmit={async (e) => {
                e.preventDefault();
                setEmailStatus("Sending…");
                try {
                  const res = await api.sendTestEmail(emailTest);
                  setEmailStatus(res.skipped ? "SMTP not configured — logged as skipped." : "Email sent.");
                } catch (err) {
                  setEmailStatus(err instanceof Error ? err.message : "Email failed");
                }
              }}
            >
              <Field label="Test recipient">
                <input
                  type="email"
                  style={inputCss}
                  value={emailTest.to}
                  onChange={(e) => setEmailTest((f) => ({ ...f, to: e.target.value }))}
                  onFocus={(ev) => (ev.currentTarget.style.borderColor = "var(--accent-blue)")}
                  onBlur={(ev) => (ev.currentTarget.style.borderColor = "var(--border-line)")}
                />
              </Field>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="submit" className="secondary-button" style={{ height: 36 }}>
                  <Mail size={14} /> Send Test
                </button>
                {emailStatus && (
                  <span style={{ fontSize: 12, color: emailStatus.includes("sent") ? "var(--positive)" : "var(--text-muted)" }}>
                    {emailStatus}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Connectivity */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Connectivity</h3>
        <div className="ui-surface" style={{ display: "flex", flexDirection: "column" }}>
          <ToggleCard icon={<Clock size={16} />} title="Offline Mode" detail="Queue work during poor connectivity" checked={settings.offlineMode} onChange={(offlineMode) => void onSave({ offlineMode })} />
          <ToggleCard icon={<RefreshCcw size={16} />} title="Auto Sync" detail="Sync when connection returns" checked={settings.autoSync} onChange={(autoSync) => void onSave({ autoSync })} />
          <ToggleCard icon={<Save size={16} />} title="Data Compression" detail="Reduce local storage footprint" checked={settings.dataCompression} onChange={(dataCompression) => void onSave({ dataCompression })} isLast={true} />

          {/* Storage bar */}
          <div style={{ borderTop: "1px solid var(--border-line)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Local Storage</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{storage.usedKb} KB / 5,120 KB ({storage.percent}%)</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${storage.percent}%`, background: "var(--accent-blue)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <button
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border-line)",
                  background: "var(--bg-surface)",
                  color: "var(--negative)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (window.confirm("Clear local cache? This cannot be undone.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                {t("clearCache", language)}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
