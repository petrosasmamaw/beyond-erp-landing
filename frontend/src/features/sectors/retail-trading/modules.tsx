"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#f59e0b";

export function POS() {
  return (
    <ModulePage
      title="POS Checkout"
      icon="fa-solid fa-cash-register"
      color={COLOR}
      description="Fast sales, discounts, cash-up, and receipts"
      stats={[
        { label: "Today's Sales" },
        { label: "Transactions" },
        { label: "Items Sold" },
        { label: "Cash Drawer" }
      ]}
      addLabel="Open Sale"
      emptyMessage="No sales today — open the first POS transaction"
    />
  );
}

export function Inventory() {
  return (
    <ModulePage
      title="Inventory"
      icon="fa-solid fa-boxes-stacked"
      color="#8b5cf6"
      description="Track stock levels, costs, and warehouse balances"
      stats={[
        { label: "Total SKUs" },
        { label: "Low Stock" },
        { label: "Out of Stock" },
        { label: "Total Value" }
      ]}
      addLabel="Add Stock"
      emptyMessage="No inventory items yet — add your first product"
    />
  );
}

export function Products() {
  return (
    <ModulePage
      title="Products"
      icon="fa-solid fa-tags"
      color="#10b981"
      description="Manage SKU, pricing, categories, and variants"
      stats={[
        { label: "Total Products" },
        { label: "Active" },
        { label: "Categories" },
        { label: "Avg Price" }
      ]}
      addLabel="Add Product"
      emptyMessage="No products yet — create your first product listing"
    />
  );
}

export function Customers() {
  return (
    <ModulePage
      title="Customers"
      icon="fa-solid fa-users"
      color="#06b6d4"
      description="Customer ledger, credit limits, and purchase history"
      stats={[
        { label: "Total Customers" },
        { label: "Active" },
        { label: "Outstanding Credit" },
        { label: "New This Month" }
      ]}
      addLabel="Add Customer"
      emptyMessage="No customers yet — add your first customer profile"
    />
  );
}

export function Suppliers() {
  return (
    <ModulePage
      title="Suppliers"
      icon="fa-solid fa-truck-field"
      color="#f97316"
      description="Supplier contacts, purchase orders, and payables"
      stats={[
        { label: "Total Suppliers" },
        { label: "Open Orders" },
        { label: "Pending Payments" },
        { label: "This Month" }
      ]}
      addLabel="Add Supplier"
      emptyMessage="No suppliers yet — add your first supplier"
    />
  );
}

export function SalesReports() {
  return (
    <ModulePage
      title="Sales Reports"
      icon="fa-solid fa-chart-line"
      color="#ec4899"
      description="Daily revenue, VAT, branch, and cashier reports"
      stats={[
        { label: "Today's Revenue" },
        { label: "VAT Collected" },
        { label: "Top Product" },
        { label: "Monthly Total" }
      ]}
      emptyMessage="No sales data to report yet"
    />
  );
}
