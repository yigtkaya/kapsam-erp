import {
  createUser,
  deleteUser,
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
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => updateUser(user.id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => updateUserRole(user.id, user.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: (user) => deleteUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
