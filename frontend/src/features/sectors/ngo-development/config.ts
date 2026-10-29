import type { SectorConfig } from "../types";
import { Donors, Grants, Beneficiaries, Procurement, Monitoring, Impact } from "./modules";

export const ngoDevelopmentConfig: SectorConfig = {
  sectorId: "ngo-development",
  navItems: [
    { key: "donors", label: "Donors", icon: "fa-solid fa-hand-holding-heart" },
    { key: "grants", label: "Grants", icon: "fa-solid fa-file-circle-check" },
    { key: "beneficiaries", label: "Beneficiaries", icon: "fa-solid fa-users" },
    { key: "procurement", label: "Procurement", icon: "fa-solid fa-cart-shopping" },
    { key: "monitoring", label: "Field Monitoring", icon: "fa-solid fa-location-dot" },
    { key: "impact", label: "Impact", icon: "fa-solid fa-chart-pie" }
  ],
  modules: {
    donors: Donors,
    grants: Grants,
    beneficiaries: Beneficiaries,
    procurement: Procurement,
    monitoring: Monitoring,
    impact: Impact
  }
};
