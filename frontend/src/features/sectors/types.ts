import type { ComponentType } from "react";

export type SectorNavItem = {
  key: string;
  label: string;
  icon: string;
  group?: string;
};

export type SectorConfig = {
  sectorId: string;
  navItems: SectorNavItem[];
  modules: Record<string, ComponentType>;
};
