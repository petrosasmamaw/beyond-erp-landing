import type {
  ChartAccount,
  Employee,
  ExpenseApproval,
  Invoice,
  PayrollRun,
  Receipt,
  SectorMeta,
  SectorRecord,
  SectorWorkItem,
  Settings,
  Transaction,
  User,
} from "@/types/erp";

export const SECTORS_CATALOG: SectorMeta[] = [
  {
    id: "retail-trading",
    name: "Retail & Trading",
    shortName: "Retail",
    defaultCompanyName: "Merkato Wholesale & Supermarket PLC",
    defaultTin: "0012345678",
    icon: "fa-solid fa-store",
    color: "#f59e0b",
    lightColor: "#fffbeb",
    textColor: "#b45309",
    description: "POS checkout, barcode inventory, suppliers, and VAT invoices for Ethiopian merchants and wholesalers.",
    keyModules: ["POS Checkout", "Inventory", "Products", "Customers", "Suppliers", "Sales Reports"],
    navItems: [
      { key: "pos", label: "POS Checkout", icon: "fa-solid fa-cash-register" },
      { key: "inventory", label: "Inventory", icon: "fa-solid fa-boxes-stacked" },
      { key: "products", label: "Products", icon: "fa-solid fa-tags" },
      { key: "customers", label: "Customers", icon: "fa-solid fa-users" },
      { key: "suppliers", label: "Suppliers", icon: "fa-solid fa-truck-field" },
      { key: "sales-reports", label: "Sales Reports", icon: "fa-solid fa-chart-line" }
    ]
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Processing",
    shortName: "Manufacturing",
    defaultCompanyName: "Hawassa Industrial Garments & Textile PLC",
    defaultTin: "0023456789",
    icon: "fa-solid fa-industry",
    color: "#3b82f6",
    lightColor: "#eff6ff",
    textColor: "#1d4ed8",
    description: "Bill of materials (BOM), production batch tracking, machinery maintenance, quality control, and shift management.",
    keyModules: ["BOM Costing", "Production Orders", "Quality Results", "Machinery", "Shifts", "Finished Goods"],
    navItems: [
      { key: "bom", label: "BOM Costing", icon: "fa-solid fa-diagram-project" },
      { key: "production", label: "Production Orders", icon: "fa-solid fa-clipboard-list" },
      { key: "quality", label: "Quality Results", icon: "fa-solid fa-clipboard-check" },
      { key: "machinery", label: "Machinery", icon: "fa-solid fa-gears" },
      { key: "shifts", label: "Shifts", icon: "fa-solid fa-clock" },
      { key: "finished-goods", label: "Finished Goods", icon: "fa-solid fa-box" }
    ]
  },
  {
    id: "agriculture",
    name: "Agriculture & Farming",
    shortName: "Agriculture",
    defaultCompanyName: "Rift Valley Coffee & Horticulture Farms PLC",
    defaultTin: "0034567890",
    icon: "fa-solid fa-seedling",
    color: "#10b981",
    lightColor: "#f0fdf4",
    textColor: "#047857",
    description: "Crop cycles, harvest yields, livestock tracking, warehouse storage, cooperative distribution, and weather logs.",
    keyModules: ["Crop Cycles", "Livestock Events", "Input Distribution", "Harvest Yields", "Warehouses", "Cooperatives"],
    navItems: [
      { key: "crop-cycles", label: "Crop Cycles", icon: "fa-solid fa-seedling" },
      { key: "livestock", label: "Livestock Events", icon: "fa-solid fa-leaf" },
      { key: "inputs", label: "Input Distribution", icon: "fa-solid fa-sack-dollar" },
      { key: "harvest", label: "Harvest Yields", icon: "fa-solid fa-wheat-awn" },
      { key: "warehouses", label: "Warehouses", icon: "fa-solid fa-warehouse" },
      { key: "cooperatives", label: "Cooperatives", icon: "fa-solid fa-people-group" }
    ]
  },
  {
    id: "construction",
    name: "Construction & Contracting",
    shortName: "Construction",
    defaultCompanyName: "Abyssinia Civil Engineering & Contracting PLC",
    defaultTin: "0045678901",
    icon: "fa-solid fa-trowel-bricks",
    color: "#ea580c",
    lightColor: "#fff7ed",
    textColor: "#c2410c",
    description: "Project budget tracking, daily site progress reports, plant machinery hours, subcontractor contracts, and safety audits.",
    keyModules: ["Project Budgets", "Site Reports", "Subcontractors", "Equipment", "Safety Log", "Client Billing"],
    navItems: [
      { key: "projects", label: "Project Budgets", icon: "fa-solid fa-chart-gantt" },
      { key: "site-reports", label: "Site Reports", icon: "fa-solid fa-clipboard-list" },
      { key: "subcontractors", label: "Subcontractors", icon: "fa-solid fa-file-contract" },
      { key: "equipment", label: "Equipment", icon: "fa-solid fa-hammer" },
      { key: "safety", label: "Safety Log", icon: "fa-solid fa-shield-halved" },
      { key: "client-billing", label: "Client Billing", icon: "fa-solid fa-file-invoice-dollar" }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare & Specialized Clinics",
    shortName: "Healthcare",
    defaultCompanyName: "Selam General Hospital & Specialized Clinic",
    defaultTin: "0056789012",
    icon: "fa-solid fa-heart-pulse",
    color: "#dc2626",
    lightColor: "#fef2f2",
    textColor: "#b91c1c",
    description: "Electronic Medical Records (EMR), OPD queues, inpatient beds, pharmacy dispensary, laboratory orders, and EHMIS reporting.",
    keyModules: ["Patients EMR", "Queue & OPD", "Appointments", "IPD & Beds", "Pharmacy", "Prescriptions", "Lab & Radiology", "Billing & Claims", "EHMIS Reports"],
    navItems: [
      { key: "patients", label: "Patients", icon: "fa-solid fa-user-doctor" },
      { key: "queue", label: "Queue & OPD", icon: "fa-solid fa-people-line" },
      { key: "appointments", label: "Appointments", icon: "fa-solid fa-calendar-check" },
      { key: "inpatient", label: "IPD & Beds", icon: "fa-solid fa-bed-pulse" },
      { key: "pharmacy", label: "Pharmacy", icon: "fa-solid fa-pills" },
      { key: "prescriptions", label: "Prescriptions", icon: "fa-solid fa-prescription" },
      { key: "lab", label: "Lab & Radiology", icon: "fa-solid fa-vial-virus" },
      { key: "billing", label: "Billing & Claims", icon: "fa-solid fa-receipt" }
    ]
  },
  {
    id: "education",
    name: "Education & Schools",
    shortName: "Education",
    defaultCompanyName: "Horizon International Academy",
    defaultTin: "0067890123",
    icon: "fa-solid fa-graduation-cap",
    color: "#8b5cf6",
    lightColor: "#f5f3ff",
    textColor: "#6d28d9",
    description: "Student enrollments, attendance rosters, term grade books, class schedules, tuition payment tracking, and national exams.",
    keyModules: ["Students", "Attendance", "Grade Books", "Timetable", "Fees", "Exams"],
    navItems: [
      { key: "students", label: "Students", icon: "fa-solid fa-user-graduate" },
      { key: "attendance", label: "Attendance", icon: "fa-solid fa-clipboard-user" },
      { key: "grades", label: "Grade Books", icon: "fa-solid fa-clipboard-check" },
      { key: "timetable", label: "Timetable", icon: "fa-solid fa-calendar-days" },
      { key: "fees", label: "Fees", icon: "fa-solid fa-money-check" },
      { key: "exams", label: "Exams", icon: "fa-solid fa-certificate" }
    ]
  },
  {
    id: "hospitality",
    name: "Hotel & Hospitality",
    shortName: "Hospitality",
    defaultCompanyName: "Kuriftu Lakeside Resort & Conference Center",
    defaultTin: "0078901234",
    icon: "fa-solid fa-hotel",
    color: "#7c3aed",
    lightColor: "#ede9fe",
    textColor: "#6d28d9",
    description: "Room booking engine, guest folios, restaurant point of sale, housekeeping status, banquet events, and concierge services.",
    keyModules: ["Rooms", "Bookings", "Restaurant F&B", "Housekeeping", "Guests", "Events"],
    navItems: [
      { key: "rooms", label: "Rooms", icon: "fa-solid fa-door-open" },
      { key: "bookings", label: "Bookings", icon: "fa-solid fa-calendar-check" },
      { key: "restaurant", label: "Restaurant", icon: "fa-solid fa-utensils" },
      { key: "housekeeping", label: "Housekeeping", icon: "fa-solid fa-broom" },
      { key: "guests", label: "Guests", icon: "fa-solid fa-users" },
      { key: "events", label: "Events", icon: "fa-solid fa-champagne-glasses" }
    ]
  },
  {
    id: "transport-logistics",
    name: "Transport & Logistics",
    shortName: "Logistics",
    defaultCompanyName: "Ethio-Djibouti Corridor Logistics & Freight PLC",
    defaultTin: "0089012345",
    icon: "fa-solid fa-truck-moving",
    color: "#b45309",
    lightColor: "#fef3c7",
    textColor: "#92400e",
    description: "Fleet prime mover management, cargo waybills, highway trip manifests, driver rosters, fuel consumption, and vehicle maintenance.",
    keyModules: ["Fleet", "Waybills", "Routes", "Drivers", "Fuel Logs", "Maintenance"],
    navItems: [
      { key: "fleet", label: "Fleet", icon: "fa-solid fa-truck" },
      { key: "waybills", label: "Waybills", icon: "fa-solid fa-clipboard-list" },
      { key: "routes", label: "Routes", icon: "fa-solid fa-route" },
      { key: "drivers", label: "Drivers", icon: "fa-solid fa-user-tie" },
      { key: "fuel", label: "Fuel Logs", icon: "fa-solid fa-gas-pump" },
      { key: "maintenance", label: "Maintenance", icon: "fa-solid fa-wrench" }
    ]
  },
  {
    id: "finance-banking",
    name: "Microfinance & SACCOs",
    shortName: "Finance",
    defaultCompanyName: "Oromia Savings & Credit Cooperative (SACCO)",
    defaultTin: "0090123456",
    icon: "fa-solid fa-building-columns",
    color: "#0284c7",
    lightColor: "#f0f9ff",
    textColor: "#0369a1",
    description: "General ledger, member savings passbooks, microloan disbursement schedules, approval workflows, and NBE compliance audits.",
    keyModules: ["General Ledger", "Loan Schedules", "Reconciliations", "Approvals", "Payroll", "Audit Cases"],
    navItems: [
      { key: "ledger", label: "General Ledger", icon: "fa-solid fa-book" },
      { key: "loans", label: "Loan Schedules", icon: "fa-solid fa-hand-holding-dollar" },
      { key: "reconciliations", label: "Reconciliations", icon: "fa-solid fa-right-left" },
      { key: "approvals", label: "Approvals", icon: "fa-solid fa-circle-check" },
      { key: "payroll", label: "Payroll", icon: "fa-solid fa-money-check-dollar" },
      { key: "audit", label: "Audit Cases", icon: "fa-solid fa-shield-halved" }
    ]
  },
  {
    id: "real-estate",
    name: "Real Estate & Property",
    shortName: "Real Estate",
    defaultCompanyName: "Noah Commercial & Residential Real Estate PLC",
    defaultTin: "0001234567",
    icon: "fa-solid fa-city",
    color: "#059669",
    lightColor: "#ecfdf5",
    textColor: "#047857",
    description: "Properties portfolio, tenant lease agreements, monthly rent collection schedules, maintenance tickets, and prospective viewings.",
    keyModules: ["Properties", "Tenants", "Leases", "Rent Schedules", "Maintenance", "Viewings"],
    navItems: [
      { key: "properties", label: "Properties", icon: "fa-solid fa-building" },
      { key: "tenants", label: "Tenants", icon: "fa-solid fa-users" },
      { key: "leases", label: "Leases", icon: "fa-solid fa-file-signature" },
      { key: "rent", label: "Rent Schedules", icon: "fa-solid fa-key" },
      { key: "maintenance", label: "Maintenance", icon: "fa-solid fa-screwdriver-wrench" },
      { key: "viewings", label: "Viewings", icon: "fa-solid fa-calendar-check" }
    ]
  },
  {
    id: "ngo-development",
    name: "NGO & Development Programs",
    shortName: "NGO",
    defaultCompanyName: "Hope for Children & Community Development Ethiopia",
    defaultTin: "0011223344",
    icon: "fa-solid fa-hand-holding-heart",
    color: "#e11d48",
    lightColor: "#fff1f2",
    textColor: "#be123c",
    description: "Donor relationship tracking, grant funding allocations, community beneficiaries, donor-compliant procurement, and M&E reports.",
    keyModules: ["Donors", "Grants", "Beneficiaries", "Procurement", "Field Monitoring", "Impact"],
    navItems: [
      { key: "donors", label: "Donors", icon: "fa-solid fa-hand-holding-heart" },
      { key: "grants", label: "Grants", icon: "fa-solid fa-file-circle-check" },
      { key: "beneficiaries", label: "Beneficiaries", icon: "fa-solid fa-users" },
      { key: "procurement", label: "Procurement", icon: "fa-solid fa-cart-shopping" },
      { key: "monitoring", label: "Field Monitoring", icon: "fa-solid fa-location-dot" },
      { key: "impact", label: "Impact", icon: "fa-solid fa-chart-pie" }
    ]
  },
  {
    id: "government-services",
    name: "Government Services",
    shortName: "Government",
    defaultCompanyName: "Addis Ababa Sub-City Public Services & Citizen Bureau",
    defaultTin: "0022334455",
    icon: "fa-solid fa-landmark-dome",
    color: "#64748b",
    lightColor: "#f8fafc",
    textColor: "#334155",
    description: "Municipal trade permits, citizen registry, service case workflows, official government revenue receipts, and counter queues.",
    keyModules: ["Permits", "Citizens", "Service Cases", "Revenue", "Documents", "Counters"],
    navItems: [
      { key: "permits", label: "Permits", icon: "fa-solid fa-file-contract" },
      { key: "citizens", label: "Citizens", icon: "fa-solid fa-users" },
      { key: "cases", label: "Service Cases", icon: "fa-solid fa-list-check" },
      { key: "revenue", label: "Revenue", icon: "fa-solid fa-coins" },
      { key: "documents", label: "Documents", icon: "fa-solid fa-folder-open" },
      { key: "counters", label: "Counters", icon: "fa-solid fa-building-user" }
    ]
  }
];

export const INITIAL_USER: User = {
  id: "demo-user-1",
  fullName: "Yohannes Getachew",
  email: "yohannes@beyonderp.demo",
  phone: "+251 91 123 4567",
  companyName: "Merkato Wholesale & Supermarket PLC",
  companyTinNumber: "0012345678",
  companySectorId: "retail-trading",
  role: "OWNER",
  permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
  effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
  status: "ACTIVE",
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "INCOME", amount: 85000, description: "Bulk merchandise distribution", category: "Sales", sectorId: "retail-trading", paymentMethod: "Telebirr", vatAmount: 11087, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "t2", type: "INCOME", amount: 42500, description: "Commercial supply contract batch", category: "Services", sectorId: "retail-trading", paymentMethod: "CBE Transfer", vatAmount: 5543, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "t3", type: "EXPENSE", amount: 18000, description: "Warehouse facility rental fee", category: "Rent", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "t4", type: "INCOME", amount: 33000, description: "Corridor freight dispatch consignment", category: "Logistics", sectorId: "transport-logistics", paymentMethod: "Telebirr", vatAmount: 4304, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "t5", type: "EXPENSE", amount: 9500, description: "Delivery fleet diesel & generator service", category: "Transport", sectorId: "transport-logistics", paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "t6", type: "EXPENSE", amount: 55000, description: "Supplier replenishment stock order", category: "Inventory", sectorId: "retail-trading", paymentMethod: "CBE Transfer", vatAmount: 7174, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: "t7", type: "INCOME", amount: 21000, description: "POS counter register receipts", category: "Sales", sectorId: "retail-trading", paymentMethod: "Cash", vatAmount: 2739, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "t8", type: "EXPENSE", amount: 12000, description: "Staff on-call duty & overtime allowance", category: "Payroll", sectorId: null, paymentMethod: "CBE Transfer", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "t9", type: "INCOME", amount: 67500, description: "Corporate hospitality client retainer", category: "Hospitality", sectorId: "hospitality", paymentMethod: "Telebirr", vatAmount: 8804, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: "t10", type: "EXPENSE", amount: 7800, description: "Addis municipal power & internet bill", category: "Utilities", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "t11", type: "INCOME", amount: 15000, description: "Training workshop registrations", category: "Education", sectorId: "education", paymentMethod: "CBE Transfer", vatAmount: 1957, status: "PENDING", synced: false, occurredAt: new Date().toISOString() },
  { id: "t12", type: "EXPENSE", amount: 4500, description: "Stationery & thermal receipt paper", category: "Office", sectorId: null, paymentMethod: "Cash", vatAmount: 0, status: "COMPLETED", synced: true, occurredAt: new Date(Date.now() - 11 * 86400000).toISOString() },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: "e1", fullName: "Abebe Bekele", position: "Operations Manager", department: "Operations", phone: "+251911000001", email: "abebe@merkato.et", salary: 32000, status: "ACTIVE", hiredDate: "2024-01-15" },
  { id: "e2", fullName: "Tigist Haile", position: "Senior Accountant", department: "Finance", phone: "+251911000002", email: "tigist@merkato.et", salary: 24000, status: "ACTIVE", hiredDate: "2024-03-01" },
  { id: "e3", fullName: "Dawit Mekonnen", position: "Inventory & Dispatch Lead", department: "Logistics", phone: "+251911000003", email: "dawit@merkato.et", salary: 16000, status: "ACTIVE", hiredDate: "2024-06-10" },
  { id: "e4", fullName: "Hanan Mohammed", position: "Store Cashier & Customer Service", department: "Retail", phone: "+251911000004", email: "hanan@merkato.et", salary: 13000, status: "ACTIVE", hiredDate: "2024-08-20" },
  { id: "e5", fullName: "Solomon Girma", position: "IT & POS Systems Lead", department: "Tech", phone: "+251911000005", email: "solomon@merkato.et", salary: 28000, status: "ACTIVE", hiredDate: "2024-11-05" },
  { id: "e6", fullName: "Mekdes Tadesse", position: "Assistant Cashier", department: "Retail", phone: "+251911000006", email: null, salary: 11000, status: "INACTIVE", hiredDate: "2023-12-01" },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv1", invoiceNumber: "INV-2026-001", customerName: "Bole Trading Center", customerPhone: "+251911222333", sectorId: "retail-trading",
    items: [{ description: "Bulk supermarket commodities batch", quantity: 20, unitPrice: 2400 }],
    subtotal: 48000, vatAmount: 7200, total: 55200, status: "PAID", issuedAt: new Date(Date.now() - 10 * 86400000).toISOString(), dueDate: new Date(Date.now() + 10 * 86400000).toISOString()
  },
  {
    id: "inv2", invoiceNumber: "INV-2026-002", customerName: "Addis Freight & Cargo Services", customerPhone: "+251911444555", sectorId: "transport-logistics",
    items: [{ description: "Monthly corridor logistics contract", quantity: 1, unitPrice: 35000 }],
    subtotal: 35000, vatAmount: 5250, total: 40250, status: "SENT", issuedAt: new Date(Date.now() - 4 * 86400000).toISOString(), dueDate: new Date(Date.now() + 15 * 86400000).toISOString()
  },
  {
    id: "inv3", invoiceNumber: "INV-2026-003", customerName: "Kuriftu Resort & Hospitality Group", customerPhone: "+251911666777", sectorId: "hospitality",
    items: [{ description: "Catering & kitchen bulk replenishment", quantity: 6, unitPrice: 3000 }],
    subtotal: 18000, vatAmount: 2700, total: 20700, status: "DRAFT", issuedAt: new Date().toISOString()
  }
];

export const INITIAL_RECEIPTS: Receipt[] = [
  { id: "rec1", receiptNumber: "REC-2026-001", payerName: "Bole Trading Center", amount: 55200, paymentMethod: "Telebirr", issuedAt: new Date(Date.now() - 9 * 86400000).toISOString() }
];

export const INITIAL_APPROVALS: ExpenseApproval[] = [
  { id: "ea1", title: "Commercial POS Barcode Laser Scanners", amount: 24500, category: "Equipment", sectorId: "retail-trading", requestedById: "e1", status: "REQUESTED", notes: "Omnidirectional barcode scanners for checkouts 1-4", requestedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ea2", title: "Emergency Power Generator Diesel Delivery", amount: 16000, category: "Utilities", sectorId: null, requestedById: "e3", approvedById: "demo-user-1", status: "APPROVED", notes: "400 Liters fuel replenishment for cold store units", requestedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "ea3", title: "Cloud Backup & Thermal Label Printers", amount: 8200, category: "Tech", sectorId: "retail-trading", requestedById: "e5", approvedById: "demo-user-1", status: "PAID", notes: "Installed at main stock warehouse counter", requestedAt: new Date(Date.now() - 14 * 86400000).toISOString() },
];

export const INITIAL_ACCOUNTS: ChartAccount[] = [
  { id: "ca1", code: "1010", name: "Commercial Bank of Ethiopia (CBE)", type: "ASSET", active: true, balance: 342000 },
  { id: "ca2", code: "1020", name: "Telebirr Merchant Main Account", type: "ASSET", active: true, balance: 184500 },
  { id: "ca3", code: "1200", name: "Accounts Receivable (Trade)", type: "ASSET", active: true, balance: 60950 },
  { id: "ca4", code: "2010", name: "Trade Payables & Creditors", type: "LIABILITY", active: true, balance: 45000 },
  { id: "ca5", code: "2100", name: "VAT Payable (15% ERCA Schedule)", type: "LIABILITY", active: true, balance: 39600 },
  { id: "ca6", code: "3010", name: "Paid-in Share Capital", type: "EQUITY", active: true, balance: 350000 },
  { id: "ca7", code: "4010", name: "Sales & Operating Revenue", type: "INCOME", active: true, balance: 264000 },
  { id: "ca8", code: "5010", name: "Salaries & Staff Deductions", type: "EXPENSE", active: true, balance: 124000 },
];

export const INITIAL_PAYROLL: PayrollRun[] = [
  {
    id: "pr1",
    period: "2026-02",
    status: "PAID",
    grossPay: 124000,
    deductions: 9300,
    netPay: 114700,
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
  companyName: "Merkato Wholesale & Supermarket PLC",
  tinNumber: "0012345678",
  companySectorId: "retail-trading",
  businessType: "PLC",
  language: "English",
  currency: "ETB",
  taxRate: 15,
  telebirrEnabled: true,
  cbeEnabled: true,
  ehmisEnabled: false,
  emailEnabled: true,
  autoSync: true,
  vatRegistered: true,
};

export const INITIAL_SECTOR_RECORDS: Record<string, SectorRecord[]> = {
  "retail-trading": [
    { id: "sr-ret-1", sectorId: "retail-trading", recordType: "Product", title: "Samsung Galaxy A15 (128GB)", ownerName: "Abebe Bekele", status: "ACTIVE", value: 12500, metadata: { sku: "SAM-A15", stock: 45, reorder: 10 }, createdAt: new Date().toISOString() },
    { id: "sr-ret-2", sectorId: "retail-trading", recordType: "Product", title: "Magna Pure Cooking Oil (5L)", ownerName: null, status: "ACTIVE", value: 850, metadata: { sku: "OIL-5L", stock: 120, reorder: 25 }, createdAt: new Date().toISOString() }
  ],
  "manufacturing": [
    { id: "sr-mfg-1", sectorId: "manufacturing", recordType: "Production Order", title: "Batch 482: 5,000 Cotton Polo Shirts", ownerName: "Engineer Kidane", status: "ACTIVE", value: 250000, metadata: { line: "Textile Unit 2", progress: "65%" }, createdAt: new Date().toISOString() },
    { id: "sr-mfg-2", sectorId: "manufacturing", recordType: "Machinery Asset", title: "Juki Industrial Sewing Machine Bank #4", ownerName: "Maintenance Team", status: "ACTIVE", value: 85000, metadata: { hours: 1420, nextService: "2026-12-01" }, createdAt: new Date().toISOString() }
  ],
  "agriculture": [
    { id: "sr-agr-1", sectorId: "agriculture", recordType: "Crop Harvest", title: "Block A - Grade 1 Washed Yirgacheffe Coffee", ownerName: "Farmer Desta", status: "ACTIVE", value: 480000, metadata: { hectares: 24, yieldQuintals: 160 }, createdAt: new Date().toISOString() },
    { id: "sr-agr-2", sectorId: "agriculture", recordType: "Livestock", title: "Friesian Dairy Herd - 48 Milking Cows", ownerName: "Dr. Almaz", status: "ACTIVE", value: 720000, metadata: { dailyYieldLiters: 960, vaccinated: true }, createdAt: new Date().toISOString() }
  ],
  "construction": [
    { id: "sr-cns-1", sectorId: "construction", recordType: "Project Site", title: "Bole Commercial Center Phase 2 (G+12)", ownerName: "Resident Eng. Dawit", status: "ACTIVE", value: 14500000, metadata: { completion: "42%", boqItems: 148 }, createdAt: new Date().toISOString() },
    { id: "sr-cns-2", sectorId: "construction", recordType: "Heavy Equipment", title: "CAT 320D Hydraulic Excavator", ownerName: "Equipment Mgr", status: "ACTIVE", value: 4800000, metadata: { fuelRate: "18L/hr", site: "Bole Site" }, createdAt: new Date().toISOString() }
  ],
  "healthcare": [
    { id: "sr-hc-1", sectorId: "healthcare", recordType: "Patient EMR", title: "MRN-00124: Abebe Girma (Hypertension Follow-up)", ownerName: "Dr. Tigist Alemu", status: "ACTIVE", value: 850, metadata: { age: 45, bloodGroup: "A+", triage: "Green" }, createdAt: new Date().toISOString() },
    { id: "sr-hc-2", sectorId: "healthcare", recordType: "Pharmacy Batch", title: "Amoxicillin 500mg Caps (Batch AMX-2026)", ownerName: "Chief Pharmacist", status: "ACTIVE", value: 34000, metadata: { stockUnits: 1200, expDate: "2027-08-30" }, createdAt: new Date().toISOString() }
  ],
  "education": [
    { id: "sr-edu-1", sectorId: "education", recordType: "Student", title: "STU-2026-084: Meron Hailu (Grade 11 Natural)", ownerName: "Homeroom Teacher", status: "ACTIVE", value: 8500, metadata: { gpa: 3.82, feeStatus: "PAID" }, createdAt: new Date().toISOString() },
    { id: "sr-edu-2", sectorId: "education", recordType: "Academic Timetable", title: "Semester 2 Science & Math Master Schedule", ownerName: "Dean of Studies", status: "ACTIVE", value: null, metadata: { classes: 18, labSessions: 6 }, createdAt: new Date().toISOString() }
  ],
  "hospitality": [
    { id: "sr-hosp-1", sectorId: "hospitality", recordType: "Room Reservation", title: "Suite 302: Ambassador Delegations (4 Nights)", ownerName: "Front Desk Mgr", status: "ACTIVE", value: 28000, metadata: { checkIn: "Today", guests: 2, mealPlan: "Full Board" }, createdAt: new Date().toISOString() },
    { id: "sr-hosp-2", sectorId: "hospitality", recordType: "Banquet Event", title: "UN Economic Forum Annual Gala Dinner", ownerName: "Events Coordinator", status: "ACTIVE", value: 165000, metadata: { guests: 250, hall: "Grand Ballroom" }, createdAt: new Date().toISOString() }
  ],
  "transport-logistics": [
    { id: "sr-trn-1", sectorId: "transport-logistics", recordType: "Fleet Vehicle", title: "Volvo FH16 Prime Mover (Plate AA-3-48192)", ownerName: "Fleet Lead Dawit", status: "ACTIVE", value: 5200000, metadata: { route: "Addis - Djibouti", status: "In Transit" }, createdAt: new Date().toISOString() },
    { id: "sr-trn-2", sectorId: "transport-logistics", recordType: "Waybill", title: "WB-2026-8812: 40ft Container Medical Equipment", ownerName: "Customs Agent", status: "ACTIVE", value: 95000, metadata: { customsStatus: "Cleared Mojo Dry Port" }, createdAt: new Date().toISOString() }
  ],
  "finance-banking": [
    { id: "sr-fin-1", sectorId: "finance-banking", recordType: "Microloan", title: "LN-9821: Bole Women Weavers Cooperative Loan", ownerName: "Credit Officer Lemma", status: "ACTIVE", value: 150000, metadata: { rate: "9%", tenor: "18 Months", status: "Current" }, createdAt: new Date().toISOString() },
    { id: "sr-fin-2", sectorId: "finance-banking", recordType: "Member Savings", title: "Member #4820: Tigist Haile Savings Account", ownerName: "Teller 1", status: "ACTIVE", value: 42500, metadata: { dividendAccrued: 2400 }, createdAt: new Date().toISOString() }
  ],
  "real-estate": [
    { id: "sr-re-1", sectorId: "real-estate", recordType: "Property Lease", title: "Noah Plaza Suite 402 - Commercial Tech Office", ownerName: "Property Mgr", status: "ACTIVE", value: 38000, metadata: { sqm: 140, tenant: "EthioCloud Technologies" }, createdAt: new Date().toISOString() },
    { id: "sr-re-2", sectorId: "real-estate", recordType: "Maintenance Ticket", title: "HVAC Central Chiller Annual Overhaul", ownerName: "Facilities Team", status: "PENDING", value: 18500, metadata: { priority: "High", building: "Bole Tower" }, createdAt: new Date().toISOString() }
  ],
  "ngo-development": [
    { id: "sr-ngo-1", sectorId: "ngo-development", recordType: "Grant Allocation", title: "USAID Clean Water Project Hawassa Phase 3", ownerName: "Grant Director Biruk", status: "ACTIVE", value: 1850000, metadata: { disbursed: "60%", targetHouseholds: 3500 }, createdAt: new Date().toISOString() },
    { id: "sr-ngo-2", sectorId: "ngo-development", recordType: "Community Aid", title: "Distribution: 800 School Nutrition Packs", ownerName: "Field Officer", status: "ACTIVE", value: 120000, metadata: { location: "Sidama Region" }, createdAt: new Date().toISOString() }
  ],
  "government-services": [
    { id: "sr-gov-1", sectorId: "government-services", recordType: "Trade License", title: "TL-2026-9941: Commercial Import/Export Renewal", ownerName: "Permit Desk Officer", status: "ACTIVE", value: 4500, metadata: { applicant: "Abyssinia Trading", validUntil: "2027-09-10" }, createdAt: new Date().toISOString() },
    { id: "sr-gov-2", sectorId: "government-services", recordType: "Service Case", title: "CASE-481: Title Deed Verification Request", ownerName: "Land Administration", status: "ACTIVE", value: 1200, metadata: { queueNo: "B-24", slaHours: 48 }, createdAt: new Date().toISOString() }
  ]
};

export const INITIAL_WORK_ITEMS_BY_SECTOR: Record<string, SectorWorkItem[]> = {
  "retail-trading": [
    { id: "wi-ret-1", sectorId: "retail-trading", title: "Weekly barcode inventory cycle count", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-20", assignedToId: "e3", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "wi-ret-2", sectorId: "retail-trading", title: "Update wholesale price tier Q2", status: "TODO", priority: "MEDIUM", dueDate: "2026-11-25", assignedToId: "e1", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: "wi-ret-3", sectorId: "retail-trading", title: "Reconcile Telebirr merchant daily batch", status: "DONE", priority: "URGENT", dueDate: "2026-11-03", assignedToId: "e2", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() }
  ],
  "manufacturing": [
    { id: "wi-mfg-1", sectorId: "manufacturing", title: "BOM costing audit for garment export line", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-22", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-mfg-2", sectorId: "manufacturing", title: "Preventive maintenance on sewing units #1-6", status: "TODO", priority: "MEDIUM", dueDate: "2026-11-28", assignedToId: "e3", createdAt: new Date().toISOString() }
  ],
  "agriculture": [
    { id: "wi-agr-1", sectorId: "agriculture", title: "Yirgacheffe coffee cherry harvest grading", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-18", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-agr-2", sectorId: "agriculture", title: "Distribute organic fertilizer to cooperative sector 4", status: "DONE", priority: "MEDIUM", dueDate: "2026-11-02", assignedToId: "e3", createdAt: new Date().toISOString() }
  ],
  "construction": [
    { id: "wi-cns-1", sectorId: "construction", title: "Daily concrete pouring log - Bole Site", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-15", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-cns-2", sectorId: "construction", title: "Subcontractor interim valuation sign-off", status: "TODO", priority: "URGENT", dueDate: "2026-11-19", assignedToId: "e2", createdAt: new Date().toISOString() }
  ],
  "healthcare": [
    { id: "wi-hc-1", sectorId: "healthcare", title: "EFDA annual clinical audit compliance review", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-20", assignedToId: "e1", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "wi-hc-2", sectorId: "healthcare", title: "Triage digital queue display tablet setup", status: "DONE", priority: "MEDIUM", dueDate: "2026-11-05", assignedToId: "e5", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "wi-hc-3", sectorId: "healthcare", title: "Emergency pharmaceutical replenishment batch", status: "TODO", priority: "URGENT", dueDate: "2026-11-12", assignedToId: "e6", createdAt: new Date().toISOString() }
  ],
  "education": [
    { id: "wi-edu-1", sectorId: "education", title: "Semester 2 grade report cards compilation", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-25", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-edu-2", sectorId: "education", title: "Tuition installment notices dispatch", status: "TODO", priority: "MEDIUM", dueDate: "2026-11-30", assignedToId: "e2", createdAt: new Date().toISOString() }
  ],
  "hospitality": [
    { id: "wi-hosp-1", sectorId: "hospitality", title: "VIP Ambassador Suite preparation & inspection", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-10", assignedToId: "e4", createdAt: new Date().toISOString() },
    { id: "wi-hosp-2", sectorId: "hospitality", title: "Grand Ballroom audio-visual system testing", status: "DONE", priority: "MEDIUM", dueDate: "2026-11-04", assignedToId: "e5", createdAt: new Date().toISOString() }
  ],
  "transport-logistics": [
    { id: "wi-trn-1", sectorId: "transport-logistics", title: "Corridor convoy dispatch clearance AA-Djibouti", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-12", assignedToId: "e3", createdAt: new Date().toISOString() },
    { id: "wi-trn-2", sectorId: "transport-logistics", title: "Fuel consumption reconciliation for Mojo port trucks", status: "TODO", priority: "MEDIUM", dueDate: "2026-11-17", assignedToId: "e2", createdAt: new Date().toISOString() }
  ],
  "finance-banking": [
    { id: "wi-fin-1", sectorId: "finance-banking", title: "Microloan credit committee batch approvals", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-14", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-fin-2", sectorId: "finance-banking", title: "NBE reserve requirement weekly compliance filing", status: "TODO", priority: "URGENT", dueDate: "2026-11-16", assignedToId: "e2", createdAt: new Date().toISOString() }
  ],
  "real-estate": [
    { id: "wi-re-1", sectorId: "real-estate", title: "Bole Tower monthly commercial rent collection", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-15", assignedToId: "e2", createdAt: new Date().toISOString() },
    { id: "wi-re-2", sectorId: "real-estate", title: "Noah Plaza central elevator safety certificate renewal", status: "DONE", priority: "URGENT", dueDate: "2026-11-05", assignedToId: "e1", createdAt: new Date().toISOString() }
  ],
  "ngo-development": [
    { id: "wi-ngo-1", sectorId: "ngo-development", title: "USAID Q3 clean water milestone verification report", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-22", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-ngo-2", sectorId: "ngo-development", title: "Community nutrition pack procurement tender review", status: "TODO", priority: "MEDIUM", dueDate: "2026-11-28", assignedToId: "e2", createdAt: new Date().toISOString() }
  ],
  "government-services": [
    { id: "wi-gov-1", sectorId: "government-services", title: "Sub-City annual trade license renewal rush processing", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-18", assignedToId: "e1", createdAt: new Date().toISOString() },
    { id: "wi-gov-2", sectorId: "government-services", title: "Digitize citizen deed verification queue ticketing", status: "DONE", priority: "MEDIUM", dueDate: "2026-11-04", assignedToId: "e5", createdAt: new Date().toISOString() }
  ]
};

// Flattened initial items for default active sector
export const INITIAL_WORK_ITEMS: SectorWorkItem[] = INITIAL_WORK_ITEMS_BY_SECTOR["retail-trading"] || [];
