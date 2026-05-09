import apiClient from "../lib/apiClient";
import { parsePagedListData, type PagedList } from "../lib/unwrapApiList";

export interface ExternalWorker {
  externalUserName: string;
  id: string;
  ser: number;
  jobType: number | string;
  name: string;
  fatherOrHusbandName: string;
  phoneNumber: string;
  cnic: string;
  dateOfBirth: string | null;
  cnicFront: string | null;
  cnicBack: string | null;
  profilePicture: string | null;
  policeVerification: boolean;
  policeVerificationAttachment: string | null;
  workerCardNumber: string;
  cardStatus: number | string | null;
  workerCardDeliveryType: string | number;
  validFrom: string | null;
  validTo: string | null;
  created: string;
  createdBy: string;
  lastModified: string | null;
  lastModifiedBy: string | null;
  externalUserId?: string;
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: T;
}

export interface CreateExternalWorkerRequest {
  ser: number;
  jobType: number;
  name: string;
  fatherOrHusbandName: string;
  phoneNumber: string;
  cnic: string;
  dateOfBirth: string;
  cnicFront?: string;
  cnicBack?: string;
  profilePicture?: string;
  policeVerification: boolean;
  policeVerificationAttachment?: string;
  workerCardNumber: string;
  cardStatus: number;
  workerCardDeliveryType: number;
  validFrom: string;
  validTo: string;
  createdBy: string;
  externalUserId: string;
  isActive?: boolean;
}

export interface UpdateExternalWorkerRequest {
  id: string;
  ser: number;
  jobType: number;
  name: string;
  fatherOrHusbandName: string;
  phoneNumber: string;
  cnic: string;
  dateOfBirth: string;
  cnicFront?: string;
  cnicBack?: string;
  profilePicture?: string;
  policeVerification: boolean;
  policeVerificationAttachment?: string;
  workerCardNumber: string;
  lastModifiedBy?: string;
  cardStatus: number;
  workerCardDeliveryType: number;
  validFrom: string;
  validTo: string;
  isActive?: boolean;
  externalUserId?: string;
}

export type CreateExternalWorkerResponse = ApiResponse<ExternalWorker | null>;
export type UpdateExternalWorkerResponse = ApiResponse<ExternalWorker | null>;
export type DeleteExternalWorkerResponse = ApiResponse<ExternalWorker | null>;
export type GetExternalWorkerByIdResponse = ApiResponse<ExternalWorker | null>;
export type GetAllExternalWorkersResponse = ApiResponse<ExternalWorker[] | null>;

export const getAllExternalWorkers = async (
  params?: { pageNumber?: number; pageSize?: number }
): Promise<PagedList<ExternalWorker>> => {
  const pageNumber = params?.pageNumber ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const { data: envelope } = await apiClient.get<{
    statusCode: number;
    successMessage: string | null;
    errorMessage: string | null;
    data: unknown;
  }>("/worker/GetAllWorker", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return parsePagedListData<ExternalWorker>(envelope?.data as never);
};

export const getExternalWorkerById = async (
  id: string
): Promise<GetExternalWorkerByIdResponse> => {
  const { data } = await apiClient.get<GetExternalWorkerByIdResponse>("/worker/GetWorkerById", {
    params: { id },
  });
  return data;
};

export const createExternalWorker = async (
  payload: CreateExternalWorkerRequest
): Promise<CreateExternalWorkerResponse> => {
  const { data } = await apiClient.post<CreateExternalWorkerResponse>("/worker/createWorker", payload);
  return data;
};

export const updateExternalWorker = async (
  payload: UpdateExternalWorkerRequest
): Promise<UpdateExternalWorkerResponse> => {
  const { data } = await apiClient.post<UpdateExternalWorkerResponse>("/worker/updateWorker", payload);
  return data;
};

export const deleteExternalWorker = async (
  id: string
): Promise<DeleteExternalWorkerResponse> => {
  const { data } = await apiClient.post<DeleteExternalWorkerResponse>("/worker/removeWorker", null, {
    params: { id },
  });
  return data;
};
