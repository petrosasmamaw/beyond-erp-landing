import type { NewTransactionInput } from "@/lib/types";

export type QueuedTransaction = NewTransactionInput & {
  localId: string;
};

export type QueuedOperation = {
  localId: string;
  label: string;
  action:
    | "CREATE_EMPLOYEE"
    | "UPDATE_SETTINGS"
    | "CREATE_ADMIN"
    | "CREATE_MANAGER"
    | "CREATE_WORK_ITEM"
    | "CREATE_SECTOR_RECORD"
    | "CREATE_DOMAIN_WORKFLOW"
    | "CREATE_INVOICE"
    | "CREATE_EXPENSE_APPROVAL";
  payload: Record<string, unknown>;
};

const queueKey = "beyond_erp_pending_transactions_v1";
const operationQueueKey = "beyond_erp_pending_operations_v1";

export function readQueue(): QueuedTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(queueKey) ?? "[]") as QueuedTransaction[];
  } catch {
    return [];
  }
}

export function writeQueue(items: QueuedTransaction[]) {
  localStorage.setItem(queueKey, JSON.stringify(items));
}

export function readOperationQueue(): QueuedOperation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(operationQueueKey) ?? "[]") as QueuedOperation[];
  } catch {
    return [];
  }
}

export function writeOperationQueue(items: QueuedOperation[]) {
  localStorage.setItem(operationQueueKey, JSON.stringify(items));
}

export function queueOperation(operation: Omit<QueuedOperation, "localId">) {
  const queue = readOperationQueue();
  writeOperationQueue([...queue, { ...operation, localId: crypto.randomUUID() }]);
  return queue.length + 1;
}
