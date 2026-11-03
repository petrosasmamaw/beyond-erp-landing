import type {
  ChartAccount,
  Employee,
  ExpenseApproval,
  Invoice,
  PayrollRun,
  Receipt,
  SectorRecord,
  SectorWorkItem,
  Settings,
  Transaction,
  User,
} from "@/types/erp";

export const INITIAL_USER: User = {
  id: "demo-user-1",
  fullName: "Yohannes Getachew",
  email: "yohannes@beyonderp.demo",
  phone: "+251 91 123 4567",
  companyName: "Selam Medical & Trading PLC",
  companyTinNumber: "0012345678",
  companySectorId: "healthcare",
  role: "OWNER",
  permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
  effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
  status: "ACTIVE",
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "INCOME", amount: 85000, description: "Bulk pharmaceuticals distribution", category: "Sales", sectorId: "healthcare", paymentMethod: "Telebirr", vatAmount: 11087, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "t2", type: "INCOME", amount: 42500, description: "Specialized clinical consultation", category: "Services", sectorId: "healthcare", paymentMethod: "CBE Transfer", vatAmount: 5543, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "t3", type: "EXPENSE", amount: 18000, description: "Addis clinic facility rent", category: "Rent", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "t4", type: "INCOME", amount: 33000, description: "Medical courier logistics dispatch", category: "Logistics", sectorId: "transport-logistics", paymentMethod: "Telebirr", vatAmount: 4304, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "t5", type: "EXPENSE", amount: 9500, description: "Ambulance fuel & generator service", category: "Transport", sectorId: "transport-logistics", paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "t6", type: "EXPENSE", amount: 55000, description: "Laboratory test kits & reagents", category: "Inventory", sectorId: "healthcare", paymentMethod: "CBE Transfer", vatAmount: 7174, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: "t7", type: "INCOME", amount: 21000, description: "Outpatient pharmacy dispensing", category: "Sales", sectorId: "healthcare", paymentMethod: "Cash", vatAmount: 2739, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "t8", type: "EXPENSE", amount: 12000, description: "Staff on-call allowances", category: "Payroll", sectorId: null, paymentMethod: "CBE Transfer", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "t9", type: "INCOME", amount: 67500, description: "Corporate wellness retainer", category: "Hospitality", sectorId: "hospitality", paymentMethod: "Telebirr", vatAmount: 8804, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: "t10", type: "EXPENSE", amount: 7800, description: "Addis Ababa municipal utilities", category: "Utilities", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "t11", type: "INCOME", amount: 15000, description: "CME Medical training course fees", category: "Education", sectorId: "education", paymentMethod: "CBE Transfer", vatAmount: 1957, status: "PENDING", synced: false, occurredAt: new Date().toISOString() },
  { id: "t12", type: "EXPENSE", amount: 4500, description: "Administrative printing & stationery", category: "Office", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 11 * 86400000).toISOString() },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: "e1", fullName: "Dr. Abebe Bekele", position: "Chief Medical Officer", department: "Clinical", phone: "+251911000001", email: "abebe@selam.et", salary: 38000, status: "ACTIVE", hiredDate: "2024-01-15" },
  { id: "e2", fullName: "Tigist Haile", position: "Senior Accountant", department: "Finance", phone: "+251911000002", email: "tigist@selam.et", salary: 22000, status: "ACTIVE", hiredDate: "2024-03-01" },
  { id: "e3", fullName: "Dawit Mekonnen", position: "Lead Dispatcher / Fleet", department: "Logistics", phone: "+251911000003", email: "dawit@selam.et", salary: 14000, status: "ACTIVE", hiredDate: "2024-06-10" },
  { id: "e4", fullName: "Hanan Mohammed", position: "Front Desk & Triage", department: "Admin", phone: "+251911000004", email: "hanan@selam.et", salary: 12000, status: "ACTIVE", hiredDate: "2024-08-20" },
  { id: "e5", fullName: "Solomon Girma", position: "Systems & Network Lead", department: "Tech", phone: "+251911000005", email: "solomon@selam.et", salary: 28000, status: "ACTIVE", hiredDate: "2024-11-05" },
  { id: "e6", fullName: "Mekdes Tadesse", position: "Pharmacy Dispenser", department: "Pharmacy", phone: "+251911000006", email: null, salary: 11500, status: "INACTIVE", hiredDate: "2023-12-01" },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv1", invoiceNumber: "INV-2026-001", customerName: "Bole Diagnostics Center", customerPhone: "+251911222333", sectorId: "healthcare",
    items: [{ description: "Clinical laboratory diagnostic panels", quantity: 15, unitPrice: 3200 }],
    subtotal: 48000, vatAmount: 7200, total: 55200, status: "PAID", issuedAt: new Date(Date.now() - 10 * 86400000).toISOString(), dueDate: new Date(Date.now() + 10 * 86400000).toISOString()
  },
  {
    id: "inv2", invoiceNumber: "INV-2026-002", customerName: "Addis Commercial Logistics", customerPhone: "+251911444555", sectorId: "transport-logistics",
    items: [{ description: "Monthly emergency medical standby fleet", quantity: 1, unitPrice: 35000 }],
    subtotal: 35000, vatAmount: 5250, total: 40250, status: "SENT", issuedAt: new Date(Date.now() - 4 * 86400000).toISOString(), dueDate: new Date(Date.now() + 15 * 86400000).toISOString()
  },
  {
    id: "inv3", invoiceNumber: "INV-2026-003", customerName: "Hilton Addis Wellness Club", customerPhone: "+251911666777", sectorId: "hospitality",
    items: [{ description: "Quarterly first aid replenishment", quantity: 4, unitPrice: 4500 }],
    subtotal: 18000, vatAmount: 2700, total: 20700, status: "DRAFT", issuedAt: new Date().toISOString()
  }
];

export const INITIAL_RECEIPTS: Receipt[] = [
  { id: "rec1", receiptNumber: "REC-2026-001", payerName: "Bole Diagnostics Center", amount: 55200, paymentMethod: "Telebirr", issuedAt: new Date(Date.now() - 9 * 86400000).toISOString() }
];

export const INITIAL_APPROVALS: ExpenseApproval[] = [
  { id: "ea1", title: "Digital Ultrasound Calibration Kit", amount: 24500, category: "Equipment", sectorId: "healthcare", requestedById: "e1", status: "REQUESTED", notes: "Annual precision calibration certified by EFDA", requestedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ea2", title: "Backup Generator Diesel Delivery", amount: 16000, category: "Utilities", sectorId: null, requestedById: "e3", approvedById: "demo-user-1", status: "APPROVED", notes: "400 Liters for surgical theater standby", requestedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "ea3", title: "Electronic Health Records Tablet Mounts", amount: 8200, category: "Tech", sectorId: "healthcare", requestedById: "e5", approvedById: "demo-user-1", status: "PAID", notes: "Mounted in Triage Room 1-3", requestedAt: new Date(Date.now() - 14 * 86400000).toISOString() },
];

export const INITIAL_ACCOUNTS: ChartAccount[] = [
  { id: "ca1", code: "1010", name: "Commercial Bank of Ethiopia (CBE)", type: "ASSET", active: true, balance: 342000 },
  { id: "ca2", code: "1020", name: "Telebirr Merchant Main Account", type: "ASSET", active: true, balance: 184500 },
  { id: "ca3", code: "1200", name: "Accounts Receivable (Trade)", type: "ASSET", active: true, balance: 60950 },
  { id: "ca4", code: "2010", name: "Trade Payables & Creditors", type: "LIABILITY", active: true, balance: 45000 },
  { id: "ca5", code: "2100", name: "VAT Payable (15% ERCA Schedule)", type: "LIABILITY", active: true, balance: 39600 },
  { id: "ca6", code: "3010", name: "Paid-in Share Capital", type: "EQUITY", active: true, balance: 350000 },
  { id: "ca7", code: "4010", name: "Sales & Clinical Services Revenue", type: "INCOME", active: true, balance: 264000 },
  { id: "ca8", code: "5010", name: "Salaries & Staff Deductions", type: "EXPENSE", active: true, balance: 125500 },
];

export const INITIAL_PAYROLL: PayrollRun[] = [
  {
    id: "pr1",
    period: "2026-02",
    status: "PAID",
    grossPay: 125500,
    deductions: 9412,
    netPay: 116088,
    items: INITIAL_EMPLOYEES.map((e) => ({
      employeeId: e.id,
      employeeName: e.fullName,
      grossPay: e.salary,
      deductions: Math.round(e.salary * 0.075),
    })),
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  }
];

export const INITIAL_SETTINGS: Settings = {
  companyName: "Selam Medical & Trading PLC",
  tinNumber: "0012345678",
  companySectorId: "healthcare",
  businessType: "PLC",
  language: "English",
  currency: "ETB",
  taxRate: 15,
  telebirrEnabled: true,
  cbeEnabled: true,
  ehmisEnabled: true,
  emailEnabled: true,
  autoSync: true,
  vatRegistered: true,
};

export const INITIAL_WORK_ITEMS: SectorWorkItem[] = [
  { id: "wi1", sectorId: "healthcare", title: "EFDA annual clinical audit compliance review", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-20", assignedToId: "e1", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "wi2", sectorId: "healthcare", title: "Triage digital queue display tablet setup", status: "DONE", priority: "MEDIUM", dueDate: "2026-11-05", assignedToId: "e5", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "wi3", sectorId: "healthcare", title: "Emergency pharmaceutical replenishment batch", status: "TODO", priority: "URGENT", dueDate: "2026-11-12", assignedToId: "e6", createdAt: new Date().toISOString() },
];

export const INITIAL_SECTOR_RECORDS: SectorRecord[] = [
  { id: "sr1", sectorId: "healthcare", recordType: "Patient", title: "Aster Mengistu (MRN-9021)", ownerName: "Dr. Abebe Bekele", status: "ACTIVE", value: 4500, metadata: { triage: "OPD Normal", bloodGroup: "O+" }, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "sr2", sectorId: "healthcare", recordType: "Patient", title: "Kassahun Desta (MRN-9022)", ownerName: "Dr. Abebe Bekele", status: "ACTIVE", value: 12000, metadata: { triage: "Surgical Observation", bloodGroup: "A+" }, createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
];
