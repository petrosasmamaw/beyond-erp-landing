"use client";

import { FileText, X } from "lucide-react";
import { writeOperationQueue, readOperationQueue, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";

export function FailedOpsModal() {
  const { modal, closeModal, setPendingCount } = useApp();
  const isOpen = modal?.type === "failed-ops";

  if (!isOpen) return null;

  const opQueue = readOperationQueue();

  const dismiss = (localId: string) => {
    const updated = opQueue.filter((o) => o.localId !== localId);
    writeOperationQueue(updated);
    setPendingCount(readQueue().length + updated.length);
    if (updated.length === 0) closeModal();
  };

  const clearAll = () => {
    writeOperationQueue([]);
    setPendingCount(readQueue().length);
    closeModal();
  };

  return (
    <Modal title="Pending Sync Queue" isOpen={isOpen} onClose={closeModal}>
      {opQueue.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)" }}>
          <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>
            <FileText size={24} style={{ color: "var(--text-muted)" }} />
          </div>
          <span style={{ fontSize: 13 }}>No pending operations</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="ui-surface" style={{ display: "flex", flexDirection: "column" }}>
            {opQueue.map((op, idx) => (
              <div
                key={op.localId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 14px",
                  borderBottom: idx === opQueue.length - 1 ? "none" : "1px solid var(--border-line)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                    {op.label || op.action}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {op.action.replace(/_/g, " ")}
                  </div>
                </div>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => dismiss(op.localId)}
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="button"
              className="secondary-button"
              onClick={clearAll}
              style={{ height: 36, padding: "0 16px" }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
