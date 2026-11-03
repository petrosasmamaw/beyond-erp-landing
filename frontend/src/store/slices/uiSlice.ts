import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  modalData: unknown;
  toastMessage: string | null;
  theme: "dark" | "light";
  pendingSyncCount: number;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  toastMessage: null,
  theme: "dark",
  pendingSyncCount: 1,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ type: string; data?: unknown }>
    ) => {
      state.activeModal = action.payload.type;
      state.modalData = action.payload.data ?? null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toastMessage = action.payload;
    },
    hideToast: (state) => {
      state.toastMessage = null;
    },
    simulateSync: (state) => {
      state.pendingSyncCount = 0;
      state.toastMessage = "All operations synced to ledger";
    },
  },
});

export const {
  toggleSidebar,
  setTheme,
  openModal,
  closeModal,
  showToast,
  hideToast,
  simulateSync,
} = uiSlice.actions;

export default uiSlice.reducer;

