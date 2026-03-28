import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTagType } from "../../services/tagtype.service";

export const useRemoveTagType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeTagType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagtypes"] });
    },
  });
};
