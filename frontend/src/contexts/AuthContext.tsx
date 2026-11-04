"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  api,
  getRealAuthToken,
  setRealAuthToken,
  getDemoAuthToken,
  setDemoAuthToken,
  clearAllAuthTokens,
  DEMO_TOKEN_STORAGE
} from "@/lib/api";
import type { User } from "@/lib/types";
import { INITIAL_USER, SECTORS_CATALOG } from "@/store/initialData";

interface AuthContextValue {
  user: User | null;
  isDemo: boolean;
  isAuthenticating: boolean;
  login: (token: string, user: User) => void;
  loginDemo: (sectorId?: string, companyName?: string, overrides?: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const realToken = getRealAuthToken();
    const demoToken = getDemoAuthToken();

    // 1. If a REAL account token exists, attempt to verify it with backend
    if (realToken) {
      api
        .me()
        .then((res) => {
          setUser(res.user);
          setIsDemo(false);
          // If real account authenticated successfully, clear any leftover demo cookie
          setDemoAuthToken(null);
        })
        .catch(() => {
          // Real token is invalid/expired
          setRealAuthToken(null);
          // Check if demo token exists as fallback
          if (demoToken) {
            restoreDemoSession();
          } else {
            setUser(null);
            setIsDemo(false);
          }
        })
        .finally(() => setIsAuthenticating(false));
      return;
    }

    // 2. If NO real token, but DEMO token exists, restore demo session
    if (demoToken) {
      restoreDemoSession();
      setIsAuthenticating(false);
      return;
    }

    // 3. Neither exists: unauthenticated
    setUser(null);
    setIsDemo(false);
    setIsAuthenticating(false);
  }, []);

  const restoreDemoSession = useCallback(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(DEMO_TOKEN_STORAGE) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setUser(parsed);
          setIsDemo(true);
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // Default demo session fallback
    const defaultSector = SECTORS_CATALOG[0];
    const fallbackDemoUser: User = {
      ...(INITIAL_USER as unknown as User),
      companySectorId: defaultSector.id,
      companyName: defaultSector.defaultCompanyName,
      companyTinNumber: defaultSector.defaultTin,
      role: "OWNER",
      status: "ACTIVE"
    };
    setUser(fallbackDemoUser);
    setIsDemo(true);
  }, []);

  /**
   * Real Account Login: saves `beyond_real_token`, removes `beyond_demo_token`
   */
  const login = useCallback((token: string, newUser: User) => {
    setRealAuthToken(token);
    setDemoAuthToken(null);
    setUser(newUser);
    setIsDemo(false);
  }, []);

  /**
   * Demo Session Login: saves `beyond_demo_token`, removes `beyond_real_token`
   */
  const loginDemo = useCallback(
    (sectorId: string = "retail-trading", companyName?: string, overrides?: Partial<User>) => {
      setRealAuthToken(null);
      const demoToken = `beyond-demo-${sectorId}-${Date.now()}`;
      setDemoAuthToken(demoToken);

      const sectorMeta = SECTORS_CATALOG.find((s) => s.id === sectorId);
      const effectiveCompany =
        companyName || sectorMeta?.defaultCompanyName || "Merkato Wholesale & Supermarket PLC";
      const effectiveTin = sectorMeta?.defaultTin || "0012345678";

      const demoUser: User = {
        ...(INITIAL_USER as unknown as User),
        id: "demo-user-owner",
        fullName: overrides?.fullName || INITIAL_USER.fullName,
        email: overrides?.email || "demo@beyonderp.et",
        phone: overrides?.phone || "+251 911 234 567",
        companyName: effectiveCompany,
        companyTinNumber: effectiveTin,
        companySectorId: sectorId,
        role: "OWNER",
        status: "ACTIVE",
        lastLoginAt: new Date().toISOString()
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(DEMO_TOKEN_STORAGE, JSON.stringify(demoUser));
        } catch {
          // Ignore storage errors
        }
      }

      setUser(demoUser);
      setIsDemo(true);
    },
    []
  );

  /**
   * Sign Out: clears BOTH real account & demo cookies/storage
   */
  const logout = useCallback(() => {
    clearAllAuthTokens();
    setUser(null);
    setIsDemo(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isDemo, isAuthenticating, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
