"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/"];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (!isLoading) {
      if (!isPublicRoute && !isAuthenticated) {
        const currentPath = pathname;
        router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Redirect authenticated users away from public routes
      if (isAuthenticated && isPublicRoute) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router, pathname]);

  // For public routes, show content regardless of auth state
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Only render children if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}
