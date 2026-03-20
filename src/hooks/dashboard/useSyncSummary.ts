import { useQuery } from "@tanstack/react-query";
import { getSyncSummary } from "../../services/dashboard.service";

export const useSyncSummary = () => {
  return useQuery({
    queryKey: ["sync-summary"],
    queryFn: getSyncSummary,
  });
};
