import { useState } from 'react';
import { listingsAPI } from '../services/api';
import { PROPERTY_TYPES, PROPERTY_SIZES, SECTORS } from '../utils/constants';

export default function CreateListingForm({ onClose, onCreated }: { onClose?: () => void; onCreated?: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    type: 'need',
    property_type: 'plot',
    size: '',
    location: '',
    budget: '',
    description: '',
    contact_note: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
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
      const res = await listingsAPI.create(payload);
      if (onCreated) onCreated(res.data);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal">
        <div className="modal-header">
          <h2>📋 Post New Listing</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="form-group">
            <label className="form-label">What are you posting?</label>
            <div className="auth-toggle">
              <button
                type="button"
                className={form.type === 'need' ? 'active' : ''}
                onClick={() => setForm({ ...form, type: 'need' })}
              >
                🔍 I Need
              </button>
              <button
                type="button"
                className={form.type === 'available' ? 'active' : ''}
                onClick={() => setForm({ ...form, type: 'available' })}
              >
                ✅ I Have
              </button>
            </div>
          </div>

          {/* Property Type */}
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select
              className="form-select"
              name="property_type"
              value={form.property_type}
              onChange={handleChange}
              required
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            {/* Size */}
            <div className="form-group">
              <label className="form-label">Size</label>
              <select
                className="form-select"
                name="size"
                value={form.size}
                onChange={handleChange}
                required
              >
                <option value="">Select Size</option>
                {PROPERTY_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location / Sector</label>
              <select
                className="form-select"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {SECTORS.map((sector) => (
                  <option key={sector.value} value={sector.value}>
                    {sector.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="form-group">
            <label className="form-label">Budget (PKR) — Optional</label>
            <input
              className="form-input"
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 5000000"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Any extra details — corner plot, park facing, etc."
              rows={3}
            />
          </div>

          {/* Contact Note */}
          <div className="form-group">
            <label className="form-label">Contact Note (Optional)</label>
            <input
              className="form-input"
              type="text"
              name="contact_note"
              value={form.contact_note}
              onChange={handleChange}
              placeholder="e.g. Call after 5pm"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Posting...' : form.type === 'need' ? '🔍 Post Need' : '✅ Post Available'}
          </button>
        </form>
      </div>
    </div>
  );
}
