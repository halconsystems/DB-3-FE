import { useQuery } from "@tanstack/react-query";
import { getUnreadNotifications } from "../../services/notification.service";

export const useUnreadNotifications = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["unread-notifications", pageNumber, pageSize],
    queryFn: () => getUnreadNotifications(pageNumber, pageSize),
    select: (data) => ({
      notifications: data.data.items,
      count: data.data.items.filter((n: any) => !n.isRead).length,
      totalCount: data.data.totalCount,
      pageNumber: data.data.pageNumber,
      pageSize: data.data.pageSize,
    }),
  });
};
