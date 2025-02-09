import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = ["/login", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect authenticated users from public paths to home
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // For API routes
  if (pathname.startsWith("/api")) {
    // Remove the "/api" prefix and build the backend URL
    const rewrittenPath = pathname.replace(/^\/api/, "");
    const backendUrl = new URL(
      rewrittenPath,
      process.env.NEXT_PUBLIC_API_BASE_URL
    );
    backendUrl.search = request.nextUrl.search;

    // Create a new Headers instance from the original headers
    const requestHeaders = new Headers(request.headers);

    // If no "authorization" header exists, try to get the access token from cookies
    if (!requestHeaders.has("authorization")) {
      const accessToken = request.cookies.get("access_token")?.value;
      if (accessToken) {
        requestHeaders.set("authorization", `Bearer ${accessToken}`);
      }
    }

    // Rewrite the request to forward it to the backend with the proper headers
    return NextResponse.rewrite(backendUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For non-API routes, check if user is authenticated
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // If no tokens exist and not on a public path, redirect to login
  if (!accessToken && !refreshToken && !publicPaths.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  // This matcher ensures the middleware runs on appropriate routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
