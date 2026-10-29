import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Factory,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Hotel,
  Landmark,
  ShoppingBag,
  Truck,
  Wheat
} from "lucide-react";
import type { Dashboard } from "@/lib/types";

export type LangKey =
  | "home" | "sectors" | "money" | "team" | "finance" | "reports" | "admin" | "setup"
  | "morning" | "afternoon" | "evening"
  | "dashboard" | "addTransaction" | "revenue" | "expenses" | "netProfit" | "pendingSync"
  | "employees" | "settings" | "search" | "save" | "cancel" | "delete" | "edit" | "add"
  | "amount" | "description" | "category" | "paymentMethod" | "date" | "noRecords"
  | "activeTask" | "sectorRevenue" | "pendingRecords" | "manageAdmins" | "addMember"
  | "workflow" | "features" | "companyName" | "tinNumber" | "language" | "clearCache";

const i18n: Record<string, Partial<Record<LangKey, string>>> = {
  Amharic: {
    home: "ዋና", sectors: "ዘርፎች", money: "ገንዘብ", team: "ቡድን",
    finance: "ፋይናንስ", reports: "ሪፖርቶች", admin: "አስተዳዳሪ", setup: "ቅንብር",
    morning: "ጥዋት", afternoon: "ከሰዓት", evening: "ምሽት",
    dashboard: "ዳሽቦርድ", addTransaction: "ግብይት ጨምር", revenue: "ገቢ",
    expenses: "ወጪ", netProfit: "ትርፍ", pendingSync: "በጠበቃ ማመሳሰያ",
    employees: "ሰራተኞች", settings: "ቅንብሮች", search: "ፈልግ", save: "አስቀምጥ",
    cancel: "ሰርዝ", delete: "ሰርዝ", edit: "አስተካክል", add: "ጨምር",
    amount: "መጠን", description: "መግለጫ", category: "ምድብ",
    paymentMethod: "የክፍያ ዘዴ", date: "ቀን", noRecords: "ምንም መዝገቦች የሉም",
    activeTask: "ቀጥተኛ ስራዎች", sectorRevenue: "ዘርፍ ገቢ", pendingRecords: "በጠበቃ መዝገቦች",
    manageAdmins: "አስተዳዳሪዎችን አስተዳድር", addMember: "አባል ጨምር",
    workflow: "የስራ ፍሰት", features: "ባህሪያት", companyName: "የድርጅት ስም",
    tinNumber: "ቲን ቁጥር", language: "ቋንቋ", clearCache: "ካሽ አጽዳ"
  },
  "Afaan Oromo": {
    home: "Mana", sectors: "Kutaalee", money: "Maallaqaa", team: "Garee",
    finance: "Faayinaansii", reports: "Gabaasa", admin: "Bulchiinsa", setup: "Qindeessuu",
    morning: "Bari'a", afternoon: "Guyyaa", evening: "Galgala",
    dashboard: "Daashboordii", addTransaction: "Hojii Dabali", revenue: "Galii",
    expenses: "Baasii", netProfit: "Bu'aa", pendingSync: "Eegaa jiru",
    employees: "Hojjettoonni", settings: "Qindeessuu", search: "Barbaadi", save: "Olkaa'i",
    cancel: "Haqi", delete: "Balleessi", edit: "Sirreessi", add: "Dabali",
    amount: "Baay'ina", description: "Ibsa", category: "Gosa",
    paymentMethod: "Karaa Kaffalti", date: "Guyyaa", noRecords: "Galmee hin jiru",
    activeTask: "Hojii Socho'aa", sectorRevenue: "Galii Kutaa", pendingRecords: "Eegaa jiru",
    manageAdmins: "Bulchitoota Bulchi", addMember: "Miseensa Dabali",
    workflow: "Hojii Ogummaa", features: "Amaloota", companyName: "Maqaa Dhaabbataa",
    tinNumber: "Lakk TIN", language: "Afaan", clearCache: "Qulqulleessi"
  },
  Tigrinya: {
    home: "ቤት", sectors: "ዘርፍታት", money: "ገንዘብ", team: "ጋንታ",
    finance: "ፋይናንስ", reports: "ጸብጻባት", admin: "ምሕደራ", setup: "ምቅናዕ",
    morning: "ንጉህ", afternoon: "ቀትሪ", evening: "ምሸት",
    dashboard: "ዳሽቦርድ", addTransaction: "ዕድጊ ወሰኽ", revenue: "እቶት",
    expenses: "ወጻኢ", netProfit: "ትርፊ", pendingSync: "ዝጽበ ምስምሳእ",
    employees: "ሰራሕተኛታት", settings: "ምቅናዕ", search: "ደሊ", save: "ዓቅብ",
    cancel: "ሰርዝ", delete: "ሰርዝ", edit: "ኣስተኻኽለ", add: "ወሰኽ",
    amount: "መጠን", description: "መግለጺ", category: "ዓይነት",
    paymentMethod: "ኣገባብ ክፍሊት", date: "ዕለት", noRecords: "ዝርዝር የብሉን",
    activeTask: "ንጡፍ ስራሕ", sectorRevenue: "እቶት ዘርፊ", pendingRecords: "ዝጽበ ምዝገባ",
    manageAdmins: "ምሕደርቲ ምዝዋር", addMember: "ኣባል ወሰኽ",
    workflow: "ናይ ስራሕ ፍሰት", features: "ባህሪታት", companyName: "ስም ትካል",
    tinNumber: "ቁ. TIN", language: "ቋንቋ", clearCache: "ካሽ ጽረጉ"
  }
};

export function t(key: LangKey, language = "English"): string {
  return i18n[language]?.[key] ?? key;
}

export const paymentMethods = ["Telebirr", "Cash", "Bank Transfer", "CBE Birr", "Amole", "Cheque"];
export const paymentMethodsWithIcons = [
  { method: "Telebirr", icon: "📱" },
  { method: "Cash", icon: "💵" },
  { method: "Bank Transfer", icon: "🏦" },
  { method: "CBE Birr", icon: "🇪🇹" },
  { method: "Amole", icon: "💳" },
  { method: "Cheque", icon: "📝" }
];
export const permissions = ["View", "Edit", "Delete", "Approve", "Reports", "Export"];
export const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export type SectorFeature = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type SectorDefinition = {
  id: string;
  shortName: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tint: string;
  features: SectorFeature[];
};

export const sectorDefinitions: SectorDefinition[] = [
  {
    id: "retail-trading",
    shortName: "Retail",
    name: "Retail & Trading",
    description: "POS, stock, suppliers, and VAT-ready checkout for Ethiopian shops and wholesalers.",
    icon: "fa-solid fa-store",
    color: "#f59e0b",
    tint: "#fffbeb",
    features: [
      { title: "POS Checkout", description: "Fast sales, discounts, cash-up, and receipts.", icon: "fa-solid fa-cash-register", color: "#f59e0b" },
      { title: "Inventory", description: "Track stock levels, costs, and warehouse balances.", icon: "fa-solid fa-boxes-stacked", color: "#8b5cf6" },
      { title: "Products", description: "Manage SKU, pricing, categories, and variants.", icon: "fa-solid fa-tags", color: "#10b981" },
      { title: "Barcode Scan", description: "Scan and search products from checkout or stock count.", icon: "fa-solid fa-barcode", color: "#2563eb" },
      { title: "Stock Alerts", description: "Low-stock warnings and reorder reminders.", icon: "fa-solid fa-triangle-exclamation", color: "#ef4444" },
      { title: "Customers", description: "Customer ledger, credit limits, and purchase history.", icon: "fa-solid fa-users", color: "#06b6d4" },
      { title: "Suppliers", description: "Supplier contacts, purchase orders, and payables.", icon: "fa-solid fa-truck-field", color: "#f97316" },
      { title: "Sales Reports", description: "Daily revenue, VAT, branch, and cashier reports.", icon: "fa-solid fa-chart-line", color: "#ec4899" }
    ]
  },
  {
    id: "manufacturing",
    shortName: "Manufacturing",
    name: "Manufacturing",
    description: "Production stages, BOM costing, quality checks, and machinery maintenance.",
    icon: "fa-solid fa-industry",
    color: "#8b5cf6",
    tint: "#f5f3ff",
    features: [
      { title: "BOM Costing", description: "Build material recipes with quantity and cost rollups.", icon: "fa-solid fa-diagram-project", color: "#8b5cf6" },
      { title: "Production Orders", description: "Plan batches, stages, workers, and output targets.", icon: "fa-solid fa-clipboard-list", color: "#2563eb" },
      { title: "Raw Materials", description: "Reserve, consume, and reconcile material stock.", icon: "fa-solid fa-boxes-stacked", color: "#f59e0b" },
      { title: "Quality Results", description: "Capture checks, defects, pass rates, and rework.", icon: "fa-solid fa-clipboard-check", color: "#10b981" },
      { title: "Machinery", description: "Machine logs, downtime, and maintenance reminders.", icon: "fa-solid fa-gears", color: "#64748b" },
      { title: "Shifts", description: "Shift rosters, supervisor notes, and productivity.", icon: "fa-solid fa-clock", color: "#06b6d4" },
      { title: "Finished Goods", description: "Move completed batches into sellable inventory.", icon: "fa-solid fa-box", color: "#f97316" },
      { title: "Waste Tracking", description: "Track scrap, wastage causes, and cost leakage.", icon: "fa-solid fa-recycle", color: "#ef4444" }
    ]
  },
  {
    id: "agriculture",
    shortName: "Agriculture",
    name: "Agriculture",
    description: "Crop cycles, livestock events, input distribution, and harvest yield tracking.",
    icon: "fa-solid fa-seedling",
    color: "#10b981",
    tint: "#ecfdf5",
    features: [
      { title: "Crop Cycles", description: "Track planting, spraying, irrigation, and harvest stages.", icon: "fa-solid fa-seedling", color: "#10b981" },
      { title: "Livestock Events", description: "Register herds, vaccinations, births, and sales.", icon: "fa-solid fa-leaf", color: "#84cc16" },
      { title: "Input Distribution", description: "Manage fertilizer, seed, feed, and chemical usage.", icon: "fa-solid fa-sack-dollar", color: "#f59e0b" },
      { title: "Harvest Yields", description: "Record harvest volumes, grades, and market value.", icon: "fa-solid fa-wheat-awn", color: "#65a30d" },
      { title: "Warehouses", description: "Control stores, lots, moisture, and stock movements.", icon: "fa-solid fa-warehouse", color: "#8b5cf6" },
      { title: "Cooperatives", description: "Member registry, deliveries, deductions, and payouts.", icon: "fa-solid fa-people-group", color: "#06b6d4" },
      { title: "Export Lots", description: "Prepare export batches, docs, and traceability.", icon: "fa-solid fa-truck", color: "#f97316" },
      { title: "Field Expenses", description: "Capture fuel, labor, equipment, and field costs.", icon: "fa-solid fa-coins", color: "#ef4444" }
    ]
  },
  {
    id: "construction",
    shortName: "Construction",
    name: "Construction",
    description: "Projects, budgets, subcontractors, materials, equipment, and safety logs.",
    icon: "fa-solid fa-helmet-safety",
    color: "#f97316",
    tint: "#fff7ed",
    features: [
      { title: "Project Budgets", description: "Track contract value, cost codes, and variance.", icon: "fa-solid fa-chart-gantt", color: "#f97316" },
      { title: "Site Reports", description: "Daily progress, photos, weather, and issues.", icon: "fa-solid fa-clipboard-list", color: "#2563eb" },
      { title: "Subcontractors", description: "Packages, contracts, retention, and payment status.", icon: "fa-solid fa-file-contract", color: "#ec4899" },
      { title: "Materials", description: "Requests, deliveries, stock, and site consumption.", icon: "fa-solid fa-cubes", color: "#8b5cf6" },
      { title: "Site Workers", description: "Attendance, crews, overtime, and payroll inputs.", icon: "fa-solid fa-users-gear", color: "#10b981" },
      { title: "Equipment", description: "Assets, utilization, maintenance, and rentals.", icon: "fa-solid fa-hammer", color: "#64748b" },
      { title: "Safety Log", description: "Inspections, incidents, PPE, and corrective actions.", icon: "fa-solid fa-shield-halved", color: "#ef4444" },
      { title: "Client Billing", description: "Milestones, progress invoices, and receipts.", icon: "fa-solid fa-file-invoice-dollar", color: "#06b6d4" }
    ]
  },
  {
    id: "healthcare",
    shortName: "Healthcare",
    name: "Healthcare",
    description: "Patient visits, prescriptions, pharmacy, lab requests, billing, and EHMIS export.",
    icon: "fa-solid fa-heart-pulse",
    color: "#ef4444",
    tint: "#fef2f2",
    features: [
      { title: "EMR / EHR", description: "Clinical notes, vitals, allergies, documents, and visit history.", icon: "fa-solid fa-file-medical", color: "#ef4444" },
      { title: "Queue & OPD", description: "Walk-ins, triage, queue tokens, consultation, and follow-up.", icon: "fa-solid fa-stethoscope", color: "#2563eb" },
      { title: "IPD & Beds", description: "Admissions, bed allocation, transfers, and discharge workflow.", icon: "fa-solid fa-bed-pulse", color: "#0f766e" },
      { title: "Pharmacy", description: "Drug stock, batches, expiry alerts, and dispensing.", icon: "fa-solid fa-pills", color: "#10b981" },
      { title: "Lab & Radiology", description: "Requests, samples, results, imaging, and PACS references.", icon: "fa-solid fa-microscope", color: "#06b6d4" },
      { title: "Billing & Claims", description: "Invoices, receipts, insurance claims, balances, and payments.", icon: "fa-solid fa-receipt", color: "#f97316" },
      { title: "Inventory", description: "Procurement, suppliers, stock movement, assets, and equipment.", icon: "fa-solid fa-boxes-stacked", color: "#8b5cf6" },
      { title: "Reports & EHMIS", description: "Analytics, public-health reports, DHIS2/eHMIS export, and data quality.", icon: "fa-solid fa-chart-column", color: "#f59e0b" },
      { title: "Security", description: "RBAC, audit logs, consent, backups, encryption, and compliance controls.", icon: "fa-solid fa-lock", color: "#64748b" },
      { title: "Patient Portal", description: "Online booking, reminders, results, invoices, and bill payment.", icon: "fa-solid fa-bell", color: "#ec4899" }
    ]
  },
  {
    id: "education",
    shortName: "Education",
    name: "Education",
    description: "Students, attendance, grade books, fee collection, teachers, and timetables.",
    icon: "fa-solid fa-graduation-cap",
    color: "#06b6d4",
    tint: "#ecfeff",
    features: [
      { title: "Students", description: "Enrollment, guardians, documents, and class placement.", icon: "fa-solid fa-user-graduate", color: "#2563eb" },
      { title: "Attendance", description: "Daily attendance, absence notes, and trends.", icon: "fa-solid fa-clipboard-user", color: "#10b981" },
      { title: "Grade Books", description: "Assessments, results, terms, and transcripts.", icon: "fa-solid fa-clipboard-check", color: "#f59e0b" },
      { title: "Timetable", description: "Class schedules, rooms, periods, and conflicts.", icon: "fa-solid fa-calendar-days", color: "#06b6d4" },
      { title: "Fees", description: "Billing, payment plans, discounts, and balances.", icon: "fa-solid fa-money-check", color: "#ef4444" },
      { title: "Parents", description: "Parent contacts, portal notices, and messaging.", icon: "fa-solid fa-users", color: "#8b5cf6" },
      { title: "Teachers", description: "Workload, subjects, assignments, and HR data.", icon: "fa-solid fa-chalkboard-user", color: "#f97316" },
      { title: "Exams", description: "Exam calendar, grading rules, and report cards.", icon: "fa-solid fa-certificate", color: "#84cc16" }
    ]
  },
  {
    id: "hospitality",
    shortName: "Hospitality",
    name: "Hospitality",
    description: "Rooms, reservations, restaurant orders, events, housekeeping, and occupancy.",
    icon: "fa-solid fa-hotel",
    color: "#ec4899",
    tint: "#fdf2f8",
    features: [
      { title: "Room Calendar", description: "Availability, blocks, arrivals, and departures.", icon: "fa-solid fa-bed", color: "#ec4899" },
      { title: "Reservations", description: "Bookings, deposits, guest notes, and changes.", icon: "fa-solid fa-calendar-check", color: "#2563eb" },
      { title: "Restaurant POS", description: "Tables, orders, kitchen slips, and bills.", icon: "fa-solid fa-utensils", color: "#ef4444" },
      { title: "Housekeeping", description: "Room status, cleaning tasks, and maintenance flags.", icon: "fa-solid fa-broom", color: "#10b981" },
      { title: "Guests", description: "Profiles, stay history, preferences, and invoices.", icon: "fa-solid fa-users", color: "#06b6d4" },
      { title: "Events", description: "Halls, catering packages, schedules, and invoices.", icon: "fa-solid fa-champagne-glasses", color: "#f59e0b" },
      { title: "Tour Packages", description: "Packages, operators, pickups, and commissions.", icon: "fa-solid fa-map-location-dot", color: "#f97316" },
      { title: "Occupancy", description: "ADR, occupancy, revenue, and channel reporting.", icon: "fa-solid fa-chart-line", color: "#8b5cf6" }
    ]
  },
  {
    id: "transport-logistics",
    shortName: "Logistics",
    name: "Transport & Logistics",
    description: "Fleet, waybills, routes, service schedules, cargo, and delivery proofs.",
    icon: "fa-solid fa-truck-fast",
    color: "#6366f1",
    tint: "#eef2ff",
    features: [
      { title: "Fleet", description: "Vehicles, documents, assignments, and availability.", icon: "fa-solid fa-truck", color: "#6366f1" },
      { title: "Waybills", description: "Create, track, and reconcile transport waybills.", icon: "fa-solid fa-clipboard-list", color: "#8b5cf6" },
      { title: "Routes", description: "Route plans, checkpoints, ETA, and dispatch notes.", icon: "fa-solid fa-route", color: "#2563eb" },
      { title: "Drivers", description: "Licenses, schedules, advances, and performance.", icon: "fa-solid fa-user-tie", color: "#10b981" },
      { title: "Fuel Logs", description: "Fuel usage, consumption, and variance tracking.", icon: "fa-solid fa-gas-pump", color: "#f59e0b" },
      { title: "Maintenance", description: "Service schedules, parts, costs, and downtime.", icon: "fa-solid fa-wrench", color: "#f97316" },
      { title: "Cargo", description: "Cargo manifests, insurance, and customer billing.", icon: "fa-solid fa-boxes-packing", color: "#06b6d4" },
      { title: "Delivery Proof", description: "Proof of delivery, receiver notes, and photos.", icon: "fa-solid fa-location-dot", color: "#ef4444" }
    ]
  },
  {
    id: "finance-banking",
    shortName: "Finance",
    name: "Finance & Banking",
    description: "Ledger, loans, reconciliations, approvals, audit cases, and compliance.",
    icon: "fa-solid fa-building-columns",
    color: "#2563eb",
    tint: "#eff6ff",
    features: [
      { title: "General Ledger", description: "Accounts, journals, balances, and financial periods.", icon: "fa-solid fa-book", color: "#2563eb" },
      { title: "Loan Schedules", description: "Principal, interest, due dates, and aging.", icon: "fa-solid fa-hand-holding-dollar", color: "#f59e0b" },
      { title: "Reconciliations", description: "Bank, cash, mobile money, and branch matching.", icon: "fa-solid fa-right-left", color: "#8b5cf6" },
      { title: "Approvals", description: "Approval queues, thresholds, and maker-checker flows.", icon: "fa-solid fa-circle-check", color: "#10b981" },
      { title: "Audit Cases", description: "Findings, evidence, owners, and closure status.", icon: "fa-solid fa-shield-halved", color: "#64748b" },
      { title: "Payroll", description: "Pay runs, deductions, taxes, and payment files.", icon: "fa-solid fa-money-check-dollar", color: "#06b6d4" },
      { title: "Cash Flow", description: "Forecast inflows, outflows, and liquidity gaps.", icon: "fa-solid fa-chart-line", color: "#ef4444" },
      { title: "Compliance", description: "Regulatory reports, controls, and sign-offs.", icon: "fa-solid fa-scale-balanced", color: "#f97316" }
    ]
  },
  {
    id: "real-estate",
    shortName: "Real Estate",
    name: "Real Estate",
    description: "Properties, tenants, leases, rent schedules, maintenance, and commissions.",
    icon: "fa-solid fa-building",
    color: "#84cc16",
    tint: "#f7fee7",
    features: [
      { title: "Properties", description: "Units, listings, documents, and valuation data.", icon: "fa-solid fa-building", color: "#84cc16" },
      { title: "Tenants", description: "Tenant profiles, contacts, balances, and history.", icon: "fa-solid fa-users", color: "#06b6d4" },
      { title: "Leases", description: "Lease terms, renewals, deposits, and clauses.", icon: "fa-solid fa-file-signature", color: "#8b5cf6" },
      { title: "Rent Schedules", description: "Recurring rent, arrears, reminders, and receipts.", icon: "fa-solid fa-key", color: "#f59e0b" },
      { title: "Maintenance", description: "Requests, vendors, costs, and completion status.", icon: "fa-solid fa-screwdriver-wrench", color: "#f97316" },
      { title: "Viewings", description: "Lead pipeline, viewing slots, and follow-ups.", icon: "fa-solid fa-calendar-check", color: "#2563eb" },
      { title: "Agents", description: "Commission rules, deals, and payout status.", icon: "fa-solid fa-user-tie", color: "#10b981" },
      { title: "Mortgages", description: "Mortgage tracking, amortization, and documents.", icon: "fa-solid fa-house-circle-check", color: "#ef4444" }
    ]
  },
  {
    id: "ngo-development",
    shortName: "NGO",
    name: "NGO & Development",
    description: "Donors, grants, beneficiaries, procurement, monitoring, and impact indicators.",
    icon: "fa-solid fa-hands-holding-child",
    color: "#14b8a6",
    tint: "#f0fdfa",
    features: [
      { title: "Donors", description: "Donor profiles, pledges, restrictions, and reporting.", icon: "fa-solid fa-hand-holding-heart", color: "#10b981" },
      { title: "Grants", description: "Grant budgets, periods, milestones, and compliance.", icon: "fa-solid fa-file-circle-check", color: "#8b5cf6" },
      { title: "Beneficiaries", description: "Registry, services received, and follow-up history.", icon: "fa-solid fa-users", color: "#2563eb" },
      { title: "Procurement", description: "Requests, vendor bids, approvals, and delivery.", icon: "fa-solid fa-cart-shopping", color: "#f97316" },
      { title: "Field Monitoring", description: "Site visits, observations, photos, and actions.", icon: "fa-solid fa-location-dot", color: "#ef4444" },
      { title: "Impact", description: "Indicators, baselines, targets, and results.", icon: "fa-solid fa-chart-pie", color: "#ec4899" },
      { title: "Compliance", description: "Policy checks, donor rules, and audit trails.", icon: "fa-solid fa-clipboard-check", color: "#64748b" },
      { title: "Budgets", description: "Burn rate, commitments, expenses, and variance.", icon: "fa-solid fa-coins", color: "#f59e0b" }
    ]
  },
  {
    id: "government-services",
    shortName: "Government",
    name: "Government Services",
    description: "Permits, citizen cases, revenue receipts, documents, service counters, and audit.",
    icon: "fa-solid fa-landmark-flag",
    color: "#64748b",
    tint: "#f8fafc",
    features: [
      { title: "Permits", description: "Applications, review stages, fees, and issuance.", icon: "fa-solid fa-file-contract", color: "#2563eb" },
      { title: "Citizens", description: "Citizen records, requests, cases, and service history.", icon: "fa-solid fa-users", color: "#10b981" },
      { title: "Service Cases", description: "Case queues, SLAs, assignments, and resolutions.", icon: "fa-solid fa-list-check", color: "#8b5cf6" },
      { title: "Revenue", description: "Revenue collection, receipts, reconciliation, and deposits.", icon: "fa-solid fa-coins", color: "#f59e0b" },
      { title: "Documents", description: "Document registry, approvals, and expiry dates.", icon: "fa-solid fa-folder-open", color: "#f97316" },
      { title: "Counters", description: "Counter activity, wait times, and service volume.", icon: "fa-solid fa-building-user", color: "#06b6d4" },
      { title: "Audit", description: "Activity logs, findings, evidence, and controls.", icon: "fa-solid fa-shield-halved", color: "#64748b" },
      { title: "Performance", description: "Department KPIs, backlog, and service analytics.", icon: "fa-solid fa-chart-bar", color: "#ef4444" }
    ]
  }
];

export function getSectorDefinition(sectorId?: string | null) {
  const aliasMap: Record<string, string> = {
    retail: "retail-trading",
    "retail-sector": "retail-trading",
    logistics: "transport-logistics",
    transport: "transport-logistics",
    "logistics-sector": "transport-logistics",
    finance: "finance-banking",
    realestate: "real-estate",
    ngo: "ngo-development",
    government: "government-services",
    "health-sector": "healthcare",
    "edu-sector": "education",
    "hotel-sector": "hospitality"
  };
  const normalized = sectorId ? aliasMap[sectorId] ?? sectorId : "retail-trading";
  return sectorDefinitions.find((sector) => sector.id === normalized) ?? sectorDefinitions[0];
}

export const emptyDashboard: Dashboard = {
  stats: {
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    pendingSync: 0,
    employeeCount: 0,
    sectorCount: 0
  },
  taxSummary: {
    taxableRevenue: 0,
    vat: 0,
    withholding: 0,
    totalTaxLiability: 0
  },
  revenueChart: [35, 55, 40, 75, 60, 90, 70, 85, 65, 95, 80, 100],
  sectorBreakdown: [],
  recentTransactions: []
};

export const iconMap = {
  "shopping-bag": ShoppingBag,
  factory: Factory,
  wheat: Wheat,
  "hard-hat": BriefcaseBusiness,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  hotel: Hotel,
  truck: Truck,
  landmark: Landmark,
  "building-2": Building2,
  "hand-heart": HandHeart,
  "badge-check": BadgeCheck
};

export const sectorWorkflowTemplates: Record<string, { recordType: string; title: string; metadata: Record<string, unknown> }[]> = {
  "retail-trading": [
    { recordType: "Inventory Item", title: "Add inventory item", metadata: { module: "inventory" } },
    { recordType: "POS Shift", title: "Open POS shift", metadata: { module: "pos" } },
    { recordType: "Stock Alert", title: "Create stock alert", metadata: { module: "stock-alert" } }
  ],
  manufacturing: [
    { recordType: "BOM", title: "Create bill of materials", metadata: { module: "bom" } },
    { recordType: "Production Order", title: "Open production order", metadata: { module: "production" } },
    { recordType: "Quality Check", title: "Schedule quality check", metadata: { module: "quality" } }
  ],
  agriculture: [
    { recordType: "Crop Cycle", title: "Start crop cycle", metadata: { module: "crop" } },
    { recordType: "Livestock Record", title: "Register livestock batch", metadata: { module: "livestock" } },
    { recordType: "Export Lot", title: "Prepare export lot", metadata: { module: "export" } }
  ],
  construction: [
    { recordType: "Project", title: "Create project milestone", metadata: { module: "project" } },
    { recordType: "Subcontractor", title: "Add subcontractor package", metadata: { module: "subcontractor" } },
    { recordType: "Safety Check", title: "Schedule safety inspection", metadata: { module: "safety" } }
  ],
  healthcare: [
    { recordType: "Patient Visit", title: "Register patient visit", metadata: { module: "patient" } },
    { recordType: "Prescription", title: "Create prescription batch", metadata: { module: "prescription" } },
    { recordType: "Lab Request", title: "Open lab request", metadata: { module: "lab" } }
  ],
  education: [
    { recordType: "Student Batch", title: "Register student batch", metadata: { module: "students" } },
    { recordType: "Grade Report", title: "Prepare grade report", metadata: { module: "grades" } },
    { recordType: "Timetable", title: "Create timetable block", metadata: { module: "timetable" } }
  ],
  hospitality: [
    { recordType: "Room Block", title: "Create room block", metadata: { module: "rooms" } },
    { recordType: "Restaurant Shift", title: "Open restaurant shift", metadata: { module: "restaurant" } },
    { recordType: "Event Booking", title: "Add event booking", metadata: { module: "events" } }
  ],
  "transport-logistics": [
    { recordType: "Fleet Vehicle", title: "Register fleet vehicle", metadata: { module: "fleet" } },
    { recordType: "Waybill", title: "Create waybill", metadata: { module: "waybill" } },
    { recordType: "Cargo Policy", title: "Add cargo insurance", metadata: { module: "cargo" } }
  ],
  "finance-banking": [
    { recordType: "Loan", title: "Register loan account", metadata: { module: "loan" } },
    { recordType: "Ledger Review", title: "Start ledger review", metadata: { module: "ledger" } },
    { recordType: "Audit Trail", title: "Open audit case", metadata: { module: "audit" } }
  ],
  "real-estate": [
    { recordType: "Property", title: "Add property listing", metadata: { module: "property" } },
    { recordType: "Tenant", title: "Register tenant", metadata: { module: "tenant" } },
    { recordType: "Maintenance", title: "Open maintenance ticket", metadata: { module: "maintenance" } }
  ],
  "ngo-development": [
    { recordType: "Grant", title: "Register grant", metadata: { module: "grant" } },
    { recordType: "Donor", title: "Add donor profile", metadata: { module: "donor" } },
    { recordType: "Impact Report", title: "Start impact report", metadata: { module: "impact" } }
  ],
  "government-services": [
    { recordType: "Permit", title: "Create permit case", metadata: { module: "permit" } },
    { recordType: "Citizen Record", title: "Register citizen record", metadata: { module: "citizen" } },
    { recordType: "Revenue Case", title: "Open revenue case", metadata: { module: "revenue" } }
  ]
};
