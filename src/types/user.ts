export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  name: string | null;
  id: string;
  surname: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  password: string | null;
  role: UserRole;
  position: string;
  birthDate: Date | null;
}

export interface IUser {
  email: string;
  name: string | null;
  id: string;
  surname: string | null;
  image: string | null;
  position: string | null;
}
