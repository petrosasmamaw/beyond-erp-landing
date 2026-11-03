import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import transactionsReducer from "./slices/transactionsSlice";
import employeesReducer from "./slices/employeesSlice";
import financeReducer from "./slices/financeSlice";
import sectorsReducer from "./slices/sectorsSlice";
import settingsReducer from "./slices/settingsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    employees: employeesReducer,
    finance: financeReducer,
    sectors: sectorsReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
