import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExternalVisitorPass,
  CreateExternalVisitorPassRequest,
  CreateExternalVisitorPassResponse,
} from "../../services/visitor.service";

export const useCreateVisitor = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateExternalVisitorPassResponse,
    unknown,
    CreateExternalVisitorPassRequest
  >({
    mutationFn: (payload) => createExternalVisitorPass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
};
