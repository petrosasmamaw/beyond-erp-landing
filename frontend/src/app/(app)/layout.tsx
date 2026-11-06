"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Calendar, ChevronDown, Download, FileText, Loader2, LogOut, RefreshCcw, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as reduxLogout } from "@/store/slices/authSlice";
import { openModal, toggleAiAssistant } from "@/store/slices/uiSlice";
import { getSectorDefinition } from "@/features/erp/config";
import { getInitials, getTimeOfDay } from "@/lib/format";
import { readOperationQueue, readQueue } from "@/features/erp/offline";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
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
import { SectorSelectModal } from "@/components/modals/SectorSelectModal";
import { AIAssistantSidebar } from "@/components/AIAssistantSidebar";
import type { User as ApiUser } from "@/lib/types";

const SIDEBAR_KEY = "beyond_sidebar_collapsed";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isDemo, isAuthenticating, logout } = useAuth();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isReduxDemo = useAppSelector((state) => state.auth.isDemo);
  const isReduxAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const reduxSectorId = useAppSelector((state) => state.sectors.activeSectorId);
  const reduxCompanyName = useAppSelector(
    (state) => state.auth.user?.companyName ?? state.settings.settings?.companyName
  );

  const isDemoActive = Boolean(isDemo || isReduxDemo);

  // Active user can be sourced from AuthContext or Redux in-memory demo state
  const activeUser = user ?? (reduxUser ? (reduxUser as unknown as ApiUser) : null);
  const isAuthenticated = !!activeUser || isReduxAuthenticated;

  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const {
    settings, isOnline, isSyncing, apiStatus, pendingCount, setPendingCount,
    ethiopianDate, holidayToday, installPrompt, toast,
    syncPending, handleInstall, showToast, openFailedOpsModal
  } = useApp();
  const router = useRouter();
  const pathname = usePathname();

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
    if (!isAuthenticating && !isAuthenticated) {
      if (pathname?.startsWith("/admin")) return;
      router.replace("/");
    }
  }, [isAuthenticated, isAuthenticating, router, pathname]);

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

  if ((isAuthenticating && !isAuthenticated) || !activeUser) {
    return (
      <main className="splash-screen" aria-label="Loading">
        <div className="splash-card">
          <div className="splash-logo"><Building2 size={28} /></div>
          <h1>Beyond ERP</h1>
          <p>Loading workspace…</p>
          <div className="splash-progress" aria-hidden="true"><span /></div>
        </div>
      </main>
    );
  }

  const language = settings?.language ?? "English";
  const companyName = reduxCompanyName ?? activeUser.companyName ?? settings?.companyName ?? "Beyond ERP";
  const companySector = getSectorDefinition(reduxSectorId ?? activeUser.companySectorId ?? settings?.companySectorId ?? "");

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
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                {getTimeOfDay()} · {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
              </div>
              {!isDemoActive && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <strong style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.25 }}>
                    {companyName}
                  </strong>
                  {settings?.tinNumber && (
                    <span className="chip">
                      TIN: {settings.tinNumber}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {isDemoActive && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 400,
                    color: "var(--text-secondary)",
                    background: "transparent",
                    border: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warning)", flexShrink: 0 }} />
                  <span className="demo-badge-long">DEMO MODE · IN-MEMORY</span>
                  <span className="demo-badge-short">DEMO</span>
                </span>
              )}

              {/* Beyond AI Assistant Drawer Trigger */}
              <button
                type="button"
                className="topbar-btn"
                onClick={() => dispatch(toggleAiAssistant())}
                title="Open Beyond AI Assistant"
                style={{
                  width: "auto",
                  height: 32,
                  padding: "0 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border-line)",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <Sparkles size={13} style={{ color: "var(--text-muted)" }} />
                <span className="demo-badge-long">AI Assistant</span>
              </button>

              <ThemeToggle />

              <button
                className="topbar-btn"
                onClick={() => void syncPending()}
                aria-label="Sync data"
                style={{ position: "relative" }}
              >
                {isSyncing ? <Loader2 className="spin" size={16} /> : <RefreshCcw size={16} />}
                {pendingCount > 0 ? (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "var(--accent-blue)",
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {pendingCount}
                  </span>
                ) : null}
              </button>

              {pendingCount > 0 && !isSyncing ? (
                <button className="topbar-btn" onClick={openFailedOpsModal} aria-label="Review pending">
                  <FileText size={16} />
                </button>
              ) : null}

              {installPrompt ? (
                <button className="topbar-btn" onClick={() => void handleInstall()} aria-label="Install app">
                  <Download size={16} />
                </button>
              ) : null}

              {/* User chip */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 2 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--accent-blue)",
                  color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600, flexShrink: 0,
                }}>
                  {getInitials(activeUser.fullName)}
                </div>
                <div className="topbar-user-info" style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2 }}>{activeUser.fullName.split(" ")[0]}</strong>
                  <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)", lineHeight: 1.2 }}>{activeUser.role.toLowerCase()}</span>
                </div>
              </div>

              <button
                className="topbar-btn"
                onClick={() => {
                  dispatch(reduxLogout());
                  logout();
                  router.replace("/");
                  showToast(isDemoActive ? "Signed out of demo session" : "Signed out successfully");
                }}
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          {/* Ethiopian date strip — subtle */}
          <div className="calendar-strip">
            <Calendar size={13} style={{ flexShrink: 0, color: "var(--text-muted)" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", color: "var(--text-muted)" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{ethiopianDate}</span>
              <span style={{ fontSize: 12 }}>· VAT 15% · ETB · NBE Compliant</span>
              {holidayToday ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                  <Sparkles size={11} style={{ display: "inline-block", verticalAlign: "middle" }} />
                  {holidayToday}
                </span>
              ) : null}
            </div>
          </div>

          <div className="print-header">
            <h1>{companyName} — Business Report</h1>
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
      <SectorSelectModal />
      <AIAssistantSidebar />
    </main>
  );
}
