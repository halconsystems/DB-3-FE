import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPhase,
  CreatePhaseRequest,
  CreatePhaseResponse,
} from "../../services/phase.service";

export function useCreatePhase() {
  const queryClient = useQueryClient();
  return useMutation<
    CreatePhaseResponse,
    Error,
    CreatePhaseRequest
  >({
    mutationFn: async (data) => createPhase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phases"] });
    },
  });
}
