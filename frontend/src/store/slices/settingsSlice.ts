import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Settings } from "@/types/erp";
import { INITIAL_SETTINGS, SECTORS_CATALOG } from "../initialData";
import { switchSector } from "./sectorsSlice";
import { loginAsDemo } from "./authSlice";

export interface SettingsState {
  settings: Settings;
}

const initialState: SettingsState = {
  settings: INITIAL_SETTINGS,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetSettingsToDefault: (state) => {
      state.settings = INITIAL_SETTINGS;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(switchSector, (state, action) => {
        const sectorMeta = SECTORS_CATALOG.find((s) => s.id === action.payload);
        if (sectorMeta) {
          state.settings.companySectorId = sectorMeta.id;
          state.settings.companyName = sectorMeta.defaultCompanyName;
          state.settings.tinNumber = sectorMeta.defaultTin;
        }
      })
      .addCase(loginAsDemo, (state, action) => {
        const sectorId = action.payload?.sectorId ?? "retail-trading";
        const sectorMeta = SECTORS_CATALOG.find((s) => s.id === sectorId);
        if (sectorMeta) {
          state.settings.companySectorId = sectorMeta.id;
          state.settings.companyName = action.payload?.companyName || sectorMeta.defaultCompanyName;
          state.settings.tinNumber = action.payload?.tinNumber || sectorMeta.defaultTin;
          if (action.payload?.email) {
            // keep contact email
          }
        }
      });
  },
});

export const { updateSettings, resetSettingsToDefault } = settingsSlice.actions;
export default settingsSlice.reducer;
