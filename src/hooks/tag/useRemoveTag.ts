import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTag } from "../../services/tag.service";

export const useRemoveTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
