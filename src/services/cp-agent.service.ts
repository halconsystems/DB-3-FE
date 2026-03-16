import apiClient from "../lib/apiClient";

export interface CpAgent {
  id: number;
  cpAgentName: string;
  controller: string;
  zone: string;
  interCommName: string;
  laneType: string;
  manufacturer: string;
  status: 'Active' | 'Inactive';
}

export interface GetAllCpAgentResponse {
  statusCode: number;
  successMessage?: string;
  errorMessage?: string;
  data: CpAgent[];
}

export const getAllCpAgents = async (): Promise<GetAllCpAgentResponse> => {
  const { data } = await apiClient.get<GetAllCpAgentResponse>("/cpagent/get-all-CpAgent");
  return data;
};
