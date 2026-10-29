"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Dashboard } from "@/lib/types";
import { emptyDashboard } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { ReportsView } from "@/features/erp/views/reports";

export default function ReportsPage() {
  const { settings, showToast, refreshTrigger } = useApp();
  const [dashboard, setDashboard] = useState<Dashboard>(emptyDashboard);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.dashboard();
      setDashboard(data);
    } catch { /* keep previous */ }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData, refreshTrigger]);

  const downloadCsv = async () => {
    try {
      const blob = await api.transactionCsv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `beyond_erp_report_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "CSV export failed");
    }
  };

  const shareReport = () => {
    const companyName = settings?.companyName ?? "Beyond ERP";
    const text = [`Beyond ERP Report`, `Company: ${companyName}`, `Net profit: ETB ${dashboard.stats.netProfit}`].join("\n");
    const appUrl = typeof window !== "undefined" ? window.location.origin : "https://beyonderp.local";
    const url = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="screen-wrapper">
      <ReportsView
        dashboard={dashboard}
        onCsv={() => void downloadCsv()}
        onPrint={() => window.print()}
        onShare={shareReport}
      />
    </div>
  );
}
