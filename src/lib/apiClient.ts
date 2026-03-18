import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json"
	}
});
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});
apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		const apiMsg =
			(error.response?.data as any)?.errorMessage ||
			(error.response?.data as any)?.message ||
			error.message ||
			"Unknown error";

		if (process.env.NODE_ENV === "development") {
			const status = error.response?.status;
			const url = error.config?.url ?? "unknown-url";
			console.warn(`[API${status ? ` ${status}` : ""}] ${url}: ${apiMsg}`);
		}

		return Promise.reject(error);
	}
);
export default apiClient;