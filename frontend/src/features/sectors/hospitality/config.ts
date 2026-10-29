import type { SectorConfig } from "../types";
import { Rooms, Reservations, Restaurant, Housekeeping, Guests, Events } from "./modules";

export const hospitalityConfig: SectorConfig = {
  sectorId: "hospitality",
  navItems: [
    { key: "rooms", label: "Room Calendar", icon: "fa-solid fa-bed" },
    { key: "reservations", label: "Reservations", icon: "fa-solid fa-calendar-check" },
    { key: "restaurant", label: "Restaurant POS", icon: "fa-solid fa-utensils" },
    { key: "housekeeping", label: "Housekeeping", icon: "fa-solid fa-broom" },
    { key: "guests", label: "Guests", icon: "fa-solid fa-users" },
    { key: "events", label: "Events", icon: "fa-solid fa-champagne-glasses" }
  ],
  modules: {
    rooms: Rooms,
    reservations: Reservations,
    restaurant: Restaurant,
    housekeeping: Housekeeping,
    guests: Guests,
    events: Events
  }
};
