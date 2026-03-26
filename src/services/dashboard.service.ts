import apiClient from "../lib/apiClient";
export interface SyncSummaryResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: {
    totalRecords: number;
    totalSuccess: number;
    totalFailed: number;
    totalPendingRetry: number;
  };
}
export const getSyncSummary = async (): Promise<SyncSummaryResponse> => {
  const response = await apiClient.get<SyncSummaryResponse>(
    "/dashboard/sync-summary"
  );
  return response.data;
};

export interface ExternalSearchRequest {
  pageNumber: number;
  pageSize: number;
  globalSearch: string;
  name: string;
  cnic: string;
  phoneNumber: string;
  tagNumber: string;
  rfidCardNumber: string;
  workerCardNumber: string;
  vehicleLicensePlate: string;
  cardStatus: number;
  tagStatus: number;
  userType: number;
  validFrom: string;
  validTo: string;
}

export interface ExternalSearchResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: any; // Adjust type as needed based on API response
}

export const externalSearch = async (
  body: ExternalSearchRequest
): Promise<ExternalSearchResponse> => {
  const response = await apiClient.post<ExternalSearchResponse>(
    "/dashboard/external-search",
    body
  );
  return response.data;
};
