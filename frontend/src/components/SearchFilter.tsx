import { useState } from 'react';
import { useMetadata } from '../context/MetadataContext';

interface SearchParams {
  type?: string;
  property_type?: string;
  size?: string;
  location?: string;
  budget_min?: string;
  budget_max?: string;
}

interface SearchFilterProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
  };

  const handleSearch = () => {
    // Strip empty values before sending
    const params: SearchParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key as keyof SearchParams] = value;
    });
    onSearch(params);
  };

  const handleReset = () => {
    const empty = { type: '', property_type: '', size: '', location: '', budget_min: '', budget_max: '' };
    setFilters(empty);
    onSearch({});
  };

  return (
    <div className="search-bar">
      <div className="form-group">
        <label className="form-label">Type</label>
        <select className="form-select" name="type" value={filters.type} onChange={handleChange}>
          <option value="">All</option>
          <option value="need">Needs</option>
          <option value="available">Available</option>
        </select>
      </div>

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

      <div className="form-group">
        <label className="form-label">Sector</label>
        <select className="form-select" name="location" value={filters.location} onChange={handleChange}>
          <option value="">All Sectors</option>
          {sectors.map((sec) => (
            <option key={sec.value} value={sec.value}>{sec.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Min Budget</label>
        <input
          className="form-input"
          type="number"
          name="budget_min"
          value={filters.budget_min}
          onChange={handleChange}
          placeholder="PKR"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Max Budget</label>
        <input
          className="form-input"
          type="number"
          name="budget_max"
          value={filters.budget_max}
          onChange={handleChange}
          placeholder="PKR"
        />
      </div>

      <div className="search-bar-actions">
        <button className="btn btn-primary btn-sm" onClick={handleSearch} disabled={loading}>
          🔍 Search
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleReset}>
          ↻ Reset
        </button>
      </div>
    </div>
  );
}
