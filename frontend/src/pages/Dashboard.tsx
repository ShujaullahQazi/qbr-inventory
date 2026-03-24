import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchFilter from '../components/SearchFilter';
import Sidebar from '../components/Sidebar';
import ListingsFeedView from '../components/ListingsFeedView';
import MyListingsView from '../components/MyListingsView';
import NotificationsView from '../components/NotificationsView';
import { useDashboardData } from '../hooks/useDashboardData';
import { useState } from 'react';
import { Listing, ListingSubmissionResponse } from '../types';

// Heavy components — lazy-loaded per tab
const CreateListingForm = lazy(() => import('../components/CreateListingForm'));
const MatchesView = lazy(() => import('../components/MatchesView'));
const AdminUsersView = lazy(() => import('../components/AdminUsersView'));
const AdminSettingsView = lazy(() => import('../components/AdminSettingsView'));

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Use custom hook for data management
  const {
    listings,
    myListings,
    matches,
    notifications,
    pagination,
    loading,
    unreadCount,
    fetchMatches,
    fetchNotifications,
    handleSearch,
    handlePageChange,
    handleListingCreated,
    handleListingUpdated,
    handleDeleteListing,
    handleMarkAllRead,
    handleMarkRead
  } = useDashboardData();

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setShowCreateForm(false); // close create form if open
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingListing(null);
  };

  const handleFormSubmit = (data: ListingSubmissionResponse) => {
    if (editingListing) {
      handleListingUpdated(data);
    } else {
      handleListingCreated(data);
    }
    handleFormClose();
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        myListingsCount={myListings.length}
        matchesCount={matches.length}
        unreadCount={unreadCount}
        user={user}
        logout={logout}
      />

      {/* Main */}
      <main className="main-content">
        {/* Nested Routes for Tab Content */}
        <Routes>
          <Route path="/" element={<Navigate to="feed" replace />} />
          
          <Route path="feed" element={
            <>
              <div className="page-header">
                <div>
                  <h1>All Listings</h1>
                  <p className="page-header-subtitle">Browse and search properties from all dealers in your network</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                  + New Listing
                </button>
              </div>

              <SearchFilter onSearch={handleSearch} loading={loading} />
              <ListingsFeedView 
                loading={loading}
                listings={listings}
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </>
          } />

          <Route path="my" element={
            <>
              <div className="page-header">
                <div>
                  <h1>My Posts</h1>
                  <p className="page-header-subtitle">Manage your active needs and available inventory</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                  + New Listing
                </button>
              </div>
              <MyListingsView 
                myListings={myListings}
                setShowCreateForm={setShowCreateForm}
                handleDeleteListing={handleDeleteListing}
                onEdit={handleEdit}
              />
            </>
          } />

          <Route path="matches" element={
            <>
              <div className="page-header">
                <div>
                  <h1>Your Matches</h1>
                  <p className="page-header-subtitle">Listings from other dealers that match your inventory needs</p>
                </div>
              </div>
              <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}>
                <MatchesView matches={matches} onRefresh={() => { fetchMatches(); fetchNotifications(); }} />
              </Suspense>
            </>
          } />

          <Route path="notifications" element={
            <>
              <div className="page-header">
                <div>
                  <h1>Notifications</h1>
                  <p className="page-header-subtitle">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                  <button className="btn btn-ghost" onClick={handleMarkAllRead}>
                    ✓ Mark All Read
                  </button>
                )}
              </div>
              <NotificationsView 
                notifications={notifications}
                handleMarkRead={handleMarkRead}
              />
            </>
          } />

          {user?.role === 'admin' && (
            <>
              <Route path="users" element={
                <>
                  <div className="page-header">
                    <div>
                      <h1>Manage Users</h1>
                      <p className="page-header-subtitle">Approve or reject pending dealer accounts</p>
                    </div>
                  </div>
                  <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}>
                    <AdminUsersView />
                  </Suspense>
                </>
              } />

              <Route path="settings" element={
                <>
                  <div className="page-header">
                    <div>
                      <h1>Settings</h1>
                      <p className="page-header-subtitle">Manage property types, sizes, and sectors</p>
                    </div>
                  </div>
                  <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}>
                    <AdminSettingsView />
                  </Suspense>
                </>
              } />
            </>
          )}

          <Route path="*" element={<Navigate to="feed" replace />} />
        </Routes>

        {/* Create / Edit Listing Modal */}
        {(showCreateForm || editingListing) && (
          <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}>
            <CreateListingForm
              onClose={handleFormClose}
              onCreated={handleFormSubmit}
              editListing={editingListing}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
}

