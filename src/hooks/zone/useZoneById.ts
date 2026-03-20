import { useQuery } from "@tanstack/react-query";
import { getZoneById } from "../../services/zone.service";

export const useZoneById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["zone", id],
    queryFn: () => {
      if (!id) throw new Error("Zone id is required");
      return getZoneById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
