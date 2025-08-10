// lib/auth.ts

import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user?.hashedPassword) return null;
        const valid = await bcrypt.compare(creds.password, user.hashedPassword);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name! };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user ID in the token when the user signs in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send the user ID to the client
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: { signIn: "/login" },
};

