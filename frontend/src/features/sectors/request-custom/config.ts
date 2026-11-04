import type { SectorConfig } from "../types";

export const requestCustomConfig: SectorConfig = {
  sectorId: "request-custom",
  navItems: [
    { key: "custom-modules", label: "Custom Modules", icon: "fa-solid fa-cubes" },
    { key: "briefing", label: "Briefing", icon: "fa-solid fa-file-pen" }
  ],
  modules: {}
};
