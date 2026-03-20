export const removeUser = async (id: string): Promise<{ statusCode: number; successMessage?: string; errorMessage?: string }> => {
	let token = "";
	if (typeof window !== "undefined") {
		token = localStorage.getItem("token") || "";
	}
	const response = await apiClient.post<{ statusCode: number; successMessage?: string; errorMessage?: string }>(
		"/auth/remove-user",
		{ id },
		{
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		}
	);
	return response.data;
};
import apiClient from "../lib/apiClient";
import { LoginRequest, LoginResponse, GetAllUsersResponse, RegisterRequest, RegisterResponse } from "../types/auth.types";
export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
	const response = await apiClient.get<GetAllUsersResponse>("/auth/GetAllUsers");
	return response.data;
};
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>("/auth/login", data);
	return response.data;
};
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
	const formData = new FormData();
	formData.append("FullName", data.FullName);
	formData.append("Email", data.Email);
	formData.append("Password", data.Password);
	formData.append("PhoneNumber", data.PhoneNumber);
	if (data.VehicleId) formData.append("VehicleId", data.VehicleId);
	formData.append("CNIC", data.CNIC);
	formData.append("RoleId", data.RoleId);
	if (data.ProfilePicture) formData.append("ProfilePicture", data.ProfilePicture);
	if (data.CNICFrontImage) formData.append("CNICFrontImage", data.CNICFrontImage);
	if (data.CNICBackImage) formData.append("CNICBackImage", data.CNICBackImage);
	let token = "";
	if (typeof window !== "undefined") {
		token = localStorage.getItem("token") || "";
	}
	const response = await apiClient.post<RegisterResponse>("/auth/register", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});
	return response.data;
};