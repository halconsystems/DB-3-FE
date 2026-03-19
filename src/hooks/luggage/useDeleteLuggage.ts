import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteLuggage,
  DeleteLuggageResponse,
} from "../../services/luggage.service";

export const useDeleteLuggage = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteLuggageResponse, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteLuggage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["luggage"] });
    },
  });
};
