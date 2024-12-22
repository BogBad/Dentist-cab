import { create } from 'zustand';
import { Employee } from '../../types/employee';

export interface EmployeeStore {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

const useEmployeesStore = create<EmployeeStore>((set) => ({
  employees: [],
  setEmployees: (employees: Employee[]) => set({ employees }),
}));

export default useEmployeesStore;
