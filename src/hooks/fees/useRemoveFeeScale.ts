import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFeeScale } from "../../services/fees.service";
import type { RemoveFeeScaleResponse } from "../../types/fees.types";

export function useRemoveFeeScale() {
  const queryClient = useQueryClient();

  return useMutation<RemoveFeeScaleResponse, Error, { id: string }>({
    mutationFn: ({ id }) => removeFeeScale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeScales"] });
    },
  });
}
