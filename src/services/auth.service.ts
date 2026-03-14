import apiClient from "./apiClient";
import { LoginRequest, LoginResponse } from "../types/auth.types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>("/auth/login", data);
	return response.data;
};
export interface RegisterRequest {
	FullName: string;
	Email: string;
	Password: string;
	PhoneNumber: string;
	VehicleId: string;
	CNIC: string;
	RoleId: string;
	ProfilePicture?: File;
	CNICFrontImage?: File;
	CNICBackImage?: File;
}

export interface RegisterResponse {
	statusCode: number;
	successMessage: string;
	errorMessage: string | null;
	data: any;
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
	const formData = new FormData();
	formData.append("FullName", data.FullName);
	formData.append("Email", data.Email);
	formData.append("Password", data.Password);
	formData.append("PhoneNumber", data.PhoneNumber);
	formData.append("VehicleId", data.VehicleId);
	formData.append("CNIC", data.CNIC);
	formData.append("RoleId", data.RoleId);
	if (data.ProfilePicture) formData.append("ProfilePicture", data.ProfilePicture);
	if (data.CNICFrontImage) formData.append("CNICFrontImage", data.CNICFrontImage);
	if (data.CNICBackImage) formData.append("CNICBackImage", data.CNICBackImage);

	// Get token from localStorage if available
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

