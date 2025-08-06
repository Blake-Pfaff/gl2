// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // NextAuth will send unauth’d users here
  },
});

// Protects every path except these:
//  • /login
//  • all NextAuth API routes under /api/auth
//  • Next.js internals (_next, static files, favicon)
export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
