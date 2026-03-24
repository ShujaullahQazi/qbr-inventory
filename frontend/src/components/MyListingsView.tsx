import React from 'react';
import ListingCard from './ListingCard';
import { Listing } from '../types';

export default function MyListingsView({ myListings, setShowCreateForm, handleDeleteListing, onEdit }: { myListings: Listing[]; setShowCreateForm: (show: boolean) => void; handleDeleteListing: (id: string) => void; onEdit: (listing: Listing) => void }) {
  if (myListings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No Listings Yet</h3>
        <p>Post your first "Need" or "Available" listing to start matching with other dealers.</p>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)} style={{ marginTop: '1rem' }}>
          + Post Your First Listing
        </button>
      </div>
    );
  }

  return (
    <div className="listings-grid">
      {myListings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} isMyListing={true} onDelete={handleDeleteListing} onEdit={onEdit} />
      ))}
    </div>
  );
}
