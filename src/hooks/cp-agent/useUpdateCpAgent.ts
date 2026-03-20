import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCpAgent,
  UpdateCpAgentDto,
  UpdateCpAgentResponse,
} from "../../services/cp-agent.service";

export const useUpdateCpAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCpAgentResponse, unknown, UpdateCpAgentDto>({
    mutationFn: (payload) => updateCpAgent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cp-agents"] });
    },
  });
};
