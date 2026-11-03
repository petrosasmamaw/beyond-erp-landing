# Master Specification & Prompt: Building an In-Memory Redux Toolkit Multi-Sector Demo of Beyond ERP

> **Instructions for the Code Agent**:
> You are tasked with integrating an **interactive, fully functional, 100% client-side MULTI-SECTOR DEMO of Beyond ERP** into an existing web application.
> 
> **CRITICAL ARCHITECTURAL CONSTRAINTS**:
> 1. **ZERO BACKEND / ZERO API / ZERO DATABASE**: The demo must NOT require any backend server, Express API, Prisma, PostgreSQL, Supabase, or external network requests.
> 2. **STATE DRIVEN EXCLUSIVELY BY REDUX TOOLKIT**: All business logic, CRUD operations, transactions, staff, invoicing, approvals, permissions, settings, and sector data must be managed exclusively in **Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)**.
> 3. **DISAPPEAR ON PAGE RELOAD (TRANSIENT IN-MEMORY STATE)**: When the user refreshes or reloads the browser (`F5` or Cmd+R), **all modified state must cleanly reset / disappear** back to the initial pristine demo state (or back to the login screen). Do NOT persist transactional edits to `localStorage` or `IndexedDB`.
> 4. **INTERACTIVE SECTOR SELECTION ON "TRY DEMO"**:
>    - On the target website's login page, right next to or beneath the login inputs, provide a prominent, high-converting **"⚡ Try Live Demo"** button.
>    - Clicking "Try Live Demo" presents the user with an **Interactive Sector Selector (Modal or Overlay)** featuring all **12 authentic Ethiopian Sectors** (Retail & Trade, Healthcare, Agriculture, Construction, Manufacturing, Education, Hospitality, Transport/Logistics, SACCO & Microfinance, Real Estate, NGO & Development, Government Services).
>    - Clicking any sector card automatically provisions a dedicated, realistic company workspace tailored specifically to that sector and routes directly to `/dashboard`.
> 5. **DYNAMIC IN-APP SECTOR SWITCHING**:
>    - Inside the demo ERP workspace, the Topbar and Sidebar include a persistent **Sector Switcher Pill / Dropdown** (e.g., `[ 🏥 Healthcare: Selam Hospital ▾ ]`).
>    - The user can switch to ANY of the 12 sectors on the fly at any time. Switching dynamically adapts the company name, TIN, sidebar sub-modules, sector KPIs, domain records, and task boards instantly without page reload.
> 6. **100% IDENTICAL UI & UX**: The visual design, layouts, dark/light themes, typography, Ethiopian localization, icons, 8 core views, and 12 interactive modals must be virtually indistinguishable from the flagship Beyond ERP production system.

---

## Table of Contents
1. [Target Experience & User Journey](#1-target-experience--user-journey)
2. [Login Page "Try Demo" & 12-Sector Selection Launcher](#2-login-page-try-demo--12-sector-selection-launcher)
3. [The 12 Ethiopian Sectors Blueprint](#3-the-12-ethiopian-sectors-blueprint)
4. [TypeScript Entity & Model Definitions](#4-typescript-entity--model-definitions)
5. [Redux Toolkit Store Architecture & Slices](#5-redux-toolkit-store-architecture--slices)
6. [Complete Seed Dataset for All 12 Sectors](#6-complete-seed-dataset-for-all-12-sectors)
7. [Ethiopian Localization & Regulatory Business Rules](#7-ethiopian-localization--regulatory-business-rules)
8. [Visual Design System & Styling (Tailwind / CSS)](#8-visual-design-system--styling-tailwind--css)
9. [ERP Shell Layout, Dynamic Sidebar & Topbar](#9-erp-shell-layout-dynamic-sidebar--topbar)
10. [Detailed Specifications for the 8 Core Views](#10-detailed-specifications-for-the-8-core-views)
11. [Detailed Specifications for the 12 Interactive Modals](#11-detailed-specifications-for-the-12-interactive-modals)
12. [Agent Step-by-Step Implementation Guide](#12-agent-step-by-step-implementation-guide)

---

## 1. Target Experience & User Journey

1. **Discovery on Login**: A visitor navigates to the website's `/login` page. Right next to the email/password fields or below the submit button, they see an eye-catching action: **"⚡ Try Live Demo (Instant Access)"**.
2. **Interactive Sector Selection**:
   - Clicking "Try Live Demo" opens a clean, responsive **Sector Selection Modal** displaying all **12 Ethiopian business sectors**.
   - Each sector card displays its distinct icon, brand color, official Ethiopian enterprise name (e.g., *Merkato Wholesale*, *Selam Hospital*, *Hawassa Garments*, *Rift Valley Farms*), description, and key module pills.
   - The user selects their sector of interest (or clicks "Quick Start" for default Retail).
3. **Provisioning In-Memory Workspace**:
   - Redux dispatches `loginAsDemo({ sectorId })`.
   - The in-memory state is seeded with that sector's company profile, staff, transactions, invoices, work items, and sector-specific domain records.
   - The router pushes to `/dashboard`.
4. **Seamless Sector Switching Inside the App**:
   - While exploring, the user clicks the Sector Switcher in the topbar or sidebar.
   - A dropdown or drawer lets them switch from Healthcare to Agriculture or Construction with a single click. The sidebar updates its modules, the company header changes, and the records table adapts seamlessly.
5. **Transient Ephemeral Reset**:
   - If the user reloads the browser (`F5` or Cmd+R), all in-memory changes disappear and the app cleanly returns to the initial state, satisfying the requirement that the demo leaves no persistent traces in storage.

---

## 2. Login Page "Try Demo" & 12-Sector Selection Launcher

In the existing login page component (e.g. `src/app/(auth)/login/page.tsx` or similar):

### UI Placement
Place the Demo trigger directly in the login form container:
```tsx
{/* Primary Sign In Button */}
<button type="submit" className="btn-primary">
  Sign in
</button>

{/* Instant Demo Divider */}
<div className="flex items-center gap-3 my-4">
  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
  <span className="text-xs uppercase font-bold text-slate-400">Or Experience Instantly</span>
  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
</div>

{/* TRY DEMO BUTTON (Opens Sector Modal) */}
<button
  type="button"
  onClick={() => dispatch(openModal({ type: "sector-select" }))}
  className="w-full h-11 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
>
  <span className="text-base">⚡</span>
  <span>Try Interactive Demo — Choose Sector</span>
</button>
```

### The Sector Selector Modal (`SectorSelectModal.tsx`)
When opened, renders a 12-card grid (searchable by keyword):
```tsx
<Modal title="Choose Your Industry Sector Demo" isOpen={isOpen} onClose={closeModal} maxWidth="max-w-4xl">
  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
    Select an Ethiopian business sector to explore its pre-configured modules, tax rules, and workflows:
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto pr-1">
    {SECTORS_CATALOG.map((sec) => (
      <button
        key={sec.id}
        onClick={() => {
          dispatch(loginAsDemo({ sectorId: sec.id, companyName: sec.defaultCompanyName }));
          dispatch(closeModal());
          router.push("/dashboard");
        }}
        className="flex flex-col text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm"
            style={{ background: `${sec.color}18`, color: sec.color }}
          >
            <i className={sec.icon} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {sec.name}
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {sec.defaultCompanyName}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2.5">
          {sec.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {sec.keyModules.slice(0, 3).map((mod) => (
            <span key={mod} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {mod}
            </span>
          ))}
          {sec.keyModules.length > 3 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-400">
              +{sec.keyModules.length - 3}
            </span>
          )}
        </div>
      </button>
    ))}
  </div>
</Modal>
```

---

## 3. The 12 Ethiopian Sectors Blueprint

Every sector in Beyond ERP has its own dedicated Ethiopian identity, specific modules, and custom domain entities:

| Sector ID | Sector Name | Default Company Name | Color | Key Operational Modules | Custom Domain Records |
|---|---|---|---|---|---|
| `retail-trading` | **Retail & Trading** | Merkato Wholesale & Retail PLC | `#f59e0b` | POS Checkout, Inventory, SKU Products, Customers, Suppliers, Sales Reports | Products (SKU, Price, Stock), Barcode Tags |
| `manufacturing` | **Manufacturing & Processing** | Hawassa Industrial Garments & Textile PLC | `#3b82f6` | BOM Costing, Production Orders, Quality Assurance, Machinery, Shifts, Finished Goods | Production Batches, Machine Maintenance, QA Inspections |
| `agriculture` | **Agriculture & Farming** | Rift Valley Coffee & Horticulture Farms PLC | `#10b981` | Crop Cycles, Livestock Events, Input Distribution, Harvest Yields, Warehouses, Cooperatives | Crop Blocks (Hectares, Yield), Livestock Tags, Fertilizer Inflow |
| `construction` | **Construction & Contracting** | Abyssinia Civil Engineering & Contracting PLC | `#ea580c` | Project Budgets, Daily Site Reports, Subcontractors, Plant Machinery, Safety Log, Client Billing | Project Sites (Bole Tower), Heavy Equipment Hours, BOQ Items |
| `healthcare` | **Healthcare & Specialized Clinics** | Selam General Hospital & Specialized Clinic | `#dc2626` | Patients EMR, Queue & OPD, Appointments, Inpatient & Beds, Pharmacy, Prescriptions, Lab & Radiology, Billing & Claims, EHMIS | Patient MRN Charts, Triage OPD Queue, Prescription Slips, Lab Orders |
| `education` | **Education & Schools** | Horizon International Academy | `#8b5cf6` | Students Directory, Attendance, Grade Books, Timetable, Tuition Fees, National Exams | Student Enrollments, Semester Fee Records, Class Rosters |
| `hospitality` | **Hotel & Hospitality** | Kuriftu Lakeside Resort & Conference Center | `#7c3aed` | Rooms & Rates, Bookings Folio, Restaurant / F&B, Housekeeping, Guests, Event Banquets | Room Units (Suites, Deluxe), Guest Folios, Event Hall Bookings |
| `transport-logistics` | **Transport & Logistics** | Ethio-Djibouti Corridor Logistics & Freight PLC | `#b45309` | Fleet Prime Movers, Cargo Waybills, Highway Routes, Drivers Roster, Fuel Logs, Vehicle Maintenance | Fleet Trucks (Plate Numbers), Waybill Consignments, Fuel Vouchers |
| `finance-banking` | **Microfinance & SACCOs** | Oromia Savings & Credit Cooperative (SACCO) | `#0284c7` | General Ledger, Member Savings, Microloan Schedules, Approvals, Reconciliations, Audit Cases | Member Passbooks, Loan Portfolio (Principal, Interest, Term) |
| `real-estate` | **Real Estate & Property** | Noah Commercial & Residential Real Estate PLC | `#059669` | Properties Portfolio, Tenants Directory, Leases, Rent Roll, Maintenance Work Orders, Viewings | Property Units (Plazas, Apartments), Active Lease Agreements |
| `ngo-development` | **NGO & Development Programs** | Hope for Children & Community Development Ethiopia | `#e11d48` | Donors & Funding, Grant Allocations, Beneficiaries, Procurement, Field Monitoring, Impact M&E | Grant Agreements, Community Outreach Rosters, Aid Distribution |
| `government-services` | **Government Services** | Addis Ababa Sub-City Citizen & Public Services | `#64748b` | Permits & Licenses, Citizens Registry, Service Cases, Revenue Receipts, Document Vault, Service Counters | Business Trade Licenses, Municipal Permits, Counter Queue Tickets |

---

## 4. TypeScript Entity & Model Definitions

Create `src/types/erp.ts`:

```ts
export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "STAFF" | "VIEWER";
export type AccountStatus = "ACTIVE" | "DISABLED";
export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionStatus = "COMPLETED" | "PENDING" | "DRAFT";
export type EmployeeStatus = "ACTIVE" | "INACTIVE";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
export type ApprovalStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
export type PayrollStatus = "DRAFT" | "APPROVED" | "PAID";
export type WorkItemStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type WorkItemPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  companyName: string;
  companyTinNumber: string;
  companySectorId: string;
  role: UserRole;
  permissions: string[];
  effectivePermissions: string[];
  status: AccountStatus;
  lastLoginAt: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  sectorId?: string | null;
  paymentMethod: string; // 'Telebirr' | 'Cash' | 'CBE Transfer' | 'Bank Transfer' | 'Amole'
  vatAmount: number;     // 15% VAT
  status: TransactionStatus;
  synced: boolean;
  occurredAt: string;
  createdAt?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  department: string;
  phone: string;         // +251 9...
  email?: string | null;
  salary: number;        // ETB
  status: EmployeeStatus;
  hiredDate: string;
  createdAt?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string | null;
  sectorId?: string | null;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;     // 15% VAT
  total: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate?: string | null;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  payerName: string;
  amount: number;
  paymentMethod: string;
  issuedAt: string;
}

export interface ExpenseApproval {
  id: string;
  title: string;
  amount: number;
  category: string;
  sectorId?: string | null;
  requestedById?: string | null;
  approvedById?: string | null;
  status: ApprovalStatus;
  notes?: string | null;
  requestedAt: string;
}

export interface ChartAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  active: boolean;
  balance?: number;
}

export interface PayrollRun {
  id: string;
  period: string; // 'YYYY-MM'
  status: PayrollStatus;
  grossPay: number;
  deductions: number; // 7.5% pension
  netPay: number;
  items: {
    employeeId?: string;
    employeeName: string;
    grossPay: number;
    deductions: number;
  }[];
  createdAt: string;
}

export interface SectorWorkItem {
  id: string;
  sectorId: string;
  title: string;
  description?: string | null;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  dueDate?: string | null;
  assignedToId?: string | null;
  createdAt: string;
}

export interface SectorRecord {
  id: string;
  sectorId: string;
  recordType: string; // 'Product', 'Vehicle', 'Patient', 'Booking', 'Crop', 'Project'
  title: string;
  ownerName?: string | null;
  status: "ACTIVE" | "PENDING" | "CLOSED";
  value?: number | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface SectorMeta {
  id: string;
  name: string;
  shortName: string;
  defaultCompanyName: string;
  defaultTin: string;
  icon: string;
  color: string;
  lightColor: string;
  textColor: string;
  description: string;
  keyModules: string[];
  navItems: { key: string; label: string; icon: string }[];
}

export interface Settings {
  companyName: string;
  tinNumber: string;
  companySectorId: string;
  businessType: string;
  language: "English" | "Amharic" | "Afaan Oromo" | "Tigrinya";
  currency: string;      // 'ETB'
  taxRate: number;       // 15
  telebirrEnabled: boolean;
  cbeEnabled: boolean;
  ehmisEnabled: boolean;
  emailEnabled: boolean;
  autoSync: boolean;
  vatRegistered: boolean;
}
```

---

## 5. Redux Toolkit Store Architecture & Slices

### Store Configuration (`src/store/index.ts`)
```ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import transactionsReducer from "./slices/transactionsSlice";
import employeesReducer from "./slices/employeesSlice";
import financeReducer from "./slices/financeSlice";
import sectorsReducer from "./slices/sectorsSlice";
import settingsReducer from "./slices/settingsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    employees: employeesReducer,
    finance: financeReducer,
    sectors: sectorsReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Slice Specifications

#### 1. `authSlice.ts`
- **State**: `user: User | null`, `isAuthenticated: boolean`, `isDemo: boolean`.
- **Reducers**:
  - `loginAsDemo(state, action: PayloadAction<{ sectorId: string; companyName?: string }>)`:
    Initializes user with `role: "OWNER"`, permissions: all, `companySectorId` set to payload, and `companyName` set to the sector's default enterprise name.
  - `switchRole(state, action: PayloadAction<UserRole>)`: Changes role between `OWNER`, `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` on the fly.
  - `logout(state)`: Clears user, sets `isAuthenticated = false`.

#### 2. `sectorsSlice.ts` (Core of Multi-Sector Logic)
- **State**:
  - `activeSectorId: string`: Current selected sector (e.g. `'healthcare'`).
  - `catalog: SectorMeta[]`: Full metadata array for all 12 sectors.
  - `recordsBySector: Record<string, SectorRecord[]>`: Seed records indexed by sector ID.
  - `workItemsBySector: Record<string, SectorWorkItem[]>`: Tasks indexed by sector ID.
- **Reducers**:
  - `switchSector(state, action: PayloadAction<string>)`: Changes `activeSectorId`.
  - `addSectorRecord(state, action: PayloadAction<Omit<SectorRecord, "id" | "createdAt">>)`: Appends record to current sector.
  - `deleteSectorRecord(state, action: PayloadAction<{ sectorId: string; id: string }>)`.
  - `addWorkItem(state, action: PayloadAction<Omit<SectorWorkItem, "id" | "createdAt">>)`.
  - `updateWorkItemStatus(state, action: PayloadAction<{ sectorId: string; id: string; status: WorkItemStatus }>)`.

#### 3. `settingsSlice.ts`
- **State**: `settings: Settings`.
- **Extra Reducers**:
  - Listening to `auth/loginAsDemo` and `sectors/switchSector`: Automatically synchronizes `settings.companySectorId` and `settings.companyName` with the chosen sector's default enterprise profile.
  - `updateSettings(state, action: PayloadAction<Partial<Settings>>)`.
  - `resetDemoSettings(state)`.

#### 4. `transactionsSlice.ts`
- **State**: `items: Transaction[]`, `search: string`, `filterType: "ALL" | "INCOME" | "EXPENSE"`, `filterSector: string`, `filterCategory: string`, `page: number`, `limit: number = 10`.
- **Reducers**:
  - `addTransaction`: Prepend transaction with auto 15% VAT.
  - `editTransaction`: Replace item by ID.
  - `deleteTransaction`: Filter out item.
  - `setSearch`, `setFilterType`, `setFilterSector`, `setPage`.

#### 5. `employeesSlice.ts`
- **State**: `items: Employee[]`, `search: string`, `filterDepartment: string`, `filterStatus: string`, `page: number`, `limit: number = 8`.
- **Reducers**: `addEmployee`, `editEmployee`, `deleteEmployee`, `toggleStatus`, `setSearch`, `setFilterDepartment`.

#### 6. `financeSlice.ts`
- **State**: `invoices: Invoice[]`, `receipts: Receipt[]`, `expenseApprovals: ExpenseApproval[]`, `chartOfAccounts: ChartAccount[]`, `payrollRuns: PayrollRun[]`.
- **Reducers**: `createInvoice`, `updateInvoiceStatus`, `createReceipt`, `createExpenseApproval`, `handleApprovalAction`, `createPayrollRun`.

#### 7. `uiSlice.ts`
- **State**: `sidebarCollapsed: boolean`, `activeModal: string | null`, `modalData: any`, `toastMessage: string | null`, `theme: "dark" | "light"`.
- **Reducers**: `toggleSidebar`, `setTheme`, `openModal`, `closeModal`, `showToast`, `hideToast`, `simulateSync`.

---

## 6. Complete Seed Dataset for All 12 Sectors

Place this complete catalog and seed dataset in `src/store/initialData.ts`:

### Catalog Definition for the 12 Sectors
```ts
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
```

### Initial Domain Records for All 12 Sectors
Seed at least 2 realistic records per sector in `recordsBySector`:
```ts
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
```

---

## 7. Ethiopian Localization & Regulatory Business Rules

Place these utilities in `src/utils/ethiopian.ts`:

### 1. Currency & Tabular Formatting
- Format: `ETB 85,000` (comma-delimited whole Birr).
```ts
export function formatCurrency(amount: number): string {
  return `ETB ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(amount || 0))}`;
}
```

### 2. Automatic 15% VAT & 2% Withholding
- When recording an invoice or transaction:
  $$\text{VAT Amount} = \text{Subtotal} \times 0.15$$
  $$\text{Total} = \text{Subtotal} + \text{VAT Amount}$$
  $$\text{Withholding (if B2B)} = \text{Subtotal} \times 0.02$$

### 3. Live Ethiopian Calendar Converter
Convert any Gregorian `Date` object into the authentic Ethiopian Calendar (`Meskerem` through `Pagume`):
```ts
export function getEthiopianDate(input = new Date()): string {
  const gregorianYear = input.getFullYear();
  const ethiopianYear = input.getMonth() > 8 || (input.getMonth() === 8 && input.getDate() >= 11)
    ? gregorianYear - 7
    : gregorianYear - 8;

  const months = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
    "Megabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehasa", "Pagume"
  ];

  const approxStart = new Date(gregorianYear, 8, 11);
  const start = input < approxStart ? new Date(gregorianYear - 1, 8, 11) : approxStart;
  const elapsedDays = Math.max(0, Math.floor((input.getTime() - start.getTime()) / 86400000));
  const monthIndex = Math.min(12, Math.floor(elapsedDays / 30));
  const day = (elapsedDays % 30) + 1;

  return `${String(day).padStart(2, "0")} ${months[monthIndex]} ${ethiopianYear} E.C.`;
}
```

### 4. 8 Ethiopian National Holidays Detector
Automatically checks whether today matches an Ethiopian national celebration and displays a celebratory badge:
```ts
export function getEthiopianHoliday(date = new Date()): string | null {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const holidays: [number, number, string][] = [
    [1, 7, "Ethiopian Christmas (Genna)"],
    [1, 19, "Timkat (Epiphany)"],
    [3, 2, "Victory of Adwa Day"],
    [5, 1, "International Labour Day"],
    [5, 5, "Patriots Victory Day"],
    [5, 28, "Derg Downfall Day (Ginbot 20)"],
    [9, 11, "Ethiopian New Year (Enkutatash)"],
    [9, 27, "Meskel (Finding of True Cross)"]
  ];
  const found = holidays.find(([hm, hd]) => hm === m && hd === d);
  return found ? found[2] : null;
}
```

### 5. Ethiopian Mobile Phone Validation
Accepts `+251 9...`, `09...`, or `+251 7...`:
```ts
export function validateEthiopianPhone(phone: string): boolean {
  return /^(\+251|0)?[97]\d{8}$/.test(phone.replace(/[\s\-]/g, ""));
}
```

---

## 8. Visual Design System & Styling (Tailwind / CSS)

### Color Tokens
Match the exact Beyond ERP enterprise palette:
- **Dark Mode (Default & Preferred)**:
  - Background Shell: `#070b14` or `#080e19`
  - Workspace Frame: `#0d1422`
  - Card Surface: `#0f1a2e` / `#111827`
  - Card Alt/Subtle: `#0a1220` / `#0d1828`
  - Border Lines: `#1a2d42` / `#1e2d3d`
  - Text Ink: `#e2e8f0` / `#ffffff`
  - Text Muted: `#94a3b8` / `#64748b`
- **Light Mode**:
  - Background Shell: `#e8edf7` / `#f5f8ff`
  - Workspace Frame: `#fbfaf6` / `#ffffff`
  - Card Surface: `#ffffff`
  - Card Alt: `#f8fafc`
  - Border Lines: `#e2e8f0` / `#dbe3ee`
  - Text Ink: `#0f172a`
  - Text Muted: `#64748b`
- **Brand Accents**:
  - Brand Blue: `#2563eb` (`hover: #1d4ed8`)
  - Deep Blue: `#1e3a8a`
  - Revenue Green: `#10b981` (Background: `#071812` / `#f0fdf4`)
  - Expense Red: `#f43f5e` (Background: `#1c0a10` / `#fff1f2`)
  - Pending Amber: `#f59e0b` (Background: `#150f02` / `#fffbeb`)

---

## 9. ERP Shell Layout, Dynamic Sidebar & Topbar

Construct `src/components/erp/AppLayout.tsx`:

### 1. Left Sidebar Navigation
- **Width**: `234px` when expanded, `60px` when collapsed (toggle button with `ChevronLeft` / `ChevronRight`).
- **Brand Header**: 32px blue icon tile with logo, "Beyond ERP", active sector badge.
- **Universal Top**:
  1. `Dashboard` (`<LayoutDashboard size={18} />`) -> `/dashboard`
  2. `Transactions` (`<Receipt size={18} />`) -> `/transactions`
  3. `Employees` (`<Users size={18} />`) -> `/employees`
- **Dynamic Sector Modules Accordion**:
  - Automatically loads the `navItems` belonging to the current `activeSectorId`.
  - For Healthcare: `Patients`, `Queue & OPD`, `Appointments`, `IPD & Beds`, `Pharmacy`, `Prescriptions`, `Lab`, `Billing`.
  - For Retail: `POS Checkout`, `Inventory`, `Products`, `Customers`, `Suppliers`, `Sales Reports`.
  - For Agriculture: `Crop Cycles`, `Livestock`, `Input Distribution`, `Harvest Yields`, `Warehouses`.
  - For Construction: `Project Budgets`, `Site Reports`, `Subcontractors`, `Equipment`, `Safety`.
  - Includes a direct button: `[ Switch Sector ]` which opens the 12-Sector Selector.
- **Universal Bottom**:
  4. `Finance` (`<CircleDollarSign size={18} />`) -> `/finance`
  5. `Reports` (`<BarChart3 size={18} />`) -> `/reports`
  6. `Admin` (`<ShieldCheck size={18} />`) -> `/admin`
  7. `Settings` (`<Settings size={18} />`) -> `/settings`

### 2. Top Header Bar with Sector Switcher
- **Left**:
  - Time-of-day greeting (e.g. `Morning · Tue, 03 Nov`).
  - **Dynamic Sector Switcher Pill**:
    ```tsx
    <button
      onClick={() => dispatch(openModal({ type: "sector-select" }))}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-500/20 transition-all"
    >
      <i className={activeSector.icon} />
      <span>{settings.companyName}</span>
      <ChevronDown size={14} className="opacity-60" />
    </button>
    ```
- **Right Action Strip**:
  - **Connection Chip**: `<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">DEMO · IN-MEMORY</span>`
  - **Theme Toggle**: `<Sun />` / `<Moon />` button.
  - **Sync Pending Button**: Rotating sync icon; clicking simulates instant cloud reconciliation with a toast.
  - **User Profile Pill**: 32px gradient avatar with initials (`YG`), First Name, and role badge (`owner`).
  - **Sign Out Button**: Dispatches `logout()`, routes back to login.

### 3. Ethiopian Calendar Strip
Directly underneath the header:
- Icon `<Calendar size={14} />`
- Bold text: `03 Tikimt 2019 E.C.`
- Subtext: `· VAT 15% · ETB · NBE Compliant`
- If today is a holiday, show celebratory pill: `🎉 Timkat (Epiphany)`

---

## 10. Detailed Specifications for the 8 Core Views

### View 1: Dashboard (`/dashboard`)
1. **Welcome Eyebrow**: *"Welcome to your {activeSector.name} workspace. Powered by Beyond ERP."*
2. **4 KPI Stat Cards**:
   - **Revenue**: `ETB 264,000` (+12% vs last month)
   - **Expenses**: `ETB 106,800` (+3%)
   - **Net Profit**: `ETB 157,200` (+8%)
   - **Sector Operational Units**: `48` active items (e.g. 48 Patients, 48 SKUs, or 48 Freight trips)
3. **Primary Action Strip**:
   - `[+ Add Transaction]` -> Opens `TransactionModal`.
   - `[📱 telebirr Instant Pay]` -> Opens `TelebirrModal`.
   - `[🔄 Switch Sector]` -> Opens `SectorSelectModal`.
4. **12-Month Revenue Chart**: SVG / CSS bar chart rendering 12 monthly bars (Jan–Dec).
5. **Sector Revenue Breakdown**: Progress bars comparing all active sector divisions.
6. **Recent Transactions Table**: 5 latest transactions with type, description, and colored amount.

---

### View 2: Transactions (`/transactions`)
1. **Summary KPIs**: Total Income, Total Expenses, Net Margin, Record Count.
2. **Filter & Search Bar**: Type tabs (`[ All ]`, `[ Income ]`, `[ Expense ]`), live search, sector selector, payment method selector (`Telebirr`, `Cash`, `CBE Transfer`).
3. **Data Table**: Columns: `Date`, `Description`, `Sector Tag`, `Payment Method`, `Amount (ETB)`, `15% VAT`, `Status`, `Actions`.
4. **Row Actions**: Edit, Delete, Barcode lookup.

---

### View 3: Employees (`/employees`)
1. **Staff Metrics**: Total Staff, Active, On Leave, Monthly Payroll (ETB).
2. **Header Action**: `[+ Add Employee]` button.
3. **Filters**: Department filter, Status filter, search input.
4. **Staff Table**: Avatar with initials, Full Name, Position, Department, Phone (+251 format), Salary (ETB), Status toggle pill (`ACTIVE` / `INACTIVE`).

---

### View 4: Finance & Accounting (`/finance`)
Divided into 4 sub-tabs:
1. **Invoices**: Issue B2B invoices with line items and automatic 15% VAT calculation.
2. **Expense Approvals**: Managerial requisitions pipeline (`[Approve]`, `[Reject]`, `[Mark Paid]`).
3. **Payroll Runs**: `[⚡ Run Monthly Payroll]` button computes gross, 7.5% pension deductions, and net payments for all active staff in the current sector.
4. **Chart of Accounts & P&L**: General ledger accounts (`Cash & Bank`, `Receivables`, `Payables`, `Revenue`) with real-time balance sheet.

---

### View 5: Tax & Business Reports (`/reports`)
1. **Official Ethiopian Tax Statement**:
   - Legal ERCA/NBE filing schedule format.
   - Company Name, TIN, Ethiopian Date (`03 Tikimt 2019 E.C.`).
   - Taxable Revenue (`ETB 264,000`), 15% VAT (`ETB 39,600`), 2% Withholding (`ETB 5,280`), Net Tax Due.
2. **Actions**: `[Download CSV]`, `[Print Report]` (triggers clean browser print).

---

### View 6: Sectors & Domain Workflows (`/sectors`)
1. **Sector Overview**: Displays all 12 sectors with active indicator on the currently selected sector.
2. **Active Sector Domain Records**:
   - Renders the domain records for the current sector (e.g. Products for Retail, Patients for Healthcare, Crops for Agriculture, Vehicles for Logistics).
   - Button to `[+ Add Domain Record]`.
3. **Work Items Kanban Board**:
   - Task columns: `TODO`, `IN PROGRESS`, `DONE`.
   - Users can drag or click to progress tasks.

---

### View 7: Admin & Permissions (`/admin`)
1. **Role-Based Access Control (RBAC) Switcher**:
   - Quick role switcher buttons: `[OWNER]`, `[ADMIN]`, `[MANAGER]`, `[STAFF]`, `[VIEWER]`.
   - Real-time permission matrix demonstrating access restrictions.
2. **User Management Table**: Operators list with role badges and status toggles.
3. **Audit Log Timeline**: Live chronological stream of system events.

---

### View 8: Settings (`/settings`)
1. **Company Profile**: Company Name, 10-digit TIN, Business Type (`PLC`, `Sole Proprietorship`).
2. **Language Switcher**: `English`, `Amharic (አማርኛ)`, `Afaan Oromo`, `Tigrinya (ትግርኛ)`.
3. **Payment Rails Switchboard**: Toggles for `telebirr Enterprise`, `CBE / Awash Bank`, `eHMIS`.
4. **Danger Zone**: `[Reset Demo State]` button restoring initial seed data.

---

## 11. Detailed Specifications for the 12 Interactive Modals

All modals are managed through Redux `uiSlice.activeModal`:

1. **`SectorSelectModal`**: The 12-sector visual grid launcher with search and 1-click provisioning.
2. **`TransactionModal`**: Record income/expense with 15% VAT, sector selection, payment method (`Telebirr`, `CBE`, `Cash`).
3. **`EmployeeModal`**: Staff registration with full name, department, phone (+251 validation), and salary.
4. **`AdminModal`**: Sector admin assignment with granular feature checklists.
5. **`ManagerModal`**: Sector manager delegation.
6. **`TelebirrModal`**: Fast telebirr payment window with phone number, amount in ETB, and purpose.
7. **`BarcodeModal`**: Barcode scanner & SKU generator simulation.
8. **`ConfirmModal`**: Reusable confirmation dialog for deletions or resets.
9. **`WorkItemModal`**: Add or edit sector tasks (title, priority, status, due date).
10. **`SectorRecordModal`**: Add sector-specific domain records (Product SKU, Patient MRN, Vehicle Plate, Crop Block).
11. **`DomainWorkflowModal`**: Quick action form for sector-specific operational routines.
12. **`FailedOpsModal`**: Offline queue inspector with Retry and Clear actions.

---

## 12. Agent Step-by-Step Implementation Guide

Follow these exact steps to implement this demo:

### Step 1: Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux lucide-react
```

### Step 2: Create Redux Slices & Store
1. Put the TypeScript models in `src/types/erp.ts`.
2. Put the 12-sector catalog and seed datasets in `src/store/initialData.ts`.
3. Implement the 7 Redux slices in `src/store/slices/`:
   - `authSlice.ts`, `sectorsSlice.ts`, `transactionsSlice.ts`, `employeesSlice.ts`, `financeSlice.ts`, `settingsSlice.ts`, `uiSlice.ts`.
4. Assemble `src/store/index.ts` and wrap your demo route or app root in `<Provider store={store}>`.
5. **IMPORTANT**: Do NOT add any `localStorage` synchronization for transactional data so reload cleanly resets the demo.

### Step 3: Implement Login Page "Try Demo" & Sector Selector Modal
1. Add the "Try Live Demo" button to your login screen.
2. Mount `SectorSelectModal` so clicking opens the 12-sector grid.
3. Wire sector selection to dispatch `loginAsDemo({ sectorId })` and navigate to `/dashboard`.

### Step 4: Build Layout Shell & Utilities
1. Create `src/utils/ethiopian.ts` (calendar, holidays, currency, phone validation).
2. Create `src/components/erp/Sidebar.tsx` (dynamic modules accordion based on `activeSectorId`).
3. Create `src/components/erp/Topbar.tsx` (with the persistent Sector Switcher pill).
4. Create `src/components/erp/AppLayout.tsx` (topbar, calendar strip, sidebar, modal container, toast).

### Step 5: Implement the 8 Views & 12 Modals
1. Create the 8 views in `src/components/erp/views/`:
   - `DashboardView`, `TransactionsView`, `EmployeesView`, `FinanceView`, `ReportsView`, `SectorsView`, `AdminView`, `SettingsView`.
2. Connect all forms and action buttons directly to Redux dispatches.
3. Build the 12 modals in `src/components/erp/modals/`.

### Step 6: Verification Checklist
- [ ] On `/login`: Click **"⚡ Try Live Demo"** -> `SectorSelectModal` opens with all 12 Ethiopian sectors.
- [ ] Click **"Agriculture"** -> Workspace launches as *Rift Valley Coffee & Horticulture Farms PLC*, sidebar shows Crop Cycles & Harvest modules.
- [ ] Click the **Sector Switcher** in the topbar -> Select **"Healthcare"** -> App immediately adapts to *Selam General Hospital*, sidebar updates to Patients & Pharmacy.
- [ ] Add a transaction or employee -> Balance and tables update instantly in Redux.
- [ ] Refresh the page (`F5`) -> Everything disappears and cleanly resets to the initial demo state.
