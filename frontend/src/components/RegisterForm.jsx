import React from 'react';
import { SECTORS } from '../utils/constants';

export default function RegisterForm({ form, handleChange, handleSubmit, loading }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          className="form-input"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Ahmed Khan"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          className="form-input"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 03001234567"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min 6 characters"
          required
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Your Sector</label>
        <select
          className="form-select"
          name="sector"
          value={form.sector}
          onChange={handleChange}
          required
        >
          <option value="">Select Sector</option>
          {SECTORS.map((sector) => (
            <option key={sector.value} value={sector.value}>
              {sector.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Agency / Office Name (Optional)</label>
        <input
          className="form-input"
          type="text"
          name="agency_name"
          value={form.agency_name}
          onChange={handleChange}
          placeholder="e.g. Khan Properties"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block btn-lg"
        disabled={loading}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? '...' : 'Create Account'}
      </button>
    </form>
  );
}
