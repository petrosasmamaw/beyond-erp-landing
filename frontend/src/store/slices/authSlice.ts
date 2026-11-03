import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserRole } from "@/types/erp";
import { INITIAL_USER, SECTORS_CATALOG } from "../initialData";
import { switchSector } from "./sectorsSlice";

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
    loginAsDemo: (
      state,
      action: PayloadAction<{ sectorId?: string; companyName?: string } | undefined>
    ) => {
      const sectorId = action?.payload?.sectorId ?? "retail-trading";
      const sectorMeta = SECTORS_CATALOG.find((s) => s.id === sectorId);
      const companyName =
        action?.payload?.companyName ??
        sectorMeta?.defaultCompanyName ??
        "Merkato Wholesale & Supermarket PLC";
      const companyTinNumber = sectorMeta?.defaultTin ?? "0012345678";

      state.user = {
        ...INITIAL_USER,
        companySectorId: sectorId,
        companyName,
        companyTinNumber,
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
          state.user.effectivePermissions = [
            "View",
            "Transactions",
            "Employees",
            "Reports",
          ];
        } else {
          state.user.effectivePermissions = [
            "View",
            "Transactions",
            "Employees",
            "Finance",
            "Reports",
            "Users",
            "Settings",
          ];
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isDemo = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(switchSector, (state, action) => {
      if (state.user) {
        const sectorMeta = SECTORS_CATALOG.find((s) => s.id === action.payload);
        if (sectorMeta) {
          state.user.companySectorId = sectorMeta.id;
          state.user.companyName = sectorMeta.defaultCompanyName;
          state.user.companyTinNumber = sectorMeta.defaultTin;
        }
      }
    });
  },
});

export const { loginAsDemo, login, switchRole, logout } = authSlice.actions;
export default authSlice.reducer;
