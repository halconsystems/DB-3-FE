import apiClient from "../lib/apiClient";

export interface ExternalUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  userType: number;
  rfidCardNumber: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: number;
  created: string;
  createdBy: string;
  isDeleted: boolean;
  isActive: boolean;
  lastModified: string | null;
  lastModifiedBy: string | null;
}

export const getAllExternalUsers = async (): Promise<ExternalUser[]> => {
  const response = await apiClient.get<ExternalUser[]>("/externaluser/all");
  return response.data;
};
