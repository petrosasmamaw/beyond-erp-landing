import type { SectorConfig } from "../types";
import { POS, Inventory, Products, Customers, Suppliers, SalesReports } from "./modules";

export const retailTradingConfig: SectorConfig = {
  sectorId: "retail-trading",
  navItems: [
    { key: "pos", label: "POS Checkout", icon: "fa-solid fa-cash-register" },
    { key: "inventory", label: "Inventory", icon: "fa-solid fa-boxes-stacked" },
    { key: "products", label: "Products", icon: "fa-solid fa-tags" },
    { key: "customers", label: "Customers", icon: "fa-solid fa-users" },
    { key: "suppliers", label: "Suppliers", icon: "fa-solid fa-truck-field" },
    { key: "sales-reports", label: "Sales Reports", icon: "fa-solid fa-chart-line" }
  ],
  modules: {
    pos: POS,
    inventory: Inventory,
    products: Products,
    customers: Customers,
    suppliers: Suppliers,
    "sales-reports": SalesReports
  }
};
