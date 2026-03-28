import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagType, CreateTagTypeRequest } from "../../services/tagtype.service";

export const useCreateTagType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTagTypeRequest) => createTagType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagtypes"] });
    },
  });
};
