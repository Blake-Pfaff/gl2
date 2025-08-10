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
        
        // Track first login when user signs in
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { firstLoginAt: true, isOnboarded: true }
          });
          
          // If this is their first login, update firstLoginAt
          if (dbUser && !dbUser.firstLoginAt) {
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                firstLoginAt: new Date(),
                lastOnlineAt: new Date()
              }
            });
            
            // Add flag to token to indicate this is a first login
            token.isFirstLogin = true;
          } else {
            // Update last online time for returning users
            await prisma.user.update({
              where: { id: user.id },
              data: { lastOnlineAt: new Date() }
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

