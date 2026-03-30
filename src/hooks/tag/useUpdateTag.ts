import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag, UpdateTagRequest } from "../../services/tag.service";
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTagRequest) => updateTag(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
