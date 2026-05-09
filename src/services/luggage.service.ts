import apiClient from "../lib/apiClient";
import { parsePagedListData, type PagedList } from "../lib/unwrapApiList";

export interface Luggage {
  id: string;
  ser: number;
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  description: string;
  luggagePassType: string | number;
  validFrom: string;
  validTo: string;
  qrCode: string | null;
  tagId: string | null;
  pdfFilePath: string | null;
  externalUserId: string;
  externalUserName: string;
  created: string;
  createdBy: string | null;
  lastModified: string | null;
  lastModifiedBy: string | null;
  isDeleted: boolean;
  isActive: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: T;
}

export interface CreateLuggageRequest {
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  description: string;
  luggagePassType: number;
  validFrom: string;
  validTo: string;
  externalUserId: string;
}

export interface UpdateLuggageRequest {
  id: string;
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  description: string;
  luggagePassType: string | number;
  validFrom: string;
  validTo: string;
  lastModifiedBy?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  externalUserId: string;
}

export interface DeleteLuggageRequest {
  id: string;
}

export type CreateLuggageResponse = ApiResponse<Luggage | null>;
export type UpdateLuggageResponse = ApiResponse<Luggage | null>;
export type DeleteLuggageResponse = ApiResponse<Luggage | null>;
export type GetLuggageByIdResponse = ApiResponse<Luggage | null>;
export type GetAllLuggageResponse = ApiResponse<Luggage[] | null>;

export const getAllLuggage = async (
  params?: { pageNumber?: number; pageSize?: number }
): Promise<PagedList<Luggage>> => {
  const pageNumber = params?.pageNumber ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const { data: envelope } = await apiClient.get<{
    statusCode: number;
    successMessage: string | null;
    errorMessage: string | null;
    data: unknown;
  }>("/luggage/GetAllLuggagePass", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return parsePagedListData<Luggage>(envelope?.data as never);
};

export const getLuggageById = async (id: string): Promise<GetLuggageByIdResponse> => {
  const { data } = await apiClient.get<GetLuggageByIdResponse>("/luggage/GetLuggagePassById", {
    params: { id },
  });
  return data;
};

export const createLuggage = async (
  payload: CreateLuggageRequest
): Promise<CreateLuggageResponse> => {
  const { data } = await apiClient.post<CreateLuggageResponse>("/luggage/createLuggagePass", payload);
  return data;
};

export const updateLuggage = async (
  payload: UpdateLuggageRequest
): Promise<UpdateLuggageResponse> => {
  const { data } = await apiClient.post<UpdateLuggageResponse>("/luggage/updateLuggagePass", payload);
  return data;
};

export const deleteLuggage = async (id: string): Promise<DeleteLuggageResponse> => {
  const { data } = await apiClient.post<DeleteLuggageResponse>("/luggage/removeLuggagePass", { id });
  return data;
};
