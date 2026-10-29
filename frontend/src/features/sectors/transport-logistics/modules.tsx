"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#6366f1";

export function Fleet() {
  return (
    <ModulePage
      title="Fleet"
      icon="fa-solid fa-truck"
      color={COLOR}
      description="Vehicles, documents, assignments, and availability"
      stats={[
        { label: "Total Vehicles" },
        { label: "On Route" },
        { label: "Available" },
        { label: "Under Service" }
      ]}
      addLabel="Add Vehicle"
      emptyMessage="No fleet vehicles registered yet"
    />
  );
}

export function Waybills() {
  return (
    <ModulePage
      title="Waybills"
      icon="fa-solid fa-clipboard-list"
      color="#8b5cf6"
      description="Create, track, and reconcile transport waybills"
      stats={[
        { label: "Active Waybills" },
        { label: "In Transit" },
        { label: "Delivered Today" },
        { label: "Pending" }
      ]}
      addLabel="Create Waybill"
      emptyMessage="No waybills created yet"
    />
  );
}

export function Routes() {
  return (
    <ModulePage
      title="Routes"
      icon="fa-solid fa-route"
      color="#2563eb"
      description="Route plans, checkpoints, ETA, and dispatch notes"
      stats={[
        { label: "Active Routes" },
        { label: "Total Km" },
        { label: "Checkpoints" },
        { label: "Delays" }
      ]}
      addLabel="Add Route"
      emptyMessage="No routes configured yet"
    />
  );
}

export function Drivers() {
  return (
    <ModulePage
      title="Drivers"
      icon="fa-solid fa-user-tie"
      color="#10b981"
      description="Licenses, schedules, advances, and performance"
      stats={[
        { label: "Total Drivers" },
        { label: "On Duty" },
        { label: "Off Duty" },
        { label: "Pending Advances" }
      ]}
      addLabel="Add Driver"
      emptyMessage="No drivers registered yet"
    />
  );
}

export function FuelLogs() {
  return (
    <ModulePage
      title="Fuel Logs"
      icon="fa-solid fa-gas-pump"
      color="#f59e0b"
      description="Fuel usage, consumption, and variance tracking"
      stats={[
        { label: "Litres This Month" },
        { label: "Cost" },
        { label: "Avg per Km" },
        { label: "Vehicles Fueled" }
      ]}
      addLabel="Log Fuel"
      emptyMessage="No fuel logs yet"
    />
  );
}

export function Maintenance() {
  return (
    <ModulePage
      title="Maintenance"
      icon="fa-solid fa-wrench"
      color="#f97316"
      description="Service schedules, parts, costs, and downtime"
      stats={[
        { label: "Due This Month" },
        { label: "Completed" },
        { label: "Parts Cost" },
        { label: "Downtime Hours" }
      ]}
      addLabel="Schedule Service"
      emptyMessage="No maintenance records yet"
    />
  );
}
