export type Gender = 'MALE' | 'FEMALE';

export interface Patient {
  id: string;
  image: string | null;
  name: string | null;
  surname: string | null;
  email: string;
  birthDate: Date | null;
  gender: Gender | null;
}

export interface PatientWithEvents extends Patient {
  patientEvents: PatientEvent[];
}

export interface PatientEvent {
  id: string;
  startDate: Date;
  doctor: {
    id: string;
    name: string | null;
    surname: string | null;
  };
  service: {
    name: string;
    duration: number;
  };
}
