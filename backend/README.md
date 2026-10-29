# Beyond ERP — Backend

Express + Prisma + PostgreSQL API server for Beyond ERP.

Runs on **http://localhost:4000** by default.

---

## Setup

### Prerequisites

- Node.js 20+
- Docker (for the PostgreSQL container) — or an existing PostgreSQL instance

### Steps

```bash
cd backend
copy .env.example .env    # edit the values below
npm install
docker compose up -d      # starts postgres on port 5432
npm run db:generate       # generates Prisma client
npm run db:migrate        # runs schema migrations
npm run seed              # inserts demo data
npm run dev               # starts tsx watch server
```

---

## Environment variables

Create `backend/.env` from `.env.example` and set:

```env
DATABASE_URL="postgresql://beyond:beyond@localhost:5432/beyonderp"
JWT_SECRET="change-me-in-production"
PORT=4000

# Optional — email notifications via Nodemailer
MAIL_FROM="Beyond ERP <no-reply@yourdomain.com>"
SMTP_HOST="smtp.yourdomain.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="smtp-user"
SMTP_PASS="smtp-password"
```

If `SMTP_HOST` is blank, email sends are skipped (logged as no-op). No error is thrown.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start development server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output (`node dist/index.js`) |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Apply pending migrations (creates DB tables) |
| `npm run seed` | Load demo sectors, users, transactions, and workflow records |
| `npm test` | Run Vitest integration tests |

---

## API routes

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Email + password → JWT token |
| POST | `/api/auth/change-password` | Authenticated password change |
| POST | `/api/auth/reset-password` | Admin-initiated reset (sends email) |

### Users & roles
| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | List users (Admin+ only) |
| POST | `/api/users` | Create user with role |
| PATCH | `/api/users/:id` | Update role or disable/reactivate |

### Transactions
| Method | Path | Description |
|---|---|---|
| GET | `/api/transactions` | Paginated list with filters |
| POST | `/api/transactions` | Create single transaction |
| POST | `/api/sync/transactions` | Bulk upsert (offline sync replay) |
| PATCH | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Soft delete |

### Employees
| Method | Path | Description |
|---|---|---|
| GET | `/api/employees` | Paginated + filtered list |
| POST | `/api/employees` | Create |
| PATCH | `/api/employees/:id` | Update / deactivate |

### Finance
| Method | Path | Description |
|---|---|---|
| GET | `/api/finance/summary` | P&L, cash flow, balance sheet totals |
| GET/POST | `/api/invoices` | List / create invoices |
| GET/POST | `/api/receipts` | List / create receipts |
| GET/POST | `/api/expense-approvals` | List / create / approve expenses |
| GET/POST | `/api/chart-accounts` | Chart of accounts |
| GET/POST | `/api/ledger-entries` | General ledger entries |
| GET/POST | `/api/payroll-runs` | Payroll run records |

### Sectors & workflows
| Method | Path | Description |
|---|---|---|
| GET | `/api/sectors` | All 12 sector definitions |
| GET/POST | `/api/work-items` | Sector tasks (with priority) |
| PATCH | `/api/work-items/:id` | Update task status |
| GET/POST | `/api/sector-records/:sectorId` | Sector-specific records |
| POST | `/api/domain-workflows/:sectorId/:workflowKey` | Submit a typed workflow form |

### Settings & admin
| Method | Path | Description |
|---|---|---|
| GET/PUT | `/api/settings` | Company settings (VAT, currency, integrations) |
| GET | `/api/audit-logs` | Audit trail |
| GET | `/api/email-logs` | Email send history |

---

## Architecture

```
src/
├── index.ts              Entry point: Express app, all route handlers, auto-seed on first boot
├── auth.ts               JWT sign/verify, bcrypt hash/compare, role middleware
├── email.ts              Nodemailer wrapper (no-op when SMTP_HOST is unset)
├── seed.ts               seedDatabase() — upserts demo data via Prisma
├── seed-data.ts          All demo records (employees, transactions, invoices, workflows …)
├── domain-workflows.ts   36 workflow definitions across 12 sectors with typed fields
├── index.test.ts         Vitest integration tests
└── test/setup.ts         Global test setup (starts/stops the server)
```

### Auto-seed on boot

`index.ts` calls `ensureSeeded()` on startup. It checks whether any `Sector` rows exist; if not, it runs the full seed. This means a fresh database is demo-ready without a manual `npm run seed` call.

### Offline sync

`POST /api/sync/transactions` accepts an array of transactions and upserts each one by `id`. The frontend queues operations in `localStorage` while offline and replays them when connectivity is restored.

### Role-based access

Five roles in ascending permission order: `VIEWER → STAFF → MANAGER → ADMIN → OWNER`.

Routes use `requireRole(minRole)` middleware. A request with a lower role than required gets a `403`.

---

## Database schema (key models)

| Model | Purpose |
|---|---|
| `User` | Authentication + role |
| `Employee` | HR records, salary, hire date |
| `Transaction` | Income/expense ledger entries |
| `Invoice` / `Receipt` | Billing documents |
| `ExpenseApproval` | Expense request + approval workflow |
| `ChartAccount` / `LedgerEntry` | Double-entry accounting |
| `PayrollRun` | Monthly payroll records |
| `Sector` | 12 business type definitions |
| `SectorWorkItem` | Task/to-do per sector with priority |
| `SectorRecord` | Generic structured record per sector |
| `AppSetting` | Single-row company config |
| `AuditLog` / `EmailLog` | Observability trails |

---

## Tests

```bash
npm test
```

Five integration tests using Supertest against a live server + real database:

1. Login returns a JWT
2. Role guard blocks STAFF from admin endpoints
3. Offline transaction sync (`/api/sync/transactions`)
4. Invoice creation (`/api/invoices`)
5. Finance summary (`/api/finance/summary`)
6. Domain workflow create + duplicate-key validation (`/api/domain-workflows/…`)
