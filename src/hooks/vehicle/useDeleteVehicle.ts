import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteExternalVehicle,
  DeleteExternalVehicleResponse,
} from "../../services/vehicle.service";

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteExternalVehicleResponse, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteExternalVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
