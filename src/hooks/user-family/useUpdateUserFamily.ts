import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserFamily, UpdateUserFamilyRequest } from "../../services/user-family.service";

export const useUpdateUserFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserFamilyRequest) => updateUserFamily(data),
    onSuccess: () => {
      // Invalidate and refetch the user family list after update
      queryClient.invalidateQueries({ queryKey: ["userFamilyList"] });
    },
  });
};
