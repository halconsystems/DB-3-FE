import apiClient from "../lib/apiClient";
import { GetTagApprovalRequestsResponse } from "../types/tag-approval.types";

export const getTagApprovalRequests = async (): Promise<GetTagApprovalRequestsResponse> => {
	const response = await apiClient.get<GetTagApprovalRequestsResponse>("/tag-approval/requests");
	return response.data;
};
