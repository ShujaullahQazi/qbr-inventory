export interface User {
  _id: string;
  name: string;
  phone: string;
  agency_name: string;
  role: 'admin' | 'user';
  is_verified: boolean;
  sector?: string;
  created_at?: string;
}

export interface Listing {
  _id: string;
  user_id: string;
  type: 'need' | 'available';
  property_type: string;
  size: string;
  location: string;
  budget?: number | null;
  description?: string | null;
  contact_note?: string | null;
  status: 'active' | 'closed' | 'deleted';
  created_at: string;
  updated_at: string;
  dealer?: User; // populated by backend
  dealer_name?: string;
  dealer_phone?: string;
}

export interface Match {
  _id: string;
  need_id: string;
  available_id: string;
  score: number;
  status: string;
  created_at: string;
  need_listing?: Listing; // Populated details
  available_listing?: Listing;
  need_dealer?: { name: string; phone: string };
  available_dealer?: { name: string; phone: string };
}

export interface Notification {
  _id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'match' | 'system' | 'alert';
  is_read: boolean;
  related_entity_id?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  page: number;
  pages: number;
  total: number;
  limit: number;
  items: T[];
}

export interface SearchParams {
  type?: string;
  property_type?: string;
  size?: string;
  location?: string;
  budget_min?: string;
  budget_max?: string;
  page?: number;
}

export interface ListingSubmissionResponse {
  matches_found?: number;
  stale_removed?: number;
  critical_changed?: boolean;
}

