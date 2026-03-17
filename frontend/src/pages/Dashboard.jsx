import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { listingsAPI, matchesAPI, notificationsAPI } from '../services/api';
import SearchFilter from '../components/SearchFilter';
import CreateListingForm from '../components/CreateListingForm';
import MatchesView from '../components/MatchesView';

function formatBudget(val) {
  if (!val) return '—';
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)} Lac`;
  return `PKR ${val.toLocaleString()}`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Data
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  // Stats
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch listings
  const fetchListings = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await listingsAPI.getAll({ ...params, page: params.page || 1 });
      setListings(res.data.listings);
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch my listings
  const fetchMyListings = useCallback(async () => {
    try {
      const res = await listingsAPI.getMy();
      setMyListings(res.data.listings);
    } catch (err) {
      console.error('Failed to fetch my listings:', err);
    }
  }, []);

  // Fetch matches
  const fetchMatches = useCallback(async () => {
    try {
      const res = await matchesAPI.getAll();
      setMatches(res.data.matches);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchListings();
    fetchMyListings();
    fetchMatches();
    fetchNotifications();
  }, [fetchListings, fetchMyListings, fetchMatches, fetchNotifications]);

  // Auto-refresh notifications every 30s
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleSearch = (params) => {
    setSearchParams(params);
    fetchListings(params);
  };

  const handlePageChange = (newPage) => {
    fetchListings({ ...searchParams, page: newPage });
  };

  const handleListingCreated = (data) => {
    fetchListings(searchParams);
    fetchMyListings();
    if (data.matches_found > 0) {
      fetchMatches();
      fetchNotifications();
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await listingsAPI.delete(id);
      fetchMyListings();
      fetchListings(searchParams);
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🏘️</div>
          <div>
            <h2>QBR Inventory</h2>
            <span>Dealer Network</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
            <span className="nav-icon">📋</span> All Listings
          </button>
          <button className={`nav-link ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
            <span className="nav-icon">📌</span> My Posts
            {myListings.length > 0 && <span className="nav-badge" style={{ background: 'var(--info)' }}>{myListings.length}</span>}
          </button>
          <button className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`} onClick={() => setActiveTab('matches')}>
            <span className="nav-icon">🎯</span> Matches
            {matches.length > 0 && <span className="nav-badge" style={{ background: 'var(--success)' }}>{matches.length}</span>}
          </button>
          <button className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <span className="nav-icon">🔔</span> Notifications
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{user?.name || 'Dealer'}</div>
            <div className="sector">{user?.sector || ''}</div>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Logout">⏻</button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📋</div>
            <div>
              <div className="stat-value">{pagination.total}</div>
              <div className="stat-label">Total Listings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal">🎯</div>
            <div>
              <div className="stat-value">{matches.length}</div>
              <div className="stat-label">Your Matches</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">📌</div>
            <div>
              <div className="stat-value">{myListings.length}</div>
              <div className="stat-label">My Posts</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🔔</div>
            <div>
              <div className="stat-value">{unreadCount}</div>
              <div className="stat-label">New Alerts</div>
            </div>
          </div>
        </div>

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

            {loading ? (
              <div className="spinner" />
            ) : listings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No Listings Found</h3>
                <p>No listings match your filters. Try adjusting your search or post a new listing to get started.</p>
              </div>
            ) : (
              <>
                <div className="listings-grid">
                  {listings.map((listing) => (
                    <div key={listing._id} className={`listing-card ${listing.type}`}>
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
                        <div className="listing-dealer">
                          <div className="listing-dealer-avatar">
                            {listing.dealer_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{listing.dealer_name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{listing.dealer_phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
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
            )}
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

            {myListings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>No Listings Yet</h3>
                <p>Post your first "Need" or "Available" listing to start matching with other dealers.</p>
                <button className="btn btn-primary" onClick={() => setShowCreateForm(true)} style={{ marginTop: '1rem' }}>
                  + Post Your First Listing
                </button>
              </div>
            ) : (
              <div className="listings-grid">
                {myListings.map((listing) => (
                  <div key={listing._id} className={`listing-card ${listing.type}`}>
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
                      <span className={`tag ${listing.status === 'active' ? 'tag-available' : 'tag-need'}`}>
                        {listing.status.toUpperCase()}
                      </span>
                      <div className="listing-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteListing(listing._id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {notifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔕</div>
                <h3>No Notifications</h3>
                <p>You'll receive alerts here when your listings match with other dealers.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notification-item ${n.is_read ? '' : 'unread'}`}
                    onClick={() => !n.is_read && handleMarkRead(n._id)}
                  >
                    <div className="notification-icon">🎯</div>
                    <div className="notification-content">
                      <div className="notification-message">{n.message}</div>
                      <div className="notification-time">{timeAgo(n.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
