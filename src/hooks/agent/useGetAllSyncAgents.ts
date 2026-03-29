import { useQuery } from "@tanstack/react-query";
import { getAllSyncAgents } from "../../services/agent.service";

export const useGetAllSyncAgents = () => {
  return useQuery({
    queryKey: ["sync-agents-all"],
    queryFn: getAllSyncAgents,
  });
};
