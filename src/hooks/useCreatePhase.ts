import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPhase, CreatePhaseRequest, CreatePhaseResponse } from '../services/phase.service';

export function useCreatePhase() {
  const queryClient = useQueryClient();
  return useMutation<
    CreatePhaseResponse,
    Error,
    { data: CreatePhaseRequest; token: string }
  >({
    mutationFn: async ({ data, token }) => createPhase(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}
