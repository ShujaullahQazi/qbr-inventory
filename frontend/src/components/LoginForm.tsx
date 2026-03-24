import React from 'react';

export default function LoginForm({ form, handleChange, handleSubmit, loading }: { form: Record<string, string>; handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; handleSubmit: (e: React.FormEvent) => void; loading: boolean; }) {
  return (
    <form onSubmit={handleSubmit}>
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

      <button
        type="submit"
        className="btn btn-primary btn-block btn-lg"
        disabled={loading}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? <><span className="btn-spinner" />Signing in…</> : 'Login'}
      </button>
    </form>
  );
}
