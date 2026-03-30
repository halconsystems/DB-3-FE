import { useQuery } from "@tanstack/react-query";
import { getTagApprovalRequestById, GetTagApprovalRequestByIdResponse } from "../../services/approval.service";
export const useGetTagApprovalRequestById = (id: string, enabled: boolean = true) => {
  return useQuery<GetTagApprovalRequestByIdResponse, Error>({
    queryKey: ["tag-approval-request", id],
    queryFn: () => getTagApprovalRequestById(id),
    enabled: !!id && enabled,
  });
};
