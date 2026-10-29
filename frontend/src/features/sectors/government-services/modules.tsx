"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#64748b";

export function Permits() {
  return (
    <ModulePage
      title="Permits"
      icon="fa-solid fa-file-contract"
      color="#2563eb"
      description="Applications, review stages, fees, and issuance"
      stats={[
        { label: "Open Applications" },
        { label: "In Review" },
        { label: "Issued Today" },
        { label: "Rejected" }
      ]}
      addLabel="New Application"
      emptyMessage="No permit applications yet"
    />
  );
}

export function Citizens() {
  return (
    <ModulePage
      title="Citizens"
      icon="fa-solid fa-users"
      color="#10b981"
      description="Citizen records, requests, cases, and service history"
      stats={[
        { label: "Total Records" },
        { label: "Active Cases" },
        { label: "Services Given" },
        { label: "New This Month" }
      ]}
      addLabel="Register Citizen"
      emptyMessage="No citizen records yet"
    />
  );
}

export function Cases() {
  return (
    <ModulePage
      title="Service Cases"
      icon="fa-solid fa-list-check"
      color="#8b5cf6"
      description="Case queues, SLAs, assignments, and resolutions"
      stats={[
        { label: "Open Cases" },
        { label: "Breached SLA" },
        { label: "Resolved Today" },
        { label: "Avg Resolution" }
      ]}
      addLabel="Open Case"
      emptyMessage="No service cases yet"
    />
  );
}

export function Revenue() {
  return (
    <ModulePage
      title="Revenue"
      icon="fa-solid fa-coins"
      color="#f59e0b"
      description="Revenue collection, receipts, reconciliation, and deposits"
      stats={[
        { label: "Collected Today" },
        { label: "This Month" },
        { label: "Pending Deposit" },
        { label: "Receipts Issued" }
      ]}
      addLabel="Record Collection"
      emptyMessage="No revenue records yet"
    />
  );
}

export function Documents() {
  return (
    <ModulePage
      title="Documents"
      icon="fa-solid fa-folder-open"
      color="#f97316"
      description="Document registry, approvals, and expiry dates"
      stats={[
        { label: "Total Documents" },
        { label: "Expiring Soon" },
        { label: "Pending Approval" },
        { label: "Archived" }
      ]}
      addLabel="Add Document"
      emptyMessage="No documents registered yet"
    />
  );
}

export function Counters() {
  return (
    <ModulePage
      title="Counters"
      icon="fa-solid fa-building-user"
      color="#06b6d4"
      description="Counter activity, wait times, and service volume"
      stats={[
        { label: "Active Counters" },
        { label: "Queue Now" },
        { label: "Served Today" },
        { label: "Avg Wait (min)" }
      ]}
      emptyMessage="No counter activity recorded yet"
    />
  );
}
