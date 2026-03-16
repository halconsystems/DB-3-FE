import apiClient from "./apiClient";
export interface Role {
  id: string;
  name: string;
  description: string;
}
export interface GetRolesResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: Role[];
}
export const getRoles = async (): Promise<GetRolesResponse> => {
  const response = await apiClient.get<GetRolesResponse>("/roles");
  return response.data;
};
