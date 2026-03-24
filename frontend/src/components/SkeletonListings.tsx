import React from 'react';

export function SkeletonListingCard() {
  return (
    <div className="listing-card skeleton">
      <div className="listing-header">
        <div className="listing-tags" style={{ display: 'flex', gap: '8px' }}>
          <div className="skeleton-box" style={{ width: '60px', height: '24px', borderRadius: '12px' }} />
          <div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '12px' }} />
        </div>
        <div className="skeleton-box" style={{ width: '50px', height: '16px' }} />
      </div>

      <div className="listing-title skeleton-box" style={{ width: '80%', height: '24px', margin: '1rem 0' }} />

      <div className="listing-details" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="skeleton-box" style={{ width: '30%', height: '16px' }} />
        <div className="skeleton-box" style={{ width: '25%', height: '16px' }} />
        <div className="skeleton-box" style={{ width: '35%', height: '16px' }} />
      </div>

      <div className="listing-footer" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <div className="listing-dealer" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className="skeleton-box" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div>
            <div className="skeleton-box" style={{ width: '100px', height: '14px', marginBottom: '4px' }} />
            <div className="skeleton-box" style={{ width: '80px', height: '12px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkeletonListings({ count = 3 }: { count?: number }) {
  return (
    <div className="listings-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListingCard key={i} />
      ))}
    </div>
  );
}
