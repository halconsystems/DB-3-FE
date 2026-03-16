import apiClient from "../lib/apiClient";
export interface UnreadNotificationsResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: {
    unreadCount: number;
  };
}
export const getUnreadNotifications = async (): Promise<UnreadNotificationsResponse> => {
  const response = await apiClient.get<UnreadNotificationsResponse>(
    "/notifications/unread"
  );
  return response.data;
};
