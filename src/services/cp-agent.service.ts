import apiClient from "../lib/apiClient";
export interface CpAgent {
  id: string;
  name: string;
  agentNumber: string;
  zoneId: string;
  cpAgentType: number;
  controllerId: string;
  syncAgentId: string;
  serverIp: string;
  tagLimit: number;
  isFixedTagIdentity: boolean;
  isTempTagIdentity: boolean;
  interCommId: string;
  interCommPassword: string;
  interCommName: string;
  isActive: boolean;
  isDeleted: boolean;
  lastModified: string;
  lastModifiedBy: string;
  created: string;
  createdBy: string;
}

export const getAllCpAgent = async (): Promise<CpAgent[]> => {
  const response = await apiClient.get<CpAgent[]>("/cp-agent/get-all-CpAgent");
  return response.data;
};

export interface CreateCpAgentDto {
  name: string;
  agentNumber: string;
  zoneId: string;
  cpAgentType: number;
  controllerId: string;
  syncAgentId: string;
  serverIp: string;
  tagLimit: number;
  isFixedTagIdentity: boolean;
  isTempTagIdentity: boolean;
  interCommId: string;
  interCommPassword: string;
  interCommName: string;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: string;
  created: string;
}

export const createCpAgent = async (data: Omit<CreateCpAgentDto, "created" | "createdBy" | "isDeleted"> & { isActive: boolean }): Promise<void> => {
  const now = new Date().toISOString();
  const createdBy = "system"; 
  const payload: CreateCpAgentDto = {
    ...data,
    isDeleted: !data.isActive,
    created: now,
    createdBy,
  };
  await apiClient.post("/cp-agent/create-CpAgent", payload);
};
