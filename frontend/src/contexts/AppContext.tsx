"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { api } from "@/lib/api";
import { getEthiopianDate, getEthiopianHoliday } from "@/lib/format";
import type { DomainWorkflow, Employee, Sector, Settings, Transaction } from "@/lib/types";
import { useAuth } from "./AuthContext";

export type SectorRecordTemplate = {
  recordType: string;
  title: string;
  metadata: Record<string, unknown>;
};

export type ModalState =
  | null
  | { type: "transaction"; transaction?: Transaction }
  | { type: "employee"; employee?: Employee }
  | { type: "admin"; sector: Sector }
  | { type: "manager"; sector: Sector }
  | { type: "telebirr" }
  | { type: "barcode" }
  | { type: "confirm"; message: string; onConfirm: () => Promise<void> | void }
  | { type: "work-item"; sector: Sector }
  | { type: "sector-record"; sector: Sector; template?: SectorRecordTemplate }
  | { type: "domain-workflow"; sector: Sector; workflow: DomainWorkflow }
  | { type: "failed-ops" };

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface AppContextValue {
  sectors: Sector[];
  setSectors: (sectors: Sector[]) => void;
  settings: Settings | null;
  setSettings: (settings: Settings | null) => void;
  pendingCount: number;
  setPendingCount: (count: number) => void;
  isSyncing: boolean;
  isOnline: boolean;
  apiStatus: "checking" | "online" | "offline";
  ethiopianDate: string;
  holidayToday: string | null;
  installPrompt: BeforeInstallPromptEvent | null;
  toast: string;
  modal: ModalState;
  refreshTrigger: number;

  showToast: (msg: string) => void;
  refresh: () => Promise<void>;
  syncPending: () => Promise<void>;
  saveSettings: (patch: Partial<Settings>) => Promise<void>;
  handleInstall: () => Promise<void>;
  triggerRefresh: () => void;
  closeModal: () => void;

  openTransactionModal: (transaction?: Transaction) => void;
  openEmployeeModal: (employee?: Employee) => void;
  openAdminModal: (sector: Sector) => void;
  openManagerModal: (sector: Sector) => void;
  openTelebirrModal: () => void;
  openBarcodeModal: () => void;
  openConfirmModal: (message: string, onConfirm: () => Promise<void> | void) => void;
  openWorkItemModal: (sector: Sector) => void;
  openSectorRecordModal: (sector: Sector, template?: SectorRecordTemplate) => void;
  openDomainWorkflowModal: (sector: Sector, workflow: DomainWorkflow) => void;
  openFailedOpsModal: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [ethiopianDate, setEthiopianDate] = useState(() => getEthiopianDate());
  const [holidayToday, setHolidayToday] = useState<string | null>(() => getEthiopianHoliday());
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3000);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const refresh = useCallback(async () => {
    const [sectorData, settingsData] = await Promise.all([
      api.sectors(),
      api.settings()
    ]);
    setSectors(sectorData);
    setSettings(settingsData);
    triggerRefresh();
  }, [triggerRefresh]);

  const checkBackend = useCallback(async () => {
    try {
      await api.health();
      setApiStatus("online");
    } catch {
      setApiStatus("offline");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    refresh().catch(() => setApiStatus("offline"));
    void checkBackend();
  }, [user, refresh, checkBackend]);

  const syncPending = useCallback(async () => {
    const { readQueue, readOperationQueue, writeQueue, writeOperationQueue } = await import(
      "@/features/erp/offline"
    );
    const queue = readQueue();
    const operations = readOperationQueue();
    setPendingCount(queue.length + operations.length);
    if ((!queue.length && !operations.length) || isSyncing || !navigator.onLine) return;

    setIsSyncing(true);
    showToast("Back online. Syncing pending work...");
    try {
      let synced = 0;
      if (queue.length) {
        const items = queue.map(({ localId: _id, ...item }) => ({ ...item, synced: true }));
        const result = await api.syncTransactions(items);
        synced += result.count;
      }

      const failedOperations = [];
      for (const op of operations) {
        try {
          if (op.action === "CREATE_EMPLOYEE") await api.createEmployee(op.payload as Parameters<typeof api.createEmployee>[0]);
          if (op.action === "UPDATE_SETTINGS") await api.updateSettings(op.payload as Partial<Settings>);
          if (op.action === "CREATE_ADMIN") {
            const p = op.payload as { sectorId: string; input: Parameters<typeof api.createAdmin>[1] };
            await api.createAdmin(p.sectorId, p.input);
          }
          if (op.action === "CREATE_MANAGER") {
            const p = op.payload as { sectorId: string; input: Parameters<typeof api.createManager>[1] };
            await api.createManager(p.sectorId, p.input);
          }
          if (op.action === "CREATE_WORK_ITEM") await api.createWorkItem(op.payload as Parameters<typeof api.createWorkItem>[0]);
          if (op.action === "CREATE_SECTOR_RECORD") await api.createSectorRecord(op.payload as Parameters<typeof api.createSectorRecord>[0]);
          if (op.action === "CREATE_DOMAIN_WORKFLOW") {
            const p = op.payload as { sectorId: string; workflowKey: string; input: Parameters<typeof api.createDomainWorkflow>[2] };
            await api.createDomainWorkflow(p.sectorId, p.workflowKey, p.input);
          }
          if (op.action === "CREATE_INVOICE") await api.createInvoice(op.payload as Parameters<typeof api.createInvoice>[0]);
          if (op.action === "CREATE_EXPENSE_APPROVAL") await api.createExpenseApproval(op.payload as Parameters<typeof api.createExpenseApproval>[0]);
          synced += 1;
        } catch {
          failedOperations.push(op);
        }
      }
      writeQueue([]);
      writeOperationQueue(failedOperations);
      setPendingCount(failedOperations.length);
      showToast(
        failedOperations.length
          ? `${synced} items synced, ${failedOperations.length} need review`
          : `${synced} items synced`
      );
      await refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refresh, showToast]);

  const saveSettings = useCallback(async (patch: Partial<Settings>) => {
    const { queueOperation, readQueue } = await import("@/features/erp/offline");
    if (!navigator.onLine) {
      const count = queueOperation({ action: "UPDATE_SETTINGS", label: "Settings", payload: patch });
      setPendingCount(readQueue().length + count);
      showToast("Settings change queued offline");
      return;
    }
    const updated = await api.updateSettings(patch);
    setSettings(updated);
    showToast("Settings updated");
  }, [showToast]);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      showToast("App installed!");
    }
  }, [installPrompt, showToast]);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => { setIsOnline(true); void syncPending(); };
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    const calendarTimer = setInterval(() => {
      setEthiopianDate(getEthiopianDate());
      setHolidayToday(getEthiopianHoliday());
    }, 60_000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      clearInterval(calendarTimer);
    };
  }, [syncPending]);

  const closeModal = useCallback(() => setModal(null), []);
  const openTransactionModal = useCallback((transaction?: Transaction) => setModal({ type: "transaction", transaction }), []);
  const openEmployeeModal = useCallback((employee?: Employee) => setModal({ type: "employee", employee }), []);
  const openAdminModal = useCallback((sector: Sector) => setModal({ type: "admin", sector }), []);
  const openManagerModal = useCallback((sector: Sector) => setModal({ type: "manager", sector }), []);
  const openTelebirrModal = useCallback(() => setModal({ type: "telebirr" }), []);
  const openBarcodeModal = useCallback(() => setModal({ type: "barcode" }), []);
  const openConfirmModal = useCallback((message: string, onConfirm: () => Promise<void> | void) => setModal({ type: "confirm", message, onConfirm }), []);
  const openWorkItemModal = useCallback((sector: Sector) => setModal({ type: "work-item", sector }), []);
  const openSectorRecordModal = useCallback((sector: Sector, template?: SectorRecordTemplate) => setModal({ type: "sector-record", sector, template }), []);
  const openDomainWorkflowModal = useCallback((sector: Sector, workflow: DomainWorkflow) => setModal({ type: "domain-workflow", sector, workflow }), []);
  const openFailedOpsModal = useCallback(() => setModal({ type: "failed-ops" }), []);

  return (
    <AppContext.Provider
      value={{
        sectors, setSectors, settings, setSettings,
        pendingCount, setPendingCount, isSyncing, isOnline, apiStatus,
        ethiopianDate, holidayToday, installPrompt, toast, modal, refreshTrigger,
        showToast, refresh, syncPending, saveSettings, handleInstall, triggerRefresh,
        closeModal, openTransactionModal, openEmployeeModal, openAdminModal,
        openManagerModal, openTelebirrModal, openBarcodeModal, openConfirmModal,
        openWorkItemModal, openSectorRecordModal, openDomainWorkflowModal, openFailedOpsModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
