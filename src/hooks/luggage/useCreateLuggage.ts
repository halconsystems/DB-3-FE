import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLuggage,
  CreateLuggageRequest,
  CreateLuggageResponse,
} from "../../services/luggage.service";

export const useCreateLuggage = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateLuggageResponse, unknown, CreateLuggageRequest>({
    mutationFn: (payload) => createLuggage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["luggage"] });
    },
  });
};
