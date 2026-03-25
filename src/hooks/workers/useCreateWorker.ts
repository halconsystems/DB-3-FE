import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExternalWorker,
  CreateExternalWorkerRequest,
  CreateExternalWorkerResponse,
} from "../../services/worker.service";

export const useCreateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateExternalWorkerResponse, unknown, CreateExternalWorkerRequest>({
    mutationFn: (payload) => createExternalWorker(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
};
