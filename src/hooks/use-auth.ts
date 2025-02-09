import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, AuthResponse } from "@/types/auth";
import {
  checkSession,
  login as loginApi,
  logout as logoutApi,
} from "@/lib/auth";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query for checking session and user data
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
    staleTime: 1000 * 60 * 5, // Consider the data fresh for 5 minutes
    retry: false,
  });

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
    onSuccess: (data: AuthResponse) => {
      // Invalidate and refetch session data
      queryClient.setQueryData(["session"], {
        isAuthenticated: true,
        user: data.user,
      });
      router.push("/dashboard");
    },
  });

  // Logout mutation
  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear session data
      queryClient.setQueryData(["session"], {
        isAuthenticated: false,
        user: null,
      });
      router.push("/login");
    },
    onError: () => {
      // Even if logout fails on the server, we clear the local state
      queryClient.setQueryData(["session"], {
        isAuthenticated: false,
        user: null,
      });
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
