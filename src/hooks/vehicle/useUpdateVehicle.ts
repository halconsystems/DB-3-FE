import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateExternalVehicle,
  UpdateExternalVehicleRequest,
  UpdateExternalVehicleResponse,
} from "../../services/vehicle.service";

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateExternalVehicleResponse, unknown, UpdateExternalVehicleRequest>({
    mutationFn: (payload) => updateExternalVehicle(payload),
    onSuccess: (response) => {
      const vehicleId = response.data?.id;
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      if (vehicleId) {
        queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      }
    },
  });
};
