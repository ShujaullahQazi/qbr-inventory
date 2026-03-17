import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Auth() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    sector: '',
    agency_name: '',
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
      let res;
      if (mode === 'register') {
        res = await authAPI.register({
          name: form.name,
          phone: form.phone,
          password: form.password,
          sector: form.sector,
          agency_name: form.agency_name || null,
        });
      } else {
        res = await authAPI.login({
          phone: form.phone,
          password: form.password,
        });
      }
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon">🏘️</div>
          <h1>QBR Inventory</h1>
          <p>Property Dealer Network — Islamabad</p>
        </div>

        <div className="auth-card">
          <div className="auth-toggle">
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Login
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
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
            )}

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

            {mode === 'register' && (
              <>
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
                    <option value="Other">Other</option>
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
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? '...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Connecting Islamabad's property dealers — one match at a time.
        </p>
      </div>
    </div>
  );
}
