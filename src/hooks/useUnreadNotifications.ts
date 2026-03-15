import { useQuery } from "@tanstack/react-query";
import { getUnreadNotifications } from "../services/notification.service";

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ["unread-notifications"],
    queryFn: getUnreadNotifications,
  });
};
