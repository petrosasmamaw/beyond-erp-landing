# Beyond ERP — Comprehensive Demo Workspace UI Specification (`demoui.md`)

This document is an exhaustive, element-by-element UI inventory of the entire **Beyond ERP Demo Workspace**. It describes every page layout, heading, metric card, button, form input, table, graph, badge, modal, drawer, color token, and interactive state currently existing in the application.

---

## 1. Global Workspace Architecture & Shell

### 1.1 Shell Layout Structure
- **Desktop Layout (`>= 900px`)**:
  - Left Fixed Column: Collapsible Desktop Sidebar (`234px` expanded, `60px` collapsed).
  - Right Main Panel (`minmax(0, 1fr)`):
    - Top Sticky Header (`app-topbar`, `56px` height).
    - Sub-header Ethiopian Calendar Strip (`calendar-strip`, `36px` height).
    - Printable Report Header (`print-header`, print-media only).
    - Scrollable Viewport (`page-body`, `padding: 16px 16px 88px`).
- **Mobile Layout (`< 900px`)**:
  - Full-width scrollable container.
  - Sticky Topbar with compact responsive badges.
  - Bottom Fixed Navigation Dock (`bottom-nav`, `56px` height).

### 1.2 Enterprise Color & Theme Tokens
The interface utilizes CSS variable tokens that automatically invert between **Light Mode** and **Dark Mode**:

| Token Name | Light Mode Value | Dark Mode Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#f8fafc` (Slate 50) | `#090d16` (Deep Navy-Slate) | App shell backdrop and page canvas |
| `--bg-surface` | `#ffffff` (Pure White) | `#0f172a` (Slate 900) | Metric cards, tables, modal surfaces, sidebar |
| `--bg-subtle` | `#f1f5f9` (Slate 100) | `#1e293b` (Slate 800) | Table row hover, chips, secondary surfaces |
| `--border-line` | `#e2e8f0` (Slate 200) | `#1e2d42` (Dark Slate Hairline) | 1px clean card and table border dividers |
| `--text-primary` | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | Main headings, metric figures, table values |
| `--text-secondary`| `#475569` (Slate 600) | `#cbd5e1` (Slate 300) | Subheadings, descriptions, table headers |
| `--text-muted` | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) | Meta captions, dates, helper labels |
| `--accent-blue` | `#2563eb` (Beyond Blue) | `#3b82f6` (Vibrant Blue) | Primary buttons, active indicators, links |
| `--accent-blue-subtle` | `rgba(37,99,235,0.08)` | `rgba(59,130,246,0.14)` | Active navigation pills, focus rings |

**Design System Rules**:
- **Zero Purple**: All purple elements (`#7c3aed`, `#8b5cf6`, `#6d28d9`) have been removed in favor of Beyond Blue (`#2563eb`), Cyan (`#0284c7`), Slate, Emerald (`#10b981`), and Amber (`#f59e0b`).
- **Zero Raw Emojis**: Replaced with Lucide React vector icons.
- **De-Boxed Styling**: Eliminates nested card-inside-card designs; uses flat surface containers with 1px hairlines and high data density.
- **Tabular Figures**: Metric numbers and currency values enforce `font-variant-numeric: tabular-nums`.

---

## 2. Global Navigation & Layout Components

### 2.1 Sticky Topbar (`app-topbar`)
Located at the top of the main content area (`height: 56px`, sticky, z-index: 20):

1. **Left Greeting & Sector Switcher**:
   - **Time & Date Display**: Uppercase 10.5px bold muted text: `{Greeting} · {DayOfWeek, DD MMM}` (e.g., `GOOD MORNING · FRI, 06 NOV`).
   - **Workspace Sector Switcher Pill** (Button):
     - Background: Subtle blue tint (`rgba(37, 99, 235, 0.08)` Light / `rgba(37, 99, 235, 0.16)` Dark).
     - 20x20 Sector Icon Chip: Vector icon matching the active sector with subtle sector tint.
     - Company Name Text: Truncated bold label (e.g., `Addis Retail Trading PLC`).
     - Chevron: `ChevronDown` (14px).
     - Action: Opens the `SectorSelectModal`.
2. **Right Action Dock**:
   - **Demo Mode Badge**: Rounded amber pill (`DEMO MODE · IN-MEMORY` on desktop, `DEMO` on mobile; text: `#d97706` Light, `#fbbf24` Dark).
   - **Beyond AI Assistant Button**:
     - Label: `AI Assistant` with `Sparkles` icon (13px).
     - Background: Beyond Blue subtle tint (`rgba(37, 99, 235, 0.08)` Light / `rgba(37, 99, 235, 0.16)` Dark).
     - Text/Border: `#1d4ed8` / `#93c5fd`.
     - Action: Toggles the `AIAssistantSidebar` drawer.
   - **Theme Toggle Button**: Square 34x34 icon button (`ThemeToggle`). Switches between Light and Dark themes.
   - **Sync Data Button**: Square 34x34 button. Shows `RefreshCcw` icon (or `Loader2` spinning when syncing). Displays a numeric pill badge if pending operations exist.
   - **Failed Operations Button**: `FileText` icon (34x34). Only appears when `pendingCount > 0` and not actively syncing; opens `FailedOpsModal`.
   - **Install App Button**: `Download` icon (34x34). Only appears when PWA install prompt is triggered.
   - **User Profile Pill**:
     - 32x32 Avatar: Linear gradient (`#2563eb` to `#1d4ed8`) showing user initials (e.g., `AT`).
     - User Info (Desktop only): Bold first name and role tag (e.g., `Admin`, `Manager`).
   - **Sign Out Button**: 34x34 button with `LogOut` icon (16px). Clears demo session and redirects to public landing.

### 2.2 Sub-Header Calendar Strip (`calendar-strip`)
Sticky sub-bar directly below the topbar (`padding: 8px 18px`, `background: var(--bg-subtle)`):
- Left Icon: Lucide `Calendar` (13px) in Beyond Blue.
- Ethiopian Date: Bold 13px date string (e.g., `ጥቅምት 27 2017`).
- Regulatory Tag: `· VAT 15% · ETB · NBE Compliant`.
- Holiday Celebration Badge: Displayed when an Ethiopian holiday is active (e.g., `Sparkles` icon + `Enkutatash / New Year`).

### 2.3 Desktop Sidebar (`Sidebar.tsx`)
Width: `234px` (expanded) or `60px` (collapsed). Transition: `0.22s cubic-bezier(0.2, 0, 0, 1)`:

1. **Brand Header**:
   - 32x32 Gradient Box: Rounded 8px tile displaying company initial (e.g., `B`).
   - Company Title: Bold 13px text with ellipsis truncation.
   - Subtitle: Contact phone number or TIN number (`TIN: 0012345678`) or Sector Name.
   - Toggle Button: `ChevronLeft` (when expanded) / `ChevronRight` (when collapsed).
2. **Active Sector Tile**:
   - Expanded: Interactive card showing 28x28 sector icon, uppercase label `SECTOR`, sector short name (e.g., `Retail & Trading`), and `Switch ▾` button.
   - Collapsed: Centered 32x32 sector icon button with tooltip.
3. **Primary Navigation Links (Universal Top)**:
   - **Home** (`/dashboard`): Icon `LayoutDashboard`, label `Home`, pending operations badge counter.
   - **CRM** (`/crm`): Icon `Briefcase`, label `CRM & Pipeline`.
   - **Transactions** (`/transactions`): Icon `ArrowLeftRight`, label `Transactions`.
   - **Team** (`/employees`): Icon `Users`, label `Team & Staff`.
4. **Sector-Specific Modules Accordion**:
   - Section Header: Uppercase 9.5px label `{Sector} Modules`.
   - Expandable Group Buttons: Shows group name, `ChevronDown` rotation indicator, and item counter pill.
   - Sub-items: Mapped with Lucide icons (e.g., POS -> `Receipt`, Inventory -> `Boxes`, Products -> `Tag`, Suppliers -> `Truck`, Sales Reports -> `BarChart3`).
5. **Secondary Navigation Links (Universal Bottom)**:
   - **Finance** (`/finance`): Icon `Landmark`, label `Finance & Treasury`.
   - **Reports** (`/reports`): Icon `BarChart3`, label `Reports & Compliance`.
   - **Admin** (`/admin`): Icon `ShieldCheck`, label `System Admin`.
   - **Settings** (`/settings`): Icon `Settings`, label `Settings & Setup`.
6. **Sidebar Footer**:
   - Offline Indicator: `Wifi` icon (13px) in Beyond Blue + label `Offline-first`.
   - Embedded `ThemeToggle`.

### 2.4 Mobile Bottom Dock (`BottomNav.tsx`)
Displayed on screens `< 900px` (`height: 56px`, fixed bottom, 5 equal touch targets):
- **Home**: `LayoutDashboard` (18px) + `Home`
- **Money**: `Banknote` (18px) + `Money`
- **Modules**: `Boxes` (18px) + Primary sector module name
- **Team**: `Users` (18px) + `Team`
- **Settings**: `Settings` (18px) + `Settings`
- Active target is highlighted with Beyond Blue icon and text tint.

---

## 3. Page Specifications

### 3.1 Dashboard View (`/dashboard`)

#### Header Area
- **Top Breadcrumb**: Uppercase 11px bold text `OVERVIEW`.
- **Primary Title**: `Good to see you, {UserFirstName}` (20px bold, `-0.01em` tracking).
- **Sector Badge**: Pill containing 22x22 icon box + sector short name.
- **Action Buttons**:
  - `+ Add Transaction`: Primary Beyond Blue button (`#2563eb`), opens `TransactionModal`.
  - `Telebirr`: Outlined white/slate button with `Smartphone` icon, opens `TelebirrModal`.

#### Metric Strip (4 KPI Tiles)
Four-column responsive grid (`grid-template-columns: repeat(4, minmax(0, 1fr))`, collapses on mobile):
1. **Revenue Card**:
   - Label: `REVENUE` (11px uppercase bold).
   - Top-right Icon: `TrendingUp` in 28x28 subtle container.
   - Value: `ETB {amount}` (e.g., `ETB 1,850,420.00`) in 21px bold tabular font.
   - Trend Pill: `ArrowUpRight` (green) + `+12% vs last month`.
2. **Expenses Card**:
   - Label: `EXPENSES` (11px uppercase bold).
   - Top-right Icon: `Receipt` in 28x28 subtle container.
   - Value: `ETB {amount}` in 21px bold tabular font.
   - Trend Pill: `ArrowDownRight` (rose) + `+3% vs last month`.
3. **Net Profit Card**:
   - Label: `NET PROFIT` (11px uppercase bold).
   - Top-right Icon: `Wallet` in 28x28 subtle container.
   - Value: `ETB {amount}` in 21px bold tabular font (colored Beyond Blue if positive, rose if negative).
   - Trend Pill: `+8% vs last month`.
4. **Pending Sync Card**:
   - Label: `PENDING SYNC` (11px uppercase bold).
   - Top-right Icon: `RefreshCw` in 28x28 subtle container.
   - Value: Integer count of queued offline items (e.g., `0` or `3`).
   - Status Note: `All changes saved offline` (muted text).

#### Main Content Row (Chart + Sector Tools)
Two-column responsive grid (`1fr 280px`):

1. **12-Month Rolling Revenue Chart**:
   - Card Header: `REVENUE PERFORMANCE` / `12-Month Rolling Ledger`.
   - Currency Tag: Blue badge `TrendingUp ETB`.
   - Bar Visualization (`height: 108px`):
     - 12 vertical bars for `Jan` through `Dec`.
     - Height scaled proportionally from 5% to 100%.
     - Inactive bars: Slate tint (`#cbd5e1` Light / `#1e293b` Dark).
     - Peak / Current Month bar: Vibrant gradient (`#3b82f6` to `#2563eb`).
     - Tooltip: Browser title displaying `{Month}: ETB {Amount}`.
     - Bottom X-axis: Single-letter month markers (`J`, `F`, `M`, `A`, ...).
2. **Sector Quick Modules List**:
   - Card Header: `{SectorName} Modules` (11px uppercase bold).
   - List Items (First 5 sector capabilities):
     - Clean rows with subtle hover background (`var(--bg-subtle)`), 1px bottom divider.
     - 26x26 Vector Icon Tile (Beyond Blue icon).
     - Feature Title: Bold 12px text (e.g., `POS Checkout`, `BOM Costing`, `Crop Cycles`).
     - Feature Description: 10.5px secondary text with ellipsis truncation.

#### Recent Activity Ledger Table
Card container with subtle header: `TRANSACTIONS` / `{n} Recent Transactions`:
- **Empty State**: Centered text `No transactions recorded in this workspace session yet.`
- **Ledger Rows** (`grid-template-columns: 32px 1fr auto`):
  - **Type Indicator**: 30x30 rounded icon tile (`ArrowDownLeft` green for income, `ArrowUpRight` rose for expense).
  - **Transaction Details**:
    - Primary line: Description string (e.g., `Bulk Coffee Beans Export Lot #44`).
    - Secondary line: Category badge pill (uppercase 10px), bullet separator, formatted date (`DD MMM`), offline indicator tag if un-synced.
  - **Amount & Rails**:
    - Primary line: Bold tabular figure with sign prefix (`+ETB 85,000.00` in green, `−ETB 14,200.00` in ink).
    - Secondary line: Payment rail in uppercase 10px (`TELEBIRR`, `CBE BIRR`, `CASH`, `BANK TRANSFER`).

---

### 3.2 CRM & Sales Pipeline View (`/crm`)

#### Header Area
- **Category Badge**: Pill with `Briefcase` (16px) + `COMMERCIAL OPERATIONS`.
- **Title**: `CRM & Sales Pipeline` (24px bold).
- **Description**: `Track client opportunities, institutional contracts, and B2B deals across Ethiopian sectors.`

#### Filter & Action Bar
- **Sector Dropdown Selector**: Filter deals by `All Sectors` or specific industry.
- **"+ New Deal" Button**: Primary Beyond Blue button, opens deal creation modal.

#### Metric Strip (4 Cards)
1. **Total Pipeline**: Value in ETB (e.g., `24,500,000 ETB`) + opportunity count.
2. **Closed Won Revenue**: Sum of all won deals in ETB + won contract count.
3. **Active Negotiations**: Deals currently in `NEGOTIATION` stage.
4. **Win Rate**: Computed percentage (e.g., `68%`) + label `Conversion efficiency`.

#### 6-Stage Kanban Board
Horizontal scrolling board with 6 status columns (`minmax(240px, 1fr)`):

| Stage Key | Column Header Label | Color Token | Stage Meaning |
| :--- | :--- | :--- | :--- |
| `PROSPECT` | Prospect | Slate (`#64748b`) | Initial identified lead or public tender |
| `CONTACTED` | Contacted | Sky Blue (`#0284c7`) | First contact, meeting, or RFI submission |
| `PROPOSAL` | Proposal | Amber (`#f59e0b`) | Quotation or technical proposal delivered |
| `NEGOTIATION`| Negotiation | Cyan (`#0891b2`) | Contract review, price negotiation, SLA terms |
| `WON` | Closed Won | Emerald (`#10b981`) | Contract signed, down-payment or LC issued |
| `LOST` | Closed Lost | Rose (`#ef4444`) | Disqualified or awarded to competitor |

**Kanban Column Structure**:
- Header: Colored dot, Stage Title, Deal Counter Badge, Stage Sum Total in ETB.
- Deal Cards:
  - Deal Title: Bold 13px text.
  - Client Name: Secondary text + contact phone number.
  - Value Badge: Tabular currency value in bold.
  - Sector Tag: 10px category pill.
  - Action Controls: Back chevron button, Forward chevron button, Delete button.

---

### 3.3 Transactions Ledger View (`/transactions`)

#### Header Area
- **Breadcrumb**: Uppercase `FINANCE`.
- **Title**: `Transactions` (20px bold).
- **Primary Action**: `+ Add Transaction` (opens `TransactionModal`).

#### Metric Strip (4 Cards)
1. **Total Income**: Sum of filtered income transactions (`#10b981`, `TrendingUp`).
2. **Total Expenses**: Sum of filtered expense transactions (`#f43f5e`, `Receipt`).
3. **Net**: Income minus expenses (`#2563eb` if positive, `#f43f5e` if negative, `Wallet`).
4. **Showing**: Display count vs total count (e.g., `25 / 142`, `ListFilter`).

#### Filtering & Search Controls
1. **Type Segmented Pills**:
   - `All`: Neutral/Blue border.
   - `Income`: Green border and tint when active.
   - `Expense`: Rose border and tint when active.
2. **Live Search Input**:
   - `Search` vector icon prefix.
   - Placeholder: `Search transactions…`.
   - Searches description, category, customer/vendor names, reference codes.
3. **Advanced Filter Grid**:
   - Sector dropdown (`All sectors`, `Retail`, `Manufacturing`, ...).
   - Status dropdown (`All statuses`, `COMPLETED`, `PENDING`, `DRAFT`).
   - Payment method dropdown (`All payments`, `Telebirr`, `Cash`, `Bank Transfer`, `CBE Birr`, `Amole`, `Cheque`).
   - `Date From` input (`type="date"`).
   - `Date To` input (`type="date"`).
   - `Clear` button: Resets all filters.

#### Transaction Data Ledger (`TransactionCards`)
- **Table Header Columns**: Status Dot | Description & Category | Payment & Date | Amount | Actions.
- **Table Rows**:
  - 7px status bullet (green for income, rose for expense).
  - Description: Bold 13px text.
  - Metadata: Category pill (e.g., `OFFICE SUPPLIES`), payment rail, formatted date (`DD MMM YYYY`), `offline` tag, `VAT` tag.
  - Amount: Bold tabular figure (`+ETB 14,500.00` in green, `−ETB 3,200.00` in ink).
  - Status Tag: Uppercase 10px badge (`completed`, `pending`, `draft`).
  - Action Buttons:
    - Edit: 28x28 square button with `Pencil` icon (13px).
    - Delete: 28x28 square button with `Trash2` icon (13px) in rose.

#### Pagination Dock (`Pager`)
- Left: `Showing page {p} of {totalPages} ({total} total records)`.
- Right: `Previous` and `Next` buttons (disabled when at boundary).

---

### 3.4 Team & Staff View (`/employees`)

#### Header Area
- **Breadcrumb**: Uppercase `PEOPLE`.
- **Title**: `Team & Personnel` (20px bold).
- **Primary Action**: `+ Add Employee` (opens `EmployeeModal`).

#### Metric Strip (4 Cards)
1. **Total Staff**: Count of total registered employees (`#2563eb`, `Users`).
2. **Active**: Count of employees with status `ACTIVE` (`#10b981`, `CheckCircle2`).
3. **Inactive**: Count of employees with status `INACTIVE` (`#f43f5e`, `XCircle`).
4. **Monthly Payroll**: Sum total of all monthly salaries in ETB (`#f59e0b`, `Banknote`).

#### Filter & Search Toolbar
- **Search Input**: Full-text search by employee name, role, department, or phone.
- **Status Filter**: Dropdown (`All statuses`, `ACTIVE`, `INACTIVE`).
- **Department Filter**: Dropdown (`All departments`, `Finance`, `Operations`, `IT`, `Sales`, `HR`, `Logistics`).
- **Clear Button**: Resets search and department selection.

#### Employee Table
- **Columns**: Avatar | Employee Details | Department | Salary & Status | Edit | Delete.
- **Row Elements**:
  - Avatar: 32x32 rounded 8px tile with deterministic palette color (Blue, Cyan, Teal, Amber, Slate) and initials.
  - Employee Details: Full name (bold 13px), Position/Job Title, Phone number.
  - Department: 12px secondary text.
  - Salary: Bold tabular currency figure in ETB.
  - Status Pill: Uppercase 10px badge (green for `active`, slate for `inactive`).
  - Edit Action: `Pencil` button (28x28).
  - Delete / Deactivate Action: `Trash2` button (28x28) in rose; prompts `ConfirmModal`.

---

### 3.5 Finance & Treasury View (`/finance`)

#### Header Area
- **Breadcrumb**: Uppercase `BUSINESS`.
- **Title**: `Finance & Treasury` (20px bold).
- **Action Buttons**:
  - `New Invoice`: Beyond Blue button with `FileText` icon.
  - `Request Approval`: Outlined button with `Plus` icon.
  - `Run Payroll`: Outlined emerald button with `Users` icon.

#### Metric Strip (4 Cards)
1. **P&L Revenue**: Profit & Loss gross revenue in ETB (`#10b981`, `TrendingUp`).
2. **P&L Expenses**: Profit & Loss operational expenses in ETB (`#f43f5e`, `Receipt`).
3. **Net Cash**: Net cash flow balance in ETB (`#2563eb`, `Wallet`).
4. **Invoiced**: Total outstanding/billed invoice value in ETB (`#f59e0b`, `FileText`).

#### Expandable Forms
1. **Create Invoice Form**:
   - Customer Name (text input, required).
   - Line Item Description (text input, required).
   - Unit Price in ETB (number input, min 1).
   - Sector Assignment (dropdown).
   - Submit Button: `Create Invoice` (Beyond Blue).
2. **Request Expense Approval Form**:
   - Expense Title (text input, required).
   - Category (text input, required).
   - Amount in ETB (number input, required).
   - Submit Button: `Submit Approval` (Beyond Blue).

#### Finance Tabs & Ledger Sub-Views
Segmented tab bar: `Invoices` | `Approvals` | `Payroll` | `Accounts`:

1. **Invoices Tab**:
   - Displays invoice number (e.g., `INV-2024-001`), customer name, total amount in ETB, and status badge (`DRAFT`, `SENT`, `PAID`, `OVERDUE`).
2. **Approvals Tab**:
   - Displays expense title, category, requested amount in ETB, status badge (`REQUESTED`, `APPROVED`, `REJECTED`).
   - Inline Maker-Checker Action Buttons:
     - When `REQUESTED`: `Approve` button (green) and `Reject` button (rose).
     - When `APPROVED`: `Pay` button (blue) to execute disbursement.
3. **Payroll Tab**:
   - Displays payroll run period (e.g., `2024-11`), total employee count, net payout in ETB, and status badge (`APPROVED`, `PAID`).
4. **Chart of Accounts Tab**:
   - Displays account code (e.g., `1000 - Cash & Equivalents`, `2000 - Accounts Payable`), account type (`ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE`), and active status badge.

---

### 3.6 Reports & Tax Filings View (`/reports`)

#### Header Area
- **Breadcrumb**: Uppercase `COMPLIANCE`.
- **Title**: `Reports & Tax Filings` (20px bold).
- **Export Actions**:
  - `CSV`: Button with `Download` icon; exports active transaction set to CSV.
  - `Print`: Button with `Printer` icon; invokes browser print stylesheet.
  - `Share`: Button with `Smartphone` icon; triggers Web Share API.

#### Metric Strip (4 Tax Cards)
1. **Taxable Revenue**: Total standard-rated business income subject to VAT (`#2563eb`, `Coins`).
2. **VAT 15%**: Output VAT collected on behalf of the Ministry of Revenue (`#f59e0b`, `Percent`).
3. **Withholding Tax 2%**: Withheld commercial tax amount (`#0284c7`, `ShieldCheck`).
4. **Total Tax Liability**: Combined statutory liability to tax authority (`#f43f5e`, `FileSpreadsheet`).

#### Period Liability Ledger (Tax Summary Table)
Clean breakdown table showing statutory lines:
1. `Taxable Revenue` -> ETB value
2. `VAT (15%)` -> ETB value
3. `Withholding Tax (2%)` -> ETB value
4. `Total Tax Liability` -> Bold ETB value in rose with subtle background highlight.

#### Sector Volume Breakdown
List of all 12 Ethiopian sectors sorted by volume:
- Sector Title (bold 13px).
- Value in ETB + Percentage of total turnover (`%`).
- Horizontal Progress Bar: 6px track with Beyond Blue animated fill.

---

### 3.7 Admin & System Governance View (`/admin`)

#### Header Area
- **Breadcrumb**: Uppercase `ADMINISTRATION`.
- **Title**: `System Governance & Audit` (20px bold).

#### Metric Strip (4 Governance Cards)
1. **Total Users**: Total registered user accounts (`#2563eb`).
2. **Pending Regs**: Self-service registration applications awaiting approval (`#d97706`).
3. **Audit Events**: Total captured immutable audit log entries (`#0284c7`).
4. **Email Logs**: Total transactional notifications logged (`#0891b2`).

#### System Control Sections
1. **Change Master Password**:
   - Inputs: Current password, New password, Confirm password.
   - Button: `Update Password` (Beyond Blue).
2. **User Management & RBAC Roles**:
   - User List Table: Full name, email, role badge (`ADMIN`, `MANAGER`, `USER`), assigned sector, permissions count, and delete button.
   - "Create User" Form:
     - Name input, Email input, Role dropdown.
     - 12 Permission Checkboxes: `MANAGE_USERS`, `VIEW_REPORTS`, `MANAGE_SETTINGS`, `MANAGE_TRANSACTIONS`, `APPROVE_EXPENSES`, `MANAGE_PAYROLL`, `EXPORT_DATA`, `AUDIT_LOGS`, `SECTOR_OPERATIONS`, `MANAGE_CRM`, `TELEBIRR_DISBURSE`, `BARCODE_OPERATIONS`.
     - Submit Button: `Create User`.
3. **Pending Registration Requests**:
   - Card listing incoming customer registration requests from `/register`.
   - Shows company name, applicant name, phone, TIN, sector, chosen billing plan, and date.
   - Action Buttons: `Approve` (provisions workspace) and `Reject`.
4. **Immutable Audit Logs Ledger**:
   - Filters: Actor Email input, HTTP Method dropdown (`POST`, `PATCH`, `DELETE`), Date From, Date To.
   - Audit Table: Timestamp, Actor email, HTTP method badge, Request path, Status code (`200`, `201`, `400`, `403`), Client IP, and expandable JSON payload viewer.

---

### 3.8 Settings & Configuration View (`/settings`)

#### 1. Business Profile Card
- **Company Name**: Text input with real-time autosave.
- **TIN Number**: Text input (10-digit Ethiopian Tax Identification Number).
- **Business Type**: Select dropdown (`PLC`, `Sole Proprietorship`, `Partnership`, `Cooperative`).
- **Language**: Select dropdown (`English`, `Amharic`, `Afaan Oromo`, `Tigrinya`).
- **Metadata Badges**: `Currency ETB`, `VAT 15%`, `Fiscal Year 2017 E.C.`.

#### 2. Local Rails & Integrations Card
- **Telebirr Toggle**: Switch component (`Ethio Telecom mobile money`).
- **CBE Bank Toggle**: Switch component (`Commercial Bank of Ethiopia`).
- **EHMIS Toggle**: Switch component (`Ethiopian Health MIS`).
- **Email Toggle**: Switch component (`Nodemailer SMTP adapter`).
- **SMTP Test Form** (visible when email is active):
  - Recipient email input.
  - `Send Test` button + live delivery feedback string.

#### 3. Connectivity & Local Storage Card
- **Offline Mode Toggle**: Switch component (`Queue work during poor connectivity`).
- **Auto Sync Toggle**: Switch component (`Sync when connection returns`).
- **Data Compression Toggle**: Switch component (`Reduce local storage footprint`).
- **Local Storage Bar**: Displays utilized KB vs quota (`{used} KB / 5,120 KB ({percent}%)`) with colored progress track.
- **Clear Cache Danger Button**: Red outlined button (`Clear Local Cache`); clears `localStorage` and reloads workspace.

---

## 4. Sector-Specific Modules (`/m/[module]`)

When an industry sector is selected, the application activates dedicated operational modules via `/m/[module]`:

| Sector ID | Sector Name | Specific Navigation Modules | Key UI Operations |
| :--- | :--- | :--- | :--- |
| `retail-trading` | Retail & Trading | `pos`, `inventory`, `products`, `customers`, `suppliers`, `sales-reports` | POS fast checkout, cash-up, barcode scanning, reorder alerts, customer credit ledgers. |
| `manufacturing` | Manufacturing | `bom`, `production-orders`, `raw-materials`, `quality`, `machinery`, `shifts`, `finished-goods`, `waste` | Recipe BOM costing, batch planning, raw material reservations, machine downtime logs. |
| `agriculture` | Agriculture | `crops`, `livestock`, `inputs`, `yields`, `warehouses`, `cooperatives`, `exports`, `field-expenses` | Planting cycles, livestock vaccine registries, cooperative member deliveries and payouts. |
| `construction` | Construction | `budgets`, `site-reports`, `subcontractors`, `materials`, `site-workers`, `equipment` | Contract cost codes, daily weather/site photo logs, retention tracking, equipment hours. |
| `healthcare` | Healthcare | `patients`, `appointments`, `consultations`, `pharmacy`, `lab-orders`, `ehmis` | Patient charts, prescription dispensaries, lab result approvals, EHMIS report exports. |
| `education` | Education | `students`, `fees`, `attendance`, `gradebook`, `teachers` | Student registration, tuition term schedules, parent SMS notifications, grade sheets. |
| `hospitality` | Hospitality | `rooms`, `reservations`, `front-desk`, `housekeeping`, `restaurant-pos`, `billing` | Room status grid (Clean/Occupied/Dirty), reservation calendar, restaurant table orders. |
| `transport-logistics`| Transport & Logistics | `fleet`, `dispatch`, `cargo`, `fuel`, `waybills`, `drivers` | Vehicle GPS/plate logs, consignment waybills, fuel consumption reconciliation. |
| `real-estate` | Real Estate | `properties`, `tenants`, `leases`, `rent-schedules`, `maintenance`, `viewings` | Unit occupancy registers, monthly rent arrears reminders, maintenance work orders. |
| `ngo-development`| NGO & Development | `donors`, `grants`, `beneficiaries`, `procurement`, `monitoring`, `impact` | Grant fund burn-rate tracking, donor milestone compliance, beneficiary aid delivery. |
| `government-services`| Government Services | `permits`, `citizens`, `cases`, `revenue`, `documents`, `counters` | Trade license renewal queues, citizen ID lookups, municipal fee revenue collections. |
| `request-custom` | Bespoke Enterprise | `custom-workflows`, `specialized-modules`, `integrations`, `reporting` | Dynamic configurable tables, customized maker-checker approval rules, custom API bridges. |

---

## 5. Modals & Drawers Inventory

### 5.1 Beyond AI Assistant Drawer (`AIAssistantSidebar.tsx`)
Slide-out right drawer (`width: min(440px, 94vw)`, z-index: 9999):
- **Header**: Avatar with gradient and `Sparkles` icon, Title `Beyond AI Assistant`, live status badge `Online · Active Context`, Close button (`X`).
- **Live Business Context Card**: Injects live calculations into the prompt context:
  - Total Income, Total Expenses, Net Profit (ETB).
  - Estimated 15% Output VAT & ERCA net tax liability.
  - Monthly Staff Payroll, 7% Employee Pension & 11% Employer Pension liabilities.
  - Active CRM Pipeline value in ETB.
- **Quick Prompt Chips**:
  - `Calculate 15% VAT & Pension`
  - `Explain monthly profit trends`
  - `Generate Telebirr payment draft`
  - `Summarize sector operations`
- **Conversation Thread**:
  - User messages: Right-aligned Beyond Blue bubbles (`#2563eb`).
  - Assistant messages: Left-aligned surface cards with Markdown formatting (tables, bullet points, bold figures).
- **Composer Dock**: Textarea input with auto-resize, `Send` button (Beyond Blue), `Trash2` clear conversation button.

### 5.2 Transaction Modal (`TransactionModal.tsx`)
Dialog for recording income and expense entries:
- **Transaction Type Toggle**: Segmented switch between `INCOME` and `EXPENSE`.
- **Amount Input**: Number input with `ETB` currency symbol.
- **Category Input / Dropdown**: Auto-complete category list.
- **Sector Assignment**: Dropdown mapping transaction to an Ethiopian sector.
- **Payment Method**: Select dropdown (`Telebirr`, `Cash`, `Bank Transfer`, `CBE Birr`, `Amole`, `Cheque`).
- **Date Input**: Date picker defaulting to current date.
- **VAT Calculation Checkbox**: Auto-calculates 15% VAT component.
- **Notes Field**: Multiline textarea for reference notes.
- **Footer Buttons**: `Cancel` (secondary) and `Save Transaction` (primary).

### 5.3 Employee Modal (`EmployeeModal.tsx`)
Dialog for personnel onboarding and profile updates:
- **Full Name**: Text input (e.g., `Abebe Bekele`).
- **Phone Number**: Ethiopian mobile input (e.g., `+251 91 123 4567`).
- **Email Address**: Email format input.
- **Position / Job Title**: Text input (e.g., `Senior Accountant`).
- **Department**: Dropdown (`Operations`, `Finance`, `Sales`, `IT`, `HR`, `Logistics`).
- **Monthly Gross Salary**: Numeric input in ETB.
- **Employment Status**: Dropdown (`ACTIVE`, `INACTIVE`).
- **Footer Buttons**: `Cancel` and `Save Employee`.

### 5.4 Telebirr Payment Modal (`TelebirrModal.tsx`)
Simulates instant Ethio Telecom mobile money transactions:
- **Recipient Mobile**: Formatted input with `+251` prefix and validation.
- **Disbursement Amount**: Tabular numeric input in ETB.
- **Transaction Reference**: Auto-generated Telebirr reference code (e.g., `TB-98234-ET`).
- **PIN Verification**: Masked 4-digit security PIN input.
- **Primary Button**: `Process Telebirr Payment` with loading spinner.

### 5.5 Barcode Scanner Simulator (`BarcodeModal.tsx`)
Interactive hardware/camera barcode simulation:
- **Camera Viewfinder Graphic**: Animated laser scan line across targeted area.
- **SKU Search Input**: Manual product barcode lookup.
- **Detected Product Summary**: Displays product name, category, stock balance, and retail price.
- **Action**: `Add to Checkout` button.

### 5.6 Sector Switcher Modal (`SectorSelectModal.tsx`)
Modal triggered from the topbar or sidebar to dynamically change business sector:
- **Header**: Title `Switch Industry Sector Workspace` + search input.
- **12 Sector Grid**:
  - Each sector card displays sector icon, title, description, and feature tag pills.
  - Active sector is marked with a checked border and indicator badge.
  - Selecting a sector updates Redux state (`activeSectorId`) and switches all sidebar modules, KPIs, and demo seed data immediately.

### 5.7 Failed Operations Modal (`FailedOpsModal.tsx`)
Inspects offline queue operations:
- Displays queued mutations (`CREATE_TRANSACTION`, `CREATE_INVOICE`, `CREATE_APPROVAL`).
- Shows timestamp, retry count, error payload, and `Retry Now` / `Discard` buttons.

### 5.8 Confirm Dialog (`ConfirmModal.tsx`)
Generic confirmation modal:
- Message title, warning description, `Cancel` button, and destructive/action confirm button.

---

## 6. Summary of UI File Locations

| File Path | Description |
| :--- | :--- |
| `frontend/src/app/globals.css` | Design tokens, Light/Dark theme CSS variables, layout classes. |
| `frontend/src/app/(app)/layout.tsx` | Demo workspace shell, Topbar, Calendar strip, modal anchors. |
| `frontend/src/components/navigation/Sidebar.tsx` | Desktop 2-column sidebar navigation and sector module groups. |
| `frontend/src/components/navigation/BottomNav.tsx` | Mobile 5-tab fixed navigation dock. |
| `frontend/src/features/erp/views/dashboard.tsx` | Dashboard metric cards, 12-month bar chart, quick modules, activity ledger. |
| `frontend/src/app/(app)/crm/page.tsx` | CRM sales pipeline, 4 metric cards, 6-stage Kanban board. |
| `frontend/src/features/erp/views/transactions.tsx`| Transactions view, filters, search, tabular ledger rows, pagination. |
| `frontend/src/features/erp/views/employees.tsx` | Team management, staff roster table, department filters, payroll KPI. |
| `frontend/src/features/erp/views/finance.tsx` | Finance & Treasury, P&L cards, invoices, expense approvals, chart of accounts. |
| `frontend/src/features/erp/views/reports.tsx` | Reports view, tax summary ledger table, sector volume breakdown bars. |
| `frontend/src/features/erp/views/admin.tsx` | Admin governance, user management table, 12 RBAC permissions, audit log table. |
| `frontend/src/features/erp/views/settings.tsx` | Settings view, business profile, integration switches, local storage meter. |
| `frontend/src/components/AIAssistantSidebar.tsx` | Beyond AI Assistant slide-out drawer, live context calculation, prompt pills. |
| `frontend/src/features/sectors/` | Sector configurations, module routing, operational domain components. |

