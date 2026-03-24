import { useMetadata } from '../context/MetadataContext';
import { Listing, ListingSubmissionResponse } from '../types';
import { useCreateListing } from '../hooks/useCreateListing';

interface CreateListingFormProps {
  onClose?: () => void;
  onCreated?: (data: ListingSubmissionResponse) => void;
  /** When provided, form enters edit mode and pre-fills with this listing's data */
  editListing?: Listing | null;
}

export default function CreateListingForm({ onClose, onCreated, editListing }: CreateListingFormProps) {
  const { propertyTypes, propertySizes, sectors } = useMetadata();
  
  const {
    form,
    setForm,
    loading,
    error,
    isEditMode,
    handleChange,
    formatNumber,
    handleSubmit
  } = useCreateListing({ editListing, onCreated, onClose });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditMode ? '✏️ Edit Listing' : '📋 Post New Listing'}</h2>
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
              <option value="">Select Type</option>
              {propertyTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
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
                {propertySizes.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {sectors.map((sec) => (
                  <option key={sec.value} value={sec.value}>{sec.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="form-group">
            <label className="form-label">Budget (PKR)</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              name="budget"
              value={formatNumber(form.budget)}
              onChange={handleChange}
              placeholder="e.g. 5,000,000"
              required
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
            {loading
              ? (isEditMode ? 'Saving...' : 'Posting...')
              : isEditMode
                ? '💾 Save Changes'
                : form.type === 'need' ? '🔍 Post Need' : '✅ Post Available'
            }
          </button>
        </form>
      </div>
    </div>
  );
}
