import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchFilter from '../components/SearchFilter';
import CreateListingForm from '../components/CreateListingForm';
import MatchesView from '../components/MatchesView';
import Sidebar from '../components/Sidebar';
import ListingsFeedView from '../components/ListingsFeedView';
import MyListingsView from '../components/MyListingsView';
import NotificationsView from '../components/NotificationsView';
import AdminUsersView from '../components/AdminUsersView';
import AdminSettingsView from '../components/AdminSettingsView';
import { useDashboardData } from '../hooks/useDashboardData';
import { useState } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  // Derive active tab from URL path (strip leading slash)
  const activeTab = location.pathname.replace('/', '') || 'feed';
  const setActiveTab = (tab: string) => navigate(`/${tab}`);

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

  const handleEdit = (listing: any) => {
    setEditingListing(listing);
    setShowCreateForm(false); // close create form if open
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingListing(null);
  };

  const handleFormSubmit = (data: unknown) => {
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
              onEdit={handleEdit}
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
            />
          </>
        )}

        {activeTab === 'users' && user?.role === 'admin' && (
          <>
            <div className="page-header">
              <div>
                <h1>Manage Users</h1>
                <p className="page-header-subtitle">Approve or reject pending dealer accounts</p>
              </div>
            </div>
            <AdminUsersView />
          </>
        )}

        {activeTab === 'settings' && user?.role === 'admin' && (
          <>
            <div className="page-header">
              <div>
                <h1>Settings</h1>
                <p className="page-header-subtitle">Manage property types, sizes, and sectors</p>
              </div>
            </div>
            <AdminSettingsView />
          </>
        )}

        {/* Create / Edit Listing Modal */}
        {(showCreateForm || editingListing) && (
          <CreateListingForm
            onClose={handleFormClose}
            onCreated={handleFormSubmit}
            editListing={editingListing}
          />
        )}
      </main>
    </div>
  );
}

