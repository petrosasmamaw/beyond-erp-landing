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
  lastLoginAt?: string | null;
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

