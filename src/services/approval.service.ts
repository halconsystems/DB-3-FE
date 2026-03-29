import apiClient from "../lib/apiClient";
import { GetTagApprovalRequestsResponse } from "../types/tag-approval.types";

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
