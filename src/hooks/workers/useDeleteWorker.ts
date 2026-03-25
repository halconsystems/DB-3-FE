import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteExternalWorker,
  DeleteExternalWorkerResponse,
} from "../../services/worker.service";

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteExternalWorkerResponse, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteExternalWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
};
