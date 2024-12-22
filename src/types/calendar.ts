import { z } from 'zod';
import { Service } from './service';
import { Employee } from './employee';
import { Patient } from './patient';

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  serviceId: z.string(),
  doctorId: z.string(),
  patientId: z.string(),
});

export type CalendarEvent = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  serviceId: string;
  doctorId: string;
  doctor?: {
    name: string | null;
    surname: string | null;
  };
  patientId: string;
};

export interface EventWithPosition extends CalendarEvent {
  column: number;
  totalColumns: number;
}

export interface SingleEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  service: Service;
  doctor: Employee;
  patient: Patient;
}

export type CalendarView = 'day' | 'week';
