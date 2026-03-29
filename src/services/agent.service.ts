import apiClient from "../lib/apiClient";

export const getAllSyncAgents = async (): Promise<any> => {
  const response = await apiClient.get("/syncagent/GetAllSyncAgents");
  return response.data;
};
