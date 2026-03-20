import { useQuery } from "@tanstack/react-query";
import { getAllLuggage } from "../../services/luggage.service";

export const useLuggage = () => {
  return useQuery({
    queryKey: ["luggage"],
    queryFn: getAllLuggage,
    staleTime: 5 * 60 * 1000,
  });
};
