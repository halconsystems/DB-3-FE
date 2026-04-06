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

export interface ApproveTagApprovalRequestPayload {
  tagApprovalRequestId: string;
  entityName: string;
  entityId: string;
  tagNumber: string;
  tagTypeId: string;
  validFrom: string;
  validTo: string;
  status: number;
  feeScaleId: string;
  zoneId: string;
  deviceId: string;
  zoneIds: string[];
  trialPeriod: number;
}

export const approveTagApprovalRequest = async (payload: ApproveTagApprovalRequestPayload): Promise<any> => {
  const response = await apiClient.post("/tag-approval/approve", payload);
  return response.data;
};

export interface CreateTagApprovalRequestPayload {
  entityName: string;
  entityId: string;
  tagTypeId: string;
  tagNumber: string;
  feeScaleId: string;
  planType: string;
  validFrom: string;
  validTo: string;
  zoneId: string;
  deviceId: string;
  notes: string;
  trialPeriod: string;
}

export const createTagApprovalRequest = async (payload: CreateTagApprovalRequestPayload): Promise<any> => {
  const response = await apiClient.post("/tag-approval/request", payload);
  return response.data;
};
