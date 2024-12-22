import { z } from 'zod';

export const EmployeeSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  position: z.string().nullable(),
  email: z.string(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export interface ModifiedEmployee {
  id: string;
  fullName: string;
  email: string;
  position: string;
}
