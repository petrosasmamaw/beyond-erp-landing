export type TeamMemberType = "ADMIN" | "MANAGER";
export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionStatus = "COMPLETED" | "PENDING" | "DRAFT";
export type EmployeeStatus = "ACTIVE" | "INACTIVE";
export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "STAFF" | "VIEWER";
export type AccountStatus = "ACTIVE" | "DISABLED";
export type RegistrationStatus = "PENDING_PAYMENT" | "PAID" | "APPROVED" | "REJECTED";
export type WorkItemStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type WorkItemPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
export type ApprovalStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
export type PayrollStatus = "DRAFT" | "APPROVED" | "PAID";
export type SectorRecordStatus = "ACTIVE" | "PENDING" | "CLOSED";

export type TeamMember = {
  id: string;
  type: TeamMemberType;
  fullName: string;
  contact?: string | null;
  department?: string | null;
  permissions?: string[] | null;
  assignedFeatures?: string[] | null;
  sectorId: string;
  createdAt: string;
};

export type Sector = {
  id: string;
  name: string;
  icon: string;
  color: string;
  lightColor: string;
  textColor: string;
  description: string;
  features: string[];
  teamMembers: TeamMember[];
  workItems?: SectorWorkItem[];
  sectorRecords?: SectorRecord[];
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  companyTinNumber?: string | null;
  companySectorId?: string | null;
  role: UserRole;
  permissions: string[];
  effectivePermissions: string[];
  status: AccountStatus;
  lastLoginAt?: string | null;
  createdAt: string;
};

export type SectorWorkItem = {
  id: string;
  sectorId: string;
  title: string;
  description?: string | null;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  dueDate?: string | null;
  assignedToId?: string | null;
  createdById?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  sectorId?: string | null;
  paymentMethod: string;
  vatAmount: number;
  status: TransactionStatus;
  synced: boolean;
  occurredAt: string;
  createdAt?: string;
};

export type Employee = {
  id: string;
  fullName: string;
  position: string;
  department: string;
  phone: string;
  email?: string | null;
  salary: number;
  status: EmployeeStatus;
  hiredDate: string;
  createdAt?: string;
};

export type Settings = {
  id: string;
  companyName: string;
  tinNumber: string;
  companySectorId?: string | null;
  businessType: string;
  language: string;
  currency: string;
  taxRate: number;
  telebirrEnabled: boolean;
  cbeEnabled: boolean;
  ehmisEnabled: boolean;
  emailEnabled: boolean;
  telegramEnabled: boolean;
  smsEnabled: boolean;
  offlineMode: boolean;
  autoSync: boolean;
  dataCompression: boolean;
  vatRegistered: boolean;
};

export type AuditLog = {
  id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  method: string;
  path: string;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

export type EmailLog = {
  id: string;
  to: string;
  subject: string;
  status: "SENT" | "FAILED" | "SKIPPED";
  provider: string;
  messageId?: string | null;
  error?: string | null;
  createdAt: string;
};

export type RegistrationRequest = {
  id: string;
  companyName: string;
  tinNumber?: string | null;
  sectorId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  notes?: string | null;
  status: RegistrationStatus;
  paymentReference?: string | null;
  approvedById?: string | null;
  createdUserId?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string | null;
  sectorId?: string | null;
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  vatAmount: number;
  total: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate?: string | null;
};

export type Receipt = {
  id: string;
  receiptNumber: string;
  payerName: string;
  amount: number;
  paymentMethod: string;
  issuedAt: string;
};

export type ExpenseApproval = {
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
};

export type ChartAccount = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  active: boolean;
};

export type PayrollRun = {
  id: string;
  period: string;
  status: PayrollStatus;
  grossPay: number;
  deductions: number;
  netPay: number;
  items: { employeeId?: string; employeeName: string; grossPay: number; deductions: number }[];
  createdAt: string;
};

export type SectorRecord = {
  id: string;
  sectorId: string;
  recordType: string;
  title: string;
  ownerName?: string | null;
  status: SectorRecordStatus;
  value?: number | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type FinanceSummary = {
  profitLoss: {
    revenue: number;
    expenses: number;
    netProfit: number;
    invoiced: number;
  };
  cashFlow: {
    inflow: number;
    outflow: number;
    netCash: number;
  };
  balanceSheet: {
    code: string;
    name: string;
    type: AccountType;
    balance: number;
  }[];
};

export type DomainWorkflowField = {
  name: string;
  label: string;
  type: "text" | "number" | "date";
  required?: boolean;
};

export type DomainWorkflow = {
  key: string;
  sectorId: string;
  recordType: string;
  title: string;
  description: string;
  valueField?: string;
  fields: DomainWorkflowField[];
};

export type Dashboard = {
  stats: {
    revenue: number;
    expenses: number;
    netProfit: number;
    pendingSync: number;
    employeeCount: number;
    sectorCount: number;
  };
  taxSummary: {
    taxableRevenue: number;
    vat: number;
    withholding: number;
    totalTaxLiability: number;
  };
  revenueChart: number[];
  sectorBreakdown: {
    sector: string;
    amount: number;
    percentage: number;
  }[];
  recentTransactions: Transaction[];
};

export type NewTransactionInput = Omit<Transaction, "id" | "createdAt">;
export type NewEmployeeInput = Omit<Employee, "id" | "createdAt">;
