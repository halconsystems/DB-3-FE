import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "../../services/tag.service";
import { CreateTagRequest, CreateTagResponse } from "../../services/tag.service";
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateTagResponse, Error, CreateTagRequest>({
    mutationFn: (tag: CreateTagRequest) => createTag(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
