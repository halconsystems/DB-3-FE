import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCpAgent, CreateCpAgentPayload } from "../../services/cp-agent.service";

export const useCreateCpAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCpAgentPayload) => createCpAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cp-agents"] });
    },
  });
};
