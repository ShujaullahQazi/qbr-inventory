import React from 'react';
import { Listing } from '../types';
import { MapPinIcon, AreaIcon, CoinIcon, EditIcon, TrashIcon, CheckIcon, SearchIcon } from './Icons';

function formatBudget(val: number | null | undefined) {
  if (!val) return '—';
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)} Lac`;
  return `PKR ${val.toLocaleString()}`;
}

export function timeAgo(dateStr: string): string {
  if (!dateStr) return '—';
  
  try {
    // Normalize format (replace space with T for ISO format)
    let normalized = dateStr.trim().replace(' ', 'T');
    
    // If it doesn't contain a timezone offset or Z, treat it as UTC by appending 'Z'
    const hasTimezone = normalized.includes('Z') || /[+-]\d{2}:?\d{2}$/.test(normalized);
    if (!hasTimezone) {
      normalized += 'Z';
    }
    
    const parsedDate = new Date(normalized);
    if (isNaN(parsedDate.getTime())) {
      return '—';
    }

    const diff = Date.now() - parsedDate.getTime();
    const mins = Math.floor(diff / 60000);
    
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return '—';
  }
}

export default function ListingCard({ listing, isMyListing, onDelete, onEdit }: { listing: Listing; isMyListing: boolean; onDelete?: (id: string) => void; onEdit?: (listing: Listing) => void }) {
  return (
    <div className={`listing-card ${listing.type}`}>
      <div className="listing-header">
        <div className="listing-tags">
          <span className={`tag ${listing.type === 'need' ? 'tag-need' : 'tag-available'}`}>
            {listing.type === 'need' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <SearchIcon size={12} stroke="currentColor" /> NEED
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckIcon size={12} stroke="currentColor" /> AVAILABLE
              </span>
            )}
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
          <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><MapPinIcon size={14} /></span> {listing.location}
        </div>
        <div className="listing-detail">
          <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AreaIcon size={14} /></span> {listing.size}
        </div>
        {listing.budget && (
          <div className="listing-detail">
            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><CoinIcon size={14} /></span> {formatBudget(listing.budget)}
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
              <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(listing)}>
                <EditIcon size={12} style={{ marginRight: '4px' }} /> Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(listing._id)}>
                <TrashIcon size={12} style={{ marginRight: '4px' }} /> Delete
              </button>
            </div>
          </>
        ) : (
          <div className="listing-dealer">
            <div className="listing-dealer-avatar" style={{ background: 'transparent', border: '1px solid var(--border-medium)', boxShadow: 'none' }}>
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
