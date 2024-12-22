import { create } from 'zustand';
import { Service } from '../../types/service';

interface ServiceStore {
  services: Service[];
  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  deleteService: (id: string) => void;
  updateService: (service: Service) => void;
}

const useServicesStore = create<ServiceStore>((set) => ({
  services: [],
  setServices: (services) => set({ services }),
  addService: (service) =>
    set((state) => ({ services: [...state.services, service] })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
  updateService: (service) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === service.id ? service : s)),
    })),
}));

export default useServicesStore;
