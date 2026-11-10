"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, PackageCheck, Plus, RefreshCw, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

interface StockAlertItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  unit: string;
  status: "CRITICAL" | "LOW_STOCK" | "OUT_OF_STOCK";
  suggestedReorder: number;
}

const INITIAL_ALERTS: StockAlertItem[] = [
  {
    id: "alt-1",
    sku: "TEFF-50KG",
    name: "Magna White Teff Grain (50kg Bag)",
    category: "Grains & Flours",
    currentStock: 4,
    reorderPoint: 15,
    unit: "bags",
    status: "CRITICAL",
    suggestedReorder: 25,
  },
  {
    id: "alt-2",
    sku: "COF-SID-1KG",
    name: "Ethiopian Sidama Specialty Roasted (1kg)",
    category: "Beverages & Coffee",
    currentStock: 8,
    reorderPoint: 20,
    unit: "packs",
    status: "LOW_STOCK",
    suggestedReorder: 30,
  },
  {
    id: "alt-3",
    sku: "OIL-5L",
    name: "Pure Sunflower Cooking Oil (5 Liters)",
    category: "Cooking Essentials",
    currentStock: 12,
    reorderPoint: 25,
    unit: "cans",
    status: "LOW_STOCK",
    suggestedReorder: 20,
  },
  {
    id: "alt-4",
    sku: "SUGAR-25KG",
    name: "Wonji Refined Sugar (25kg Sack)",
    category: "Cooking Essentials",
    currentStock: 0,
    reorderPoint: 10,
    unit: "sacks",
    status: "OUT_OF_STOCK",
    suggestedReorder: 20,
  },
];

export function StockAlertsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showToast } = useApp();
  const [alerts, setAlerts] = useState<StockAlertItem[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "LOW">("ALL");

  if (!isOpen) return null;

  const handleReorder = (item: StockAlertItem) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === item.id
          ? {
              ...a,
              currentStock: a.currentStock + a.suggestedReorder,
              status: "LOW_STOCK",
            }
          : a
      )
    );
    showToast(`Reorder placed: +${item.suggestedReorder} ${item.unit} for ${item.name}`);
  };

  const filtered = alerts.filter((item) => {
    if (filter === "CRITICAL") return item.status === "CRITICAL" || item.status === "OUT_OF_STOCK";
    if (filter === "LOW") return item.status === "LOW_STOCK";
    return true;
  });

  return (
    <Modal title="Stock & Inventory Alerts" isOpen={isOpen} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Banner */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              color: "var(--negative, #ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
              {alerts.length} Items Require Restocking
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Stock levels have dipped below their safety reorder thresholds.
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 14,
              border: "1px solid var(--border-line)",
              background: filter === "ALL" ? "var(--accent-blue)" : "transparent",
              color: filter === "ALL" ? "#ffffff" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("CRITICAL")}
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 14,
              border: "1px solid var(--border-line)",
              background: filter === "CRITICAL" ? "var(--negative, #ef4444)" : "transparent",
              color: filter === "CRITICAL" ? "#ffffff" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Critical / Out of Stock
          </button>
          <button
            type="button"
            onClick={() => setFilter("LOW")}
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 14,
              border: "1px solid var(--border-line)",
              background: filter === "LOW" ? "var(--warning, #f59e0b)" : "transparent",
              color: filter === "LOW" ? "#ffffff" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Low Stock
          </button>
        </div>

        {/* List of items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 360, overflowY: "auto" }}>
          {filtered.map((item) => {
            const isCritical = item.status === "CRITICAL" || item.status === "OUT_OF_STOCK";
            return (
              <div
                key={item.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border-line)",
                  background: "var(--bg-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0, flex: "1 1 200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        background: isCritical ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: isCritical ? "var(--negative, #ef4444)" : "var(--warning, #f59e0b)",
                      }}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
                      {item.sku}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>
                    {item.name}
                  </div>

                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    Current: <strong style={{ color: isCritical ? "var(--negative, #ef4444)" : "var(--text-primary)" }}>{item.currentStock} {item.unit}</strong> · Threshold: {item.reorderPoint} {item.unit}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleReorder(item)}
                    style={{
                      height: 30,
                      padding: "0 10px",
                      borderRadius: 6,
                      border: "1px solid var(--accent-blue)",
                      background: "var(--accent-blue)",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={12} />
                    <span>Reorder (+{item.suggestedReorder})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
            paddingTop: 12,
            borderTop: "1px solid var(--border-line)",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/m/inventory");
            }}
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 6,
              border: "1px solid var(--border-line)",
              background: "transparent",
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <span>Open Full Inventory</span>
            <ArrowRight size={13} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              height: 32,
              padding: "0 16px",
              borderRadius: 6,
              border: "none",
              background: "var(--bg-subtle)",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

