import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeeScale, UpdateFeeScalePayload } from "../../services/fees.service";
import type { RemoveFeeScaleResponse } from "../../types/fees.types";

export function useUpdateFeeScale() {
  const queryClient = useQueryClient();

  return useMutation<RemoveFeeScaleResponse, Error, UpdateFeeScalePayload>({
    mutationFn: (payload) => updateFeeScale(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeScales"] });
    },
  });
}
