import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateExternalVisitorPass,
  UpdateExternalVisitorPassRequest,
  UpdateExternalVisitorPassResponse,
} from "../../services/visitor.service";

export const useUpdateVisitor = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateExternalVisitorPassResponse,
    unknown,
    UpdateExternalVisitorPassRequest
  >({
    mutationFn: (payload) => updateExternalVisitorPass(payload),
    onSuccess: (response) => {
      const visitorId = response.data?.id;
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      if (visitorId) {
        queryClient.invalidateQueries({ queryKey: ["visitor", visitorId] });
      }
    },
  });
};
