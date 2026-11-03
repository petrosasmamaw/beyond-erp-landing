import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "@/types/erp";
import { INITIAL_EMPLOYEES } from "../initialData";

export interface EmployeesState {
  items: Employee[];
  search: string;
  filterDepartment: string;
  filterStatus: string;
  page: number;
  limit: number;
}

const initialState: EmployeesState = {
  items: INITIAL_EMPLOYEES,
  search: "",
  filterDepartment: "",
  filterStatus: "",
  page: 1,
  limit: 8,
};

export const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Omit<Employee, "id" | "createdAt">>) => {
      const id = `e-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newEmp: Employee = {
        ...action.payload,
        id,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newEmp);
    },
    editEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleStatus: (state, action: PayloadAction<string>) => {
      const emp = state.items.find((item) => item.id === action.payload);
      if (emp) {
        emp.status = emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setFilterDepartment: (state, action: PayloadAction<string>) => {
      state.filterDepartment = action.payload;
      state.page = 1;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetEmployees: (state) => {
      state.items = INITIAL_EMPLOYEES;
      state.search = "";
      state.page = 1;
    },
  },
});

export const {
  addEmployee,
  editEmployee,
  deleteEmployee,
  toggleStatus,
  setSearch,
  setFilterDepartment,
  setFilterStatus,
  setPage,
  resetEmployees,
} = employeesSlice.actions;

export default employeesSlice.reducer;
