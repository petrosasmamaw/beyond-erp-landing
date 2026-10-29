import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./auth.js";
import { domainWorkflows } from "./domain-workflows.js";
import {
  demoAccounts,
  demoEmployees,
  demoExpenseApprovals,
  demoInvoices,
  demoLedgerEntries,
  demoPayrollRuns,
  demoReceipts,
  demoSectorRecords,
  demoTransactions,
  demoUsers,
  demoWorkItems,
  sectors
} from "./seed-data.js";

export async function seedDatabase(prisma: PrismaClient) {
  for (const sector of sectors) {
    await prisma.sector.upsert({
      where: { id: sector.id },
      update: sector,
      create: sector
    });
  }

  await prisma.appSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "Beyond ERP Demo PLC",
      tinNumber: "0012345678",
      companySectorId: "retail-trading",
      businessType: "PLC",
      language: "English",
      currency: "ETB",
      taxRate: 15,
      telebirrEnabled: true,
      cbeEnabled: false,
      ehmisEnabled: false,
      emailEnabled: false,
      telegramEnabled: false,
      smsEnabled: false,
      offlineMode: true,
      autoSync: true,
      dataCompression: true,
      vatRegistered: true
    }
  });

  for (const employee of demoEmployees) {
    await prisma.employee.upsert({
      where: { id: employee.id },
      update: employee,
      create: employee
    });
  }

  for (const user of demoUsers) {
    const passwordHash = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        companyName: "Beyond ERP Demo PLC",
        companyTinNumber: "0012345678",
        companySectorId: "retail-trading",
        role: user.role,
        passwordHash
      },
      create: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        companyName: "Beyond ERP Demo PLC",
        companyTinNumber: "0012345678",
        companySectorId: "retail-trading",
        role: user.role,
        passwordHash
      }
    });
  }

  for (const transaction of demoTransactions) {
    await prisma.transaction.upsert({
      where: { id: transaction.id },
      update: transaction,
      create: transaction
    });
  }

  for (const workItem of demoWorkItems) {
    await prisma.sectorWorkItem.upsert({
      where: { id: workItem.id },
      update: workItem,
      create: workItem
    });
  }

  for (const account of demoAccounts) {
    await prisma.chartAccount.upsert({
      where: { id: account.id },
      update: account,
      create: account
    });
  }

  for (const invoice of demoInvoices) {
    await prisma.invoice.upsert({
      where: { id: invoice.id },
      update: invoice,
      create: invoice
    });
  }

  for (const receipt of demoReceipts) {
    await prisma.receipt.upsert({
      where: { id: receipt.id },
      update: receipt,
      create: receipt
    });
  }

  for (const approval of demoExpenseApprovals) {
    await prisma.expenseApproval.upsert({
      where: { id: approval.id },
      update: approval,
      create: approval
    });
  }

  for (const entry of demoLedgerEntries) {
    await prisma.ledgerEntry.upsert({
      where: { id: entry.id },
      update: entry,
      create: entry
    });
  }

  for (const payroll of demoPayrollRuns) {
    await prisma.payrollRun.upsert({
      where: { id: payroll.id },
      update: payroll,
      create: payroll
    });
  }

  for (const record of demoSectorRecords) {
    await prisma.sectorRecord.upsert({
      where: { id: record.id },
      update: record,
      create: record
    });
  }

  for (const [sectorId, workflows] of Object.entries(domainWorkflows)) {
    const workflow = workflows[0];
    if (!workflow) continue;
    const values = Object.fromEntries(
      workflow.fields.map((field) => [
        field.name,
        field.type === "number" ? 100 : field.type === "date" ? new Date().toISOString().slice(0, 10) : field.label
      ])
    );
    await prisma.sectorRecord.upsert({
      where: { id: `domain-${sectorId}-${workflow.key}` },
      update: {
        sectorId,
        recordType: workflow.recordType,
        title: workflow.title,
        ownerName: "Beyond Demo",
        value: workflow.valueField ? Number(values[workflow.valueField] ?? 0) : null,
        metadata: {
          workflowKey: workflow.key,
          workflowTitle: workflow.title,
          values
        }
      },
      create: {
        id: `domain-${sectorId}-${workflow.key}`,
        sectorId,
        recordType: workflow.recordType,
        title: workflow.title,
        ownerName: "Beyond Demo",
        value: workflow.valueField ? Number(values[workflow.valueField] ?? 0) : null,
        metadata: {
          workflowKey: workflow.key,
          workflowTitle: workflow.title,
          values
        }
      }
    });
  }
}
