import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse, User } from "@/types/auth";
import {
  checkSession,
  login as loginApi,
  logout as logoutApi,
} from "@/api/auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/types/core";
import { toast } from "sonner";

// Valid user roles as defined in our system
const VALID_ROLES: UserRole[] = ["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"];

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 100,
  ENGINEER: 75,
  OPERATOR: 50,
  VIEWER: 25,
};

// Role-specific permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    "manage_users",
    "manage_system",
    "view_all",
    "edit_all",
    "delete_all",
  ],
  ENGINEER: ["view_all", "edit_all", "manage_production"],
  OPERATOR: ["view_assigned", "edit_assigned"],
  VIEWER: ["view_assigned"],
};

// Helper function to normalize and validate user roles
const normalizeUserRole = (role?: string): UserRole => {
  if (!role) return "VIEWER"; // Default fallback role

  // Convert to uppercase for case-insensitive comparison
  const normalizedRole = role.toUpperCase();

  // Check if the role is valid
  const matchedRole = VALID_ROLES.find(
    (r) => r.toUpperCase() === normalizedRole
  );

  if (matchedRole) {
    return matchedRole; // Return the properly cased role from our enum
  }

  // Special case handling for common role names
  if (normalizedRole === "ADMINISTRATOR" || normalizedRole === "SUPERUSER") {
    return "ADMIN";
  }

  // If no match, default to VIEWER
  console.warn(`Auth - Unrecognized role: ${role}, defaulting to VIEWER`);
  return "VIEWER";
};

interface UseAuthProps {
  redirectTo?: string;
  requiredRole?: UserRole;
}

export function useAuth(props?: UseAuthProps) {
  const { redirectTo, requiredRole } = props || {};
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get QueryClient
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch (error) {
    console.error(
      "QueryClient not found. Make sure this component is wrapped in a QueryClientProvider",
      error
    );
    // Return default values when QueryClient is not available
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isRedirecting: false,
      hasPermission: () => false,
      hasRole: () => false,
      login: async () => {
        throw new Error("Auth not initialized");
      },
      logout: async () => {
        throw new Error("Auth not initialized");
      },
    };
  }

  const router = useRouter();
  const pathname = usePathname();

  // Query for checking session and user data
  const {
    data: session,
    isLoading,
    refetch,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const sessionData = await checkSession();

        // Process and normalize the user role if present
        if (sessionData.user && sessionData.user.role) {
          sessionData.user.role = normalizeUserRole(sessionData.user.role);
        }

        return sessionData;
      } catch (error) {
        console.error("useAuth: Error fetching session:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Consider the data fresh for 5 minutes
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Role-based access control helpers
  const hasRole = useCallback(
    (requiredRole: UserRole): boolean => {
      if (!session?.user?.role) return false;

      const userRoleLevel = ROLE_HIERARCHY[session.user.role as UserRole];
      const requiredRoleLevel = ROLE_HIERARCHY[requiredRole];

      return userRoleLevel >= requiredRoleLevel;
    },
    [session]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!session?.user?.role) return false;

      const userRole = session.user.role as UserRole;
      return ROLE_PERMISSIONS[userRole].includes(permission);
    },
    [session]
  );

  // Handle redirection for unauthenticated users or insufficient permissions
  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Skip if already redirecting, loading, or no redirection needed
      if (isRedirecting || isLoading || !redirectTo) return;

      const isAuth = session?.isAuthenticated ?? false;

      // Check authentication
      if (!isAuth) {
        setIsRedirecting(true);
        toast.error("Login required to access this page");
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role-based access
      if (requiredRole && !hasRole(requiredRole)) {
        setIsRedirecting(true);
        toast.error("You don't have permission to access this page");
        router.push(redirectTo);
        return;
      }
    };

    handleAuthRedirect();
  }, [
    session,
    isLoading,
    redirectTo,
    requiredRole,
    hasRole,
    router,
    pathname,
    isRedirecting,
  ]);

  // Refetch session on mount
  useEffect(() => {
    // Refetch session data when the component mounts
    refetch();
  }, [refetch]);

  // Login mutation
  const { mutateAsync: login, isPending: isLoginPending } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await loginApi(username, password);
      return response;
    },
    onSuccess: async (data: AuthResponse) => {
      if (data.success && data.user) {
        // Set the query data
        queryClient.setQueryData(["session"], {
          isAuthenticated: true,
          user: {
            ...data.user,
            role: normalizeUserRole(data.user.role),
          },
        });

        // Invalidate the session query to force a refetch
        queryClient.invalidateQueries({ queryKey: ["session"] });

        // Add a small delay to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Force a router refresh to update server state
        router.refresh();
      } else {
        throw new Error(data.message || "Login failed");
      }
    },
  });

  // Logout mutation
  const { mutateAsync: logout, isPending: isLogoutPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: (data) => {
      // Display success message if provided
      if (data.message) {
        toast.success(data.message);
      }

      // Clear the session data in the cache
      queryClient.setQueryData(["session"], {
        isAuthenticated: false,
        user: null,
      });

      // Invalidate all queries to force refetching
      queryClient.invalidateQueries();

      // Clear all query cache for a clean slate
      queryClient.clear();

      // Force a router refresh
      router.refresh();

      // Redirect to login page
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");

      // Even if there's an error, still clear the session state
      queryClient.setQueryData(["session"], {
        isAuthenticated: false,
        user: null,
      });

      // Clear the cache
      queryClient.clear();

      // Redirect to login
      router.push("/login");
    },
  });

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      try {
        return await login({ username, password });
      } catch (error) {
        throw error;
      }
    },
    [login]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      throw error;
    }
  }, [logout]);

  return {
    user: session?.user ?? null,
    isAuthenticated: session?.isAuthenticated ?? false,
    isLoading,
    isLoginPending,
    isLogoutPending,
    isRedirecting,
    error: sessionError,
    login: handleLogin,
    logout: handleLogout,
    hasRole,
    hasPermission,
    refetchSession: refetch,
  };
}
