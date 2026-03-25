import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExternalVehicle,
  CreateExternalVehicleRequest,
  CreateExternalVehicleResponse,
} from "../../services/vehicle.service";

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateExternalVehicleResponse, unknown, CreateExternalVehicleRequest>({
    mutationFn: (payload) => createExternalVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
