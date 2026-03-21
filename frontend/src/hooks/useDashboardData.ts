import { useState, useCallback, useEffect } from 'react';
import { listingsAPI, matchesAPI, notificationsAPI } from '../services/api';

export function useDashboardData() {
  const [listings, setListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({});

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchListings = useCallback(async (params: any = {}) => {
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

  const handleSearch = (params: any) => {
    setSearchParams(params);
    fetchListings(params);
  };

  const handlePageChange = (newPage: number) => {
    fetchListings({ ...searchParams, page: newPage });
  };

  const handleListingCreated = (data: any) => {
    fetchListings(searchParams);
    fetchMyListings();
    if (data.matches_found > 0) {
      fetchMatches();
      fetchNotifications();
    }
  };

  const handleDeleteListing = async (id: string) => {
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

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsAPI.markRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleListingUpdated = (data: any) => {
    fetchListings(searchParams);
    fetchMyListings();
    // If backend detected critical changes and found new matches, refresh those too
    if (data?.matches_found > 0 || data?.stale_removed > 0 || data?.critical_changed) {
      fetchMatches();
      fetchNotifications();
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
    handleListingUpdated,
    handleDeleteListing,
    handleMarkAllRead,
    handleMarkRead
  };
}
