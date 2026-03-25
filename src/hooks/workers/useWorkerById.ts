import { useQuery } from "@tanstack/react-query";
import { getExternalWorkerById } from "../../services/worker.service";

export const useWorkerById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["worker", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Worker id is required");
      }
      return getExternalWorkerById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
