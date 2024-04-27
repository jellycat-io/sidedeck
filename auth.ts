import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { getUserByEmail, getUserById } from '@/data/user';
import { LoginSchema } from '@/schemas/auth';

import { getAccountByUserId } from './data/account';
import { db } from './lib/db';
import { Routes } from './routes';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: Routes.auth.login,
    error: Routes.auth.error,
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validated = LoginSchema.safeParse(credentials);

        if (validated.success) {
          const { email, password } = validated.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
    Google,
  ],
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.id) return false;

      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      // Prevent sign in  if email is not verified
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      const account = getAccountByUserId(user.id);

      token.isOAuth = !!account;
      token.name = user.name;
      token.email = user.email;

      return token;
    },
  },
});
