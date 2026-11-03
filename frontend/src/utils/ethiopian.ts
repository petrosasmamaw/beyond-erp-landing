export function formatCurrency(amount: number): string {
  return `ETB ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(amount || 0))}`;
}

export function calculateVat(subtotal: number): { vatAmount: number; total: number; withholding: number } {
  const vatAmount = Math.round(subtotal * 0.15);
  const total = subtotal + vatAmount;
  const withholding = Math.round(subtotal * 0.02);
  return { vatAmount, total, withholding };
}

export function getEthiopianDate(input = new Date()): string {
  const gregorianYear = input.getFullYear();
  const ethiopianYear = input.getMonth() > 8 || (input.getMonth() === 8 && input.getDate() >= 11)
    ? gregorianYear - 7
    : gregorianYear - 8;

  const months = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
    "Megabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehasa", "Pagume"
  ];

  const approxStart = new Date(gregorianYear, 8, 11);
  const start = input < approxStart ? new Date(gregorianYear - 1, 8, 11) : approxStart;
  const elapsedDays = Math.max(0, Math.floor((input.getTime() - start.getTime()) / 86400000));
  const monthIndex = Math.min(12, Math.floor(elapsedDays / 30));
  const day = (elapsedDays % 30) + 1;

  return `${String(day).padStart(2, "0")} ${months[monthIndex]} ${ethiopianYear} E.C.`;
}

export function getEthiopianHoliday(date = new Date()): string | null {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const holidays: [number, number, string][] = [
    [1, 7, "Ethiopian Christmas (Genna)"],
    [1, 19, "Timkat (Epiphany)"],
    [3, 2, "Victory of Adwa Day"],
    [5, 1, "International Labour Day"],
    [5, 5, "Patriots Victory Day"],
    [5, 28, "Derg Downfall Day (Ginbot 20)"],
    [9, 11, "Ethiopian New Year (Enkutatash)"],
    [9, 27, "Meskel (Finding of True Cross)"]
  ];
  const found = holidays.find(([hm, hd]) => hm === m && hd === d);
  return found ? found[2] : null;
}

export function validateEthiopianPhone(phone: string): boolean {
  return /^(\+251|0)?[97]\d{8}$/.test(phone.replace(/[\s\-]/g, ""));
}
