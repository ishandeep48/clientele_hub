import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminNotifications.css';

interface Notification {
  id: string;
  type: 'Order' | 'Billing' | 'Payment' | 'Support' | 'Feedback' | 'Lead';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [dismissedIds, setDismissedIds] = useState(new Set<string>());

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get( '/admin/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      await axios.post( '/admin/notifications/dismiss', {
        notificationId
      });
      setDismissedIds(prev => new Set([...prev, notificationId]));
    } catch (err) {
      console.error('Error dismissing notification:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.post( '/admin/notifications/clear');
      setDismissedIds(new Set(notifications.map(n => n.id)));
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const visibleNotifications = notifications.filter(n => !dismissedIds.has(n.id));

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
        <div className="notifications-header">
          <div>
            <h2>Notifications</h2>
            <p className="subtext">A list of all recent events and alerts.</p>
          </div>
          {visibleNotifications.length > 0 && (
            <button 
              className="clear-all-btn"
              onClick={clearAllNotifications}
            >
              Clear All
            </button>
          )}
        </div>
        
        {loading && <div className="loading">Loading notifications...</div>}
        {error && <div className="error">{error}</div>}
        
        <div className="notification-list">
          {!loading && !error && visibleNotifications.length === 0 ? (
            <p className="empty">No notifications found.</p>
          ) : (
            visibleNotifications.map((notif) => (
              <div key={notif.id} className="notification-card">
                <div className="icon">{getIcon(notif.type)}</div>
                <div className="details">
                  <strong>{notif.type === 'Lead' ? 'New Lead' : notif.type + ' Alert'}</strong>
                  <p>{notif.message}</p>
                  <span className="timestamp">{new Date(notif.timestamp).toLocaleString()}</span>
                </div>
                <div className="notification-actions">
                  {!notif.isRead && <span className="new-badge">New</span>}
                  <button 
                    className="dismiss-btn"
                    onClick={() => dismissNotification(notif.id)}
                    title="Dismiss notification"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
