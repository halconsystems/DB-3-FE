import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCpAgent, CreateCpAgentDto } from "services/cp-agent.service";

export const useCreateCpAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCpAgentDto) => createCpAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cp-agents"] });
    },
  });
};
