import apiClient from '../lib/apiClient';
export interface Phase {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  modifiedBy: string | null;
  isActive: boolean;
  modified: string | null;
  created: string;
}
export interface GetAllPhaseResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: Phase[];
}
export interface GetPhaseByIdResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: Phase | null;
}

export interface CreatePhaseRequest {
  name: string;
  description: string;
}

export interface CreatePhaseResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: Phase;
}

export interface UpdatePhaseRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdatePhaseResponse {
  statusCode: number;
  successMessage: string;
  errorMessage?: string | null;
  data: Phase;
}

export interface RemovePhaseResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
}


export const getAllPhase = async (): Promise<GetAllPhaseResponse> => {
  const { data } = await apiClient.get<GetAllPhaseResponse>(
    '/phases/GetAllPhases'
  );
  return data;
};

export const getPhaseById = async (
  id: string
): Promise<GetPhaseByIdResponse> => {
  const { data } = await apiClient.get<GetPhaseByIdResponse>(
    '/phases/GetPhaseById',
    { params: { id } }
  );
  return data;
};

export const createPhase = async (
  payload: CreatePhaseRequest
): Promise<CreatePhaseResponse> => {
  const { data } = await apiClient.post<CreatePhaseResponse>(
    '/phases/createPhase',
    payload
  );
  return data;
};

export const updatePhase = async (
  payload: UpdatePhaseRequest
): Promise<UpdatePhaseResponse> => {
  const { data } = await apiClient.post<UpdatePhaseResponse>(
    '/phases/updatePhase',
    payload
  );
  return data;
};

export const removePhase = async (
  id: string
): Promise<RemovePhaseResponse> => {
  const { data } = await apiClient.post<RemovePhaseResponse>(
    '/phases/removePhase',
    { id }
  );
  return data;
};