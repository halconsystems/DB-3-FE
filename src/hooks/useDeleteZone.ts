import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteZone } from '../services/zone.service';

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return deleteZone(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
