import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SectorMeta, SectorRecord, SectorWorkItem, WorkItemStatus } from "@/types/erp";
import {
  INITIAL_SECTOR_RECORDS,
  INITIAL_WORK_ITEMS,
  INITIAL_WORK_ITEMS_BY_SECTOR,
  SECTORS_CATALOG,
} from "../initialData";

export interface SectorsState {
  activeSectorId: string;
  catalog: SectorMeta[];
  recordsBySector: Record<string, SectorRecord[]>;
  workItemsBySector: Record<string, SectorWorkItem[]>;
  // Backwards compatibility convenience properties
  records: SectorRecord[];
  workItems: SectorWorkItem[];
}

const defaultSectorId = "retail-trading";

const initialState: SectorsState = {
  activeSectorId: defaultSectorId,
  catalog: SECTORS_CATALOG,
  recordsBySector: INITIAL_SECTOR_RECORDS,
  workItemsBySector: INITIAL_WORK_ITEMS_BY_SECTOR,
  records: INITIAL_SECTOR_RECORDS[defaultSectorId] || [],
  workItems: INITIAL_WORK_ITEMS,
};

export const sectorsSlice = createSlice({
  name: "sectors",
  initialState,
  reducers: {
    switchSector: (state, action: PayloadAction<string>) => {
      state.activeSectorId = action.payload;
      state.records = state.recordsBySector[action.payload] || [];
      state.workItems = state.workItemsBySector[action.payload] || [];
    },
    setActiveSector: (state, action: PayloadAction<string>) => {
      state.activeSectorId = action.payload;
      state.records = state.recordsBySector[action.payload] || [];
      state.workItems = state.workItemsBySector[action.payload] || [];
    },
    addSectorRecord: (
      state,
      action: PayloadAction<Omit<SectorRecord, "id" | "createdAt">>
    ) => {
      const secId = action.payload.sectorId || state.activeSectorId;
      const newRecord: SectorRecord = {
        ...action.payload,
        sectorId: secId,
        id: `sr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      if (!state.recordsBySector[secId]) {
        state.recordsBySector[secId] = [];
      }
      state.recordsBySector[secId].unshift(newRecord);
      if (secId === state.activeSectorId) {
        state.records.unshift(newRecord);
      }
    },
    deleteSectorRecord: (
      state,
      action: PayloadAction<{ sectorId?: string; id: string } | string>
    ) => {
      const id = typeof action.payload === "string" ? action.payload : action.payload.id;
      const secId = typeof action.payload === "string" ? state.activeSectorId : (action.payload.sectorId || state.activeSectorId);
      
      if (state.recordsBySector[secId]) {
        state.recordsBySector[secId] = state.recordsBySector[secId].filter((r) => r.id !== id);
      }
      state.records = state.records.filter((r) => r.id !== id);
    },
    addWorkItem: (
      state,
      action: PayloadAction<Omit<SectorWorkItem, "id" | "createdAt">>
    ) => {
      const secId = action.payload.sectorId || state.activeSectorId;
      const newItem: SectorWorkItem = {
        ...action.payload,
        sectorId: secId,
        id: `wi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      if (!state.workItemsBySector[secId]) {
        state.workItemsBySector[secId] = [];
      }
      state.workItemsBySector[secId].unshift(newItem);
      if (secId === state.activeSectorId) {
        state.workItems.unshift(newItem);
      }
    },
    updateWorkItemStatus: (
      state,
      action: PayloadAction<{ sectorId?: string; id: string; status: WorkItemStatus }>
    ) => {
      const secId = action.payload.sectorId || state.activeSectorId;
      const list = state.workItemsBySector[secId] || [];
      const item = list.find((w) => w.id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
      }
      const direct = state.workItems.find((w) => w.id === action.payload.id);
      if (direct) {
        direct.status = action.payload.status;
      }
    },
    deleteWorkItem: (
      state,
      action: PayloadAction<{ sectorId?: string; id: string } | string>
    ) => {
      const id = typeof action.payload === "string" ? action.payload : action.payload.id;
      const secId = typeof action.payload === "string" ? state.activeSectorId : (action.payload.sectorId || state.activeSectorId);
      if (state.workItemsBySector[secId]) {
        state.workItemsBySector[secId] = state.workItemsBySector[secId].filter((w) => w.id !== id);
      }
      state.workItems = state.workItems.filter((w) => w.id !== id);
    },
    resetSectors: (state) => {
      state.activeSectorId = defaultSectorId;
      state.recordsBySector = INITIAL_SECTOR_RECORDS;
      state.workItemsBySector = INITIAL_WORK_ITEMS_BY_SECTOR;
      state.records = INITIAL_SECTOR_RECORDS[defaultSectorId] || [];
      state.workItems = INITIAL_WORK_ITEMS_BY_SECTOR[defaultSectorId] || [];
    },
  },
});

export const {
  switchSector,
  setActiveSector,
  addWorkItem,
  updateWorkItemStatus,
  deleteWorkItem,
  addSectorRecord,
  deleteSectorRecord,
  resetSectors,
} = sectorsSlice.actions;

export default sectorsSlice.reducer;
