import { useQuery } from "@tanstack/react-query";
import { getAllCpAgents } from "../services/cp-agent.service";

export const useCpAgents = () => {
  return useQuery({
    queryKey: ["cp-agents"],
    queryFn: getAllCpAgents,
  });
};
