import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ChartAccount,
  Employee,
  ExpenseApproval,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  PayrollRun,
  Receipt,
} from "@/types/erp";
import {
  INITIAL_ACCOUNTS,
  INITIAL_APPROVALS,
  INITIAL_INVOICES,
  INITIAL_PAYROLL,
  INITIAL_RECEIPTS,
} from "../initialData";

export interface FinanceState {
  invoices: Invoice[];
  receipts: Receipt[];
  expenseApprovals: ExpenseApproval[];
  chartOfAccounts: ChartAccount[];
  payrollRuns: PayrollRun[];
}

const initialState: FinanceState = {
  invoices: INITIAL_INVOICES,
  receipts: INITIAL_RECEIPTS,
  expenseApprovals: INITIAL_APPROVALS,
  chartOfAccounts: INITIAL_ACCOUNTS,
  payrollRuns: INITIAL_PAYROLL,
};

export const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    createInvoice: (
      state,
      action: PayloadAction<{
        customerName: string;
        customerPhone?: string;
        items: InvoiceItem[];
        sectorId?: string;
        dueDate?: string;
      }>
    ) => {
      const items = action.payload.items;
      const subtotal = items.reduce((acc, it) => acc + (it.quantity || 1) * (it.unitPrice || 0), 0);
      const vatAmount = Math.round(subtotal * 0.15);
      const total = subtotal + vatAmount;
      const count = state.invoices.length + 1;
      const invoiceNumber = `INV-2026-${String(count).padStart(3, "0")}`;

      const newInv: Invoice = {
        id: `inv-${Date.now().toString(36)}`,
        invoiceNumber,
        customerName: action.payload.customerName,
        customerPhone: action.payload.customerPhone ?? null,
        sectorId: action.payload.sectorId ?? "healthcare",
        items,
        subtotal,
        vatAmount,
        total,
        status: "SENT",
        issuedAt: new Date().toISOString(),
        dueDate: action.payload.dueDate ?? new Date(Date.now() + 14 * 86400000).toISOString(),
      };
      state.invoices.unshift(newInv);
    },
    updateInvoiceStatus: (
      state,
      action: PayloadAction<{ id: string; status: InvoiceStatus }>
    ) => {
      const inv = state.invoices.find((i) => i.id === action.payload.id);
      if (inv) {
        inv.status = action.payload.status;
      }
    },
    createReceipt: (
      state,
      action: PayloadAction<{ payerName: string; amount: number; paymentMethod: string }>
    ) => {
      const count = state.receipts.length + 1;
      const receiptNumber = `REC-2026-${String(count).padStart(3, "0")}`;
      const newRec: Receipt = {
        id: `rec-${Date.now().toString(36)}`,
        receiptNumber,
        payerName: action.payload.payerName,
        amount: action.payload.amount,
        paymentMethod: action.payload.paymentMethod,
        issuedAt: new Date().toISOString(),
      };
      state.receipts.unshift(newRec);
    },
    createExpenseApproval: (
      state,
      action: PayloadAction<{ title: string; amount: number; category: string; sectorId?: string; notes?: string }>
    ) => {
      const newApproval: ExpenseApproval = {
        id: `ea-${Date.now().toString(36)}`,
        title: action.payload.title,
        amount: action.payload.amount,
        category: action.payload.category,
        sectorId: action.payload.sectorId ?? null,
        requestedById: "demo-user-1",
        status: "REQUESTED",
        notes: action.payload.notes ?? null,
        requestedAt: new Date().toISOString(),
      };
      state.expenseApprovals.unshift(newApproval);
    },
    handleApprovalAction: (
      state,
      action: PayloadAction<{ id: string; action: "approve" | "reject" | "pay" }>
    ) => {
      const item = state.expenseApprovals.find((a) => a.id === action.payload.id);
      if (item) {
        if (action.payload.action === "approve") {
          item.status = "APPROVED";
          item.approvedById = "demo-user-1";
        } else if (action.payload.action === "reject") {
          item.status = "REJECTED";
        } else if (action.payload.action === "pay") {
          item.status = "PAID";
        }
      }
    },
    createPayrollRun: (
      state,
      action: PayloadAction<{ period?: string; employees: Employee[] }>
    ) => {
      const activeEmps = action.payload.employees.filter((e) => e.status === "ACTIVE");
      const grossPay = activeEmps.reduce((acc, e) => acc + (e.salary || 0), 0);
      const deductions = Math.round(grossPay * 0.075);
      const netPay = grossPay - deductions;
      const period = action.payload.period ?? new Date().toISOString().slice(0, 7);

      const run: PayrollRun = {
        id: `pr-${Date.now().toString(36)}`,
        period,
        status: "APPROVED",
        grossPay,
        deductions,
        netPay,
        items: activeEmps.map((e) => ({
          employeeId: e.id,
          employeeName: e.fullName,
          grossPay: e.salary,
          deductions: Math.round(e.salary * 0.075),
        })),
        createdAt: new Date().toISOString(),
      };
      state.payrollRuns.unshift(run);
    },
    resetFinance: (state) => {
      state.invoices = INITIAL_INVOICES;
      state.receipts = INITIAL_RECEIPTS;
      state.expenseApprovals = INITIAL_APPROVALS;
      state.chartOfAccounts = INITIAL_ACCOUNTS;
      state.payrollRuns = INITIAL_PAYROLL;
    },
  },
});

export const {
  createInvoice,
  updateInvoiceStatus,
  createReceipt,
  createExpenseApproval,
  handleApprovalAction,
  createPayrollRun,
  resetFinance,
} = financeSlice.actions;

export default financeSlice.reducer;

