import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateZone, UpdateZoneRequest, UpdateZoneResponse } from "../services/zone.service";

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateZoneResponse, any, UpdateZoneRequest>({
    mutationFn: async (data) => updateZone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};
