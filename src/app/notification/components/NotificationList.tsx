'use client';
import styles from './NotificationList.module.css';
import { useUnreadNotifications } from '../../../hooks/notification/useUnreadNotifications';
import { markNotificationAsRead } from '../../../services/notification.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NotificationList() {
  const { data, isLoading, error } = useUnreadNotifications();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.markAllLabel}>Unread notifications</span>
        <span style={{ marginLeft: 'auto', fontWeight: 500, color: '#27ae60' }}>
          {isLoading ? 'Loading...' : error ? 'Error' : `Unread: ${data?.count ?? 0}`}
        </span>
      </div>

      <div className={styles.notificationsList}>
        {isLoading && <div>Loading notifications...</div>}
        {error && <div>Error loading notifications</div>}
        {!isLoading && !error && data?.notifications.length === 0 && (
          <div>No notifications found.</div>
        )}
        {!isLoading && !error && data?.notifications.map((notification) => (
          <div key={notification.id} className={styles.notificationCard}>
            <div className={styles.iconWrapper}>
              <img 
                src="/icons/basil_notification-on-solid.png" 
                alt="" 
                className={styles.notificationIcon} 
              />
            </div>
            <div className={styles.contentWrapper}>
              <h4 className={styles.notificationTitle}>{notification.title}</h4>
              <p className={styles.notificationDescription}>{notification.message}</p>
            </div>
            <span className={styles.timestamp}>{new Date(notification.createdAt).toLocaleString()}</span>
            {!notification.isRead && (
              <button
                className={styles.markAsReadButton}
                onClick={() => mutation.mutate(notification.id)}
                disabled={mutation.isPending}
                title="Mark this notification as read"
              >
                {mutation.isPending ? 'Marking...' : 'Mark as read'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
