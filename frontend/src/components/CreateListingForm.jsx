import { useState } from 'react';
import { listingsAPI } from '../services/api';

export default function CreateListingForm({ onClose, onCreated }) {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
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
              <option value="plot">Plot</option>
              <option value="shop">Market Shop</option>
              <option value="house">House</option>
              <option value="flat">Flat / Apartment</option>
              <option value="commercial">Commercial</option>
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
                <option value="3 Marla">3 Marla</option>
                <option value="5 Marla">5 Marla</option>
                <option value="7 Marla">7 Marla</option>
                <option value="10 Marla">10 Marla</option>
                <option value="1 Kanal">1 Kanal</option>
                <option value="2 Kanal">2 Kanal</option>
                <option value="4 Kanal">4 Kanal</option>
                <option value="8 Kanal">8 Kanal</option>
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
                <option value="G-13">G-13</option>
                <option value="G-13/1">G-13/1</option>
                <option value="G-13/2">G-13/2</option>
                <option value="G-13/3">G-13/3</option>
                <option value="G-13/4">G-13/4</option>
                <option value="G-14">G-14</option>
                <option value="G-14/1">G-14/1</option>
                <option value="G-14/2">G-14/2</option>
                <option value="G-14/3">G-14/3</option>
                <option value="G-14/4">G-14/4</option>
                <option value="G-15">G-15</option>
                <option value="G-16">G-16</option>
                <option value="I-14">I-14</option>
                <option value="I-15">I-15</option>
                <option value="I-16">I-16</option>
                <option value="D-12">D-12</option>
                <option value="E-11">E-11</option>
                <option value="F-17">F-17</option>
                <option value="B-17">B-17</option>
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
