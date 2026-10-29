import type { SectorConfig } from "../types";
import { Projects, SiteReports, Subcontractors, Equipment, Safety, ClientBilling } from "./modules";

export const constructionConfig: SectorConfig = {
  sectorId: "construction",
  navItems: [
    { key: "projects", label: "Project Budgets", icon: "fa-solid fa-chart-gantt" },
    { key: "site-reports", label: "Site Reports", icon: "fa-solid fa-clipboard-list" },
    { key: "subcontractors", label: "Subcontractors", icon: "fa-solid fa-file-contract" },
    { key: "equipment", label: "Equipment", icon: "fa-solid fa-hammer" },
    { key: "safety", label: "Safety Log", icon: "fa-solid fa-shield-halved" },
    { key: "client-billing", label: "Client Billing", icon: "fa-solid fa-file-invoice-dollar" }
  ],
  modules: {
    projects: Projects,
    "site-reports": SiteReports,
    subcontractors: Subcontractors,
    equipment: Equipment,
    safety: Safety,
    "client-billing": ClientBilling
  }
};
