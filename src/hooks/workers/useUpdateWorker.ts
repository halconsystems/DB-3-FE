import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateExternalWorker,
  UpdateExternalWorkerRequest,
  UpdateExternalWorkerResponse,
} from "../../services/worker.service";

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateExternalWorkerResponse, unknown, UpdateExternalWorkerRequest>({
    mutationFn: (payload) => updateExternalWorker(payload),
    onSuccess: (response) => {
      const workerId = response.data?.id;
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      if (workerId) {
        queryClient.invalidateQueries({ queryKey: ["worker", workerId] });
      }
    },
  });
};
