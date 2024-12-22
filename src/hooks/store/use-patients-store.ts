import { Patient } from '../../types/patient';
import { create } from 'zustand';

interface IPatientsStore {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  updatePatient: (id: string, patient: Patient) => void;
}

const usePatientsStore = create<IPatientsStore>((set) => ({
  patients: [],
  setPatients: (patients) => set({ patients }),
  addPatient: (patient) =>
    set((state) => ({ patients: [...state.patients, patient] })),
  removePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((patient) => patient.id !== id),
    })),
  updatePatient: (id, patient) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? patient : p)),
    })),
}));

export default usePatientsStore;
