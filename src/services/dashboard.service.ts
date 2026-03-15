import apiClient from "./apiClient";

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
