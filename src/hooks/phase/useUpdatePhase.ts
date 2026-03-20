import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePhase,
  UpdatePhaseRequest,
  UpdatePhaseResponse,
} from "../../services/phase.service";

export const useUpdatePhase = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdatePhaseResponse, any, UpdatePhaseRequest>({
    mutationFn: async (data) => updatePhase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phases"] });
    },
  });
};
