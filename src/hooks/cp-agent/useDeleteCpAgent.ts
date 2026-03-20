import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCpAgent,
  DeleteCpAgentResponse,
} from "../../services/cp-agent.service";

export const useDeleteCpAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCpAgentResponse, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteCpAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cp-agents"] });
    },
  });
};
