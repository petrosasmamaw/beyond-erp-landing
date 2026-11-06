import { store } from "@/store";
import { addTransaction, editTransaction, deleteTransaction } from "@/store/slices/transactionsSlice";
import { addEmployee, editEmployee, deleteEmployee } from "@/store/slices/employeesSlice";
import { createInvoice, createExpenseApproval, handleApprovalAction, createPayrollRun } from "@/store/slices/financeSlice";
import { updateSettings } from "@/store/slices/settingsSlice";
import {
  SECTORS_CATALOG,
  INITIAL_SECTOR_RECORDS,
  INITIAL_WORK_ITEMS_BY_SECTOR,
} from "@/store/initialData";
import type {
  AuthResponse,
  ChartAccount,
  Dashboard,
  DomainWorkflow,
  EmailLog,
  Employee,
  ExpenseApproval,
  FinanceSummary,
  Invoice,
  Paginated,
  PayrollRun,
  Receipt,
  RegistrationRequest,
  Sector,
  SectorRecord,
  Settings,
  Transaction,
  User
} from "./types";

const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const MOCK_USER: User = {
  id: "mock-user-1",
  fullName: "Yohannes Getachew",
  email: "yohannes@beyonderp.demo",
  phone: "+251911234567",
  companyName: "Selam Medical Center",
  companyTinNumber: "0012345678",
  companySectorId: "healthcare",
  role: "OWNER",
  permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
  effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
  status: "ACTIVE",
  lastLoginAt: d(0),
  createdAt: d(30)
};

export const MOCK_AUTH: AuthResponse = {
  token: "mock-jwt-token-beyond-erp-demo",
  user: MOCK_USER
};

export const MOCK_SETTINGS: Settings = {
  id: "default",
  companyName: "Selam Medical Center",
  tinNumber: "0012345678",
  companySectorId: "healthcare",
  businessType: "PLC",
  language: "English",
  currency: "ETB",
  taxRate: 15,
  telebirrEnabled: true,
  cbeEnabled: true,
  ehmisEnabled: false,
  emailEnabled: false,
  telegramEnabled: false,
  smsEnabled: false,
  offlineMode: true,
  autoSync: true,
  dataCompression: false,
  vatRegistered: true
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "INCOME", amount: 85000, description: "Product sales – bulk order", category: "Sales", sectorId: "retail-sector", paymentMethod: "Telebirr", vatAmount: 11087, status: "COMPLETED", synced: true, occurredAt: d(1) },
  { id: "t2", type: "INCOME", amount: 42500, description: "Consulting service fee", category: "Services", sectorId: null, paymentMethod: "CBE Transfer", vatAmount: 5543, status: "COMPLETED", synced: true, occurredAt: d(2) },
  { id: "t3", type: "EXPENSE", amount: 18000, description: "Office rent – May 2025", category: "Rent", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: d(3) },
  { id: "t4", type: "INCOME", amount: 33000, description: "Delivery service revenue", category: "Logistics", sectorId: "logistics-sector", paymentMethod: "Telebirr", vatAmount: 4304, status: "COMPLETED", synced: true, occurredAt: d(4) },
  { id: "t5", type: "EXPENSE", amount: 9500, description: "Fuel and vehicle maintenance", category: "Transport", sectorId: "logistics-sector", paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: d(5) },
  { id: "t6", type: "EXPENSE", amount: 55000, description: "Inventory purchase – wholesale", category: "Inventory", sectorId: "retail-sector", paymentMethod: "CBE Transfer", vatAmount: 7174, status: "COMPLETED", synced: true, occurredAt: d(6) },
  { id: "t7", type: "INCOME", amount: 21000, description: "Medical supplies sale", category: "Sales", sectorId: "health-sector", paymentMethod: "Cash", vatAmount: 2739, status: "COMPLETED", synced: true, occurredAt: d(7) },
  { id: "t8", type: "EXPENSE", amount: 12000, description: "Staff salaries advance", category: "Payroll", sectorId: null, paymentMethod: "CBE Transfer", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: d(8) },
  { id: "t9", type: "INCOME", amount: 67500, description: "Hotel accommodation bookings", category: "Hospitality", sectorId: "hotel-sector", paymentMethod: "Telebirr", vatAmount: 8804, status: "COMPLETED", synced: true, occurredAt: d(9) },
  { id: "t10", type: "EXPENSE", amount: 7800, description: "Electricity & utilities", category: "Utilities", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: d(10) },
  { id: "t11", type: "INCOME", amount: 15000, description: "Training workshop fees", category: "Education", sectorId: "edu-sector", paymentMethod: "CBE Transfer", vatAmount: 1957, status: "PENDING", synced: false, occurredAt: d(0) },
  { id: "t12", type: "EXPENSE", amount: 4500, description: "Office supplies", category: "Office", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: d(11) }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "e1", fullName: "Abebe Bekele", position: "Sales Manager", department: "Sales", phone: "+251911000001", email: "abebe@selam.et", salary: 18000, status: "ACTIVE", hiredDate: d(365), createdAt: d(365) },
  { id: "e2", fullName: "Tigist Haile", position: "Accountant", department: "Finance", phone: "+251911000002", email: "tigist@selam.et", salary: 15000, status: "ACTIVE", hiredDate: d(300), createdAt: d(300) },
  { id: "e3", fullName: "Dawit Mekonnen", position: "Driver", department: "Logistics", phone: "+251911000003", email: null, salary: 8500, status: "ACTIVE", hiredDate: d(200), createdAt: d(200) },
  { id: "e4", fullName: "Hanan Mohammed", position: "Receptionist", department: "Admin", phone: "+251911000004", email: "hanan@selam.et", salary: 9000, status: "ACTIVE", hiredDate: d(180), createdAt: d(180) },
  { id: "e5", fullName: "Solomon Girma", position: "IT Support", department: "Tech", phone: "+251911000005", email: "solomon@selam.et", salary: 22000, status: "ACTIVE", hiredDate: d(120), createdAt: d(120) },
  { id: "e6", fullName: "Mekdes Tadesse", position: "Cashier", department: "Sales", phone: "+251911000006", email: null, salary: 7500, status: "INACTIVE", hiredDate: d(400), createdAt: d(400) }
];

export const MOCK_SECTORS: Sector[] = SECTORS_CATALOG.map((sec) => ({
  id: sec.id,
  name: sec.name,
  icon: sec.icon.replace(/^fa-solid fa-/, "").replace(/^fa-/, "") || "ShoppingBag",
  color: sec.color,
  lightColor: sec.lightColor,
  textColor: sec.textColor,
  description: sec.description,
  features: sec.keyModules,
  teamMembers: [
    {
      id: `tm-${sec.id}-1`,
      type: "ADMIN" as const,
      fullName: "Abebe Bekele",
      contact: "+251911000001",
      department: "Operations",
      permissions: ["View", "Transactions", "Employees", "Reports"],
      assignedFeatures: sec.keyModules.slice(0, 2),
      sectorId: sec.id,
      createdAt: d(365),
    },
    {
      id: `tm-${sec.id}-2`,
      type: "MANAGER" as const,
      fullName: "Tigist Haile",
      contact: "+251911000002",
      department: "Finance",
      permissions: null,
      assignedFeatures: sec.keyModules.slice(1, 3),
      sectorId: sec.id,
      createdAt: d(200),
    },
  ],
  workItems: (INITIAL_WORK_ITEMS_BY_SECTOR[sec.id] || []).map((wi) => ({
    id: wi.id,
    sectorId: wi.sectorId,
    title: wi.title,
    status: wi.status,
    priority: wi.priority,
    dueDate: wi.dueDate ?? null,
    assignedToId: wi.assignedToId ?? null,
    createdById: "mock-user-1",
    description: wi.description ?? null,
    metadata: null,
    createdAt: wi.createdAt,
  })),
  sectorRecords: (INITIAL_SECTOR_RECORDS[sec.id] || []).map((sr) => ({
    id: sr.id,
    sectorId: sr.sectorId,
    recordType: sr.recordType,
    title: sr.title,
    ownerName: sr.ownerName ?? null,
    status: sr.status,
    value: sr.value ?? null,
    metadata: (sr.metadata as Record<string, unknown>) ?? {},
    createdAt: sr.createdAt,
  })),
}));

export const MOCK_DASHBOARD: Dashboard = {
  stats: {
    revenue: 264000,
    expenses: 106800,
    netProfit: 157200,
    pendingSync: 1,
    employeeCount: 6,
    sectorCount: 12
  },
  taxSummary: {
    taxableRevenue: 264000,
    vat: 34434,
    withholding: 13200,
    totalTaxLiability: 47634
  },
  revenueChart: [38000, 52000, 47000, 61000, 55000, 68000, 71000, 64000, 82000, 75000, 88000, 93000],
  sectorBreakdown: [
    { sector: "Retail & Trade", amount: 127000, percentage: 48 },
    { sector: "Hotel & Hospitality", amount: 67500, percentage: 26 },
    { sector: "Logistics", amount: 33000, percentage: 12 },
    { sector: "Healthcare", amount: 21000, percentage: 8 },
    { sector: "Other", amount: 15500, percentage: 6 }
  ],
  recentTransactions: MOCK_TRANSACTIONS.slice(0, 5)
};

export const MOCK_FINANCE: FinanceSummary = {
  profitLoss: { revenue: 264000, expenses: 106800, netProfit: 157200, invoiced: 42000 },
  cashFlow: { inflow: 264000, outflow: 106800, netCash: 157200 },
  balanceSheet: [
    { code: "1000", name: "Cash & Bank", type: "ASSET", balance: 245000 },
    { code: "1200", name: "Accounts Receivable", type: "ASSET", balance: 42000 },
    { code: "1500", name: "Inventory", type: "ASSET", balance: 88000 },
    { code: "2000", name: "Accounts Payable", type: "LIABILITY", balance: -18500 },
    { code: "3000", name: "Owner Equity", type: "EQUITY", balance: 356500 },
    { code: "4000", name: "Revenue", type: "INCOME", balance: 264000 },
    { code: "5000", name: "Operating Expenses", type: "EXPENSE", balance: -106800 }
  ]
};

export const MOCK_INVOICES: Invoice[] = [
  { id: "inv1", invoiceNumber: "INV-2025-001", customerName: "Kebede Trading Co.", customerPhone: "+251911222333", sectorId: "retail-sector", items: [{ description: "Bulk electronics order", quantity: 10, unitPrice: 8500 }], subtotal: 85000, vatAmount: 12750, total: 97750, status: "PAID", issuedAt: d(10), dueDate: d(-5) },
  { id: "inv2", invoiceNumber: "INV-2025-002", customerName: "Addis Logistics Ltd.", customerPhone: "+251911444555", sectorId: "logistics-sector", items: [{ description: "Monthly freight service", quantity: 1, unitPrice: 33000 }], subtotal: 33000, vatAmount: 4950, total: 37950, status: "SENT", issuedAt: d(5), dueDate: d(10) },
  { id: "inv3", invoiceNumber: "INV-2025-003", customerName: "Haile Medical Center", customerPhone: "+251911666777", sectorId: "health-sector", items: [{ description: "Medical supplies", quantity: 3, unitPrice: 7000 }], subtotal: 21000, vatAmount: 3150, total: 24150, status: "DRAFT", issuedAt: d(2), dueDate: d(20) },
  { id: "inv4", invoiceNumber: "INV-2024-098", customerName: "Bole Hotel Group", customerPhone: null, sectorId: "hotel-sector", items: [{ description: "Accommodation – corporate", quantity: 28, unitPrice: 2400 }], subtotal: 67200, vatAmount: 10080, total: 77280, status: "OVERDUE", issuedAt: d(45), dueDate: d(15) }
];

export const MOCK_RECEIPTS: Receipt[] = [
  { id: "rec1", receiptNumber: "REC-2025-001", payerName: "Kebede Trading Co.", amount: 97750, paymentMethod: "CBE Transfer", issuedAt: d(5) },
  { id: "rec2", receiptNumber: "REC-2025-002", payerName: "Walk-in Customer", amount: 4500, paymentMethod: "Cash", issuedAt: d(3) },
  { id: "rec3", receiptNumber: "REC-2025-003", payerName: "Bole Hotel Group", amount: 20000, paymentMethod: "Telebirr", issuedAt: d(1) }
];

export const MOCK_EXPENSE_APPROVALS: ExpenseApproval[] = [
  { id: "ea1", title: "New office printer purchase", amount: 22000, category: "Equipment", sectorId: null, requestedById: "e2", approvedById: null, status: "REQUESTED", notes: "HP LaserJet Pro – needed for invoicing", requestedAt: d(2) },
  { id: "ea2", title: "Staff team lunch – quarterly", amount: 8500, category: "Staff Welfare", sectorId: null, requestedById: "e4", approvedById: "mock-user-1", status: "APPROVED", notes: null, requestedAt: d(5) },
  { id: "ea3", title: "Fleet fuel – April", amount: 14000, category: "Transport", sectorId: "logistics-sector", requestedById: "e3", approvedById: "mock-user-1", status: "PAID", notes: null, requestedAt: d(30) }
];

export const MOCK_CHART_ACCOUNTS: ChartAccount[] = [
  { id: "ca1", code: "1000", name: "Cash & Bank", type: "ASSET", active: true },
  { id: "ca2", code: "1200", name: "Accounts Receivable", type: "ASSET", active: true },
  { id: "ca3", code: "1500", name: "Inventory", type: "ASSET", active: true },
  { id: "ca4", code: "1800", name: "Fixed Assets", type: "ASSET", active: true },
  { id: "ca5", code: "2000", name: "Accounts Payable", type: "LIABILITY", active: true },
  { id: "ca6", code: "2500", name: "Tax Payable", type: "LIABILITY", active: true },
  { id: "ca7", code: "3000", name: "Owner Equity", type: "EQUITY", active: true },
  { id: "ca8", code: "4000", name: "Sales Revenue", type: "INCOME", active: true },
  { id: "ca9", code: "4100", name: "Service Revenue", type: "INCOME", active: true },
  { id: "ca10", code: "5000", name: "Cost of Goods Sold", type: "EXPENSE", active: true },
  { id: "ca11", code: "5100", name: "Salaries & Wages", type: "EXPENSE", active: true },
  { id: "ca12", code: "5200", name: "Rent & Utilities", type: "EXPENSE", active: true }
];

export const MOCK_PAYROLL: PayrollRun[] = [
  {
    id: "pr1",
    period: "2025-05",
    status: "APPROVED",
    grossPay: 80000,
    deductions: 12000,
    netPay: 68000,
    items: [
      { employeeId: "e1", employeeName: "Abebe Bekele", grossPay: 18000, deductions: 2700 },
      { employeeId: "e2", employeeName: "Tigist Haile", grossPay: 15000, deductions: 2250 },
      { employeeId: "e3", employeeName: "Dawit Mekonnen", grossPay: 8500, deductions: 1275 },
      { employeeId: "e4", employeeName: "Hanan Mohammed", grossPay: 9000, deductions: 1350 },
      { employeeId: "e5", employeeName: "Solomon Girma", grossPay: 22000, deductions: 3300 },
      { employeeId: "e6", employeeName: "Mekdes Tadesse", grossPay: 7500, deductions: 1125 }
    ],
    createdAt: d(10)
  },
  {
    id: "pr2",
    period: "2025-04",
    status: "PAID",
    grossPay: 80000,
    deductions: 12000,
    netPay: 68000,
    items: [
      { employeeId: "e1", employeeName: "Abebe Bekele", grossPay: 18000, deductions: 2700 },
      { employeeId: "e2", employeeName: "Tigist Haile", grossPay: 15000, deductions: 2250 }
    ],
    createdAt: d(40)
  }
];

export const MOCK_EMAIL_LOGS: EmailLog[] = [
  { id: "el1", to: "yohannes@beyonderp.demo", subject: "Welcome to Beyond ERP", status: "SENT", provider: "gmail", messageId: "msg-001", error: null, createdAt: d(30) },
  { id: "el2", to: "abebe@selam.et", subject: "Invoice INV-2025-001", status: "SENT", provider: "gmail", messageId: "msg-002", error: null, createdAt: d(10) }
];

export const MOCK_SECTOR_RECORDS: SectorRecord[] = MOCK_SECTORS.flatMap((s) => s.sectorRecords ?? []);

export const MOCK_DOMAIN_WORKFLOWS: DomainWorkflow[] = [
  {
    key: "product-listing",
    sectorId: "retail-sector",
    recordType: "Product",
    title: "Add Product",
    description: "Register a new product in inventory",
    valueField: "price",
    fields: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { name: "price", label: "Unit Price (ETB)", type: "number", required: true },
      { name: "quantity", label: "Stock Quantity", type: "number", required: true }
    ]
  },
  {
    key: "vehicle-register",
    sectorId: "logistics-sector",
    recordType: "Vehicle",
    title: "Register Vehicle",
    description: "Add a fleet vehicle",
    valueField: "value",
    fields: [
      { name: "plateNumber", label: "Plate Number", type: "text", required: true },
      { name: "model", label: "Vehicle Model", type: "text", required: true },
      { name: "value", label: "Vehicle Value (ETB)", type: "number" }
    ]
  }
];

function paginate<T>(items: T[]): Paginated<T> {
  return { items, total: items.length, page: 1, limit: 50 };
}

let mockTransactions = [...MOCK_TRANSACTIONS];
let mockEmployees = [...MOCK_EMPLOYEES];
let mockSettings = { ...MOCK_SETTINGS };
let mockSectors = [...MOCK_SECTORS];
let mockInvoices = [...MOCK_INVOICES];
let mockReceipts = [...MOCK_RECEIPTS];
let mockApprovals = [...MOCK_EXPENSE_APPROVALS];
let mockPayroll = [...MOCK_PAYROLL];
let mockRegistrationRequests: RegistrationRequest[] = [
  {
    id: "reg-1",
    companyName: "Merkato Wholesale PLC",
    tinNumber: "0099887766",
    sectorId: "retail-trading",
    fullName: "Marta Alemu",
    email: "marta@merkato.example",
    phone: "+251911222333",
    notes: "Interested in POS and inventory after payment confirmation.",
    status: "PAID",
    paymentReference: "TXN-5481",
    approvedById: null,
    createdUserId: null,
    rejectionReason: null,
    createdAt: d(1),
    updatedAt: d(1)
  }
];

function uid() { return "mock-" + Math.random().toString(36).slice(2); }

const MOCK_SECTOR_KEY = "beyond_mock_sector_v1";
const MOCK_COMPANY_KEY = "beyond_mock_company_v1";

export function getMockSectorId(): string {
  if (typeof window === "undefined") return "retail-trading";
  return localStorage.getItem(MOCK_SECTOR_KEY) ?? "healthcare";
}

export function setMockProfile(
  sectorId: string,
  companyName?: string,
  overrides?: { fullName?: string; email?: string; phone?: string; tinNumber?: string }
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_SECTOR_KEY, sectorId);
  if (companyName) {
    localStorage.setItem(MOCK_COMPANY_KEY, companyName);
    mockSettings = {
      ...mockSettings,
      companyName,
      companySectorId: sectorId,
      tinNumber: overrides?.tinNumber || mockSettings.tinNumber,
    };
  }
}

export function getMockCompanyName(): string {
  if (typeof window === "undefined") return MOCK_SETTINGS.companyName;
  return localStorage.getItem(MOCK_COMPANY_KEY) ?? MOCK_SETTINGS.companyName;
}

export async function mockFetch<T>(path: string, init?: RequestInit): Promise<T> {
  await new Promise((r) => setTimeout(r, 120));

  const method = init?.method ?? "GET";
  const body = init?.body ? JSON.parse(init.body as string) : null;

  // Auth
  if (path.includes("/api/auth/needs-setup")) return { needsSetup: false } as T;
  if (path.includes("/api/auth/setup/send-otp")) return { message: "OTP sent" } as T;
  if (path.includes("/api/auth/setup")) {
    const companySectorId = body?.sectorId ?? "retail-trading";
    const companyName = body?.companyName ?? MOCK_SETTINGS.companyName;
    setMockProfile(companySectorId, companyName);
    mockSettings = { ...mockSettings, companyName, tinNumber: body?.tinNumber ?? mockSettings.tinNumber, companySectorId };
    return {
      ...MOCK_AUTH,
      user: { ...MOCK_USER, fullName: body?.fullName ?? MOCK_USER.fullName, email: body?.email ?? MOCK_USER.email, companyName, companySectorId }
    } as T;
  }
  if (path.includes("/api/auth/forgot-password")) return { message: "If that email exists, a reset code was sent" } as T;
  if (path.includes("/api/auth/reset-password")) return { message: "Password reset successful. You can now sign in." } as T;
  if (path.includes("/api/auth/login")) {
    const companySectorId = getMockSectorId();
    const companyName = getMockCompanyName();
    return { ...MOCK_AUTH, user: { ...MOCK_USER, companyName, companySectorId } } as T;
  }
  if (path.includes("/api/auth/me")) {
    const companySectorId = getMockSectorId();
    const companyName = getMockCompanyName();
    return { user: { ...MOCK_USER, companyName, companySectorId } } as T;
  }
  if (path.includes("/api/auth/password")) return { ok: true } as T;

  // Public/client registration requests
  if (path.includes("/api/registration-requests") && !path.includes("/actions/")) {
    if (method === "POST") {
      const isPaid = Boolean(body?.isPaid);
      const request = {
        id: uid(),
        ...body,
        tinNumber: body?.tinNumber || null,
        phone: body?.phone || null,
        notes: body?.notes || null,
        paymentMethod: body?.paymentMethod || null,
        paymentReference: body?.paymentReference || null,
        isPaid,
        status: isPaid ? "PAID" : "PENDING_PAYMENT",
        paidAt: isPaid ? new Date().toISOString() : null,
        approvedById: null,
        createdUserId: null,
        rejectionReason: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as RegistrationRequest;
      mockRegistrationRequests = [request, ...mockRegistrationRequests];
      return request as T;
    }
    return paginate(mockRegistrationRequests) as T;
  }
  if (path.match(/\/api\/registration-requests\/[^/]+\/actions\/(mark-paid|mark-unpaid|approve|reject)/)) {
    const parts = path.split("/");
    const id = parts[3];
    const action = parts[5];
    const statusMap: Record<string, RegistrationRequest["status"]> = {
      "mark-paid": "PAID",
      "mark-unpaid": "PENDING_PAYMENT",
      approve: "APPROVED",
      reject: "REJECTED"
    };
    mockRegistrationRequests = mockRegistrationRequests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: statusMap[action] ?? request.status,
            isPaid: action === "mark-paid" || action === "approve",
            paidAt: action === "mark-paid" || action === "approve" ? new Date().toISOString() : (action === "mark-unpaid" ? null : request.paidAt),
            paymentReference: body?.paymentReference ?? request.paymentReference,
            rejectionReason: body?.rejectionReason ?? request.rejectionReason,
            createdUserId: action === "approve" ? MOCK_USER.id : request.createdUserId,
            updatedAt: new Date().toISOString()
          }
        : request
    );
    const request = mockRegistrationRequests.find((item) => item.id === id)!;
    if (action === "approve") {
      return { request, user: { ...MOCK_USER, companyName: request.companyName, companySectorId: request.sectorId }, temporaryPassword: body?.temporaryPassword ?? "Beyond@12345" } as T;
    }
    return request as T;
  }

  // Dashboard
  if (path.includes("/api/dashboard")) {
    const txs = (store.getState().transactions.items as unknown as Transaction[]) || mockTransactions;
    const revenue = txs.filter((t) => t.type === "INCOME").reduce((s, t) => s + (t.amount || 0), 0);
    const expenses = txs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + (t.amount || 0), 0);
    const netProfit = revenue - expenses;
    const pendingSync = txs.filter((t) => !t.synced).length;
    const vat = Math.round(revenue * 0.15);
    const withholding = Math.round(revenue * 0.02);

    return {
      stats: {
        revenue,
        expenses,
        netProfit,
        pendingSync,
      },
      taxSummary: {
        taxableRevenue: revenue,
        vat,
        withholding,
        totalTaxLiability: vat + withholding,
      },
      revenueChart: [38000, 52000, 47000, 61000, 55000, 68000, 71000, 64000, 82000, 75000, 88000, Math.max(revenue, 93000)],
      sectorBreakdown: [
        { sector: "Retail & Trade", amount: Math.round(revenue * 0.48), percentage: 48 },
        { sector: "Hotel & Hospitality", amount: Math.round(revenue * 0.26), percentage: 26 },
        { sector: "Logistics", amount: Math.round(revenue * 0.12), percentage: 12 },
        { sector: "Healthcare", amount: Math.round(revenue * 0.08), percentage: 8 },
        { sector: "Other", amount: Math.round(revenue * 0.06), percentage: 6 }
      ],
      recentTransactions: txs.slice(0, 5)
    } as T;
  }

  // Settings
  if (path.includes("/api/settings")) {
    if (method === "PATCH") {
      store.dispatch(updateSettings(body));
      mockSettings = { ...mockSettings, ...body };
      if (body?.companySectorId) setMockProfile(body.companySectorId, body.companyName);
    }
    const stg = store.getState().settings.settings;
    return { ...mockSettings, ...stg, companySectorId: stg.companySectorId ?? getMockSectorId(), companyName: stg.companyName ?? getMockCompanyName() } as T;
  }

  // Transactions
  if (path.includes("/api/transactions") && !path.includes("/api/transactions/")) {
    if (method === "POST") {
      const vatAmount = body?.vatAmount !== undefined ? body.vatAmount : Math.round((body?.amount || 0) * 0.15);
      const tInput = { ...body, vatAmount };
      store.dispatch(addTransaction(tInput));
      const created = store.getState().transactions.items[0] as unknown as Transaction;
      mockTransactions = [created, ...mockTransactions];
      return created as T;
    }
    const txs = (store.getState().transactions.items as unknown as Transaction[]) || mockTransactions;
    const typeFilter = new URL(`http://x${path}`).searchParams.get("type") ?? "ALL";
    const filtered = typeFilter === "ALL" ? txs : txs.filter((t) => t.type === typeFilter);
    if (path.includes("page=") || path.includes("limit=")) return paginate(filtered) as T;
    return filtered as T;
  }
  if (path.match(/\/api\/transactions\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    if (method === "PATCH") {
      const existing = store.getState().transactions.items.find((t) => t.id === id);
      if (existing) {
        store.dispatch(editTransaction({ ...existing, ...body }));
      }
      mockTransactions = mockTransactions.map((t) => (t.id === id ? { ...t, ...body } : t));
      return (store.getState().transactions.items.find((t) => t.id === id) as unknown as Transaction) as T;
    }
    if (method === "DELETE") {
      store.dispatch(deleteTransaction(id));
      mockTransactions = mockTransactions.filter((t) => t.id !== id);
      return undefined as T;
    }
  }
  if (path.includes("/api/sync/transactions")) {
    const synced = (body.items as Transaction[]).map((item) => ({ ...item, id: uid(), synced: true, createdAt: new Date().toISOString() } as Transaction));
    synced.forEach((item) => store.dispatch(addTransaction(item)));
    mockTransactions = [...synced, ...mockTransactions];
    return { count: synced.length, transactions: synced } as T;
  }
  if (path.includes("/api/export/transactions.csv")) return new Blob(["mock,csv"]) as T;

  // Employees
  if (path.includes("/api/employees") && !path.includes("/api/employees/")) {
    if (method === "POST") {
      store.dispatch(addEmployee(body));
      const created = store.getState().employees.items[0] as unknown as Employee;
      mockEmployees = [created, ...mockEmployees];
      return created as T;
    }
    const emps = (store.getState().employees.items as unknown as Employee[]) || mockEmployees;
    if (path.includes("page=") || path.includes("limit=")) return paginate(emps) as T;
    return emps as T;
  }
  if (path.match(/\/api\/employees\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    if (method === "PATCH") {
      const existing = store.getState().employees.items.find((e) => e.id === id);
      if (existing) {
        store.dispatch(editEmployee({ ...existing, ...body }));
      }
      mockEmployees = mockEmployees.map((e) => (e.id === id ? { ...e, ...body } : e));
      return (store.getState().employees.items.find((e) => e.id === id) as unknown as Employee) as T;
    }
    if (method === "DELETE") {
      store.dispatch(deleteEmployee(id));
      mockEmployees = mockEmployees.filter((e) => e.id !== id);
      return undefined as T;
    }
  }

  // Sectors
  if (path.includes("/api/sectors")) return mockSectors as T;
  if (path.match(/\/api\/sectors\/[^/]+\/admins/)) {
    const sectorId = path.split("/")[3];
    const member = { id: uid(), type: "ADMIN" as const, ...body, sectorId, createdAt: new Date().toISOString() };
    mockSectors = mockSectors.map((s) => s.id === sectorId ? { ...s, teamMembers: [...s.teamMembers, member] } : s);
    return member as T;
  }
  if (path.match(/\/api\/sectors\/[^/]+\/managers/)) {
    const sectorId = path.split("/")[3];
    const member = { id: uid(), type: "MANAGER" as const, ...body, sectorId, createdAt: new Date().toISOString() };
    mockSectors = mockSectors.map((s) => s.id === sectorId ? { ...s, teamMembers: [...s.teamMembers, member] } : s);
    return member as T;
  }
  if (path.match(/\/api\/team-members\/[^/]+$/) && method === "DELETE") {
    const id = path.split("/").pop()!;
    mockSectors = mockSectors.map((s) => ({ ...s, teamMembers: s.teamMembers.filter((m) => m.id !== id) }));
    return undefined as T;
  }

  // Users
  if (path.includes("/api/users") && !path.includes("/api/users/")) {
    if (method === "POST") return { id: uid(), ...body, status: "ACTIVE", effectivePermissions: body.permissions ?? [], lastLoginAt: null, createdAt: new Date().toISOString() } as T;
    return paginate([MOCK_USER]) as T;
  }
  if (path.match(/\/api\/users\/[^/]+\/reset-password/)) return { user: MOCK_USER, temporaryPassword: "TempPass123!" } as T;
  if (path.match(/\/api\/users\/[^/]+$/)) {
    if (method === "PATCH") return { ...MOCK_USER, ...body } as T;
    if (method === "DELETE") return undefined as T;
  }

  // Finance
  if (path.includes("/api/finance/summary")) return MOCK_FINANCE as T;
  if (path.includes("/api/chart-accounts")) return MOCK_CHART_ACCOUNTS as T;

  // Invoices
  if (path.includes("/api/invoices") && !path.includes("/api/invoices/")) {
    if (method === "POST") {
      store.dispatch(createInvoice(body));
      const inv = store.getState().finance.invoices[0] as unknown as Invoice;
      mockInvoices = [inv, ...mockInvoices];
      return inv as T;
    }
    const invs = (store.getState().finance.invoices as unknown as Invoice[]) || mockInvoices;
    return paginate(invs) as T;
  }

  // Receipts
  if (path.includes("/api/receipts") && !path.includes("/api/receipts/")) {
    if (method === "POST") {
      const rec = { id: uid(), receiptNumber: `REC-${Date.now()}`, ...body, issuedAt: new Date().toISOString() };
      mockReceipts = [rec, ...mockReceipts];
      return rec as T;
    }
    const recs = (store.getState().finance.receipts as unknown as Receipt[]) || mockReceipts;
    return paginate(recs) as T;
  }

  // Expense approvals
  if (path.includes("/api/expense-approvals") && !path.match(/\/api\/expense-approvals\/[^/]+\/actions/)) {
    if (method === "POST") {
      store.dispatch(createExpenseApproval(body));
      const ea = store.getState().finance.expenseApprovals[0] as unknown as ExpenseApproval;
      mockApprovals = [ea, ...mockApprovals];
      return ea as T;
    }
    const apps = (store.getState().finance.expenseApprovals as unknown as ExpenseApproval[]) || mockApprovals;
    return paginate(apps) as T;
  }
  if (path.match(/\/api\/expense-approvals\/[^/]+\/actions\/(approve|reject|pay)/)) {
    const [, id, , action] = path.split("/").slice(2);
    store.dispatch(handleApprovalAction({ id, action: action as "approve" | "reject" | "pay" }));
    const statusMap: Record<string, string> = { approve: "APPROVED", reject: "REJECTED", pay: "PAID" };
    mockApprovals = mockApprovals.map((a) => a.id === id ? { ...a, status: (statusMap[action] ?? a.status) as import("./types").ApprovalStatus, approvedById: MOCK_USER.id } : a);
    return (store.getState().finance.expenseApprovals.find((a) => a.id === id) as unknown as ExpenseApproval) as T;
  }

  // Payroll
  if (path.includes("/api/payroll-runs") && !path.includes("/api/payroll-runs/")) {
    if (method === "POST") {
      store.dispatch(createPayrollRun({ employees: store.getState().employees.items as unknown as import("@/types/erp").Employee[] }));
      const pr = store.getState().finance.payrollRuns[0] as unknown as PayrollRun;
      mockPayroll = [pr, ...mockPayroll];
      return pr as T;
    }
    const runs = (store.getState().finance.payrollRuns as unknown as PayrollRun[]) || mockPayroll;
    return paginate(runs) as T;
  }

  // Sector records & domain workflows
  if (path.includes("/api/sector-records") && method === "POST") {
    const sr = { id: uid(), ...body, createdAt: new Date().toISOString() };
    mockSectors = mockSectors.map((s) => s.id === sr.sectorId ? { ...s, sectorRecords: [sr, ...(s.sectorRecords ?? [])] } : s);
    return sr as T;
  }
  if (path.includes("/api/sector-records")) return MOCK_SECTOR_RECORDS as T;
  if (path.match(/\/api\/domain-workflows\/[^/]+\/[^/]+$/) && method === "POST") {
    const [, sectorId] = path.split("/").slice(2);
    const sr = { id: uid(), sectorId, recordType: body.recordType ?? "Record", title: body.values?.name ?? "New Record", ownerName: body.ownerName ?? null, status: body.status ?? "ACTIVE", value: body.values ? Number(Object.values(body.values)[0]) || null : null, metadata: body.values ?? {}, createdAt: new Date().toISOString() };
    mockSectors = mockSectors.map((s) => s.id === sectorId ? { ...s, sectorRecords: [sr, ...(s.sectorRecords ?? [])] } : s);
    return sr as T;
  }
  if (path.match(/\/api\/domain-workflows\/[^/]+$/)) {
    const sectorId = path.split("/").pop()!;
    const workflows = MOCK_DOMAIN_WORKFLOWS.filter((w) => w.sectorId === sectorId);
    const records = MOCK_SECTOR_RECORDS.filter((r) => r.sectorId === sectorId);
    return { workflows, records } as T;
  }

  // Work items
  if (path.includes("/api/work-items") && method === "POST") {
    const wi = { id: uid(), ...body, createdAt: new Date().toISOString() };
    mockSectors = mockSectors.map((s) => s.id === wi.sectorId ? { ...s, workItems: [wi, ...(s.workItems ?? [])] } : s);
    return wi as T;
  }

  // Audit / email logs
  if (path.includes("/api/audit-logs")) return paginate([]) as T;
  if (path.includes("/api/email-logs")) return paginate(MOCK_EMAIL_LOGS) as T;
  if (path.includes("/api/email/test")) return { sent: false, skipped: true, messageId: "mock-msg" } as T;

  // Health
  if (path.includes("health")) return { ok: true, service: "beyond-erp-mock" } as T;

  return {} as T;
}
