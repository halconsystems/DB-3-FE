import apiClient from "../lib/apiClient";
export const getAllControllers = async (): Promise<any> => {
  const response = await apiClient.get("/controller/GetAllControllers");
  return response.data;
};