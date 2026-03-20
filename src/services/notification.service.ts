import apiClient from "../lib/apiClient";
export interface Notification {
  id: string;
  notificationType: number;
  title: string;
  message: string;
  entityType: string;
  entityId: string | null;
  externalUserId: string | null;
  isRead: boolean;
  readAt: string | null;
  recipientId: string | null;
  priority: number;
  createdAt: string;
}

export interface UnreadNotificationsResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: Notification[];
}

export const getUnreadNotifications = async (): Promise<UnreadNotificationsResponse> => {
  const response = await apiClient.get<UnreadNotificationsResponse>(
    "/notifications/unread"
  );
  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (id: string) => {
  const response = await apiClient.post(`/notifications/${id}/read`);
  return response.data;
};
