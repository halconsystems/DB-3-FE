'use client';
import React, { useState } from 'react';
import styles from './NotificationList.module.css';

interface Notification {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 2, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 3, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 4, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 5, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 6, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 7, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
  { id: 8, title: 'Creek Club Tambola Night', description: 'Creek Club invites you to a lively Tambola evening for all members', timestamp: 'Today, 05:33 PM', isRead: false },
];

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [allRead, setAllRead] = useState(false);

  const handleMarkAllAsRead = () => {
    setAllRead(!allRead);
    setNotifications(notifications.map(n => ({ ...n, isRead: !allRead })));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.markAllLabel}>Mark all as read</span>
        <label className={styles.checkbox}>
          <input 
            type="checkbox" 
            checked={allRead} 
            onChange={handleMarkAllAsRead} 
          />
          <span className={styles.checkboxCustom}></span>
        </label>
      </div>

      <div className={styles.notificationsList}>
        {notifications.map((notification) => (
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
              <p className={styles.notificationDescription}>{notification.description}</p>
            </div>
            <span className={styles.timestamp}>{notification.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
