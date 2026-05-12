
import apiClient from "../lib/apiClient";
import type {
  FeeScale,
  GetAllFeeScaleResponse,
  RemoveFeeScaleResponse,
} from "../types/fees.types";

export async function getAllFeeScale(): Promise<GetAllFeeScaleResponse> {
  const response = await apiClient.get("/feescale/GetAllFeeScale");
  return response.data;
}

export async function removeFeeScale(id: string): Promise<RemoveFeeScaleResponse> {
  const response = await apiClient.post("/feescale/removeFeeScale", { id });
  return response.data;
}

// Create FeeScale
export interface CreateFeeScalePayload {
  name: string;
  feeCategory: string;
  amount: number;
  description?: string;
  applicableUserTypes: string;
  applicableVehicleCategory: string;
  isTaxApplicable: boolean;
  taxPercentage: number;
  discountPercentage?: number;
  halconPercentage?: number;
  dhaPercentage?: number;
  mdrPercentage?: number;
  fedTaxPercentage?: number;
  discountValidFrom?: string;
  discountValidTo?: string;
  currency: string;
  createdBy?: string;
}

export async function createFeeScale(payload: CreateFeeScalePayload): Promise<RemoveFeeScaleResponse> {
  const response = await apiClient.post("/feescale/createFeeScale", payload);
  return response.data;
}
export interface UpdateFeeScalePayload {
  id: string;
  name: string;
  feeCategory: string;
  amount: number;
  description?: string;
  isActive?: boolean;
  applicableUserTypes: string;
  applicableVehicleCategory: string;
  isTaxApplicable: boolean;
  taxPercentage: number;
  discountPercentage?: number;
  halconPercentage?: number;
  dhaPercentage?: number;
  mdrPercentage?: number;
  fedTaxPercentage?: number;
  discountValidFrom?: string;
  discountValidTo?: string;
  currency: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export async function updateFeeScale(payload: UpdateFeeScalePayload): Promise<RemoveFeeScaleResponse> {
  const response = await apiClient.post("/feescale/updateFeeScale", payload);
  return response.data;
}
export interface GetFeeScaleByIdResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: FeeScale;
}

export async function getFeeScaleById(id: string): Promise<GetFeeScaleByIdResponse> {
  const response = await apiClient.get(`/feescale/GetFeeScaleById`, { params: { id } });
  return response.data;
}
