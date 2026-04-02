import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeeScale, CreateFeeScalePayload } from "../../services/fees.service";
import type { RemoveFeeScaleResponse } from "../../types/fees.types";

export function useCreateFeeScale() {
  const queryClient = useQueryClient();

  return useMutation<RemoveFeeScaleResponse, Error, CreateFeeScalePayload>({
    mutationFn: (payload) => createFeeScale(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeScales"] });
    },
  });
}
