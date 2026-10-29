"use client";

import { use } from "react";
import { useApp } from "@/contexts/AppContext";
import { SectorDetail } from "@/features/erp/views/sectors";

export default function SectorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { sectors, settings, refreshTrigger: _rt } = useApp();
  void _rt;

  const sector = sectors.find((s) => s.id === id);

  if (!sector) {
    return (
      <div className="screen-wrapper">
        <div className="empty-state" style={{ margin: "40px auto" }}>
          <strong>Sector not found</strong>
          <span>This sector does not exist or has not loaded yet.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-wrapper">
      <SectorDetail
        sector={sector}
        language={settings?.language ?? "English"}
      />
    </div>
  );
}
