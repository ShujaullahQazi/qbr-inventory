import { useAuth } from '../context/AuthContext';
import { HourglassIcon } from '../components/Icons';

export default function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon" style={{ background: 'transparent', border: '1px solid var(--border-medium)', boxShadow: 'none' }}>
            <HourglassIcon size={28} stroke="var(--primary-light)" />
          </div>
          <h1>Account Under Review</h1>
          <p>Hi {user?.name || 'there'}, your account has been created successfully.</p>
        </div>

        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            An admin will review and approve your account shortly.
            Once approved, you'll have full access to the dealer network.
          </p>
          <button className="btn btn-ghost btn-block" onClick={logout}>
            Logout
          </button>
        </div>

        <p className="auth-footer">
          Connecting Islamabad's property dealers — one match at a time.
        </p>
      </div>
    </div>
  );
}
