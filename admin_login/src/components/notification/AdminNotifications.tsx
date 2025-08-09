import React, { useState, useEffect } from 'react';
import './AdminNotifications.css';

interface Notification {
  id: string;
  type: 'Order' | 'Billing' | 'Payment' | 'Support' | 'Feedback' | 'Lead';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('admin_notifications');
    if (stored) setNotifications(JSON.parse(stored));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Billing': return '🧾';
      case 'Lead': return '🔍';
      case 'Order': return '📦';
      case 'Support': return '🛠️';
      case 'Payment': return '💳';
      case 'Feedback': return '💬';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <h2>Notifications</h2>
        <p className="subtext">A list of all recent events and alerts.</p>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="empty">No notifications found.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-card">
                <div className="icon">{getIcon(notif.type)}</div>
                <div className="details">
                  <strong>{notif.type === 'Lead' ? 'New Lead' : notif.type + ' Sent'}</strong>
                  <p>{notif.message}</p>
                  <span className="timestamp">{notif.timestamp}</span>
                </div>
                {!notif.isRead && <span className="new-badge">New</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
