import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteZone } from '../services/zone.service';

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      return deleteZone(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
