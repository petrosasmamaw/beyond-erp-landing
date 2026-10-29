"use client";

import { usePathname, useRouter } from "next/navigation";
import { Banknote, BarChart3, Settings as SettingsIcon, Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { getSectorConfig } from "@/features/sectors";
import type React from "react";

export function BottomNav({ language: _language }: { language?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useApp();

  const sectorId = settings?.companySectorId ?? null;
  const sectorConfig = getSectorConfig(sectorId);
  const firstModule = sectorConfig?.navItems[0];

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const items: { path: string; icon: React.ReactNode; label: string }[] = [
    { path: "/dashboard", icon: <BarChart3 size={18} />, label: "Home" },
    { path: "/transactions", icon: <Banknote size={18} />, label: "Money" },
    ...(firstModule
      ? [{ path: `/m/${firstModule.key}`, icon: <i className={firstModule.icon} style={{ fontSize: 18 }} />, label: firstModule.label }]
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
