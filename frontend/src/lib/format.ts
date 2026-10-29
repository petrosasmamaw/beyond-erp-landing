export function formatCurrency(value: number) {
  return `ETB ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(Math.round(value || 0))}`;
}

export function formatDate(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((today.getTime() - compare.getTime()) / 86400000);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

export function getEthiopianDate(input = new Date()) {
  const gregorianYear = input.getFullYear();
  const ethiopianYear = input.getMonth() > 8 || (input.getMonth() === 8 && input.getDate() >= 11)
    ? gregorianYear - 7
    : gregorianYear - 8;

  const months = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yakatit",
    "Megabit",
    "Miyazia",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehasa",
    "Pagume"
  ];

  const approximateStart = new Date(gregorianYear, 8, 11);
  const start = input < approximateStart ? new Date(gregorianYear - 1, 8, 11) : approximateStart;
  const elapsedDays = Math.max(0, Math.floor((input.getTime() - start.getTime()) / 86400000));
  const monthIndex = Math.min(12, Math.floor(elapsedDays / 30));
  const day = (elapsedDays % 30) + 1;

  return `${String(day).padStart(2, "0")} ${months[monthIndex]} ${ethiopianYear} E.C.`;
}

export function validateEthiopianPhone(phone: string) {
  return /^(\+251|0)?9\d{8}$/.test(phone.replace(/\s/g, ""));
}

export function getEthiopianFiscalYear(date = new Date()): number {
  return date.getMonth() > 8 || (date.getMonth() === 8 && date.getDate() >= 11)
    ? date.getFullYear() - 7
    : date.getFullYear() - 8;
}

export function getEthiopianHoliday(date = new Date()): string | null {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const fixed: [number, number, string][] = [
    [1, 7, "Ethiopian Christmas (Genna)"],
    [1, 19, "Timkat (Ethiopian Epiphany)"],
    [3, 2, "Victory of Adwa Day"],
    [5, 1, "International Labour Day"],
    [5, 5, "Patriots Victory Day"],
    [5, 28, "Derg Downfall Day"],
    [9, 11, "Ethiopian New Year (Enkutatash)"],
    [9, 27, "Meskel (Finding of the True Cross)"]
  ];
  const match = fixed.find(([hm, hd]) => hm === m && hd === d);
  return match ? match[2] : null;
}
