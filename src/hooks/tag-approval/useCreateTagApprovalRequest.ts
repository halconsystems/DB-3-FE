import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagApprovalRequest, CreateTagApprovalRequestPayload } from "../../services/approval.service";

export const useCreateTagApprovalRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTagApprovalRequestPayload) => createTagApprovalRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-approval-requests"] });
    },
  });
};
