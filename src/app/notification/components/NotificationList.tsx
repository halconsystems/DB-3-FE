'use client';
import styles from './NotificationList.module.css';
import { useUnreadNotifications } from '../../../hooks/notification/useUnreadNotifications';
import { markNotificationAsRead } from '../../../services/notification.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';



import React, { useState } from 'react';
import { useSignalR } from 'hooks/useSignalR';
import { ToastContainer } from '../../../components/ui/toast';

export default function NotificationList() {
  useSignalR(); // Enable SignalR real-time updates
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const { data, isLoading, error } = useUnreadNotifications(pageNumber, pageSize);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', pageNumber, pageSize] });
    },
  });

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / pageSize) : 1;

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPageNumber(nextPage);
  };

  return (
    <>
      <ToastContainer />
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
          {!isLoading && !error && data?.notifications.map((notification: any) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 8 }}>
            <button
              className={styles.markAsReadButton}
              onClick={() => handlePageChange(pageNumber - 1)}
              disabled={pageNumber === 1}
              style={{ minWidth: 32 }}
            >
              &lt;
            </button>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              Page {pageNumber} of {totalPages}
            </span>
            <button
              className={styles.markAsReadButton}
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber === totalPages}
              style={{ minWidth: 32 }}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </>
  );
}
