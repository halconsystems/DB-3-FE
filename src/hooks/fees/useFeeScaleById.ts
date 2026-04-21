import { useQuery } from "@tanstack/react-query";
import { getFeeScaleById, GetFeeScaleByIdResponse } from "../../services/fees.service";

export function useFeeScaleById(id: string  | undefined, options = {}) {
  return useQuery<GetFeeScaleByIdResponse, Error>({
    queryKey: ["feeScale", id],
    queryFn: () => getFeeScaleById(id ?? ''),
    enabled: !!id,
    ...options,
  });
}