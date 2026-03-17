import React from 'react';
import { timeAgo } from './ListingCard';

export default function NotificationsView({ notifications, handleMarkRead, setActiveTab }: { notifications: any[]; handleMarkRead: (id: string) => void; setActiveTab: (tab: string) => void }) {
  if (notifications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔕</div>
        <h3>No Notifications</h3>
        <p>You'll receive alerts here when your listings match with other dealers.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {notifications.map((n) => (
        <div
          key={n._id}
          className={`notification-item ${n.is_read ? '' : 'unread'}`}
          onClick={() => {
            if (!n.is_read) handleMarkRead(n._id);
            setActiveTab('matches');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="notification-icon">🎯</div>
          <div className="notification-content">
            <div className="notification-message">{n.message}</div>
            <div className="notification-time">{timeAgo(n.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
