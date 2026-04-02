
import apiClient from "../lib/apiClient";
import type { FeeScale, GetAllFeeScaleResponse } from "../types/fees.types";

export async function getAllFeeScale(): Promise<GetAllFeeScaleResponse> {
  const response = await apiClient.get("/feescale/GetAllFeeScale");
  return response.data;
}
