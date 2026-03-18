import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateEmployee,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
} from "../../services/employee.service";

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateEmployeeResponse, unknown, UpdateEmployeeRequest>({
    mutationFn: (payload) => updateEmployee(payload),
    onSuccess: (response) => {
      const employeeId = response.data?.id;
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "employees",
      });
      if (employeeId) {
        queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      }
    },
  });
};
