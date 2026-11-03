import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SectorRecord, SectorWorkItem, WorkItemStatus } from "@/types/erp";
import { INITIAL_SECTOR_RECORDS, INITIAL_WORK_ITEMS } from "../initialData";

export interface SectorsState {
  activeSectorId: string;
  workItems: SectorWorkItem[];
  records: SectorRecord[];
}

const initialState: SectorsState = {
  activeSectorId: "healthcare",
  workItems: INITIAL_WORK_ITEMS,
  records: INITIAL_SECTOR_RECORDS,
};

export const sectorsSlice = createSlice({
  name: "sectors",
  initialState,
  reducers: {
    setActiveSector: (state, action: PayloadAction<string>) => {
      state.activeSectorId = action.payload;
    },
    addWorkItem: (
      state,
      action: PayloadAction<Omit<SectorWorkItem, "id" | "createdAt">>
    ) => {
      const newItem: SectorWorkItem = {
        ...action.payload,
        id: `wi-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      state.workItems.unshift(newItem);
    },
    updateWorkItemStatus: (
      state,
      action: PayloadAction<{ id: string; status: WorkItemStatus }>
    ) => {
      const item = state.workItems.find((w) => w.id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
      }
    },
    deleteWorkItem: (state, action: PayloadAction<string>) => {
      state.workItems = state.workItems.filter((w) => w.id !== action.payload);
    },
    addSectorRecord: (
      state,
      action: PayloadAction<Omit<SectorRecord, "id" | "createdAt">>
    ) => {
      const newRecord: SectorRecord = {
        ...action.payload,
        id: `sr-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      state.records.unshift(newRecord);
    },
    deleteSectorRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
    resetSectors: (state) => {
      state.activeSectorId = "healthcare";
      state.workItems = INITIAL_WORK_ITEMS;
      state.records = INITIAL_SECTOR_RECORDS;
    },
  },
});

export const {
  setActiveSector,
  addWorkItem,
  updateWorkItemStatus,
  deleteWorkItem,
  addSectorRecord,
  deleteSectorRecord,
  resetSectors,
} = sectorsSlice.actions;

export default sectorsSlice.reducer;
