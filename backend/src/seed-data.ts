export const sectors = [
  {
    id: "retail-trading",
    name: "Retail & Trading",
    icon: "shopping-bag",
    color: "#1a5f2a",
    lightColor: "#e8f5e9",
    textColor: "#0f3d1a",
    description: "Inventory, POS, barcode, and stock control for Ethiopian retail and wholesale shops.",
    features: [
      "Inventory control",
      "POS sales",
      "Barcode scanning",
      "Stock alerts",
      "Supplier tracking",
      "Daily cashup",
      "Branch reporting",
      "VAT receipts"
    ]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "factory",
    color: "#0f766e",
    lightColor: "#ccfbf1",
    textColor: "#115e59",
    description: "Production planning, materials, quality control, and maintenance for factories.",
    features: [
      "Bill of materials",
      "Production orders",
      "Quality control",
      "Machine maintenance",
      "Shift management",
      "Raw material stock",
      "Waste tracking",
      "Costing"
    ]
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "wheat",
    color: "#65a30d",
    lightColor: "#ecfccb",
    textColor: "#3f6212",
    description: "Crop, livestock, cooperative, and export tracking for agribusinesses.",
    features: [
      "Crop tracking",
      "Livestock records",
      "Cooperative members",
      "Input distribution",
      "Harvest forecasts",
      "Export lots",
      "Warehouse stock",
      "Field expenses"
    ]
  },
  {
    id: "construction",
    name: "Construction",
    icon: "hard-hat",
    color: "#b45309",
    lightColor: "#fef3c7",
    textColor: "#92400e",
    description: "Project, subcontractor, safety, and material management for builders.",
    features: [
      "Project milestones",
      "Subcontractors",
      "Material requests",
      "Site attendance",
      "Safety compliance",
      "Equipment logs",
      "Budget tracking",
      "Client billing"
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "heart-pulse",
    color: "#dc2626",
    lightColor: "#fee2e2",
    textColor: "#991b1b",
    description: "Patient, pharmacy, claims, and EHMIS-ready workflows for clinics and hospitals.",
    features: [
      "Patient records",
      "Appointments",
      "Prescription management",
      "Pharmacy stock",
      "Lab requests",
      "Insurance claims",
      "EHMIS export",
      "Referral tracking"
    ]
  },
  {
    id: "education",
    name: "Education",
    icon: "graduation-cap",
    color: "#2563eb",
    lightColor: "#dbeafe",
    textColor: "#1d4ed8",
    description: "Student, parent, timetable, fee, and grade reporting for schools.",
    features: [
      "Student records",
      "Parent portal",
      "Grade reports",
      "Timetable",
      "Fee collection",
      "Attendance",
      "Teacher workload",
      "Exam schedules"
    ]
  },
  {
    id: "hospitality",
    name: "Hospitality",
    icon: "hotel",
    color: "#7c3aed",
    lightColor: "#ede9fe",
    textColor: "#5b21b6",
    description: "Hotel, restaurant, tour, and event operations for hospitality teams.",
    features: [
      "Room management",
      "Restaurant POS",
      "Tour packages",
      "Event booking",
      "Housekeeping",
      "Guest profiles",
      "Supplier purchases",
      "Occupancy reports"
    ]
  },
  {
    id: "transport-logistics",
    name: "Transport & Logistics",
    icon: "truck",
    color: "#0891b2",
    lightColor: "#cffafe",
    textColor: "#0e7490",
    description: "Fleet, cargo, waybill, maintenance, and dispatch control for logistics firms.",
    features: [
      "Fleet management",
      "Waybill tracking",
      "Cargo insurance",
      "Driver assignments",
      "Fuel logs",
      "Route planning",
      "Vehicle maintenance",
      "Delivery proof"
    ]
  },
  {
    id: "finance-banking",
    name: "Finance & Banking",
    icon: "landmark",
    color: "#4f46e5",
    lightColor: "#e0e7ff",
    textColor: "#3730a3",
    description: "Ledger, payroll, loan, audit, and compliance support for finance teams.",
    features: [
      "General ledger",
      "Loan tracking",
      "Audit trail",
      "Payroll",
      "Cash flow",
      "Branch reconciliation",
      "Compliance reports",
      "Approvals"
    ]
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "building-2",
    color: "#be123c",
    lightColor: "#ffe4e6",
    textColor: "#9f1239",
    description: "Property, tenant, mortgage, commission, and maintenance operations.",
    features: [
      "Property listings",
      "Tenant records",
      "Mortgage tracking",
      "Agent commission",
      "Maintenance tickets",
      "Rent collection",
      "Lease renewals",
      "Viewing schedule"
    ]
  },
  {
    id: "ngo-development",
    name: "NGO & Development",
    icon: "hand-heart",
    color: "#059669",
    lightColor: "#d1fae5",
    textColor: "#047857",
    description: "Donor, grant, project, beneficiary, and compliance tools for development programs.",
    features: [
      "Donor management",
      "Grant accounting",
      "Impact reports",
      "Beneficiary records",
      "Compliance",
      "Procurement",
      "Field monitoring",
      "Budget burn rate"
    ]
  },
  {
    id: "government-services",
    name: "Government Services",
    icon: "badge-check",
    color: "#475569",
    lightColor: "#e2e8f0",
    textColor: "#334155",
    description: "Permit, revenue, citizen service, and audit workflows for public offices.",
    features: [
      "Permit management",
      "Revenue collection",
      "Citizen records",
      "Audit logs",
      "Case routing",
      "Document registry",
      "Service counters",
      "Performance reports"
    ]
  }
];

export const demoEmployees = [
  {
    id: "emp-abebe-kebede",
    fullName: "Abebe Kebede",
    position: "Operations Lead",
    department: "Retail",
    phone: "+251 911 234 567",
    email: "abebe@beyonderp.et",
    salary: 42000,
    hiredDate: new Date("2024-01-10")
  },
  {
    id: "emp-hana-tesfaye",
    fullName: "Hana Tesfaye",
    position: "Finance Manager",
    department: "Finance",
    phone: "+251 922 345 678",
    email: "hana@beyonderp.et",
    salary: 56000,
    hiredDate: new Date("2023-08-15")
  },
  {
    id: "emp-dawit-mekonnen",
    fullName: "Dawit Mekonnen",
    position: "Warehouse Supervisor",
    department: "Logistics",
    phone: "+251 933 456 789",
    email: "dawit@beyonderp.et",
    salary: 38000,
    hiredDate: new Date("2024-04-01")
  }
];

export const demoUsers = [
  {
    id: "usr-owner",
    fullName: "Beyond Owner",
    email: "owner@beyonderp.local",
    phone: "+251 911 000 001",
    role: "OWNER" as const,
    password: "Beyond@12345"
  },
  {
    id: "usr-admin",
    fullName: "Hana Admin",
    email: "admin@beyonderp.local",
    phone: "+251 922 000 002",
    role: "ADMIN" as const,
    password: "Admin@12345"
  },
  {
    id: "usr-manager",
    fullName: "Dawit Manager",
    email: "manager@beyonderp.local",
    phone: "+251 933 000 003",
    role: "MANAGER" as const,
    password: "Manager@12345"
  }
];

export const demoTransactions = [
  {
    id: "txn-retail-sale-1",
    type: "INCOME" as const,
    amount: 185000,
    description: "Weekly retail branch sales",
    category: "Retail & Trading",
    sectorId: "retail-trading",
    paymentMethod: "Telebirr",
    vatAmount: 27750,
    status: "COMPLETED" as const,
    synced: true,
    occurredAt: new Date("2026-05-05")
  },
  {
    id: "txn-stock-purchase-1",
    type: "EXPENSE" as const,
    amount: 72500,
    description: "Imported stock replenishment",
    category: "Retail & Trading",
    sectorId: "retail-trading",
    paymentMethod: "Bank Transfer",
    vatAmount: 10875,
    status: "COMPLETED" as const,
    synced: true,
    occurredAt: new Date("2026-05-09")
  },
  {
    id: "txn-fleet-service-1",
    type: "EXPENSE" as const,
    amount: 18400,
    description: "Fleet maintenance and fuel",
    category: "Transport & Logistics",
    sectorId: "transport-logistics",
    paymentMethod: "CBE Birr",
    vatAmount: 2760,
    status: "PENDING" as const,
    synced: false,
    occurredAt: new Date("2026-05-17")
  }
];

export const demoWorkItems = [
  {
    id: "work-retail-stock-audit",
    sectorId: "retail-trading",
    title: "Complete stock count for main branch",
    description: "Verify high-value items and update reorder levels.",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    dueDate: new Date("2026-05-30"),
    assignedToId: "usr-manager",
    createdById: "usr-owner"
  },
  {
    id: "work-logistics-waybill-review",
    sectorId: "transport-logistics",
    title: "Review pending waybills",
    description: "Close waybills for Addis Ababa to Hawassa deliveries.",
    status: "TODO" as const,
    priority: "MEDIUM" as const,
    dueDate: new Date("2026-06-03"),
    assignedToId: "usr-admin",
    createdById: "usr-owner"
  }
];

export const demoAccounts = [
  { id: "acct-cash", code: "1000", name: "Cash and Bank", type: "ASSET" as const },
  { id: "acct-receivable", code: "1100", name: "Accounts Receivable", type: "ASSET" as const },
  { id: "acct-sales", code: "4000", name: "Sales Revenue", type: "INCOME" as const },
  { id: "acct-expenses", code: "5000", name: "Operating Expenses", type: "EXPENSE" as const },
  { id: "acct-payroll", code: "5100", name: "Payroll Expense", type: "EXPENSE" as const }
];

export const demoInvoices = [
  {
    id: "inv-demo-retail",
    invoiceNumber: "INV-20260526-DEMO1",
    customerName: "Addis Wholesale Buyers",
    customerPhone: "+251 944 100 200",
    sectorId: "retail-trading",
    items: [{ description: "Mixed retail goods", quantity: 1, unitPrice: 120000 }],
    subtotal: 120000,
    vatAmount: 18000,
    total: 138000,
    status: "SENT" as const,
    dueDate: new Date("2026-06-10")
  }
];

export const demoReceipts = [
  {
    id: "rct-demo-retail",
    receiptNumber: "RCT-20260526-DEMO1",
    payerName: "Addis Wholesale Buyers",
    amount: 50000,
    paymentMethod: "Bank Transfer"
  }
];

export const demoExpenseApprovals = [
  {
    id: "exp-demo-fleet",
    title: "Fleet tire replacement",
    amount: 42000,
    category: "Transport & Logistics",
    sectorId: "transport-logistics",
    requestedById: "usr-manager",
    approvedById: "usr-owner",
    status: "APPROVED" as const,
    notes: "Approved for two delivery trucks",
    decidedAt: new Date("2026-05-20")
  }
];

export const demoLedgerEntries = [
  {
    id: "led-demo-cash",
    accountId: "acct-cash",
    debit: 185000,
    credit: 0,
    description: "Retail sales cash inflow",
    reference: "txn-retail-sale-1"
  },
  {
    id: "led-demo-sales",
    accountId: "acct-sales",
    debit: 0,
    credit: 185000,
    description: "Retail sales revenue",
    reference: "txn-retail-sale-1"
  }
];

export const demoPayrollRuns = [
  {
    id: "payroll-2026-05",
    period: "2026-05",
    status: "APPROVED" as const,
    grossPay: 136000,
    deductions: 10200,
    netPay: 125800,
    items: [
      { employeeId: "emp-abebe-kebede", employeeName: "Abebe Kebede", grossPay: 42000, deductions: 3150 },
      { employeeId: "emp-hana-tesfaye", employeeName: "Hana Tesfaye", grossPay: 56000, deductions: 4200 },
      { employeeId: "emp-dawit-mekonnen", employeeName: "Dawit Mekonnen", grossPay: 38000, deductions: 2850 }
    ]
  }
];

export const demoSectorRecords = [
  {
    id: "sector-record-retail-inventory",
    sectorId: "retail-trading",
    recordType: "Inventory Batch",
    title: "Main branch fast-moving goods",
    ownerName: "Abebe Kebede",
    status: "ACTIVE" as const,
    value: 350000,
    metadata: { stockKeepingUnits: 84, reorderAlerts: 9 }
  },
  {
    id: "sector-record-education-term",
    sectorId: "education",
    recordType: "Academic Term",
    title: "Grade 8 exam preparation",
    ownerName: "Hana Tesfaye",
    status: "PENDING" as const,
    value: 0,
    metadata: { students: 126, subjects: 7 }
  }
];
