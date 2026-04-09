import apiClient from '../lib/apiClient';

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

export const getEnumMetadata = async (): Promise<EnumMetadataResponse> => {
  const response = await apiClient.get<EnumMetadataResponse>('/metadata/enums');
  return response.data;
};

// Helper function to extract specific enum by name
export const getEnumByName = async (enumName: string): Promise<EnumMetadata | null> => {
  const response = await getEnumMetadata();
  return response.data.enums.find((e) => e.name === enumName) || null;
};
