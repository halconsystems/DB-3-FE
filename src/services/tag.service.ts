export interface UpdateTagRequest {
	id: string;
	tagNumber: string;
	tagTypeId: string;
	status: number;
	validFrom: string;
	validTo: string;
	assignedEntityType: string;
	assignedEntityId: string;
	lastModified: string;
	lastModifiedBy: string;
}
export const updateTag = async (payload: UpdateTagRequest): Promise<any> => {
	const response = await apiClient.post("/tag/updateTag", payload);
	return response.data;
};
import apiClient from "../lib/apiClient";
import { GetAllTagsResponse, Tag } from "../types/tag.types";
export interface GetTagByIdResponse {
	statusCode: number;
	successMessage: string;
	errorMessage: string | null;
	data?: Tag;
}

export const getTagById = async (id: string): Promise<GetTagByIdResponse> => {
	const response = await apiClient.get<GetTagByIdResponse>("/tag/GetTagById", { params: { id } });
	return response.data;
};
export interface CreateTagRequest {
	tagNumber: string;
	tagTypeId: string;
	status: number;
	validFrom: string;
	validTo: string;
	assignedEntityType: string;
	created: string;
	createdBy: string;
}
export interface CreateTagResponse {
	statusCode: number;
	successMessage: string;
	errorMessage: string | null;
	data?: any;
}
export const createTag = async (tag: CreateTagRequest): Promise<CreateTagResponse> => {
	const response = await apiClient.post<CreateTagResponse>("/tag/createTag", tag);
	return response.data;
};
export const removeTag = async (id: string): Promise<any> => {
	const response = await apiClient.post("/tag/removeTag", null, { params: { id } });
	return response.data;
};
export const getAllTags = async (): Promise<GetAllTagsResponse> => {
	const response = await apiClient.get<GetAllTagsResponse>("/tag/GetAllTags");
	return response.data;
};

