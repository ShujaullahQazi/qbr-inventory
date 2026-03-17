import { useState } from 'react';

export default function SearchFilter({ onSearch, loading }: { onSearch: (params: any) => void; loading: boolean; }) {
  const [filters, setFilters] = useState({
    type: '',
    property_type: '',
    size: '',
    location: '',
    budget_min: '',
    budget_max: '',
  });

  const handleChange = (e: any) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
  };

  const handleSearch = () => {
    // Clean up empty values
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
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
          <option value="plot">Plot</option>
          <option value="shop">Shop</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Size</label>
        <select className="form-select" name="size" value={filters.size} onChange={handleChange}>
          <option value="">Any Size</option>
          <option value="3 Marla">3 Marla</option>
          <option value="5 Marla">5 Marla</option>
          <option value="7 Marla">7 Marla</option>
          <option value="10 Marla">10 Marla</option>
          <option value="1 Kanal">1 Kanal</option>
          <option value="2 Kanal">2 Kanal</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Sector</label>
        <select className="form-select" name="location" value={filters.location} onChange={handleChange}>
          <option value="">All Sectors</option>
          <option value="G-13">G-13</option>
          <option value="G-14">G-14</option>
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

      <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end', paddingBottom: '2px' }}>
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
