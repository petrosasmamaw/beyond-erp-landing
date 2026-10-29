# Beyond ERP — Frontend

Next.js 15 + React 19 single-page application. Runs on **http://localhost:8080** by default.

---

## Quick start (local dev)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:8080`. The frontend talks to the backend at `http://localhost:4000` by default.

---

## Mock mode (no backend needed)

Set `NEXT_PUBLIC_MOCK=true` to run the app fully standalone with in-memory demo data — no backend, no database.

```env
# frontend/.env.local
NEXT_PUBLIC_MOCK=true
```

In mock mode:
- Login accepts **any email and password** — signs in as the demo owner
- All data is pre-populated with realistic Ethiopian business data (Selam Trading PLC)
- Create / edit / delete operations work in-memory and reset on page refresh

---

## Vercel deployment

1. Push the repo to GitHub
2. Create a new Vercel project, set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_MOCK` = `true`
4. Deploy

To connect a real backend later, remove `NEXT_PUBLIC_MOCK` and add `NEXT_PUBLIC_API_URL` pointing to your hosted backend.

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_MOCK` | `false` | `true` = use in-memory mock, no backend needed |
| `NEXT_PUBLIC_API_URL` | `""` (same origin) | Backend base URL for production |

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server on port 8080 with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve production build on port 8080 |
| `npm test` | Run Vitest unit and smoke tests |
| `npm run lint` | ESLint check |

---

## Auth flow

### First-time setup
1. App detects no users exist (`GET /api/auth/needs-setup`)
2. Shows **Set up your company** form — company name, TIN, owner name, email, password
3. On submit, a **6-digit OTP** is sent to the owner's email
4. Owner enters the code on the **Verify** screen
5. Account + company are created; owner is signed in automatically

### Sign in
Standard email + password login via `POST /api/auth/login`.

### Forgot password
1. Click **Forgot password?** on the login screen
2. Enter email → 6-digit reset code sent to that address
3. Enter the code + new password on the **Reset password** screen
4. Redirected to login on success

---

## UI overview

The entire app lives in one file: `src/app/page.tsx`. Every screen, modal, and state lives there — intentionally, to keep the build simple and the deployment trivial.

### Tabs

| Tab | What it shows |
|---|---|
| **Home** | Revenue / expenses / net profit cards, 12-month bar chart, recent transactions |
| **Sectors** | 12 business-type sector cards; tap to enter a sector's workflow |
| **Money** | Full transaction list with add / edit / delete, payment method filters, date range, CSV export |
| **Team** | Employee roster with add / edit / deactivate, Ethiopian phone validation, payroll tab |
| **Finance** | Invoices, receipts, expense approvals (approve / reject / pay), chart of accounts, payroll runs |
| **Reports** | P&L statement, cash flow, balance sheet — all printable with Ethiopian company header |
| **Admin** | User management with roles, audit log, email delivery log |
| **Settings** | Company info, language, VAT, payment integrations, storage usage bar |

### Sector detail screens

Tapping a sector card opens a detail screen with:
- Live revenue, active tasks, and record count computed from real data
- Domain-specific workflow shortcuts (retail → SKU form, clinic → patient form, etc.)
- Task (work item) management — status, priority, due date, assignee
- Generic record creation and record list
- Barcode generator (retail sector)

### 12 supported business sectors

Retail & Trading · Manufacturing · Agriculture · Construction · Healthcare · Education · Hospitality & Tourism · Logistics & Transport · Financial Services · Real Estate · NGO & Non-profit · Government & Public Sector

---

## Ethiopian localization

| Feature | Detail |
|---|---|
| **Calendar** | Ethiopian date (Meskerem–Pagume, E.C.) shown live in the header; refreshes every 60 s |
| **Holidays** | 8 fixed public holidays detected; gold badge shown on match days |
| **Fiscal year** | Ethiopian fiscal year computed dynamically in Settings |
| **Currency** | All monetary values formatted as `ETB X,XXX` |
| **Phone** | Validated against `+251 9X XXX XXXX` / `09X XXX XXXX` format |
| **VAT** | 15% Ethiopian VAT applied on invoices; TIN field in settings |

---

## Languages

Four languages selectable in Settings:

- **English** (default)
- **Amharic** — አማርኛ
- **Afaan Oromo**
- **Tigrinya** — ትግርኛ

The `t(key, language)` function looks up a `LangKey` in the `i18n` map and falls back to English if a translation is missing.

---

## Offline / PWA

- **localStorage queue** — transactions and operations are saved locally when the device is offline
- **Auto-sync** — replays the queue via `POST /api/sync/transactions` when connectivity returns
- **Sync review panel** — header badge shows pending count; opens a list where each failed item can be dismissed individually
- **PWA install** — listens for `beforeinstallprompt`; shows an Install button in the header when the browser deems the app installable
- **Service worker** — `public/sw.js` caches shell assets for offline load (disabled in dev for easier testing)
- **Manifest** — `public/manifest.json` defines app name, icons, and standalone display mode

---

## Telegram Mini App

The app detects `window.Telegram?.WebApp` and initialises the Telegram WebApp SDK on load. The share button sends a deep-link using the current origin.

---

## Key files

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Entire application — all views, state, handlers, and modals |
| `src/app/globals.css` | All styles — design tokens, layout, components, print styles |
| `src/lib/api.ts` | Typed fetch wrappers for every backend endpoint; routes through mock in mock mode |
| `src/lib/mock.ts` | In-memory mock backend — realistic seed data, full CRUD, 120 ms simulated latency |
| `src/lib/types.ts` | Shared TypeScript types (Sector, Transaction, Employee, Dashboard …) |
| `src/lib/format.ts` | `formatCurrency`, `formatDate`, `getEthiopianDate`, `validateEthiopianPhone`, etc. |
| `public/sw.js` | Service worker for offline asset caching |
| `public/manifest.json` | PWA manifest |

---

## Forms and validation

All forms use controlled React state with inline validation:

- **Transaction form** — amount > 0 and description required; errors shown as red-bordered inputs with text below the field
- **Employee form** — name, position, department required; phone must pass the Ethiopian format check
- **Setup form** — company name, full name, email, passwords validated before OTP is requested
- **Confirm modal** — replaces `window.confirm()` for all destructive actions; shows an in-app dialog with a red Confirm button

---

## Tests

```bash
npm test
```

| File | Tests |
|---|---|
| `src/lib/format.test.ts` | `formatCurrency`, `formatDate`, `getInitials`, `getEthiopianDate`, `getEthiopianHoliday`, `getEthiopianFiscalYear` |
| `src/app/page.test.tsx` | Landing page renders, setup screen shown when `needsSetup=true`, navigate to sign-in |

Test environment: jsdom via `vitest.config.ts` with `@testing-library/react`.
