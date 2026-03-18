import { useQuery } from "@tanstack/react-query";
import { getCpAgentById } from "../../services/cp-agent.service";

export const useCpAgentById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["cp-agent", id],
    queryFn: () => {
      if (!id) throw new Error("CP Agent id is required");
      return getCpAgentById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
