import apiClient from '../lib/apiClient';

// Types for the response (adjust as needed based on actual API response)
export interface EnumMember {
	name: string;
	value: number;
}

export interface EnumMetadata {
	name: string;
	fullName: string;
	members: EnumMember[];
}

export interface EnumMetadataResponse {
	statusCode: number;
	successMessage: string | null;
	errorMessage: string | null;
	data: {
		enums: EnumMetadata[];
	};
}

/**
 * Fetches enum metadata from the API with optional query params.
 * @param params Optional query params: EnumType and MemberSearch
 */
export const getEnumMetadata = async (params?: {
	EnumType?: string;
	MemberSearch?: string;
}): Promise<EnumMetadataResponse> => {
	const response = await apiClient.get<EnumMetadataResponse>(
		'/metadata/enums',
		{ params }
	);
	return response.data;
};
