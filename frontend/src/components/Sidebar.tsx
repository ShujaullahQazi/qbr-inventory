import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, myListingsCount, matchesCount, unreadCount, user, logout }: { activeTab: string; setActiveTab: (tab: string) => void; myListingsCount: number; matchesCount: number; unreadCount: number; user: any; logout: () => void }) {
  return (
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
          {myListingsCount > 0 && <span className="nav-badge" style={{ background: 'var(--info)' }}>{myListingsCount}</span>}
        </button>
        <button className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`} onClick={() => setActiveTab('matches')}>
          <span className="nav-icon">🎯</span> Matches
          {matchesCount > 0 && <span className="nav-badge" style={{ background: 'var(--success)' }}>{matchesCount}</span>}
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
  );
}
