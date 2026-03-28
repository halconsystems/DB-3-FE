import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTagType, UpdateTagTypeRequest } from "../../services/tagtype.service";

export const useUpdateTagType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTagTypeRequest) => updateTagType(payload),
    onSuccess: (response) => {
      const tagTypeId = response?.data?.id || response?.id;
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "tagtype" || query.queryKey[0] === "tagtypes",
      });
      if (tagTypeId) {
        queryClient.invalidateQueries({ queryKey: ["tagtype", tagTypeId] });
      }
    },
  });
};
