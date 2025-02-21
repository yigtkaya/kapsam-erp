"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/"];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) return;

    // Redirect unauthenticated users from private routes
    if (!isPublicRoute && !isAuthenticated) {
      router.push(`/login`);
    }

    // Redirect authenticated users from public routes
    if (isAuthenticated && isPublicRoute) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  if ((isLoading || !isAuthenticated) && !isPublicRoute) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}
