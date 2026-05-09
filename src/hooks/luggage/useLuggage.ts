import { useQuery } from "@tanstack/react-query";
import { getAllLuggage } from "../../services/luggage.service";

export const useLuggage = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["luggage", pageNumber, pageSize],
    queryFn: () => getAllLuggage({ pageNumber, pageSize }),
    staleTime: 5 * 60 * 1000,
  });
};
