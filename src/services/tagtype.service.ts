
import apiClient from "../lib/apiClient";
import { GetAllTagTypesResponse } from "../types/tagtype.types";
export const removeTagType = async (id: string): Promise<any> => {
	const response = await apiClient.post("/tagtype/removeTagtype", null, { params: { id } });
	return response.data;
};

export const getAllTagTypes = async (): Promise<GetAllTagTypesResponse> => {
	const response = await apiClient.get<GetAllTagTypesResponse>("/tagtype/GetAllTagtypes");
	return response.data;
};
export interface CreateTagTypeRequest {
	name: string;
	description: string;
}

export const createTagType = async (payload: CreateTagTypeRequest): Promise<any> => {
	const response = await apiClient.post("/tagtype/createTagtype", payload);
	return response.data;
};
import { TagType } from "../types/tagtype.types";

export const getTagTypeById = async (id: string): Promise<TagType> => {
	const response = await apiClient.get("/tagtype/GetTagtypeById", { params: { id } });
	return response.data.data;
};
export interface UpdateTagTypeRequest {
	id: string;
	name: string;
	description: string;
}

export const updateTagType = async (payload: UpdateTagTypeRequest): Promise<any> => {
	const response = await apiClient.post("/tagtype/updateTagtype", payload);
	return response.data;
};
