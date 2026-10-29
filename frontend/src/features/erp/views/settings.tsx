"use client";

import { useState } from "react";
import { Banknote, Clock, HeartPulse, Mail, RefreshCcw, Save, Smartphone } from "lucide-react";
import { api } from "@/lib/api";
import { getEthiopianFiscalYear } from "@/lib/format";
import type { Settings } from "@/lib/types";
import { t } from "../config";
import { getStorageUsage } from "../helpers";
import { useTheme } from "@/contexts/ThemeContext";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: dark ? "#111827" : "#ffffff",
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
  };
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        background: checked ? "#2563eb" : "#cbd5e1",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute",
        top: 3,
        left: checked ? 21 : 3,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function ToggleCard({ icon, title, detail, checked, onChange, c }: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${c.border}` }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: c.alt, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.muted, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{title}</div>
        <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{detail}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Field({ label, children, c }: { label: string; children: React.ReactNode; c: ReturnType<typeof useColors> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11.5, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCss = (c: ReturnType<typeof useColors>) => ({
  height: 38,
  borderRadius: 8,
  border: `1px solid ${c.border}`,
  background: c.alt,
  padding: "0 11px",
  color: c.ink,
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
});

export function SettingsView({
  settings,
  language = "English",
  onSave,
}: {
  settings: Settings | null;
  language?: string;
  onSave: (patch: Partial<Settings>) => Promise<void>;
}) {
  const c = useColors();
  const [emailTest, setEmailTest] = useState({
    to: "owner@beyonderp.local",
    subject: "Beyond ERP email test",
    message: "Your Nodemailer adapter is connected.",
  });
  const [emailStatus, setEmailStatus] = useState("");
  const storage = getStorageUsage();

  if (!settings) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ padding: "48px", textAlign: "center", color: c.muted }}>Loading settings…</div>
      </div>
    );
  }

  const card = {
    borderRadius: 12,
    border: `1px solid ${c.border}`,
    background: c.surface,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Configuration</p>
        <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Settings</h2>
      </div>

      {/* Business info */}
      <div style={card}>
        <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Business</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label={t("companyName", language)} c={c}>
            <input
              style={inputCss(c)}
              value={settings.companyName}
              onChange={(e) => void onSave({ companyName: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
            />
          </Field>
          <Field label={t("tinNumber", language)} c={c}>
            <input
              style={inputCss(c)}
              value={settings.tinNumber}
              onChange={(e) => void onSave({ tinNumber: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Business Type" c={c}>
              <select style={{ ...inputCss(c), height: 38, padding: "0 11px" }} value={settings.businessType} onChange={(e) => void onSave({ businessType: e.target.value })}>
                {["PLC", "Sole Proprietorship", "Partnership", "Cooperative"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label={t("language", language)} c={c}>
              <select style={{ ...inputCss(c), height: 38, padding: "0 11px" }} value={settings.language} onChange={(e) => void onSave({ language: e.target.value })}>
                {["English", "Amharic", "Afaan Oromo", "Tigrinya"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", paddingTop: 2 }}>
            {[
              { label: `Currency ${settings.currency}`, color: "#2563eb" },
              { label: `VAT ${settings.taxRate}%`, color: "#f59e0b" },
              { label: `Fiscal Year ${getEthiopianFiscalYear()} E.C.`, color: "#10b981" },
            ].map((badge) => (
              <span key={badge.label} style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 8px", borderRadius: 5, background: `${badge.color}18`, color: badge.color, fontSize: 11, fontWeight: 700 }}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div style={card}>
        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Integrations</p>
        <ToggleCard c={c} icon={<Smartphone size={15} />} title="Telebirr" detail="Ethio Telecom mobile money" checked={settings.telebirrEnabled} onChange={(telebirrEnabled) => void onSave({ telebirrEnabled })} />
        <ToggleCard c={c} icon={<Banknote size={15} />} title="CBE Bank" detail="Commercial Bank of Ethiopia" checked={settings.cbeEnabled} onChange={(cbeEnabled) => void onSave({ cbeEnabled })} />
        <ToggleCard c={c} icon={<HeartPulse size={15} />} title="EHMIS" detail="Ethiopian Health MIS" checked={settings.ehmisEnabled} onChange={(ehmisEnabled) => void onSave({ ehmisEnabled })} />
        <div style={{ borderBottom: `1px solid ${c.border}` }}>
          <ToggleCard c={c} icon={<Mail size={15} />} title="Email" detail="Nodemailer SMTP adapter" checked={settings.emailEnabled} onChange={(emailEnabled) => void onSave({ emailEnabled })} />
        </div>
        {settings.emailEnabled && (
          <form
            style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}
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
            <Field label="Test recipient" c={c}>
              <input
                type="email"
                style={inputCss(c)}
                value={emailTest.to}
                onChange={(e) => setEmailTest((f) => ({ ...f, to: e.target.value }))}
                onFocus={(ev) => (ev.currentTarget.style.borderColor = "#2563eb")}
                onBlur={(ev) => (ev.currentTarget.style.borderColor = c.border)}
              />
            </Field>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <Mail size={13} /> Send Test
              </button>
              {emailStatus && <span style={{ fontSize: 12, color: emailStatus.includes("sent") ? "#10b981" : c.muted }}>{emailStatus}</span>}
            </div>
          </form>
        )}
      </div>

      {/* Connectivity */}
      <div style={card}>
        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Connectivity</p>
        <ToggleCard c={c} icon={<Clock size={15} />} title="Offline Mode" detail="Queue work during poor connectivity" checked={settings.offlineMode} onChange={(offlineMode) => void onSave({ offlineMode })} />
        <ToggleCard c={c} icon={<RefreshCcw size={15} />} title="Auto Sync" detail="Sync when connection returns" checked={settings.autoSync} onChange={(autoSync) => void onSave({ autoSync })} />
        <div style={{ borderBottom: "none" }}>
          <ToggleCard c={c} icon={<Save size={15} />} title="Data Compression" detail="Reduce local storage footprint" checked={settings.dataCompression} onChange={(dataCompression) => void onSave({ dataCompression })} />
        </div>

        {/* Storage bar */}
        <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.alt }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: c.ink }}>Local Storage</span>
            <span style={{ fontSize: 11, color: c.muted }}>{storage.usedKb} KB / 5,120 KB ({storage.percent}%)</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: c.dark ? "#1a2d3d" : "#e2e8f0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${storage.percent}%`, borderRadius: 3, background: storage.percent > 80 ? "#f43f5e" : "#2563eb", transition: "width 0.4s" }} />
          </div>
        </div>

        <button
          style={{ marginTop: 12, padding: "8px 14px", borderRadius: 8, border: `1px solid #f43f5e`, background: c.dark ? "#1c0a10" : "#fff1f2", color: "#f43f5e", fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
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
  );
}
