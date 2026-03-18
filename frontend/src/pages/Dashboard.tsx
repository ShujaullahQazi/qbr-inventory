import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SearchFilter from '../components/SearchFilter';
import CreateListingForm from '../components/CreateListingForm';
import MatchesView from '../components/MatchesView';
import Sidebar from '../components/Sidebar';
import ListingsFeedView from '../components/ListingsFeedView';
import MyListingsView from '../components/MyListingsView';
import NotificationsView from '../components/NotificationsView';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    handleDeleteListing,
    handleMarkAllRead,
    handleMarkRead
  } = useDashboardData();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myListingsCount={myListings.length}
        matchesCount={matches.length}
        unreadCount={unreadCount}
        user={user}
        logout={logout}
      />

      {/* Main */}
      <main className="main-content">
        {/* Tab Content */}
        {activeTab === 'feed' && (
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
        )}

        {activeTab === 'my' && (
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
            />
          </>
        )}

        {activeTab === 'matches' && (
          <>
            <div className="page-header">
              <div>
                <h1>Your Matches</h1>
                <p className="page-header-subtitle">Listings from other dealers that match your inventory needs</p>
              </div>
            </div>
            <MatchesView matches={matches} onRefresh={() => { fetchMatches(); fetchNotifications(); }} />
          </>
        )}

        {activeTab === 'notifications' && (
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
              setActiveTab={setActiveTab}
            />
          </>
        )}

        {/* Create Listing Modal */}
        {showCreateForm && (
          <CreateListingForm
            onClose={() => setShowCreateForm(false)}
            onCreated={handleListingCreated}
          />
        )}
      </main>
    </div>
  );
}
