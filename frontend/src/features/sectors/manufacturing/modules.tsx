"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#8b5cf6";

export function BOM() {
  return (
    <ModulePage
      title="BOM Costing"
      icon="fa-solid fa-diagram-project"
      color={COLOR}
      description="Build material recipes with quantity and cost rollups"
      stats={[
        { label: "Total BOMs" },
        { label: "Active" },
        { label: "Avg Cost" },
        { label: "Materials" }
      ]}
      addLabel="Create BOM"
      emptyMessage="No bills of materials yet — create your first BOM"
    />
  );
}

export function Production() {
  return (
    <ModulePage
      title="Production Orders"
      icon="fa-solid fa-clipboard-list"
      color="#2563eb"
      description="Plan batches, stages, workers, and output targets"
      stats={[
        { label: "Open Orders" },
        { label: "In Progress" },
        { label: "Completed Today" },
        { label: "Total Output" }
      ]}
      addLabel="New Order"
      emptyMessage="No production orders yet"
    />
  );
}

export function Quality() {
  return (
    <ModulePage
      title="Quality Results"
      icon="fa-solid fa-clipboard-check"
      color="#10b981"
      description="Capture checks, defects, pass rates, and rework"
      stats={[
        { label: "Checks Today" },
        { label: "Pass Rate" },
        { label: "Defects" },
        { label: "Rework Items" }
      ]}
      addLabel="New Check"
      emptyMessage="No quality checks recorded yet"
    />
  );
}

export function Machinery() {
  return (
    <ModulePage
      title="Machinery"
      icon="fa-solid fa-gears"
      color="#64748b"
      description="Machine logs, downtime, and maintenance reminders"
      stats={[
        { label: "Total Machines" },
        { label: "Running" },
        { label: "Idle" },
        { label: "Under Maintenance" }
      ]}
      addLabel="Add Machine"
      emptyMessage="No machinery registered yet"
    />
  );
}

export function Shifts() {
  return (
    <ModulePage
      title="Shifts"
      icon="fa-solid fa-clock"
      color="#06b6d4"
      description="Shift rosters, supervisor notes, and productivity"
      stats={[
        { label: "Active Shifts" },
        { label: "Workers Today" },
        { label: "Hours Logged" },
        { label: "Productivity" }
      ]}
      addLabel="Open Shift"
      emptyMessage="No shift records yet"
    />
  );
}

export function FinishedGoods() {
  return (
    <ModulePage
      title="Finished Goods"
      icon="fa-solid fa-box"
      color="#f97316"
      description="Move completed batches into sellable inventory"
      stats={[
        { label: "Total SKUs" },
        { label: "Ready to Ship" },
        { label: "In Warehouse" },
        { label: "Total Value" }
      ]}
      addLabel="Add Batch"
      emptyMessage="No finished goods in stock yet"
    />
  );
}
