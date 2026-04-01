import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, UpdateUserRequest } from "../../services/user.service";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UpdateUserRequest) => updateUser(user),
    onSuccess: () => {
      // Invalidate and refetch users list after update
      queryClient.invalidateQueries({ queryKey: ["external-users"] });
    },
  });
};
