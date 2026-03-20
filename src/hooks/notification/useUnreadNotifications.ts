import { useQuery } from "@tanstack/react-query";
import { getUnreadNotifications } from "../../services/notification.service";

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ["unread-notifications"],
    queryFn: getUnreadNotifications,
    select: (data) => ({
      notifications: data.data,
      count: data.data.filter((n) => !n.isRead).length,
    }),
  });
};
