import React from 'react';

function formatBudget(val) {
  if (!val) return '—';
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)} Lac`;
  return `PKR ${val.toLocaleString()}`;
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ListingCard({ listing, isMyListing, onDelete }) {
  return (
    <div className={`listing-card ${listing.type}`}>
      <div className="listing-header">
        <div className="listing-tags">
          <span className={`tag ${listing.type === 'need' ? 'tag-need' : 'tag-available'}`}>
            {listing.type === 'need' ? '🔍 NEED' : '✅ AVAILABLE'}
          </span>
          <span className="tag tag-property">{listing.property_type}</span>
        </div>
        <span className="listing-time">{timeAgo(listing.created_at)}</span>
      </div>

      <div className="listing-title">
        {listing.size} {listing.property_type} — {listing.location}
      </div>

      <div className="listing-details">
        <div className="listing-detail">
          <span className="icon">📍</span> {listing.location}
        </div>
        <div className="listing-detail">
          <span className="icon">📐</span> {listing.size}
        </div>
        {listing.budget && (
          <div className="listing-detail">
            <span className="icon">💰</span> {formatBudget(listing.budget)}
          </div>
        )}
      </div>

      {listing.description && (
        <p className="listing-desc">{listing.description}</p>
      )}

      <div className="listing-footer">
        {isMyListing ? (
          <>
            <span className={`tag ${listing.status === 'active' ? 'tag-available' : 'tag-need'}`}>
              {listing.status.toUpperCase()}
            </span>
            <div className="listing-actions">
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(listing._id)}>
                🗑 Delete
              </button>
            </div>
          </>
        ) : (
          <div className="listing-dealer">
            <div className="listing-dealer-avatar">
              {listing.dealer_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{listing.dealer_name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{listing.dealer_phone}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
