import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "../../services/employee.service";

export const useEmployeeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => {
      if (!id) throw new Error("Employee id is required");
      return getEmployeeById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
