import { useQuery } from "@tanstack/react-query";
import { getAllExternalVehicles } from "../../services/vehicle.service";

export const useVehicles = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["vehicles", pageNumber, pageSize],
    queryFn: () => getAllExternalVehicles({ pageNumber, pageSize }),
    staleTime: 5 * 60 * 1000,
  });
};
