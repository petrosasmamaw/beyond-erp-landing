"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Loader2, LogOut, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { getSectorDefinition } from "@/features/erp/config";
import { getInitials, getTimeOfDay } from "@/lib/format";
import { readOperationQueue, readQueue } from "@/features/erp/offline";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TransactionModal } from "@/components/modals/TransactionModal";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { AdminModal } from "@/components/modals/AdminModal";
import { ManagerModal } from "@/components/modals/ManagerModal";
import { TelebirrModal } from "@/components/modals/TelebirrModal";
import { BarcodeModal } from "@/components/modals/BarcodeModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { WorkItemModal } from "@/components/modals/WorkItemModal";
import { SectorRecordModal } from "@/components/modals/SectorRecordModal";
import { DomainWorkflowModal } from "@/components/modals/DomainWorkflowModal";
import { FailedOpsModal } from "@/components/modals/FailedOpsModal";

const SIDEBAR_KEY = "beyond_sidebar_collapsed";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticating, logout } = useAuth();
  const {
    settings, isOnline, isSyncing, apiStatus, pendingCount, setPendingCount,
    ethiopianDate, holidayToday, installPrompt, toast,
    syncPending, handleInstall, showToast, openFailedOpsModal
  } = useApp();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored === "1") setSidebarCollapsed(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      return next;
    });
  };

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.replace("/login");
    }
  }, [user, isAuthenticating, router]);

  useEffect(() => {
    setPendingCount(readQueue().length + readOperationQueue().length);

    const telegram = (window as Window & {
      Telegram?: {
        WebApp?: {
          ready: () => void; expand: () => void;
          setHeaderColor?: (c: string) => void;
          setBackgroundColor?: (c: string) => void;
          enableClosingConfirmation?: () => void;
          MainButton?: { setText: (t: string) => void; color: string; textColor: string; show: () => void };
        };
      };
    }).Telegram?.WebApp;
    telegram?.ready(); telegram?.expand();
    telegram?.setHeaderColor?.("#1d4ed8");
    telegram?.setBackgroundColor?.("#ffffff");
    telegram?.enableClosingConfirmation?.();
    if (telegram?.MainButton) {
      telegram.MainButton.setText("QUICK ACTION");
      telegram.MainButton.color = "#1d4ed8";
      telegram.MainButton.textColor = "#ffffff";
      telegram.MainButton.show();
    }
  }, [setPendingCount]);

  if (isAuthenticating || !user) {
    return (
      <main className="splash-screen" aria-label="Loading">
        <div className="splash-card">
          <div className="splash-logo"><i className="fa-solid fa-cube" /></div>
          <h1>Beyond ERP</h1>
          <p>Loading workspace…</p>
          <div className="splash-progress" aria-hidden="true"><span /></div>
        </div>
      </main>
    );
  }

  const language = settings?.language ?? "English";
  const companyName = user.companyName ?? settings?.companyName ?? "Beyond ERP";
  const companySector = getSectorDefinition(user.companySectorId ?? settings?.companySectorId ?? "");

  return (
    <main className="app-shell">
      {!isOnline ? <div className="offline-banner">Offline mode — data will sync when connected</div> : null}

      <section
        className="phone-frame app-workspace"
        style={{ gridTemplateColumns: `${sidebarCollapsed ? 60 : 234}px minmax(0, 1fr)` }}
      >
        <Sidebar
          language={language}
          sector={companySector}
          companyName={companyName}
          pendingCount={pendingCount}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        <div className="app-main-panel">
          {/* Clean top bar */}
          <header className="app-topbar">
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {getTimeOfDay()} · {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
              </div>
              <strong style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", lineHeight: 1.25, display: "block", marginTop: 2 }}>
                {companyName}
              </strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={`connection-badge ${apiStatus}`}>{apiStatus}</span>

              <ThemeToggle />

              <button
                className="icon-button topbar-btn"
                onClick={() => void syncPending()}
                aria-label="Sync data"
              >
                {isSyncing ? <Loader2 className="spin" size={16} /> : <RefreshCcw size={16} />}
                {pendingCount > 0 ? <span>{pendingCount}</span> : null}
              </button>

              {pendingCount > 0 && !isSyncing ? (
                <button className="icon-button topbar-btn" onClick={openFailedOpsModal} aria-label="Review pending">
                  <FileText size={16} />
                </button>
              ) : null}

              {installPrompt ? (
                <button className="icon-button topbar-btn" onClick={() => void handleInstall()} aria-label="Install app">
                  <Download size={16} />
                </button>
              ) : null}

              {/* User chip */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 2 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {getInitials(user.fullName)}
                </div>
                <div className="topbar-user-info">
                  <strong>{user.fullName.split(" ")[0]}</strong>
                  <span>{user.role.toLowerCase()}</span>
                </div>
              </div>

              <button
                className="icon-button topbar-btn"
                onClick={() => { logout(); router.replace("/login"); showToast("Signed out"); }}
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          {/* Ethiopian date strip — subtle */}
          <div className="calendar-strip">
            <i className="fa-regular fa-calendar" style={{ fontSize: 13, flexShrink: 0 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <strong style={{ fontSize: 13 }}>{ethiopianDate}</strong>
              <span style={{ fontSize: 12 }}>· VAT 15%, ETB</span>
              {holidayToday ? <span className="holiday-badge">🎉 {holidayToday}</span> : null}
            </div>
          </div>

          <div className="print-header">
            <h1>Beyond ERP System — {settings?.companyName ?? "Business Report"}</h1>
            <span>TIN: {settings?.tinNumber ?? "N/A"} | Printed: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span>Ethiopian Date: {ethiopianDate}</span>
          </div>

          <section className="page-body">
            {children}
          </section>

          <BottomNav language={language} />
        </div>
      </section>

      {toast ? <div className="toast">{toast}</div> : null}

      <TransactionModal />
      <EmployeeModal />
      <AdminModal />
      <ManagerModal />
      <TelebirrModal />
      <BarcodeModal />
      <ConfirmModal />
      <WorkItemModal />
      <SectorRecordModal />
      <DomainWorkflowModal />
      <FailedOpsModal />
    </main>
  );
}
