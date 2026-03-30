import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectTagApprovalRequest } from "../../services/approval.service";
export const useRejectTagApprovalRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectTagApprovalRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-approval-requests"] });
    },
  });
};
