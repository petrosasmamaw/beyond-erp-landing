"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#ec4899";

export function Rooms() {
  return (
    <ModulePage
      title="Room Calendar"
      icon="fa-solid fa-bed"
      color={COLOR}
      description="Availability, blocks, arrivals, and departures"
      stats={[
        { label: "Total Rooms" },
        { label: "Available" },
        { label: "Occupied" },
        { label: "Maintenance" }
      ]}
      addLabel="Add Room"
      emptyMessage="No rooms added yet — start by adding your first room"
    />
  );
}

export function Reservations() {
  return (
    <ModulePage
      title="Reservations"
      icon="fa-solid fa-calendar-check"
      color="#2563eb"
      description="Bookings, deposits, guest notes, and changes"
      stats={[
        { label: "Today's Arrivals" },
        { label: "Today's Departures" },
        { label: "Current Guests" },
        { label: "This Month" }
      ]}
      addLabel="New Booking"
      emptyMessage="No reservations yet — create your first booking"
    />
  );
}

export function Restaurant() {
  return (
    <ModulePage
      title="Restaurant POS"
      icon="fa-solid fa-utensils"
      color="#ef4444"
      description="Tables, orders, kitchen slips, and bills"
      stats={[
        { label: "Open Tables" },
        { label: "Active Orders" },
        { label: "Today's Covers" },
        { label: "Today's Revenue" }
      ]}
      addLabel="New Order"
      emptyMessage="No orders today — open a table to start"
    />
  );
}

export function Housekeeping() {
  return (
    <ModulePage
      title="Housekeeping"
      icon="fa-solid fa-broom"
      color="#10b981"
      description="Room status, cleaning tasks, and maintenance flags"
      stats={[
        { label: "Pending Cleans" },
        { label: "In Progress" },
        { label: "Completed Today" },
        { label: "Maintenance Flags" }
      ]}
      addLabel="Add Task"
      emptyMessage="No housekeeping tasks — all rooms are clean"
    />
  );
}

export function Guests() {
  return (
    <ModulePage
      title="Guests"
      icon="fa-solid fa-users"
      color="#06b6d4"
      description="Profiles, stay history, preferences, and invoices"
      stats={[
        { label: "Total Guests" },
        { label: "Checked In" },
        { label: "VIP Guests" },
        { label: "New This Month" }
      ]}
      addLabel="Add Guest"
      emptyMessage="No guest profiles yet — add your first guest"
    />
  );
}

export function Events() {
  return (
    <ModulePage
      title="Events"
      icon="fa-solid fa-champagne-glasses"
      color="#f59e0b"
      description="Halls, catering packages, schedules, and invoices"
      stats={[
        { label: "Upcoming Events" },
        { label: "This Month" },
        { label: "Pending Quotes" },
        { label: "Completed" }
      ]}
      addLabel="New Event"
      emptyMessage="No events booked yet — schedule your first event"
    />
  );
}
