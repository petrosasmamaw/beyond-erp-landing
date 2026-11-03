import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserRole } from "@/types/erp";
import { INITIAL_USER } from "../initialData";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isDemo: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAsDemo: (state, action: PayloadAction<{ sectorId?: string; companyName?: string } | undefined>) => {
      const sectorId = action?.payload?.sectorId ?? "healthcare";
      const companyName = action?.payload?.companyName ?? (sectorId === "retail-trading" ? "Merkato Wholesale PLC" : "Selam Medical & Trading PLC");
      state.user = {
        ...INITIAL_USER,
        companySectorId: sectorId,
        companyName,
        role: "OWNER",
        status: "ACTIVE",
        lastLoginAt: new Date().toISOString(),
      };
      state.isAuthenticated = true;
      state.isDemo = true;
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isDemo = false;
    },
    switchRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
        if (action.payload === "STAFF" || action.payload === "VIEWER") {
          state.user.effectivePermissions = ["View", "Transactions"];
        } else if (action.payload === "MANAGER") {
          state.user.effectivePermissions = ["View", "Transactions", "Employees", "Reports"];
        } else {
          state.user.effectivePermissions = ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"];
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isDemo = false;
    },
  },
});

export const { loginAsDemo, login, switchRole, logout } = authSlice.actions;
export default authSlice.reducer;

