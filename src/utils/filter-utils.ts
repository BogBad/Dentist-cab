import { Employee, ModifiedEmployee } from '../types/employee';
import { Filter, ScheduleFilters } from '../types';
import { Service } from '../types/service';
import { Patient } from '../types/patient';
import { CalendarEvent } from '../types/calendar';

export const filterEmployees = (
  employees: Employee[],
  filters: Filter
): Employee[] => {
  if (employees.length === 0) return [];

  const filteredEmployees = employees.filter((employee) => {
    return (
      !filters.search ||
      employee.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.surname?.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.position?.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  const startIndex = (filters.page - 1) * filters.rowsPerPage;
  const endIndex = startIndex + filters.rowsPerPage;

  return filteredEmployees.slice(startIndex, endIndex);
};

export const filterServices = (
  services: Service[],
  filters: Filter
): Service[] => {
  if (services.length === 0) return [];

  const filteredServices = services.filter((service) => {
    return (
      !filters.search ||
      service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.description?.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  const startIndex = (filters.page - 1) * filters.rowsPerPage;
  const endIndex = startIndex + filters.rowsPerPage;

  return filteredServices.slice(startIndex, endIndex);
};

export const filterPatients = (
  patients: Patient[],
  filters: Filter
): Patient[] => {
  if (patients.length === 0) return [];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      !filters.search ||
      patient.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.surname?.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesGender = !filters.gender || patient.gender === filters.gender;

    return matchesSearch && matchesGender;
  });

  const startIndex = (filters.page - 1) * filters.rowsPerPage;
  const endIndex = startIndex + filters.rowsPerPage;

  return filteredPatients.slice(startIndex, endIndex);
};

export const filterEvents = (
  events: CalendarEvent[],
  filters: ScheduleFilters
): CalendarEvent[] => {
  if (events.length === 0) return [];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !filters.search ||
      event.title.toLowerCase().includes(filters.search.toLowerCase());

    const matchesDoctors =
      !filters.doctors ||
      filters.doctors.length === 0 ||
      filters.doctors.includes(event.doctorId);

    return matchesSearch && matchesDoctors;
  });

  return filteredEvents;
};
