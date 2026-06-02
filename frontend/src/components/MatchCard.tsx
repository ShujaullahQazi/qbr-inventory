import { matchesAPI } from '../services/api';
import { Match } from '../types';
import { TargetIcon, SearchIcon, MapPinIcon, CoinIcon, UserIcon, PhoneIcon, BoltIcon, CheckIcon, CloseIcon } from './Icons';

function formatBudget(val: number | null | undefined) {
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

export default function MatchCard({ match, onRefresh }: { match: Match; onRefresh?: () => void }) {
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
        <span className="match-badge">
          <TargetIcon size={14} stroke="currentColor" style={{ marginRight: '4px' }} /> Match
        </span>
        <span className="listing-time">{timeAgo(match.created_at)}</span>
      </div>

      <div className="match-sides">
        {/* Need Side */}
        <div className="match-side need">
          <div className="match-side-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <SearchIcon size={12} stroke="currentColor" /> NEED
          </div>
          {match.need_listing ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                {match.need_listing.size} {match.need_listing.property_type}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPinIcon size={14} stroke="currentColor" /> {match.need_listing.location}
              </div>
              {match.need_listing.budget && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CoinIcon size={14} stroke="currentColor" /> {formatBudget(match.need_listing.budget)}
                </div>
              )}
            </>
          ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listing removed</span>}

          {match.need_dealer && (
            <div className="match-contact">
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                <UserIcon size={14} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{match.need_dealer.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <PhoneIcon size={12} /> {match.need_dealer.phone}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connector */}
        <div className="match-connector">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-accent)', color: 'var(--primary-light)', background: 'var(--bg-glass)' }}>
            <BoltIcon size={16} />
          </span>
        </div>

        {/* Available Side */}
        <div className="match-side available">
          <div className="match-side-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckIcon size={12} stroke="currentColor" /> AVAILABLE
          </div>
          {match.available_listing ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                {match.available_listing.size} {match.available_listing.property_type}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPinIcon size={14} stroke="currentColor" /> {match.available_listing.location}
              </div>
              {match.available_listing.budget && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CoinIcon size={14} stroke="currentColor" /> {formatBudget(match.available_listing.budget)}
                </div>
              )}
            </>
          ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listing removed</span>}

          {match.available_dealer && (
            <div className="match-contact">
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                <UserIcon size={14} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{match.available_dealer.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <PhoneIcon size={12} /> {match.available_dealer.phone}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {match.status === 'pending' && (
        <div className="match-actions">
          <button className="btn btn-primary btn-sm" onClick={() => handleStatus(match._id, 'accepted')}>
            <CheckIcon size={12} style={{ marginRight: '4px' }} /> Accept
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleStatus(match._id, 'rejected')}>
            <CloseIcon size={12} style={{ marginRight: '4px' }} /> Reject
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
