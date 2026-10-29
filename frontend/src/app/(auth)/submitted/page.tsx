"use client";

import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

function getStoredReg() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(sessionStorage.getItem("beyond_reg") ?? "null") as {
      companyName: string; sectorId: string;
    } | null;
  } catch { return null; }
}

export default function SubmittedPage() {
  const { toast } = useApp();
  const router = useRouter();
  const reg = getStoredReg();

  return (
    <main className="app-shell">
      <section className="phone-frame auth-frame">
        <div className="login-panel">
          <div className="login-brand">
            <div className="empty-icon"><ShieldCheck size={26} /></div>
            <p className="eyebrow">Registration received</p>
            <h1>We will review your request</h1>
            <span>
              Your request for <strong>{reg?.companyName ?? "your company"}</strong> is now in the admin queue.
              After payment approval, we will create your login and send the credentials.
            </span>
          </div>
          <div className="quick-actions">
            <button type="button" className="primary-button" onClick={() => router.push("/login")}>
              <Lock size={18} />
              Sign In
            </button>
            <button type="button" className="secondary-button" onClick={() => router.push("/")}>
              Back Home
            </button>
          </div>
        </div>
      </section>
      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
