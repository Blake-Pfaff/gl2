// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Redirect onboarding flows based on token flags and special user rule
    const pathname = req.nextUrl.pathname;

    console.log(`🔍 MIDDLEWARE RUNNING for ${pathname}`);

    // Always allow auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      console.log(`✅ Allowing auth page: ${pathname}`);
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
      console.log(`❌ No token for ${pathname}, withAuth will handle`);
      return;
    }

    const forceOnboarding = token?.email === "test@test.com";
    const needsOnboarding = forceOnboarding || token?.isOnboarded === false;

    // Debug logging
    console.log(`🔍 MIDDLEWARE DEBUG for ${pathname}:`, {
      email: token?.email,
      isOnboarded: token?.isOnboarded,
      forceOnboarding,
      needsOnboarding,
      isOnboardingRoute,
      action:
        needsOnboarding && !isOnboardingRoute
          ? "REDIRECT TO ONBOARDING"
          : "ALLOW",
    });

    // If user needs onboarding, always keep them on onboarding pages
    if (needsOnboarding && !isOnboardingRoute) {
      console.log(`🔄 REDIRECTING ${token?.email} to /onboarding`);
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return Response.redirect(url);
    }

    // If user is already onboarded (and not the forced account), prevent visiting onboarding
    if (!needsOnboarding && isOnboardingRoute) {
      console.log(`🔄 REDIRECTING onboarded user to /users`);
      const url = req.nextUrl.clone();
      url.pathname = "/users";
      return Response.redirect(url);
    }

    console.log(`✅ ALLOWING ${token?.email} to access ${pathname}`);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log(
          `🔐 AUTHORIZED CHECK for ${req.nextUrl.pathname}:`,
          !!token
        );
        return !!token; // authenticated users only
      },
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
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (auth pages)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)",
  ],
};
