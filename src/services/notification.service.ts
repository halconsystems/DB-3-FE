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
  data: {
    items: Notification[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}


export const getUnreadNotifications = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<UnreadNotificationsResponse> => {
  const response = await apiClient.get<UnreadNotificationsResponse>(
    "/notifications/unread",
    { params: { PageNumber: pageNumber, PageSize: pageSize } }
  );
  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (id: string) => {
  const response = await apiClient.post(`/notifications/${id}/read`);
  return response.data;
};
