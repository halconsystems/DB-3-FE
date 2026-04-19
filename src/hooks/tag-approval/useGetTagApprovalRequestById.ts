import { useQuery } from "@tanstack/react-query";
import { getTagApprovalRequestById, GetTagApprovalRequestByIdResponse } from "../../services/approval.service";
export const useGetTagApprovalRequestById = (id: string | undefined, enabled: boolean = true) => {
  return useQuery<GetTagApprovalRequestByIdResponse, Error>({
    queryKey: ["tag-approval-request", id],
    queryFn: () => getTagApprovalRequestById(id as string),
    enabled: !!id && enabled,
  });
};
