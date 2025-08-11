import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isFirstLogin: boolean;
      isOnboarded: boolean;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isFirstLogin: boolean;
    isOnboarded: boolean;
    email?: string;
  }
}
