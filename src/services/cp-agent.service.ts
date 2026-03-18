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

export interface GetCpAgentByIdResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: CpAgent | null;
}

export interface UpdateCpAgentDto {
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
}

export interface UpdateCpAgentResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: CpAgent | null;
}

export interface DeleteCpAgentResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: CpAgent | null;
}
interface GetAllCpAgentApiResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: CpAgent[];
}

export const getAllCpAgent = async (): Promise<CpAgent[]> => {
  const response = await apiClient.get<CpAgent[] | GetAllCpAgentApiResponse>(
    '/cpagent/get-all-CpAgent'
  );

  const payload = response.data;
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
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
  await apiClient.post("/cpagent/create-CpAgent", payload);
};

export const getCpAgentById = async (
  id: string
): Promise<GetCpAgentByIdResponse> => {
  const { data } = await apiClient.get<GetCpAgentByIdResponse>(
    "/cpagent/get-CpAgent-by-id",
    { params: { id } }
  );
  return data;
};

export const updateCpAgent = async (
  payload: UpdateCpAgentDto
): Promise<UpdateCpAgentResponse> => {
  const { data } = await apiClient.post<UpdateCpAgentResponse>(
    "/cpagent/update-CpAgent",
    payload
  );
  return data;
};

export const deleteCpAgent = async (
  id: string
): Promise<DeleteCpAgentResponse> => {
  const { data } = await apiClient.post<DeleteCpAgentResponse>(
    "/cpagent/delete-CpAgent",
    { id }
  );
  return data;
};
