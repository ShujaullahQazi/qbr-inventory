import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ myListingsCount, matchesCount, unreadCount, user, logout }: { myListingsCount: number; matchesCount: number; unreadCount: number; user: any; logout: () => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <NavLink to="/feed"          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📋</span> All Listings
        </NavLink>
        <NavLink to="/my"            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📌</span> My Posts
          {myListingsCount > 0 && <span className="nav-badge" style={{ background: 'var(--info)' }}>{myListingsCount}</span>}
        </NavLink>
        <NavLink to="/matches"       className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🎯</span> Matches
          {matchesCount > 0 && <span className="nav-badge" style={{ background: 'var(--success)' }}>{matchesCount}</span>}
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🔔</span> Notifications
          {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
        </NavLink>
      </nav>

      <div className="sidebar-user" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="sidebar-user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="sidebar-user-info">
          <div className="name">{user?.name || 'Dealer'}</div>
          <div className="sector">{user?.sector || ''}</div>
        </div>
        <div className="sidebar-user-caret">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header mobile-only">
              <div className="name">{user?.name || 'Dealer'}</div>
              <div className="sector">{user?.sector || ''}</div>
            </div>
            <button className="profile-dropdown-item" onClick={(e) => { e.stopPropagation(); /* Future Profile Target */ }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Profile Settings
            </button>
            <div className="profile-dropdown-divider"></div>
            <button className="profile-dropdown-item danger" onClick={(e) => { e.stopPropagation(); logout(); }} title="Logout">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
