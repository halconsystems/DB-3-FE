import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePhase, RemovePhaseResponse } from "../../services/phase.service";

export function useRemovePhase() {
  const queryClient = useQueryClient();
  return useMutation<
    RemovePhaseResponse,
    Error,
    { id: string; token: string }
  >({
    mutationFn: async ({ id, token }) => removePhase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phases"] });
    },
  });
}
