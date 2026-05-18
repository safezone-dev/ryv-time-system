import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(
        credentials: any
      ) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const user =
          await prisma.user.findUnique(
            {
              where: {
                email:
                  credentials.email.toLowerCase(),
              },
            }
          );

        if (!user) {
          return null;
        }

        const validPassword =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: any) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({
      session,
      token,
    }: any) {
      if (session.user) {
        session.user.id = token.sub;

        session.user.role =
          token.role;
      }

      return session;
    },
  },

  secret:
    process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(
  authOptions
);

export { handler as GET, handler as POST };