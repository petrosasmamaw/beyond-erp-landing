"use client";

import { FileText, X } from "lucide-react";
import { writeOperationQueue, readOperationQueue, readQueue } from "@/features/erp/offline";
import { useApp } from "@/contexts/AppContext";

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
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <section className="modal">
        <div className="modal-header">
          <h2>Pending Sync Queue</h2>
          <button className="icon-button plain" onClick={closeModal} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {opQueue.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FileText size={26} /></div>
            <span>No pending operations</span>
          </div>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            {opQueue.map((op) => (
              <div key={op.localId} className="card" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 13 }}>{op.label || op.action}</strong>
                  <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {op.action.replace(/_/g, " ")}
                  </span>
                </div>
                <button className="icon-button plain" onClick={() => dismiss(op.localId)} aria-label="Dismiss">
                  <X size={16} />
                </button>
              </div>
            ))}
            <button className="secondary-button" onClick={clearAll} style={{ marginTop: 4 }}>
              Clear All
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
