import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "../../services/employee.service";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
