import { useState, useCallback, useEffect } from 'react';
import { listingsAPI, matchesAPI, notificationsAPI } from '../services/api';
import { Listing, Match, Notification, SearchParams, ListingSubmissionResponse } from '../types';

export function useDashboardData() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchListings = useCallback(async (params: SearchParams = {}) => {
    setLoading(true);
    try {
      const res = await listingsAPI.getAll({ ...params, page: params.page || 1 });
      setListings(res.data.listings);
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total, limit: res.data.limit || 20 });
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

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    fetchListings(params);
  };

  const handlePageChange = (newPage: number) => {
    fetchListings({ ...searchParams, page: newPage });
  };

  const handleListingCreated = (data: ListingSubmissionResponse) => {
    fetchListings(searchParams);
    fetchMyListings();
    if (data.matches_found && data.matches_found > 0) {
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

  const handleListingUpdated = (data: ListingSubmissionResponse) => {
    fetchListings(searchParams);
    fetchMyListings();
    // If backend detected critical changes and found new matches, refresh those too
    if (data?.matches_found || data?.stale_removed || data?.critical_changed) {
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
