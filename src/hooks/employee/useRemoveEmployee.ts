import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  removeEmployee,
  RemoveEmployeeResponse,
} from "../../services/employee.service";

export const useRemoveEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveEmployeeResponse, unknown, { id: string }>({
    mutationFn: ({ id }: { id: string }) => removeEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "employees",
      });
    },
  });
};
