import { TagApprovalRequest } from "../types/tag-approval.types";
import apiClient from "../lib/apiClient";
import { GetTagApprovalRequestsResponse } from "../types/tag-approval.types";
export interface GetTagApprovalRequestByIdResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data?: TagApprovalRequest;
}
export const getTagApprovalRequestById = async (id: string): Promise<GetTagApprovalRequestByIdResponse> => {
  const response = await apiClient.get<GetTagApprovalRequestByIdResponse>(`/tag-approval/requests/${id}`);
  return response.data;
};
export const getTagApprovalRequests = async (): Promise<GetTagApprovalRequestsResponse> => {
	const response = await apiClient.get<GetTagApprovalRequestsResponse>("/tag-approval/requests");
	return response.data;
};
export const rejectTagApprovalRequest = async (id: string): Promise<any> => {
  const response = await apiClient.post(`/tag-approval/requests/${id}/reject`);
  return response.data;
};
export const cancelTagApprovalRequest = async (id: string): Promise<any> => {
  const response = await apiClient.post(`/tag-approval/requests/${id}/cancel`);
  return response.data;
};
