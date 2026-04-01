import { useQuery } from "@tanstack/react-query";
import { getAllFeeScale } from "../../services/fees.service";
import type { GetAllFeeScaleResponse } from "../../types/fees.types";

export function useFeeScales() {
  return useQuery<GetAllFeeScaleResponse>({
    queryKey: ["feeScales"],
    queryFn: getAllFeeScale,
  });
}
