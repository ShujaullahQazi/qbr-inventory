import React from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from './ListingCard';
import { Notification as AppNotification } from '../types';
import { BellOffIcon, TargetIcon } from './Icons';

export default function NotificationsView({ notifications, handleMarkRead }: { notifications: AppNotification[]; handleMarkRead: (id: string) => void }) {
  const navigate = useNavigate();

  if (notifications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <BellOffIcon size={48} stroke="var(--text-muted)" />
        </div>
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
            navigate('/matches');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="notification-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <TargetIcon size={14} stroke="currentColor" />
          </div>
          <div className="notification-content">
            <div className="notification-message">{n.message}</div>
            <div className="notification-time">{timeAgo(n.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
