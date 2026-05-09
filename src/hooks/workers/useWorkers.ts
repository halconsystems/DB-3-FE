import { useQuery } from "@tanstack/react-query";
import { getAllExternalWorkers } from "../../services/worker.service";

export const useWorkers = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["workers", pageNumber, pageSize],
    queryFn: () => getAllExternalWorkers({ pageNumber, pageSize }),
    staleTime: 5 * 60 * 1000,
  });
};
