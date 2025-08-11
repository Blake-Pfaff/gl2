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
    async jwt({ token, user, trigger }) {
      // Persist the user ID in the token when the user signs in
      if (user) {
        token.id = user.id;
        // Ensure email is available on the token for middleware logic
        // NextAuth typically includes it, but we set it defensively
        (token as any).email = (user as any).email;

        // Track first login when user signs in
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { firstLoginAt: true, isOnboarded: true },
          });

          // If this is their first login, update firstLoginAt
          if (dbUser && !dbUser.firstLoginAt) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                firstLoginAt: new Date(),
                lastOnlineAt: new Date(),
              },
            });

            // Add flag to token to indicate this is a first login
            token.isFirstLogin = true;
          } else {
            // Update last online time for returning users
            await prisma.user.update({
              where: { id: user.id },
              data: { lastOnlineAt: new Date() },
            });

            token.isFirstLogin = false;
          }

          // Pass onboarding status to token
          token.isOnboarded = dbUser?.isOnboarded || false;
        } catch (error) {
          console.error("Error tracking first login:", error);
          // Don't fail auth if tracking fails
          token.isFirstLogin = false;
          token.isOnboarded = false;
        }
      }

      // If session is being updated (e.g., when user completes onboarding)
      // refresh the user data from the database
      if (trigger === "update" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { isOnboarded: true },
          });

          if (dbUser) {
            token.isOnboarded = dbUser.isOnboarded;
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }

      // Force special test account to always require onboarding
      const tokenEmail: string | undefined = (token as any).email;
      if (tokenEmail === "test@test.com") {
        token.isOnboarded = false;
      }

      // Debug logging
      console.log(`🔍 JWT TOKEN DEBUG for ${tokenEmail}:`, {
        id: token.id,
        email: tokenEmail,
        isOnboarded: token.isOnboarded,
        isFirstLogin: token.isFirstLogin,
      });

      return token;
    },
    async session({ session, token }) {
      // Send user info to the client
      if (token.id) {
        session.user.id = token.id as string;
        session.user.isFirstLogin = token.isFirstLogin as boolean;
        session.user.isOnboarded = token.isOnboarded as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: { signIn: "/login" },
};
