"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#14b8a6";

export function Donors() {
  return (
    <ModulePage
      title="Donors"
      icon="fa-solid fa-hand-holding-heart"
      color="#10b981"
      description="Donor profiles, pledges, restrictions, and reporting"
      stats={[
        { label: "Total Donors" },
        { label: "Active Pledges" },
        { label: "Received YTD" },
        { label: "New This Month" }
      ]}
      addLabel="Add Donor"
      emptyMessage="No donors registered yet"
    />
  );
}

export function Grants() {
  return (
    <ModulePage
      title="Grants"
      icon="fa-solid fa-file-circle-check"
      color="#8b5cf6"
      description="Grant budgets, periods, milestones, and compliance"
      stats={[
        { label: "Active Grants" },
        { label: "Total Budget" },
        { label: "Spent" },
        { label: "Milestones Due" }
      ]}
      addLabel="Add Grant"
      emptyMessage="No grants registered yet"
    />
  );
}

export function Beneficiaries() {
  return (
    <ModulePage
      title="Beneficiaries"
      icon="fa-solid fa-users"
      color="#2563eb"
      description="Registry, services received, and follow-up history"
      stats={[
        { label: "Total Beneficiaries" },
        { label: "Active" },
        { label: "Services Given" },
        { label: "This Month" }
      ]}
      addLabel="Register Beneficiary"
      emptyMessage="No beneficiaries registered yet"
    />
  );
}

export function Procurement() {
  return (
    <ModulePage
      title="Procurement"
      icon="fa-solid fa-cart-shopping"
      color="#f97316"
      description="Requests, vendor bids, approvals, and delivery"
      stats={[
        { label: "Open Requests" },
        { label: "Pending Approval" },
        { label: "Delivered" },
        { label: "Total Spend" }
      ]}
      addLabel="New Request"
      emptyMessage="No procurement requests yet"
    />
  );
}

export function Monitoring() {
  return (
    <ModulePage
      title="Field Monitoring"
      icon="fa-solid fa-location-dot"
      color="#ef4444"
      description="Site visits, observations, photos, and actions"
      stats={[
        { label: "Visits This Month" },
        { label: "Open Actions" },
        { label: "Completed" },
        { label: "Sites Covered" }
      ]}
      addLabel="Log Visit"
      emptyMessage="No field monitoring records yet"
    />
  );
}

export function Impact() {
  return (
    <ModulePage
      title="Impact"
      icon="fa-solid fa-chart-pie"
      color="#ec4899"
      description="Indicators, baselines, targets, and results"
      stats={[
        { label: "Indicators" },
        { label: "On Track" },
        { label: "Behind Target" },
        { label: "Achieved" }
      ]}
      addLabel="Add Indicator"
      emptyMessage="No impact indicators defined yet"
    />
  );
}
