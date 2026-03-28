import apiClient from "../lib/apiClient";
import { GetAllTagsResponse } from "../types/tag.types";
export const removeTag = async (id: string): Promise<any> => {
	const response = await apiClient.post("/tag/removeTag", null, { params: { id } });
	return response.data;
};
export const getAllTags = async (): Promise<GetAllTagsResponse> => {
	const response = await apiClient.get<GetAllTagsResponse>("/tag/GetAllTags");
	return response.data;
};
