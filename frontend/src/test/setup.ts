import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window.navigator, "onLine", {
  configurable: true,
  value: true
});

Object.defineProperty(window.navigator, "serviceWorker", {
  configurable: true,
  value: {
    register: vi.fn().mockResolvedValue(undefined)
  }
});
