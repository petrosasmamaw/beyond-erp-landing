"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#10b981";

export function CropCycles() {
  return (
    <ModulePage
      title="Crop Cycles"
      icon="fa-solid fa-seedling"
      color={COLOR}
      description="Track planting, spraying, irrigation, and harvest stages"
      stats={[
        { label: "Active Cycles" },
        { label: "Fields" },
        { label: "Upcoming Tasks" },
        { label: "Harvest Ready" }
      ]}
      addLabel="Start Cycle"
      emptyMessage="No crop cycles started yet"
    />
  );
}

export function Livestock() {
  return (
    <ModulePage
      title="Livestock Events"
      icon="fa-solid fa-leaf"
      color="#84cc16"
      description="Register herds, vaccinations, births, and sales"
      stats={[
        { label: "Total Herd" },
        { label: "Vaccinated" },
        { label: "Births This Month" },
        { label: "Sold This Month" }
      ]}
      addLabel="Add Event"
      emptyMessage="No livestock events recorded yet"
    />
  );
}

export function Inputs() {
  return (
    <ModulePage
      title="Input Distribution"
      icon="fa-solid fa-sack-dollar"
      color="#f59e0b"
      description="Manage fertilizer, seed, feed, and chemical usage"
      stats={[
        { label: "Total Items" },
        { label: "Distributed" },
        { label: "Stock Remaining" },
        { label: "Cost This Season" }
      ]}
      addLabel="Distribute Inputs"
      emptyMessage="No input distribution records yet"
    />
  );
}

export function Harvest() {
  return (
    <ModulePage
      title="Harvest Yields"
      icon="fa-solid fa-wheat-awn"
      color="#65a30d"
      description="Record harvest volumes, grades, and market value"
      stats={[
        { label: "Total Yield (kg)" },
        { label: "Grade A" },
        { label: "Market Value" },
        { label: "This Season" }
      ]}
      addLabel="Record Harvest"
      emptyMessage="No harvest records yet"
    />
  );
}

export function Warehouses() {
  return (
    <ModulePage
      title="Warehouses"
      icon="fa-solid fa-warehouse"
      color="#8b5cf6"
      description="Control stores, lots, moisture, and stock movements"
      stats={[
        { label: "Total Warehouses" },
        { label: "Capacity Used" },
        { label: "Active Lots" },
        { label: "Pending Dispatch" }
      ]}
      addLabel="Add Warehouse"
      emptyMessage="No warehouse records yet"
    />
  );
}

export function Cooperatives() {
  return (
    <ModulePage
      title="Cooperatives"
      icon="fa-solid fa-people-group"
      color="#06b6d4"
      description="Member registry, deliveries, deductions, and payouts"
      stats={[
        { label: "Total Members" },
        { label: "Deliveries" },
        { label: "Pending Payouts" },
        { label: "This Season" }
      ]}
      addLabel="Add Member"
      emptyMessage="No cooperative members registered yet"
    />
  );
}
