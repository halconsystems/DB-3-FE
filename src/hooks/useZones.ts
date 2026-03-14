import { useQuery } from "@tanstack/react-query";
import { getAllZones } from "../services/zone.service";

export const useZones = () => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getAllZones,
    staleTime: 5 * 60 * 1000, 
  });
};
