import { useState } from 'react';
import { useMetadata } from '../context/MetadataContext';
import { SearchParams } from '../types';
import { SearchIcon, RefreshIcon } from './Icons';

interface SearchFilterProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

const TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'need', label: 'Needs' },
  { value: 'available', label: 'Available' },
];

export default function SearchFilter({ onSearch, loading }: SearchFilterProps) {
  const { propertyTypes, propertySizes, sectors } = useMetadata();
  const [filters, setFilters] = useState({
    type: '',
    property_type: '',
    size: '',
    location: '',
    budget_min: '',
    budget_max: '',
  });

  const setType = (value: string) => {
    const updated = { ...filters, type: value };
    setFilters(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'budget_min' || name === 'budget_max') {
      value = value.replace(/[^0-9]/g, '');
    }
    setFilters({ ...filters, [name]: value });
  };

  const formatNumber = (val: string) => {
    if (!val) return '';
    const num = parseInt(val, 10);
    return isNaN(num) ? '' : num.toLocaleString('en-US');
  };

  const handleSearch = () => {
    const params: SearchParams = {
      type: filters.type || undefined,
      property_type: filters.property_type || undefined,
      size: filters.size || undefined,
      location: filters.location || undefined,
      budget_min: filters.budget_min || undefined,
      budget_max: filters.budget_max || undefined,
    };
    onSearch(params);
  };

  const handleReset = () => {
    const empty = { type: '', property_type: '', size: '', location: '', budget_min: '', budget_max: '' };
    setFilters(empty);
    onSearch({});
  };

  return (
    <div className="search-bar">
      {/* Type — toggle buttons */}
      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="filter-toggle">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-toggle-btn${filters.type === opt.value ? ' active' : ''}`}
              onClick={() => setType(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property + Size — same row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Property</label>
          <select className="form-select" name="property_type" value={filters.property_type} onChange={handleChange}>
            <option value="">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Size</label>
          <select className="form-select" name="size" value={filters.size} onChange={handleChange}>
            <option value="">Any Size</option>
            {propertySizes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sector — full width */}
      <div className="form-group">
        <label className="form-label">Sector</label>
        <select className="form-select" name="location" value={filters.location} onChange={handleChange}>
          <option value="">All Sectors</option>
          {sectors.map((sec) => (
            <option key={sec.value} value={sec.value}>{sec.label}</option>
          ))}
        </select>
      </div>

      {/* Budget — same row, no spinners */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Min Budget</label>
          <input
            className="form-input"
            type="text"
            inputMode="numeric"
            name="budget_min"
            value={formatNumber(filters.budget_min)}
            onChange={handleChange}
            placeholder="PKR"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Max Budget</label>
          <input
            className="form-input"
            type="text"
            inputMode="numeric"
            name="budget_max"
            value={formatNumber(filters.budget_max)}
            onChange={handleChange}
            placeholder="PKR"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="search-bar-actions">
        <button className="btn btn-primary btn-sm" onClick={handleSearch} disabled={loading}>
          <SearchIcon size={12} style={{ marginRight: '4px' }} /> Search
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleReset}>
          <RefreshIcon size={12} style={{ marginRight: '4px' }} /> Reset
        </button>
      </div>
    </div>
  );
}
