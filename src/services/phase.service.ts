export interface RemovePhaseRequest {
  id: string;
}

export interface RemovePhaseResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
}

export async function removePhase(
  id: string,
  token: string
): Promise<RemovePhaseResponse> {
  const response = await apiClient.post<RemovePhaseResponse>(
    '/phases/remove-phase',
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
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

export async function createPhase(
  data: CreatePhaseRequest,
  token: string
): Promise<CreatePhaseResponse> {
  const response = await apiClient.post<CreatePhaseResponse>(
    '/phases/create-phase',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
import apiClient from './apiClient';

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

export async function getAllPhase(): Promise<GetAllPhaseResponse> {
  const response = await apiClient.get<GetAllPhaseResponse>('/phases/get-all-phase');
  return response.data;
}
