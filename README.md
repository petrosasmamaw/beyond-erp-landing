# Beyond ERP

**Mobile-first ERP for Ethiopian businesses.**

Beyond ERP gives any Ethiopian company — retail shop, farm, clinic, school, hotel, logistics firm — a single app to manage money, people, operations, and compliance. It works offline, speaks four languages, and integrates with Ethiopian payment rails (Telebirr, CBE Birr, Amole).

---

## What the app does

| Area | What you can do |
|---|---|
| **Dashboard** | See today's revenue, expenses, and net profit at a glance; quick-add a transaction or initiate a Telebirr payment |
| **Sectors** | Each of the 12 business types gets its own workflow screens (retail SKU/POS, agriculture crop/livestock, healthcare visits/prescriptions, construction site reports, etc.) |
| **Transactions** | Record income and expenses with payment method, sector, date, and status; full filter, search, and pagination |
| **Employees** | Add staff, set salary, run payroll, approve leave — with phone validation against Ethiopian number format |
| **Finance** | Issue invoices, log receipts, approve expense requests, manage chart of accounts, ledger entries, and payroll runs; view P&L, cash flow, and balance sheet |
| **Reports** | Printable summary reports with company name, TIN, Ethiopian calendar date, and 15% VAT calculation |
| **Admin** | Five-role RBAC (Owner / Admin / Manager / Staff / Viewer); user creation, password reset, audit log, email log |
| **Settings** | Company name, TIN, language (English / Amharic / Afaan Oromo / Tigrinya), VAT toggle, payment integrations, storage usage |

### Ethiopian-specific features

- **Ethiopian calendar** displayed live in the header (Meskerem–Pagume months, E.C. year)
- **8 public holidays** detected and shown as a badge (Genna, Timkat, Adwa Day, Labour Day, Patriots Day, Derg Downfall, Enkutatash, Meskel)
- **Ethiopian fiscal year** shown dynamically in settings
- **15% VAT** on invoices with TIN field
- **Payment pills**: Telebirr, Cash, Bank Transfer, CBE Birr, Amole, Cheque
- **Phone validation** against Ethiopian mobile format (+251 / 09...)
- **ETB currency** formatting throughout

### Offline-first PWA

- Records transactions and operations while offline; syncs automatically when back online
- Failed operations are queued and reviewable in-app (not silently dropped)
- Installable as a PWA on Android/iOS via the browser install prompt
- Telegram Mini App compatible

---

## Repository layout

```
beyond-erp/
├── backend/          Express + Prisma + PostgreSQL API
├── frontend/         Next.js 15 + React 19 single-page app
└── README.md         ← you are here
```

There is no shared package or root workspace — the two apps are fully independent.

---

## Quick start

### 1. Backend

```bash
cd backend
copy .env.example .env      # fill in DATABASE_URL and JWT_SECRET
npm install
docker compose up -d        # starts PostgreSQL
npm run db:generate
npm run db:migrate
npm run seed                # loads demo data
npm run dev                 # http://localhost:4000
```

See [backend/README.md](backend/README.md) for full details.

### 2. Frontend

```bash
cd frontend
copy .env.example .env.local   # BACKEND_URL=http://localhost:4000
npm install
npm run dev                    # http://localhost:3000
```

See [frontend/README.md](frontend/README.md) for full details.

---

## Demo accounts

| Email | Password | Role |
|---|---|---|
| `owner@beyonderp.local` | `Beyond@12345` | Owner (all permissions) |
| `admin@beyonderp.local` | `Admin@12345` | Admin |
| `manager@beyonderp.local` | `Manager@12345` | Manager |

---

## Tests

```bash
cd backend  && npm test   # 5 integration tests (auth, RBAC, sync, finance, workflows)
cd frontend && npm test   # 5 unit/smoke tests (format helpers, page render)
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Lucide icons |
| Backend | Node.js, Express 4, Zod validation, JWT, Bcrypt |
| Database | PostgreSQL via Prisma ORM |
| Testing | Vitest + Supertest |
| Payments | Telebirr API (merchant approval required), CBE Birr |
| Notifications | Nodemailer (SMTP), Telegram Bot API |
