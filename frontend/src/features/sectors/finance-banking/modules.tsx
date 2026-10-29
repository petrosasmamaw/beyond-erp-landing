"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#2563eb";

export function Ledger() {
  return (
    <ModulePage
      title="General Ledger"
      icon="fa-solid fa-book"
      color={COLOR}
      description="Accounts, journals, balances, and financial periods"
      stats={[
        { label: "Total Accounts" },
        { label: "Journal Entries" },
        { label: "This Period" },
        { label: "Unposted" }
      ]}
      addLabel="New Journal"
      emptyMessage="No ledger entries yet — start the first journal"
    />
  );
}

export function Loans() {
  return (
    <ModulePage
      title="Loan Schedules"
      icon="fa-solid fa-hand-holding-dollar"
      color="#f59e0b"
      description="Principal, interest, due dates, and aging"
      stats={[
        { label: "Active Loans" },
        { label: "Total Outstanding" },
        { label: "Due This Month" },
        { label: "Non-Performing" }
      ]}
      addLabel="Add Loan"
      emptyMessage="No loan schedules yet"
    />
  );
}

export function Reconciliations() {
  return (
    <ModulePage
      title="Reconciliations"
      icon="fa-solid fa-right-left"
      color="#8b5cf6"
      description="Bank, cash, mobile money, and branch matching"
      stats={[
        { label: "Open" },
        { label: "Matched" },
        { label: "Unmatched" },
        { label: "Completed" }
      ]}
      addLabel="New Reconciliation"
      emptyMessage="No reconciliations started yet"
    />
  );
}

export function Approvals() {
  return (
    <ModulePage
      title="Approvals"
      icon="fa-solid fa-circle-check"
      color="#10b981"
      description="Approval queues, thresholds, and maker-checker flows"
      stats={[
        { label: "Pending Approval" },
        { label: "Approved Today" },
        { label: "Rejected" },
        { label: "Escalated" }
      ]}
      emptyMessage="No pending approvals"
    />
  );
}

export function Payroll() {
  return (
    <ModulePage
      title="Payroll"
      icon="fa-solid fa-money-check-dollar"
      color="#06b6d4"
      description="Pay runs, deductions, taxes, and payment files"
      stats={[
        { label: "Employees" },
        { label: "Gross Pay" },
        { label: "Deductions" },
        { label: "Net Pay" }
      ]}
      addLabel="Run Payroll"
      emptyMessage="No payroll runs yet"
    />
  );
}

export function Audit() {
  return (
    <ModulePage
      title="Audit Cases"
      icon="fa-solid fa-shield-halved"
      color="#64748b"
      description="Findings, evidence, owners, and closure status"
      stats={[
        { label: "Open Cases" },
        { label: "Findings" },
        { label: "In Review" },
        { label: "Closed" }
      ]}
      addLabel="Open Case"
      emptyMessage="No audit cases yet"
    />
  );
}
