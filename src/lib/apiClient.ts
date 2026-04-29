
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json"
	},
	withCredentials: true, // Allow cookies to be sent with requests
});

// Logout utility: clears all auth tokens and redirects to sign-in
export function logout() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("token");
		localStorage.removeItem("rememberMe");
		localStorage.removeItem("rememberedEmail");
		localStorage.removeItem("rememberedPassword");
		localStorage.removeItem("fullName");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("fullName");
		
		// Clear cookie via document.cookie
		document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		
		window.location.replace("/auth/sign-in");
	}
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	if (typeof window !== "undefined") {
		// Try to get token from localStorage first (Remember Me case)
		let token = localStorage.getItem("token");
		// Fall back to sessionStorage (temporary session case)
		if (!token) {
			token = sessionStorage.getItem("token");
		}
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		const status = error.response?.status;
		const apiMsg =
			(error.response?.data as any)?.errorMessage ||
			(error.response?.data as any)?.message ||
			error.message ||
			"Unknown error";

		if (process.env.NODE_ENV === "development") {
			const url = error.config?.url ?? "unknown-url";
			console.warn(`[API${status ? ` ${status}` : ""}] ${url}: ${apiMsg}`);
		}

		// Auto-logout on 401 Unauthorized
		if (status === 401) {
			console.warn('[API 401] Unauthorized - Logging out');
			logout();
		}

		else
			console.log(`[API Error] ${apiMsg}`);
		return Promise.reject(error);
	}
);

export default apiClient;
