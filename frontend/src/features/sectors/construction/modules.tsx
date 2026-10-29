"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#f97316";

export function Projects() {
  return (
    <ModulePage
      title="Project Budgets"
      icon="fa-solid fa-chart-gantt"
      color={COLOR}
      description="Track contract value, cost codes, and variance"
      stats={[
        { label: "Active Projects" },
        { label: "On Budget" },
        { label: "Over Budget" },
        { label: "Completed" }
      ]}
      addLabel="New Project"
      emptyMessage="No projects yet — create your first project"
    />
  );
}

export function SiteReports() {
  return (
    <ModulePage
      title="Site Reports"
      icon="fa-solid fa-clipboard-list"
      color="#2563eb"
      description="Daily progress, photos, weather, and issues"
      stats={[
        { label: "Reports Today" },
        { label: "Open Issues" },
        { label: "Photos" },
        { label: "This Week" }
      ]}
      addLabel="Add Report"
      emptyMessage="No site reports yet"
    />
  );
}

export function Subcontractors() {
  return (
    <ModulePage
      title="Subcontractors"
      icon="fa-solid fa-file-contract"
      color="#ec4899"
      description="Packages, contracts, retention, and payment status"
      stats={[
        { label: "Total Contractors" },
        { label: "Active Packages" },
        { label: "Pending Payments" },
        { label: "Retention Held" }
      ]}
      addLabel="Add Contractor"
      emptyMessage="No subcontractors registered yet"
    />
  );
}

export function Equipment() {
  return (
    <ModulePage
      title="Equipment"
      icon="fa-solid fa-hammer"
      color="#64748b"
      description="Assets, utilization, maintenance, and rentals"
      stats={[
        { label: "Total Equipment" },
        { label: "In Use" },
        { label: "Idle" },
        { label: "Under Service" }
      ]}
      addLabel="Add Equipment"
      emptyMessage="No equipment records yet"
    />
  );
}

export function Safety() {
  return (
    <ModulePage
      title="Safety Log"
      icon="fa-solid fa-shield-halved"
      color="#ef4444"
      description="Inspections, incidents, PPE, and corrective actions"
      stats={[
        { label: "Inspections" },
        { label: "Incidents" },
        { label: "Open Actions" },
        { label: "Days Safe" }
      ]}
      addLabel="Log Inspection"
      emptyMessage="No safety records yet"
    />
  );
}

export function ClientBilling() {
  return (
    <ModulePage
      title="Client Billing"
      icon="fa-solid fa-file-invoice-dollar"
      color="#06b6d4"
      description="Milestones, progress invoices, and receipts"
      stats={[
        { label: "Total Invoiced" },
        { label: "Collected" },
        { label: "Outstanding" },
        { label: "This Month" }
      ]}
      addLabel="Create Invoice"
      emptyMessage="No client invoices yet"
    />
  );
}
