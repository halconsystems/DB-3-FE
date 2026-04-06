import { useQuery } from "@tanstack/react-query";
import { getAllRequestedTags } from "../../services/approval.service";

export function useGetAllRequestedTags(pageNumber?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["getAllRequestedTags", pageNumber, pageSize],
    queryFn: () => getAllRequestedTags(pageNumber, pageSize),
    staleTime: 1000 * 60, // 1 minute, adjust as needed
  });
}
