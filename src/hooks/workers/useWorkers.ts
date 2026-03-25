import { useQuery } from "@tanstack/react-query";
import { getAllExternalWorkers } from "../../services/worker.service";

export const useWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: getAllExternalWorkers,
    staleTime: 5 * 60 * 1000,
  });
};
