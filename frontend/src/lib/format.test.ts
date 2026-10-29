import { describe, expect, it } from "vitest";
import { formatCurrency, getInitials, validateEthiopianPhone } from "./format";

describe("format helpers", () => {
  it("formats ETB values", () => {
    expect(formatCurrency(123456)).toBe("ETB 123,456");
  });

  it("generates initials", () => {
    expect(getInitials("Abebe Kebede")).toBe("AK");
  });

  it("validates Ethiopian phone numbers", () => {
    expect(validateEthiopianPhone("+251 911 234 567")).toBe(true);
    expect(validateEthiopianPhone("+1 555 000")).toBe(false);
  });
});
