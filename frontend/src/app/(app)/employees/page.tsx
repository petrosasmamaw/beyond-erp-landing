"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Employee } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { paginate } from "@/features/erp/helpers";
import { EmployeesView } from "@/features/erp/views/employees";

export default function EmployeesPage() {
  const { settings, refreshTrigger, openEmployeeModal, openConfirmModal, showToast, triggerRefresh } = useApp();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [advanced, setAdvanced] = useState({ status: "", department: "" });
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.employees();
      setEmployees(data);
    } catch { /* keep previous */ }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData, refreshTrigger]);

  const filtered = employees.filter((e) => {
    const term = search.toLowerCase();
    return (
      (!term || e.fullName.toLowerCase().includes(term) || e.position.toLowerCase().includes(term) || e.department.toLowerCase().includes(term) || e.phone.toLowerCase().includes(term)) &&
      (!advanced.status || e.status === advanced.status) &&
      (!advanced.department || e.department.toLowerCase().includes(advanced.department.toLowerCase()))
    );
  });

  const paged = paginate(filtered, page);
  const departments = Array.from(new Set(employees.map((e) => e.department))).sort();

  const deleteEmployee = (e: Employee) => {
    openConfirmModal(`Deactivate ${e.fullName}? They will be marked inactive.`, async () => {
      await api.deleteEmployee(e.id);
      showToast("Employee deactivated");
      triggerRefresh();
    });
  };

  return (
    <div className="screen-wrapper">
      <EmployeesView
        employees={employees}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        advanced={advanced}
        onAdvanced={(patch) => { setAdvanced((a) => ({ ...a, ...patch })); setPage(1); }}
        departments={departments}
        filteredEmployees={paged.items}
        total={filtered.length}
        page={paged.page}
        totalPages={paged.totalPages}
        onPage={setPage}
        onAddEmployee={() => openEmployeeModal()}
        onEditEmployee={(e) => openEmployeeModal(e)}
        onDeleteEmployee={deleteEmployee}
      />
    </div>
  );
}
