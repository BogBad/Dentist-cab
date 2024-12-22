import { CalendarEvent } from '../../types/calendar';
import { create } from 'zustand';

interface ScheduleState {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
}

const useScheduleStore = create<ScheduleState>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  updateEvent: (updatedEvent) =>
    set((state) => {
      return {
        events: state.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        ),
      };
    }),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
}));

export default useScheduleStore;
