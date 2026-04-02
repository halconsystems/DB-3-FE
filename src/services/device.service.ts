import apiClient from '../lib/apiClient';

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
  isActive: boolean | null;
  isDeleted: boolean | null;
}

export interface GetAllDevicesResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: Device[];
}

export const getAllDevices = async (): Promise<GetAllDevicesResponse> => {
  const response = await apiClient.get<GetAllDevicesResponse>('/devices/GetAllDevices');
  return response.data;
};
