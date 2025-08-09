import React, { useEffect, useState } from 'react';
import './Notifications.css';

interface Notification {
  id: string;
  title: string;
  content: string;
  category: 'Orders' | 'Support' | 'Billing' | 'General';
  read: boolean;
  date: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Orders' | 'Support' | 'Billing'>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Static data seeded if not found
      const initialData: Notification[] = [
        {
          id: '1',
          title: 'Welcome to Clientele Hub',
          content: 'Your CRM setup is complete. Start managing your customers!',
          category: 'General',
          read: false,
          date: '2025-07-27',
        },
        {
          id: '2',
          title: 'First Order Received',
          content: 'You just received your first order from John Doe.',
          category: 'Orders',
          read: false,
          date: '2025-07-27',
        }
      ];
      localStorage.setItem('notifications', JSON.stringify(initialData));
      setNotifications(initialData);
    }
    setLoading(false);
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const addNotification = () => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title: 'Manual Test Notification',
      content: 'This is a new notification added manually.',
      category: 'Support',
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const filtered =
    activeTab === 'All'
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      <div className="tabs">
        {['All', 'Orders', 'Support', 'Billing'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab}
          </button>
        ))}
        <button onClick={markAllAsRead} className="mark-read-btn">
          Mark All as Read
        </button>
        <button onClick={addNotification} className="add-btn">
          + Add Test Notification
        </button>
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : filtered.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="notifications-list">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.read ? 'read' : 'unread'}`}
            >
              <strong>{notif.title}</strong>
              <p>{notif.content}</p>
              <span className="date">{notif.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
