import type { SectorConfig } from "../types";
import { Permits, Citizens, Cases, Revenue, Documents, Counters } from "./modules";

export const governmentServicesConfig: SectorConfig = {
  sectorId: "government-services",
  navItems: [
    { key: "permits", label: "Permits", icon: "fa-solid fa-file-contract" },
    { key: "citizens", label: "Citizens", icon: "fa-solid fa-users" },
    { key: "cases", label: "Service Cases", icon: "fa-solid fa-list-check" },
    { key: "revenue", label: "Revenue", icon: "fa-solid fa-coins" },
    { key: "documents", label: "Documents", icon: "fa-solid fa-folder-open" },
    { key: "counters", label: "Counters", icon: "fa-solid fa-building-user" }
  ],
  modules: {
    permits: Permits,
    citizens: Citizens,
    cases: Cases,
    revenue: Revenue,
    documents: Documents,
    counters: Counters
  }
};
