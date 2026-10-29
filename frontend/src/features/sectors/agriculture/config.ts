import type { SectorConfig } from "../types";
import { CropCycles, Livestock, Inputs, Harvest, Warehouses, Cooperatives } from "./modules";

export const agricultureConfig: SectorConfig = {
  sectorId: "agriculture",
  navItems: [
    { key: "crop-cycles", label: "Crop Cycles", icon: "fa-solid fa-seedling" },
    { key: "livestock", label: "Livestock Events", icon: "fa-solid fa-leaf" },
    { key: "inputs", label: "Input Distribution", icon: "fa-solid fa-sack-dollar" },
    { key: "harvest", label: "Harvest Yields", icon: "fa-solid fa-wheat-awn" },
    { key: "warehouses", label: "Warehouses", icon: "fa-solid fa-warehouse" },
    { key: "cooperatives", label: "Cooperatives", icon: "fa-solid fa-people-group" }
  ],
  modules: {
    "crop-cycles": CropCycles,
    livestock: Livestock,
    inputs: Inputs,
    harvest: Harvest,
    warehouses: Warehouses,
    cooperatives: Cooperatives
  }
};
