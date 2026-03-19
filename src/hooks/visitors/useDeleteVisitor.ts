import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteExternalVisitorPass,
  DeleteExternalVisitorPassResponse,
} from "../../services/visitor.service";

export const useDeleteVisitor = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteExternalVisitorPassResponse, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteExternalVisitorPass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
};
