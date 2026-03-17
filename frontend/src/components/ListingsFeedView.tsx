import React from 'react';
import ListingCard from './ListingCard';

export default function ListingsFeedView({ 
  loading, 
  listings, 
  pagination, 
  handlePageChange 
}: { loading: boolean; listings: any[]; pagination: any; handlePageChange: (page: number) => void }) {
  if (loading) return <div className="spinner" />;
  
  if (listings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No Listings Found</h3>
        <p>No listings match your filters. Try adjusting your search or post a new listing to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="listings-grid">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} isMyListing={false} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            ← Prev
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={p === pagination.page ? 'active' : ''}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
