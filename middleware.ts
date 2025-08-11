// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Redirect onboarding flows based on token flags and special user rule
    const pathname = req.nextUrl.pathname;
    // Always allow auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return;
    }
    const isOnboardingRoute = pathname.startsWith("/onboarding");
    const token = req.nextauth?.token as
      | (import("next-auth/jwt").JWT & {
          email?: string;
          isOnboarded?: boolean;
        })
      | null;

    // If no token, let withAuth handle redirect to /login
    if (!token) {
      return;
    }

    const forceOnboarding = token?.email === "test@test.com";
    const needsOnboarding = forceOnboarding || token?.isOnboarded === false;

    // If user needs onboarding, always keep them on onboarding pages
    if (needsOnboarding && !isOnboardingRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding-one";
      return Response.redirect(url);
    }

    // If user is already onboarded (and not the forced account), prevent visiting onboarding
    if (!needsOnboarding && isOnboardingRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/users";
      return Response.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // authenticated users only
    },
    pages: {
      signIn: "/login",
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
