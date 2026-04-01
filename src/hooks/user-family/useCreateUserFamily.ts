import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserFamily, CreateUserFamilyRequest } from "../../services/user-family.service";

export const useCreateUserFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserFamilyRequest) => createUserFamily(data),
    onSuccess: () => {
      // Invalidate and refetch the user family list after creation
      queryClient.invalidateQueries({ queryKey: ["userFamilyList"] });
    },
  });
};
