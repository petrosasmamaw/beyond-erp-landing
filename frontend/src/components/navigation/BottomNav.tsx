"use client";

import { usePathname, useRouter } from "next/navigation";
import { Banknote, Boxes, LayoutDashboard, Settings as SettingsIcon, Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { getSectorConfig } from "@/features/sectors";
import type React from "react";

export function BottomNav({ language: _language }: { language?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useApp();
  const reduxSectorId = useAppSelector((state) => state.sectors.activeSectorId);
  const activeUser = useAppSelector((state) => state.auth.user);

  const sectorId = reduxSectorId ?? activeUser?.companySectorId ?? settings?.companySectorId ?? "retail-trading";
  const sectorConfig = getSectorConfig(sectorId) || getSectorConfig("retail-trading");
  const firstModule = sectorConfig?.navItems[0];

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const items: { path: string; icon: React.ReactNode; label: string }[] = [
    { path: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Home" },
    { path: "/transactions", icon: <Banknote size={18} />, label: "Money" },
    ...(firstModule
      ? [{ path: `/m/${firstModule.key}`, icon: <Boxes size={18} />, label: firstModule.label }]
      : []),
    { path: "/employees", icon: <Users size={18} />, label: "Team" },
    { path: "/settings", icon: <SettingsIcon size={18} />, label: "Settings" }
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.path}
          className={isActive(item.path) ? "active" : ""}
          onClick={() => router.push(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
