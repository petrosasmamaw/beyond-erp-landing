"use client";

import { useState } from "react";
import { Barcode } from "lucide-react";
import { BarcodeDisplay } from "@/components/ui/BarcodeDisplay";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

export function BarcodeModal() {
  const { modal, closeModal } = useApp();
  const isOpen = modal?.type === "barcode";
  const [text, setText] = useState("");

  if (!isOpen) return null;

  return (
    <Modal title="Generate Barcode" isOpen={isOpen} onClose={closeModal}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          SKU / Product Code
          <input
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            placeholder="e.g. PROD-001"
            maxLength={20}
            style={{
              height: 36,
              borderRadius: 6,
              border: "1px solid var(--border-line)",
              background: "var(--bg-surface)",
              padding: "0 12px",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
            autoFocus
          />
        </label>

        {text.trim() ? (
          <div
            style={{
              padding: "20px",
              borderRadius: 6,
              border: "1px solid var(--border-line)",
              background: "var(--bg-canvas)",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "var(--accent-blue)",
              }}
            />
            <BarcodeDisplay value={text.trim()} />
          </div>
        ) : (
          <div
            style={{
              padding: "36px 16px",
              borderRadius: 6,
              border: "1px solid var(--border-line)",
              background: "var(--bg-subtle)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "var(--text-muted)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "var(--accent-blue)",
              }}
            />
            <Barcode size={24} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 12 }}>Enter a product code above</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
