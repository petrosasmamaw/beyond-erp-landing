"use client";

import { use } from "react";
import { useApp } from "@/contexts/AppContext";
import { getSectorConfig } from "@/features/sectors";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleKey } = use(params);
  const { settings } = useApp();

  const sectorId = settings?.companySectorId ?? null;
  const config = getSectorConfig(sectorId);

  if (!config) {
    return (
      <div className="screen-wrapper">
        <EmptyState
          title="No sector modules available"
          action="Contact your administrator to configure your sector"
        />
      </div>
    );
  }

  const ModuleComponent = config.modules[moduleKey];

  if (!ModuleComponent) {
    return (
      <div className="screen-wrapper">
        <EmptyState
          title={`Module "${moduleKey}" not found`}
          action="Please navigate using the sidebar"
        />
      </div>
    );
  }

  return <ModuleComponent />;
}
