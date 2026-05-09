import { useQuery } from "@tanstack/react-query";
import { getTagApprovalRequests } from "../../services/approval.service";
import type { PagedList } from "../../lib/unwrapApiList";
import type { TagApprovalRequest } from "../../types/tag-approval.types";

export const useGetTagApprovalRequests = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery<PagedList<TagApprovalRequest>, Error>({
    queryKey: ["tag-approval-requests", pageNumber, pageSize],
    queryFn: () => getTagApprovalRequests({ pageNumber, pageSize }),
  });
};
