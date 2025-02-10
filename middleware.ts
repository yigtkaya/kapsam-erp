import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = ["/login", "/forgot-password", "/register", "/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname === "/"
  );

  // For public routes, proceed without checks
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionId = request.cookies.get("sessionid");
  const csrfToken = request.cookies.get("csrftoken");

  // If no session, redirect to login
  if (!sessionId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);

    // Clear any existing cookies when redirecting to login
    response.cookies.delete("sessionid");
    response.cookies.delete("csrftoken");

    return response;
  }

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add CSRF token to all non-GET requests if available
  if (
    csrfToken &&
    !["GET", "HEAD", "OPTIONS", "TRACE"].includes(request.method)
  ) {
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("X-CSRFToken", csrfToken.value);
    requestHeaders.set("sessionid", sessionId.value);
    requestHeaders.set(
      "Cookie",
      `${sessionId.name}=${sessionId.value}; ${csrfToken.name}=${csrfToken.value}`
    );
  }

  // Create a new response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - API routes that don't need auth
     * - Static files
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|public|assets/|api/public/).*)",
  ],
};
