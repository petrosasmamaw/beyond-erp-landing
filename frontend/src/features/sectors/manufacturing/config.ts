import type { SectorConfig } from "../types";
import { BOM, Production, Quality, Machinery, Shifts, FinishedGoods } from "./modules";

export const manufacturingConfig: SectorConfig = {
  sectorId: "manufacturing",
  navItems: [
    { key: "bom", label: "BOM Costing", icon: "fa-solid fa-diagram-project" },
    { key: "production", label: "Production Orders", icon: "fa-solid fa-clipboard-list" },
    { key: "quality", label: "Quality Results", icon: "fa-solid fa-clipboard-check" },
    { key: "machinery", label: "Machinery", icon: "fa-solid fa-gears" },
    { key: "shifts", label: "Shifts", icon: "fa-solid fa-clock" },
    { key: "finished-goods", label: "Finished Goods", icon: "fa-solid fa-box" }
  ],
  modules: {
    bom: BOM,
    production: Production,
    quality: Quality,
    machinery: Machinery,
    shifts: Shifts,
    "finished-goods": FinishedGoods
  }
};
