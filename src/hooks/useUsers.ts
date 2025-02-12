import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserRole,
} from "@/app/admin/users/actions";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnMount: false, // Disable refetch on mount if we have cached data
  });
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!id, // Only run query if id exists
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (updateData) => updateUser(updateData.id, updateData),
    onSuccess: (data, variables) => {
      // Update both the list and the individual user cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["users", variables.id], data);
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => updateUserRole(user.id, user.role),
    onSuccess: (data) => {
      // Update both the list and the individual user cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["users", data.id], data);
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => createUser(user),
    onSuccess: (newUser) => {
      // Update the users list cache
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Optionally add the new user to the existing cache
      const existingUsers = queryClient.getQueryData<User[]>(["users"]);
      if (existingUsers) {
        queryClient.setQueryData(["users"], [...existingUsers, newUser]);
      }
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => deleteUser(user.id),
    onSuccess: (_, deletedUser) => {
      // Invalidate and force a refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.refetchQueries({ queryKey: ["users"] });
      // Remove the individual user cache
      queryClient.removeQueries({ queryKey: ["users", deletedUser.id] });
    },
  });
}
