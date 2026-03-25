import { useQuery } from "@tanstack/react-query";
import { getExternalVehicleById } from "../../services/vehicle.service";

export const useVehicleById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Vehicle id is required");
      }
      return getExternalVehicleById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
