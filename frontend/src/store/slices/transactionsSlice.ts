import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Transaction, TransactionType } from "@/types/erp";
import { INITIAL_TRANSACTIONS } from "../initialData";

export interface TransactionsState {
  items: Transaction[];
  search: string;
  filterType: "ALL" | TransactionType;
  filterSector: string;
  filterCategory: string;
  page: number;
  limit: number;
}

const initialState: TransactionsState = {
  items: INITIAL_TRANSACTIONS,
  search: "",
  filterType: "ALL",
  filterSector: "",
  filterCategory: "",
  page: 1,
  limit: 10,
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (
      state,
      action: PayloadAction<Omit<Transaction, "id" | "createdAt" | "synced">>
    ) => {
      const id = `t-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const vatAmount = action.payload.vatAmount !== undefined
        ? action.payload.vatAmount
        : Math.round(action.payload.amount * 0.15);
      const newTx: Transaction = {
        ...action.payload,
        id,
        vatAmount,
        synced: true,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newTx);
    },
    editTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setFilterType: (state, action: PayloadAction<"ALL" | TransactionType>) => {
      state.filterType = action.payload;
      state.page = 1;
    },
    setFilterSector: (state, action: PayloadAction<string>) => {
      state.filterSector = action.payload;
      state.page = 1;
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetTransactions: (state) => {
      state.items = INITIAL_TRANSACTIONS;
      state.search = "";
      state.filterType = "ALL";
      state.page = 1;
    },
  },
});

export const {
  addTransaction,
  editTransaction,
  deleteTransaction,
  setSearch,
  setFilterType,
  setFilterSector,
  setFilterCategory,
  setPage,
  resetTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
