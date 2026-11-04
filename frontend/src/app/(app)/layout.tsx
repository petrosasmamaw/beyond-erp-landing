"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, FileText, Loader2, LogOut, RefreshCcw, Sparkles } from "lucide-react";
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
  const { user, isAuthenticating, logout } = useAuth();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isReduxAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthenticating, router]);

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
          <div className="splash-logo"><i className="fa-solid fa-cube" /></div>
          <h1>Beyond ERP</h1>
          <p>Loading workspace…</p>
          <div className="splash-progress" aria-hidden="true"><span /></div>
        </div>
      </main>
    );
  }

  const reduxSectorId = useAppSelector((state) => state.sectors.activeSectorId);
  const reduxCompanyName = useAppSelector(
    (state) => state.auth.user?.companyName ?? state.settings.settings?.companyName
  );

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
              <div style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 600, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                {getTimeOfDay()} · {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
              </div>
              <button
                type="button"
                onClick={() => dispatch(openModal({ type: "sector-select" }))}
                title="Click to switch Ethiopian industry sector workspace"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  marginTop: 3,
                  padding: "4px 10px 4px 7px",
                  borderRadius: 8,
                  background: dark ? "rgba(37, 99, 235, 0.16)" : "rgba(37, 99, 235, 0.08)",
                  border: `1px solid ${dark ? "rgba(37, 99, 235, 0.35)" : "rgba(37, 99, 235, 0.22)"}`,
                  color: dark ? "#f8fafc" : "#0f172a",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: 700,
                  maxWidth: "100%",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = dark ? "rgba(37, 99, 235, 0.16)" : "rgba(37, 99, 235, 0.08)")}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    background: companySector?.color ? `${companySector.color}25` : "rgba(37, 99, 235, 0.2)",
                    color: companySector?.color || "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  <i className={companySector?.icon || "fa-solid fa-building"} />
                </span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "clamp(120px, 28vw, 260px)",
                  }}
                >
                  {companyName}
                </span>
                <ChevronDown size={14} style={{ color: dark ? "#94a3b8" : "#64748b", marginLeft: 1, flexShrink: 0 }} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                <span className="demo-badge-long">DEMO MODE · IN-MEMORY</span>
                <span className="demo-badge-short">DEMO</span>
              </span>

              {/* Beyond AI Assistant Drawer Trigger */}
              <button
                type="button"
                className="topbar-btn"
                onClick={() => dispatch(toggleAiAssistant())}
                title="Open Beyond AI Assistant"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: dark ? "rgba(124, 58, 237, 0.2)" : "rgba(124, 58, 237, 0.1)",
                  color: dark ? "#c4b5fd" : "#6d28d9",
                  border: "1px solid rgba(124, 58, 237, 0.35)",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <Sparkles size={13} style={{ color: "#a855f7" }} />
                <span className="demo-badge-long">AI Assistant</span>
              </button>

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
                  {getInitials(activeUser.fullName)}
                </div>
                <div className="topbar-user-info">
                  <strong>{activeUser.fullName.split(" ")[0]}</strong>
                  <span>{activeUser.role.toLowerCase()}</span>
                </div>
              </div>

              <button
                className="icon-button topbar-btn"
                onClick={() => {
                  dispatch(reduxLogout());
                  logout();
                  router.replace("/login");
                  showToast("Signed out of demo");
                }}
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
              <span style={{ fontSize: 12 }}>· VAT 15% · ETB · NBE Compliant</span>
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
      <SectorSelectModal />
      <AIAssistantSidebar />
    </main>
  );
}
