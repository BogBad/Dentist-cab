import NextAuth, { DefaultSession, User as DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Gender } from './patient';

declare module 'next-auth' {
  interface Session {
    user: {
      image?: string | null;
      id?: string;
      surname: string;
      birthDate: Date;
      position: string;
      role: string;
      gender: Gender;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    surname: string;
    birthDate: Date;
    position: string;
    role: string;
    gender: Gender;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    image?: string | null;
    id?: string;
    surname: string;
    birthDate: Date;
    position: string;
    role: string;
    gender: Gender;
  }
}
