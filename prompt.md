# Master Specification & Prompt: Building an In-Memory Redux Toolkit Demo of Beyond ERP

> **Instructions for the Code Agent**:
> You are tasked with integrating an **interactive, fully functional, 100% client-side DEMO of Beyond ERP** into an existing web application.
> 
> **CRITICAL ARCHITECTURAL CONSTRAINTS**:
> 1. **ZERO BACKEND / ZERO API / ZERO DATABASE**: The demo must NOT require any backend server, Express API, Prisma, PostgreSQL, or external network requests.
> 2. **STATE DRIVEN BY REDUX TOOLKIT**: All business logic, CRUD operations, transactions, staff, invoicing, approvals, permissions, and settings must be managed exclusively in **Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)**.
> 3. **DISAPPEAR ON PAGE RELOAD (TRANSIENT IN-MEMORY STATE)**: When the user refreshes or reloads the browser (`F5` or Cmd+R), **all modified state must cleanly reset / disappear** back to the initial pristine demo state (or back to the login screen). Do NOT persist transactional edits to `localStorage` or `IndexedDB`.
> 4. **LOGIN PAGE "TRY DEMO" INTEGRATION**: On the target website's login page, directly next to or beneath the login inputs, provide a prominent, high-converting **"⚡ Try Live Demo"** button. Clicking this button immediately logs the user into the complete demo ERP as an `OWNER` without asking for credentials.
> 5. **100% IDENTICAL UI & UX**: The visual design, layouts, dark/light themes, typography, Ethiopian localization, icons, 8 core views, and 11 modals must be virtually indistinguishable from the flagship Beyond ERP production system.

---

## Table of Contents
1. [Target Experience & User Journey](#1-target-experience--user-journey)
2. [Login Page "Try Demo" Integration](#2-login-page-try-demo-integration)
3. [TypeScript Entity & Model Definitions](#3-typescript-entity--model-definitions)
4. [Redux Toolkit Store Architecture & Slices](#4-redux-toolkit-store-architecture--slices)
5. [Complete Initial Demo Seed Dataset](#5-complete-initial-demo-seed-dataset)
6. [Ethiopian Localization & Regulatory Business Rules](#6-ethiopian-localization--regulatory-business-rules)
7. [Visual Design System & Styling (Tailwind / CSS)](#7-visual-design-system--styling-tailwind--css)
8. [ERP Shell Layout, Sidebar & Topbar](#8-erp-shell-layout-sidebar--topbar)
9. [Detailed Specifications for the 8 Core Views](#9-detailed-specifications-for-the-8-core-views)
10. [Detailed Specifications for the 11 Interactive Modals](#10-detailed-specifications-for-the-11-interactive-modals)
11. [Agent Step-by-Step Implementation Guide](#11-agent-step-by-step-implementation-guide)

---

## 1. Target Experience & User Journey

1. **Discovery on Login**: A visitor navigates to the website's `/login` page. Right next to the email/password fields or below the submit button, they see an eye-catching action: **"⚡ Explore Live Demo (Instant Access)"**.
2. **One-Click Instant Access**: Clicking "Try Demo" triggers a Redux action `loginAsDemo()` which initializes the in-memory Redux state and redirects the user to `/dashboard` (or `/demo/dashboard`).
3. **Full Interactive ERP Workspace**:
   - The user sees a live dashboard with realistic Ethiopian company figures (ETB 264,000 revenue, 15% VAT calculations, 12-month bar chart, quick actions).
   - The user can add, edit, or delete transactions; add staff; approve expense requests; issue VAT invoices; run payroll; explore 12 Ethiopian sector workflows; switch roles; and toggle themes.
   - Every action updates the Redux store instantly with realistic toast notifications.
4. **Transient Reset**: If the user reloads the page, all additions/deletions vanish and return to the pristine initial demo state, exactly satisfying the requirement that the demo is ephemeral and disappears on reload.

---

## 2. Login Page "Try Demo" Integration

In the existing login page component (e.g. `src/app/(auth)/login/page.tsx` or similar):

### UI Placement
Place the Demo trigger directly in the right form card:
- Provide a secondary hero button or split action container:
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

  {/* TRY DEMO BUTTON */}
  <button
    type="button"
    onClick={handleTryDemo}
    className="w-full h-11 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
  >
    <span className="text-base">⚡</span>
    <span>Try Interactive Demo (No Sign-up)</span>
  </button>
  ```

### Optional Quick Sector Dropdown / Preset Selector
Allow the user to test different Ethiopian sector workspaces with 1 click:
- `Selam Medical Center` (Healthcare · Hospital & Clinic)
- `Merkato Wholesale PLC` (Retail & Trade · Merchandise & POS)
- `Rift Valley Agro Farm` (Agriculture · Crops & Livestock)
- `Ethio Freight Logistics` (Transport · Fleet & Freight)

### Redux Dispatch on Click
```ts
const handleTryDemo = (sectorId: string = "healthcare") => {
  dispatch(loginAsDemo({ sectorId }));
  router.push("/dashboard");
};
```

---

## 3. TypeScript Entity & Model Definitions

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
  phone: string;         // Validated against Ethiopian format (+251 9... / 09...)
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
  deductions: number; // 7.5% pension / tax estimate
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
  recordType: string; // 'Product', 'Vehicle', 'Patient', 'Booking'
  title: string;
  ownerName?: string | null;
  status: "ACTIVE" | "PENDING" | "CLOSED";
  value?: number | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
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

## 4. Redux Toolkit Store Architecture & Slices

Install packages in the target project:
```bash
npm install @reduxjs/toolkit react-redux lucide-react
```

### Store Root Configuration (`src/store/index.ts`)
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

### Slice Details

#### 1. `authSlice.ts`
- **State**: `user: User | null`, `isAuthenticated: boolean`, `isDemo: boolean`.
- **Reducers**:
  - `loginAsDemo(state, action: PayloadAction<{ sectorId?: string; companyName?: string }>)`: Sets pre-populated demo user (`role: "OWNER"`, permissions: all, sector set to payload).
  - `switchRole(state, action: PayloadAction<UserRole>)`: Allows changing role on-the-fly to test RBAC (e.g. test as Staff or Viewer).
  - `logout(state)`: Clears user, sets `isAuthenticated = false`.

#### 2. `transactionsSlice.ts`
- **State**: `items: Transaction[]`, `search: string`, `filterType: "ALL" | "INCOME" | "EXPENSE"`, `filterSector: string`, `filterCategory: string`, `page: number`, `limit: number = 10`.
- **Reducers**:
  - `addTransaction(state, action: PayloadAction<Omit<Transaction, "id" | "createdAt" | "synced">>)`: Prepends a new transaction, auto-calculates 15% VAT if applicable, sets `synced: true`.
  - `editTransaction(state, action: PayloadAction<Transaction>)`: Replaces existing item by id.
  - `deleteTransaction(state, action: PayloadAction<string>)`: Removes item by id.
  - `setSearch`, `setFilterType`, `setFilterSector`, `setPage`.

#### 3. `employeesSlice.ts`
- **State**: `items: Employee[]`, `search: string`, `filterDepartment: string`, `filterStatus: string`, `page: number`, `limit: number = 8`.
- **Reducers**:
  - `addEmployee(state, action: PayloadAction<Omit<Employee, "id" | "createdAt">>)`: Adds staff with generated id.
  - `editEmployee(state, action: PayloadAction<Employee>)`: Updates staff details.
  - `deleteEmployee(state, action: PayloadAction<string>)`: Removes staff.
  - `toggleStatus(state, action: PayloadAction<string>)`: Flips `ACTIVE` <-> `INACTIVE`.

#### 4. `financeSlice.ts`
- **State**: `invoices: Invoice[]`, `receipts: Receipt[]`, `expenseApprovals: ExpenseApproval[]`, `chartOfAccounts: ChartAccount[]`, `payrollRuns: PayrollRun[]`.
- **Reducers**:
  - `createInvoice(state, action: PayloadAction<{ customerName: string; customerPhone?: string; items: InvoiceItem[]; sectorId?: string }>)`:
    Calculates subtotal = sum(q * p), vatAmount = subtotal * 0.15, total = subtotal + vatAmount, generates `INV-2026-XXX`, status `SENT`.
  - `updateInvoiceStatus(state, action: PayloadAction<{ id: string; status: InvoiceStatus }>)`.
  - `createReceipt(state, action: PayloadAction<{ payerName: string; amount: number; paymentMethod: string }>)`.
  - `createExpenseApproval(state, action: PayloadAction<{ title: string; amount: number; category: string; notes?: string }>)`: Generates approval with status `REQUESTED`.
  - `handleApprovalAction(state, action: PayloadAction<{ id: string; action: "approve" | "reject" | "pay" }>)`: Transitions approval to `APPROVED`, `REJECTED`, or `PAID`.
  - `createPayrollRun(state, action: PayloadAction<{ period: string; employees: Employee[] }>)`: Computes gross, 7.5% deduction, net pay, sets status `APPROVED`.

#### 5. `sectorsSlice.ts`
- **State**: `activeSectorId: string`, `sectors: Sector[]`, `workItems: SectorWorkItem[]`, `records: SectorRecord[]`.
- **Reducers**:
  - `setActiveSector(state, action: PayloadAction<string>)`: Changes current sector context (e.g. from retail to healthcare).
  - `addWorkItem(state, action: PayloadAction<Omit<SectorWorkItem, "id" | "createdAt">>)`.
  - `updateWorkItemStatus(state, action: PayloadAction<{ id: string; status: WorkItemStatus }>)`.
  - `addSectorRecord(state, action: PayloadAction<Omit<SectorRecord, "id" | "createdAt">>)`.

#### 6. `settingsSlice.ts`
- **State**: `settings: Settings` initialized to Ethiopian defaults (`currency: "ETB"`, `taxRate: 15`, `language: "English"`, `telebirrEnabled: true`, `cbeEnabled: true`).
- **Reducers**:
  - `updateSettings(state, action: PayloadAction<Partial<Settings>>)`.
  - `resetSettingsToDefault(state)`: Restores original demo setup.

#### 7. `uiSlice.ts`
- **State**: `sidebarCollapsed: boolean = false`, `activeModal: string | null = null`, `modalData: any = null`, `toastMessage: string | null = null`, `theme: "dark" | "light" = "dark"`, `pendingSyncCount: number = 0`.
- **Reducers**:
  - `toggleSidebar(state)`, `setTheme(state, action: PayloadAction<"dark" | "light">)`.
  - `openModal(state, action: PayloadAction<{ type: string; data?: any }>)`.
  - `closeModal(state)`.
  - `showToast(state, action: PayloadAction<string>)`.
  - `hideToast(state)`.
  - `simulateSync(state)`: Sets pending sync to 0 and shows toast "All operations synced to ledger".

---

## 5. Complete Initial Demo Seed Dataset

Embed these seed constants directly in `src/store/initialData.ts`:

### User Seed
```ts
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
```

### Transactions Seed (12 Realistic Transactions)
```ts
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
```

### Employees Seed (6 Staff Members)
```ts
export const INITIAL_EMPLOYEES: Employee[] = [
  { id: "e1", fullName: "Dr. Abebe Bekele", position: "Chief Medical Officer", department: "Clinical", phone: "+251911000001", email: "abebe@selam.et", salary: 38000, status: "ACTIVE", hiredDate: "2024-01-15" },
  { id: "e2", fullName: "Tigist Haile", position: "Senior Accountant", department: "Finance", phone: "+251911000002", email: "tigist@selam.et", salary: 22000, status: "ACTIVE", hiredDate: "2024-03-01" },
  { id: "e3", fullName: "Dawit Mekonnen", position: "Lead Dispatcher / Fleet", department: "Logistics", phone: "+251911000003", email: "dawit@selam.et", salary: 14000, status: "ACTIVE", hiredDate: "2024-06-10" },
  { id: "e4", fullName: "Hanan Mohammed", position: "Front Desk & Triage", department: "Admin", phone: "+251911000004", email: "hanan@selam.et", salary: 12000, status: "ACTIVE", hiredDate: "2024-08-20" },
  { id: "e5", fullName: "Solomon Girma", position: "Systems & Network Lead", department: "Tech", phone: "+251911000005", email: "solomon@selam.et", salary: 28000, status: "ACTIVE", hiredDate: "2024-11-05" },
  { id: "e6", fullName: "Mekdes Tadesse", position: "Pharmacy Dispenser", department: "Pharmacy", phone: "+251911000006", email: null, salary: 11500, status: "INACTIVE", hiredDate: "2023-12-01" },
];
```

### Invoices & Finance Seed
```ts
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

export const INITIAL_APPROVALS: ExpenseApproval[] = [
  { id: "ea1", title: "Digital Ultrasound Calibration Kit", amount: 24500, category: "Equipment", sectorId: "healthcare", requestedById: "e1", status: "REQUESTED", notes: "Annual precision calibration certified by EFDA", requestedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ea2", title: "Backup Generator Diesel Delivery", amount: 16000, category: "Utilities", sectorId: null, requestedById: "e3", approvedById: "demo-user-1", status: "APPROVED", notes: "400 Liters for surgical theater standby", requestedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "ea3", title: "Electronic Health Records Tablet Mounts", amount: 8200, category: "Tech", sectorId: "healthcare", requestedById: "e5", approvedById: "demo-user-1", status: "PAID", notes: "Mounted in Triage Room 1-3", requestedAt: new Date(Date.now() - 14 * 86400000).toISOString() },
];
```

---

## 6. Ethiopian Localization & Regulatory Business Rules

Place these utilities in `src/utils/ethiopian.ts`:

### 1. Currency & Tabular Numbers
- Format: `ETB 85,000` (no decimals for whole Birr, comma-delimited).
```ts
export function formatCurrency(amount: number): string {
  return `ETB ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(amount || 0))}`;
}
```

### 2. Automatic 15% VAT & 2% Withholding
- When recording an invoice or transaction with VAT enabled:
  $$\text{VAT Amount} = \text{Subtotal} \times 0.15$$
  $$\text{Total} = \text{Subtotal} + \text{VAT Amount}$$
  $$\text{Withholding (if applicable)} = \text{Subtotal} \times 0.02$$

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

## 7. Visual Design System & Styling (Tailwind / CSS)

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
  - Tech / SACCO Purple: `#7c3aed`

### Typography
- Primary UI: `Inter`, system font stack.
- Display / Logo / Brand Headings: `"Instrument Serif", Georgia, serif`.
- Data tables & metrics: `font-mono` or `font-feature-settings: 'tnum'`.

---

## 8. ERP Shell Layout, Sidebar & Topbar

Construct `src/components/erp/AppLayout.tsx`:

### 1. Left Sidebar Navigation
- **Width**: `234px` when expanded, `60px` when collapsed (toggle button with `ChevronLeft` / `ChevronRight`).
- **Brand Header**: 32px blue icon tile with logo, "Beyond ERP", active sector badge.
- **Universal Top**:
  1. `Dashboard` (`fa-chart-pie` / `<LayoutDashboard size={18} />`) -> `/dashboard`
  2. `Transactions` (`fa-money-bill-transfer` / `<Receipt size={18} />`) -> `/transactions`
  3. `Employees` (`fa-users` / `<Users size={18} />`) -> `/employees`
- **Sector Modules Accordion**:
  - Shows specialized workflows for active sector (e.g. Healthcare: `Patients`, `Queue OPD`, `Pharmacy`, `Lab`, `Billing`, `EHMIS`).
  - Or quick jump to `/sectors` to change active sector.
- **Universal Bottom**:
  4. `Finance` (`fa-file-invoice-dollar` / `<CircleDollarSign size={18} />`) -> `/finance`
  5. `Reports` (`fa-chart-column` / `<BarChart3 size={18} />`) -> `/reports`
  6. `Admin` (`fa-shield-halved` / `<ShieldCheck size={18} />`) -> `/admin`
  7. `Settings` (`fa-gear` / `<Settings size={18} />`) -> `/settings`

### 2. Top Header Bar
- **Left**: Time-of-day greeting (e.g. `Morning · Tue, 03 Nov`) + Bold Company Name (`Selam Medical & Trading PLC`).
- **Right Action Strip**:
  - **Connection Chip**: `<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">DEMO MODE · IN-MEMORY</span>`
  - **Theme Toggle**: `<Sun />` / `<Moon />` icon button.
  - **Sync Pending Button**: Rotating sync icon; clicking simulates instant cloud reconciliation with a toast.
  - **User Profile Pill**: 32px gradient avatar with user initials (`YG`), First Name, and role badge (`owner`).
  - **Sign Out Button**: Dispatches `logout()`, routes back to login.

### 3. Ethiopian Calendar Strip
Directly underneath the header:
- Icon `<Calendar size={14} />`
- Bold text: `03 Tikimt 2019 E.C.`
- Subtext: `· VAT 15% · ETB · NBE Compliant`
- If today is a holiday, show celebratory pill: `🎉 Timkat (Epiphany)`

### 4. Toast Notification System
Fixed floating pill at bottom-right or top-center (`z-50`), animating in whenever an action is performed:
*"Transaction added"*, *"Invoice INV-2026-004 created"*, *"Employee status toggled"*. Auto-dismisses in 2.5s.

---

## 9. Detailed Specifications for the 8 Core Views

### View 1: Dashboard (`/dashboard`)
1. **Welcome Eyebrow**: *"Good Morning, Yohannes. Here is your Ethiopian enterprise summary today."*
2. **4 KPI Stat Cards**:
   - **Revenue**: `ETB 264,000` (+12% vs last month)
   - **Expenses**: `ETB 106,800` (+3%)
   - **Net Profit**: `ETB 157,200` (+8%)
   - **Pending Sync**: `1` (Amber warning badge)
3. **Primary Action Strip**:
   - `[+ Add Transaction]` -> Opens `TransactionModal`.
   - `[📱 telebirr Instant Pay]` -> Opens `TelebirrModal`.
   - `[📋 Issue VAT Invoice]` -> Navigates to `/finance`.
4. **12-Month Revenue Chart**:
   - Clean SVG or CSS bar chart rendering 12 monthly bars (Jan–Dec).
   - Tooltip or active bar showing current peak month.
5. **Sector Revenue Breakdown**:
   - Progress bar indicators: Retail & Trade (48%), Healthcare (26%), Logistics (12%), Other (14%).
6. **Recent Transactions Table**:
   - 5 latest transactions with type icon, description, category, date, and colored amount (+ETB / -ETB).

---

### View 2: Transactions (`/transactions`)
1. **Summary KPIs**: Total Income, Total Expenses, Net Margin, Record Count.
2. **Filter & Search Bar**:
   - Type Tabs: `[ All ]`, `[ Income ]`, `[ Expense ]`.
   - Live Search Input: Filters by description or category.
   - Dropdown Filters: Sector selection, Payment Method (Telebirr, Cash, CBE, Bank).
3. **Data Table**:
   - Columns: `Date`, `Description & Category`, `Sector`, `Payment Method`, `Amount (ETB)`, `15% VAT`, `Status`, `Actions`.
   - Badges: `Telebirr` (cyan), `Cash` (amber), `CBE Transfer` (purple).
4. **Row Actions**:
   - Edit (opens modal pre-filled).
   - Delete (dispatches Redux delete, shows toast).
   - Barcode Quick View.
5. **Pagination Controls**: `Previous`, `Next`, Page numbers.

---

### View 3: Employees (`/employees`)
1. **Staff Metrics**: Total Staff (6), Active (5), On Leave / Inactive (1), Monthly Payroll (`ETB 125,500`).
2. **Header Action**: `[+ Add Employee]` button.
3. **Filters**: Department filter (Clinical, Finance, Logistics, Admin, Tech), Status filter.
4. **Staff Table**:
   - Avatar with initials and deterministic dynamic color.
   - Full Name & Email.
   - Position & Department.
   - Phone (+251 formatted).
   - Monthly Salary (formatted in ETB).
   - Status toggle pill (Click to toggle `ACTIVE` / `INACTIVE`).
   - Edit / Delete actions.

---

### View 4: Finance & Accounting (`/finance`)
Divided into 4 sub-tabs:
1. **Sub-Tab 1: Invoices**:
   - List of B2B invoices with customer name, phone, item summary, 15% VAT, total, and status badge (`PAID`, `SENT`, `DRAFT`, `OVERDUE`).
   - `[+ Issue Invoice]` button opens a drawer/modal allowing multi-item entry. Automatically calculates 15% VAT.
2. **Sub-Tab 2: Expense Approvals**:
   - List of internal purchase requisitions (e.g. Ultrasound calibration, generator fuel).
   - Interactive buttons: `[Approve]`, `[Reject]`, `[Mark Paid]`. Clicking dispatches instant Redux status updates.
3. **Sub-Tab 3: Payroll Runs**:
   - Historical payroll runs.
   - `[⚡ Run Monthly Payroll]` button: Automatically generates a payroll batch from all active employees in `employeesSlice`, computing standard 7.5% pension deductions and net payments.
4. **Sub-Tab 4: Chart of Accounts & P&L**:
   - Interactive general ledger accounts (`1000 Cash & Bank`, `1200 Receivables`, `2000 Accounts Payable`, `4000 Revenue`).
   - Summary display of Net Cash Flow and Balance Sheet.

---

### View 5: Tax & Business Reports (`/reports`)
1. **Official Ethiopian Tax Report Card**:
   - Designed to look like a legal ERCA/NBE filing schedule.
   - Includes: Company Name, TIN `0012345678`, Ethiopian Date `03 Tikimt 2019 E.C.`.
   - Taxable Revenue: `ETB 264,000`
   - VAT (15%): `ETB 39,600`
   - Withholding Tax (2%): `ETB 5,280`
   - Total Net Liability.
2. **Actions**:
   - `[Download CSV]`: Simulates/triggers clean CSV file generation.
   - `[Print Report]`: Triggers standard `window.print()` (with clean `@media print` styling hiding the sidebar).

---

### View 6: Sectors & Workflows (`/sectors`)
1. **12 Sector Grid**:
   - Retail & Trading, Healthcare, Agriculture, Construction, Manufacturing, Education, Hospitality, Transport, Finance/Banking, Real Estate, NGO, Government Services.
2. **Sector Detail & Work Items Kanban**:
   - Clicking any sector opens its dedicated workspace.
   - Task Board with columns: `TODO`, `IN PROGRESS`, `DONE`.
   - Users can add tasks or drag/click to change status.
3. **Domain Records Table**:
   - For Healthcare: Patients list, Diagnoses, MRN numbers.
   - For Retail: Products inventory, stock quantities, barcode SKUs.
   - For Logistics: Fleet vehicles, plate numbers, status.

---

### View 7: Admin & Permissions (`/admin`)
1. **Role-Based Access Control (RBAC) Switcher**:
   - Allows the tester to switch their active demo role between: `OWNER`, `ADMIN`, `MANAGER`, `STAFF`, `VIEWER`.
   - Explains how permissions restrict financial approvals and employee salary visibility.
2. **User Management Table**:
   - Lists operators with role badges, email, status (`ACTIVE` / `DISABLED`).
   - Button to `[Add User]` or toggle status.
3. **Audit Log Timeline**:
   - Live stream of recent system security events (e.g. `INVOICE_CREATED`, `LOGIN_SUCCESS`, `TRANSACTION_EXPORT`).

---

### View 8: Settings (`/settings`)
1. **Company Profile**:
   - Company Name input (`Selam Medical & Trading PLC`).
   - Taxpayer Identification Number (TIN: 10 digits).
   - Business Type: `PLC`, `Sole Proprietorship`, `Share Company`.
2. **Language Selector**:
   - `English`, `Amharic (አማርኛ)`, `Afaan Oromo`, `Tigrinya (ትግርኛ)`.
3. **Ethiopian Integrations Switchboard**:
   - Toggle switch for `telebirr Enterprise` (Direct merchant mobile clearing).
   - Toggle switch for `CBE / Awash Bank` (Bank settlement).
   - Toggle switch for `eHMIS Integration` (Ministry of Health).
4. **Danger Zone / Demo Cache Reset**:
   - `[Reset Demo State]` button: Resets the Redux store back to the factory demo seed with a confirmation toast.

---

## 10. Detailed Specifications for the 11 Interactive Modals

All modals must be controlled via Redux `uiSlice.activeModal`:

1. **`TransactionModal`**:
   - Inputs: Type toggle (`INCOME` / `EXPENSE`), Amount (ETB), 15% VAT toggle, Description, Category, Payment Method (`Telebirr`, `Cash`, `CBE Transfer`, `Bank`), Date.
2. **`EmployeeModal`**:
   - Inputs: Full Name, Position, Department, Phone (`+251 9...`), Email, Monthly Salary (ETB), Hire Date.
3. **`AdminModal`**:
   - Inputs: Add new admin/staff to sector, feature permissions checklist.
4. **`ManagerModal`**:
   - Assign sector manager and delegate domain features.
5. **`TelebirrModal`**:
   - Fast payment window: Customer/Vendor Phone (`09...`), Amount (ETB), Purpose, auto 15% VAT. Submitting creates a completed transaction instantly.
6. **`BarcodeModal`**:
   - Visual SVG/CSS barcode generator + lookup simulation for SKU verification.
7. **`ConfirmModal`**:
   - Reusable dialog for deletion or reset confirmation (`Are you sure you want to delete...?`).
8. **`WorkItemModal`**:
   - Add/edit sector task: Title, Priority (`Low`, `Medium`, `High`, `Urgent`), Status, Due Date.
9. **`SectorRecordModal`**:
   - Add domain record (e.g. Patient, Product SKU, Vehicle Plate Number).
10. **`DomainWorkflowModal`**:
    - Quick action form tailored to specific sector workflows.
11. **`FailedOpsModal`**:
    - Queue viewer showing offline items with `Retry` and `Clear` buttons.

---

## 11. Agent Step-by-Step Implementation Guide

When you (the code agent) implement this demo, follow these exact phases:

### Phase 1: Dependencies & Setup
1. Verify `@reduxjs/toolkit` and `react-redux` are installed.
2. Install `lucide-react` (or ensure SVG icon equivalents are available).

### Phase 2: Create Redux Store & Slices
1. Create `src/types/erp.ts` from Section 3.
2. Create `src/store/initialData.ts` containing the complete initial seeds from Section 5.
3. Create all 7 slices in `src/store/slices/`:
   - `authSlice.ts`
   - `transactionsSlice.ts`
   - `employeesSlice.ts`
   - `financeSlice.ts`
   - `sectorsSlice.ts`
   - `settingsSlice.ts`
   - `uiSlice.ts`
4. Assemble `src/store/index.ts` and wrap the app or demo route in `<Provider store={store}>`.
5. **Crucial**: Ensure NO `redux-persist` or `localStorage.setItem` for data state so reload resets cleanly.

### Phase 3: Add "Try Demo" to Login Page
1. Locate the existing login page component.
2. Insert the "Try Live Demo" button directly beside/beneath the inputs as specified in Section 2.
3. Wire the button to dispatch `loginAsDemo()` and navigate to the ERP workspace.

### Phase 4: Build Layout Shell & Utilities
1. Create `src/utils/ethiopian.ts` with calendar, holiday, and currency helpers.
2. Create `src/components/erp/Sidebar.tsx` and `src/components/erp/Topbar.tsx`.
3. Create `src/components/erp/AppLayout.tsx` handling responsive grid, modal rendering, and toast banner.

### Phase 5: Implement Views & Modals
1. Build `DashboardView`, `TransactionsView`, `EmployeesView`, `FinanceView`, `ReportsView`, `SectorsView`, `AdminView`, `SettingsView`.
2. Connect all forms and buttons to dispatch Redux actions directly (`addTransaction`, `addEmployee`, etc.).
3. Implement the 11 modals inside `src/components/erp/modals/`.

### Phase 6: Verification Checklist
- [ ] Visit `/login` -> Click **"⚡ Try Live Demo"** -> Instantly lands on `/dashboard`.
- [ ] Add a transaction -> Balance updates, chart reflects change, transaction appears in table.
- [ ] Add an employee -> Employee count increases, payroll summary updates.
- [ ] Create an invoice -> 15% VAT auto-calculates, total reflects correctly.
- [ ] Hit browser Refresh (`F5`) -> App reloads cleanly back to pristine initial demo state without lingering edits.

