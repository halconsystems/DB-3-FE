import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createZone,
  CreateZoneRequest,
  CreateZoneResponse,
} from "../../services/zone.service";

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateZoneResponse, any, CreateZoneRequest>({
    mutationFn: async (data) => createZone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};
