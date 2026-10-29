import type { NewEmployeeInput, NewTransactionInput, Sector } from "@/lib/types";

export const pageSize = 6;

export function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function paginate<T>(items: T[], page: number, size = pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((safePage - 1) * size, safePage * size),
    totalPages,
    page: safePage
  };
}

export function defaultTransaction(sectors: Sector[]): NewTransactionInput {
  const firstSector = sectors[0];
  return {
    type: "INCOME",
    amount: 0,
    description: "",
    category: firstSector?.name ?? "Retail & Trading",
    sectorId: firstSector?.id ?? null,
    paymentMethod: "Telebirr",
    vatAmount: 0,
    status: "COMPLETED",
    synced: true,
    occurredAt: new Date().toISOString()
  };
}

export function defaultEmployee(): NewEmployeeInput {
  return {
    fullName: "",
    position: "",
    department: "",
    phone: "",
    email: "",
    salary: 0,
    status: "ACTIVE",
    hiredDate: new Date().toISOString().slice(0, 10)
  };
}

export function getStorageUsage() {
  if (typeof window === "undefined") return { usedKb: 0, percent: 0 };
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += (localStorage.getItem(key) ?? "").length * 2;
  }
  return {
    usedKb: Math.round(total / 1024),
    percent: Math.min(100, Math.round((total / (5 * 1024 * 1024)) * 100))
  };
}
