"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#84cc16";

export function Properties() {
  return (
    <ModulePage
      title="Properties"
      icon="fa-solid fa-building"
      color={COLOR}
      description="Units, listings, documents, and valuation data"
      stats={[
        { label: "Total Properties" },
        { label: "Occupied" },
        { label: "Vacant" },
        { label: "For Sale" }
      ]}
      addLabel="Add Property"
      emptyMessage="No properties listed yet"
    />
  );
}

export function Tenants() {
  return (
    <ModulePage
      title="Tenants"
      icon="fa-solid fa-users"
      color="#06b6d4"
      description="Tenant profiles, contacts, balances, and history"
      stats={[
        { label: "Total Tenants" },
        { label: "Active" },
        { label: "Arrears" },
        { label: "Exiting Soon" }
      ]}
      addLabel="Add Tenant"
      emptyMessage="No tenants registered yet"
    />
  );
}

export function Leases() {
  return (
    <ModulePage
      title="Leases"
      icon="fa-solid fa-file-signature"
      color="#8b5cf6"
      description="Lease terms, renewals, deposits, and clauses"
      stats={[
        { label: "Active Leases" },
        { label: "Expiring Soon" },
        { label: "Renewals Pending" },
        { label: "Total Deposits" }
      ]}
      addLabel="New Lease"
      emptyMessage="No lease agreements yet"
    />
  );
}

export function Rent() {
  return (
    <ModulePage
      title="Rent Schedules"
      icon="fa-solid fa-key"
      color="#f59e0b"
      description="Recurring rent, arrears, reminders, and receipts"
      stats={[
        { label: "Due This Month" },
        { label: "Collected" },
        { label: "Arrears" },
        { label: "Overdue Tenants" }
      ]}
      addLabel="Record Payment"
      emptyMessage="No rent schedules set up yet"
    />
  );
}

export function Maintenance() {
  return (
    <ModulePage
      title="Maintenance"
      icon="fa-solid fa-screwdriver-wrench"
      color="#f97316"
      description="Requests, vendors, costs, and completion status"
      stats={[
        { label: "Open Requests" },
        { label: "In Progress" },
        { label: "Completed" },
        { label: "Total Cost" }
      ]}
      addLabel="New Request"
      emptyMessage="No maintenance requests yet"
    />
  );
}

export function Viewings() {
  return (
    <ModulePage
      title="Viewings"
      icon="fa-solid fa-calendar-check"
      color="#2563eb"
      description="Lead pipeline, viewing slots, and follow-ups"
      stats={[
        { label: "Scheduled" },
        { label: "Completed" },
        { label: "Converted" },
        { label: "This Week" }
      ]}
      addLabel="Schedule Viewing"
      emptyMessage="No viewings scheduled yet"
    />
  );
}
