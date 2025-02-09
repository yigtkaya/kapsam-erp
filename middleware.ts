import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = ["/login", "/forgot-password", "/register", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname === "/"
  );

  // Get authentication tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const csrfToken = request.cookies.get("csrftoken")?.value;

  try {
    // For public routes
    if (isPublicPath) {
      // If user has tokens, redirect to dashboard
      if (accessToken && refreshToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // For protected routes
    if (!accessToken && !refreshToken) {
      // Store the original path to redirect back after login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Clone the request headers and add authorization
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);

    // Add CSRF token if available and if the request method requires it
    if (
      csrfToken &&
      !["GET", "HEAD", "OPTIONS", "TRACE"].includes(request.method)
    ) {
      requestHeaders.set("X-CSRFToken", csrfToken);
    }

    // Create a new response with modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Redirect to login on error
    return NextResponse.redirect(new URL("/login", request.url));
  }
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
