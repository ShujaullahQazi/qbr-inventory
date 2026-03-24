import { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';
import { Listing, ListingSubmissionResponse } from '../types';
import { useToast } from '../context/ToastContext';

interface UseCreateListingProps {
  editListing?: Listing | null;
  onCreated?: (data: ListingSubmissionResponse) => void;
  onClose?: () => void;
}

export function useCreateListing({ editListing, onCreated, onClose }: UseCreateListingProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    type: 'need',
    property_type: '',
    size: '',
    location: '',
    budget: '',
    description: '',
    contact_note: '',
  });

  const isEditMode = !!editListing;

  // Pre-fill form when editing
  useEffect(() => {
    if (editListing) {
      setForm({
        type: editListing.type || 'need',
        property_type: editListing.property_type || '',
        size: editListing.size || '',
        location: editListing.location || '',
        budget: editListing.budget != null ? String(editListing.budget) : '',
        description: editListing.description || '',
        contact_note: editListing.contact_note || '',
      });
    }
  }, [editListing]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    // Format budget input with commas, but only store numbers in state
    if (name === 'budget') {
      const numericValue = value.replace(/[^0-9]/g, '');
      value = numericValue;
    }
    setForm({ ...form, [name]: value });
    setError('');
  };

  // Helper to format the displayed value with commas
  const formatNumber = (val: string) => {
    if (!val) return '';
    const num = parseInt(val, 10);
    return isNaN(num) ? '' : num.toLocaleString('en-US');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : null,
        description: form.description || null,
        contact_note: form.contact_note || null,
      };

      let res;
      if (isEditMode && editListing) {
        res = await listingsAPI.update(editListing._id, payload);
      } else {
        res = await listingsAPI.create(payload);
        addToast('Listing posted successfully!', 'success');
      }

      if (onCreated) onCreated(res.data);
      if (onClose) onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const msg = error.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} listing`;
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    error,
    isEditMode,
    handleChange,
    formatNumber,
    handleSubmit
  };
}
