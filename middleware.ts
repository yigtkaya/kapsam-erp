import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/forgot-password", "/register", "/auth"];

// API paths to exclude from middleware
const API_EXCLUDE_PATHS = ["/api/public"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for excluded API paths
  if (API_EXCLUDE_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if this is an API request
  const isApiRequest = pathname.startsWith("/api");

  // Check if the current path is public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  // Get cookies
  const sessionId = request.cookies.get("sessionid");
  const csrfToken = request.cookies.get("csrftoken");

  // Debug cookies if in development
  if (process.env.NODE_ENV === "development") {
    console.log("Middleware - Path:", pathname);
    console.log("Middleware - Cookies:", {
      sessionId: sessionId?.value,
      csrfToken: csrfToken?.value,
      allCookies: [...request.cookies.getAll()].map((c) => c.name),
    });
  }

  // For public routes, if user is already authenticated, redirect to dashboard
  if (isPublicPath && !isApiRequest) {
    if (sessionId?.value) {
      console.log("Middleware - Redirecting authenticated user to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // For protected routes or API requests, check authentication
  if (!sessionId?.value) {
    // For API requests, return 401 unauthorized
    if (isApiRequest) {
      console.log("Middleware - Unauthorized API request");
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // For page requests, redirect to login
    console.log("Middleware - Redirecting unauthenticated user to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);

    // Clear any existing cookies when redirecting to login
    response.cookies.delete("sessionid");
    response.cookies.delete("csrftoken");

    return response;
  }

  // Clone the request headers for both API and page requests
  const requestHeaders = new Headers(request.headers);

  // Enhanced authentication header handling
  if (sessionId && csrfToken) {
    requestHeaders.set("Content-Type", "application/json");

    // Add CSRF token to all non-GET requests
    if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(request.method)) {
      requestHeaders.set("X-CSRFToken", csrfToken.value);
    }

    // Ensure we're properly setting the Cookie header
    // Important: Some backends expect cookies in a specific format
    let cookieHeader = `sessionid=${sessionId.value}`;
    if (csrfToken?.value) {
      cookieHeader += `; csrftoken=${csrfToken.value}`;
    }

    // Set the Cookie header with proper formatting
    requestHeaders.set("Cookie", cookieHeader);

    // Additionally set Authorization header if needed by your backend
    // Uncomment if your backend expects this format
    // requestHeaders.set("Authorization", `Bearer ${sessionId.value}`);

    if (process.env.NODE_ENV === "development") {
      console.log("Middleware - Added auth headers:", {
        method: request.method,
        path: pathname,
        hasCsrf: !!requestHeaders.get("X-CSRFToken"),
        hasCookie: !!requestHeaders.get("Cookie"),
        cookieValue: requestHeaders.get("Cookie")?.substring(0, 20) + "...",
      });
    }
  }

  // For API requests in development mode, log more details
  if (isApiRequest && process.env.NODE_ENV === "development") {
    console.log("Middleware - API Request:", {
      method: request.method,
      path: pathname,
      headers: Object.fromEntries([...requestHeaders.entries()]),
    });
  }

  // Return the modified request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all paths except static files and assets
    "/((?!_next/static|_next/image|favicon.ico|public|assets/).*)",
  ],
};
