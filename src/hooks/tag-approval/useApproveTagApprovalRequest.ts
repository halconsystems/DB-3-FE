import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveTagApprovalRequest, ApproveTagApprovalRequestPayload } from "../../services/approval.service";

export const useApproveTagApprovalRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApproveTagApprovalRequestPayload) => approveTagApprovalRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-approval-requests"] });
    },
  });
};
