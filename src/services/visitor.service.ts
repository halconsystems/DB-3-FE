import apiClient from "../lib/apiClient";
import { parsePagedListData, type PagedList } from "../lib/unwrapApiList";

export interface ExternalVisitorPass {
  cardStatus?: any;
  id: string;
  ser: number;
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  visitorPassType: string | number;
  validFrom: string;
  validTo: string;
  qrCode: string | null;
  tagId?: string | null;
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

export interface CreateExternalVisitorPassRequest {
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  description?: string;
  visitorPassType: number;
  validFrom: string;
  validTo: string;
  externalUserId: string;
}

export interface UpdateExternalVisitorPassRequest {
  id: string;
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  visitorPassType: string | number;
  validFrom: string;
  validTo: string;
  isActive?: boolean;
  isDeleted?: boolean;
  lastModifiedBy?: string;
  externalUserId?: string;
}

export type CreateExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass | null>;
export type UpdateExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass | null>;
export type DeleteExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass | null>;
export type GetExternalVisitorPassByIdResponse = ApiResponse<ExternalVisitorPass | null>;
export type GetAllExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass[] | null>;

export const getAllExternalVisitorPass = async (
  params?: { pageNumber?: number; pageSize?: number }
): Promise<PagedList<ExternalVisitorPass>> => {
  const pageNumber = params?.pageNumber ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const { data: envelope } = await apiClient.get<{
    statusCode: number;
    successMessage: string | null;
    errorMessage: string | null;
    data: unknown;
  }>("/visitors/GetAllVisitorPass", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return parsePagedListData<ExternalVisitorPass>(envelope?.data as never);
};

export const getExternalVisitorPassById = async (
  id: string
): Promise<GetExternalVisitorPassByIdResponse> => {
  const { data } = await apiClient.get<GetExternalVisitorPassByIdResponse>(
    "/visitors/GetVisitorPassById",
    { params: { id } }
  );
  return data;
};

export const createExternalVisitorPass = async (
  payload: CreateExternalVisitorPassRequest
): Promise<CreateExternalVisitorPassResponse> => {
  const { data } = await apiClient.post<CreateExternalVisitorPassResponse>(
    "/visitors/createVisitorPass",
    payload
  );
  return data;
};

export const updateExternalVisitorPass = async (
  payload: UpdateExternalVisitorPassRequest
): Promise<UpdateExternalVisitorPassResponse> => {
  const { data } = await apiClient.post<UpdateExternalVisitorPassResponse>(
    "/visitors/updateVisitorPass",
    payload
  );
  return data;
};

export const deleteExternalVisitorPass = async (
  id: string
): Promise<DeleteExternalVisitorPassResponse> => {
  const { data } = await apiClient.post<DeleteExternalVisitorPassResponse>(
    "/visitors/removeVisitorPass",null,
    { params: { id } }
  );
  return data;
};
