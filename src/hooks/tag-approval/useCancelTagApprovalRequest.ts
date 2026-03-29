import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelTagApprovalRequest } from "../../services/approval.service";

export function useCancelTagApprovalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelTagApprovalRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-approval-requests"] });
    },
  });
}
