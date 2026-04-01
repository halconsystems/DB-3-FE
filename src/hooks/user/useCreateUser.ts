import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, CreateUserRequest } from "../../services/user.service";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: CreateUserRequest) => createUser(user),
    onSuccess: () => {
      // Invalidate and refetch users list after creation
      queryClient.invalidateQueries({ queryKey: ["external-users"] });
    },
  });
};
