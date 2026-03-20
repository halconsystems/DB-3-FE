import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLuggage,
  UpdateLuggageRequest,
  UpdateLuggageResponse,
} from "../../services/luggage.service";

export const useUpdateLuggage = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateLuggageResponse, unknown, UpdateLuggageRequest>({
    mutationFn: (payload) => updateLuggage(payload),
    onSuccess: (response) => {
      const luggageId = response.data?.id;
      queryClient.invalidateQueries({ queryKey: ["luggage"] });
      if (luggageId) {
        queryClient.invalidateQueries({ queryKey: ["luggage", luggageId] });
      }
    },
  });
};
