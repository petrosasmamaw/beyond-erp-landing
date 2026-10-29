"use client";

import { useApp } from "@/contexts/AppContext";
import { SettingsView } from "@/features/erp/views/settings";

export default function SettingsPage() {
  const { settings, saveSettings } = useApp();

  return (
    <div className="screen-wrapper">
      <SettingsView
        settings={settings}
        language={settings?.language ?? "English"}
        onSave={saveSettings}
      />
    </div>
  );
}
