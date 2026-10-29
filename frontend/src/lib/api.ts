import type {
  AuditLog,
  AuthResponse,
  ChartAccount,
  Dashboard,
  DomainWorkflow,
  EmailLog,
  Employee,
  ExpenseApproval,
  FinanceSummary,
  Invoice,
  NewEmployeeInput,
  NewTransactionInput,
  Paginated,
  PayrollRun,
  Receipt,
  RegistrationRequest,
  Sector,
  SectorRecord,
  SectorWorkItem,
  Settings,
  TeamMember,
  Transaction,
  User
} from "./types";
import { mockFetch } from "./mock";

const MOCK = process.env.NEXT_PUBLIC_MOCK === "true";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const tokenKey = "beyond_erp_auth_token_v1";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKey);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(tokenKey, token);
  } else {
    localStorage.removeItem(tokenKey);
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (MOCK) return mockFetch<T>(path, init);
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => apiFetch<{ ok: boolean; service: string }>("/backend-health"),
  login: (input: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  me: () => apiFetch<{ user: User }>("/api/auth/me"),
  dashboard: () => apiFetch<Dashboard>("/api/dashboard"),
  sectors: () => apiFetch<Sector[]>("/api/sectors"),
  transactions: (type = "ALL") => apiFetch<Transaction[]>(`/api/transactions?type=${type}`),
  searchTransactions: (params: {
    type?: string;
    q?: string;
    page?: number;
    limit?: number;
    sectorId?: string;
    status?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const query = new URLSearchParams({
      type: params.type ?? "ALL",
      q: params.q ?? "",
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 50),
      sectorId: params.sectorId ?? "",
      status: params.status ?? "",
      paymentMethod: params.paymentMethod ?? "",
      dateFrom: params.dateFrom ?? "",
      dateTo: params.dateTo ?? ""
    });
    return apiFetch<Paginated<Transaction>>(`/api/transactions?${query.toString()}`);
  },
  employees: () => apiFetch<Employee[]>("/api/employees"),
  searchEmployees: (params: { q?: string; page?: number; limit?: number; status?: string; department?: string }) => {
    const query = new URLSearchParams({
      q: params.q ?? "",
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 50),
      status: params.status ?? "",
      department: params.department ?? ""
    });
    return apiFetch<Paginated<Employee>>(`/api/employees?${query.toString()}`);
  },
  settings: () => apiFetch<Settings>("/api/settings"),
  createTransaction: (input: NewTransactionInput) =>
    apiFetch<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  updateTransaction: (id: string, input: Partial<NewTransactionInput>) =>
    apiFetch<Transaction>(`/api/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  deleteTransaction: (id: string) =>
    apiFetch<void>(`/api/transactions/${id}`, {
      method: "DELETE"
    }),
  syncTransactions: (items: NewTransactionInput[]) =>
    apiFetch<{ count: number; transactions: Transaction[] }>("/api/sync/transactions", {
      method: "POST",
      body: JSON.stringify({ items })
    }),
  createEmployee: (input: NewEmployeeInput) =>
    apiFetch<Employee>("/api/employees", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  updateEmployee: (id: string, input: Partial<NewEmployeeInput>) =>
    apiFetch<Employee>(`/api/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  deleteEmployee: (id: string) =>
    apiFetch<void>(`/api/employees/${id}`, {
      method: "DELETE"
    }),
  createAdmin: (sectorId: string, input: { fullName: string; contact: string; permissions: string[] }) =>
    apiFetch<TeamMember>(`/api/sectors/${sectorId}/admins`, {
      method: "POST",
      body: JSON.stringify(input)
    }),
  createManager: (
    sectorId: string,
    input: { fullName: string; department: string; assignedFeatures: string[] }
  ) =>
    apiFetch<TeamMember>(`/api/sectors/${sectorId}/managers`, {
      method: "POST",
      body: JSON.stringify(input)
    }),
  deleteTeamMember: (memberId: string) =>
    apiFetch<void>(`/api/team-members/${memberId}`, {
      method: "DELETE"
    }),
  updateSettings: (input: Partial<Settings>) =>
    apiFetch<Settings>("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  users: (params: { q?: string; role?: string; status?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams({
      q: params.q ?? "",
      role: params.role ?? "",
      status: params.status ?? "",
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 50)
    });
    return apiFetch<Paginated<User>>(`/api/users?${query.toString()}`);
  },
  createUser: (input: {
    fullName: string;
    email: string;
    phone?: string;
    companyName?: string;
    companyTinNumber?: string;
    companySectorId?: string;
    password?: string;
    role: string;
    permissions: string[];
  }) =>
    apiFetch<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  updateUser: (id: string, input: Partial<User> & { password?: string }) =>
    apiFetch<User>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  disableUser: (id: string) =>
    apiFetch<void>(`/api/users/${id}`, {
      method: "DELETE"
    }),
  resetUserPassword: (id: string, newPassword: string) =>
    apiFetch<{ user: User; temporaryPassword: string }>(`/api/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword })
    }),
  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ ok: boolean }>("/api/auth/password", {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  auditLogs: (params: { actor?: string; method?: string; dateFrom?: string; dateTo?: string; page?: number } = {}) => {
    const query = new URLSearchParams({
      actor: params.actor ?? "",
      method: params.method ?? "",
      dateFrom: params.dateFrom ?? "",
      dateTo: params.dateTo ?? "",
      page: String(params.page ?? 1),
      limit: "20"
    });
    return apiFetch<Paginated<AuditLog>>(`/api/audit-logs?${query.toString()}`);
  },
  emailLogs: (params: { to?: string; status?: string; page?: number } = {}) => {
    const query = new URLSearchParams({
      to: params.to ?? "",
      status: params.status ?? "",
      page: String(params.page ?? 1),
      limit: "20"
    });
    return apiFetch<Paginated<EmailLog>>(`/api/email-logs?${query.toString()}`);
  },
  sendTestEmail: (input: { to: string; subject: string; message: string }) =>
    apiFetch<{ sent: boolean; skipped: boolean; messageId?: string }>("/api/email/test", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  createRegistrationRequest: (input: {
    companyName: string;
    tinNumber?: string;
    sectorId: string;
    fullName: string;
    email: string;
    phone?: string;
    notes?: string;
  }) =>
    apiFetch<RegistrationRequest>("/api/registration-requests", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  registrationRequests: (params: { q?: string; status?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams({
      q: params.q ?? "",
      status: params.status ?? "",
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 20)
    });
    return apiFetch<Paginated<RegistrationRequest>>(`/api/registration-requests?${query.toString()}`);
  },
  registrationAction: (
    id: string,
    action: "mark-paid" | "approve" | "reject",
    input: { paymentReference?: string; temporaryPassword?: string; rejectionReason?: string } = {}
  ) =>
    apiFetch<{ request: RegistrationRequest; user?: User; temporaryPassword?: string } | RegistrationRequest>(
      `/api/registration-requests/${id}/actions/${action}`,
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    ),
  createWorkItem: (input: {
    sectorId: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string | null;
    assignedToId?: string | null;
  }) =>
    apiFetch<SectorWorkItem>("/api/work-items", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  financeSummary: () => apiFetch<FinanceSummary>("/api/finance/summary"),
  invoices: () => apiFetch<Paginated<Invoice>>("/api/invoices?limit=20"),
  createInvoice: (input: {
    customerName: string;
    customerPhone?: string;
    sectorId?: string | null;
    items: { description: string; quantity: number; unitPrice: number }[];
    status?: string;
    dueDate?: string | null;
  }) =>
    apiFetch<Invoice>("/api/invoices", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  receipts: () => apiFetch<Paginated<Receipt>>("/api/receipts?limit=20"),
  createReceipt: (input: { payerName: string; amount: number; paymentMethod: string; transactionId?: string | null }) =>
    apiFetch<Receipt>("/api/receipts", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  expenseApprovals: () => apiFetch<Paginated<ExpenseApproval>>("/api/expense-approvals?limit=20"),
  createExpenseApproval: (input: {
    title: string;
    amount: number;
    category: string;
    sectorId?: string | null;
    notes?: string;
  }) =>
    apiFetch<ExpenseApproval>("/api/expense-approvals", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  approvalAction: (id: string, action: "approve" | "reject" | "pay") =>
    apiFetch<ExpenseApproval>(`/api/expense-approvals/${id}/actions/${action}`, {
      method: "POST"
    }),
  chartAccounts: () => apiFetch<ChartAccount[]>("/api/chart-accounts"),
  payrollRuns: () => apiFetch<Paginated<PayrollRun>>("/api/payroll-runs?limit=20"),
  createPayrollRun: (input: {
    period: string;
    status?: string;
    items: { employeeId?: string; employeeName: string; grossPay: number; deductions: number }[];
  }) =>
    apiFetch<PayrollRun>("/api/payroll-runs", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  sectorRecords: (sectorId?: string) =>
    apiFetch<SectorRecord[]>(`/api/sector-records${sectorId ? `?sectorId=${encodeURIComponent(sectorId)}` : ""}`),
  domainWorkflows: (sectorId: string) =>
    apiFetch<{ workflows: DomainWorkflow[]; records: SectorRecord[] }>(`/api/domain-workflows/${sectorId}`),
  createDomainWorkflow: (
    sectorId: string,
    workflowKey: string,
    input: { values: Record<string, string | number | boolean | null>; ownerName?: string; status?: string }
  ) =>
    apiFetch<SectorRecord>(`/api/domain-workflows/${sectorId}/${workflowKey}`, {
      method: "POST",
      body: JSON.stringify(input)
    }),
  createSectorRecord: (input: {
    sectorId: string;
    recordType: string;
    title: string;
    ownerName?: string;
    value?: number | null;
    status?: string;
    metadata?: Record<string, unknown>;
  }) =>
    apiFetch<SectorRecord>("/api/sector-records", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  transactionCsv: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/export/transactions.csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (!response.ok) {
      throw new Error(`CSV export failed: ${response.status}`);
    }
    return response.blob();
  },
  csvUrl: () => `${API_URL}/api/export/transactions.csv`,
  needsSetup: () => apiFetch<{ needsSetup: boolean }>("/api/auth/needs-setup"),
  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (input: { email: string; otp: string; newPassword: string }) =>
    apiFetch<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(input) }),
  setupSendOtp: (input: { companyName: string; tinNumber?: string; sectorId?: string; fullName: string; email: string; password: string }) =>
    apiFetch<{ message: string }>("/api/auth/setup/send-otp", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  setup: (input: { companyName: string; tinNumber?: string; sectorId?: string; fullName: string; email: string; password: string; otp: string }) =>
    apiFetch<AuthResponse>("/api/auth/setup", {
      method: "POST",
      body: JSON.stringify(input)
    })
};
