import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Settings } from "@/types/erp";
import { INITIAL_SETTINGS } from "../initialData";

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
});

export const { updateSettings, resetSettingsToDefault } = settingsSlice.actions;
export default settingsSlice.reducer;

