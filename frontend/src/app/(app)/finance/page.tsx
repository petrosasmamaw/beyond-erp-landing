"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Employee } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { FinanceView } from "@/features/erp/views/finance";

export default function FinancePage() {
  const { sectors, showToast, refreshTrigger } = useApp();
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.employees();
      setEmployees(data);
    } catch { /* keep previous */ }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData, refreshTrigger]);

  return (
    <div className="screen-wrapper">
      <FinanceView sectors={sectors} employees={employees} showToast={showToast} />
    </div>
  );
}
