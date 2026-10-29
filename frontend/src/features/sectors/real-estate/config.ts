import type { SectorConfig } from "../types";
import { Properties, Tenants, Leases, Rent, Maintenance, Viewings } from "./modules";

export const realEstateConfig: SectorConfig = {
  sectorId: "real-estate",
  navItems: [
    { key: "properties", label: "Properties", icon: "fa-solid fa-building" },
    { key: "tenants", label: "Tenants", icon: "fa-solid fa-users" },
    { key: "leases", label: "Leases", icon: "fa-solid fa-file-signature" },
    { key: "rent", label: "Rent Schedules", icon: "fa-solid fa-key" },
    { key: "maintenance", label: "Maintenance", icon: "fa-solid fa-screwdriver-wrench" },
    { key: "viewings", label: "Viewings", icon: "fa-solid fa-calendar-check" }
  ],
  modules: {
    properties: Properties,
    tenants: Tenants,
    leases: Leases,
    rent: Rent,
    maintenance: Maintenance,
    viewings: Viewings
  }
};
