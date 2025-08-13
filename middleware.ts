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

    console.log(`🔍 Token exists: ${!!token}, pathname: ${pathname}`);

    // If no token, this should not happen because withAuth should handle it
    // But let's add explicit handling just in case
    if (!token) {
      console.log(`❌ No token for ${pathname}, redirecting to login`);
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return Response.redirect(url);
    }

    const needsOnboarding = token?.isOnboarded === false;

    // Debug logging
    console.log(`🔍 MIDDLEWARE DEBUG for ${pathname}:`, {
      email: token?.email,
      isOnboarded: token?.isOnboarded,
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
        const pathname = req.nextUrl.pathname;
        console.log(`🔐 AUTHORIZED CHECK for ${pathname}:`, {
          hasToken: !!token,
          willAllow: !!token,
        });

        // Allow auth pages even without token
        if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
          console.log(
            `✅ Allowing auth page in authorized callback: ${pathname}`
          );
          return true;
        }

        // For all other pages, require authentication
        if (!token) {
          console.log(
            `❌ No token in authorized callback for ${pathname}, will redirect to login`
          );
          return false;
        }

        return true;
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
