import apiClient from "../lib/apiClient";

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  ipAddress: string;
  port: number;
  deviceType: string;
  sdkType: string;
  zoneId: string;
  zoneName: string | null;
  created: string;
  lastModified: string | null;
  lastModifiedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface Zone {
  id: string;
  name: string;
  lastModifiedBy: string | null;
  createdBy: string;
  lastModified: string | null;
  created: string;
  isDeleted: boolean;
  isActive: boolean;
  phaseId: string;
  phaseName?: string;
  devices: Device[];
  tagZoneAccesses: any[];
}

export interface UpdateZoneRequest {
  id: string;
  name: string;
  phaseId: string;
  isActive: boolean;
  isDeleted: boolean;
  lastModified: string;
  lastModifiedBy: string;
}

export interface UpdateZoneResponse {
  statusCode: number;
  successMessage: string;
  errorMessage?: string | null;
  data: Zone;
}

export interface GetZoneByIdResponse {
  statusCode: number;
  successMessage: string;
  errorMessage?: string | null;
  data: Zone | null;
}

export interface DeleteZoneResponse {
  statusCode: number;
  successMessage: string;
  errorMessage?: string | null;
}

export interface CreateZoneRequest {
  name: string;
  createdBy: string;
  phaseId: string;
  created: string;
  isDeleted: boolean;
  isActive: boolean;
}

export interface CreateZoneResponse {
  statusCode: number;
  successMessage: string;
  errorMessage?: string | null;
  data: Zone;
}

export interface GetAllZoneResponse {
  statusCode: number;
  successMessage: string;
  errorMessage?: string | null;
  data: Zone[];
}

export const getAllZones = async (): Promise<GetAllZoneResponse> => {
  const { data } = await apiClient.get<GetAllZoneResponse>("/zone/GetAllZone");
  return data;
};

export const getZoneById = async (id: string): Promise<GetZoneByIdResponse> => {
  const { data } = await apiClient.get<GetZoneByIdResponse>(
    "/zone/GetZoneById",
    { params: { id } }
  );
  return data;
};

export const createZone = async (
  zone: CreateZoneRequest
): Promise<CreateZoneResponse> => {
  const { data } = await apiClient.post<CreateZoneResponse>(
    "/zone/createZone",
    zone
  );
  return data;
};

export const updateZone = async (
  zone: UpdateZoneRequest
): Promise<UpdateZoneResponse> => {
  const { data } = await apiClient.post<UpdateZoneResponse>(
    "/zone/updateZone",
    zone
  );
  return data;
};

export const deleteZone = async (id: string): Promise<DeleteZoneResponse> => {
  const { data } = await apiClient.post<DeleteZoneResponse>(
    "/zone/deleteZone",
    { id }
  );
  return data;
};