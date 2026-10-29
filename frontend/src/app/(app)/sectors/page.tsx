"use client";

import { useApp } from "@/contexts/AppContext";
import { SectorsView } from "@/features/erp/views/sectors";

export default function SectorsPage() {
  const { sectors, settings } = useApp();

  return (
    <div className="screen-wrapper">
      <SectorsView
        sectors={sectors}
        language={settings?.language ?? "English"}
      />
    </div>
  );
}
