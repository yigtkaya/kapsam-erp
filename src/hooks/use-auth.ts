import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse } from "@/types/auth";
import {
  checkSession,
  login as loginApi,
  logout as logoutApi,
} from "@/api/auth";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/core";

// Valid user roles as defined in our system
const VALID_ROLES: UserRole[] = ["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"];

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

export function useAuth() {
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
      login: async () => {
        throw new Error("Auth not initialized");
      },
      logout: async () => {
        throw new Error("Auth not initialized");
      },
    };
  }

  const router = useRouter();

  // Query for checking session and user data
  const {
    data: session,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("useAuth: Fetching session data...");

      try {
        const sessionData = await checkSession();
        console.log("useAuth: Raw session data received:", sessionData);

        // Process and normalize the user role if present
        if (sessionData.user && sessionData.user.role) {
          console.log(
            "Auth - User role from server:",
            sessionData.user.role,
            typeof sessionData.user.role
          );
          sessionData.user.role = normalizeUserRole(sessionData.user.role);
          console.log("Auth - Normalized user role:", sessionData.user.role);
        } else {
          console.log("Auth - No user role received from server");
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

  // Refetch session on mount
  useEffect(() => {
    // Refetch session data when the component mounts
    refetch();
  }, [refetch]);

  // Login mutation
  const { mutateAsync: login } = useMutation({
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
          user: data.user,
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
  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
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
    onError: (error) => {
      console.error("Logout error:", error);

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
        await login({ username, password });
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
    login: handleLogin,
    logout: handleLogout,
  };
}
