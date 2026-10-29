import type { SectorConfig } from "../types";
import { Ledger, Loans, Reconciliations, Approvals, Payroll, Audit } from "./modules";

export const financeBankingConfig: SectorConfig = {
  sectorId: "finance-banking",
  navItems: [
    { key: "ledger", label: "General Ledger", icon: "fa-solid fa-book" },
    { key: "loans", label: "Loan Schedules", icon: "fa-solid fa-hand-holding-dollar" },
    { key: "reconciliations", label: "Reconciliations", icon: "fa-solid fa-right-left" },
    { key: "approvals", label: "Approvals", icon: "fa-solid fa-circle-check" },
    { key: "payroll", label: "Payroll", icon: "fa-solid fa-money-check-dollar" },
    { key: "audit", label: "Audit Cases", icon: "fa-solid fa-shield-halved" }
  ],
  modules: {
    ledger: Ledger,
    loans: Loans,
    reconciliations: Reconciliations,
    approvals: Approvals,
    payroll: Payroll,
    audit: Audit
  }
};
