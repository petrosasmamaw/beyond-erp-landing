"use client";

import { useState } from "react";
import { Barcode, X } from "lucide-react";
import { BarcodeDisplay } from "@/components/ui/BarcodeDisplay";
import { useApp } from "@/contexts/AppContext";

export function BarcodeModal() {
  const { modal, closeModal } = useApp();
  const isOpen = modal?.type === "barcode";
  const [text, setText] = useState("");

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <section className="modal">
        <div className="modal-header">
          <h2>Generate Barcode</h2>
          <button className="icon-button plain" onClick={closeModal} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="stack">
          <label>
            SKU / Product Code
            <input
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              placeholder="e.g. PROD-001"
              maxLength={20}
            />
          </label>
          {text.trim() ? (
            <BarcodeDisplay value={text.trim()} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Barcode size={26} /></div>
              <span>Enter a product code above</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
