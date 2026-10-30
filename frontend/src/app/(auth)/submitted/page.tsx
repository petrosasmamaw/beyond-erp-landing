"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Home,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { getSectorDefinition } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";

interface StoredReg {
  companyName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  sectorId?: string;
  paymentMethod?: string;
  paymentRef?: string;
}

export default function SubmittedPage() {
  const { toast } = useApp();
  const router = useRouter();
  const [reg, setReg] = useState<StoredReg | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("beyond_reg");
      if (stored) {
        setReg(JSON.parse(stored) as StoredReg);
      }
    } catch {
      // ignore
    }
  }, []);

  const sector = getSectorDefinition(reg?.sectorId ?? "");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)",
        color: "#0f172a"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#ffffff",
          borderRadius: 24,
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
          padding: "44px 38px",
          textAlign: "center",
          position: "relative"
        }}
      >
        {/* Centered Brand Logo & Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28
          }}
        >
          <img
            src="/logo.png"
            alt="Beyond ERP"
            width={60}
            height={60}
            style={{
              borderRadius: "50%",
              display: "block",
              objectFit: "contain",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.18)",
              border: "2px solid #2563eb"
            }}
          />
          <div
            style={{
              marginTop: 12,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.02em"
            }}
          >
            <span style={{ color: "#0f172a" }}>Beyond</span>{" "}
            <span style={{ color: "#2563eb" }}>ERP</span>
          </div>
        </div>

        {/* Celebratory Checkmark Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)"
          }}
        >
          <CheckCircle2 size={40} strokeWidth={2.4} />
        </div>

        {/* Heading */}
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#10b981"
          }}
        >
          Registration Received
        </p>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(30px, 3.2vw, 40px)",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.15,
            letterSpacing: "-0.02em"
          }}
        >
          Congratulations!
        </h1>

        {/* Core user message */}
        <p
          style={{
            margin: "0 auto 26px",
            fontSize: 16,
            color: "#475569",
            lineHeight: 1.6,
            maxWidth: 500
          }}
        >
          Your registration request and payment submission have been received successfully.
          <br />
          <strong style={{ color: "#0f172a" }}>
            Our company team will contact you soon and will send your workspace link and login credentials.
          </strong>
        </p>

        {/* Summary Card */}
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            padding: "18px 20px",
            textAlign: "left",
            marginBottom: 24
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b" }}>
              Submission Summary
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 999,
                background: "rgba(16, 185, 129, 0.12)",
                color: "#059669",
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              Under Verification
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748b" }}>Company</p>
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", overflowWrap: "anywhere" }}>
                {reg?.companyName || "Your Company"}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748b" }}>Sector</p>
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                {sector.name || "Enterprise"}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748b" }}>Contact Person</p>
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                {reg?.fullName || "Company Admin"}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748b" }}>Payment Method</p>
              <p style={{ margin: 0, fontWeight: 700, color: "#2563eb" }}>
                {reg?.paymentMethod === "TELEBIRR" ? "Telebirr" : "CBE Bank Transfer"}
              </p>
            </div>
          </div>
        </div>

        {/* Telegram Direct Connect Callout */}
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(34, 158, 217, 0.35)",
            background: "rgba(34, 158, 217, 0.06)",
            padding: "16px 18px",
            marginBottom: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            textAlign: "left"
          }}
        >
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              Fast-Track Activation on Telegram
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
              Already sent your screenshot? You can chat with our setup manager at <strong>@Nehemiah00</strong>
            </p>
          </div>
          <a
            href="https://t.me/Nehemiah00"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              background: "#229ED9",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(34, 158, 217, 0.3)"
            }}
          >
            <Send size={13} />
            Chat Now
          </a>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gap: 10 }}>
          {/* Prominent Back to Home Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              height: 50,
              borderRadius: 12,
              border: 0,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 6px 20px rgba(37, 99, 235, 0.35)",
              transition: "transform 0.15s, opacity 0.15s"
            }}
          >
            <Home size={18} />
            Back to Home
          </button>

          {/* Secondary Sign In Button */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s"
            }}
          >
            <Lock size={15} />
            Existing Customer? Sign In
          </button>
        </div>

        {/* Contact info footer */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid #e2e8f0",
            fontSize: 12,
            color: "#64748b",
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Support:</strong> +251 2815 1599 &bull; +251 3904 8523 &bull; beyondsolutionsupport@gmail.com
          </p>
          <p style={{ margin: 0 }}>
            Office: Addis Ababa, 22 Bata Complex 3rd Floor &bull; Powered by beyond.et
          </p>
        </div>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}