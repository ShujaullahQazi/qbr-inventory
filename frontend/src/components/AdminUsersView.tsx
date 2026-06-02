import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { CheckIcon } from './Icons';

interface PendingUser {
  _id: string;
  name: string;
  phone: string;
  sector: string;
  agency_name?: string;
  created_at: string;
}

export default function AdminUsersView() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getPending();
      setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      await adminAPI.approve(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Failed to approve user:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      await adminAPI.reject(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Failed to reject user:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="spinner" />;
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <CheckIcon size={48} stroke="var(--accent)" />
        </div>
        <h3>No Pending Users</h3>
        <p>All users have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="admin-users-list">
      {users.map((u) => (
        <div key={u._id} className="admin-user-card glass-card">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="admin-user-name">{u.name}</div>
              <div className="admin-user-meta">{u.phone} · {u.sector}</div>
              {u.agency_name && (
                <div className="admin-user-meta">{u.agency_name}</div>
              )}
            </div>
          </div>
          <div className="admin-user-actions">
            <button
              className="btn btn-sm btn-primary"
              disabled={actionLoading === u._id}
              onClick={() => handleApprove(u._id)}
            >
              {actionLoading === u._id ? '...' : 'Approve'}
            </button>
            <button
              className="btn btn-sm btn-danger"
              disabled={actionLoading === u._id}
              onClick={() => handleReject(u._id)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
