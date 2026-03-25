import { useQuery } from "@tanstack/react-query";
import { getAllExternalVehicles } from "../../services/vehicle.service";

export const useVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllExternalVehicles,
    staleTime: 5 * 60 * 1000,
  });
};
