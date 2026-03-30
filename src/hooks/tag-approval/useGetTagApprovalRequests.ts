import { useQuery } from "@tanstack/react-query";
import { getTagApprovalRequests } from "../../services/approval.service";
import { GetTagApprovalRequestsResponse } from "../../types/tag-approval.types";
export const useGetTagApprovalRequests = () => {
  return useQuery<GetTagApprovalRequestsResponse, Error>({
    queryKey: ["tag-approval-requests"],
    queryFn: getTagApprovalRequests,
  });
};
