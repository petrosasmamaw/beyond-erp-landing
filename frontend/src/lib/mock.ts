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

export const MOCK_SECTORS: Sector[] = [
  {
    id: "retail-sector",
    name: "Retail & Trade",
    icon: "ShoppingBag",
    color: "#1e40af",
    lightColor: "#dbeafe",
    textColor: "#1e40af",
    description: "Wholesale and retail merchandise management",
    features: ["Inventory", "POS", "Suppliers"],
    teamMembers: [{ id: "tm1", type: "ADMIN", fullName: "Abebe Bekele", contact: "+251911000001", department: "Sales", permissions: ["View", "Transactions"], assignedFeatures: null, sectorId: "retail-sector", createdAt: d(365) }],
    workItems: [
      { id: "wi1", sectorId: "retail-sector", title: "Restock electronics shelf", status: "IN_PROGRESS", priority: "HIGH", dueDate: d(-2), assignedToId: "e1", createdById: "mock-user-1", description: null, metadata: null, createdAt: d(5) },
      { id: "wi2", sectorId: "retail-sector", title: "Update price list Q2", status: "TODO", priority: "MEDIUM", dueDate: d(-7), assignedToId: null, createdById: "mock-user-1", description: null, metadata: null, createdAt: d(3) }
    ],
    sectorRecords: [
      { id: "sr1", sectorId: "retail-sector", recordType: "Product", title: "Samsung A15 Phone", ownerName: "Abebe Bekele", status: "ACTIVE", value: 12500, metadata: {}, createdAt: d(20) },
      { id: "sr2", sectorId: "retail-sector", recordType: "Product", title: "Office Chair – Ergonomic", ownerName: null, status: "ACTIVE", value: 4800, metadata: {}, createdAt: d(15) }
    ]
  },
  {
    id: "logistics-sector",
    name: "Logistics & Transport",
    icon: "Truck",
    color: "#b45309",
    lightColor: "#fef3c7",
    textColor: "#b45309",
    description: "Fleet, delivery, and freight operations",
    features: ["Fleet", "Routes", "Freight"],
    teamMembers: [{ id: "tm2", type: "MANAGER", fullName: "Dawit Mekonnen", contact: "+251911000003", department: "Logistics", permissions: null, assignedFeatures: ["Fleet", "Routes"], sectorId: "logistics-sector", createdAt: d(200) }],
    workItems: [
      { id: "wi3", sectorId: "logistics-sector", title: "Schedule vehicle maintenance", status: "TODO", priority: "URGENT", dueDate: d(-1), assignedToId: "e3", createdById: "mock-user-1", description: null, metadata: null, createdAt: d(2) }
    ],
    sectorRecords: [
      { id: "sr3", sectorId: "logistics-sector", recordType: "Vehicle", title: "Toyota Land Cruiser – AA-12345", ownerName: "Dawit Mekonnen", status: "ACTIVE", value: 1800000, metadata: {}, createdAt: d(60) }
    ]
  },
  {
    id: "health-sector",
    name: "Healthcare",
    icon: "HeartPulse",
    color: "#dc2626",
    lightColor: "#fee2e2",
    textColor: "#dc2626",
    description: "Patient care, hospital operations, pharmacy, lab, billing, claims, and EHMIS-ready reporting",
    features: [
      "EMR / EHR",
      "Queue & OPD",
      "IPD & Beds",
      "Pharmacy",
      "Lab & Radiology",
      "Billing & Claims",
      "Inventory & Procurement",
      "Security & Compliance",
      "Reports & EHMIS",
      "Patient Portal"
    ],
    teamMembers: [],
    workItems: [],
    sectorRecords: [
      { id: "sr4", sectorId: "health-sector", recordType: "Patient", title: "Fatima Yusuf – Follow-up", ownerName: "Fatima Yusuf", status: "PENDING", value: null, metadata: {}, createdAt: d(3) }
    ]
  },
  {
    id: "hotel-sector",
    name: "Hotel & Hospitality",
    icon: "Hotel",
    color: "#7c3aed",
    lightColor: "#ede9fe",
    textColor: "#7c3aed",
    description: "Room booking and hospitality services",
    features: ["Rooms", "Bookings", "F&B"],
    teamMembers: [],
    workItems: [],
    sectorRecords: [
      { id: "sr5", sectorId: "hotel-sector", recordType: "Booking", title: "Room 204 – Kebede Family", ownerName: "Kebede Alemu", status: "ACTIVE", value: 2400, metadata: {}, createdAt: d(1) }
    ]
  }
];

export const MOCK_DASHBOARD: Dashboard = {
  stats: {
    revenue: 264000,
    expenses: 106800,
    netProfit: 157200,
    pendingSync: 1,
    employeeCount: 6,
    sectorCount: 4
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

function getMockSectorId(): string {
  if (typeof window === "undefined") return "retail-trading";
  return localStorage.getItem(MOCK_SECTOR_KEY) ?? "healthcare";
}

function setMockProfile(sectorId: string, companyName?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_SECTOR_KEY, sectorId);
  if (companyName) localStorage.setItem(MOCK_COMPANY_KEY, companyName);
}

function getMockCompanyName(): string {
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
      const request = {
        id: uid(),
        ...body,
        tinNumber: body?.tinNumber || null,
        phone: body?.phone || null,
        notes: body?.notes || null,
        status: "PENDING_PAYMENT",
        paymentReference: null,
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
  if (path.match(/\/api\/registration-requests\/[^/]+\/actions\/(mark-paid|approve|reject)/)) {
    const parts = path.split("/");
    const id = parts[3];
    const action = parts[5];
    const statusMap: Record<string, RegistrationRequest["status"]> = {
      "mark-paid": "PAID",
      approve: "APPROVED",
      reject: "REJECTED"
    };
    mockRegistrationRequests = mockRegistrationRequests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: statusMap[action] ?? request.status,
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
  if (path.includes("/api/dashboard")) return MOCK_DASHBOARD as T;

  // Settings
  if (path.includes("/api/settings")) {
    if (method === "PATCH") {
      mockSettings = { ...mockSettings, ...body };
      if (body?.companySectorId) setMockProfile(body.companySectorId, body.companyName);
    }
    return { ...mockSettings, companySectorId: getMockSectorId(), companyName: getMockCompanyName() } as T;
  }

  // Transactions
  if (path.includes("/api/transactions") && !path.includes("/api/transactions/")) {
    if (method === "POST") {
      const t = { ...body, id: uid(), synced: false, createdAt: new Date().toISOString() } as Transaction;
      mockTransactions = [t, ...mockTransactions];
      return t as T;
    }
    const typeFilter = new URL(`http://x${path}`).searchParams.get("type") ?? "ALL";
    const filtered = typeFilter === "ALL" ? mockTransactions : mockTransactions.filter((t) => t.type === typeFilter);
    if (path.includes("page=") || path.includes("limit=")) return paginate(filtered) as T;
    return filtered as T;
  }
  if (path.match(/\/api\/transactions\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    if (method === "PATCH") {
      mockTransactions = mockTransactions.map((t) => t.id === id ? { ...t, ...body } : t);
      return mockTransactions.find((t) => t.id === id) as T;
    }
    if (method === "DELETE") { mockTransactions = mockTransactions.filter((t) => t.id !== id); return undefined as T; }
  }
  if (path.includes("/api/sync/transactions")) {
    const synced = (body.items as Transaction[]).map((item) => ({ ...item, id: uid(), synced: true, createdAt: new Date().toISOString() } as Transaction));
    mockTransactions = [...synced, ...mockTransactions];
    return { count: synced.length, transactions: synced } as T;
  }
  if (path.includes("/api/export/transactions.csv")) return new Blob(["mock,csv"]) as T;

  // Employees
  if (path.includes("/api/employees") && !path.includes("/api/employees/")) {
    if (method === "POST") {
      const e = { ...body, id: uid(), createdAt: new Date().toISOString() };
      mockEmployees = [e, ...mockEmployees];
      return e as T;
    }
    if (path.includes("page=") || path.includes("limit=")) return paginate(mockEmployees) as T;
    return mockEmployees as T;
  }
  if (path.match(/\/api\/employees\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    if (method === "PATCH") {
      mockEmployees = mockEmployees.map((e) => e.id === id ? { ...e, ...body } : e);
      return mockEmployees.find((e) => e.id === id) as T;
    }
    if (method === "DELETE") { mockEmployees = mockEmployees.filter((e) => e.id !== id); return undefined as T; }
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
      const inv = { id: uid(), invoiceNumber: `INV-${Date.now()}`, ...body, subtotal: body.items.reduce((s: number, i: { quantity: number; unitPrice: number }) => s + i.quantity * i.unitPrice, 0), vatAmount: 0, total: 0, issuedAt: new Date().toISOString() };
      inv.vatAmount = Math.round(inv.subtotal * 0.15);
      inv.total = inv.subtotal + inv.vatAmount;
      mockInvoices = [inv, ...mockInvoices];
      return inv as T;
    }
    return paginate(mockInvoices) as T;
  }

  // Receipts
  if (path.includes("/api/receipts") && !path.includes("/api/receipts/")) {
    if (method === "POST") {
      const rec = { id: uid(), receiptNumber: `REC-${Date.now()}`, ...body, issuedAt: new Date().toISOString() };
      mockReceipts = [rec, ...mockReceipts];
      return rec as T;
    }
    return paginate(mockReceipts) as T;
  }

  // Expense approvals
  if (path.includes("/api/expense-approvals") && !path.match(/\/api\/expense-approvals\/[^/]+\/actions/)) {
    if (method === "POST") {
      const ea = { id: uid(), ...body, requestedById: MOCK_USER.id, approvedById: null, status: "REQUESTED", requestedAt: new Date().toISOString() };
      mockApprovals = [ea, ...mockApprovals];
      return ea as T;
    }
    return paginate(mockApprovals) as T;
  }
  if (path.match(/\/api\/expense-approvals\/[^/]+\/actions\/(approve|reject|pay)/)) {
    const [, id, , action] = path.split("/").slice(2);
    const statusMap: Record<string, string> = { approve: "APPROVED", reject: "REJECTED", pay: "PAID" };
    mockApprovals = mockApprovals.map((a) => a.id === id ? { ...a, status: (statusMap[action] ?? a.status) as import("./types").ApprovalStatus, approvedById: MOCK_USER.id } : a);
    return mockApprovals.find((a) => a.id === id) as T;
  }

  // Payroll
  if (path.includes("/api/payroll-runs") && !path.includes("/api/payroll-runs/")) {
    if (method === "POST") {
      const gross = body.items.reduce((s: number, i: { grossPay: number }) => s + i.grossPay, 0);
      const ded = body.items.reduce((s: number, i: { deductions: number }) => s + i.deductions, 0);
      const pr = { id: uid(), ...body, status: body.status ?? "DRAFT", grossPay: gross, deductions: ded, netPay: gross - ded, createdAt: new Date().toISOString() };
      mockPayroll = [pr, ...mockPayroll];
      return pr as T;
    }
    return paginate(mockPayroll) as T;
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
