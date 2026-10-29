"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Dashboard } from "@/lib/types";
import { emptyDashboard, getSectorDefinition } from "@/features/erp/config";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { DashboardView } from "@/features/erp/views/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { settings, refreshTrigger } = useApp();
  const [dashboard, setDashboard] = useState<Dashboard>(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.dashboard();
      setDashboard(data);
    } catch {
      setDashboard(emptyDashboard);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData, refreshTrigger]);

  const revenueChart = dashboard.revenueChart.length ? dashboard.revenueChart : emptyDashboard.revenueChart;
  const maxChart = Math.max(...revenueChart, 1);
  const companySector = getSectorDefinition(user?.companySectorId ?? settings?.companySectorId ?? "");

  return (
    <div className="screen-wrapper">
      <DashboardView
        dashboard={dashboard}
        sector={companySector}
        isLoading={isLoading}
        maxChart={maxChart}
        revenueChart={revenueChart}
        language={settings?.language ?? "English"}
      />
    </div>
  );
}
