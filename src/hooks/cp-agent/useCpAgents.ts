import { useQuery } from "@tanstack/react-query";
import { getAllCpAgent, CpAgent } from "../../services/cp-agent.service";

export const useCpAgents = () => {
  return useQuery<CpAgent[]>({
    queryKey: ["cp-agents"],
    queryFn: getAllCpAgent,
  });
};
