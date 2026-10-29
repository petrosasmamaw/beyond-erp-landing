import type { SectorConfig } from "../types";
import { Fleet, Waybills, Routes, Drivers, FuelLogs, Maintenance } from "./modules";

export const transportLogisticsConfig: SectorConfig = {
  sectorId: "transport-logistics",
  navItems: [
    { key: "fleet", label: "Fleet", icon: "fa-solid fa-truck" },
    { key: "waybills", label: "Waybills", icon: "fa-solid fa-clipboard-list" },
    { key: "routes", label: "Routes", icon: "fa-solid fa-route" },
    { key: "drivers", label: "Drivers", icon: "fa-solid fa-user-tie" },
    { key: "fuel", label: "Fuel Logs", icon: "fa-solid fa-gas-pump" },
    { key: "maintenance", label: "Maintenance", icon: "fa-solid fa-wrench" }
  ],
  modules: {
    fleet: Fleet,
    waybills: Waybills,
    routes: Routes,
    drivers: Drivers,
    fuel: FuelLogs,
    maintenance: Maintenance
  }
};
