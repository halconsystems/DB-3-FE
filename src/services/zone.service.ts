
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
  errorMessage: string | null;
  data: Zone;
}

export const createZone = async (
  zone: CreateZoneRequest,
  token: string
): Promise<CreateZoneResponse> => {
  const response = await apiClient.post<CreateZoneResponse>(
    "/zone/create-zone",
    zone,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
import apiClient from "./apiClient";
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
  devices: Device[];
  tagZoneAccesses: any[];
}

export interface GetAllZoneResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: Zone[];
}

export const getAllZones = async (): Promise<GetAllZoneResponse> => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }
  const response = await apiClient.get<GetAllZoneResponse>("/zone/get-all-zone", {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};
