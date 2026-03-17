import { matchesAPI } from '../services/api';

function formatBudget(val: any) {
  if (!val) return '—';
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)} Lac`;
  return `PKR ${val.toLocaleString()}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function MatchCard({ match, onRefresh }: { match: any; onRefresh?: () => void }) {
  const handleStatus = async (matchId: string, status: string) => {
    try {
      await matchesAPI.updateStatus(matchId, status);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update match status:', err);
    }
  };

  return (
    <div className="match-card">
      <div className="match-header">
        <span className="match-badge">🎯 Match</span>
        <span className="listing-time">{timeAgo(match.created_at)}</span>
      </div>

      <div className="match-sides">
        {/* Need Side */}
        <div className="match-side need">
          <div className="match-side-label">🔍 NEED</div>
          {match.need_listing ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                {match.need_listing.size} {match.need_listing.property_type}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                📍 {match.need_listing.location}
              </div>
              {match.need_listing.budget && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  💰 {formatBudget(match.need_listing.budget)}
                </div>
              )}
            </>
          ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listing removed</span>}

          {match.need_dealer && (
            <div className="match-contact">
              <span>👤</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{match.need_dealer.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {match.need_dealer.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Connector */}
        <div className="match-connector">
          <span>⚡</span>
        </div>

        {/* Available Side */}
        <div className="match-side available">
          <div className="match-side-label">✅ AVAILABLE</div>
          {match.available_listing ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                {match.available_listing.size} {match.available_listing.property_type}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                📍 {match.available_listing.location}
              </div>
              {match.available_listing.budget && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  💰 {formatBudget(match.available_listing.budget)}
                </div>
              )}
            </>
          ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listing removed</span>}

          {match.available_dealer && (
            <div className="match-contact">
              <span>👤</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{match.available_dealer.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {match.available_dealer.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {match.status === 'pending' && (
        <div className="match-actions">
          <button className="btn btn-primary btn-sm" onClick={() => handleStatus(match._id, 'accepted')}>
            ✓ Accept
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleStatus(match._id, 'rejected')}>
            ✕ Reject
          </button>
        </div>
      )}
      {match.status !== 'pending' && (
        <div className="match-actions">
          <span className={`tag ${match.status === 'accepted' ? 'tag-available' : 'tag-need'}`}>
            {match.status.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
