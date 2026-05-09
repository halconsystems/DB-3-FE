import apiClient from "../lib/apiClient";
import { parsePagedListData, type PagedList } from "../lib/unwrapApiList";

export interface ExternalVehicle {
  id: string;
  ser: number;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  attachment: string | null;
  eTagId: string | null;
  validFrom: string | null;
  validTo: string | null;
  /** Present on some API versions; list payloads may use {@link cardStatus} instead */
  tagStatus?: number | null;
  cardStatus?: number | null;
  externalUserId: string;
  externalUserName?: string | null;
  created: string;
  createdBy: string | null;
  isDeleted: boolean;
  isActive: boolean;
  lastModified: string | null;
  lastModifiedBy: string | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: T;
}

export interface CreateExternalVehicleRequest {
  ser?: number;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  attachment?: string;
  eTagId: string;
  validFrom: string;
  validTo: string;
  tagStatus: number;
  createdBy: string;
  externalUserId: string;
  isActive: boolean;
}

export interface UpdateExternalVehicleRequest {
  id: string;
  ser?: number;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  attachment?: string;
  eTagId: string;
  validFrom: string;
  validTo: string;
  tagStatus: number;
  lastModifiedBy?: string;
  externalUserId: string;
  isActive: boolean;
}

export type CreateExternalVehicleResponse = ApiResponse<ExternalVehicle | null>;
export type UpdateExternalVehicleResponse = ApiResponse<ExternalVehicle | null>;
export type DeleteExternalVehicleResponse = ApiResponse<ExternalVehicle | null>;
export type GetExternalVehicleByIdResponse = ApiResponse<ExternalVehicle | null>;
export type GetAllExternalVehicleResponse = ApiResponse<ExternalVehicle[] | null>;

export const getAllExternalVehicles = async (
  params?: { pageNumber?: number; pageSize?: number }
): Promise<PagedList<ExternalVehicle>> => {
  const pageNumber = params?.pageNumber ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const { data: envelope } = await apiClient.get<{
    statusCode: number;
    successMessage: string | null;
    errorMessage: string | null;
    data: unknown;
  }>("/vehicle/GetAllVehicle", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return parsePagedListData<ExternalVehicle>(envelope?.data as never);
};

export const getExternalVehicleById = async (
  id: string
): Promise<GetExternalVehicleByIdResponse> => {
  const { data } = await apiClient.get<GetExternalVehicleByIdResponse>("/vehicle/GetVehicleById", {
    params: { id },
  });
  return data;
};

export const createExternalVehicle = async (
  payload: CreateExternalVehicleRequest
): Promise<CreateExternalVehicleResponse> => {
  const { data } = await apiClient.post<CreateExternalVehicleResponse>("/vehicle/createVehicle", payload);
  return data;
};

export const updateExternalVehicle = async (
  payload: UpdateExternalVehicleRequest
): Promise<UpdateExternalVehicleResponse> => {
  const { data } = await apiClient.post<UpdateExternalVehicleResponse>("/vehicle/updateVehicle", payload);
  return data;
};

export const deleteExternalVehicle = async (
  id: string
): Promise<DeleteExternalVehicleResponse> => {
  const { data } = await apiClient.post<DeleteExternalVehicleResponse>("/vehicle/removeVehicle", null, {
    params: { id },
  });
  return data;
};
