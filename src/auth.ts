import NextAuth, { User } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { hashPassword } from './utils/hashPassword';
import { Gender } from './types/patient';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    error: '/error',
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error('Invalid credentials');
        }

        let user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: email as string,
              password: hashPassword(password as string),
            },
          });
        } else {
          const hashedPassword = hashPassword(password as string);
          const isValidPassword = hashedPassword === user.password;

          if (!isValidPassword) {
            throw new Error('Invalid credentials.');
          }
        }

        return user as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.surname = user.surname;
        token.birthDate = user.birthDate;
        token.position = user.position;
        token.gender = user.gender;
        token.image = user.image;
      }

      if (trigger === 'update') {
        token.name = session.user.name;
        token.surname = session.user.surname;
        token.birthDate = session.user.birthDate;
        token.image = session.user.image;
        token.gender = session.user.gender;
        token.role = session.user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
        session.user.surname = token.surname as string;
        session.user.birthDate = token.birthDate as Date;
        session.user.position = token.position as string;
        session.user.gender = token.gender as Gender;
      }
      return session;
    },
  },
});
