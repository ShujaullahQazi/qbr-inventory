import { useState, useCallback, useEffect } from 'react';
import { listingsAPI, matchesAPI, notificationsAPI } from '../services/api';

export function useDashboardData() {
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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

  const fetchMyListings = useCallback(async () => {
    try {
      const res = await listingsAPI.getMy();
      setMyListings(res.data.listings);
    } catch (err) {
      console.error('Failed to fetch my listings:', err);
    }
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await matchesAPI.getAll();
      setMatches(res.data.matches);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchListings();
    fetchMyListings();
    fetchMatches();
    fetchNotifications();
  }, [fetchListings, fetchMyListings, fetchMatches, fetchNotifications]);

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
    if (!window.confirm('Delete this listing?')) return;
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

  return {
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
  };
}
