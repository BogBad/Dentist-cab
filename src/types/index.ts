import { Gender } from './patient';

export interface Filter {
  search?: string;
  gender?: Gender;
  page: number;
  rowsPerPage: number;
}

export interface ScheduleFilters {
  search: string | null;
  doctors: string[] | null;
}
