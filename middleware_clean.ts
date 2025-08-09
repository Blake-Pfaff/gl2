// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Log which routes are being protected for debugging
    console.log("Middleware protecting:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Return true if user is authenticated
        const isAuthorized = !!token;
        console.log(
          `Authorization check for ${req.nextUrl.pathname}:`,
          isAuthorized ? "ALLOWED" : "DENIED"
        );
        return isAuthorized;
      },
    },
    pages: {
      signIn: "/login", // NextAuth will send unauth'd users here
    },
  }
);

// Protects every path except these:
//  • /login, /register
//  • all NextAuth API routes under /api/auth
//  • Next.js internals (_next, static files, favicon)
//  • public assets (svg, png, etc.)
export const config = {
  matcher: [
    // This regex excludes the specified paths and protects everything else, including /users
    "/((?!login|register|api/auth|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)",
  ],
};
