import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Intercept requests whose path starts with "/api"
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Remove the "/api" prefix and build the backend URL
    const rewrittenPath = request.nextUrl.pathname.replace(/^\/api/, "");
    const backendUrl = new URL(rewrittenPath, "http://68.183.213.111");
    backendUrl.search = request.nextUrl.search;

    // Create a new Headers instance from the original headers
    const requestHeaders = new Headers(request.headers);

    // If no "authorization" header exists, try to get the JWT from cookies
    if (!requestHeaders.has("authorization")) {
      const jwtToken = request.cookies.get("jwt")?.value;
      if (jwtToken) {
        requestHeaders.set("authorization", `Bearer ${jwtToken}`);
      }
    }

    // Rewrite the request to forward it to the backend with the proper headers
    return NextResponse.rewrite(backendUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For all other routes, continue without modification
  return NextResponse.next();
}

export const config = {
  // This matcher ensures that only API routes are intercepted
  matcher: "/api/:path*",
};
