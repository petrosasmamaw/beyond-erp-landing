import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import {
  AccountStatus,
  AccountType,
  ApprovalStatus,
  EmployeeStatus,
  EmailStatus,
  InvoiceStatus,
  PayrollStatus,
  Prisma,
  PrismaClient,
  RegistrationStatus,
  SectorRecordStatus,
  TeamMemberType,
  TransactionStatus,
  TransactionType,
  UserRole,
  WorkItemPriority,
  WorkItemStatus
} from "@prisma/client";
import type { AppSetting, Employee, Transaction } from "@prisma/client";
import { z } from "zod";
import {
  authenticate,
  hashPassword,
  requirePermission,
  sanitizeUser,
  signToken,
  verifyPassword
} from "./auth.js";
import { domainWorkflows, getWorkflow } from "./domain-workflows.js";
import { sendEmail, welcomeEmail } from "./email.js";
import { seedDatabase } from "./seed.js";

export const prisma = new PrismaClient();
const setupOtpStore = new Map<string, { otp: string; expiresAt: number }>();
const resetOtpStore = new Map<string, { otp: string; expiresAt: number }>();
export const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.use(cors({ origin: process.env.WEB_ORIGIN ?? true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

const currencyAmount = z.coerce.number().positive().finite();

const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  amount: currencyAmount,
  description: z.string().min(2).max(250),
  category: z.string().min(2),
  sectorId: z.string().optional().nullable(),
  paymentMethod: z.string().min(2),
  vatAmount: z.coerce.number().min(0).finite().default(0),
  status: z.nativeEnum(TransactionStatus).default(TransactionStatus.COMPLETED),
  synced: z.boolean().default(true),
  occurredAt: z.coerce.date().optional()
});

const employeeSchema = z.object({
  fullName: z.string().min(2).max(120),
  position: z.string().min(2).max(120),
  department: z.string().min(2).max(120),
  phone: z.string().min(9).max(32),
  email: z.string().email().optional().or(z.literal("")),
  salary: currencyAmount,
  hiredDate: z.coerce.date(),
  status: z.nativeEnum(EmployeeStatus).default(EmployeeStatus.ACTIVE)
});

const adminSchema = z.object({
  fullName: z.string().min(2).max(120),
  contact: z.string().min(5).max(120),
  permissions: z.array(z.string()).default([])
});

const managerSchema = z.object({
  fullName: z.string().min(2).max(120),
  department: z.string().min(2).max(120),
  assignedFeatures: z.array(z.string()).default([])
});

const settingsSchema = z.object({
  companyName: z.string().min(2).max(160).optional(),
  tinNumber: z.string().min(3).max(32).optional(),
  companySectorId: z.string().min(2).max(80).optional(),
  businessType: z.string().min(2).max(80).optional(),
  language: z.string().min(2).max(80).optional(),
  telebirrEnabled: z.boolean().optional(),
  cbeEnabled: z.boolean().optional(),
  ehmisEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  telegramEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  offlineMode: z.boolean().optional(),
  autoSync: z.boolean().optional(),
  dataCompression: z.boolean().optional(),
  vatRegistered: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(6)
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8)
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).default("Beyond@12345")
});

const userSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().min(9).max(32).optional().or(z.literal("")),
  companyName: z.string().min(2).max(160).optional().or(z.literal("")),
  companyTinNumber: z.string().min(3).max(32).optional().or(z.literal("")),
  companySectorId: z.string().min(2).max(80).optional().or(z.literal("")),
  password: z.string().min(8).optional(),
  role: z.nativeEnum(UserRole).default(UserRole.STAFF),
  permissions: z.array(z.string()).default([])
});

const updateUserSchema = userSchema.partial().extend({
  status: z.nativeEnum(AccountStatus).optional()
});

const workItemSchema = z.object({
  sectorId: z.string().min(2),
  title: z.string().min(2).max(160),
  description: z.string().max(500).optional().or(z.literal("")),
  status: z.nativeEnum(WorkItemStatus).default(WorkItemStatus.TODO),
  priority: z.nativeEnum(WorkItemPriority).default(WorkItemPriority.MEDIUM),
  dueDate: z.coerce.date().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional()
});

const emailTestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(2).max(120).default("Beyond ERP email test"),
  message: z.string().min(2).max(1000).default("Your Nodemailer adapter is working.")
});

const invoiceItemSchema = z.object({
  description: z.string().min(2).max(160),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative()
});

const invoiceSchema = z.object({
  customerName: z.string().min(2).max(160),
  customerPhone: z.string().max(32).optional().or(z.literal("")),
  sectorId: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
  dueDate: z.coerce.date().optional().nullable()
});

const receiptSchema = z.object({
  transactionId: z.string().optional().nullable(),
  payerName: z.string().min(2).max(160),
  amount: currencyAmount,
  paymentMethod: z.string().min(2)
});

const expenseApprovalSchema = z.object({
  title: z.string().min(2).max(160),
  amount: currencyAmount,
  category: z.string().min(2),
  sectorId: z.string().optional().nullable(),
  status: z.nativeEnum(ApprovalStatus).default(ApprovalStatus.REQUESTED),
  notes: z.string().max(500).optional().or(z.literal(""))
});

const accountSchema = z.object({
  code: z.string().min(2).max(32),
  name: z.string().min(2).max(120),
  type: z.nativeEnum(AccountType),
  description: z.string().max(300).optional().or(z.literal("")),
  active: z.boolean().default(true)
});

const ledgerEntrySchema = z.object({
  accountId: z.string().min(2),
  debit: z.coerce.number().min(0).default(0),
  credit: z.coerce.number().min(0).default(0),
  description: z.string().min(2).max(250),
  reference: z.string().max(120).optional().or(z.literal("")),
  occurredAt: z.coerce.date().optional()
});

const payrollRunSchema = z.object({
  period: z.string().min(4).max(24),
  status: z.nativeEnum(PayrollStatus).default(PayrollStatus.DRAFT),
  items: z
    .array(
      z.object({
        employeeId: z.string().optional(),
        employeeName: z.string().min(2),
        grossPay: z.coerce.number().min(0),
        deductions: z.coerce.number().min(0).default(0)
      })
    )
    .min(1)
});

const sectorRecordSchema = z.object({
  sectorId: z.string().min(2),
  recordType: z.string().min(2).max(80),
  title: z.string().min(2).max(160),
  ownerName: z.string().max(120).optional().or(z.literal("")),
  status: z.nativeEnum(SectorRecordStatus).default(SectorRecordStatus.ACTIVE),
  value: z.coerce.number().min(0).optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable()
});

const registrationRequestSchema = z.object({
  companyName: z.string().min(2).max(160),
  tinNumber: z.string().max(32).optional().or(z.literal("")),
  sectorId: z.string().min(2).max(80),
  fullName: z.string().min(2).max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().min(9).max(32).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal(""))
});

const registrationActionSchema = z.object({
  paymentReference: z.string().max(120).optional().or(z.literal("")),
  temporaryPassword: z.string().min(8).default("Beyond@12345"),
  rejectionReason: z.string().max(500).optional().or(z.literal(""))
});

const domainWorkflowSchema = z.object({
  values: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
  ownerName: z.string().max(120).optional().or(z.literal("")),
  status: z.nativeEnum(SectorRecordStatus).default(SectorRecordStatus.ACTIVE)
});

function toNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

function serializeTransaction(transaction: Transaction) {
  if (!transaction) return transaction;
  return {
    ...transaction,
    amount: toNumber(transaction.amount),
    vatAmount: toNumber(transaction.vatAmount)
  };
}

function serializeEmployee(employee: Employee) {
  if (!employee) return employee;
  return {
    ...employee,
    salary: toNumber(employee.salary)
  };
}

function serializeSettings(settings: AppSetting) {
  if (!settings) return settings;
  return {
    ...settings,
    taxRate: toNumber(settings.taxRate)
  };
}

function nextDocumentNumber(prefix: string) {
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;
}

function calculateInvoice(items: z.infer<typeof invoiceItemSchema>[]) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = subtotal * 0.15;
  return {
    subtotal,
    vatAmount,
    total: subtotal + vatAmount
  };
}

function serializeMoneyRecord<T extends Record<string, unknown>>(record: T) {
  const copy: Record<string, unknown> = { ...record };
  for (const key of ["amount", "subtotal", "vatAmount", "total", "debit", "credit", "grossPay", "deductions", "netPay", "value"]) {
    if (copy[key] !== undefined && copy[key] !== null) {
      copy[key] = toNumber(copy[key] as Prisma.Decimal);
    }
  }
  return copy as T;
}

function pagination(req: Request) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 50)));
  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

function auditTrail(): express.RequestHandler {
  return (req, res, next) => {
    res.on("finish", () => {
      if (req.method === "GET" || res.statusCode >= 500) return;

      void prisma.auditLog.create({
        data: {
          actorId: req.user?.id,
          actorEmail: req.user?.email,
          action: `${req.method} ${req.path}`,
          method: req.method,
          path: req.originalUrl,
          ip: req.ip,
          userAgent: req.header("user-agent"),
          metadata: {
            statusCode: res.statusCode
          }
        }
      });
    });

    next();
  };
}

function getMonthWindow() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
  };
}

async function ensureSeeded() {
  const sectorCount = await prisma.sector.count();
  if (sectorCount === 0) {
    await seedDatabase(prisma);
  }
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "beyond-erp-api" });
});

app.get("/api/auth/needs-setup", async (_req, res, next) => {
  try {
    const count = await prisma.user.count();
    res.json({ needsSetup: count === 0 });
  } catch (error) {
    next(error);
  }
});

const setupFormSchema = z.object({
  companyName: z.string().min(2),
  tinNumber: z.string().optional(),
  sectorId: z.string().min(2).max(80).optional(),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const setupSchema = setupFormSchema.extend({ otp: z.string().length(6) });

app.post("/api/auth/setup/send-otp", async (req, res, next) => {
  try {
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      res.status(409).json({ message: "Setup already completed." });
      return;
    }
    const input = setupFormSchema.parse(req.body);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setupOtpStore.set(input.email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    await sendEmail(prisma, {
      to: input.email,
      subject: "Your Beyond ERP verification code",
      text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto"><p>Your Beyond ERP setup verification code is:</p><div style="letter-spacing:8px;font-size:36px;font-weight:bold;color:#1a5c38;padding:16px 0">${otp}</div><p style="color:#888;font-size:13px">Expires in 10 minutes. Do not share this code.</p></div>`
    });
    res.json({ message: "Verification code sent to your email" });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/setup", async (req, res, next) => {
  try {
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      res.status(409).json({ message: "Setup already completed. Use the Admin panel to add users." });
      return;
    }

    const input = setupSchema.parse(req.body);

    const stored = setupOtpStore.get(input.email);
    if (!stored || stored.otp !== input.otp || Date.now() > stored.expiresAt) {
      res.status(400).json({ message: "Invalid or expired verification code" });
      return;
    }
    setupOtpStore.delete(input.email);

    await prisma.appSetting.upsert({
      where: { id: "default" },
      update: { companyName: input.companyName, tinNumber: input.tinNumber ?? "", companySectorId: input.sectorId ?? "retail-trading" },
      create: {
        id: "default",
        companyName: input.companyName,
        tinNumber: input.tinNumber ?? "",
        companySectorId: input.sectorId ?? "retail-trading",
        businessType: "PLC",
        language: "English",
        currency: "ETB",
        taxRate: 15,
        telebirrEnabled: false,
        cbeEnabled: false,
        ehmisEnabled: false,
        emailEnabled: false,
        telegramEnabled: false,
        smsEnabled: false,
        offlineMode: true,
        autoSync: true,
        dataCompression: false,
        vatRegistered: true
      }
    });

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        companyName: input.companyName,
        companyTinNumber: input.tinNumber ?? null,
        companySectorId: input.sectorId ?? "retail-trading",
        passwordHash: await hashPassword(input.password),
        role: UserRole.OWNER,
        permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"]
      }
    });

    await seedDatabase(prisma);

    res.status(201).json({
      token: signToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (user.status !== AccountStatus.ACTIVE) {
      res.status(403).json({ message: "Account is disabled" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    res.json({
      token: signToken(updatedUser),
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/forgot-password", async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      resetOtpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
      await sendEmail(prisma, {
        to: email,
        subject: "Reset your Beyond ERP password",
        text: `Your password reset code is: ${otp}\n\nExpires in 10 minutes. If you did not request this, ignore this email.`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:auto"><p>Your Beyond ERP password reset code is:</p><div style="letter-spacing:8px;font-size:36px;font-weight:bold;color:#1a5c38;padding:16px 0">${otp}</div><p style="color:#888;font-size:13px">Expires in 10 minutes. If you didn't request this, ignore this email.</p></div>`
      });
    }
    res.json({ message: "If that email exists, a reset code was sent" });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/reset-password", async (req, res, next) => {
  try {
    const { email, otp, newPassword } = z.object({
      email: z.string().email(),
      otp: z.string().length(6),
      newPassword: z.string().min(8)
    }).parse(req.body);
    const stored = resetOtpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
      res.status(400).json({ message: "Invalid or expired reset code" });
      return;
    }
    resetOtpStore.delete(email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) }
    });
    res.json({ message: "Password reset successful. You can now sign in." });
  } catch (error) {
    next(error);
  }
});

app.post("/api/registration-requests", async (req, res, next) => {
  try {
    const input = registrationRequestSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      res.status(409).json({ message: "An account already exists for this email. Please sign in or contact support." });
      return;
    }

    const openRequest = await prisma.registrationRequest.findFirst({
      where: {
        email: input.email,
        status: { in: [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.PAID] }
      }
    });
    if (openRequest) {
      res.status(409).json({ message: "A registration request for this email is already waiting for approval." });
      return;
    }

    const request = await prisma.registrationRequest.create({
      data: {
        companyName: input.companyName,
        tinNumber: input.tinNumber || null,
        sectorId: input.sectorId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone || null,
        notes: input.notes || null
      }
    });

    const settings = await prisma.appSetting.findUnique({ where: { id: "default" } });
    if (settings?.emailEnabled) {
      await sendEmail(prisma, {
        to: input.email,
        subject: "Beyond ERP registration received",
        text: `We received your Beyond ERP registration request for ${input.companyName}. Our team will review your payment and approve your login.`,
        html: `<p>We received your Beyond ERP registration request for <strong>${input.companyName}</strong>.</p><p>Our team will review your payment and approve your login.</p>`
      });
    }

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

app.use("/api", authenticate(prisma), auditTrail());

app.get("/api/auth/me", (req, res) => {
  res.json({ user: req.user });
});

app.patch("/api/auth/password", async (req, res, next) => {
  try {
    const input = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

    if (!user || !(await verifyPassword(input.currentPassword, user.passwordHash))) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(input.newPassword) }
    });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/users", requirePermission("Users"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const q = String(req.query.q ?? "").trim();
    const role = String(req.query.role ?? "");
    const status = String(req.query.status ?? "");
    const where: Prisma.UserWhereInput = {
      ...(role && role !== "ALL" ? { role: role as UserRole } : {}),
      ...(status && status !== "ALL" ? { status: status as AccountStatus } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: q, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        : {})
    };
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where })
    ]);
    res.json({ items: items.map(sanitizeUser), total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/users", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = userSchema.parse(req.body);
    const password = input.password ?? "Beyond@12345";
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone || null,
        companyName: input.companyName || null,
        companyTinNumber: input.companyTinNumber || null,
        companySectorId: input.companySectorId || null,
        passwordHash: await hashPassword(password),
        role: input.role,
        permissions: input.permissions
      }
    });

    const settings = await prisma.appSetting.findUnique({ where: { id: "default" } });
    if (settings?.emailEnabled) {
      const email = welcomeEmail(user.fullName);
      await sendEmail(prisma, {
        to: user.email,
        subject: email.subject,
        text: `${email.text}\nTemporary password: ${password}`,
        html: `${email.html}<p>Temporary password: <strong>${password}</strong></p>`
      });
    }

    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/users/:id", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = updateUserSchema.parse(req.body);
    const data: Prisma.UserUpdateInput = {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      companyName: input.companyName,
      companyTinNumber: input.companyTinNumber,
      companySectorId: input.companySectorId,
      role: input.role,
      permissions: input.permissions,
      status: input.status
    };
    if (input.password) {
      data.passwordHash = await hashPassword(input.password);
    }
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    res.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/users/:id", requirePermission("Users"), async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { status: AccountStatus.DISABLED }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/users/:id/reset-password", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = resetPasswordSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { passwordHash: await hashPassword(input.newPassword) }
    });
    res.json({ user: sanitizeUser(user), temporaryPassword: input.newPassword });
  } catch (error) {
    next(error);
  }
});

app.get("/api/registration-requests", requirePermission("Users"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const status = String(req.query.status ?? "");
    const q = String(req.query.q ?? "").trim();
    const where: Prisma.RegistrationRequestWhereInput = {
      ...(status && status !== "ALL" ? { status: status as RegistrationStatus } : {}),
      ...(q
        ? {
            OR: [
              { companyName: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { fullName: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: q, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        : {})
    };
    const [items, total] = await Promise.all([
      prisma.registrationRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.registrationRequest.count({ where })
    ]);
    res.json({ items, total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/registration-requests/:id/actions/mark-paid", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = registrationActionSchema.parse(req.body ?? {});
    const request = await prisma.registrationRequest.update({
      where: { id: req.params.id },
      data: {
        status: RegistrationStatus.PAID,
        paymentReference: input.paymentReference || null
      }
    });
    res.json(request);
  } catch (error) {
    next(error);
  }
});

app.post("/api/registration-requests/:id/actions/reject", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = registrationActionSchema.parse(req.body ?? {});
    const request = await prisma.registrationRequest.update({
      where: { id: req.params.id },
      data: {
        status: RegistrationStatus.REJECTED,
        rejectionReason: input.rejectionReason || null,
        approvedById: req.user?.id ?? null
      }
    });
    res.json(request);
  } catch (error) {
    next(error);
  }
});

app.post("/api/registration-requests/:id/actions/approve", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = registrationActionSchema.parse(req.body ?? {});
    const request = await prisma.registrationRequest.findUnique({ where: { id: req.params.id } });
    if (!request) {
      res.status(404).json({ message: "Registration request not found" });
      return;
    }
    if (request.status === RegistrationStatus.REJECTED) {
      res.status(400).json({ message: "Rejected requests cannot be approved." });
      return;
    }

    const user = await prisma.user.upsert({
      where: { email: request.email },
      update: {
        fullName: request.fullName,
        phone: request.phone,
        companyName: request.companyName,
        companyTinNumber: request.tinNumber,
        companySectorId: request.sectorId,
        status: AccountStatus.ACTIVE,
        role: UserRole.OWNER,
        permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"]
      },
      create: {
        fullName: request.fullName,
        email: request.email,
        phone: request.phone,
        companyName: request.companyName,
        companyTinNumber: request.tinNumber,
        companySectorId: request.sectorId,
        passwordHash: await hashPassword(input.temporaryPassword),
        role: UserRole.OWNER,
        permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"]
      }
    });

    const updated = await prisma.registrationRequest.update({
      where: { id: request.id },
      data: {
        status: RegistrationStatus.APPROVED,
        approvedById: req.user?.id ?? null,
        createdUserId: user.id
      }
    });

    const settings = await prisma.appSetting.findUnique({ where: { id: "default" } });
    if (settings?.emailEnabled) {
      await sendEmail(prisma, {
        to: user.email,
        subject: "Your Beyond ERP login is ready",
        text: `Your Beyond ERP account is ready.\nEmail: ${user.email}\nTemporary password: ${input.temporaryPassword}`,
        html: `<p>Your Beyond ERP account is ready.</p><p>Email: <strong>${user.email}</strong></p><p>Temporary password: <strong>${input.temporaryPassword}</strong></p>`
      });
    }

    res.json({ request: updated, user: sanitizeUser(user), temporaryPassword: input.temporaryPassword });
  } catch (error) {
    next(error);
  }
});

app.get("/api/audit-logs", requirePermission("Reports"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const actor = String(req.query.actor ?? "").trim();
    const method = String(req.query.method ?? "");
    const dateFrom = req.query.dateFrom ? new Date(String(req.query.dateFrom)) : null;
    const dateTo = req.query.dateTo ? new Date(String(req.query.dateTo)) : null;
    const where: Prisma.AuditLogWhereInput = {
      ...(actor ? { actorEmail: { contains: actor, mode: Prisma.QueryMode.insensitive } } : {}),
      ...(method && method !== "ALL" ? { method } : {}),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {})
            }
          }
        : {})
    };
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.auditLog.count({ where })
    ]);
    res.json({ items, total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.get("/api/email-logs", requirePermission("Settings"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const status = String(req.query.status ?? "");
    const to = String(req.query.to ?? "").trim();
    const where: Prisma.EmailLogWhereInput = {
      ...(status && status !== "ALL" ? { status: status as EmailStatus } : {}),
      ...(to ? { to: { contains: to, mode: Prisma.QueryMode.insensitive } } : {})
    };
    const [items, total] = await Promise.all([
      prisma.emailLog.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.emailLog.count({ where })
    ]);
    res.json({ items, total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/email/test", requirePermission("Settings"), async (req, res, next) => {
  try {
    const input = emailTestSchema.parse(req.body);
    const result = await sendEmail(prisma, {
      to: input.to,
      subject: input.subject,
      text: input.message,
      html: `<p>${input.message}</p>`
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/api/sectors", async (_req, res, next) => {
  try {
    const sectors = await prisma.sector.findMany({
      include: {
        teamMembers: { orderBy: { createdAt: "desc" } },
        workItems: { orderBy: { createdAt: "desc" } },
        sectorRecords: { orderBy: { createdAt: "desc" } }
      },
      orderBy: { createdAt: "asc" }
    });
    res.json(sectors);
  } catch (error) {
    next(error);
  }
});

app.get("/api/sectors/:id", async (req, res, next) => {
  try {
    const sector = await prisma.sector.findUnique({
      where: { id: req.params.id },
      include: {
        teamMembers: { orderBy: { createdAt: "desc" } },
        workItems: { orderBy: { createdAt: "desc" } },
        sectorRecords: { orderBy: { createdAt: "desc" } }
      }
    });
    if (!sector) {
      res.status(404).json({ message: "Sector not found" });
      return;
    }
    res.json(sector);
  } catch (error) {
    next(error);
  }
});

app.get("/api/sectors/:id/work-items", async (req, res, next) => {
  try {
    const items = await prisma.sectorWorkItem.findMany({
      where: { sectorId: req.params.id },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }]
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

app.post("/api/work-items", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = workItemSchema.parse(req.body);
    const data: Prisma.SectorWorkItemUncheckedCreateInput = {
      sectorId: input.sectorId,
      title: input.title,
      description: input.description || null,
      status: input.status,
      priority: input.priority,
      assignedToId: input.assignedToId || null,
      createdById: req.user?.id,
      dueDate: input.dueDate ?? null,
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    };
    const item = await prisma.sectorWorkItem.create({
      data
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/work-items/:id", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = workItemSchema.partial().parse(req.body);
    const data: Prisma.SectorWorkItemUncheckedUpdateInput = {
      sectorId: input.sectorId,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      assignedToId: input.assignedToId,
      dueDate: input.dueDate,
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    };
    const item = await prisma.sectorWorkItem.update({
      where: { id: req.params.id },
      data
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/work-items/:id", requirePermission("Delete"), async (req, res, next) => {
  try {
    await prisma.sectorWorkItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/sectors/:id/admins", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = adminSchema.parse(req.body);
    const member = await prisma.teamMember.create({
      data: {
        sectorId: req.params.id,
        type: TeamMemberType.ADMIN,
        fullName: input.fullName,
        contact: input.contact,
        permissions: input.permissions
      }
    });
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

app.post("/api/sectors/:id/managers", requirePermission("Users"), async (req, res, next) => {
  try {
    const input = managerSchema.parse(req.body);
    const member = await prisma.teamMember.create({
      data: {
        sectorId: req.params.id,
        type: TeamMemberType.MANAGER,
        fullName: input.fullName,
        department: input.department,
        assignedFeatures: input.assignedFeatures
      }
    });
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/team-members/:id", requirePermission("Delete"), async (req, res, next) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/transactions", async (req, res, next) => {
  try {
    const filter = String(req.query.type ?? "ALL").toUpperCase();
    const q = String(req.query.q ?? "").trim();
    const sectorId = String(req.query.sectorId ?? "");
    const status = String(req.query.status ?? "");
    const paymentMethod = String(req.query.paymentMethod ?? "");
    const dateFrom = req.query.dateFrom ? new Date(String(req.query.dateFrom)) : null;
    const dateTo = req.query.dateTo ? new Date(String(req.query.dateTo)) : null;
    const { page, limit, skip } = pagination(req);
    const where: Prisma.TransactionWhereInput = {
      ...(filter === "INCOME" || filter === "EXPENSE" ? { type: filter as TransactionType } : {}),
      ...(sectorId ? { sectorId } : {}),
      ...(status && status !== "ALL" ? { status: status as TransactionStatus } : {}),
      ...(paymentMethod && paymentMethod !== "ALL" ? { paymentMethod } : {}),
      ...(dateFrom || dateTo
        ? {
            occurredAt: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {})
            }
          }
        : {}),
      ...(q
        ? {
            OR: [
              { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { category: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { paymentMethod: { contains: q, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        : {})
    };
    const shouldPaginate =
      req.query.page !== undefined ||
      req.query.limit !== undefined ||
      q.length > 0 ||
      Boolean(sectorId || status || paymentMethod || dateFrom || dateTo);
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: shouldPaginate ? skip : undefined,
        take: shouldPaginate ? limit : undefined,
        orderBy: { occurredAt: "desc" }
      }),
      shouldPaginate ? prisma.transaction.count({ where }) : Promise.resolve(0)
    ]);
    const items = transactions.map(serializeTransaction);
    res.json(shouldPaginate ? { items, total, page, limit } : items);
  } catch (error) {
    next(error);
  }
});

app.post("/api/transactions", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = transactionSchema.parse(req.body);
    const transaction = await prisma.transaction.create({
      data: {
        ...input,
        amount: input.amount,
        vatAmount: input.vatAmount,
        occurredAt: input.occurredAt ?? new Date()
      }
    });
    res.status(201).json(serializeTransaction(transaction));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/transactions/:id", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = transactionSchema.partial().parse(req.body);
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        ...input,
        occurredAt: input.occurredAt
      }
    });
    res.json(serializeTransaction(transaction));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/transactions/:id", requirePermission("Delete"), async (req, res, next) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/sync/transactions", requirePermission("Edit"), async (req, res, next) => {
  try {
    const items = z.array(transactionSchema).parse(req.body.items ?? []);
    const synced = [];
    for (const item of items) {
      const transaction = await prisma.transaction.create({
        data: {
          ...item,
          synced: true,
          occurredAt: item.occurredAt ?? new Date()
        }
      });
      synced.push(serializeTransaction(transaction));
    }
    res.json({ count: synced.length, transactions: synced });
  } catch (error) {
    next(error);
  }
});

app.get("/api/employees", async (req, res, next) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const status = String(req.query.status ?? "");
    const department = String(req.query.department ?? "").trim();
    const { page, limit, skip } = pagination(req);
    const where: Prisma.EmployeeWhereInput = {
      ...(status && status !== "ALL" ? { status: status as EmployeeStatus } : {}),
      ...(department ? { department: { contains: department, mode: Prisma.QueryMode.insensitive } } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { position: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { department: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: q, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        : {})
    };
    const shouldPaginate =
      req.query.page !== undefined || req.query.limit !== undefined || q.length > 0 || Boolean(status || department);
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip: shouldPaginate ? skip : undefined,
        take: shouldPaginate ? limit : undefined,
        orderBy: { createdAt: "desc" }
      }),
      shouldPaginate ? prisma.employee.count({ where }) : Promise.resolve(0)
    ]);
    const items = employees.map(serializeEmployee);
    res.json(shouldPaginate ? { items, total, page, limit } : items);
  } catch (error) {
    next(error);
  }
});

app.post("/api/employees", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = employeeSchema.parse(req.body);
    const employee = await prisma.employee.create({
      data: {
        ...input,
        email: input.email || null
      }
    });
    res.status(201).json(serializeEmployee(employee));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/employees/:id", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = employeeSchema.partial().parse(req.body);
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        ...input,
        email: input.email === "" ? null : input.email
      }
    });
    res.json(serializeEmployee(employee));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/employees/:id", requirePermission("Delete"), async (req, res, next) => {
  try {
    await prisma.employee.update({
      where: { id: req.params.id },
      data: { status: EmployeeStatus.INACTIVE }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/settings", async (_req, res, next) => {
  try {
    const settings = await prisma.appSetting.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" }
    });
    res.json(serializeSettings(settings));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/settings", requirePermission("Settings"), async (req, res, next) => {
  try {
    const input = settingsSchema.parse(req.body);
    const settings = await prisma.appSetting.update({
      where: { id: "default" },
      data: input
    });
    res.json(serializeSettings(settings));
  } catch (error) {
    next(error);
  }
});

app.get("/api/invoices", requirePermission("Reports"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const q = String(req.query.q ?? "").trim();
    const where: Prisma.InvoiceWhereInput | undefined = q
      ? {
          OR: [
            { invoiceNumber: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { customerName: { contains: q, mode: Prisma.QueryMode.insensitive } }
          ]
        }
      : undefined;
    const [items, total] = await Promise.all([
      prisma.invoice.findMany({ where, skip, take: limit, orderBy: { issuedAt: "desc" } }),
      prisma.invoice.count({ where })
    ]);
    res.json({ items: items.map(serializeMoneyRecord), total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/invoices", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = invoiceSchema.parse(req.body);
    const totals = calculateInvoice(input.items);
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: nextDocumentNumber("INV"),
        customerName: input.customerName,
        customerPhone: input.customerPhone || null,
        sectorId: input.sectorId || null,
        items: input.items,
        ...totals,
        status: input.status,
        dueDate: input.dueDate ?? null
      }
    });
    res.status(201).json(serializeMoneyRecord(invoice));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/invoices/:id", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = invoiceSchema.partial().parse(req.body);
    const totals = input.items ? calculateInvoice(input.items) : {};
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        sectorId: input.sectorId,
        items: input.items,
        ...totals,
        status: input.status,
        dueDate: input.dueDate,
        paidAt: input.status === InvoiceStatus.PAID ? new Date() : undefined
      }
    });
    res.json(serializeMoneyRecord(invoice));
  } catch (error) {
    next(error);
  }
});

app.get("/api/receipts", requirePermission("Reports"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const [items, total] = await Promise.all([
      prisma.receipt.findMany({ skip, take: limit, orderBy: { issuedAt: "desc" } }),
      prisma.receipt.count()
    ]);
    res.json({ items: items.map(serializeMoneyRecord), total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/receipts", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = receiptSchema.parse(req.body);
    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber: nextDocumentNumber("RCT"),
        transactionId: input.transactionId || null,
        payerName: input.payerName,
        amount: input.amount,
        paymentMethod: input.paymentMethod
      }
    });
    res.status(201).json(serializeMoneyRecord(receipt));
  } catch (error) {
    next(error);
  }
});

app.get("/api/expense-approvals", requirePermission("Reports"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const [items, total] = await Promise.all([
      prisma.expenseApproval.findMany({ skip, take: limit, orderBy: { requestedAt: "desc" } }),
      prisma.expenseApproval.count()
    ]);
    res.json({ items: items.map(serializeMoneyRecord), total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/expense-approvals", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = expenseApprovalSchema.parse(req.body);
    const approval = await prisma.expenseApproval.create({
      data: {
        title: input.title,
        amount: input.amount,
        category: input.category,
        sectorId: input.sectorId || null,
        requestedById: req.user?.id,
        status: input.status,
        notes: input.notes || null
      }
    });
    res.status(201).json(serializeMoneyRecord(approval));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/expense-approvals/:id", requirePermission("Approve"), async (req, res, next) => {
  try {
    const input = expenseApprovalSchema.partial().parse(req.body);
    const approval = await prisma.expenseApproval.update({
      where: { id: req.params.id },
      data: {
        ...input,
        notes: input.notes || undefined,
        approvedById: input.status && input.status !== ApprovalStatus.REQUESTED ? req.user?.id : undefined,
        decidedAt: input.status && input.status !== ApprovalStatus.REQUESTED ? new Date() : undefined
      }
    });
    res.json(serializeMoneyRecord(approval));
  } catch (error) {
    next(error);
  }
});

app.post("/api/expense-approvals/:id/actions/:action", requirePermission("Approve"), async (req, res, next) => {
  try {
    const action = String(req.params.action).toLowerCase();
    const statusByAction: Record<string, ApprovalStatus> = {
      approve: ApprovalStatus.APPROVED,
      reject: ApprovalStatus.REJECTED,
      pay: ApprovalStatus.PAID
    };
    const status = statusByAction[action];
    if (!status) {
      res.status(400).json({ message: "Unsupported approval action" });
      return;
    }
    const approval = await prisma.expenseApproval.update({
      where: { id: req.params.id },
      data: {
        status,
        approvedById: req.user?.id,
        decidedAt: new Date()
      }
    });
    res.json(serializeMoneyRecord(approval));
  } catch (error) {
    next(error);
  }
});

app.get("/api/chart-accounts", requirePermission("Reports"), async (_req, res, next) => {
  try {
    const accounts = await prisma.chartAccount.findMany({ orderBy: { code: "asc" } });
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

app.post("/api/chart-accounts", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = accountSchema.parse(req.body);
    const account = await prisma.chartAccount.create({
      data: {
        ...input,
        description: input.description || null
      }
    });
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
});

app.post("/api/ledger-entries", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = ledgerEntrySchema.parse(req.body);
    const entry = await prisma.ledgerEntry.create({
      data: {
        ...input,
        reference: input.reference || null,
        occurredAt: input.occurredAt ?? new Date()
      }
    });
    res.status(201).json(serializeMoneyRecord(entry));
  } catch (error) {
    next(error);
  }
});

app.get("/api/payroll-runs", requirePermission("Reports"), async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req);
    const [items, total] = await Promise.all([
      prisma.payrollRun.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.payrollRun.count()
    ]);
    res.json({ items: items.map(serializeMoneyRecord), total, page, limit });
  } catch (error) {
    next(error);
  }
});

app.post("/api/payroll-runs", requirePermission("Approve"), async (req, res, next) => {
  try {
    const input = payrollRunSchema.parse(req.body);
    const grossPay = input.items.reduce((sum, item) => sum + item.grossPay, 0);
    const deductions = input.items.reduce((sum, item) => sum + item.deductions, 0);
    const payroll = await prisma.payrollRun.create({
      data: {
        period: input.period,
        status: input.status,
        grossPay,
        deductions,
        netPay: grossPay - deductions,
        items: input.items
      }
    });
    res.status(201).json(serializeMoneyRecord(payroll));
  } catch (error) {
    next(error);
  }
});

app.get("/api/sector-records", async (req, res, next) => {
  try {
    const sectorId = String(req.query.sectorId ?? "");
    const where = sectorId ? { sectorId } : undefined;
    const records = await prisma.sectorRecord.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    res.json(records.map(serializeMoneyRecord));
  } catch (error) {
    next(error);
  }
});

app.get("/api/domain-workflows", async (_req, res) => {
  res.json(domainWorkflows);
});

app.get("/api/domain-workflows/:sectorId", async (req, res, next) => {
  try {
    const workflows = domainWorkflows[req.params.sectorId] ?? [];
    const recordTypes = workflows.map((workflow) => workflow.recordType);
    const records = await prisma.sectorRecord.findMany({
      where: {
        sectorId: req.params.sectorId,
        recordType: { in: recordTypes }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ workflows, records: records.map(serializeMoneyRecord) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/domain-workflows/:sectorId/:workflowKey", requirePermission("Edit"), async (req, res, next) => {
  try {
    const workflow = getWorkflow(req.params.sectorId, req.params.workflowKey);
    if (!workflow) {
      res.status(404).json({ message: "Workflow not found" });
      return;
    }

    const input = domainWorkflowSchema.parse(req.body);
    for (const field of workflow.fields) {
      const value = input.values[field.name];
      if (field.required && (value === undefined || value === null || value === "")) {
        res.status(400).json({ message: `${field.label} is required` });
        return;
      }
      if (field.type === "number" && value !== undefined && value !== null && Number.isNaN(Number(value))) {
        res.status(400).json({ message: `${field.label} must be numeric` });
        return;
      }
    }

    const value = workflow.valueField ? Number(input.values[workflow.valueField] ?? 0) : null;
    const titleValue = Object.values(input.values).find((item) => typeof item === "string" && item.trim().length > 0);
    const record = await prisma.sectorRecord.create({
      data: {
        sectorId: req.params.sectorId,
        recordType: workflow.recordType,
        title: `${workflow.title}${titleValue ? ` - ${titleValue}` : ""}`,
        ownerName: input.ownerName || req.user?.fullName || null,
        status: input.status,
        value,
        metadata: {
          workflowKey: workflow.key,
          workflowTitle: workflow.title,
          values: input.values
        }
      }
    });
    res.status(201).json(serializeMoneyRecord(record));
  } catch (error) {
    next(error);
  }
});

app.post("/api/sector-records", requirePermission("Edit"), async (req, res, next) => {
  try {
    const input = sectorRecordSchema.parse(req.body);
    const record = await prisma.sectorRecord.create({
      data: {
        ...input,
        ownerName: input.ownerName || null,
        value: input.value ?? null,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
        startedAt: input.startedAt ?? null,
        closedAt: input.closedAt ?? null
      }
    });
    res.status(201).json(serializeMoneyRecord(record));
  } catch (error) {
    next(error);
  }
});

app.get("/api/finance/summary", requirePermission("Reports"), async (_req, res, next) => {
  try {
    const [transactions, invoices, approvals, accounts, payrollRuns] = await Promise.all([
      prisma.transaction.findMany(),
      prisma.invoice.findMany(),
      prisma.expenseApproval.findMany(),
      prisma.chartAccount.findMany({ include: { entries: true } }),
      prisma.payrollRun.findMany()
    ]);
    const revenue = transactions
      .filter((item) => item.type === TransactionType.INCOME)
      .reduce((sum, item) => sum + toNumber(item.amount), 0);
    const expenses = transactions
      .filter((item) => item.type === TransactionType.EXPENSE)
      .reduce((sum, item) => sum + toNumber(item.amount), 0);
    const invoiced = invoices.reduce((sum, invoice) => sum + toNumber(invoice.total), 0);
    const approvedExpenses = approvals
      .filter((item) => item.status === ApprovalStatus.APPROVED || item.status === ApprovalStatus.PAID)
      .reduce((sum, item) => sum + toNumber(item.amount), 0);
    const payroll = payrollRuns.reduce((sum, run) => sum + toNumber(run.netPay), 0);
    const balanceSheet = accounts.map((account) => {
      const debit = account.entries.reduce((sum, entry) => sum + toNumber(entry.debit), 0);
      const credit = account.entries.reduce((sum, entry) => sum + toNumber(entry.credit), 0);
      return {
        code: account.code,
        name: account.name,
        type: account.type,
        balance: debit - credit
      };
    });

    res.json({
      profitLoss: {
        revenue,
        expenses: expenses + approvedExpenses + payroll,
        netProfit: revenue - expenses - approvedExpenses - payroll,
        invoiced
      },
      cashFlow: {
        inflow: revenue,
        outflow: expenses + approvedExpenses + payroll,
        netCash: revenue - expenses - approvedExpenses - payroll
      },
      balanceSheet
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/dashboard", async (_req, res, next) => {
  try {
    const { start, end } = getMonthWindow();
    const [monthTransactions, allTransactions, pendingSync, employeeCount, sectorCount] =
      await Promise.all([
        prisma.transaction.findMany({
          where: { occurredAt: { gte: start, lt: end } },
          orderBy: { occurredAt: "desc" }
        }),
        prisma.transaction.findMany({ orderBy: { occurredAt: "desc" } }),
        prisma.transaction.count({ where: { synced: false } }),
        prisma.employee.count(),
        prisma.sector.count()
      ]);

    const revenue = monthTransactions
      .filter((item) => item.type === TransactionType.INCOME)
      .reduce((total, item) => total + toNumber(item.amount), 0);
    const expenses = monthTransactions
      .filter((item) => item.type === TransactionType.EXPENSE)
      .reduce((total, item) => total + toNumber(item.amount), 0);
    const netProfit = revenue - expenses;

    const totalIncome = allTransactions
      .filter((item) => item.type === TransactionType.INCOME)
      .reduce((total, item) => total + toNumber(item.amount), 0);
    const vat = totalIncome * 0.15;
    const withholding = totalIncome * 0.02;

    const sectorTotals = new Map<string, number>();
    for (const transaction of allTransactions) {
      const current = sectorTotals.get(transaction.category) ?? 0;
      sectorTotals.set(transaction.category, current + toNumber(transaction.amount));
    }
    const totalBySector = Array.from(sectorTotals.values()).reduce((sum, value) => sum + value, 0);
    const sectorBreakdown = Array.from(sectorTotals.entries())
      .map(([sector, amount]) => ({
        sector,
        amount,
        percentage: totalBySector ? Math.round((amount / totalBySector) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      stats: {
        revenue,
        expenses,
        netProfit,
        pendingSync,
        employeeCount,
        sectorCount
      },
      taxSummary: {
        taxableRevenue: totalIncome,
        vat,
        withholding,
        totalTaxLiability: vat + withholding
      },
      revenueChart: [35, 55, 40, 75, 60, 90, 70, 85, 65, 95, 80, 100],
      sectorBreakdown,
      recentTransactions: monthTransactions.slice(0, 5).map(serializeTransaction)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/export/transactions.csv", async (_req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({ orderBy: { occurredAt: "desc" } });
    const headers = [
      "Date",
      "Type",
      "Category",
      "Description",
      "Amount",
      "VAT",
      "Payment Method",
      "Status"
    ];
    const lines = transactions.map((transaction) => {
      const description = `"${transaction.description.replace(/"/g, '""')}"`;
      return [
        transaction.occurredAt.toISOString().slice(0, 10),
        transaction.type,
        transaction.category,
        description,
        toNumber(transaction.amount),
        toNumber(transaction.vatAmount),
        transaction.paymentMethod,
        transaction.status
      ].join(",");
    });
    res.header("Content-Type", "text/csv");
    res.attachment(`beyond_erp_report_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send([headers.join(","), ...lines].join("\n"));
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: "Validation failed", issues: error.flatten() });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    res.status(404).json({ message: "Record not found" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

if (process.env.NODE_ENV !== "test") {
  ensureSeeded()
    .then(() => {
      app.listen(port, () => {
        console.log(`Beyond ERP API listening on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("Could not start API", error);
      process.exit(1);
    });
}
