import { useQuery } from "@tanstack/react-query";
import { getPhaseById, GetPhaseByIdResponse } from "../../services/phase.service";

export const usePhaseById = (id: string | undefined) => {
  return useQuery<GetPhaseByIdResponse, any>({
    queryKey: ["phase", id],
    queryFn: () => {
      if (!id) throw new Error("Phase id is required");
      return getPhaseById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
