import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeUserFamily } from "../../services/user-family.service";

export const useRemoveUserFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeUserFamily(id),
    onSuccess: () => {
      // Invalidate and refetch the user family list after removal
      queryClient.invalidateQueries({ queryKey: ["userFamilyList"] });
    },
  });
};
