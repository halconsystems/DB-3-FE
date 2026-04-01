import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeUser } from "../../services/user.service";

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-users"] });
    },
  });
};
